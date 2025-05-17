import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Offer } from '../../model/offer.entity';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-offer-layout',
  templateUrl: './offer-layout.component.html',
  imports: [RouterOutlet],
  styleUrls: ['./offer-layout.component.css'],
})
export class OfferLayoutComponent implements OnInit, OnDestroy {
  isNewOfferPath = false;
  isOfferActive = false;
  isOfferPending = false;
  isOfferFinished = false;

  offer?: Offer;

  private offerService = inject(OfferService);
  private routerSubscription?: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateStateBasedOnRoute();
      });

    this.updateStateBasedOnRoute();
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private updateStateBasedOnRoute() {
    const url = this.router.url;
    this.isNewOfferPath = url === '/offer/customer/create';

    if (this.isNewOfferPath) {
      this.isOfferActive = false;
      this.isOfferPending = false;
      this.isOfferFinished = false;
      return;
    }

    const offerId = this.activatedRoute.snapshot.paramMap.get('offerId');

    if (offerId) {
      this.offerService.getById(offerId).subscribe((offer) => {
        this.offer = offer;
        this.updateOfferStatus();
      });
    } else {
      this.offer = undefined;
      this.updateOfferStatus();
    }
  }

  private updateOfferStatus() {
    if (this.offer) {
      this.isOfferActive = this.offer.status === 'active';
      this.isOfferPending = this.offer.status === 'pending';
      this.isOfferFinished = this.offer.status === 'finished';
    } else {
      this.isOfferActive = false;
      this.isOfferPending = false;
      this.isOfferFinished = false;
    }
  }
}
