import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UiButtonModule, UiInputModule, UiLayoutModule } from 'ui-futuristic';

const UI_LIB = [
  UiLayoutModule,
  UiButtonModule,
  UiInputModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ...UI_LIB
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
