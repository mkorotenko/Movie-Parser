import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import {
  UiCardModule,
  UiLayoutModule,
  UiCheckboxModule,
  UiButtonModule,
  UiChartModule,
  UiChartDefsGlowModule,
  UiScaleXTimeModule,
  UiScaleYLinearModule,
  UiChartDefsGradientModule,
  UiChartLineModule,
  UiChartLoaderModule,
  UiChartHintModule
} from 'ui-futuristic';

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
    UiCheckboxModule,

    UiChartModule,
    UiChartDefsGlowModule,
    UiChartDefsGradientModule,
    UiScaleXTimeModule,
    UiScaleYLinearModule,
    UiChartLineModule,
    UiChartLoaderModule,
    UiChartHintModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
