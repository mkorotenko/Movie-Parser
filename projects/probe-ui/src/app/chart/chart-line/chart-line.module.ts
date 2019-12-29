import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartLineDirective } from './chart-line.directive';

@NgModule({
    declarations: [
        ChartLineDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartLineDirective
    ]
})
export class ChartLineModule { }
