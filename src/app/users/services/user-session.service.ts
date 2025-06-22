import { Injectable } from '@angular/core';
import { Account } from '../../iam/model/account.entity';
import { AuthService } from '../../iam/services/auth.service';

// Interfaz para máxima independencia
export interface IUserSessionService {
  getCurrentAccount(): Account | null;
  isLoggedIn(): boolean;
  logout(): void;
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
}

// Nota: Ahora la sesión puede acceder a los nuevos campos de preferences y availability a través del perfil de usuario. 