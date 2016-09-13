import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TextTransformService } from '../shared/text-transform.service';
import { IUser } from '../users/user';

@Injectable()
export class LoginService {
    private _loginUrl = 'http://localhost:3000/sessions';
    user: IUser = null;
    private loggedIn: boolean = false;
    redirectUrl: string;

    constructor(
        private _http: Http
    ){
        this.loggedIn = !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
    }

    login(email: string, password: string): Observable<IUser> {
        console.info("Sending login requst");
        console.info("email: " + email + "; password: " + password);
        let headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post(this._loginUrl, JSON.stringify({email, password}), {headers: headers})
            .map((response: Response) => <IUser> response.json())
            .do(data => {
                            console.log("Succcesfully logged in! User: " + data.email);
                            console.log(data);
                            localStorage.setItem('auth_token', data.auth_token);
                            localStorage.setItem('user_name', data.name);
                            localStorage.setItem('user', JSON.stringify(data));
                        this.loggedIn = true;
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

    isLoggedIn() {
    return this.loggedIn;
    }

    isModerator() {
        let user = <IUser> JSON.parse(localStorage.getItem('user'));
        if (this.isLoggedIn() && user.moderator)
            return true;
        return false;
    }
    isAdmin() {
        let user = <IUser> JSON.parse(localStorage.getItem('user'));
        if (this.isLoggedIn() && user.admin)
            return true;
        return false;
    }

		private handleError(error: Response) {
       return Observable.throw(error.json().errors || 'Server error');
    }

}
