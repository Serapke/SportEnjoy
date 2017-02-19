import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../login/login.service';
import { SearchFormComponent } from './search-form/search-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { SocialMediaDirective } from './social-media/social-media.directive';
import { TextTransformService } from '../shared/text-transform.service';

@Component({
  selector: 'ng-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    SearchFormComponent,
    LoginFormComponent,
    RegisterFormComponent,
    SocialMediaDirective
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub: any;
  path: string = '';
  navbarClass: boolean = false;
  showBrand: boolean = true;
  overlayHeight: number = 0;
  backgroundImage: string;
  categories: string[];
  errorMessage: string;
  category: string = '';
  city: string = '';
  page: number = 1;

  constructor(
    private _router: Router,
    private _textTransformService: TextTransformService,
    private _loginService: LoginService
    ) {}

  ngOnInit(): void {
    this.showBrand = !((document.body.clientWidth < 990) && (this.overlayHeight == 100));
    this._router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd ){
        this.path = event.url;
        this.errorMessage = '';
      }
      if (this.path.includes('location') && this.path.includes('category')) {
        this.parseParams(this.path);
      }
      this.checkBgImage();
    });
  }

  parseParams(path: string): void {
    let buff = path.substring(path.indexOf('=')+1);
    this.city = this._textTransformService.escapeCharacters(buff.substring(0, buff.indexOf(';')));
    buff = buff.substring(buff.indexOf('=')+1);
    this.category = this._textTransformService.escapeCharacters(buff.substring(0, buff.indexOf(';')));
    buff = buff.substring(buff.indexOf('=')+1);
    this.page = parseInt(buff);
    console.log(this.city + " " + this.category + " " + this.page);
  }

  onLogout() {
    this._loginService.logout();
    this._router.navigate(['/spots']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  track(event) {
    let t = document.body.scrollTop;
    t > 15 ? this.navbarClass = true : this.navbarClass=false;
    // if using mobile or tablet and opened menu hide brand
    this.showBrand = !((document.body.clientWidth < 990) && (this.overlayHeight == 100));
  }

  checkBgImage() {
    switch(this.path) {
      case '/':
        this.backgroundImage = '/sportenjoy/assets/images/c2.jpg';
        break;
      case '/top-places':
        this.backgroundImage = '/sportenjoy/assets/images/c2.jpg';
        break;
      case '/spot':
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/main-background.jpg';
        break;
      case '/spots':
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/main-background.jpg';
        break;
      case '/spotters':
        this.backgroundImage = '/sportenjoy/assets/images/c6.jpg';
        break;
      case '/login':
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/login-background.jpg';
        break;
      default:
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/main-background.jpg';
    }
  }

  showSearch(): boolean {
    return this.path == '/' || this.path == '/top-places' || this.path == '/spotters' || this.path == '/spots';

  }
  isLoggedIn(): boolean {
    return this._loginService.isLoggedIn();
  }
  isModerator(): boolean {
    return this._loginService.isModerator();
  }
  isAdmin(): boolean {
    return this._loginService.isAdmin();
  }

  showParams(): boolean {
    return !!(this.path &&
    this.path.includes('/spots') &&
    this.path.includes('location') &&
    this.path.includes('category'));

  }
  showLogin(): boolean {
    return this.path == '/login';

  }
  showRegister(): boolean {
    return this.path == '/register';
  }
  showSocialMedia(): boolean {
    return this.path == '/contact';

  }

  showOverlay(): void {
    console.log("Show overlay");
    this.overlayHeight = 100;
    this.showBrand = false;
  }

  hideOverlay(): void {
    console.log("Hide overlay");
    this.overlayHeight = 0;
    this.showBrand = true;
  }
}
