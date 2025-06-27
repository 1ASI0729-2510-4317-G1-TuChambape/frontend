import { Injectable } from '@angular/core';
import { Account } from '../../iam/model/account.entity';
import { AuthService } from '../../iam/services/auth.service';
import { User } from '../model/user.entity';

// Interfaz para máxima independencia
export interface IUserSessionService {
  getCurrentAccount(): Account | null;
  isLoggedIn(): boolean;
  logout(): void;
  hasValidSession(): boolean;
}

@Injectable({ providedIn: 'root' })
export class UserSessionService implements IUserSessionService {
  constructor(private authService: AuthService) {}

  getCurrentAccount(): Account | null {
    return this.authService.getCurrentAccount();
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