import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutageCategoryComponent } from './outage-category.component';

describe('OutageCategoryComponent', () => {
  let component: OutageCategoryComponent;
  let fixture: ComponentFixture<OutageCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutageCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
