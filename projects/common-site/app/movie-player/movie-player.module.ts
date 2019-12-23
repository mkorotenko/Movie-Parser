import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MoviePlayerComponent } from './movie-player.component';
import { UiCardModule, UiLayoutModule } from 'ui-futuristic';
import { SourceHlsComponent } from './source-hls/source-hls.component';

const routes: Routes = [
  { path: '', component: MoviePlayerComponent },
];

@NgModule({
  declarations: [ MoviePlayerComponent, SourceHlsComponent ],
  imports: [ 
    CommonModule,
    RouterModule.forChild(routes),
    UiCardModule,
    UiLayoutModule
  ],
  exports: [ MoviePlayerComponent ]
})
export class MoviePlayerModule { }
