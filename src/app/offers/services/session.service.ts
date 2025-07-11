import { Injectable } from '@angular/core';
import { AuthService } from '../../iam/services/auth.service';
import { Account } from '../../iam/model/account.entity';

@Injectable({ providedIn: 'root' })
export class OffersSessionService {
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