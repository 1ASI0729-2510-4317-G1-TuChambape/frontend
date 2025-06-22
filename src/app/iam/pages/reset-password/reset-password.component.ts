import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit { // Implementa OnInit
  newPassword: string = '';
  confirmNewPassword: string = '';

  // Para mostrar el email al que se le está cambiando la contraseña
  emailForReset: string | null = null;

  passwordError: string | null = null;
  confirmPasswordError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  canProceed: boolean = false; // Para verificar si el usuario llegó aquí legítimamente

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.emailForReset = this.authService.getEmailForPasswordReset();
    this.canProceed = this.authService.canResetPassword();

    if (!this.canProceed) {
      this.generalError = "Acceso inválido a esta página. Por favor, inicie el proceso de recuperación de contraseña nuevamente.";

    }
  }

  onSubmit() {
    this.passwordError = null;
    this.confirmPasswordError = null;
    this.generalError = null;
    this.successMessage = null;
    this.isLoading = true;

    if (!this.canProceed || !this.emailForReset) { // Doble chequeo
      this.generalError = "No se puede proceder con el reseteo. Intente el proceso de nuevo.";
      this.isLoading = false;
      return;
    }

    let isValid = true;

    if (!this.newPassword) {
      this.passwordError = 'La nueva contraseña es obligatoria.';
      isValid = false;
    }
    if (!this.confirmNewPassword) {
      this.confirmPasswordError = 'La confirmación de contraseña es obligatoria.';
      isValid = false;
    }

    if (this.newPassword && this.confirmNewPassword && this.newPassword !== this.confirmNewPassword) {
      this.confirmPasswordError = 'Las contraseñas no coinciden.';
      this.passwordError = 'Las contraseñas no coinciden.';
      isValid = false;
    }



    if (!isValid) {
      this.isLoading = false;
      return;
    }

    // Llamar al nuevo metodo en AuthService para actualizar la contraseña
    this.authService.updatePassword(this.emailForReset, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || '¡Contraseña actualizada con éxito!';
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirigir a login
          }, 2000);
        } else {
          this.generalError = response.message || 'No se pudo actualizar la contraseña.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al actualizar la contraseña:', err);
        this.generalError = 'Error de conexión o del servidor.';
      }
    });
  }
}
