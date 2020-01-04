import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { UiCardModule } from 'ui-futuristic';
import {
    ChartModule,
    ChartLineModule,
    ChartPointsModule,
    ChartDefsGlowModule,
    ChartDefsGradientModule,
    ChartHintModule,
    ChartLoaderModule,
    ScaleXTimeModule
} from '../chart';
import { PipeCardComponent } from './pipe-card.component';

@NgModule({
    declarations: [
        PipeCardComponent
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        UiCardModule,
        ChartModule,
        ChartLineModule,
        ChartPointsModule,
        ChartDefsGlowModule,
        ChartDefsGradientModule,
        ChartHintModule,
        ChartLoaderModule,
        ScaleXTimeModule
    ],
    exports: [
        PipeCardComponent
    ]
})
export class PipeCardModule { }
