export interface OfferProposalDto {
  id: number;
  workerId: number;
  workerName: string;
  workerAvatar: string;
  message: string;
  price: number;
  createdAt: Date;
  bankAccountNumber?: string;
  yapeNumber?: string;
  plinNumber?: string;
  rating?: number;
  isVerified?: boolean;
  reviewCount?: number;
} 