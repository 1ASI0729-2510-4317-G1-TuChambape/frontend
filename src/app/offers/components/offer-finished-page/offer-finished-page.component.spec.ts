import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFinishedPageComponent } from './offer-finished-page.component';

describe('OfferFinishedPageComponent', () => {
  let component: OfferFinishedPageComponent;
  let fixture: ComponentFixture<OfferFinishedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFinishedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFinishedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
