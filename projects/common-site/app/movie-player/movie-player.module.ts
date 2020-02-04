import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MoviePlayerSimpleComponent } from './simple/movie-player-simple.component';
import { MoviePlayerComplexComponent } from './complex/movie-player-complex.component';
import { UiCardModule, UiLayoutModule, UiTabsModule } from 'ui-futuristic';
import { SourceHlsComponent } from './source-hls/source-hls.component';
import { SourceFlvComponent } from './source-flv/source-flv.component';

const routes: Routes = [
    { path: ':id/watch', component: MoviePlayerComplexComponent },
    { path: ':id/:source/:num', component: MoviePlayerSimpleComponent },
];

@NgModule({
    declarations: [
        MoviePlayerSimpleComponent,
        MoviePlayerComplexComponent,
        SourceHlsComponent,
        SourceFlvComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        UiCardModule,
        UiLayoutModule,
        UiTabsModule
    ]
})
export class MoviePlayerModule { }
