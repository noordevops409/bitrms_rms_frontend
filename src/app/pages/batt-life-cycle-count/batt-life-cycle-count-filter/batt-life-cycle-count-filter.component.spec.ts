import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaReportFilterComponent } from './batt-life-cycle-count-filter.component';

describe('RcaReportFilterComponent', () => {
  let component: RcaReportFilterComponent;
  let fixture: ComponentFixture<RcaReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaReportFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcaReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
