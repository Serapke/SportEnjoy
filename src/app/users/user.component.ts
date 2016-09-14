import { Component, OnInit, OnDestroy, Input, OnChanges, DoCheck } from '@angular/core';
import { IUser } from './user';
import { UserService } from './user.service';
import { LoginService } from '../login/login.service';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

@Component({
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
	private sub: any;
  user: IUser;
	errorMessage: string;

	constructor(
		private _userService: UserService,
		private _loginService: LoginService,
		private _router: Router,
		private _route: ActivatedRoute) {
	}

	ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
        let id = +params['id'];
        this.getUser(id);
    });
	}

	getUser(id: number) {
			 this._userService.getUser(id)
					 .subscribe(
					 user => {
						 this.user = user;
					 },
					 error => this.errorMessage = <any>error);
	 }

	 makeModerator() {
		 this._userService.updateUserRole(this.user.id, false, true)
		 		.subscribe(
					user => this.user = user,
					error => this.errorMessage = error
				);
	 }

	 makeAdmin() {
		 this._userService.updateUserRole(this.user.id, true, true)
		 		.subscribe(
					user => this.user = user,
					error => this.errorMessage = error
				);
	 }

	 makeSpotter() {
		 this._userService.updateUserRole(this.user.id, false, false)
		 		.subscribe(
					user => this.user = user,
					error => this.errorMessage = error
				);
	 }

	 ban(decision: boolean) {
		 this._userService.banUser(this.user.id, decision)
		 		.subscribe(
					user => this.user = user,
					error => this.errorMessage = error
				);
	 }

	ngOnDestroy() {
	  this.sub.unsubscribe();
	}
}
