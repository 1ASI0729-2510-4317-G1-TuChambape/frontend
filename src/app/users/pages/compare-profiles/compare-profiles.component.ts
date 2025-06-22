import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para los [(ngModel)] de los filtros
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../model/worker.entity';

// Interfaz para los detalles de un técnico en la vista de comparación
interface TechnicianForCompare {
  id: number;
  name: string;
  specialty: string;
  imageUrl: string;
  availability: {
    lunes?: string;
    martes?: string;
    miercoles?: string;
    jueves?: string;
    viernes?: string;
    sabado?: string;
    domingo?: string;
  };
  rating: number;
  reviews: number;
  certificationType: string;
  experienceYears: number;
}

@Component({
  selector: 'app-compare-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule para los filtros
  templateUrl: './compare-profiles.component.html',
  styleUrls: ['./compare-profiles.component.css']
})
export class CompareProfilesComponent implements OnInit {

  // Técnicos simulados para la comparación
  techniciansToCompare: Worker[] = [];
  allTechnicians: Worker[] = [];

  // Modelos para los filtros superiores
  filters = {
    onlyFavorites: false,
    availability: '', // Podría ser un día específico o 'cualquier'
    minRating: 0,
    certificationType: ''
  };

  // Opciones para los selectores de filtros
  availabilityOptions: string[] = ['Cualquier día', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  certificationTypes: string[] = ['Técnico certificado', 'Formación autodidacta', 'Institución Técnica', 'Ninguna'];

  constructor(private workerService: WorkerService) { }

  ngOnInit(): void {
    this.loadTechniciansForComparison();
  }

  loadTechniciansForComparison(): void {
    this.workerService.getAll().subscribe({
      next: (workers) => {
        this.allTechnicians = workers;
        this.applyFilters();
      },
      error: () => {
        this.allTechnicians = [];
        this.techniciansToCompare = [];
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allTechnicians];
    if (this.filters.minRating > 0) {
      filtered = filtered.filter(t => t.rating >= this.filters.minRating);
    }
    if (this.filters.certificationType) {
      filtered = filtered.filter(t => t.certifications?.includes(this.filters.certificationType));
    }
    // Filtros de disponibilidad y favoritos pueden implementarse según la lógica de tu app
    this.techniciansToCompare = filtered;
  }

  resetFilters(): void {
    this.filters = {
      onlyFavorites: false,
      availability: '',
      minRating: 0,
      certificationType: ''
    };
    this.applyFilters();
  }

  // Para generar estrellas en la plantilla
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
  getEmptyStars(rating: number): number[] {
    const flooredRating = Math.floor(rating);
    return Array(5 - flooredRating).fill(0);
  }

  // Para el gráfico de disponibilidad
  getAvailabilitySlots(availability: any): { day: string, available: boolean, period?: string }[] {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const displaySlots: { day: string, available: boolean, period?: string }[] = [];
    const keyMapping: { [key: string]: string } = {
      'Lunes': 'lunes', 'Martes': 'martes', 'Miércoles': 'miercoles',
      'Jueves': 'jueves', 'Viernes': 'viernes', 'Sábado': 'sabado', 'Domingo': 'domingo'
    };

    for (const day of days) {
      const key = keyMapping[day];
      if (availability && availability[key]) {
        displaySlots.push({ day: day.substring(0,1), available: true, period: availability[key] });
      } else {
        displaySlots.push({ day: day.substring(0,1), available: false });
      }
    }
    return displaySlots;
  }

  // Metodo para manejar el error de carga de imagen
  handleImageError(event: Event, technicianName: string): void {
    console.warn(`No se pudo cargar la imagen para ${technicianName}. Usando imagen por defecto.`);
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/img/default-tech.png';
    }
  }

  getAvailabilityDays(availability: any): string[] {
    if (Array.isArray(availability)) return availability;
    if (availability && typeof availability === 'object') return Object.keys(availability);
    return [];
  }
}
