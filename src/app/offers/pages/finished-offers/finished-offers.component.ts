import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OfferStatus } from '../../services/top-headlines.response';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-finished-offers',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './finished-offers.component.html',
  styleUrls: ['./finished-offers.component.css']
})
export class FinishedOffersComponent implements OnInit {
  finishedOffers: Offer[] = [];
  isLoading: boolean = false;
  selectedProposalByOfferId: { [offerId: number]: OfferProposalDto | null } = {};
  router = inject(Router);
  // Columnas para la tabla de Material
  displayedColumns: string[] = ['title', 'description', 'budget', 'completedDate', 'actions'];

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private offersProposalsService: OffersProposalsService
  ) {}

  ngOnInit(): void {
    this.loadFinishedOffers();
  }

  loadFinishedOffers(): void {
    this.isLoading = true;
    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.isLoading = false;
      return;
    }
    
    this.offerService.getOffersByStatus(currentAccount.id.toString(), OfferStatus.FINISHED).subscribe({
      next: (offers) => {
        this.finishedOffers = offers;
        this.loadSelectedProposals();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSelectedProposals(): void {
    this.finishedOffers.forEach(offer => {
      if (offer.selectedProposalId) {
        this.offersProposalsService.getProposalForId(offer.id).subscribe(proposal => {
          this.selectedProposalByOfferId[offer.id] = proposal;
        });
      } else {
        this.selectedProposalByOfferId[offer.id] = null;
      }
    });
  }

  viewOfferDetails(offer: Offer): void {
   this.router.navigate(['/dashboard', 'ofertas', offer.id]);
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

  // Método para obtener el trabajador asignado
  getAssignedWorker(offerId: number): OfferProposalDto | null {
    return this.selectedProposalByOfferId[offerId] || null;
  }

  // Método para formatear la fecha de finalización
  getCompletedDate(offer: Offer): string {
    // Usar updatedAt como fecha de finalización aproximada
    return this.getFormattedDate(offer.updatedAt);
  }

  // Método para formatear la fecha
  getFormattedDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Método para obtener el rating del trabajador
  getWorkerRating(offerId: number): number {
    const worker = this.getAssignedWorker(offerId);
    return worker?.rating || 0;
  }

  // Método para obtener el número de reseñas del trabajador
  getWorkerReviewCount(offerId: number): number {
    const worker = this.getAssignedWorker(offerId);
    return worker?.reviewCount || 0;
  }

  handleImageError(event: Event, descriptiveName: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      if (descriptiveName.includes('avatar')) {
        target.src = 'assets/img/default-avatar.png';
      } else {
        target.src = 'assets/img/default-tech.png';
      }
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const flooredRating = Math.floor(rating);
    return Array(5 - flooredRating).fill(0);
  }
}
