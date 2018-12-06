import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatInputModule, MatButtonModule,
  MatProgressBarModule, MatSelectModule
} from '@angular/material';

import { ServerManagerComponent } from './server-manager.component';
import { ServerManagerService } from './server-manager.service';

@NgModule({
  declarations: [
    ServerManagerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  providers: [
    ServerManagerService
  ],
  exports: [ ServerManagerComponent ]
})
export class ServerManagerModule { }
