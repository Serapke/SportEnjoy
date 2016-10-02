import { Component } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { Router } from '@angular/router';

@Component({
	selector: 'login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent  {
    email: string;
	password: string;
    errorMessage: string;

    constructor(
        private _loginService: LoginService,
        private _router: Router,
    ) {

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