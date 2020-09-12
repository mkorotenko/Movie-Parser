import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScaleXTimeDirective } from './scale-x-time.directive';

@NgModule({
    declarations: [
        ScaleXTimeDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ScaleXTimeDirective
    ]
})
export class UiScaleXTimeModule { }
