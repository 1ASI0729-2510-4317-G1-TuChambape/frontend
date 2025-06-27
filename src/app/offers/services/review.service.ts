import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Review } from '../model/review.entity';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';
import { ReviewResource } from './top-headlines.response';
import { ReviewAssembler } from './review.assembler';

@Injectable({ providedIn: 'root' })
export class ReviewService extends BaseService<ReviewResource> {
  constructor() {
    super();
    this.resourceEndpoint = environment.reviewsResourceEndpointPath;
  }

  getReviewsByOfferId(offerId: number): Observable<Review[]> {
    return this.search({ offerId }).pipe(
      map(reviews => ReviewAssembler.toEntitiesFromResponse(reviews))
    );
  }

  getReviewsByRevieweeUserId(userId: number): Observable<Review[]> {
    return this.search({ revieweeUserId: userId }).pipe(
      map(reviews => ReviewAssembler.toEntitiesFromResponse(reviews))
    );
  }

  getReviewById(id: string): Observable<Review | null> {
    return this.getById(id).pipe(
      map(resource => resource ? ReviewAssembler.toEntityFromResource(resource) : null)
    );
  }

  addReview(review: Omit<Review, 'id'>): Observable<Review> {
    return this.create(ReviewAssembler.toResourceFromEntity(review as Review)).pipe(
      map(resource => ReviewAssembler.toEntityFromResource(resource))
    );
  }

  updateReview(id: string, updateData: Review): Observable<Review | null> {
    return this.update(id, ReviewAssembler.toResourceFromEntity(updateData)).pipe(
      map(resource => resource ? ReviewAssembler.toEntityFromResource(resource) : null)
    );
  }

  deleteReview(id: string): Observable<boolean> {
    return this.delete(id);
  }
} 