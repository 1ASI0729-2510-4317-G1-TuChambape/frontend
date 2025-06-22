import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para los filtros
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../model/worker.entity';

@Component({
  selector: 'app-search-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-technicians.component.html',
  styleUrls: ['./search-technicians.component.css']
})
export class SearchTechniciansComponent implements OnInit {
  technicians: Worker[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm: string = '';

  filteredTechnicians: Worker[] = [];

  // Opciones para los filtros
  categories: string[] = ['Electricista', 'Gasfitero', 'Carpintero', 'Pintor', 'Estilista', 'Técnico en electrodomésticos', 'Albañil'];
  districts: string[] = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Lince'];
  availabilityOptions: { value: string, label: string }[] = [
    { value: 'immediate', label: 'Inmediata' },
    { value: 'next_days', label: 'Próximos días' },
    { value: 'specific_date', label: 'Fecha específica' }
  ];
  serviceTypeOptions: { value: string, label: string }[] = [
    { value: 'domicilio', label: 'A domicilio' },
    { value: 'local', label: 'En local' }
  ];
  certificationTypeOptions: { value: string, label: string }[] = [
    { value: 'tecnico', label: 'Técnico certificado' },
    { value: 'autodidacta', label: 'Formación autodidacta' },
    { value: 'institucion', label: 'Institución Técnica' }
  ];

  // Modelos para los valores de los filtros
  filters = {
    category: '', // String vacío significa "Todas" o "Cualquiera"
    district: '',
    availability: '',
    minRating: 0,    // 0 significa "Cualquiera"
    serviceType: '',
    certificationType: '',
    experienceYears: 0 // 0 significa "Cualquiera"
  };

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.isLoading = true;
    this.workerService.getAll().subscribe({
      next: (workers) => {
        this.technicians = workers;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de técnicos.';
        this.isLoading = false;
      }
    });
  }

  search(): void {
    this.isLoading = true;
    this.workerService.search({ name: this.searchTerm }).subscribe({
      next: (workers) => {
        this.technicians = workers;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo realizar la búsqueda.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result: Worker[] = [...this.technicians];

    // Filtrar por Categoría (usando skills o category si existe)
    if (this.filters.category) {
      result = result.filter(worker =>
        (worker.skills && worker.skills.some(skill => skill.toLowerCase() === this.filters.category.toLowerCase()))
      );
    }

    // Filtrar por Distrito (usando location)
    if (this.filters.district) {
      result = result.filter(worker => worker.location?.toLowerCase() === this.filters.district.toLowerCase());
    }

    // Filtrar por Disponibilidad (si existe en Worker, si no, omitir)
    if (this.filters.availability && (result.length > 0 && 'availability' in result[0])) {
      result = result.filter(worker => (worker as any).availability === this.filters.availability);
    }

    // Filtrar por Valoración Mínima
    if (this.filters.minRating > 0) {
      result = result.filter(worker => worker.rating !== undefined && worker.rating >= this.filters.minRating);
    }

    // Filtrar por Tipo de Servicio (si existe en Worker, si no, omitir)
    if (this.filters.serviceType && (result.length > 0 && 'serviceType' in result[0])) {
      result = result.filter(worker => (worker as any).serviceType === this.filters.serviceType);
    }

    // Filtrar por Tipo de Certificación (si existe en Worker, si no, omitir)
    if (this.filters.certificationType && (result.length > 0 && 'certificationType' in result[0])) {
      result = result.filter(worker => (worker as any).certificationType === this.filters.certificationType);
    }

    // Filtrar por Años de Experiencia (mayor o igual)
    if (this.filters.experienceYears > 0) {
      result = result.filter(worker => worker.experience !== undefined && worker.experience >= this.filters.experienceYears);
    }

    this.filteredTechnicians = result;
    console.log("Filtros aplicados:", this.filters, "Resultados:", this.filteredTechnicians.length);
  }

  reportProfile(worker: Worker): void {
    alert(`Reportar perfil de: ${worker.firstName} ${worker.lastName}`);
  }

  handleImageError(event: Event, workerName: string): void {
    console.warn(`No se pudo cargar la imagen para ${workerName}. Usando imagen por defecto.`);
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/img/default-tech.png';
    }
  }

  trackByWorkerId(index: number, worker: Worker): number {
    return worker.id;
  }
}
