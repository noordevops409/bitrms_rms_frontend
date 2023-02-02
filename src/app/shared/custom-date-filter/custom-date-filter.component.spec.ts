import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateFilterComponent } from './custom-date-filter.component';

describe('CustomDateFilterComponent', () => {
  let component: CustomDateFilterComponent;
  let fixture: ComponentFixture<CustomDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDateFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
