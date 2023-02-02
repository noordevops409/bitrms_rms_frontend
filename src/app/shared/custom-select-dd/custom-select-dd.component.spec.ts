import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectDdComponent } from './custom-select-dd.component';

describe('CustomSelectDdComponent', () => {
  let component: CustomSelectDdComponent;
  let fixture: ComponentFixture<CustomSelectDdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSelectDdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
