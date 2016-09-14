import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { LoginService } from '../../login/login.service';
import { FileService } from '../../shared/file.service';

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
		this._spotService.createUnapprovedSpot(this.spot)
			.subscribe(
		   spot => {
					this.submitted = true;
		     this.spot = spot;
		   },
		   error => this.errorMessage = <any>error
		 );
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
