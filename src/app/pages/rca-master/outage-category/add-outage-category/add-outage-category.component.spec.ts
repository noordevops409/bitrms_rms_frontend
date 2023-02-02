import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutageCategoryComponent } from './add-outage-category.component';

describe('AddOutageCategoryComponent', () => {
  let component: AddOutageCategoryComponent;
  let fixture: ComponentFixture<AddOutageCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutageCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
