import { Component } from '@angular/core';
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import {FacebookService, FacebookInitParams} from "../shared/facebook.service";

declare const FB:any;

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
  status: String;
  errorMessage: String;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _fb: FacebookService
  ) {
    let fbParams: FacebookInitParams = {
      appId: '349444045438980',
      xfbml      : true,
      version    : 'v2.8'
    };
    this._fb.init(fbParams)
  }

  onFacebookLoginClick() {
    if (this.status === FacebookService.STATUS_CONNECTED) {
      FB.logout();
      this.status = "";
    } else {
      this._fb.login({
        scope: 'public_profile,email,user_friends'
      }).then(response => this.statusChangeCallback(response));
    }
  }

  statusChangeCallback(resp: any) {
    if (resp.status === FacebookService.STATUS_CONNECTED) {
      this.status = resp.status;
      this._fb.api('/me?fields=id,name,email,picture')
        .then(response => this.onLogin(response.email, response.id, response.name, response.picture.data.url));
    } else if (resp.status === FacebookService.STATUS_NOT_AUTHORIZED) {
      console.log("Please log in to the app.");
    } else {
      console.log("Please log in to Facebook.");
    }
  }

  onLogin(email: string, password: string, name: string, picture: string) {
    this._loginService.loginSocialUser(email, password, name, picture)
      .subscribe(
        result => {
          if (result) {
            this._router.navigate(['/profile']);
          }
        },
        error => this.errorMessage = error
      );
  }

  ngOnInit() {
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }
}
