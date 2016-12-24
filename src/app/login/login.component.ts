import { Component } from '@angular/core';

declare const FB:any;

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor() {
    FB.init({
      appId      : '349303705453014',
      xfbml      : true,
      version    : 'v2.8'
    });
  }

  onFacebookLoginClick() {
    FB.login();
  }

  statusChangeCallback(resp) {
    if (resp.status === 'connected') {
      // connect here with your server for facebook login by passing access token given by facebook
      console.log("Successfuly logged in with Facebook");
    }else if (resp.status === 'not_authorized') {

    }else {

    }
  };
  ngOnInit() {
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }
}
