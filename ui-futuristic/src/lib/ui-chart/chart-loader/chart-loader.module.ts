import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartLoaderDirective } from './chart-loader.directive';

@NgModule({
    declarations: [
        ChartLoaderDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartLoaderDirective
    ]
})
export class UiChartLoaderModule { }
