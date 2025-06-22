import { PaymentResource } from './top-headlines.response';
import { Payment } from '../model/payment.entity';

export class PaymentAssembler {
  static toEntityFromResource(resource: PaymentResource): Payment {
    return new Payment(resource);
  }

  static toEntitiesFromResponse(response: PaymentResource[]): Payment[] {
    return response.map(r => this.toEntityFromResource(r));
  }
} 