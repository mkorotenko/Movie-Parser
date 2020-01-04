import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LeftAxisDirective } from './chart-axis/left-axis.directive';
import { BottomAxisDirective } from './chart-axis/bottom-axis.directive';
import { BottomTimeAxisDirective } from './chart-axis/bottom-time-axis.directive';
import { RightAxisDirective } from './chart-axis/right-axis.directive';

@NgModule({
  declarations: [
    ChartComponent,
    LeftAxisDirective,
    RightAxisDirective,
    BottomAxisDirective,
    BottomTimeAxisDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChartComponent,
    LeftAxisDirective,
    RightAxisDirective,
    BottomAxisDirective,
    BottomTimeAxisDirective
  ]
})
export class ChartModule { }
