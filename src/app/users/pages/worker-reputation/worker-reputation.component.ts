import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../offers/services/review.service';
import { UserSessionService } from '../../services/user-session.service';
import { Review } from '../../../offers/model/review.entity';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-worker-reputation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-reputation.component.html',
  styleUrls: ['./worker-reputation.component.css']
})
export class WorkerReputationComponent implements OnInit {
  userId: number = 0;
  reviews: Review[] = [];
  isLoading = false;
  error: string | null = null;

  // Estadísticas de reputación
  averageRating: number = 0;
  totalReviews: number = 0;
  ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  // Filtros
  selectedRating: number = 0; // 0 = todas las reseñas
  filteredReviews: Review[] = [];

  constructor(
    private userSessionService: UserSessionService,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadWorkerProfile();
  }

  loadWorkerProfile(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.error = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }

    this.userService.search({ accountId: currentAccount.id }).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.userId = users[0].id;
          this.loadWorkerReviews();
        }
      }
    });
  }

  loadWorkerReviews(): void {
    if (!this.userId) return;

    this.reviewService.getReviewsByReviewerUserId(this.userId).subscribe({
      next: (reviews) => {
        this.isLoading = false;
        this.reviews = reviews;
        this.filteredReviews = reviews;
        this.calculateReputationStats();
      },
      error: (error) => {
        console.error('Error cargando reseñas:', error);
        this.error = 'Error al cargar las reseñas.';
        this.isLoading = false;
      }
    });
  }

  calculateReputationStats(): void {
    this.totalReviews = this.reviews.length;
    
    if (this.totalReviews === 0) {
      this.averageRating = 0;
      return;
    }

    // Calcular promedio
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.totalReviews;

    // Calcular distribución de calificaciones
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      this.ratingDistribution[review.rating]++;
    });
  }

  filterByRating(rating: number): void {
    this.selectedRating = rating;
    if (rating === 0) {
      this.filteredReviews = this.reviews;
    } else {
      this.filteredReviews = this.reviews.filter(review => review.rating === rating);
    }
  }

  getRatingPercentage(rating: number): number {
    if (this.totalReviews === 0) return 0;
    return (this.ratingDistribution[rating] / this.totalReviews) * 100;
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getRatingLabel(rating: number): string {
    const labels = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return labels[rating as keyof typeof labels] || '';
  }

  getOverallRatingLabel(): string {
    if (this.averageRating >= 4.5) return 'Excelente';
    if (this.averageRating >= 4.0) return 'Muy bueno';
    if (this.averageRating >= 3.5) return 'Bueno';
    if (this.averageRating >= 3.0) return 'Regular';
    if (this.averageRating >= 2.0) return 'Malo';
    return 'Muy malo';
  }
} 