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
    this.authService.login(this.loginData).subscribe({
      next: (account: Account | null) => {
        this.isLoading = false;

        if (account) {
          this.successMessage = `¡Bienvenido, ${account.email}! Verificando perfil...`;
          console.log('Usuario autenticado:', account);

          // Verificar si el usuario tiene perfil de customer o worker
          this.checkUserProfile(account);
        } else {
          this.generalError = 'Correo electrónico o contraseña incorrectos.';
          this.passwordError = null;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el servicio de login:', err);
        this.generalError = 'Error de conexión o del servidor. Intente más tarde.';
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
                  // Tiene perfil completo, redirigir al dashboard
                  this.router.navigate(['/dashboard/inicio']);
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
    
    if (role === 'customer') {
      this.router.navigate(['/onboarding-customer']);
    } else if (role === 'worker') {
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
