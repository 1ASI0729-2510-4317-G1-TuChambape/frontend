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

@Component({
  selector: 'app-pending-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pending-offers.component.html',
  styleUrls: ['./pending-offers.component.css']
})
export class PendingOffersComponent implements OnInit {
  offer: Offer | null = null;
  isLoading: boolean = false;
  currentStep: 'details' | 'payment' | 'paymentSuccess' = 'details';
  paymentInfo = { acceptTerms: false };
  selectedProposalByOfferId: { [offerId: number]: OfferProposalDto | null } = {};

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router,
    private offersProposalsService: OffersProposalsService
  ) {}

  ngOnInit(): void {
    this.loadPendingOffer();
  }

  loadPendingOffer(): void {
    this.isLoading = true;
    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.isLoading = false;
      return;
    }
    this.offerService.getOffersByStatus(currentAccount.id.toString(), OfferStatus.PENDING).subscribe({
      next: (offers) => {
        this.offer = offers.length > 0 ? offers[0] : null;
        this.isLoading = false;
        if (this.offer && this.offer.selectedProposalId) {
          this.offersProposalsService.getProposalsForOffer(this.offer.id).subscribe(proposals => {
            this.selectedProposalByOfferId[this.offer!.id] = proposals.find(p => p.id === this.offer!.selectedProposalId) || null;
          });
        } else if (this.offer) {
          this.selectedProposalByOfferId[this.offer.id] = null;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  proceedToPayment(): void {
    if (this.offer) {
      this.currentStep = 'payment';
    }
  }

  submitPayment(): void {
    if (!this.paymentInfo.acceptTerms && this.currentStep === 'payment') {
      alert('Debe aceptar los términos para compartir su correo antes de realizar el pedido.');
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep = 'paymentSuccess';
    }, 1500);
  }

  finishPaymentFlow(): void {
    this.offer = null;
    this.currentStep = 'details';
    alert('Serás redirigido a la lista de ofertas o a la sección de finalizadas.');
  }

  handleImageError(event: Event, imageName: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {}
  }

  getFloor(value: number): number {
    return Math.floor(value);
  }

  get workScheduleProgress(): number | null {
    if (!this.offer) return null;
    const start = new Date(this.offer.startAt!).getTime();
    const end = new Date(this.offer.deadline).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }
}
