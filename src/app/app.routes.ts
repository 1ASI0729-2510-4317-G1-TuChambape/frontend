// src/app/app.routes.ts
import { Route } from '@angular/router';
import { CompareProfilesComponent } from './compare-profiles/compare-profiles.component';

export const routes: Route[] = [
  { path: '', redirectTo: 'compare', pathMatch: 'full' },
  { path: 'compare', component: CompareProfilesComponent },
  {
    path: 'offer',
    loadComponent: () =>
      import('./offers/layouts/offer-layout/offer-layout.component').then(
        (m) => m.OfferLayoutComponent
      ),
    children: [
      {
        path: 'customer',
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import(
                './offers/pages/offer-create-page/offer-create-page.component'
              ).then((m) => m.OfferCreatePageComponent),
          },
          {
            path: ':offerId',
            loadComponent: () =>
              import(
                './offers/pages/offer-customer-details-page/offer-customer-details-page.component'
              ).then((m) => m.OfferCustomerDetailsPageComponent),
          },
        ],
      },
      {
        path: 'worker/:offerId',
        loadComponent: () =>
          import(
            './offers/pages/offer-worker-details-page/offer-worker-details-page.component'
          ).then((m) => m.OfferWorkerDetailsPageComponent),
      },
    ],
  },
  // …otras rutas…
];
