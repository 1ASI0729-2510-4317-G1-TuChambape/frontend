import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit { // Implementa OnInit
  verificationCode: string = '';


  emailForVerification: string | null = null;
  codeError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.emailForVerification = this.authService.getEmailForPasswordReset();
    if (!this.emailForVerification) {
      // Si no hay un email guardado para el reseteo, algo fue mal.
      // Redirigir de vuelta o mostrar un error general.
      this.generalError = 'No se ha especificado un correo para la verificación. Por favor, intente el proceso de recuperación de nuevo.';

    }
  }

  onSubmit() {
    this.codeError = null;
    this.generalError = null;
    this.successMessage = null;
    this.isLoading = true;


    const codeToVerify = this.verificationCode; // Usando un solo input

    if (!codeToVerify || codeToVerify.length < 4) { // Asumiendo un código de al menos 4 dígitos
      this.codeError = 'El código de verificación es inválido o está incompleto.';
      this.isLoading = false;
      return;
    }

    if (!this.emailForVerification) {
      this.generalError = 'Error: No se pudo obtener el email para la verificación.';
      this.isLoading = false;
      return;
    }

    // Llamaremos a un nuevo metodo en AuthService
    this.authService.verifyResetCode(this.emailForVerification, codeToVerify).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Código verificado correctamente.';
          // El email y el token/código verificado podrían necesitar pasarse a ResetPasswordComponent.

          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 1500);
        } else {
          this.generalError = response.message || 'El código ingresado es incorrecto o ha expirado.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en la verificación del código:', err);
        this.generalError = 'Error de conexión o del servidor.';
      }
    });
  }

}
