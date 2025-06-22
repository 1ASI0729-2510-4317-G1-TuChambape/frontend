import { Routes } from '@angular/router';
import { LoginComponent } from './iam/pages/login/login.component';
import { RegisterComponent } from './iam/pages/register/register.component';
import { ForgotPasswordComponent } from './iam/pages/forgot-password/forgot-password.component';
import { VerifyCodeComponent } from './iam/pages/verify-code/verify-code.component';
import { ResetPasswordComponent } from './iam/pages/reset-password/reset-password.component';
import { AuthGuard } from './iam/services/auth.guard';

export const routes: Routes = [
  // Rutas de Autenticación (Públicas)
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión - JobConnect' },
  { path: 'register', component: RegisterComponent, title: 'Crear Cuenta - JobConnect' },
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Recuperar Contraseña - JobConnect' },
  { path: 'verify-code', component: VerifyCodeComponent, title: 'Verificar Código - JobConnect' },
  { path: 'reset-password', component: ResetPasswordComponent, title: 'Reestablecer Contraseña - JobConnect' },

  // Rutas del Cliente (Protegidas)
  {
    path: 'dashboard',
    loadComponent: () => import('./users/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./users/pages/home-dashboard/home-dashboard.component').then(m => m.HomeDashboardComponent),
        title: 'Inicio - JobConnect'
      },
      {
        path: 'buscar-tecnicos',
        loadComponent: () => import('./users/pages/search-technicians/search-technicians.component').then(m => m.SearchTechniciansComponent),
        title: 'Buscar Técnicos - JobConnect'
      },
      {
        path: 'ofertas',
        loadComponent: () => import('./offers/components/offers-main/offers-main.component').then(m => m.OffersMainComponent),
        title: 'Mis Ofertas - JobConnect',
        children: [
          { path: '', redirectTo: 'activas', pathMatch: 'full' },
          {
            path: 'crear',
            loadComponent: () => import('./offers/pages/create-offer/create-offer.component').then(m => m.CreateOfferComponent),
            title: 'Crear Oferta - JobConnect'
          },
          {
            path: 'activas',
            loadComponent: () => import('./offers/pages/active-offers/active-offers.component').then(m => m.ActiveOffersComponent),
            title: 'Ofertas Activas - JobConnect'
          },
          {
            path: 'pendientes',
            loadComponent: () => import('./offers/pages/pending-offers/pending-offers.component').then(m => m.PendingOffersComponent),
            title: 'Ofertas Pendientes - JobConnect'
          },
          {
            path: 'finalizadas',
            loadComponent: () => import('./offers/pages/finished-offers/finished-offers.component').then(m => m.FinishedOffersComponent),
            title: 'Ofertas Finalizadas - JobConnect'
          }
        ]
      },
      {
        path: 'comparar-perfiles',
        loadComponent: () => import('./users/pages/compare-profiles/compare-profiles.component').then(m => m.CompareProfilesComponent),
        title: 'Comparar Perfiles - JobConnect'
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./users/components/settings-profile/settings-profile.component').then(m => m.SettingsProfileComponent),
        title: 'Configuración - JobConnect',
        children: [
          { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
          {
            path: 'datos-personales',
            loadComponent: () => import('./users/pages/personal-data/personal-data.component').then(m => m.PersonalDataComponent),
            title: 'Datos Personales - JobConnect'
          },
          {
            path: 'preferencias',
            loadComponent: () => import('./users/pages/preferences/preferences.component').then(m => m.PreferencesComponent),
            title: 'Preferencias - JobConnect'
          }
        ]
      }
    ]
  },

  // Rutas por defecto y comodín
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // O a una página 404
];
