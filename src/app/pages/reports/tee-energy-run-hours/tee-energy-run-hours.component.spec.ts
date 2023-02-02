import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeeEnergyRunHoursComponent } from './tee-energy-run-hours.component';

describe('TeeEnergyRunHoursComponent', () => {
  let component: TeeEnergyRunHoursComponent;
  let fixture: ComponentFixture<TeeEnergyRunHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeeEnergyRunHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeeEnergyRunHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
