import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountCredentials } from '../../services/top-headlines.response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: AccountCredentials = {
    email: '',
    password: ''
  };
  confirmPasswordValue: string = ''; // Propiedad separada para confirmPassword

  emailError: string | null = null;
  passwordError: string | null = null;
  confirmPasswordError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null; // Para mensajes de éxito

  isLoading: boolean = false; // Para mostrar un indicador de carga

  // INYECTA EL SERVICIO Y ROUTER EN EL CONSTRUCTOR
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
    this.generalError = null;
    this.successMessage = null;
    this.isLoading = true; // Inicia la carga

    let isValid = true;

    if (!this.registerData.email) {
      this.emailError = '¡Dato Obligatorio!';
      isValid = false;
    }
    if (!this.registerData.password) {
      this.passwordError = '¡Dato Obligatorio!';
      isValid = false;
    }
    if (!this.confirmPasswordValue) { // Usa la propiedad separada
      this.confirmPasswordError = '¡Dato Obligatorio!';
      isValid = false;
    }

    if (this.registerData.email && !this.isValidEmail(this.registerData.email)) {
      this.emailError = 'Formato de e-mail incorrecto.';
      isValid = false;
    }

    if (this.registerData.password && this.confirmPasswordValue && this.registerData.password !== this.confirmPasswordValue) {
      this.confirmPasswordError = 'Las contraseñas no coinciden.';
      this.passwordError = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    if (isValid) {
      // Prepara los datos para enviar al servicio (sin confirmPassword)
      const credentialsToRegister: AccountCredentials = {
        email: this.registerData.email,
        password: this.registerData.password
      };

      this.authService.register(credentialsToRegister).subscribe({
        next: (account) => {
          this.isLoading = false;
          if (account) {
            this.successMessage = '¡Registro completado con éxito!';
            this.registerData = { email: '', password: '' };
            this.confirmPasswordValue = '';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.generalError = 'El correo electrónico ya está registrado.';
          }
        },
        error: (err) => { // Manejo de errores si el Observable emitiera un error real
          this.isLoading = false; // Termina la carga
          console.error('Error en el servicio de registro:', err);
          this.generalError = 'Error de conexión o del servidor. Intente más tarde.';
        }
      });
    } else {
      this.isLoading = false; // Termina la carga si la validación del frontend falla
      console.log('Formulario de registro inválido (frontend).');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
