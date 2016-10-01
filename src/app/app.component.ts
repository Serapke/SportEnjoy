import { Component } from '@angular/core';
import { SpotService } from './spots/spot.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { TextTransformService } from './shared/text-transform.service';
import { FileService } from './shared/file.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginService } from './login/login.service';
import { UserService } from './users/user.service';
import { LocationService } from './shared/location/location.service';

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
    ROUTER_DIRECTIVES
  ],
  providers: [
    SpotService,
    TextTransformService,
    UserService,
    FileService,
    LocationService
  ]
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(["en", "lt"]);
    translate.setDefaultLang('en');
    
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|lt/) ? browserLang : 'lt');
  }
}
