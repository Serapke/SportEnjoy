import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { SpotService } from '../spots/spot.service';
import { LoginService } from '../login/login.service';
import { UserService } from '../users/user.service';
import { ISpot } from '../spots/spot';
import { SearchFormComponent } from './search-form/search-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { SocialMediaDirective } from './social-media/social-media.directive';


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

	constructor(
		private _router: Router,
        private _spotService: SpotService,
		private _route: ActivatedRoute,
		private _userService: UserService,
		private _loginService: LoginService
    ) {}

	ngOnInit(): void {
		if ((document.body.clientWidth < 990) && (this.overlayHeight == 100)) {
			this.showBrand = false;
		}
		else {
			this.showBrand = true;
		}
		this._router.events.subscribe((event: Event) => {
			if(event instanceof NavigationEnd ){
			    console.log(event.url);
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
		this.city = buff.substring(0, buff.indexOf(';'));
		buff = buff.substring(buff.indexOf('=')+1).replace(/%20/g, ' ');
		this.category = buff.replace(/%C5%A1/g, 'š');
		console.log(this.city + " " + this.category);
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
		if ((document.body.clientWidth < 990) && (this.overlayHeight == 100)) {
			this.showBrand = false;
		}
		else {
			this.showBrand = true;
		}
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
				this.backgroundImage = '/sportenjoy/assets/images/spotter-background.jpg';
				break;
			case '/spots':
				this.backgroundImage = '/sportenjoy/assets/images/spotter-background.jpg';
				break;
			case '/spotters':
				this.backgroundImage = '/sportenjoy/assets/images/c6.jpg';
				break;
			case '/login':
				this.backgroundImage = '/sportenjoy/assets/images/c3.jpg';
				break;
			default:
				this.backgroundImage = '/sportenjoy/assets/images/header-background.jpg';
		}
	}

	showSearch(): boolean {
		if (this.path == '/' || this.path == '/top-places' || this.path == '/spotters' || this.path == '/spots')
			return true;
		return false;
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
	showMap(): boolean {
		if (this.path == '/spots')
			return true;
		return false;
	}
	showParams(): boolean {
		if (this.path && this.path.includes('location') && this.path.includes('category')) {
			return true;
		}
		return false;
	}
	showLogin(): boolean {
		if (this.path == '/login')
			return true;
		return false;
	}
	showRegister(): boolean {
		if (this.path == '/register')
			return true;
		return false;
	}
	showSocialMedia(): boolean {
		if (this.path == '/contact')
			return true;
		return false;
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
