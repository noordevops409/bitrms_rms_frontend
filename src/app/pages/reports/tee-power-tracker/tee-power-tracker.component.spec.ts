import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeePowerTrackerComponent } from './tee-power-tracker.component';

describe('TeePowerTrackerComponent', () => {
  let component: TeePowerTrackerComponent;
  let fixture: ComponentFixture<TeePowerTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeePowerTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeePowerTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
