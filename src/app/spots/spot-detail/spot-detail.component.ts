import { Component, OnInit, OnDestroy, Input, OnChanges, DoCheck } from '@angular/core';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { LoginService } from '../../login/login.service';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {TextTransformService} from "../../shared/text-transform.service";
import {TranslateService} from "ng2-translate";

@Component({
	templateUrl: './spot-detail.component.html',
	styleUrls: ['./spot-detail.component.css']
})
export class SpotDetailComponent implements OnInit, OnDestroy {
  rotatedCategoryDropdownArrow: boolean = false;
	private sub: any;
  spot: ISpot;
	mainImage : string;
	reviewed: boolean = false;
	errorMessage: string;
  categories: string[];

	constructor(
		private _spotService: SpotService,
		private _loginService: LoginService,
		private _router: Router,
    private _translate: TranslateService,
    private _textTransformService: TextTransformService,
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
    this._spotService.getCategories()
      .subscribe(categories => {
          this.getTranslations(categories);
          console.log("got translations");
        },
        error =>  this.errorMessage = <any>error
      );
	}

  getTranslations(categories: string[]): void {
    this.categories = new Array();
    this._translate.get(categories).subscribe((translations: string[]) => {
      for (let key in translations) {
        if (translations.hasOwnProperty(key)) {
          this.categories.push(translations[key]);
        }
      }
    });
  }

  showCategories(): void {
    this.rotatedCategoryDropdownArrow = true;
  }

  hideCategories(): void {
    this.rotatedCategoryDropdownArrow = false;
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  saveCategory(category: string): void {
    this.spot.category = this.prettify(category.toLowerCase());
    this.rotatedCategoryDropdownArrow = !this.rotatedCategoryDropdownArrow;
  }

	getSpot(id: number) {
			 this._spotService.getSpot(id)
					 .subscribe(
					 spot => {
						 this.spot = spot;
						 this.reviewed = spot.reviewed;
						 this.mainImage = spot.images;
					 },
					 error => this.errorMessage = <any>error);
	 }
	ngOnDestroy() {
	  this.sub.unsubscribe();
	}

	isModerator(): boolean {
		return this._loginService.isModerator() || this._loginService.isAdmin();
	}

	isReviewed(): boolean {
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
