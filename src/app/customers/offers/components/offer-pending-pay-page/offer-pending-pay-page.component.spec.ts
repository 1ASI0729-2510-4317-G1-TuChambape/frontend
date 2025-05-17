import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPendingPayPageComponent } from './offer-pending-pay-page.component';

describe('OfferPendingPayPageComponent', () => {
  let component: OfferPendingPayPageComponent;
  let fixture: ComponentFixture<OfferPendingPayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferPendingPayPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferPendingPayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
