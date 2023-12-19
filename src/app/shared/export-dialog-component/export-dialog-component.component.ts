import { Component, Input, OnChanges, SimpleChanges,OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog-component.component.html',
  styleUrls: ['./export-dialog-component.component.scss']
})
export class ExportDialogComponentComponent   {
  @Input() isDownloading: boolean | undefined;
  @Output() cancelExport: EventEmitter<void> = new EventEmitter<void>();
  public destroy$ = new Subject<void>();


  constructor(private dialogRef: MatDialogRef<ExportDialogComponentComponent>) {}

 

  onCancelClick(): void {
    this.dialogRef.close();
    this.cancelExport.emit();
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}