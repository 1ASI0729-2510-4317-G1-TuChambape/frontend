import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionManagerService } from '../../services/session-manager.service';
import { AuthService } from '../../services/auth.service';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-session-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showWarning" class="session-warning">
      <div class="warning-content">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">
          Tu sesión expira en {{ timeRemaining }} minutos
        </span>
        <button class="renew-btn" (click)="renewSession()">
          Renovar sesión
        </button>
      </div>
    </div>
  `,
  styles: [`
    .session-warning {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    .warning-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .warning-icon {
      font-size: 16px;
    }

    .warning-text {
      font-size: 14px;
      color: #856404;
      font-weight: 500;
    }

    .renew-btn {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .renew-btn:hover {
      background-color: #0056b3;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class SessionIndicatorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showWarning = false;
  timeRemaining = 0;

  constructor(
    private sessionManager: SessionManagerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar el estado de la sesión cada minuto
    interval(60000) // 1 minuto
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkSessionStatus();
      });

    // Verificar inmediatamente al cargar
    this.checkSessionStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkSessionStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.showWarning = false;
      return;
    }

    const timeRemaining = this.sessionManager.getSessionTimeRemaining();
    const isExpiringSoon = this.sessionManager.isSessionExpiringSoon();

    if (isExpiringSoon && timeRemaining > 0) {
      this.timeRemaining = timeRemaining;
      this.showWarning = true;
    } else {
      this.showWarning = false;
    }
  }

  renewSession(): void {
    this.sessionManager.renewSession();
    this.showWarning = false;
    
    // Mostrar confirmación temporal
    setTimeout(() => {
      this.checkSessionStatus();
    }, 1000);
  }
} 