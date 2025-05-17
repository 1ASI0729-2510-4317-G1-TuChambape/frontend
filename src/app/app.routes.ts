// src/app/app.routes.ts
import { Route } from '@angular/router';
import { CompareProfilesComponent } from './compare-profiles/compare-profiles.component';

export const routes: Route[] = [
  { path: '', redirectTo: 'compare', pathMatch: 'full' },
  { path: 'compare', component: CompareProfilesComponent },
  {
    path: 'customer',
    children: [
      {
        path: 'offers',
        loadComponent: () =>
          import(
            './customers/offers/layouts/offer-layout/offer-layout.component'
          ).then((m) => m.OfferLayoutComponent),
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import(
                './customers/offers/pages/offer-create-page/offer-create-page.component'
              ).then((m) => m.OfferCreatePageComponent),
          },
          {
            path: 'list',
            loadComponent: () =>
              import(
                './customers/offers/pages/offer-list-page/offer-list-page.component'
              ).then((m) => m.OfferListPageComponent),
          },
          {
            path: ':uid',
            loadComponent: () =>
              import(
                './customers/offers/pages/offer-customer-details-page/offer-customer-details-page.component'
              ).then((m) => m.OfferCustomerDetailsPageComponent),
          },
        ],
      },
    ],
  },
  // …otras rutas…
];
