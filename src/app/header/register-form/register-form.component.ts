import { Component } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../users/user.service';

@Component({
	selector: 'register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent  {
    email: string;
	password: string;
    passwordConfirmation: string;
    errorMessage: string;

    constructor(
        private _loginService: LoginService,
        private _userService: UserService,
        private _router: Router,
    ) {

    }

    onRegister() {
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
            )
	}

     onLogin() {
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
}