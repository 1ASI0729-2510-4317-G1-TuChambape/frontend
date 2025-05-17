import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPendingPageComponent } from './offer-pending-page.component';

describe('OfferPendingPageComponent', () => {
  let component: OfferPendingPageComponent;
  let fixture: ComponentFixture<OfferPendingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferPendingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferPendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
