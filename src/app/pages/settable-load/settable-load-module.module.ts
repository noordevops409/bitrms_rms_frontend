import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettableLoadComponent } from './settable-load.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    SettableLoadComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
  ],
  exports: [
    SettableLoadComponent
  ]
})
export class SettableLoadModule { }
