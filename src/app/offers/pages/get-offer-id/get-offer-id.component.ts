import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, TitleStrategy } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { Review } from '../../model/review.entity';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectDetailsCustomerComponent } from '../../components/project-details-customer/project-details-customer.component';
import { ProjectPaymentCustomerComponent } from '../../components/project-payment-customer/project-payment-customer.component';
import { ProjectReviewCustomerComponent } from '../../components/project-review-customer/project-review-customer.component';
import { ActiveOfferNoProposalComponent } from '../../components/active-offer-no-proposal/active-offer-no-proposal.component';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-get-offer-id',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ProjectDetailsCustomerComponent,
    ProjectPaymentCustomerComponent,
    ProjectReviewCustomerComponent,
    ActiveOfferNoProposalComponent
  ],
  templateUrl: './get-offer-id.component.html',
  styleUrls: ['./get-offer-id.component.css']
})
export class GetOfferIdComponent implements OnInit {
  offer: Offer | null = null;
  applicants: OfferProposalDto[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Estado de la UI para el flujo customer
  uiStep: 'details' | 'payment' | 'payment-success' | 'review' = 'details';
  paymentAmount: number = 0;
  reviews: Review[] = [];
  canReview: boolean = false;

  assignedWorker: OfferProposalDto | null = null;

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private offersProposalsService: OffersProposalsService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.loadOfferDetails();
  }

  loadOfferDetails(): void {
    this.isLoading = true;
    this.error = null;

    const isPayment = this.route.snapshot.queryParamMap.get('isPayment');

    this.route.params.subscribe(params => {
      const offerId = params['id'];
      if (!offerId) {
        this.error = 'ID de oferta no proporcionado';
        this.isLoading = false;
        return;
      }
      this.offerService.getOfferById(offerId).subscribe({
        next: (offer) => {
          this.offer = offer;
          if (offer?.status === 'FINISHED') {
            this.uiStep = 'review';
            this.canReview = true;
          } else if (isPayment) {
            this.uiStep = 'payment';
          } else {
            this.uiStep = 'details';
          }
          this.loadApplicants(offer);
          this.loadReviews(offer);
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles de la oferta';
          this.isLoading = false;
        }
      });
    });
  }

  loadApplicants(offer: Offer | null): void {
    if (!offer || !offer?.selectedProposalId) {
      this.isLoading = false;
      return;
    }

    this.offersProposalsService.getProposalForId(offer.selectedProposalId).subscribe({
      next: (proposal) => {
        this.assignedWorker = proposal;
        this.paymentAmount = proposal.price;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading proposal:', err);
      }
    });

  }

  loadReviews(offer: Offer | null): void {
    if (!offer || !offer?.selectedProposalId) {
      this.isLoading = false;
      return;
    }

    this.reviewService.getReviewsByOfferId(offer.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;

        const account = this.session.getCurrentAccount();
        if (reviews.length > 0 && reviews.find(r => r.authorUserId === account?.id)) {
          this.canReview = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading reviews:', err);
      }
    });
  }

  // --- Orquestación de pasos ---
  onFinalize() {
    this.router.navigate(['/dashboard', 'ofertas', this.offer?.id], {
      queryParams: {
        isPayment: true
      }
    });
    this.uiStep = 'payment';
  }

  onConfirmPayment() {
    // Simular actualización de estado de la oferta a 'finalizada' y permitir reseña
    this.canReview = true;
  }

  onContinueAfterPayment() {
    this.uiStep = 'review';
  }

  onAddReview(review: { rating: number; comment: string }) {
    const account = this.session.getCurrentAccount();

    this.reviewService.addReview({
      offerId: this.offer?.id || 0,
      authorImageUrl: this.assignedWorker?.workerAvatar || '',
      authorName: this.assignedWorker?.workerName || '',
      authorUserId: account?.id || 0,
      comment: review.comment,
      rating: review.rating,
      createdAt: new Date().toISOString(),
      isVerifiedAuthor: this.assignedWorker?.isVerified || false
    }).subscribe({
      next: (review) => {
        this.reviews.push(review);
        this.canReview = false;
      },
      error: (err) => {
        console.error('Error adding review:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/offers/active']);
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

  // Método para formatear la fecha
  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 