import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDefsGlowDirective } from './chart-defs-glow.directive';

@NgModule({
    declarations: [
        ChartDefsGlowDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartDefsGlowDirective
    ]
})
export class ChartDefsGlowModule { }
