import { Component, OnInit, OnDestroy, HostListener, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import 'rxjs/Rx';
import { LocationService } from '../shared/location/location.service';
import { SpotService } from './spot.service';
import { Observable } from 'rxjs/Observable';
import { ISpot } from './spot';
import { SpotFilterPipe } from './spot-filter.pipe';
import { SebmGoogleMapInfoWindow, SebmGoogleMap} from 'angular2-google-maps/core';

@Component({
	templateUrl: './spots.component.html',
	styleUrls: ['./spots.component.css'],
	pipes: [SpotFilterPipe],
	directives: [
		ROUTER_DIRECTIVES,
		SebmGoogleMap
	]
})
export class SpotsComponent implements OnInit, OnDestroy{
	private sub: any;
	showSearchProperties: number = 0;
	rotatedSearchPropertiesArrow: boolean = false;
	allSpots: ISpot[];
	particularSpots: ISpot[];
	categories: string[];
	cities: string[];
	errorMessage: string;
	selectedCity: string = '';
	selectedCategory: string = '';
	selectedSorting: string = '';
	listFilter: string = '';
	defaultImage: string = '/sportenjoy/assets/images/spotter-background.jpg';
	lat: number = 54.8;
	lng: number = 23.9;
	zoom: number = 6;
	mapDraggable: boolean;
	showSortProperties: boolean = false;
	selectedSpot: ISpot;
	openInfoWindow: SebmGoogleMapInfoWindow;
	

	constructor(
		private _spotService: SpotService,
		private _route: ActivatedRoute,
		private _locationService: LocationService,
		private _ngZone: NgZone,
	  	private _router: Router
	) {	
		this.mapDraggable = document.body.clientWidth < 992 ? false : true;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.mapDraggable = event.target.innerWidth < 992 ? false : true;
	}

	toggleSearchProperties(): void {
		if (this.showSearchProperties == 0) {
			this.showSearchProperties = 189;
			this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
			return;
		}
		this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
		this.showSearchProperties = 0;
	}
	clickedMarker(spot: ISpot, i, infoWindow): void {
		console.log(infoWindow);
		this.selectedSpot = spot;
		this.lat = this.selectedSpot.latitude;
		this.lng = this.selectedSpot.longitude;
		this.makeSelectedSpotFirst(i);

		if (this.openInfoWindow && this.openInfoWindow !== infoWindow){
			this.openInfoWindow.close();
		}
		this.openInfoWindow = infoWindow;
	}
	toggleDraggability(): void {
		this.mapDraggable = !this.mapDraggable;
	}
	toggleSortProperties(): boolean {
		return this.showSortProperties = !this.showSortProperties;
	}
	gotoDetail(spot: ISpot) {
		this._router.navigate(['/spot', spot.id]);
	}
	getAllSpots(): void {
		this._spotService.getSpots()
         .subscribe(
           spots => {
				this.allSpots = spots;
				this.particularSpots = spots;
				this.categories = this._spotService.getCategories(this.allSpots);
				this.cities = this._spotService.getCities(this.allSpots);
				this.sortSpotsByRating();
				this.selectedSorting = 'rating';
				this.getParams();
			},
			error =>  {
				this.errorMessage = <any>error;
				console.log(this.errorMessage);
			}
		);
	}
	getAllCategorySpots(): void {
		this.selectedCategory = '';
		this.particularSpots = this._spotService.getParticularCitySpots(this.allSpots, this.selectedCity);
	}
	getAllCitySpots(): void {
		this.selectedCity = '';
		this.particularSpots = this._spotService.getParticularCategorySpots(this.allSpots, this.selectedCategory);
	}

	getLocalSpots(): void {
		this._locationService.getUserLocation()
			.subscribe(position => {
				console.log("User position is:\nLatitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
			}, error => {
				console.error("Error while trying to get user location");
			});
	}

	getParticularSpots(category: string, city: string) {
		console.log("Get particular spots: "  + category + " " + city);
		if (category.length != 0 && category !== this.selectedCategory) {
			this.getAllCategorySpots();
			this.selectedCategory = category;
		}
		if (city.length != 0 && city !== this.selectedCity) {
			this.getAllCitySpots();
			this.selectedCity = city;
		}

		this.particularSpots = this._spotService.getParticularCategorySpots(this.particularSpots, this.selectedCategory);
		this.particularSpots = this._spotService.getParticularCitySpots(this.particularSpots, this.selectedCity);
	}

	ngOnInit(): void {
		this.getAllSpots();
		this.getLocalSpots();
  	}

	getParams():void {
		this.sub = this._route
			.params
			.subscribe(params => {
				this.selectedCity = params['location'];
				this.selectedCategory = params['category'];
				if (this.selectedCategory) {
					this.selectedCategory = this.selectedCategory.replace(/%C5%A1/g, 'š');
					this.selectedCategory = this.selectedCategory.replace(/g%20/g, ' ');
				}
				this.selectedCity = this.selectedCity ? this.selectedCity : '';
				this.selectedCategory = this.selectedCategory ? this.selectedCategory : '';
				if (this.selectedCity != '' && this.selectedCategory != '') {
					this.getParticularSpots(this.selectedCategory, this.selectedCity);
				}
				else { this.particularSpots = this.allSpots }
			});
	}

	ngOnDestroy() {
    this.sub.unsubscribe();
  }

	sortSpotsByAlphabet(): void {
		this.selectedSorting = 'alphabet';
		let spots = this.selectedSpot ? this.particularSpots.slice(1) : this.particularSpots;
		let sortedSpotters = spots.sort((a, b) => {
			if (this.selectedSpot && (a.id == this.selectedSpot.id || b.id == this.selectedSpot.id))
				return 0;
			if (a.title > b.title) {
				return 1;
			}
			if (a.title < b.title) {
				return -1;
			}
			return 0;
		});
		this.particularSpots = sortedSpotters;
		if (this.selectedSpot) this.particularSpots.unshift(this.selectedSpot);
	}

	sortSpotsByRating(): void {
		this.selectedSorting = 'rating';
		let spots = this.selectedSpot ? this.particularSpots.slice(1) : this.particularSpots;
		let sortedSpotters = spots.sort((a, b) => {
			if (this.selectedSpot && (a.id == this.selectedSpot.id || b.id == this.selectedSpot.id))
				return 0;
			if (a.rating < b.rating) {
				return 1;
			}
			if (a.rating > b.rating) {
				return -1;
			}
			return 0;
		});
		this.particularSpots = sortedSpotters;
		if (this.selectedSpot) this.particularSpots.unshift(this.selectedSpot);
	}

	sortSpotsByBeenHere(): void {
		this.selectedSorting = 'beenHere';
		let spots = this.selectedSpot ? this.particularSpots.slice(1) : this.particularSpots;
		let sortedSpotters = spots.sort((a, b) => {
			if (a.beenHere < b.beenHere) {
				return 1;
			}
			if (a.beenHere > b.beenHere) {
				return -1;
			}
			return 0;
		});
		this.particularSpots = sortedSpotters;
		if (this.selectedSpot) this.particularSpots.unshift(this.selectedSpot);
	}

	makeSelectedSpotFirst(i) {
		let first = this.particularSpots[0];
		this.particularSpots[0] = this.selectedSpot;
		this.particularSpots[i] = first;
	}

	gotoSpotters() {
		this._router.navigate(['/spotters']);
	}
}
