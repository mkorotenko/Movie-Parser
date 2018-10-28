import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AppService } from './app.service';
import { MovieCardComponent } from './movie-card/movie-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieListComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieCardComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [
    AppService
  ],
  exports: [ RouterModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
