import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { SpotService } from '../spots/spot.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class ProfileComponent {
	spots: ISpot[];
	errorMessage: string;

	constructor(
		private _spotService: SpotService,
		private _router: Router) {}

	ngOnInit(): void {
		this.getCreatedSpots();
  }

	getCreatedSpots() {
		this._spotService.getCreatedSpots()
			.subscribe(
				spots => {
					this.spots = spots;
				},
				error =>  {
					this.errorMessage = <any>error;
					console.log(this.errorMessage)
				}
			);
	}

	spotStatus(approved: boolean, reviewed: boolean): string {
		if (reviewed && approved) {
			return "Patvirtinta";
		}
		else if (reviewed && !approved) {
			return "Atmesta";
		}
		else {
			return "Neperžiūrėta";
		}
	}

}
