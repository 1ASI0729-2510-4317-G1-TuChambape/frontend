import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private sessionCheckInterval = 5 * 60 * 1000; // 5 minutos
  private warningThreshold = 30; // 30 minutos antes de expirar

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.startSessionMonitoring();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startSessionMonitoring(): void {
    // Verificar la sesión cada 5 minutos
    interval(this.sessionCheckInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkAndRenewSession();
      });

    // Escuchar eventos de actividad del usuario para renovar la sesión
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.onUserActivity();
      }, { passive: true });
    });
  }

  private onUserActivity(): void {
    // Renovar la sesión si el usuario está activo y la sesión está por expirar
    if (this.authService.isLoggedIn()) {
      const timeRemaining = this.authService.getSessionTimeRemaining();
      
      if (timeRemaining <= this.warningThreshold && timeRemaining > 0) {
        this.authService.renewSession();
        console.log('SESSION_MANAGER: Sesión renovada por actividad del usuario');
      }
    }
  }

  private checkAndRenewSession(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    const timeRemaining = this.authService.getSessionTimeRemaining();
    
    if (timeRemaining <= 0) {
      // Sesión expirada, cerrar sesión
      console.log('SESSION_MANAGER: Sesión expirada, cerrando sesión');
      this.authService.clearCurrentUser();
      this.router.navigate(['/login']);
      return;
    }

    if (timeRemaining <= this.warningThreshold) {
      // Mostrar advertencia al usuario (opcional)
      console.log(`SESSION_MANAGER: Sesión expira en ${timeRemaining} minutos`);
      
      // Renovar automáticamente si hay menos de 10 minutos
      if (timeRemaining <= 10) {
        this.authService.renewSession();
        console.log('SESSION_MANAGER: Sesión renovada automáticamente');
      }
    }
  }

  // Método público para renovar manualmente la sesión
  renewSession(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.renewSession();
    }
  }

  // Método para obtener el tiempo restante de la sesión
  getSessionTimeRemaining(): number {
    return this.authService.getSessionTimeRemaining();
  }

  // Método para verificar si la sesión está por expirar
  isSessionExpiringSoon(): boolean {
    const timeRemaining = this.authService.getSessionTimeRemaining();
    return timeRemaining <= this.warningThreshold && timeRemaining > 0;
  }
} 