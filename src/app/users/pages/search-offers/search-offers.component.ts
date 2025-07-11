import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../../offers/services/offer.service';
import { Offer } from '../../../offers/model/offer.entity';
import { UserSessionService } from '../../services/user-session.service';
import { ProposalService } from '../../../proposals/services/proposal.service';
import { ProposalStatus } from '../../../proposals/services/top-headlines.response';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApplyOfferDialogComponent } from '../../components/apply-offer-dialog/apply-offer-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Proposal } from '../../../proposals/model/proposal.entity';
import { UserService } from '../../services/user.service';
import { OfferStatus } from '../../../offers/services/top-headlines.response';

@Component({
  selector: 'app-search-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ApplyOfferDialogComponent, MatSnackBarModule],
  templateUrl: './search-offers.component.html',
  styleUrls: ['./search-offers.component.css']
})
export class SearchOffersComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  isLoading = false;
  error: string | null = null;
  proposalsMap: Map<number, Proposal> = new Map();
  workerProfileId: number = 0;

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
    private proposalService: ProposalService,
    private userSessionService: UserSessionService,
    private dialog: MatDialog, // Inject MatDialog
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadWorkerProfile();
    this.loadOffers();
  }

  loadWorkerProfile(): void {
    const account = this.userSessionService.getCurrentAccount();
    if (!account) return;
    this.userService.getUserByAccountId(account.id).subscribe((user) => {
      if (user && user.worker) {
        this.workerProfileId = user.worker.id;
        this.loadMyProposals();
      }
    });
  }

  loadMyProposals(): void {
    if (!this.workerProfileId) return;
    this.proposalService.getProposalsByWorker(this.workerProfileId).subscribe({
      next: (proposals) => {
        proposals.forEach(proposal => {
          this.proposalsMap.set(proposal.offerId, proposal);
        });
      }
    });
  }

  loadOffers(): void {
    this.isLoading = true;
    this.error = null;

    // Cargar todas las ofertas activas
    this.offerService.getOffersByOnlyStatus(OfferStatus.ACTIVE).subscribe({
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

    const bugetValueMin = budget.min;
    const bugetValueMax = budget.max;

    switch (this.selectedBudgetRange) {
      case '0-100':
        return bugetValueMin >= 0 && bugetValueMax <= 100;
      case '100-500':
        return bugetValueMin > 100 && bugetValueMax <= 500;
      case '500-1000':
        return bugetValueMin > 500 && bugetValueMax <= 1000;
      case '1000+':
        return bugetValueMin > 1000;
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

  viewProposal(offerId: number, isEdit: boolean = true): void {
    const proposal = this.proposalsMap.get(offerId);
    console.log(proposal)
    if (proposal) {
      const dialogRef = this.dialog.open(ApplyOfferDialogComponent, {
        width: '400px',
        data: { offer: proposal.offerId, proposal: proposal, isEdit: isEdit }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.proposalService.updateProposal(proposal.id, {
            ...proposal,
            message: result.message,
            price: result.price,
          }).subscribe({
            next: (updatedProposal) => {
              if (updatedProposal) {
                this.proposalsMap.set(offerId, updatedProposal);
              }
              this.snackBar.open('Propuesta actualizada correctamente', 'Cerrar', { duration: 3500, panelClass: 'snackbar-success' });
            }
          });
        }
      });
    }
  }

  applyToOffer(offer: Offer): void {
    const dialogRef = this.dialog.open(ApplyOfferDialogComponent, {
      width: '400px',
      data: { offer, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.workerProfileId) {
          this.snackBar.open('Debes iniciar sesión para aplicar a una oferta.', 'Cerrar', { duration: 3500, panelClass: 'snackbar-error' });
          return;
        }
        this.proposalService.createProposal({
          offerId: offer.id,
          workerId: this.workerProfileId!,
          status: ProposalStatus.PENDING,
          createdAt: new Date(),
          message: result.message,
          price: result.price
        }).subscribe({
          next: (newOffer) => {
            this.proposalsMap.set(offer.id, newOffer);
            this.snackBar.open('Oferta aplicada correctamente', 'Cerrar', { duration: 3500, panelClass: 'snackbar-success' });
          },
          error: (error) => {
            console.error('Error al aplicar a la oferta:', error);
            this.snackBar.open('Error al aplicar a la oferta. Intente más tarde.', 'Cerrar', { duration: 3500, panelClass: 'snackbar-error' });
          }
        });
      }
    });
  }

  getBudgetDisplay(budget: {
    min: number;
    max: number;
    currency: string;
  }): string {
    const intl = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: budget.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return intl.format(budget.min) + ' - ' + intl.format(budget.max);
  }
} 