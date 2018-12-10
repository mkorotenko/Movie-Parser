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

const routes: Routes = [
  { path: '', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies/:id', component: MovieListComponent },
  { path: 'player', component: MoviePlayerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieCardComponent,
    MoviePlayerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AppService,
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
