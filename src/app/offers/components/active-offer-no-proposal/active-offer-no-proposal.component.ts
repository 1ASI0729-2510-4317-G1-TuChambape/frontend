import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../model/offer.entity';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { OffersProposalsService } from '../../services/offers-proposals.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { PaymentCreatedEvent } from '../../../shared/events/payment-confirmed.event';
import { ComponentType } from '@angular/cdk/portal';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-active-offer-no-proposal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './active-offer-no-proposal.component.html',
  styleUrls: ['./active-offer-no-proposal.component.css']
})
export class ActiveOfferNoProposalComponent implements OnInit {
  @Input() offer!: Offer;

  proposals: OfferProposalDto[] = [];
  isLoading = false;
  error: string | null = null;
  deadline: Date | null = null;

  constructor(
    private offersProposalsService: OffersProposalsService,
    private dialog: MatDialog,
  ) {}

  router = inject(Router);
  offerService = inject(OfferService)
  eventBusService = inject(EventBusService)

  ngOnInit() {
    this.loadProposals();
    this.deadline = new Date(this.offer.deadline);
  }

  loadProposals() {
    this.isLoading = true;
    this.error = null;
    
    this.offersProposalsService.getProposalsForOffer(this.offer.id).subscribe({
      next: (proposals) => {
        this.proposals = proposals;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las propuestas';
        this.isLoading = false;
        console.error('Error loading proposals:', error);
      }
    });
  }

  selectProposal(proposalId: number) {
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    this.offerService.selectProposal(this.offer, proposalId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/ofertas/pendientes']);
        
        // Dispatch payment created event
        const paymentEvent: PaymentCreatedEvent = {
          offerId: this.offer.id,
          workerId: proposal.workerId,
          amount: proposal.price,
          currency: 'PEN'
        };
        this.eventBusService.dispatch('PAYMENT_CREATED', paymentEvent);
      },
      error: (error) => {
        console.error('Error selecting proposal:', error);
      }
    });
  }

  viewProposal(proposal: OfferProposalDto) {
    this.dialog.open(ProposalDetailDialogComponent, {
      data: proposal,
      width: '400px'
    });
  }

  getBudgetRange(): string {
    if (this.offer.budget.min && this.offer.budget.max) {
      return `S/ ${this.offer.budget.min} - S/ ${this.offer.budget.max}`;
    } else if (this.offer.budget.min) {
      return `S/ ${this.offer.budget.min}+`;
    } else if (this.offer.budget.max) {
      return `Hasta S/ ${this.offer.budget.max}`;
    }
    return 'No especificado';
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Componente de diálogo para mostrar el detalle de la propuesta
@Component({
  selector: 'app-proposal-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Detalle de la Propuesta</h2>
    <mat-dialog-content>
      <p><strong>Mensaje:</strong> {{ data.message }}</p>
      <p><strong>Precio:</strong> S/ {{ data.price }}</p>
      <p><strong>Estado:</strong> {{ data.status || 'N/A' }}</p>
      <p><strong>Fecha:</strong> {{ data.createdAt | date:'short' }}</p>
      <p><strong>Técnico:</strong> {{ data.workerName }}</p>
      <p><strong>Rating:</strong> {{ data.rating || 0 }} ({{ data.reviewCount || 0 }} reseñas)</p>
      <ng-container *ngIf="data.yapeNumber || data.plinNumber || data.bankAccountNumber">
        <h4>Métodos de pago:</h4>
        <ul>
          <li *ngIf="data.yapeNumber">Yape: {{ data.yapeNumber }}</li>
          <li *ngIf="data.plinNumber">Plin: {{ data.plinNumber }}</li>
          <li *ngIf="data.bankAccountNumber">Banco: {{ data.bankAccountNumber }}</li>
        </ul>
      </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  providers: [DatePipe]
})
export class ProposalDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
} 