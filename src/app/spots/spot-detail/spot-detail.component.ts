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
	beenHere: boolean;
	user_rating: number;
	errorMessage: string;
  categories: string[];
  currentPage: number = 1;
  leftBound: number = 1;
  rightBound: number = 1;
  commentsPerPage: number = 3;

	constructor(
		private _spotService: SpotService,
		private _loginService: LoginService,
		private _router: Router,
    private _translate: TranslateService,
    private _textTransformService: TextTransformService,
		private _route: ActivatedRoute) {
  }

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			let id = +params['id'];
			this.getSpot(id);
			this.getSpotRating(id);
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

  firstPage(): boolean {
	  return this.currentPage == 1;
  }

  lastPage(): boolean {
	  return this.currentPage == Math.round(this.spot.original_comments.length/this.commentsPerPage);
  }

  pageArray() {
    var x=[];
    var i=1;
    while(x.push(i++) < this.spot.original_comments.length/this.commentsPerPage) {};
    return x;
  }

  changePage(i: number) {
	  this.currentPage = i;
    this.leftBound = (this.currentPage-1) * this.commentsPerPage+1;
    if ((this.currentPage * this.commentsPerPage) < this.spot.original_comments.length) {
      this.rightBound = this.currentPage * this.commentsPerPage;
    } else {
      this.rightBound = this.spot.original_comments.length;
    }
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
        if ((this.currentPage * this.commentsPerPage) < this.spot.original_comments.length) {
          this.rightBound = this.currentPage * this.commentsPerPage;
        } else {
          this.rightBound = this.spot.original_comments.length;
        }
      },
      error => this.errorMessage = <any>error
    );
	}

	getSpotRating(id: number) {
    this._spotService.getSpotRating(id)
      .subscribe(rating => {
        if (!isNaN(rating)) {
          this.user_rating = rating;
          this.beenHere = true;
        }
      },
      error => this.errorMessage = <any> error
    );
  }

	ngOnDestroy() {
	  this.sub.unsubscribe();
	}

	isLoggedIn(): boolean {
	  return this._loginService.isLoggedIn();
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

	rate(rating) {
	  this.user_rating = rating;
	  this._spotService.rateSpot(this.spot.id, this.user_rating)
      .subscribe(
        spot => {
          this.spot.beenHere = spot.beenHere;
          this.spot.rating = spot.rating;
        }
      )
  }

  newComment(commentID?: number) {
	  if (commentID == null)
	    this._router.navigate(['/spot/' + this.spot.id + '/comment']);
	  else
      this._router.navigate(['/spot/' + this.spot.id + '/comment/' + commentID]);
  }

  reportComment(commentID: number) {
    this._spotService.reportComment(this.spot.id, commentID)
      .subscribe(
        spot => {
          this.spot = spot;
        }
      )
  }

  colorStar(index):boolean {
	  if (index <= this.user_rating) {
	    return true;
    }
    return false;
  }

	showRating() {
	  this.beenHere = true;
  }

	update() {
		this._router.navigate(['/spot/' + this.spot.id + '/update']);
	}

	gotoLogin() {
		this._router.navigate(['/login']);
	}

	decode(s: string): string {
	  s = s.replace(/\s/g, "_");
	  return s;
  }
}
