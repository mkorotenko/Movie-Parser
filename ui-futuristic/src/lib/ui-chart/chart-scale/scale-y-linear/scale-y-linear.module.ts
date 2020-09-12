import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScaleYLinearDirective } from './scale-y-linear.directive';

@NgModule({
    declarations: [
        ScaleYLinearDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ScaleYLinearDirective
    ]
})
export class UiScaleYLinearModule { }
