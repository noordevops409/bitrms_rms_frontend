import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmCategoryComponent } from './alarm-category.component';

describe('AlarmCategoryComponent', () => {
  let component: AlarmCategoryComponent;
  let fixture: ComponentFixture<AlarmCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
