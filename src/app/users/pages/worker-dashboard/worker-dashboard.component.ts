import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../services/user-session.service';
import { WorkerService } from '../../services/worker.service';
import { OfferService } from '../../../offers/services/offer.service';
import { ReviewService } from '../../../offers/services/review.service';
import { Worker } from '../../model/worker.entity';
import { Offer } from '../../../offers/model/offer.entity';
import { Review } from '../../../offers/model/review.entity';
import { UserService } from '../../services/user.service';
import { ProposalService } from '../../../proposals/services/proposal.service';
import { OfferStatus } from '../../../offers/services/top-headlines.response';
import { PaymentService } from '../../../payments/services/payment.service';
import { PaymentStatus } from '../../../payments/services/top-headlines.response';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css']
})
export class WorkerDashboardComponent implements OnInit {
  workerProfileId: number = 0;
  userId: number = 0;
  isLoading = false;
  error: string | null = null;

  // Datos simulados para estadísticas del worker
  profileCompletion: number = 0;
  totalOffersApplied: number = 12;
  offersWon: number = 8;
  offersInProgress: number = 3;
  pendingOffers: number = 1;

  // Estadísticas de ingresos
  totalEarnings: number = 0;
  earningsThisMonth: number = 0;
  averageRating: number = 0;
  totalReviews: number = 15;

  // Para el gráfico de ofertas aplicadas
  applicationsData = [
    { day: 'D', value: 0 }, { day: 'L', value: 0 }, { day: 'Ma', value: 0 }, { day: 'Mi', value: 0 },
    { day: 'J', value: 0 }, { day: 'V', value: 0 }, { day: 'S', value: 0 }
  ];
  maxApplicationValue = 3;

  // Ofertas disponibles
  availableOffers: Offer[] = [];
  recentReviews: Review[] = [];
  finishedOffers: Offer[] = [];

  constructor(
    private userSessionService: UserSessionService,
    private offerService: OfferService,
    private reviewService: ReviewService,
    private userService: UserService,
    private proposalService: ProposalService,
    private workerService: WorkerService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.loadWorkerProfile();
    this.loadFinishedOffers();
  }

  loadProposals(): void {
    this.proposalService.getProposalsByWorker(this.workerProfileId).subscribe({
      next: (proposals) => {
        this.totalOffersApplied = proposals.length;
        this.offersWon = proposals.filter(proposal => proposal.status === 'ACCEPTED').length;
        this.offersInProgress = proposals.filter(proposal => proposal.status === 'ACCEPTED').length;
        this.pendingOffers = proposals.filter(proposal => proposal.status === 'PENDING').length;
        this.totalEarnings = proposals.filter(proposal => proposal.status === 'ACCEPTED').reduce((sum, proposal) => sum + proposal.price, 0);
        this.earningsThisMonth = proposals.filter(proposal => proposal.status === 'ACCEPTED' && proposal.createdAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).reduce((sum, proposal) => sum + proposal.price, 0);
        this.applicationsData = this.applicationsData.map((item, i) => ({
          ...item,
          value: proposals.filter((proposal) => {
            return proposal.status === 'ACCEPTED' && new Date(proposal.createdAt).getDay() === i;
          }).length
        }));
      }
    });
  }

  loadWorkerProfile(): void {
    this.isLoading = true;
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) {
      this.error = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }

    this.userService.getUserByAccountId(currentAccount.id).subscribe({
      next: (user) => {
        if (user && user.worker) {
          this.workerProfileId = user.worker.id;
          this.userId = user.id;
          this.loadProfileCompletion();
          this.loadWorkerReviews();
          this.loadProposals();
        }
      }
    });
  }

  loadProfileCompletion(): void {
    this.workerService.getWorkerById(this.workerProfileId).subscribe({
      next: (worker) => {
        // Lista de campos requeridos para el perfil
        const requiredFields = [
          worker.firstName,
          worker.lastName,
          worker.email,
          worker.phone,
          worker.avatar,
          worker.location,
          worker.bio,
          worker.skills && worker.skills.length > 0 ? 'ok' : '',
          worker.experience !== undefined && worker.experience !== null ? 'ok' : '',
          worker.certifications && worker.certifications.length > 0 ? 'ok' : '',
          worker.availability && Object.keys(worker.availability || {}).length > 0 ? 'ok' : '',
          worker.yapeNumber || worker.plinNumber || worker.bankAccountNumber ? 'ok' : '' 
        ];
        const filledFields = requiredFields.filter(f => !!f);
        this.profileCompletion = Math.round((filledFields.length / requiredFields.length) * 100);
      },
      error: (error) => {
        console.error('Error cargando perfil del worker:', error);
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

  loadWorkerReviews(): void {
    if (this.userId) {
      this.reviewService.getReviewsByReviewerUserId(this.userId).subscribe({
        next: (reviews) => {
          this.totalReviews = reviews.length;
          if (reviews.length > 0) {
            this.recentReviews = reviews.slice(0, 3);
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = Number((totalRating / reviews.length).toFixed(2));
          }
        },
        error: (error) => {
          console.error('Error cargando reseñas del worker:', error);
        }
      });
    }
  }

  loadFinishedOffers(): void {
    // Cargar todas las ofertas finalizadas asociadas al worker
    const currentAccount = this.userSessionService.getCurrentAccount();
    if (!currentAccount) return;
    this.userService.getUserByAccountId(currentAccount.id).subscribe({
      next: (user) => {
        if (user.worker) {
          const workerId = user.worker.id;
          this.proposalService.getProposalsByWorker(workerId).subscribe({
            next: (proposals) => {
              const finishedOfferIds = proposals.map(p => p.offerId);
              if (finishedOfferIds.length === 0) {
                this.finishedOffers = [];
                this.totalEarnings = 0;
                return;
              }
              // Obtener todas las ofertas y filtrar las finalizadas
              Promise.all(finishedOfferIds.map(id => this.offerService.getOfferById(id.toString()).toPromise()))
                .then(offers => {
                  this.finishedOffers = offers.filter(o => o && o.status === OfferStatus.FINISHED) as Offer[];
                  // Calcular ingresos solo de ofertas finalizadas y pagadas
                  Promise.all(this.finishedOffers.map(offer => this.paymentService.getPaymentsByOffer(offer.id).toPromise()))
                    .then(paymentsArr => {
                      this.totalEarnings = paymentsArr.flat().filter((p): p is any => !!p && typeof p.amount === 'number' && p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0);
                    });
                });
            }
          });
        }
      }
    });
  }
} 