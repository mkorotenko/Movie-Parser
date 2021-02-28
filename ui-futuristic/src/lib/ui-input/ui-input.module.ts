import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiInputComponent } from './ui-input.component';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [ UiInputComponent ],
  exports: [ UiInputComponent ]
})
export class UiInputModule { }
