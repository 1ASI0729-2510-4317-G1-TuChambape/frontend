import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../services/worker.service';
import { UserSessionService } from '../../services/user-session.service';
import { Worker } from '../../model/worker.entity';
import { MatSnackBar } from '@angular/material/snack-bar';

export type Availability = {
  lunes?: string;
  martes?: string;
  miercoles?: string;
  jueves?: string;
  viernes?: string;
  sabado?: string;
  domingo?: string;
  [key: string]: string | undefined;
};

@Component({
  selector: 'app-worker-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-data.component.html',
  styleUrls: ['./worker-data.component.css']
})
export class WorkerDataComponent implements OnInit {
  workerProfile: Worker | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;
  generalError: string | null = null;
  daysOfWeek: string[] = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];

  constructor(
    private workerService: WorkerService,
    private userSessionService: UserSessionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWorkerProfile();
  }

  loadWorkerProfile(): void {
    this.isLoading = true;
    this.successMessage = null;
    this.generalError = null;
    const account = this.userSessionService.getCurrentAccount();
    if (!account) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    this.workerService.search({ email: account.email }).subscribe({
      next: (workers) => {
        if (workers.length > 0) {
          this.workerProfile = workers[0];
        } else {
          this.generalError = 'No se encontró el perfil de trabajador.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.generalError = 'Error al cargar el perfil de trabajador.';
        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (!this.workerProfile) return;
    this.isLoading = true;
    this.successMessage = null;
    this.generalError = null;
    this.workerService.update(this.workerProfile.id, this.workerProfile).subscribe({
      next: (updated) => {
        this.isLoading = false;
        if (updated) {
          this.successMessage = '¡Datos guardados con éxito!';
          this.snackBar.open('Datos actualizados correctamente', 'Cerrar', { duration: 3500, panelClass: 'snackbar-success' });
          setTimeout(() => this.successMessage = null, 3000);
        } else {
          this.generalError = 'No se pudo guardar el perfil.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.generalError = 'Error al guardar los datos.';
      }
    });
  }

  get skillsString(): string {
    return this.workerProfile?.skills?.join(', ') || '';
  }
  set skillsString(value: string) {
    if (this.workerProfile) {
      this.workerProfile.skills = value.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  get certificationsString(): string {
    return this.workerProfile?.certifications?.join(', ') || '';
  }
  set certificationsString(value: string) {
    if (this.workerProfile) {
      this.workerProfile.certifications = value.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  getAvailability(day: string): string {
    return this.workerProfile?.availability?.[day] || '';
  }
  setAvailability(day: string, value: string) {
    if (this.workerProfile && this.workerProfile.availability) {
      this.workerProfile.availability[day] = value;
    }
  }
} 