// src/app/app.config.ts
import { provideHttpClient } from '@angular/common/http';
import { provideRouter }     from '@angular/router';
import { routes }            from './app.routes';

export const appConfig = [
  provideHttpClient(),
  provideRouter(routes)
];
