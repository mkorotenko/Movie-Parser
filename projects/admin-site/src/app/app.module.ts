import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { DBEditorModule } from './admin/db-editor/db-editor.module';
import { SourceParserModule } from './admin/source-parser/source-parser.module';
import { ServerManagerModule } from './admin/server-manager/server-manager.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ThreadsManagerComponent } from './admin/threads-manager/threads-manager.component';
const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ThreadsManagerComponent
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
    SourceParserModule,
    ServerManagerModule
  ],
  providers: [
    AdminService
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
