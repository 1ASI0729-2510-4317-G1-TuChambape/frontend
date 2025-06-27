export interface OfferCreatedEvent {
  offerId: number;
  clientId: number;
  clientEmail: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
} 