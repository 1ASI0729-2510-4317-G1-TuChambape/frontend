import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferActivePageComponent } from './offer-active-page.component';

describe('OfferActivePageComponent', () => {
  let component: OfferActivePageComponent;
  let fixture: ComponentFixture<OfferActivePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferActivePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferActivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
