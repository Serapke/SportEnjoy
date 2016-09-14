import { Injectable } from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private _loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("guard");
    console.log(this._loginService.isLoggedIn());
    console.log(state.url !== '/login');
    if (this._loginService.isAdmin()) {
      return true;
    }
    else if (this._loginService.isModerator() && this.showForModerator(state.url)) {
      return true;
    }
		else if (this._loginService.isLoggedIn() && this.showForLoggedInUser(state.url)) {
      return true;
    }
    else if (this._loginService.isLoggedIn() && !this.showForLoggedInUser(state.url)) {
      this.router.navigate(['profile']);
      return false;
    }
    else if (!this._loginService.isLoggedIn() && this.showForGuest(state.url)) {
      return true;
    }
    else {
      console.warn("Not authorized!");
      this.router.navigate(['login']);
      return false;
    }
  }

  private showForLoggedInUser(url: string): boolean {
    if (url === '/login' || url === '/review' ||
        url.indexOf('update') > -1 || url === '/users' ||
        url.indexOf('user') >-1) {
      return false;
    }
    return true;
  }

  private showForGuest(url: string): boolean {
    if (url === '/profile' || url === '/add-spot' ||
        url === '/review'  || url.indexOf('update') > -1 ||
        url === '/users'   || url.indexOf('user') >-1) {
      return false;
    }
    return true;
  }

  private showForModerator(url: string): boolean {
    if (url === '/users' || url.indexOf('user') > -1) {
      return false;
    }
    return true;
  }
}
