import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { NgxPaginationModule } from 'ngx-pagination';
import { UiCardModule, UiButtonModule, UiOverlayModule } from 'ui-futuristic';

import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieListOutletComponent } from './movie-list-outlet/movie-list-outlet.component';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { MovieSortComponent } from './movie-sort/movie-sort.component';
import { HomeComponent } from './projects/bldc-driver/src/app/home/home.component';

const routes: Routes = [
    { path: '', redirectTo: '/movies/1', pathMatch: 'full' },
    { path: 'movies', redirectTo: '/movies/1', pathMatch: 'full' },
    { path: 'movies/:id', component: MovieListComponent },
    { path: 'player', loadChildren: () => import('./movie-player/movie-player.module').then(m => m.MoviePlayerModule) }
];

@NgModule({
    declarations: [
        AppComponent,
        MovieListComponent,
        MovieCardComponent,
        MovieListOutletComponent,
        MovieSearchComponent,
        MovieSortComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatInputModule,
        NgxPaginationModule,
        UiCardModule,
        UiButtonModule,
        UiOverlayModule
    ],
    providers: [
        AppService,
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
