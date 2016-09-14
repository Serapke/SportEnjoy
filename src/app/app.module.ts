import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { TopSpotsComponent } from './spots/spots-top/spots-top.component';
import { SpottersComponent } from './spotters/spotters.component';
import { LoginComponent } from './login/login.component';
import { SpotAddComponent } from './spots/spot-add/spot-add.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewComponent } from './review/review.component';
import { SpotUpdateComponent } from './spots/spot-update/spot-update.component';

@NgModule({
  declarations: [
    AppComponent,
    TopSpotsComponent,
    SpottersComponent,
    LoginComponent,
    SpotAddComponent,
    SpotUpdateComponent,
    ProfileComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD5y0o5k0OthjnTSgsSrcHueyrPrST-U38'
    })
  ],
  providers: [
    appRouterProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
