import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReviewCustomerComponent } from './project-review-customer.component';

describe('ProjectReviewCustomerComponent', () => {
  let component: ProjectReviewCustomerComponent;
  let fixture: ComponentFixture<ProjectReviewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectReviewCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectReviewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
