import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridPowerTrackerComponent } from './hybrid-power-tracker.component';

describe('HybridPowerTrackerComponent', () => {
  let component: HybridPowerTrackerComponent;
  let fixture: ComponentFixture<HybridPowerTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HybridPowerTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HybridPowerTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
