import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgMaintenanceAlertComponent } from './dg-maintenance-alert.component';

describe('DgMaintenanceAlertComponent', () => {
  let component: DgMaintenanceAlertComponent;
  let fixture: ComponentFixture<DgMaintenanceAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgMaintenanceAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DgMaintenanceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
