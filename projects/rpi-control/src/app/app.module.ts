import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { UiCardModule, UiLayoutModule, UiCheckboxModule, UiButtonModule } from 'ui-futuristic';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    UiCardModule,
    UiButtonModule,
    UiLayoutModule,
    UiCheckboxModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
