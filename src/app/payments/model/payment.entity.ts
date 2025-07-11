import { PaymentResource, PaymentStatus } from "../services/top-headlines.response";

export class Payment {
  id: number;
  offerId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  workerVerified: boolean;
  customerVerified: boolean;

  constructor(params: PaymentResource) {
    this.id = params.id;
    this.offerId = params.offerId;
    this.amount = params.amount;
    this.currency = params.currency;
    this.status = params.status;
    this.createdAt = new Date(params.createdAt);
    this.updatedAt = new Date(params.updatedAt);
    this.workerVerified = params.workerVerified;
    this.customerVerified = params.customerVerified;
  }
} 