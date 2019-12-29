import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LeftAxisDirective } from './chart-axis/left-axis.directive';
import { BottomAxisDirective } from './chart-axis/bottom-axis.directive';

@NgModule({
  declarations: [
    ChartComponent,
    LeftAxisDirective,
    BottomAxisDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChartComponent,
    LeftAxisDirective,
    BottomAxisDirective
  ]
})
export class ChartModule { }
