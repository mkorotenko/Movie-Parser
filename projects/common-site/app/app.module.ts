import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AppService } from './app.service';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MoviePlayerComponent } from './movie-player/movie-player.component';
import { HLSPlayerComponent } from './movie-player-hls/hls-player.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MovieListOutletComponent } from './movie-list-outlet/movie-list-outlet.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UiCardModule, UiButtonModule } from 'ui-futuristic';

const routes: Routes = [
  { path: '', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies/:id', component: MovieListComponent },
  { path: 'player/:file', component: MoviePlayerComponent },
  { path: 'hls/:id/:num', component: HLSPlayerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieCardComponent,
    MoviePlayerComponent,
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
    UiButtonModule
  ],
  providers: [
    AppService,
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
