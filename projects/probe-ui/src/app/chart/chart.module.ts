import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LeftAxisDirective } from './chart-axis/left-axis.directive';
import { BottomAxisDirective } from './chart-axis/bottom-axis.directive';
import { BottomTimeAxisDirective } from './chart-axis/bottom-time-axis.directive';

@NgModule({
  declarations: [
    ChartComponent,
    LeftAxisDirective,
    BottomAxisDirective,
    BottomTimeAxisDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChartComponent,
    LeftAxisDirective,
    BottomAxisDirective,
    BottomTimeAxisDirective
  ]
})
export class ChartModule { }
