import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatInputModule,
  MatIconModule, MatButtonModule, MatSlideToggleModule, MatFormFieldModule, MatDatepickerModule
} from '@angular/material';

import { UiLayoutModule } from 'ui-futuristic';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocalStorageService } from './services/local-storage.service';
import { SocketService } from './pipe-card/socket.service';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { EditPipeDialogComponent } from './edit-pipe-dialog/edit-pipe-dialog.component';

import { PipeCardModule } from './pipe-card/pipe-card.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    AppRoutingModule,
    HttpClientModule,
    PipeCardModule,
    UiLayoutModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    DashboardMenuComponent,
    EditPipeDialogComponent
  ],
  entryComponents: [
    EditPipeDialogComponent
  ],
  providers: [
    LocalStorageService,
    SocketService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
