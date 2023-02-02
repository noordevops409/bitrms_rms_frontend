import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlannedEnergyComponent } from './add-planned-energy.component';

describe('AddPlannedEnergyComponent', () => {
  let component: AddPlannedEnergyComponent;
  let fixture: ComponentFixture<AddPlannedEnergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlannedEnergyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlannedEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
