import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Payment } from '../model/payment.entity';
import { PaymentAssembler } from './payment.assembler';
import { PaymentResource } from './top-headlines.response';
import { BaseService } from '../../shared/services/base.service';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<Payment> {
  constructor() {
    super();
    this.resourceEndpoint = environment.paymentsResourceEndpointPath;
  }

  getPaymentsByOffer(offerId: number): Observable<Payment[]> {
    return this.search({ offerId }).pipe(
      map((resources: PaymentResource[]) => PaymentAssembler.toEntitiesFromResponse(resources))
    );
  }

  getPaymentById(id: number): Observable<Payment | null> {
    return this.getById(id).pipe(
      map((resource: PaymentResource | null) => resource ? PaymentAssembler.toEntityFromResource(resource) : null)
    );
  }

  createPayment(paymentData: Omit<Payment, 'id'>): Observable<Payment> {
    return this.create(paymentData).pipe(
      map((resource: PaymentResource) => PaymentAssembler.toEntityFromResource(resource))
    );
  }

  updatePayment(id: number, updateData: Partial<Payment>): Observable<Payment | null> {
    return this.update(id, updateData).pipe(
      map((resource: PaymentResource | null) => resource ? PaymentAssembler.toEntityFromResource(resource) : null)
    );
  }

  deletePayment(id: number): Observable<boolean> {
    return this.delete(id);
  }
} 