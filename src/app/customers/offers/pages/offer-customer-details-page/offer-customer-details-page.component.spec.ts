import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferCustomerDetailsPageComponent } from './offer-customer-details-page.component';

describe('OfferCustomerDetailsPageComponent', () => {
  let component: OfferCustomerDetailsPageComponent;
  let fixture: ComponentFixture<OfferCustomerDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCustomerDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferCustomerDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
