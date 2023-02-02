import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCategoryComponent } from './issue-category.component';

describe('IssueCategoryComponent', () => {
  let component: IssueCategoryComponent;
  let fixture: ComponentFixture<IssueCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
