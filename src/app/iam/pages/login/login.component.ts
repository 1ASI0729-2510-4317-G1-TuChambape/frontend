import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountCredentials } from '../../services/top-headlines.response';
import { Account } from '../../model/account.entity';
import { UserService } from '../../../users/services/user.service';
import { CustomerService } from '../../../users/services/customer.service';
import { WorkerService } from '../../../users/services/worker.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../../../users/model/user.entity';
import { Customer } from '../../../users/model/customer.entity';
import { Worker } from '../../../users/model/worker.entity';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Objeto para almacenar los datos del formulario de login
  loginData: Partial<AccountCredentials> = {
    email: '',
    password: ''
  };

  // Propiedades para los mensajes de error y éxito
  emailError: string | null = null;
  passwordError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null;

  isLoading: boolean = false; // Para mostrar un indicador de carga

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userService: UserService,
    private customerService: CustomerService,
    private workerService: WorkerService
  ) { }

  ngOnInit(): void {
    // Verificar si ya hay una sesión válida al cargar el componente
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    if (this.authService.isLoggedIn()) {
      console.log('LOGIN_COMPONENT: Usuario ya está logueado, verificando perfil...');
      const currentAccount = this.authService.getCurrentAccount();
      if (currentAccount) {
        this.checkUserProfile(currentAccount);
      }
    } else if (this.authService.hasValidSession()) {
      console.log('LOGIN_COMPONENT: Sesión válida encontrada en localStorage, restaurando...');
      // La sesión se restaurará automáticamente en el constructor del AuthService
      // Solo necesitamos verificar si el usuario está logueado después de la restauración
      setTimeout(() => {
        if (this.authService.isLoggedIn()) {
          const currentAccount = this.authService.getCurrentAccount();
          if (currentAccount) {
            this.checkUserProfile(currentAccount);
          }
        }
      }, 100);
    }
  }

  onSubmit() {
    // Resetear errores y mensajes previos
    this.emailError = null;
    this.passwordError = null;
    this.generalError = null;
    this.successMessage = null;
    this.isLoading = true;

    let isValidFrontend = true;

    // Validación de campos obligatorios
    if (!this.loginData.email) {
      this.emailError = '¡El correo es obligatorio!';
      isValidFrontend = false;
    }
    if (!this.loginData.password) {
      this.passwordError = '¡La contraseña es obligatoria!';
      isValidFrontend = false;
    }

    // Validación de formato de email
    if (this.loginData.email && !this.isValidEmail(this.loginData.email)) {
      this.emailError = 'Formato de e-mail incorrecto.';
      isValidFrontend = false;
    }

    if (!isValidFrontend) {
      this.isLoading = false;
      console.log('Formulario de login inválido (frontend).');
      return; // Detiene la ejecución si la validación frontend falla
    }

    // Si las validaciones del frontend pasan, llamar al servicio
    const loginPayload = {
      email: this.loginData.email!,
      password: this.loginData.password!
    };
    this.authService.signInReal(loginPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.token) {
          // Guardar token en localStorage
          localStorage.setItem('jobconnect_token', response.token);
          // Obtener los datos reales del usuario
          this.authService.getAccountMe().subscribe({
            next: (realAccount) => {
              this.authService["setCurrentUser"](realAccount);
              this.authService["saveSessionToLocalStorage"](realAccount);
              this.successMessage = `¡Bienvenido, ${realAccount.email}! Verificando perfil...`;
              this.checkUserProfile(realAccount);
            },
            error: (err) => {
              this.generalError = 'No se pudo obtener la información de la cuenta.';
            }
          });
        } else {
          this.generalError = 'Correo electrónico o contraseña incorrectos.';
          this.passwordError = null;
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.generalError = 'Correo electrónico o contraseña incorrectos.';
        } else if (err.status === 404) {
          this.generalError = 'Usuario no encontrado.';
        } else if (err.status === 0) {
          this.generalError = 'No se pudo conectar con el servidor. Intenta más tarde.';
        } else {
          this.generalError = 'Error de conexión o del servidor. Intente más tarde.';
        }
      }
    });
  }

  private checkUserProfile(account: Account) {
    // Buscar el usuario por accountId
    this.userService.search({ accountId: account.id }).pipe(
      switchMap((users: User[]) => {
        if (users.length === 0) {
          // No hay usuario, redirigir al onboarding según el rol
          return this.redirectToOnboarding(account.role);
        }

        const user = users[0];
        // Guardar el user en localStorage para restauración robusta
        localStorage.setItem('jobconnect_user', JSON.stringify(user));
        
        // Verificar si tiene customerId o workerId
        if (account.role === 'customer') {
          if (user.customerId) {
            // Tiene perfil de customer, verificar que existe
            return this.customerService.search({ id: user.customerId }).pipe(
              map((customers: Customer[]) => {
                if (customers.length > 0) {
                  // Tiene perfil completo, redirigir al dashboard
                  this.router.navigate(['/dashboard']);
                  return null;
                } else {
                  // No tiene perfil de customer, redirigir al onboarding
                  return this.redirectToOnboarding('customer');
                }
              })
            );
          } else {
            // No tiene customerId, redirigir al onboarding
            return this.redirectToOnboarding('customer');
          }
        } else if (account.role === 'worker') {
          if (user.workerId) {
            // Tiene perfil de worker, verificar que existe
            return this.workerService.search({ id: user.workerId }).pipe(
              map((workers: Worker[]) => {
                if (workers.length > 0) {
                  // Tiene perfil completo, redirigir al worker dashboard
                  this.router.navigate(['/worker-dashboard']);
                  return null;
                } else {
                  // No tiene perfil de worker, redirigir al onboarding
                  return this.redirectToOnboarding('worker');
                }
              })
            );
          } else {
            // No tiene workerId, redirigir al onboarding
            return this.redirectToOnboarding('worker');
          }
        } else {
          // Rol no reconocido, redirigir al login
          this.router.navigate(['/login']);
          return of(null);
        }
      })
    ).subscribe({
      error: (error: any) => {
        console.error('Error verificando perfil:', error);
        this.generalError = 'Error verificando perfil. Intente más tarde.';
      }
    });
  }

  private redirectToOnboarding(role: string) {
    this.successMessage = '¡Bienvenido! Completa tu perfil para continuar.';
    if (!role) {
      this.router.navigate(['/login']);
      return of(null);
    }
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'customer') {
      this.router.navigate(['/onboarding-customer']);
    } else if (normalizedRole === 'worker') {
      this.router.navigate(['/onboarding-worker']);
    } else {
      this.router.navigate(['/login']);
    }
    return of(null);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
