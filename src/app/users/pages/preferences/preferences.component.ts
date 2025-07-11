import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { UserSessionService } from '../../services/user-session.service';
import { PreferencesService } from '../../services/preferences.service';
import { Preferences } from '../../model/preferences.entity';
import { PreferredAvailability } from '../../services/top-headlines.response';
import { UserService } from '../../services/user.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer.entity';

// Angular Material Imports para la sección de presupuesto
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  preferences: Preferences | null = null;
  customer: Customer | null = null;

  categories: string[] = ['Electricista', 'Gasfitero', 'Carpintero', 'Pintor', 'Estilista', 'Técnico en electrodomésticos', 'Albañil'];
  locations: string[] = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Lince', 'Centro de Lima', 'Callao'];
  serviceTypes: string[] = ['A domicilio', 'En local', 'Ambos'];
  experienceRanges: string[] = ['0-2 años', '3-5 años', '6-10 años', '10+ años'];
  availabilityOptions: PreferredAvailability[] = [
    PreferredAvailability.Immediate,
    PreferredAvailability.Mornings,
    PreferredAvailability.Afternoons,
    PreferredAvailability.Nights
  ];
  ratingOptions: { value: number, label: string }[] = [
    { value: 0, label: 'Cualquiera' },
    { value: 3, label: '3 ★ o más' },
    { value: 4, label: '4 ★ o más' },
    { value: 4.5, label: '4.5 ★ o más' },
    { value: 5, label: '5 ★' }
  ];
  budgetRanges: string[] = ['Cualquiera', 'Menos de S/50', 'S/50 - S/100', 'S/100 - S/200', 'S/200 - S/500', 'Más de S/500'];
  languageOptions: string[] = ['spanish', 'english', 'portuguese', 'other'];

  isLoading: boolean = false;
  successMessage: string | null = null;
  generalError: string | null = null; // Si hubiera errores de guardado

  // Propiedades para controlar los dropdowns
  showExperienceDropdown: boolean = false;
  showLanguageDropdown: boolean = false;

  // Propiedades para el slider de presupuesto
  budgetMin: number = 0;
  budgetMax: number = 1000;
  budgetSliderMin: number = 0;
  budgetSliderMax: number = 1000;

  constructor(
    private userSessionService: UserSessionService,
    private userService: UserService,
    private customerService: CustomerService,
    private preferencesService: PreferencesService
  ) { }

  ngOnInit(): void {
    this.loadCustomerAndPreferences();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multiselect-dropdown')) {
      this.showExperienceDropdown = false;
      this.showLanguageDropdown = false;
    }
  }

  loadCustomerAndPreferences(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    // 1. Buscar el usuario por accountId
    this.userService.search({ accountId: currentAccount.id }).subscribe({
      next: (users) => {
        const user = users.length > 0 ? users[0] : null;
        if (!user || !user.customerId) {
          this.generalError = 'No se encontró el perfil de cliente.';
          this.isLoading = false;
          return;
        }
        // 2. Buscar el customer por customerId
        this.customerService.getById(user.customerId).subscribe({
          next: (customer) => {
            this.customer = customer;
            // 3. Buscar las preferencias por customerId
            this.preferencesService.search({ customerId: user.customerId }).subscribe({
              next: (prefs) => {
                this.preferences = prefs.length > 0 ? prefs[0] : null;
                // Inicializar arrays si no existen
                if (this.preferences) {
                  if (!this.preferences.preferredExperienceYears) {
                    this.preferences.preferredExperienceYears = [];
                  }
                  if (!this.preferences.languages) {
                    this.preferences.languages = [];
                  }
                  // Inicializar valores del presupuesto
                  this.initializeBudgetValues();
                }
                this.isLoading = false;
              },
              error: () => {
                this.generalError = 'No se pudieron cargar las preferencias.';
                this.isLoading = false;
              }
            });
          },
          error: () => {
            this.generalError = 'No se pudo cargar la información del cliente.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.generalError = 'No se pudo cargar el usuario.';
        this.isLoading = false;
      }
    });
  }

  savePreferences(): void {
    if (!this.preferences) return;
    this.isLoading = true;
    this.successMessage = null;
    this.generalError = null;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    // Guardar usando customerId (como string)
    this.preferencesService.update(this.preferences.id, this.preferences).subscribe({
      next: (updated) => {
        this.isLoading = false;
        if (updated) {
          this.successMessage = '¡Preferencias guardadas con éxito!';
          this.generalError = null
        } else {
          this.generalError = 'No se pudieron guardar las preferencias.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.generalError = 'Error al guardar las preferencias.';
      }
    });
  }

  onExperienceYearsChange(range: string, event: Event): void {
    if (!this.preferences) return;
    const checked = (event.target as HTMLInputElement).checked;
    
    if (!this.preferences.preferredExperienceYears) {
      this.preferences.preferredExperienceYears = [];
    }
    
    if (checked) {
      if (!this.preferences.preferredExperienceYears.includes(range)) {
        this.preferences.preferredExperienceYears.push(range);
      }
    } else {
      this.preferences.preferredExperienceYears = this.preferences.preferredExperienceYears.filter(r => r !== range);
    }
  }

  isExperienceYearSelected(range: string): boolean {
    return this.preferences?.preferredExperienceYears?.includes(range) || false;
  }
  onLanguageChange(lang: string, event: Event): void {
    if (!this.preferences) return;
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.preferences.languages) this.preferences.languages = [];
    if (checked) {
      if (!this.preferences.languages.includes(lang)) {
        this.preferences.languages.push(lang);
      }
    } else {
      this.preferences.languages = this.preferences.languages.filter(l => l !== lang);
    }
  }

  isLanguageSelected(lang: string): boolean {
    return this.preferences?.languages?.includes(lang) || false;
  }

  // Métodos para controlar los dropdowns
  toggleExperienceDropdown(): void {
    this.showExperienceDropdown = !this.showExperienceDropdown;
    this.showLanguageDropdown = false; // Cerrar el otro dropdown
  }

  toggleLanguageDropdown(): void {
    this.showLanguageDropdown = !this.showLanguageDropdown;
    this.showExperienceDropdown = false; // Cerrar el otro dropdown
  }

  getExperienceYearsDisplayText(): string {
    if (!this.preferences?.preferredExperienceYears || this.preferences.preferredExperienceYears.length === 0) {
      return 'Seleccionar años de experiencia';
    }
    if (this.preferences.preferredExperienceYears.length === 1) {
      return this.preferences.preferredExperienceYears[0];
    }
    return `${this.preferences.preferredExperienceYears.length} opciones seleccionadas`;
  }

  getLanguagesDisplayText(): string {
    if (!this.preferences?.languages || this.preferences.languages.length === 0) {
      return 'Seleccionar idiomas';
    }
    if (this.preferences.languages.length === 1) {
      return this.preferences.languages[0].charAt(0).toUpperCase() + this.preferences.languages[0].slice(1);
    }
    return `${this.preferences.languages.length} idiomas seleccionados`;
  }

  // Método para generar IDs únicos para los checkboxes
  getExperienceId(range: string): string {
    return 'exp' + range.replace(/\s+/g, '');
  }

  // Métodos para el slider de presupuesto
  onBudgetMinChange(value: number): void {
    if (!this.preferences) return;
    
    this.budgetMin = value;
    if (!this.preferences.estimatedBudgetRange) {
      this.preferences.estimatedBudgetRange = { min: 0, max: 1000 };
    }
    this.preferences.estimatedBudgetRange.min = value;
    
    // Asegurar que el mínimo no sea mayor que el máximo
    if (this.budgetMin > this.budgetMax) {
      this.budgetMax = this.budgetMin;
      this.preferences.estimatedBudgetRange.max = this.budgetMax;
    }
  }

  onBudgetMaxChange(value: number): void {
    if (!this.preferences) return;
    
    this.budgetMax = value;
    if (!this.preferences.estimatedBudgetRange) {
      this.preferences.estimatedBudgetRange = { min: 0, max: 1000 };
    }
    this.preferences.estimatedBudgetRange.max = value;
    
    // Asegurar que el máximo no sea menor que el mínimo
    if (this.budgetMax < this.budgetMin) {
      this.budgetMin = this.budgetMax;
      this.preferences.estimatedBudgetRange.min = this.budgetMin;
    }
  }

  onBudgetSliderChange(event: Event): void {
    if (!this.preferences) return;
    
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (target.id === 'budgetSliderMin') {
      // Para el slider mínimo, asegurar que no exceda el máximo
      if (value <= this.budgetMax) {
        this.onBudgetMinChange(value);
      } else {
        // Si excede el máximo, ajustar ambos valores
        this.budgetMin = this.budgetMax;
        this.budgetMax = value;
        if (!this.preferences.estimatedBudgetRange) {
          this.preferences.estimatedBudgetRange = { min: 0, max: 1000 };
        }
        this.preferences.estimatedBudgetRange.min = this.budgetMin;
        this.preferences.estimatedBudgetRange.max = this.budgetMax;
      }
    } else if (target.id === 'budgetSliderMax') {
      // Para el slider máximo, asegurar que no sea menor que el mínimo
      if (value >= this.budgetMin) {
        this.onBudgetMaxChange(value);
      } else {
        // Si es menor que el mínimo, ajustar ambos valores
        this.budgetMax = this.budgetMin;
        this.budgetMin = value;
        if (!this.preferences.estimatedBudgetRange) {
          this.preferences.estimatedBudgetRange = { min: 0, max: 1000 };
        }
        this.preferences.estimatedBudgetRange.min = this.budgetMin;
        this.preferences.estimatedBudgetRange.max = this.budgetMax;
      }
    }
  }

  // Método para formatear el presupuesto como moneda
  formatBudget(value: number): string {
    return `S/ ${value.toLocaleString()}`;
  }

  // Método para inicializar los valores del presupuesto
  initializeBudgetValues(): void {
    if (this.preferences?.estimatedBudgetRange) {
      this.budgetMin = this.preferences.estimatedBudgetRange.min || 0;
      this.budgetMax = this.preferences.estimatedBudgetRange.max || 1000;
    } else {
      this.budgetMin = 0;
      this.budgetMax = 1000;
    }
  }

  // Método para calcular el porcentaje del rango mínimo
  getBudgetMinPercent(): number {
    return (this.budgetMin / 10000) * 100;
  }

  // Método para calcular el porcentaje del rango máximo
  getBudgetMaxPercent(): number {
    return (this.budgetMax / 10000) * 100;
  }

  // Método para obtener los estilos del rango de presupuesto
  getBudgetRangeStyles(): any {
    const minPercent = this.getBudgetMinPercent();
    const maxPercent = this.getBudgetMaxPercent();
    
    return {
      'background': `linear-gradient(to right, #e9ecef 0%, #e9ecef ${minPercent}%, #007bff ${minPercent}%, #007bff ${maxPercent}%, #e9ecef ${maxPercent}%, #e9ecef 100%)`,
      'border-radius': '3px'
    };
  }
}
