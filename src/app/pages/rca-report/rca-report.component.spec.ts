import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaReportComponent } from './rca-report.component';

describe('RcaReportComponent', () => {
  let component: RcaReportComponent;
  let fixture: ComponentFixture<RcaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
