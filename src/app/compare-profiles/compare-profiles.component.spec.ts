// src/app/compare-profiles/compare-profiles.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompareProfilesComponent } from './compare-profiles.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';

// Stub para reemplazar app-profile-card sin importar su interfaz exacta
@Component({ selector: 'app-profile-card', template: '' })
class StubProfileCardComponent {
  @Input() profile: any;
}

describe('CompareProfilesComponent', () => {
  let component: CompareProfilesComponent;
  let fixture: ComponentFixture<CompareProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompareProfilesComponent,
        StubProfileCardComponent
      ],
      imports: [
        FormsModule            // para ngModel en el checkbox
      ],
      schemas: [
        NO_ERRORS_SCHEMA       // ignora etiquetas/atributos desconocidos de PrimeNG
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareProfilesComponent);
    component = fixture.componentInstance;
    // Datos de prueba
    component.profiles = [
      { name: 'A', photoUrl: '', role: 'X', availability: [0,0], rating: 0, ratingCount: 0, certification: '', experienceYears: 0, favorite: true },
      { name: 'B', photoUrl: '', role: 'X', availability: [0,0], rating: 0, ratingCount: 0, certification: '', experienceYears: 0, favorite: false }
    ];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter only favorites when onlyFav is true', () => {
    component.onlyFav = true;
    const filtered = component.filteredProfiles();
    expect(filtered.length).toBe(1);
    expect(filtered[0].favorite).toBeTrue();
  });

  it('should return all profiles when onlyFav is false', () => {
    component.onlyFav = false;
    const filtered = component.filteredProfiles();
    expect(filtered.length).toBe(2);
  });
});
