import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultCategoryComponent } from './fault-category.component';

describe('FaultCategoryComponent', () => {
  let component: FaultCategoryComponent;
  let fixture: ComponentFixture<FaultCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaultCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
