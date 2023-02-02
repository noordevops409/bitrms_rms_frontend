import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridEnergyRunHoursComponent } from './hybrid-energy-run-hours.component';

describe('HybridEnergyRunHoursComponent', () => {
  let component: HybridEnergyRunHoursComponent;
  let fixture: ComponentFixture<HybridEnergyRunHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HybridEnergyRunHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HybridEnergyRunHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
