import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartPointsDirective } from './chart-points.directive';

@NgModule({
    declarations: [
        ChartPointsDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartPointsDirective
    ]
})
export class UiChartPointsModule { }
