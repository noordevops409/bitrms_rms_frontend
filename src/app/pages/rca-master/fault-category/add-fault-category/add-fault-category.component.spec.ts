import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaultCategoryComponent } from './add-fault-category.component';

describe('AddFaultCategoryComponent', () => {
  let component: AddFaultCategoryComponent;
  let fixture: ComponentFixture<AddFaultCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFaultCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaultCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
