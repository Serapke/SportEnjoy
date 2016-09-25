import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../users/user';

@Component({
	templateUrl: './spotters.component.html',
	styleUrls: ['./spotters.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class SpottersComponent implements OnInit {
	spotters: IUser[];
	errorMessage: string;
	defaultImage: string = '/testas/assets/images/spotter-logo.png';

	constructor(private _userService: UserService) {
	}

	ngOnInit(): void {
		this.getTopSpotters();
  }

	getTopSpotters(): void {
		this._userService.getTopSpotters()
         .subscribe(
           users => { this.spotters = users; console.log(this.spotters.length); },
           error =>  this.errorMessage = <any>error);
	}


}
