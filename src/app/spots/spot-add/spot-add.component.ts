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
		alert(this.spot.latitude + " " + this.spot.longitude + " (types: " + (typeof this.spot.latitude) + ", " + (typeof this.spot.longitude) + ")")

		this._locationService.geocode(this.spot.latitude, this.spot.longitude).
			subscribe(position => {
				console.log("got it");
				console.log(this.findAddressPart(position, "route", "short"));
				this.spot.city = this.findAddressPart(position, "locality", "long");
				console.log(this.findAddressPart(position, "locality", "long"));
				this.spot.country = this.findAddressPart(position, "country", "long");
				console.log(this.findAddressPart(position, "country", "long"));
				console.log(this.spot);
				this._spotService.createSpot(this.spot).subscribe(
					spot => {
						console.log("was");
						this.spot = spot;
						this.submitted = true;
					},
					error => {
						this.errorMessage = <any>error;
						console.error("error");
					}
		 		);
				console.log("done");
			}, error => {
				this.spot.city = "undefined";
				this.spot.country = "undefined";
			});
	}

	findAddressPart(position: any, part: string, version: string): string {
		console.log("looking for " + part);
		let address = position[0].address_components;
		for (var item of address) {
			console.log(item);
			if (item.types.indexOf(part) != -1)  {
				if (version == "long") {
					return item.long_name;
				}
				else {
					return item.short_name;
				}
			}
				
		}
		return "";
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
