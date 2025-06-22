export class Payment {
  id: number;
  offerId: number;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;

  constructor(params: any) {
    this.id = params.id;
    this.offerId = params.offerId;
    this.amount = params.amount;
    this.currency = params.currency;
    this.status = params.status;
    this.createdAt = new Date(params.createdAt);
    this.updatedAt = new Date(params.updatedAt);
  }
} 