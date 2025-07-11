import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPaymentCustomerComponent } from './project-payment-customer.component';

describe('ProjectPaymentCustomerComponent', () => {
  let component: ProjectPaymentCustomerComponent;
  let fixture: ComponentFixture<ProjectPaymentCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPaymentCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPaymentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
