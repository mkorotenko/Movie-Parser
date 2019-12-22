import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviePlayerComponent } from './movie-player.component';

@NgModule({
  declarations: [ MoviePlayerComponent ],
  imports: [ CommonModule ],
  exports: [ MoviePlayerComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MoviePlayerModule { }
