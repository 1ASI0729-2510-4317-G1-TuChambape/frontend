import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OfferStatus } from '../../services/top-headlines.response';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { OfferProposalDto } from '../../model/offer-proposal.dto';

@Component({
  selector: 'app-active-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './active-offers.component.html',
  styleUrls: ['./active-offers.component.css']
})
export class ActiveOffersComponent implements OnInit {
  activeOffers: Offer[] = [];
  isLoading: boolean = false;
  applicantsByOffer: { [offerId: number]: OfferProposalDto[] } = {};

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router,
    private offersProposalsService: OffersProposalsService
  ) {}

  ngOnInit(): void {
    this.loadActiveOffers();
  }

  loadActiveOffers(): void {
    this.isLoading = true;
    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.isLoading = false;
      return;
    }
    this.offerService.getOffersByStatus(currentAccount.id.toString(), OfferStatus.ACTIVE).subscribe({
      next: (offers) => {
        this.activeOffers = offers;
        this.isLoading = false;
        // Cargar applicants para cada oferta
        offers.forEach(offer => {
          this.offersProposalsService.getProposalsForOffer(offer.id).subscribe(proposals => {
            this.applicantsByOffer[offer.id] = proposals;
          });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewTechnicianProfile(technicianId: number): void {
    // Implementar navegación o lógica real
  }

  selectTechnician(offerId: string, technicianId: number): void {
    // Implementar lógica real
  }

  handleImageError(event: Event, applicantName: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/img/default-tech.png';
    }
  }
}
