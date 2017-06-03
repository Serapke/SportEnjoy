import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../users/user';

@Injectable()
export class LoginService {
    private _loginUrl = 'https://sportenjoy-api.herokuapp.com/sessions';
    user: IUser = null;
    private loggedIn: boolean = false;

    constructor(
      private _http: Http
    ){
      this.loggedIn = !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
    }

    login(email: string, password: string): Observable<IUser> {
      let headers = new Headers({'Content-Type': 'application/json'});
      return this._http.post(this._loginUrl, JSON.stringify({email, password}), {headers: headers})
        .map((response: Response) => <IUser> response.json())
        .do(data => {
            console.log("Successfully logged in! User: " + data.email);
            this.setUserToLocalStorage(data);
        })
        .catch(this.handleError);
    }

    loginSocialUser(email: string, social_id: string, name: string, photoUrl: string, social_media: string) {
      let user = {'email': email, 'social_id': social_id, 'name': name,'image': photoUrl};
      let url;
      if (social_media === 'facebook') {
        url = `${this._loginUrl}/facebook`;
      } else {
        url = `${this._loginUrl}/google`;
      }
      return this._http.post(url, user)
        .map((response: Response) => <IUser> response.json())
        .do(data => {
          console.log("Successfully logged in! User: " + data.email);
          this.setUserToLocalStorage(data);
        })
        .catch(this.handleError);
    }

    logout() {
      let auth_token = {"id": localStorage.getItem('auth_token')};
      let headers = new Headers({'Content-Type': 'application/json'});
      this._http.delete(this._loginUrl + "/" + localStorage.getItem('auth_token'), {headers: headers})
        .map((response: Response) => console.log(response));
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user');
      this.loggedIn = false;
    }

    setUserToLocalStorage(data) {
      localStorage.setItem('auth_token', data.auth_token);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user', JSON.stringify(data));
      this.loggedIn = true;
    }

    isLoggedIn() {
      return this.loggedIn;
    }

    getCurrentUser(): IUser {
      return <IUser> JSON.parse(localStorage.getItem('user'));
    }

    isModerator() {
      let user = <IUser> JSON.parse(localStorage.getItem('user'));
      return this.isLoggedIn() && user.moderator;

    }
    isAdmin() {
      let user = <IUser> JSON.parse(localStorage.getItem('user'));
      return this.isLoggedIn() && user.admin;
    }

    private handleError(error: Response) {
      return Observable.throw(error.json().errors || 'Server error');
    }
}
