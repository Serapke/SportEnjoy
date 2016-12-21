import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { SpottersJoinDirective } from '../../shared/spotters-join/spotters-join.directive';
import { ReversePipe } from "../../shared/reverse.pipe";

@Component({
	selector: 'ng-topPlaces',
	templateUrl: './spots-top.component.html',
	styleUrls: ['./spots-top.component.css'],
  pipes: [ ReversePipe ],
	directives: [
		ROUTER_DIRECTIVES,
		SpottersJoinDirective
	]
})
export class TopSpotsComponent {
	spots: ISpot[];
	errorMessage: string;
  noImage: string = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/defaults/test.png';

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
         error =>  this.errorMessage = <any>error
       );
	}

}
