import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyReportComponent } from './hourly-report.component';

describe('HourlyReportComponent', () => {
  let component: HourlyReportComponent;
  let fixture: ComponentFixture<HourlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourlyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
