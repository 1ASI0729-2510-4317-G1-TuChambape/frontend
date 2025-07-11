import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Payment } from '../model/payment.entity';
import { PaymentAssembler } from './payment.assembler';
import { BaseService } from '../../shared/services/base.service';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<Payment> {
  constructor() {
    super();
    this.resourceEndpoint = environment.paymentsResourceEndpointPath;
  }

  getPaymentsByOffer(offerId: number): Observable<Payment[]> {
    return this.search({ offerId }).pipe(
      map((resources) => PaymentAssembler.toEntitiesFromResponse(resources))
    );
  }

  getPaymentById(id: number): Observable<Payment | null> {
    return this.getById(id).pipe(
      map((resource) => resource ? PaymentAssembler.toEntityFromResource(resource) : null)
    );
  }

  createPayment(paymentData: Omit<Payment, 'id'>): Observable<Payment> {
    return this.create(paymentData).pipe(
      map((resource) => PaymentAssembler.toEntityFromResource(resource))
    );
  }

  updatePayment(id: number, updateData: Partial<Payment>): Observable<Payment | null> {
    return this.patch(id, updateData).pipe(
      map((resource) => resource ? PaymentAssembler.toEntityFromResource(resource) : null)
    );
  }

  deletePayment(id: number): Observable<boolean> {
    return this.delete(id);
  }
} 