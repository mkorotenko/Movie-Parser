import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiPipesModule } from '../pipes/pipes.module';
import { UiCardComponent } from './ui-card.component';

@NgModule({
  imports: [ CommonModule, UiPipesModule ],
  declarations: [ UiCardComponent ],
  exports: [ UiCardComponent ]
})
export class UiCardModule { }
