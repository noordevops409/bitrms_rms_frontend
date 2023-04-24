import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerReportComponent } from './power-report.component';

describe('PowerReportComponent', () => {
  let component: PowerReportComponent;
  let fixture: ComponentFixture<PowerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
