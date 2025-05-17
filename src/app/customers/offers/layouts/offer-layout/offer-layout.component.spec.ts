import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLayoutComponent } from './offer-layout.component';

describe('OfferLayoutComponent', () => {
  let component: OfferLayoutComponent;
  let fixture: ComponentFixture<OfferLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
