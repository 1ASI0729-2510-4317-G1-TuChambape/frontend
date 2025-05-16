// src/app/app.component.spec.ts

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { SideNavigationBarComponent } from './public/components/side-navigation-bar/side-navigation-bar.component';
import { HeaderBarComponent }       from './public/components/header-bar/header-bar.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importa el RouterTestingModule y los standalone components que usas
      imports: [
        RouterTestingModule,
        AppComponent,
        SideNavigationBarComponent,
        HeaderBarComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app     = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Puedes eliminar o comentar los tests de "title" y "render title"
  // porque ya no existen ni la propiedad ni el <h1> esperado.
});
