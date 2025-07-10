import { Review } from '../model/review.entity';
import { ReviewResource } from './top-headlines.response';

export class ReviewAssembler {
  static toEntityFromResource(resource: ReviewResource): Review {
    return new Review(resource);
  }

  static toEntitiesFromResponse(resources: ReviewResource[]): Review[] {
    return resources.map(r => new Review(r));
  }

  static toResourceFromEntity(resources: ReviewResource): Review {
    return new Review({
      id: resources.id,
      offerId: resources.offerId,
      authorUserId: resources.authorUserId,
      reviewerUserId: resources.reviewerUserId,
      authorName: resources.authorName,
      authorImageUrl: resources.authorImageUrl,
      createdAt: resources.createdAt,
      isVerifiedAuthor: resources.isVerifiedAuthor,
      rating: resources.rating,
      comment: resources.comment
    });
  }
} 