import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { FileService } from '../../shared/file.service';
import { LocationService } from '../../shared/location/location.service';

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
	submitting: boolean = false;
	image: string;
	file: string = "";

	constructor(
		private _spotService: SpotService,
		private _route: ActivatedRoute,
		private _fileService: FileService,
		private _locationService: LocationService,
		private _ngZone: NgZone,
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
		this.submitting = true;
		this._locationService.geocode(this.spot.latitude, this.spot.longitude).
			subscribe(position => {
				console.log(this.findAddressPart(position, "route", "short"));
				this.spot.city = this.findAddressPart(position, "locality", "long");
				this.spot.country = this.findAddressPart(position, "country", "long");
				let sub = this._spotService.updateSpot(this.spot)
					.subscribe(
						() => {
							this._ngZone.run(() => {
								this.submitted = true;
								console.log(this.submitted);
								this.submitting = false;
							});
						},
						error => {
							this.errorMessage = <any>error;
							console.error("error");
						}
					);
			}, error => {
				this.spot.city = "undefined";
				this.spot.country = "undefined";
			});
	}

	findAddressPart(position: any, part: string, version: string): string {
		let address = position[0].address_components;
		for (var item of address) {
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
					this.image = this.spot.images;
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
