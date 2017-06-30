import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { IUser } from '../users/user';
import { SpotService } from '../spots/spot.service';
import { LoginService } from '../login/login.service';
import { TextTransformService } from '../shared/text-transform.service';

@Component({
  selector: 'ng-topPlaces',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class ProfileComponent {
  user: IUser;
  spots: ISpot[];
  errorMessage: string;
  contentSize: number = 50;
  CONTENT_SIZE_MIN: number = 50;

  constructor(
    private _spotService: SpotService,
    private _loginService: LoginService,
    private _textTransformService: TextTransformService,
    private _router: Router) {}

  ngOnInit(): void {
    if (document.body.clientWidth < 450) {
      this.CONTENT_SIZE_MIN = 15;
      this.contentSize = this.CONTENT_SIZE_MIN;
    }
    this.getCreatedSpots();
    this.user = this._loginService.getCurrentUser();
  }

  getCreatedSpots() {
    this._spotService.getCreatedSpots()
      .subscribe(
        spots => {
          this.spots = spots;
        },
        error =>  {
          this.errorMessage = <any>error;
          console.log(this.errorMessage)
        }
      );
  }

  changePassword() {
    this._router.navigate(['/user/update-password']);
  }

  changeInfo() {
    this._router.navigate(['/user/update-info']);
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  toggleFullContent() {
    this.contentSize = this.contentSize == this.CONTENT_SIZE_MIN ? 0 : this.CONTENT_SIZE_MIN;
  }

  spotStatus(approved: boolean, reviewed: boolean): string {
    if (reviewed && approved) {
      return "approved".toUpperCase();
    } else if (reviewed) {
      return "rejected".toUpperCase();
    }
    return "unreviewed".toUpperCase();
  }
}
