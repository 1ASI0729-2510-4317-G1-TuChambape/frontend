// src/main.ts
import { bootstrapApplication }    from '@angular/platform-browser';
import { importProvidersFrom }     from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appConfig }    from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    // Tus providers globales (router, interceptors, etc.)
    ...appConfig,

    // Módulos de plataforma que necesita Angular
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule
    )
  ]
})
  .catch(err => console.error(err));
