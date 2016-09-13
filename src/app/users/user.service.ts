import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { IUser } from './user.ts';

@Injectable()
export class UserService {
    private _userUrl = 'https://sportenjoy-api.herokuapp.com/users';
    errorMessage: string;
    count: number = 5;

    constructor(
      private _http: Http
    ) {
    }
    getUsers(): Observable<IUser[]> {
      return this._http.get(this._userUrl, {headers: this.getHeaders()})
            .map((response: Response) => <IUser[]> response.json())
            .do(data => {
              console.log("Got all users!");
            })
            .catch(this.handleError);
    }
    getUser(id: number): Observable<IUser> {
      let url = `${this._userUrl}/${id}`;
      return this._http.get(url, {headers: this.getHeaders()})
            .map((response: Response) => <IUser> response.json())
            .do(data => console.log("Got a user!"))
            .catch(this.handleError);
    }
    getTopSpotters(): Observable<IUser[]> {
      let url = `${this._userUrl}/top/${this.count}`;
      return this._http.get(url)
            .map((response: Response) => <IUser[]> response.json())
            .do(data => console.log("Got top spotters!"))
            .catch(this.handleError);
    }

    createUser(email: string, password: string, passwordConfirmation: string) {
      let user = {'user': {'email': email, 'password': password, 'password_confirmation': passwordConfirmation}}
      return this._http.post(this._userUrl, user)
            .map((response: Response) => <IUser> response.json())
            .do(data => console.log("Created a user!"))
            .catch(this.handleError);
    }

    updateUserRole(id: number, admin: boolean, moderator: boolean): Observable<IUser> {
      let role = {'spot': {'admin': admin, 'moderator': moderator}};
      let url = `${this._userUrl}/${id}/update_role`;

      return this._http.put(url, role, {headers: this.getHeaders()})
            .map((response: Response) => <IUser> response.json())
            .do(data => console.log("Updated user role!"))
            .catch(this.handleError);
    }

    banUser(id: number, banned: boolean): Observable<IUser> {
      let ban = {'user': {'banned': banned}};
      let url = `${this._userUrl}/${id}/ban`;

      return this._http.put(url, ban, {headers: this.getHeaders()})
            .map((response: Response) => <IUser> response.json())
            .do(data => console.log("Banned user!"))
            .catch(this.handleError);
    }

		private handleError(error: Response) {
       // in a real world app, we may send the server to some remote logging infrastructure
       // instead of just logging it to the console
       return Observable.throw(error.json().errors || 'Server error');
    }

		private getHeaders(): Headers {
      let auth_token = localStorage.getItem('auth_token');
      return new Headers({'Authorization': auth_token});
    }

}
