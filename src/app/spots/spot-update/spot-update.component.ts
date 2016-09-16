import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { FileService } from '../../shared/file.service';
import { FileService } from '../../shared/location/location.service';

@Component({
	selector: 'ng-topPlaces',
	templateUrl: '../form.html',
	styleUrls: ['../form.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class SpotUpdateComponent implements OnInit, OnDestroy {
	private sub: any;
	spot: ISpot;
	oldSpot: ISpot;
	errorMessage: string;
	submitted: boolean = false;
	image: string;
	file: string = "";

	constructor(
		private _spotService: SpotService,
		private _route: ActivatedRoute,
		private _fileService: FileService,
		private _locationService: LocationService,
		private _router: Router) {}

	ngOnInit(): void {
		if (!this.spot) {
      this.sub = this._route.params.subscribe(params => {
          let id = +params['id'];
          this.getSpot(id);
      });
    }
  }

	onSubmit() {
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
				this._spotService.updateSpot(this.spot)
					.subscribe(
						spot => {
							this.spot = spot;
							this.submitted = true;
						},
						error => this.errorMessage = <any>error
					);
				console.log("done");
			});
	}

	changeListener($event) : void {
		this.file = $event.target.files[0].name;
    this._fileService.read($event.target, this.spot).subscribe(
			data => { this.image = data; }
		);
  }

	getSpot(id: number) {
		this._spotService.getSpot(id)
			.subscribe(
				spot => {
					this.spot = spot;
					this.oldSpot = spot;
					this.image = this.spot.images.url;
				},
				error => this.errorMessage = <any>error
			);
	}

	ngOnDestroy() {
	  this.sub.unsubscribe();
	}

	isAdding(): boolean {
		return false;
	}
	isUpdating(): boolean {
		return true;
	}

}
