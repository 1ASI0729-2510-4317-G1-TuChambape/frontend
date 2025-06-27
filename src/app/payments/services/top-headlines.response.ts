export type TopHeadlines = PaymentResource[];

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING'
}

export interface PaymentResource {
  id: number;
  offerId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  workerVerified: boolean;
  customerVerified: boolean;
} 