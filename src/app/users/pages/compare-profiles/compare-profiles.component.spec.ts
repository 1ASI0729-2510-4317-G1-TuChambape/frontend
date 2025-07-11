import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareProfilesComponent } from './compare-profiles.component';

describe('CompareProfilesComponent', () => {
  let component: CompareProfilesComponent;
  let fixture: ComponentFixture<CompareProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
