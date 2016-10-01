import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { SpotService } from '../spots/spot.service';
import { TextTransformService } from '../shared/text-transform.service';

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
		private _textTransformService: TextTransformService,
		private _router: Router) {}

	ngOnInit(): void {
		this.getSpotsForReview();
	}

	prettify(word: string): string {
		return this._textTransformService.capitalize(word);
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
