import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, Event, NavigationEnd } from '@angular/router';
import { LoginService } from '../login/login.service';
import { SearchFormComponent } from './search-form/search-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { TextTransformService } from '../shared/text-transform.service';

@Component({
  selector: 'ng-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    SearchFormComponent,
    LoginFormComponent,
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub: any;
  path: string = '';
  navbarClass: boolean = false;
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
    document.body.clientWidth < 768 ? this.navbarClass=true : this.navbarClass=false;
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
  }

  onLogout() {
    this._loginService.logout();
    this._router.navigate(['/spots']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    let t = document.body.scrollTop;
    if (t > 15 || document.body.clientWidth < 768) {
      this.navbarClass = true;
    } else {
      this.navbarClass = false;
    }
  }

  checkBgImage() {
    switch(this.path) {
      case '/login':
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/login-background.jpg';
        break;
      default:
        this.backgroundImage = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/background-images/main-background.jpg';
    }
  }

  showSearch(): boolean {
    return this.path == '/' || this.path == '/top-places' || this.path == '/spotters' || this.path == '/spots'
                            || this.path.includes('spots');

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


  showLogin(): boolean {
    return this.path == '/login';

  }

  showOverlay(): void {
    console.log("Show overlay");
    this.overlayHeight = 100;
  }

  hideOverlay(): void {
    console.log("Hide overlay");
    this.overlayHeight = 0;
  }
}
