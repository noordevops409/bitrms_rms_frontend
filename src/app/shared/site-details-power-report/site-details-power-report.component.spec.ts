import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDetailsPowerReportComponent } from './site-details-power-report.component';

describe('SiteDetailsPowerReportComponent', () => {
  let component: SiteDetailsPowerReportComponent;
  let fixture: ComponentFixture<SiteDetailsPowerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteDetailsPowerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteDetailsPowerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
