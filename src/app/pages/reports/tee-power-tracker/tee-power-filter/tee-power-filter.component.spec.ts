import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeePowerFilterComponent } from './tee-power-filter.component';

describe('TeePowerFilterComponent', () => {
  let component: TeePowerFilterComponent;
  let fixture: ComponentFixture<TeePowerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeePowerFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeePowerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
