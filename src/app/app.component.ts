import { Component } from '@angular/core';
import { SpotService } from './spots/spot.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { TextTransformService } from './shared/text-transform.service';
import { FileService } from './shared/file.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginService } from './login/login.service';
import { UserService } from './users/user.service';
import { LocationService } from './shared/location/location.service';
import { MapService } from './shared/map/map.service';
import { GoogleMapDirective } from './shared/map/map.directive';
import { GoogleMapMarkerDirective } from './shared/map/map-marker.directive';

@Component({
  selector: 'app-root',
  template: `
    <ng-header></ng-header>
    <router-outlet></router-outlet>
    <ng-footer></ng-footer>
  `,
  directives: [
    HeaderComponent,
    FooterComponent,
    ROUTER_DIRECTIVES,
    GoogleMapDirective, 
    GoogleMapMarkerDirective
  ],
  providers: [
    SpotService,
    TextTransformService,
    UserService,
    FileService,
    LocationService,
    MapService
  ]
})
export class AppComponent {

}
