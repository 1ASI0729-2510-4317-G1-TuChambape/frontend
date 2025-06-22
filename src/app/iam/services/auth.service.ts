import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map as rxjsMap, switchMap, map } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Account } from '../model/account.entity';
import { AccountAssembler } from './account.assembler';
import { AccountCredentials, AccountResource } from './top-headlines.response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<Account> {

  // Propiedades para el flujo de reseteo de contraseña
  private emailForReset: string | null = null;
  private resetCode: string | null = null;
  private resetCodeExpires: number | null = null;
  private isCodeVerifiedForReset: boolean = false;

  // Propiedad para simular el usuario actualmente logueado
  private currentAccount: Account | null = null;

  constructor() {
    super();
    this.resourceEndpoint = environment.accountsResourceEndpointPath;
  }

  // --- Métodos de Autenticación Principal ---

  register(userData: AccountCredentials): Observable<Account | null> {
    return this.search({ email: userData.email }).pipe(
      switchMap(accounts => {
        if (accounts.length > 0) {
          return of(null);
        }
        const newAccount: AccountResource = {
          id: 0,
          name: userData.email.split('@')[0],
          email: userData.email,
          passwordHashed: userData.password,
          role: 'client',
          createdAt: new Date().toISOString()
        };
        return this.create(newAccount).pipe(
          map(account => AccountAssembler.toEntityFromResource(account))
        );
      })
    );
  }

  login(credentials: AccountCredentials): Observable<Account | null> {
    return this.search({ email: credentials.email }).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : null),
      map(account => {
        if (!account) {
          return null;
        }
        if (account.passwordHashed !== credentials.password) {
          return null;
        }
        this.setCurrentUser(AccountAssembler.toEntityFromResource(account));
        return AccountAssembler.toEntityFromResource(account);
      })
    );
  }

  // --- Métodos de Sesión (para el AuthGuard) ---

  private setCurrentUser(account: Account): void {
    this.currentAccount = account;
    console.log('AUTH_SERVICE: Usuario actual establecido:', this.currentAccount);
  }

  clearCurrentUser(): void {
    this.currentAccount = null;
    console.log('AUTH_SERVICE: Sesión de usuario cerrada.');
  }

  isLoggedIn(): boolean {
    return !!this.currentAccount; // Devuelve true si currentAccount tiene un valor (está logueado)
  }

  getCurrentAccount(): Account | null {
    return this.currentAccount;
  }

  // --- Métodos para Recuperación de Contraseña ---

  doesUserExist(email: string): boolean {
    // Este método ya no se usa directamente, se reemplaza por búsqueda en la API
    // Se recomienda usar this.search({ email }) donde sea necesario
    return false;
  }

  requestPasswordReset(email: string): Observable<{ success: boolean, message?: string }> {
    this.emailForReset = null;
    this.resetCode = null;
    this.resetCodeExpires = null;
    this.isCodeVerifiedForReset = false;

    return this.search({ email }).pipe(
      map(accounts => {
        if (accounts.length > 0) {
          this.emailForReset = email;
          this.resetCode = Math.floor(1000 + Math.random() * 9000).toString(); // Código de 4 dígitos
          this.resetCodeExpires = Date.now() + (10 * 60 * 1000); // Expira en 10 minutos
          console.log(`AUTH_SERVICE: Código de reseteo para ${this.emailForReset}: ${this.resetCode} (expira en ${new Date(this.resetCodeExpires).toLocaleTimeString()})`);
        }
        return { success: true, message: 'Si tu correo está registrado, recibirás un código de verificación.' };
      })
    );
  }

  getEmailForPasswordReset(): string | null {
    return this.emailForReset;
  }

  verifyResetCode(email: string, code: string): Observable<{ success: boolean, message?: string }> {
    this.isCodeVerifiedForReset = false;

    return of(null).pipe(
      delay(500),
      rxjsMap(() => {
        if (this.emailForReset !== email) {
          return { success: false, message: 'Error: La sesión de verificación no coincide. Intente de nuevo desde el paso de olvido de contraseña.' };
        }
        if (!this.resetCode || !this.resetCodeExpires) {
          return { success: false, message: 'No hay un código de reseteo activo. Por favor, solicite uno nuevo.' };
        }
        if (this.resetCodeExpires < Date.now()) {
          this.resetCode = null;
          this.resetCodeExpires = null;
          this.emailForReset = null;
          return { success: false, message: 'El código de verificación ha expirado. Por favor, solicite uno nuevo.' };
        }
        if (this.resetCode === code) {
          this.isCodeVerifiedForReset = true;
          return { success: true, message: 'Código verificado correctamente.' };
        } else {
          return { success: false, message: 'El código de verificación es incorrecto.' };
        }
      })
    );
  }

  canResetPassword(): boolean {
    return this.isCodeVerifiedForReset && !!this.emailForReset;
  }

  updatePassword(email: string, newPassword: string): Observable<{ success: boolean, message?: string }> {
    if (!this.isCodeVerifiedForReset || this.emailForReset !== email) {
      return of({ success: false, message: 'No se puede actualizar la contraseña. Proceso de verificación inválido o email no coincide.' });
    }
    return this.search({ email }).pipe(
      switchMap(accounts => {
        if (accounts.length === 0) {
          return of({ success: false, message: 'Usuario no encontrado para actualizar la contraseña.' });
        }
        const account = accounts[0];
        const updatedAccount = { ...account, passwordHashed: newPassword };
        return this.update(account.id, updatedAccount).pipe(
          map(() => {
            this.emailForReset = null;
            this.resetCode = null;
            this.resetCodeExpires = null;
            this.isCodeVerifiedForReset = false;
            return { success: true, message: '¡Tu contraseña ha sido actualizada con éxito!' };
          })
        );
      })
    );
  }
}
