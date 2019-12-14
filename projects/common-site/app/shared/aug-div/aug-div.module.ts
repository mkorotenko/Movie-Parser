import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AugDivComponent } from './aug-div.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AugDivComponent
  ],
  exports: [
    AugDivComponent
  ]
})
export class AugDivModule { }
