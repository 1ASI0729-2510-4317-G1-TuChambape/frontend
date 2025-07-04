import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../services/user-session.service';
import { WorkerService } from '../../services/worker.service';
import { OfferService } from '../../../offers/services/offer.service';
import { ReviewService } from '../../../offers/services/review.service';
import { Worker } from '../../model/worker.entity';
import { Offer } from '../../../offers/model/offer.entity';
import { Review } from '../../../offers/model/review.entity';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css']
})
export class WorkerDashboardComponent implements OnInit {
  workerProfile: Worker | null = null;
  isLoading = false;
  error: string | null = null;

  // Datos simulados para estadísticas del worker
  profileCompletion: number = 75;
  totalOffersApplied: number = 12;
  offersWon: number = 8;
  offersInProgress: number = 3;
  pendingOffers: number = 1;

  // Estadísticas de ingresos
  totalEarnings: number = 2500;
  earningsThisMonth: number = 800;
  averageRating: number = 4.7;
  totalReviews: number = 15;

  // Para el gráfico de ofertas aplicadas
  applicationsData = [
    { day: 'L', value: 2 }, { day: 'M', value: 1 }, { day: 'M', value: 3 },
    { day: 'J', value: 0 }, { day: 'V', value: 2 }, { day: 'S', value: 1 }, { day: 'D', value: 1 }
  ];
  maxApplicationValue = 3;

  // Ofertas disponibles
  availableOffers: Offer[] = [];
  recentReviews: Review[] = [];

  constructor(
    private userSessionService: UserSessionService,
    private workerService: WorkerService,
    private offerService: OfferService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadWorkerProfile();
    this.loadAvailableOffers();
    this.loadRecentReviews();
  }

  loadWorkerProfile(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.error = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }

    // Buscar el worker por email
    this.workerService.search({ email: currentAccount.email }).subscribe({
      next: (workers) => {
        if (workers.length > 0) {
          this.workerProfile = workers[0];
          this.loadWorkerReviews();
        } else {
          this.error = 'No se encontró el perfil de worker.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil.';
        this.isLoading = false;
      }
    });
  }

  loadAvailableOffers(): void {
    // Cargar todas las ofertas activas disponibles
    this.offerService.search({ status: 'ACTIVE' }).subscribe({
      next: (offers) => {
        this.availableOffers = offers.slice(0, 5); // Mostrar solo las primeras 5
      },
      error: (error) => {
        console.error('Error cargando ofertas disponibles:', error);
      }
    });
  }

  loadRecentReviews(): void {
    if (this.workerProfile) {
      this.reviewService.getReviewsByRevieweeUserId(this.workerProfile.id).subscribe({
        next: (reviews) => {
          this.recentReviews = reviews.slice(0, 3); // Mostrar solo las últimas 3
        },
        error: (error) => {
          console.error('Error cargando reseñas:', error);
        }
      });
    }
  }

  loadWorkerReviews(): void {
    if (this.workerProfile) {
      this.reviewService.getReviewsByRevieweeUserId(this.workerProfile.id).subscribe({
        next: (reviews) => {
          this.totalReviews = reviews.length;
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = totalRating / reviews.length;
          }
        },
        error: (error) => {
          console.error('Error cargando reseñas del worker:', error);
        }
      });
    }
  }
} 