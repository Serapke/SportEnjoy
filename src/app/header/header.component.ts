import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { SpotService } from '../spots/spot.service';
import { LoginService } from '../login/login.service';
import { UserService } from '../users/user.service';
import { ISpot } from '../spots/spot';
import { SearchResult } from './search-results';

@Component({
	selector: 'ng-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent implements OnInit, OnDestroy {
	sub: any;
	path: string = '';
	navbarClass: boolean = false;
	showBrand: boolean = true;
	overlayHeight: number = 0;
	rotatedDropdownArrow: boolean = false;
	backgroundImage: string;
	categories: string[];
	cities: string[];
	spots: ISpot[];
	category: string = '';
	city: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	errorMessage: string;

	model = new SearchResult('', '');

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
		this.getSpots();
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
		buff = buff.substring(path.indexOf('=')+1).replace(/%20/g, ' ');
		this.category = buff.replace(/%C5%A1/g, 'š');
		console.log(this.city + " " + this.category);
	}

	onSubmit() {
		this.city = this.model.location;
		this._router.navigate(['/spots',  { location: this.city, category: this.category }]);
	}
	onLogin() {
		this._loginService.login(this.email, this.password)
				.subscribe(
					result => {
				      if (result) {
				        this._router.navigate(['/profile']);
				      }
					},
					error => this.errorMessage = error
				);
	}
	onRegister() {
		this._userService.createUser(this.email, this.password, this.passwordConfirmation)
				.subscribe(
					result => {
						if (result) {
							this.onLogin();
						}
					},
					error => {
							this.errorMessage = error
					}
				)
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

	getSpots(): void {
		this._spotService.getSpots()
				 .subscribe(
					 spots => {
						 this.spots = spots;
						 this.categories = this._spotService.getCategories(this.spots);
						 this.cities = this._spotService.getCities(this.spots);
					 },
					 error =>  this.errorMessage = <any>error);
	}
	toggleCategories(): void {
		this.rotatedDropdownArrow = !this.rotatedDropdownArrow;
	}

	saveCategory(category: string): void {
		this.category = category;
		this.model.category = this.category.toLowerCase();
		this.rotatedDropdownArrow = !this.rotatedDropdownArrow;
	}

	checkBgImage() {
		switch(this.path) {
			case '/':
				this.backgroundImage = '/testas/assets/images/c2.jpg';
				break;
			case '/top-places':
				this.backgroundImage = '/testas/assets/images/c2.jpg';
				break;
			case '/spot':
				this.backgroundImage = '/testas/assets/images/spotter-background.jpg';
				break;
			case '/spots':
				this.backgroundImage = '/testas/assets/images/spotter-background.jpg';
				break;
			case '/spotters':
				this.backgroundImage = '/testas/assets/images/c6.jpg';
				break;
			case '/login':
				this.backgroundImage = '/testas/assets/images/c3.jpg';
				break;
			default:
				this.backgroundImage = '/testas/assets/images/header-background.jpg';
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
