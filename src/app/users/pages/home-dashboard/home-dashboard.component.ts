import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../offers/services/offer.service';
import { ReviewService } from '../../../offers/services/review.service';
import { UserSessionService } from '../../services/user-session.service';
import { UserService } from '../../services/user.service';
import { Offer } from '../../../offers/model/offer.entity';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  isLoading = false;
  error: string | null = null;

  // Dashboard data
  offers: Offer[] = [];
  pendingOffers: Offer[] = [];
  finishedOffers: Offer[] = [];
  totalProposals: number = 0;
  avgProposals: number = 0;
  reviewsGiven: number = 0;
  activityByDay: { [day: string]: number } = {};
  daysOfWeek: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  searchData: { day: string, value: number }[] = [];
  maxSearchValue: number = 1;

  constructor(
    private offerService: OfferService,
    private reviewService: ReviewService,
    private userSessionService: UserSessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    const account = this.userSessionService.getCurrentAccount();
    if (!account) {
      this.error = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }
    // Obtener el User para conseguir el userId (para reviews)
    this.userService.search({ accountId: account.id }).subscribe(users => {
      if (!users.length) {
        this.error = 'No se encontró el usuario.';
        this.isLoading = false;
        return;
      }
      const user = users[0];
      // Ofertas creadas por el cliente
      this.offerService.getOffersByClient(account.id.toString()).subscribe(offers => {
        this.offers = offers;
        this.pendingOffers = offers.filter(o => o.status === 'ACTIVE' || o.status === 'PENDING');
        this.finishedOffers = offers.filter(o => o.status === 'FINISHED');
        this.totalProposals = offers.reduce((acc, o) => acc + (o.proposalsCount || 0), 0);
        this.avgProposals = offers.length ? this.totalProposals / offers.length : 0;
        this.computeActivityByDay(offers);
        // Reseñas dadas por el usuario
        this.reviewService.getReviewsByReviewerUserId(user.id).subscribe(reviews => {
          this.reviewsGiven = reviews.length;
          this.isLoading = false;
        });
      });
    });
  }

  computeActivityByDay(offers: Offer[]): void {
    // Inicializar días
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const dayMap: { [key: string]: number } = { L: 0, M: 0, J: 0, V: 0, S: 0, D: 0 };
    offers.forEach(offer => {
      const date = new Date(offer.createdAt);
      const day = date.getDay(); // 0=Domingo, 1=Lunes...
      let dayLetter = '';
      switch (day) {
        case 0: dayLetter = 'D'; break;
        case 1: dayLetter = 'L'; break;
        case 2: dayLetter = 'M'; break;
        case 3: dayLetter = 'M'; break;
        case 4: dayLetter = 'J'; break;
        case 5: dayLetter = 'V'; break;
        case 6: dayLetter = 'S'; break;
      }
      if (dayLetter) dayMap[dayLetter] = (dayMap[dayLetter] || 0) + 1;
    });
    this.searchData = days.map(day => ({ day, value: dayMap[day] || 0 }));
    this.maxSearchValue = Math.max(...this.searchData.map(d => d.value), 1);
  }
}
