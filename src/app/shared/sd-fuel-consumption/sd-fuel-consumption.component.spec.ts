import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdFuelConsumptionComponent } from './sd-fuel-consumption.component';

describe('SdFuelConsumptionComponent', () => {
  let component: SdFuelConsumptionComponent;
  let fixture: ComponentFixture<SdFuelConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdFuelConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdFuelConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
