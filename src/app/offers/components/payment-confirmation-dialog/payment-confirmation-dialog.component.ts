import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { OfferService } from '../../services/offer.service';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { PaymentConfirmedEvent } from '../../../shared/events/payment-confirmed.event';

@Component({
  selector: 'app-payment-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './payment-confirmation-dialog.component.html',
  styleUrls: ['./payment-confirmation-dialog.component.css']
})
export class PaymentConfirmationDialogComponent {
  isSuccess = false;

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<PaymentConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      amount: number;
      worker: OfferProposalDto;
      offerId: number;
    }
  ) {}

  offerService = inject(OfferService);
  eventBusService = inject(EventBusService);

  confirm(): void {
    // Dispatch payment confirmed event
    const paymentEvent: PaymentConfirmedEvent = {
      offerId: this.data.offerId,
      workerId: this.data.worker.workerId,
      amount: this.data.amount
    };
    
    this.eventBusService.dispatch('PAYMENT_CONFIRMED', paymentEvent);
    
    this.isSuccess = true;
  }

  close(): void {
    this.dialogRef.close('confirmed');
  }
} 