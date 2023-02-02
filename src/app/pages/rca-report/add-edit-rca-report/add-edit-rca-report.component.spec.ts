import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRcaReportComponent } from './add-edit-rca-report.component';

describe('AddEditRcaReportComponent', () => {
  let component: AddEditRcaReportComponent;
  let fixture: ComponentFixture<AddEditRcaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRcaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRcaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
