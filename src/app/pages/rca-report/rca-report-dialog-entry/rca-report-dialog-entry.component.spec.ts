import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaReportDialogEntryComponent } from './rca-report-dialog-entry.component';

describe('RcaReportDialogEntryComponent', () => {
  let component: RcaReportDialogEntryComponent;
  let fixture: ComponentFixture<RcaReportDialogEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaReportDialogEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaReportDialogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
