import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { TopSpotsComponent } from './spots/spots-top/spots-top.component';
import { SpottersComponent } from './spotters/spotters.component';
import { LoginComponent } from './login/login.component';
import { SpotAddComponent } from './spots/spot-add/spot-add.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewComponent } from './review/review.component';

@NgModule({
  declarations: [
    AppComponent,
    TopSpotsComponent,
    SpottersComponent,
    LoginComponent,
    SpotAddComponent,
    ProfileComponent,
    ReviewComponent
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
