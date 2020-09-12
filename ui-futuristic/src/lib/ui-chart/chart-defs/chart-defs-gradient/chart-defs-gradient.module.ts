import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDefsGradientDirective } from './chart-defs-gradient.directive';

@NgModule({
    declarations: [
        ChartDefsGradientDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartDefsGradientDirective
    ]
})
export class UiChartDefsGradientModule { }
