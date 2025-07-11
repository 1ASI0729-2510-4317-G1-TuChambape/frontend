import { Injectable, inject } from '@angular/core';
import { EventBusService } from '../../shared/services/event-bus.service';
import { PaymentConfirmedEvent, PaymentCreatedEvent } from '../../shared/events/payment-confirmed.event';
import { PaymentService } from './payment.service';
import { Payment } from '../model/payment.entity';
import { PaymentStatus } from './top-headlines.response';

@Injectable({ providedIn: 'root' })
export class PaymentEventHandlerService {
  private eventBusService = inject(EventBusService);
  private paymentService = inject(PaymentService);

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for payment confirmed events
    this.eventBusService.on<PaymentConfirmedEvent>('PAYMENT_CONFIRMED').subscribe(
      (event) => {
        this.handlePaymentConfirmed(event);
      }
    );

    this.eventBusService.on<PaymentCreatedEvent>('PAYMENT_CREATED').subscribe(  
      (event) => {
        this.handlePaymentCreated(event);
      }
    );
  }

  private handlePaymentConfirmed(event: PaymentConfirmedEvent) {
    // Find the payment for this offer and update it
    this.paymentService.getPaymentsByOffer(event.offerId).subscribe(
      (payments) => {
        if (payments.length > 0) {
          const payment = payments[0];
          this.updatePaymentToConfirmed(payment);
        } else {
          // If no payment exists, create one
          this.createPaymentForProposal(event);
        }
      }
    );
  }

  private updatePaymentToConfirmed(payment: Payment) {
    const updateData: Partial<Payment> = {
      ...payment,
      status: PaymentStatus.PAID,
      customerVerified: true,
      updatedAt: new Date().toISOString()
    };

    this.paymentService.updatePayment(payment.id, updateData).subscribe(
      (updatedPayment) => {
        if (updatedPayment) {
          console.log('Payment updated successfully:', updatedPayment);
        }
      },
      (error) => {
        console.error('Error updating payment:', error);
      }
    );
  }

  private handlePaymentCreated(event: PaymentCreatedEvent) {
    this.createPaymentForProposal(event);
  }

  private createPaymentForProposal(event: PaymentConfirmedEvent) {
    // Create payment when proposal is selected and payment is confirmed
    const newPayment: Omit<Payment, 'id'> = {
      offerId: event.offerId,
      amount: event.amount,
      currency: 'PEN',
      status: PaymentStatus.PENDING,
      workerVerified: false,
      customerVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.paymentService.createPayment(newPayment).subscribe({
      next: (createdPayment) => {
        console.log('Payment created for selected proposal:', createdPayment);
      },
      error: (error) => {
        console.error('Error creating payment:', error);
      }
    });
  }
} 