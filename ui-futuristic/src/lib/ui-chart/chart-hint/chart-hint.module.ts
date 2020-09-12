import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartHintDirective } from './chart-hint.directive';

@NgModule({
    declarations: [
        ChartHintDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartHintDirective
    ]
})
export class UiChartHintModule { }
