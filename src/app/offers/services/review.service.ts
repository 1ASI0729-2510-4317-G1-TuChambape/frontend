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
    const token = localStorage.getItem('jobconnect_token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.get<ReviewResource[]>(`${this.serverBaseUrl}/reviews`, {
      headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      map((reviews: ReviewResource[]) =>
        ReviewAssembler.toEntitiesFromResponse(
          reviews.filter(review => review.offerId === offerId)
        )
      )
    );
  }

  getReviewsByReviewerUserId(userId: number): Observable<Review[]> {
    const token = localStorage.getItem('jobconnect_token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.get<ReviewResource[]>(`${this.serverBaseUrl}/reviews`, {
      headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      map((reviews: ReviewResource[]) =>
        ReviewAssembler.toEntitiesFromResponse(
          reviews.filter(review => review.reviewerUserId === userId)
        )
      )
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