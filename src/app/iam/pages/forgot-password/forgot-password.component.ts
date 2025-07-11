import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  emailError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.emailError = null;
    this.generalError = null;
    this.successMessage = null;
    this.isLoading = true;

    // Validación de frontend
    if (!this.email) {
      this.emailError = 'El correo electrónico es obligatorio.';
      this.isLoading = false;
      return;
    }
    if (!this.isValidEmail(this.email)) {
      this.emailError = 'Formato de correo electrónico incorrecto.';
      this.isLoading = false;
      return;
    }

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {

          this.successMessage = response.message || null;



          setTimeout(() => {
            this.router.navigate(['/verify-code']);
          }, 2000);
        } else {
          this.generalError = response.message || 'No se pudo procesar la solicitud.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en la solicitud de reseteo de contraseña:', err);
        this.generalError = 'Error de conexión o del servidor. Intente más tarde.';
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
