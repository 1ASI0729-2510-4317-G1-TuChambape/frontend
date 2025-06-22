import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OfferStatus } from '../../services/top-headlines.response';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { OfferProposalDto } from '../../model/offer-proposal.dto';

@Component({
  selector: 'app-finished-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './finished-offers.component.html',
  styleUrls: ['./finished-offers.component.css']
})
export class FinishedOffersComponent implements OnInit {
  finishedOffers: Offer[] = [];
  isLoading: boolean = false;
  selectedProposalByOfferId: { [offerId: number]: OfferProposalDto | null } = {};

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
        this.isLoading = false;
        offers.forEach(offer => {
          if (offer.selectedProposalId) {
            this.offersProposalsService.getProposalForId(offer.id).subscribe(proposal => {
              this.selectedProposalByOfferId[offer.id] = proposal;
            });
          } else {
            this.selectedProposalByOfferId[offer.id] = null;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
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
