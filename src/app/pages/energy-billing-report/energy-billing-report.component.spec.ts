import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyBillingReportComponent } from './energy-billing-report.component';

describe('EnergyBillingReportComponent', () => {
  let component: EnergyBillingReportComponent;
  let fixture: ComponentFixture<EnergyBillingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyBillingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyBillingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
