import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from '../../../../shared/components/start-rating/start-rating.component';

interface Technician {
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  profession: string;
  price: number;
  available: boolean;
}

@Component({
  selector: 'app-offer-customer-details-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StarRatingComponent],
  templateUrl: './offer-active-page.component.html',
  styleUrls: ['./offer-active-page.component.css'],
})
export class OfferCustomerDetailsPageComponent {
  technicians = signal<Technician[]>([
    {
      name: 'Juan González',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      reviews: 150,
      profession: 'Electricista',
      price: 50,
      available: true,
    },
    {
      name: 'Teodoro Casanova',
      photo: 'https://randomuser.me/api/portraits/men/47.jpg',
      rating: 4.2,
      reviews: 129,
      profession: 'Electricista',
      price: 50,
      available: true,
    },
    {
      name: 'Gracia Espinoza',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      reviews: 150,
      profession: 'Electricista',
      price: 50,
      available: true,
    },
    {
      name: 'Enrique Lopez',
      photo: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 4.2,
      reviews: 129,
      profession: 'Electricista',
      price: 50,
      available: true,
    },
  ]);
}
