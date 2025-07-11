import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsCustomerComponent } from './project-details-customer.component';

describe('ProjectDetailsCustomerComponent', () => {
  let component: ProjectDetailsCustomerComponent;
  let fixture: ComponentFixture<ProjectDetailsCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
