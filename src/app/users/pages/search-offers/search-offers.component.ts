import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../../offers/services/offer.service';
import { Offer } from '../../../offers/model/offer.entity';
import { UserSessionService } from '../../services/user-session.service';

@Component({
  selector: 'app-search-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-offers.component.html',
  styleUrls: ['./search-offers.component.css']
})
export class SearchOffersComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  isLoading = false;
  error: string | null = null;

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLocation: string = '';
  selectedBudgetRange: string = '';

  // Opciones de filtros
  categories: string[] = [];
  locations: string[] = [];
  budgetRanges = [
    { label: 'Todos los presupuestos', value: '' },
    { label: 'S/ 0 - 100', value: '0-100' },
    { label: 'S/ 100 - 500', value: '100-500' },
    { label: 'S/ 500 - 1000', value: '500-1000' },
    { label: 'S/ 1000+', value: '1000+' }
  ];

  constructor(
    private offerService: OfferService,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading = true;
    this.error = null;

    // Cargar todas las ofertas activas
    this.offerService.search({ status: 'ACTIVE' }).subscribe({
      next: (offers) => {
        this.offers = offers;
        this.filteredOffers = offers;
        this.extractFilterOptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando ofertas:', error);
        this.error = 'Error al cargar las ofertas. Intente más tarde.';
        this.isLoading = false;
      }
    });
  }

  extractFilterOptions(): void {
    // Extraer categorías únicas
    this.categories = [...new Set(this.offers.map(offer => offer.category))];
    
    // Extraer ubicaciones únicas
    this.locations = [...new Set(this.offers.map(offer => offer.location))];
  }

  applyFilters(): void {
    this.filteredOffers = this.offers.filter(offer => {
      // Filtro por término de búsqueda
      const matchesSearch = !this.searchTerm || 
        offer.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por categoría
      const matchesCategory = !this.selectedCategory || 
        offer.category === this.selectedCategory;

      // Filtro por ubicación
      const matchesLocation = !this.selectedLocation || 
        offer.location === this.selectedLocation;

      // Filtro por rango de presupuesto
      const matchesBudget = this.filterByBudgetRange(offer.budget);

      return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
    });
  }

  filterByBudgetRange(budget: any): boolean {
    if (!this.selectedBudgetRange) return true;

    const budgetValue = typeof budget === 'string' ? parseInt(budget) : budget;
    
    switch (this.selectedBudgetRange) {
      case '0-100':
        return budgetValue >= 0 && budgetValue <= 100;
      case '100-500':
        return budgetValue > 100 && budgetValue <= 500;
      case '500-1000':
        return budgetValue > 500 && budgetValue <= 1000;
      case '1000+':
        return budgetValue > 1000;
      default:
        return true;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLocation = '';
    this.selectedBudgetRange = '';
    this.filteredOffers = this.offers;
  }

  applyToOffer(offer: Offer): void {
    // Aquí implementarías la lógica para aplicar a una oferta
    console.log('Aplicando a oferta:', offer.id);
    // TODO: Implementar lógica de aplicación
    alert(`Has aplicado a la oferta: ${offer.title}`);
  }

  getBudgetDisplay(budget: any): string {
    if (typeof budget === 'string') {
      return `S/ ${budget}`;
    }
    return `S/ ${budget}`;
  }
} 