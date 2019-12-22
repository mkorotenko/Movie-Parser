import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MoviePlayerMP4Component } from './movie-player-mp4.component';
import { UiCardModule, UiLayoutModule } from 'ui-futuristic';
import { SourceHlsComponent } from './source-hls/source-hls.component';

const routes: Routes = [
  { path: '', component: MoviePlayerMP4Component },
];

@NgModule({
  declarations: [ MoviePlayerMP4Component, SourceHlsComponent ],
  imports: [ 
    CommonModule,
    RouterModule.forChild(routes),
    UiCardModule,
    UiLayoutModule
  ],
  exports: [ MoviePlayerMP4Component ]
})
export class MoviePlayerMP4Module { }
