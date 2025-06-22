import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTechniciansComponent } from './search-technicians.component';

describe('SearchTechniciansComponent', () => {
  let component: SearchTechniciansComponent;
  let fixture: ComponentFixture<SearchTechniciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTechniciansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTechniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
