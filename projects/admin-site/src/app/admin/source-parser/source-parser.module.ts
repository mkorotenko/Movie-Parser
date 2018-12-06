import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatInputModule, MatButtonModule,
  MatProgressBarModule, MatSelectModule
} from '@angular/material';

import { SourceParserComponent } from './source-parser.component';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { SourceParserService } from './source-parser.service';

@NgModule({
  declarations: [
    SourceParserComponent,
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
    SourceParserService
  ],
  exports: [ SourceParserComponent ]
})
export class SourceParserModule { }
