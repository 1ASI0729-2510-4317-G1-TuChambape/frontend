import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map as rxjsMap, switchMap, map } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Account } from '../model/account.entity';
import { AccountAssembler } from './account.assembler';
import { AccountCredentials, AccountResource } from './top-headlines.response';
import { environment } from '../../../environments/environment';
import { EventBusService } from '../../shared/services/event-bus.service';
import { AccountRegisteredEvent } from '../../shared/events/account-registered.event';

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

  // Claves para localStorage
  private readonly SESSION_KEY = 'jobconnect_session';
  private readonly SESSION_EXPIRY_KEY = 'jobconnect_session_expiry';

  constructor(private eventBus: EventBusService) {
    super();
    this.resourceEndpoint = environment.accountsResourceEndpointPath;
    // Intentar restaurar la sesión al inicializar el servicio
    this.restoreSession();
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
          name: userData.name,
          email: userData.email,
          passwordHashed: userData.password,
          role: userData.role,
          createdAt: new Date().toISOString()
        };
        return this.create(newAccount).pipe(
          map(account => {
            const entity = AccountAssembler.toEntityFromResource(account);
            this.eventBus.dispatch('AccountRegistered', {
              accountId: entity.id,
              role: entity.role
            } as AccountRegisteredEvent);
            return entity;
          })
        );
      })
    );
  }

  login(credentials: Partial<AccountCredentials>): Observable<Account | null> {
    return this.search({ email: credentials.email }).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : null),
      map(account => {
        if (!account) {
          return null;
        }
        if (account.passwordHashed !== credentials.password) {
          return null;
        }
        
        const entity = AccountAssembler.toEntityFromResource(account);
        this.setCurrentUser(entity);
        this.saveSessionToLocalStorage(entity);
        return entity;
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
    this.clearSessionFromLocalStorage();
    console.log('AUTH_SERVICE: Sesión de usuario cerrada.');
  }

  isLoggedIn(): boolean {
    return !!this.currentAccount; // Devuelve true si currentAccount tiene un valor (está logueado)
  }

  getCurrentAccount(): Account | null {
    return this.currentAccount;
  }

  // --- Métodos de localStorage ---

  private saveSessionToLocalStorage(account: Account): void {
    try {
      const sessionData = {
        account: account,
        timestamp: Date.now()
      };
      
      // Guardar la sesión por 24 horas
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
      
      console.log('AUTH_SERVICE: Sesión guardada en localStorage');
    } catch (error) {
      console.error('AUTH_SERVICE: Error guardando sesión en localStorage:', error);
    }
  }

  private restoreSession(): void {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      
      if (!sessionData || !expiryTime) {
        console.log('AUTH_SERVICE: No hay sesión guardada en localStorage');
        return;
      }
      
      const currentTime = Date.now();
      const sessionExpiry = parseInt(expiryTime);
      
      // Verificar si la sesión ha expirado
      if (currentTime > sessionExpiry) {
        console.log('AUTH_SERVICE: Sesión expirada, limpiando localStorage');
        this.clearSessionFromLocalStorage();
        return;
      }
      
      const parsedSession = JSON.parse(sessionData);
      const account = parsedSession.account as Account;
      
      if (account && account.id && account.email) {
        // Validar si el usuario tiene perfil completo (customerId o workerId)
        // Si no, limpiar sesión para evitar loops de onboarding
        const userData = localStorage.getItem('jobconnect_user');
        if (userData) {
          const user = JSON.parse(userData);
          if ((account.role === 'customer' && !user.customerId) || (account.role === 'worker' && !user.workerId)) {
            console.log('AUTH_SERVICE: Usuario sin perfil completo, limpiando sesión.');
            this.clearSessionFromLocalStorage();
            return;
          }
        }
        this.currentAccount = account;
        console.log('AUTH_SERVICE: Sesión restaurada desde localStorage:', account.email);
      } else {
        console.log('AUTH_SERVICE: Datos de sesión inválidos, limpiando localStorage');
        this.clearSessionFromLocalStorage();
      }
    } catch (error) {
      console.error('AUTH_SERVICE: Error restaurando sesión desde localStorage:', error);
      this.clearSessionFromLocalStorage();
    }
  }

  private clearSessionFromLocalStorage(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_EXPIRY_KEY);
      console.log('AUTH_SERVICE: Sesión eliminada de localStorage');
    } catch (error) {
      console.error('AUTH_SERVICE: Error limpiando sesión de localStorage:', error);
    }
  }

  // Método público para verificar si hay una sesión válida en localStorage
  hasValidSession(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      
      if (!sessionData || !expiryTime) {
        return false;
      }
      
      const currentTime = Date.now();
      const sessionExpiry = parseInt(expiryTime);
      
      return currentTime <= sessionExpiry;
    } catch (error) {
      console.error('AUTH_SERVICE: Error verificando sesión válida:', error);
      return false;
    }
  }

  // Método para renovar la sesión (extender el tiempo de expiración)
  renewSession(): void {
    if (this.currentAccount) {
      this.saveSessionToLocalStorage(this.currentAccount);
      console.log('AUTH_SERVICE: Sesión renovada');
    }
  }

  // Método para obtener el tiempo restante de la sesión en minutos
  getSessionTimeRemaining(): number {
    try {
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      if (!expiryTime) {
        return 0;
      }
      
      const currentTime = Date.now();
      const sessionExpiry = parseInt(expiryTime);
      const timeRemaining = sessionExpiry - currentTime;
      
      return Math.max(0, Math.floor(timeRemaining / (1000 * 60))); // Convertir a minutos
    } catch (error) {
      console.error('AUTH_SERVICE: Error obteniendo tiempo restante de sesión:', error);
      return 0;
    }
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
