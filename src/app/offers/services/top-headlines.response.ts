export type TopHeadlines = OfferResource[];

export enum OfferStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  FINISHED = "FINISHED",
  DRAFT = "DRAFT"
}

export interface OfferResource {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientEmail: string;
  status: OfferStatus;
  category: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline: Date |string;
  startAt?: string | Date;
  proposalsCount: number;
}

export interface ReviewResource {
  id: number;
  offerId: number;
  authorUserId: number;
  authorName: string;
  authorImageUrl: string;
  createdAt: string | Date;
  isVerifiedAuthor: boolean;
  rating: number;
  comment: string;
}