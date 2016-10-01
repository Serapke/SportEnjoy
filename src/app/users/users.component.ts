import { Component, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { IUser } from './user';
import { LoginService } from '../login/login.service';
import { UserService } from './user.service';

@Component({
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class UsersComponent implements OnInit {
	users: IUser[];
	errorMessage: string;

	constructor(
		private _loginService: LoginService,
		private _userService: UserService,
	  private _router: Router) {
		}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this._userService.getUsers()
				.subscribe(
					users => this.users = users,
					error => this.errorMessage = error
				);
	}

	userStatus(user: IUser): string {
		if (user.moderator)
			return "Moderatorius"
		else
			return "Vartotojas"
	}

}
