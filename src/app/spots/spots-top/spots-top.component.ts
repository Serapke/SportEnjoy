import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: './spots-top.component.html',
	styleUrls: ['./spots-top.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class TopSpotsComponent {
	spots: ISpot[];
	errorMessage: string;
	defaultImage: string = '/sportenjoy/assets/images/spotter-background.jpg';

	constructor(
		private _spotService: SpotService,
		private _router: Router) {}

	ngOnInit(): void {
		this.getPopularSpots();
  }

	searchSpotLocation(city: string) {
		this._router.navigate(['/spots',  { location: city }]);
	}

	getPopularSpots(): void {
		this._spotService.getTopSpots()
				 .subscribe(
					 spots => this.spots = spots,
					 error =>  this.errorMessage = <any>error);
	}

}
