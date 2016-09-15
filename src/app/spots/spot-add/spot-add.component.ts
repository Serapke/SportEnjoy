import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { LoginService } from '../../login/login.service';
import { FileService } from '../../shared/file.service';
import { LocationService } from '../../shared/location/location.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: '../form.html',
	styleUrls: ['../form.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class SpotAddComponent implements OnInit {
	spot: ISpot;
	errorMessage: string;
	submitted: boolean = false;
	image: string = "";
	file: string = "";
	center: google.maps.LatLng;

	constructor(
		private _spotService: SpotService,
		private _loginService: LoginService,
		private _fileService: FileService,
		private _locationService: LocationService,
		private _router: Router) {}

	ngOnInit(): void {
		this.spot = new ISpot();
  }

	changeListener($event) : void {
		this.file = $event.target.files[0].name;
    this._fileService.read($event.target, this.spot).subscribe(
			data => { this.image = data; }
		);
  }

	onSubmit() {
		console.log("submited");

		this.center  = new google.maps.LatLng(this.spot.latitude, this.spot.longitude);
		alert(this.spot.latitude + " " + this.spot.longitude + " (types: " + (typeof this.spot.latitude) + ", " + (typeof this.spot.longitude) + ")")

		this._locationService.geocode(this.center).
			subscribe(position => {
				console.log("got it");
				console.log(position[0].address_components[1].short_name);
				this.spot.city = position[0].address_components[2].long_name;
				console.log(position[0].address_components[2].long_name);
				this.spot.country = position[0].address_components[5].long_name;
				console.log(position[0].address_components[5].long_name);
				console.log(this.spot);
				this._spotService.createSpot(this.spot).subscribe(
					spot => {
						console.log("was");
						this.submitted = true;
						this.spot = spot;
					},
					error => {
						this.errorMessage = <any>error;
						console.error("error");
					}
		 		);
			});
	}

	isModerator() {
		return this._loginService.isModerator();
	}

	isAdding() {
		return true;
	}
	isUpdating() {
		return false;
	}

}
