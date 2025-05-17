import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../../model/offer.entity';
import { OfferService } from '../../services/offer.service';
import { OfferActivePageComponent } from '../../components/offer-active-page/offer-active-page.component';
import { OfferFinishedPageComponent } from '../../components/offer-finished-page/offer-finished-page.component';
import { OfferPendingPageComponent } from '../../components/offer-pending-page/offer-pending-page.component';
import { OfferPendingPayPageComponent } from '../../components/offer-pending-pay-page/offer-pending-pay-page.component';

@Component({
  selector: 'app-offer-customer-details-page',
  standalone: true,
  imports: [
    CommonModule,
    OfferActivePageComponent,
    OfferFinishedPageComponent,
    OfferPendingPageComponent,
    OfferPendingPayPageComponent,
  ],
  templateUrl: './offer-customer-details-page.component.html',
  styleUrls: ['./offer-customer-details-page.component.css'],
})
export class OfferCustomerDetailsPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly offerService = inject(OfferService);
  offer: Offer | null = null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const { id } = params;
      if (id) {
        this.offerService.getById(id).subscribe((offer) => {
          this.offer = offer;
        });
      } else {
        this.offer = null;
      }
    });
  }
}
