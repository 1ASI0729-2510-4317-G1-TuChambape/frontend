import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../model/offer.entity';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { Review } from '../../model/review.entity';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-review-customer',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './project-review-customer.component.html',
  styleUrls: ['./project-review-customer.component.css']
})
export class ProjectReviewCustomerComponent {
  @Input() offer!: Offer;
  @Input() worker!: OfferProposalDto;
  @Input() reviews: Review[] = [];
  @Input() canReview: boolean = false;

  @Output() addReview = new EventEmitter<{ rating: number; comment: string }>();

  newReviewRating: number = 0;
  newReviewComment: string = '';

  

  getAverageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }

  setNewReviewRating(rating: number) {
    this.newReviewRating = rating;
  }

  
  submitReview() {
    if (this.newReviewRating && this.newReviewComment) {
      this.addReview.emit({ rating: this.newReviewRating, comment: this.newReviewComment });
      this.newReviewRating = 0;
      this.newReviewComment = '';
    }
  }
}
