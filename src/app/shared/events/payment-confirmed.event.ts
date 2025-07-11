export interface PaymentConfirmedEvent {
  offerId: number;
  workerId: number;
  amount: number;
} 

export interface PaymentCreatedEvent {
  offerId: number;
  workerId: number;
  amount: number;
  currency: string;
}
