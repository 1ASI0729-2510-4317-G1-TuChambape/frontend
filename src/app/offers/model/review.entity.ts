import { ReviewResource } from "../services/top-headlines.response";

export class Review {
  id: number;
  offerId: number;
  authorUserId: number;
  reviewerUserId: number;
  authorName: string;
  authorImageUrl: string;
  createdAt: string | Date;
  isVerifiedAuthor: boolean;
  rating: number;
  comment: string;
  reviewerName?: string;
  reviewerLocation?: string;

  constructor(params: ReviewResource) {
    this.id = params.id;
    this.offerId = params.offerId;
    this.authorUserId = params.authorUserId;
    this.reviewerUserId = params.reviewerUserId;
    this.authorName = params.authorName;
    this.authorImageUrl = params.authorImageUrl;
    this.createdAt = params.createdAt;
    this.isVerifiedAuthor = params.isVerifiedAuthor;
    this.rating = params.rating;
    this.comment = params.comment;
    this.reviewerName = params.authorName;
    this.reviewerLocation = (params as any).reviewerLocation;
  }
}
