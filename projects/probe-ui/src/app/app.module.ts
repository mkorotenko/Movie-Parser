import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule, MatToolbarModule, MatMenuModule, MatDialogModule, MatInputModule,
  MatIconModule, MatButtonModule, MatSlideToggleModule, MatFormFieldModule, MatDatepickerModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { PipeCardComponent } from './pipe-card/pipe-card.component';
import { LocalStorageService } from './services/local-storage.service';
import { SocketService } from './pipe-card/socket.service';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { EditPipeDialogComponent } from './edit-pipe-dialog/edit-pipe-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    ChartComponent,
    PipeCardComponent,
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
