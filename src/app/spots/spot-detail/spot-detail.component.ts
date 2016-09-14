import { Component, OnInit, OnDestroy, Input, OnChanges, DoCheck } from '@angular/core';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { LoginService } from '../../login/login.service';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

@Component({
	templateUrl: './spot-detail.component.html',
	styleUrls: ['./spot-detail.component.css']
})
export class SpotDetailComponent implements OnInit, OnDestroy {
	private sub: any;
  spot: ISpot;
	mainImage : string;
	reviewed: boolean = false;
	errorMessage: string;

	constructor(
		private _spotService: SpotService,
		private _loginService: LoginService,
		private _router: Router,
		private _route: ActivatedRoute) {
	}

	// changeMainImage(_image : IImage) {
	// 	this.mainImage = _image.url;
	// }

	ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
        let id = +params['id'];
        this.getSpot(id);
    });
	}

	getSpot(id: number) {
			 this._spotService.getSpot(id)
					 .subscribe(
					 spot => {
						 this.spot = spot;
						 this.reviewed = spot.reviewed;
						 this.mainImage = spot.images.url;
					 },
					 error => this.errorMessage = <any>error);
	 }
	ngOnDestroy() {
	  this.sub.unsubscribe();
	}

	isModerator(): boolean {
		return this._loginService.isModerator();
	}

	isReviewed(): boolean {
		console.log(this.reviewed);
		return this.reviewed;
	}

	approve() {
		this._spotService.reviewSpot(this.spot.id, true)
					.subscribe(
					spot => {
						this.spot = spot;
						this.reviewed = true;
					},
					error => this.errorMessage = <any>error);
	}

	decline() {
		this._spotService.reviewSpot(this.spot.id, false)
					.subscribe(
						spot => {
							this.spot = spot;
							this.reviewed = true;
						}
					)
	}

	update() {
		this._router.navigate(['/spot/' + this.spot.id + '/update']);
	}

	gotoLogin() {
		this._router.navigate(['/login']);
	}
}
