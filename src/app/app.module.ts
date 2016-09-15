import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { LoginService } from './login/login.service';

import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { SpotsComponent } from './spots/spots.component';
import { SpotDetailComponent } from './spots/spot-detail/spot-detail.component';
import { TopSpotsComponent } from './spots/spots-top/spots-top.component';
import { SpottersComponent } from './spotters/spotters.component';
import { LoginComponent } from './login/login.component';
import { SpotAddComponent } from './spots/spot-add/spot-add.component';
import { SpotUpdateComponent } from './spots/spot-update/spot-update.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewComponent } from './review/review.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';


@NgModule({
  declarations: [
    AppComponent,
    TopSpotsComponent,
    SpottersComponent,
    LoginComponent,
    SpotAddComponent,
    SpotUpdateComponent,
    ProfileComponent,
    ReviewComponent,
    UsersComponent,
    UserComponent,
    SpotDetailComponent,
    SpotsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBGMkgxkPh9OchfxtnYFAB2m_SqnuKI5dM'
    // })
  ],
  providers: [
    appRouterProviders,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
