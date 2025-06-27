import { ReviewResource } from "../services/top-headlines.response";

export class Review {
  id: number;
  offerId: number;
  authorUserId: number;
  authorName: string;
  authorImageUrl: string;
  createdAt: string | Date;
  isVerifiedAuthor: boolean;
  rating: number;
  comment: string;

  constructor(params: ReviewResource) {
    this.id = params.id;
    this.offerId = params.offerId;
    this.authorUserId = params.authorUserId;
    this.authorName = params.authorName;
    this.authorImageUrl = params.authorImageUrl;
    this.createdAt = params.createdAt;
    this.isVerifiedAuthor = params.isVerifiedAuthor;
    this.rating = params.rating;
    this.comment = params.comment;
  }
}
