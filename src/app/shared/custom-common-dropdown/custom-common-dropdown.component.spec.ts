import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommonDropdownComponent } from './custom-common-dropdown.component';

describe('CustomCommonDropdownComponent', () => {
  let component: CustomCommonDropdownComponent;
  let fixture: ComponentFixture<CustomCommonDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCommonDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCommonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
