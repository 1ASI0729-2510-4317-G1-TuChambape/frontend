import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { UserSessionService } from '../../services/user-session.service';
import { UserProfileService } from '../../services/user-profile.service';

// Interfaz para los datos del perfil del usuario
interface UserProfile {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  gender: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  email: string;
  registrationDate: string;
}

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {

  userProfile: UserProfile = {
    firstName: '',
    lastName: '',
    documentType: 'DNI', // Valor por defecto
    documentNumber: '',
    birthDate: '',
    gender: 'Masculino', // Valor por defecto
    phone: '',
    country: 'Perú', // Valor por defecto
    city: 'Lima', // Valor por defecto
    address: '',
    email: '',
    registrationDate: '17-04-2022'
  };

  // Opciones para selects
  documentTypes: string[] = ['DNI', 'Pasaporte', 'Carné de Extranjería'];
  genders: string[] = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo'];
  countries: string[] = ['Perú', 'Argentina', 'Colombia', 'Chile', 'México']; // Ejemplo
  cities: { [country: string]: string[] } = { // Ciudades por país
    'Perú': ['Lima', 'Arequipa', 'Trujillo', 'Cusco'],
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario'],
    'Colombia': ['Bogotá', 'Medellín', 'Cali'],
    'Chile': ['Santiago', 'Valparaíso', 'Concepción'],
    'México': ['Ciudad de México', 'Guadalajara', 'Monterrey']
  };
  availableCities: string[] = [];


  isLoading: boolean = false;
  successMessage: string | null = null;
  generalError: string | null = null;

  constructor(
    private userSessionService: UserSessionService,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    // Inicializar ciudades disponibles basado en el país por defecto
    this.onCountryChange(this.userProfile.country);
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    this.userProfileService.getUserProfileByEmail(currentAccount.email).subscribe({
      next: (profile: any) => {
        if (profile) {
          this.userProfile = {
            ...this.userProfile,
            ...profile
          };
        }
        this.onCountryChange(this.userProfile.country); // Actualizar ciudades
        this.isLoading = false;
      },
      error: () => {
        this.generalError = 'No se pudo cargar el perfil.';
        this.isLoading = false;
      }
    });
  }

  onCountryChange(countryValue: string): void {
    this.availableCities = this.cities[countryValue] || [];
    if (!this.availableCities.includes(this.userProfile.city)) {

      this.userProfile.city = '';
    }
  }

  saveChanges(): void {
    this.isLoading = true;
    this.successMessage = null;
    this.generalError = null;


    if (!this.userProfile.firstName || !this.userProfile.lastName) {
      this.generalError = "Nombres y Apellidos son requeridos.";
      this.isLoading = false;
      return;
    }

    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    this.userProfileService.updateUserProfile(currentAccount.id, this.userProfile).subscribe({
      next: (updated) => {
        this.isLoading = false;
        if (updated) {
          this.successMessage = '¡Datos guardados con éxito!';
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
}
