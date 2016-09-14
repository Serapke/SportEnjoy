import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { TopSpotsComponent } from './spots/spots-top/spots-top.component';

@NgModule({
  declarations: [
    AppComponent,
    TopSpotsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    appRouterProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
