import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { OfferService } from './../../services/offer.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Offer } from '../../model/offer.entity';

@Component({
  selector: 'app-offer-list-page',
  imports: [MatButtonModule, MatExpansionModule, CommonModule],
  templateUrl: './offer-list-page.component.html',
  styleUrl: './offer-list-page.component.css',
})
export class OfferListPageComponent implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly router = inject(Router);

  offers: Offer[] = [];

  ngOnInit() {
    this.offerService.getAllByUserId('1').subscribe((offers) => {
      this.offers = offers;
    });
  }

  goToNewOffer() {
    this.router.navigate(['/customer/offers/create']);
  }

  goToOfferDetails(offerId: string) {
    this.router.navigate([`/customer/offers/${offerId}`]);
  }
}
