import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { IUser } from '../users/user';
import { SpotService } from '../spots/spot.service';
import { LoginService } from '../login/login.service';
import { TextTransformService } from '../shared/text-transform.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class ProfileComponent {
	user: IUser;
	spots: ISpot[];
	errorMessage: string;

	constructor(
		private _spotService: SpotService,
		private _loginService: LoginService,
		private _textTransformService: TextTransformService,
		private _router: Router) {}

	ngOnInit(): void {
		this.getCreatedSpots();
		this.user = this._loginService.getCurrentUser();		
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

	prettify(word: string): string {
		return this._textTransformService.capitalize(word);
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
