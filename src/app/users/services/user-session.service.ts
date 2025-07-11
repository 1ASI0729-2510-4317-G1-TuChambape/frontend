import { Injectable } from '@angular/core';
import { Account } from '../../iam/model/account.entity';
import { AuthService } from '../../iam/services/auth.service';
// Interfaz para máxima independencia
export interface IUserSessionService {
  getCurrentAccount(): Account | null;
  isLoggedIn(): boolean;
  logout(): void;
  hasValidSession(): boolean;
  getCurrentToken(): string | null;
}

@Injectable({ providedIn: 'root' })
export class UserSessionService implements IUserSessionService {
  constructor(private authService: AuthService) {}

  getCurrentAccount(): Account | null {
    return this.authService.getCurrentAccount();
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('jobconnect_token') || null;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.clearCurrentUser();
  }

  hasValidSession(): boolean {
    return this.authService.hasValidSession();
  }
}