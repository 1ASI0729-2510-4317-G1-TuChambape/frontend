import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PaymentConfirmationDialogComponent } from '../payment-confirmation-dialog/payment-confirmation-dialog.component';

@Component({
  selector: 'app-project-payment-customer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule, MatDialogModule, FormsModule],
  templateUrl: './project-payment-customer.component.html',
  styleUrls: ['./project-payment-customer.component.css']
})
export class ProjectPaymentCustomerComponent {
  @Input() amount!: number;
  @Input() worker!: OfferProposalDto;
  @Input() offerId!: number;

  @Output() confirmPayment = new EventEmitter<void>();

  accepted = false;

  constructor(private dialog: MatDialog) {}

  onConfirmPayment() {
    if (!this.accepted) {
      return;
    }

    const dialogRef = this.dialog.open(PaymentConfirmationDialogComponent, {
      width: '400px',
      data: {
        amount: this.amount,
        worker: this.worker,
        offerId: this.offerId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.confirmPayment.emit();
      }
    });
  }
}
