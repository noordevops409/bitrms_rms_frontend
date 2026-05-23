import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDialogComponentComponent } from './export-dialog-component.component';

describe('ExportDialogComponentComponent', () => {
  let component: ExportDialogComponentComponent;
  let fixture: ComponentFixture<ExportDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDialogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
