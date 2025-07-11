import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    // Validar perfil completo
    const account = this.auth.getCurrentAccount();
    const userData = localStorage.getItem('jobconnect_user');
    if (account && userData) {
      const user = JSON.parse(userData);
      if ((account.role === 'customer' && !user.customerId) || (account.role === 'worker' && !user.workerId)) {
        // Limpio sesión y redirijo a login
        localStorage.removeItem('jobconnect_user');
        this.auth.clearCurrentUser();
        this.router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }
}