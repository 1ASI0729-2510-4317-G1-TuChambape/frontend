import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersMainComponent } from './offers-main.component';

describe('OffersMainComponent', () => {
  let component: OffersMainComponent;
  let fixture: ComponentFixture<OffersMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
