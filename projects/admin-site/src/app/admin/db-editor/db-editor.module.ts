import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatInputModule, MatButtonModule,
  MatProgressBarModule, MatSelectModule
} from '@angular/material';

import { DBEditorComponent } from './db-editor.component';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { DBEditorService } from './db-editor.service';

@NgModule({
  declarations: [
    DBEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MonacoEditorModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  providers: [
    DBEditorService
  ],
  exports: [ DBEditorComponent ]
})
export class DBEditorModule { }
