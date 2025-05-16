import { Routes } from '@angular/router';
import { MyprofileWorkerComponent } from './myprofile-worker/myprofile-worker-component';

export const routes: Routes = [
  { path: '',                  redirectTo: '/perfil-trabajador', pathMatch: 'full' },
  { path: 'perfil-trabajador', component: MyprofileWorkerComponent },
  { path: '**',                redirectTo: '' }
];
