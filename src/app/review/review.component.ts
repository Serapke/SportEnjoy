import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { SpotService } from '../spots/spot.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: './review.component.html',
	styleUrls: ['./review.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class ReviewComponent {
	spots: ISpot[];
	errorMessage: string;

	constructor(
		private _spotService: SpotService,
		private _router: Router) {}

	ngOnInit(): void {
		this.getSpotsForReview();
  }

	getSpotsForReview() {
		this._spotService.getSpotsForReview()
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

}
