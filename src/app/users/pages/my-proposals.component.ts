import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../proposals/services/proposal.service';
import { OfferService } from '../../offers/services/offer.service';
import { Proposal } from '../../proposals/model/proposal.entity';
import { Offer } from '../../offers/model/offer.entity';
import { UserSessionService } from '../services/user-session.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { OfferStatus } from '../../offers/services/top-headlines.response';
import { PaymentService } from '../../payments/services/payment.service';
import { PaymentStatus } from '../../payments/services/top-headlines.response';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-proposals',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './my-proposals.component.html',
  styleUrls: ['./my-proposals.component.css']
})
export class MyProposalsComponent implements OnInit {
  proposals: Proposal[] = [];
  offersMap: Map<number, Offer> = new Map();
  isLoading = false;
  error: string | null = null;
  workerProfileId: number = 0;
  paymentStatusMap: Map<number, string> = new Map();

  constructor(
    private proposalService: ProposalService,
    private offerService: OfferService,
    private userSessionService: UserSessionService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadWorkerProfile();
    setInterval(() => this.refreshPaymentStatuses(), 3000); // refresca cada 3 segundos
  }

  refreshPaymentStatuses(): void {
    const offerIds = this.proposals.map(p => p.offerId);
    offerIds.forEach(id => {
      this.paymentService.getPaymentsByOffer(id).subscribe(payments => {
        if (payments.length > 0) {
          this.paymentStatusMap.set(id, payments[0].status);
        } else {
          this.paymentStatusMap.set(id, 'PENDING');
        }
      });
    });
  }

  loadWorkerProfile(): void {
    const account = this.userSessionService.getCurrentAccount();
    if (!account) return;
    // Buscar el usuario por accountId para obtener el workerId
    this.userService.search({ accountId: account.id }).subscribe(users => {
      if (users.length > 0 && users[0].workerId) {
        this.workerProfileId = users[0].workerId;
        this.loadProposals();
      }
    });
  }

  loadProposals(): void {
    this.isLoading = true;
    this.proposalService.getProposalsByWorker(this.workerProfileId).subscribe({
      next: (proposals) => {
        this.proposals = proposals;
        // Cargar las ofertas asociadas usando forkJoin
        const offerIds = proposals.map(p => p.offerId);
        if (offerIds.length === 0) {
          this.isLoading = false;
          return;
        }
        forkJoin(offerIds.map(id => this.offerService.getOfferById(id.toString()))).subscribe({
          next: (offers) => {
            offers.filter((offer): offer is Offer => offer !== null).forEach(offer => this.offersMap.set(offer.id, offer));
            // Cargar estado de pago para cada oferta
            this.refreshPaymentStatuses();
            this.isLoading = false;
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: (err) => {
        this.error = 'Error al cargar propuestas';
        this.isLoading = false;
      }
    });
  }

  getOffer(offerId: number): Offer | undefined {
    return this.offersMap.get(offerId);
  }

  getPendingProposals(): Proposal[] {
    return this.proposals.filter(p => {
      const offer = this.getOffer(p.offerId);
      return offer && offer.status === 'PENDING';
    });
  }

  getPaymentStatus(offerId: number): string {
    return this.paymentStatusMap.get(offerId) || 'PENDING';
  }

  finishTask(proposal: Proposal): void {
    const offer = this.getOffer(proposal.offerId);
    if (!offer) return;
    this.offerService.updateOfferStatus(offer.id.toString(), OfferStatus.FINISHED).subscribe({
      next: (updatedOffer) => {
        if (updatedOffer) {
          this.offersMap.set(updatedOffer.id, updatedOffer);
        }
      }
    });
  }
}
