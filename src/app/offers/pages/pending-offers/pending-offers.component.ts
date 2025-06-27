import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OfferStatus } from '../../services/top-headlines.response';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pending-offers',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pending-offers.component.html',
  styleUrls: ['./pending-offers.component.css']
})
export class PendingOffersComponent implements OnInit {
  pendingOffers: Offer[] = [];
  isLoading: boolean = false;
  selectedProposalByOfferId: { [offerId: number]: OfferProposalDto | null } = {};
  
  // Columnas para la tabla de Material
  displayedColumns: string[] = ['title', 'description', 'budget', 'progress', 'actions'];

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router,
    private offersProposalsService: OffersProposalsService
  ) {}

  ngOnInit(): void {
    this.loadPendingOffers();
  }

  loadPendingOffers(): void {
    this.isLoading = true;
    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.isLoading = false;
      return;
    }
    
    this.offerService.getOffersByStatus(currentAccount.id.toString(), OfferStatus.PENDING).subscribe({
      next: (offers) => {
        this.pendingOffers = offers;
        this.loadSelectedProposals();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSelectedProposals(): void {
    this.pendingOffers.forEach(offer => {
      if (offer.selectedProposalId) {
        this.offersProposalsService.getProposalsForOffer(offer.id).subscribe(proposals => {
          this.selectedProposalByOfferId[offer.id] = proposals.find(p => p.id === offer.selectedProposalId) || null;
        });
      } else {
        this.selectedProposalByOfferId[offer.id] = null;
      }
    });
  }

  viewOfferDetails(offer: Offer): void {
    this.router.navigate(['/dashboard', 'ofertas', offer.id]);
  }

  proceedToPayment(offer: Offer): void {
    this.router.navigate(['/dashboard', 'ofertas', offer.id], { 
      queryParams: {
        isPayment: true
      }
     });
  }

  // Método para formatear la descripción en la tabla
  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  // Método para formatear el presupuesto
  getBudgetRange(offer: Offer): string {
    if (offer.budget.min && offer.budget.max) {
      return `S/ ${offer.budget.min} - S/ ${offer.budget.max}`;
    } else if (offer.budget.min) {
      return `S/ ${offer.budget.min}+`;
    } else if (offer.budget.max) {
      return `Hasta S/ ${offer.budget.max}`;
    }
    return 'No especificado';
  }

  // Método para obtener el progreso del trabajo
  getWorkProgress(offer: Offer): number {
    if (!offer.startAt || !offer.deadline) return 0;
    
    const start = new Date(offer.startAt).getTime();
    const end = new Date(offer.deadline).getTime();
    const now = Date.now();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  // Método para obtener el trabajador asignado
  getAssignedWorker(offerId: number): OfferProposalDto | null {
    return this.selectedProposalByOfferId[offerId] || null;
  }

  // Método para formatear la fecha
  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
