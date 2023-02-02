import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedEnergyComponent } from './planned-energy.component';

describe('PlannedEnergyComponent', () => {
  let component: PlannedEnergyComponent;
  let fixture: ComponentFixture<PlannedEnergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannedEnergyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
