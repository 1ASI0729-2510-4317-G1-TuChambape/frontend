// src/app/public/components/profile-card/profile-card.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileCardComponent } from './profile-card.component';
import { SliderModule } from 'primeng/slider';
import { BadgeModule } from 'primeng/badge';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileCardComponent', () => {
  let component: ProfileCardComponent;
  let fixture: ComponentFixture<ProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser standalone, lo importamos en lugar de declararlo
      imports: [
        ProfileCardComponent,
        SliderModule,   // para <p-slider>
        BadgeModule     // para <span pBadge>
      ],
      schemas: [ NO_ERRORS_SCHEMA ]  // ignora cualquier otra etiqueta desconocida
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardComponent);
    component = fixture.componentInstance;
    // le damos un perfil de prueba
    component.profile = {
      name: 'Test User',
      photoUrl: '',
      role: 'Tester',
      availability: [8, 17],
      rating: 4.3,
      ratingCount: 42,
      certification: 'Certificado X',
      experienceYears: 3,
      favorite: true
    };
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
