import { Component } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { Router } from '@angular/router';
import {UserService} from "../../users/user.service";

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent  {
  email: string;
  password: string;
  passwordConfirmation: string;
  errorMessage: string;
  signUp: boolean = false;

  constructor(
      private _loginService: LoginService,
      private _router: Router,
      private _userService: UserService,
  ) {

  }

  onLogin() {
    if (this.signUp) {
      this._userService.createUser(this.email, this.password, this.passwordConfirmation)
        .subscribe(
          result => {
            if (result) {
              this.onLogin();
            }
          },
          error => {
            this.errorMessage = error
          }
        );
    }

		this._loginService.login(this.email, this.password)
      .subscribe(
        result => {
          if (result) {
            this._router.navigate(['/profile']);
          }
        },
        error => this.errorMessage = error
      );
	}

  toggleSignUp() {
    this.signUp = !this.signUp;
  }
}
