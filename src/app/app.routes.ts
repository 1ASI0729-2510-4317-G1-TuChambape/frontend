// src/app/app.routes.ts
import { Route } from '@angular/router';
import { CompareProfilesComponent }
  from './compare-profiles/compare-profiles.component';

export const routes: Route[] = [
  { path: '', redirectTo: 'compare', pathMatch: 'full' },
  { path: 'compare', component: CompareProfilesComponent },
  // …otras rutas…
];
