import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePreferenciasComponent } from './profile-preferencias.component';

describe('ProfilePreferenciasComponent', () => {
  let component: ProfilePreferenciasComponent;
  let fixture: ComponentFixture<ProfilePreferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePreferenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePreferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
