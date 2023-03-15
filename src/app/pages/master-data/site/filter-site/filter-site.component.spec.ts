import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSiteComponent } from './filter-site.component';

describe('FilterSiteComponent', () => {
  let component: FilterSiteComponent;
  let fixture: ComponentFixture<FilterSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
