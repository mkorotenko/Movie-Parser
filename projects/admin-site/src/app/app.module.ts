import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTabsModule, MatInputModule, MatButtonModule,
  MatProgressBarModule, MatSelectModule
} from '@angular/material';

import { DBEditorModule } from './admin/db-editor/db-editor.module';
import { SourceParserModule } from './admin/source-parser/source-parser.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';

import { MonacoEditorModule } from 'ngx-monaco-editor';
const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MonacoEditorModule.forRoot(),
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    DBEditorModule,
    SourceParserModule
  ],
  providers: [
    AdminService
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
