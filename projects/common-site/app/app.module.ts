import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AppService } from './app.service';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HLSPlayerComponent } from './movie-player-hls/hls-player.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MovieListOutletComponent } from './movie-list-outlet/movie-list-outlet.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UiCardModule, UiButtonModule, UiOverlayModule } from 'ui-futuristic';

const routes: Routes = [
  { path: '', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies/:id', component: MovieListComponent },
  { path: 'player/:id/:source/:num', loadChildren: () => import('./movie-player-mp4/movie-player-mp4.module').then(m => m.MoviePlayerMP4Module) },
  { path: 'hls/:id/:num', component: HLSPlayerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieCardComponent,
    HLSPlayerComponent,
    MovieListOutletComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    NgxPaginationModule,
    UiCardModule,
    UiButtonModule,
    UiOverlayModule
  ],
  providers: [
    AppService,
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
