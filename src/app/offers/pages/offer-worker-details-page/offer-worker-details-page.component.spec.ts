import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferWorkerDetailsPageComponent } from './offer-worker-details-page.component';

describe('OfferWorkerDetailsPageComponent', () => {
  let component: OfferWorkerDetailsPageComponent;
  let fixture: ComponentFixture<OfferWorkerDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferWorkerDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferWorkerDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
