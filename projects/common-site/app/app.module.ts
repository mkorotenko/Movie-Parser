import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AppService } from './app.service';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

// const monacoConfig: NgxMonacoEditorConfig = {
//   baseUrl: 'app-name/assets', // configure base path for monaco editor
//   defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
//   onMonacoLoad: () => {
//     console.log((<any>window).monaco);
//   } // here monaco object will be available as window.monaco use this function to extend monaco editor functionality.
// };

const routes: Routes = [
  { path: '', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies', redirectTo: '/movies/1', pathMatch: 'full' },
  { path: 'movies/:id', component: MovieListComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieCardComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [
    AppService,
    AdminService
  ],
  exports: [ RouterModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
