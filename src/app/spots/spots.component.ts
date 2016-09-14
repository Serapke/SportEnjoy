import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import 'rxjs/Rx';
// import { Location } from '../shared/location/location';
// import { LocationService } from '../shared/location/location.service';
import { SpotService } from './spot.service';
import { Observable } from 'rxjs/Observable';
import { ISpot } from './spot';
import { SpotFilterPipe } from './spot-filter.pipe';
// import { GOOGLE_MAPS_DIRECTIVES } from 'angular2-google-maps/core';

@Component({
	templateUrl: './spots.component.html',
	styleUrls: ['./spots.component.css'],
	pipes: [SpotFilterPipe],
	directives: [
		ROUTER_DIRECTIVES
		// GOOGLE_MAPS_DIRECTIVES
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
	defaultImage: string = '/testas/assets/images/spotter-background.jpg';
	lat: number = 54.9;
	lng: number = 23.9;

	constructor(
		private _spotService: SpotService,
		private _route: ActivatedRoute,
		// private _locationService: LocationService,
	  private _router: Router) {
		}

	toggleSearchProperties(): void {
		if (this.showSearchProperties == 0) {
			this.showSearchProperties = this.searchPropertiesHeight();
			this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
			return;
		}
		this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
		this.showSearchProperties = 0;
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
						this.getParams();
					 },
        	 error =>  {
						 this.errorMessage = <any>error;
						 console.log(this.errorMessage)
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
		// this._locationService.getLocation()
		// 	.subscribe(position => {
		// 		console.log("User position is:\nLatitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
		// 	}, error => {
		// 		console.error("Error while trying to get user location");
		// 	});
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

		// this.getLocalSpots();
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
		let spots = this.particularSpots;
		let sortedSpotters = spots.sort((a, b) => {
			if (a.title > b.title) {
				return 1;
			}
			if (a.title < b.title) {
				return -1;
			}
			return 0;
		});
		this.particularSpots = sortedSpotters;
	}

	sortSpotsByRating(): void {
		this.selectedSorting = 'rating';
		let spots = this.particularSpots;
		let sortedSpotters = spots.sort((a, b) => {
			if (a.rating < b.rating) {
				return 1;
			}
			if (a.rating > b.rating) {
				return -1;
			}
			return 0;
		});
		this.particularSpots = sortedSpotters;
	}

	sortSpotsByBeenHere(): void {
		this.selectedSorting = 'beenHere';
		let spots = this.particularSpots;
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
	}

	searchPropertiesHeight(): number {
		if (window.innerWidth > 990) {
			return 283;
		}
		return 710;
	}

	gotoSpotters() {
		this._router.navigate(['/spotters']);
	}
}
