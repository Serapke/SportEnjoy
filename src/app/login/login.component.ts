import {Component, AfterViewInit} from '@angular/core';
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import {FacebookService, FacebookInitParams} from "../shared/facebook.service";

declare const gapi:any;

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  status: String;
  errorMessage: String;

  public auth2: any;

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

  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '882994952848-sluohe9g29dbnccec6aje3kj6cfps9i3.apps.googleusercontent.com',
        scope: 'profile email'
      });
      that.attachSignIn(document.getElementById('google'));
    })
  }

  public attachSignIn(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {
        let profile = googleUser.getBasicProfile();
        that.onLogin(profile.getEmail(), profile.getId(), profile.getName(), profile.getImageUrl(), 'google')
      }, function (error) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  onFacebookLoginClick() {
    if (this.status === FacebookService.STATUS_CONNECTED) {
      this._fb.logout();
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
        .then(response =>
          this.onLogin(response.email, response.id, response.name, response.picture.data.url, FacebookService.SOCIAL_MEDIA_NAME)
        );
    } else if (resp.status === FacebookService.STATUS_NOT_AUTHORIZED) {
      console.log("Please log in to the app.");
    } else {
      console.log("Please log in to Facebook.");
    }
  }

  onLogin(email: string, password: string, name: string, picture: string, social_media: string) {
    this._loginService.loginSocialUser(email, password, name, picture, social_media)
      .subscribe(
        result => {
          if (result) {
            this._router.navigate(['/profile']);
          }
        },
        error => this.errorMessage = error
      );
  }
}
