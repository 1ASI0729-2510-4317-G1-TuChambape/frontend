import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedOffersComponent } from './finished-offers.component';

describe('FinishedOffersComponent', () => {
  let component: FinishedOffersComponent;
  let fixture: ComponentFixture<FinishedOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
