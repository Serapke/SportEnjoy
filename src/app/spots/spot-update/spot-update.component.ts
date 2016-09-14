import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { FileService } from '../../shared/file.service';

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
		this._spotService.updateSpot(this.spot)
			.subscribe(
        spot => {
					this.submitted = true;
          this.spot = spot;
        },
        error => this.errorMessage = <any>error
      );
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
