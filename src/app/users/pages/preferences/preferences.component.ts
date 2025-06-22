import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { UserSessionService } from '../../services/user-session.service';
import { PreferencesService } from '../../services/preferences.service';
import { Preferences } from '../../model/preferences.entity';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  preferences: Preferences | null = null;

  categories: string[] = ['Electricista', 'Gasfitero', 'Carpintero', 'Pintor', 'Estilista', 'Técnico en electrodomésticos', 'Albañil'];
  locations: string[] = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Lince', 'Centro de Lima', 'Callao'];
  serviceTypes: string[] = ['A domicilio', 'En local', 'Ambos'];
  experienceRanges: string[] = ['Cualquiera', '0-2 años', '3-5 años', '6-10 años', '10+ años'];
  availabilityOptions: string[] = ['Cualquier día', 'Entre semana', 'Fines de semana', 'Mañanas', 'Tardes', 'Noches'];
  ratingOptions: { value: number, label: string }[] = [
    { value: 0, label: 'Cualquiera' },
    { value: 3, label: '3 ★ o más' },
    { value: 4, label: '4 ★ o más' },
    { value: 4.5, label: '4.5 ★ o más' },
    { value: 5, label: '5 ★' }
  ];
  budgetRanges: string[] = ['Cualquiera', 'Menos de S/50', 'S/50 - S/100', 'S/100 - S/200', 'S/200 - S/500', 'Más de S/500'];

  isLoading: boolean = false;
  successMessage: string | null = null;
  generalError: string | null = null; // Si hubiera errores de guardado

  constructor(
    private userSessionService: UserSessionService,
    private preferencesService: PreferencesService
  ) { }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    this.preferencesService.search({ userId: currentAccount.id }).subscribe({
      next: (prefs) => {
        this.preferences = prefs.length > 0 ? prefs[0] : null;
        this.isLoading = false;
      },
      error: () => {
        this.generalError = 'No se pudieron cargar las preferencias.';
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
    this.preferencesService.update(this.preferences.userId, this.preferences).subscribe({
      next: (updated) => {
        this.isLoading = false;
        if (updated) {
          this.successMessage = '¡Preferencias guardadas con éxito!';
          setTimeout(() => this.successMessage = null, 3000);
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

  clickYearExperience(preferences: Preferences, range: string): void {
    preferences.preferredExperienceYears = parseInt(range.toString(), 10)
  }
  
  applyColumnFilters(column: 'left' | 'right'): void {
    console.log(`Aplicando filtros de columna ${column} (simulado)`);
  }

  clearColumnFilters(column: 'left' | 'right'): void {
    console.log(`Borrando filtros de columna ${column} (simulado)`);
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

  onAvailabilityChange(day: string, event: Event): void {
    if (!this.preferences) return;
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.preferences.availability) this.preferences.availability = [];
    if (checked) {
      if (!this.preferences.availability.includes(day)) {
        this.preferences.availability.push(day);
      }
    } else {
      this.preferences.availability = this.preferences.availability.filter(d => d !== day);
    }
  }
}
