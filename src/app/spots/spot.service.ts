import { Injectable } from '@angular/core';
import { ISpot } from './spot';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';
import { TextTransformService } from '../shared/text-transform.service';
// import { Location } from '../shared/location/location';
import { IUser } from '../users/user';

@Injectable()
export class SpotService {
    location: Location[];
    private _publicProductUrl = 'https://sportenjoy-api.herokuapp.com/spots';
    private _userProductUrl = 'https://sportenjoy-api.herokuapp.com/users';
    topSpotsCount: number = 4;
    errorMessage: string;
    constructor(
      private _http: Http,
      private _textTransformService: TextTransformService
    ) {
    }
    getSpots(): Observable<ISpot[]> {
      return this._http.get(this._publicProductUrl)
            .map((response: Response) => <ISpot[]> response.json())
            .do(data => {
              console.log("Got all spots!");
            })
            .catch(this.handleError);
    }
    getSpot(id: number): Observable<ISpot> {
      let url = `${this._publicProductUrl}/${id}`;
      return this._http.get(url, {headers: this.getHeaders()})
            .map((response: Response) => <ISpot> response.json())
            .do(data => console.log("Got a spot!"))
            .catch(this.handleError);
    }
    getCategories(): Observable<string[]> {
      let url = `${this._publicProductUrl}/categories`;
      return this._http.get(url)
            .map((response: Response) => <string[]> response.json())
            .do(data => console.log("Got categories"))
            .catch(this.handleError);
    }
    getCities(): Observable<string[]> {
      let url = `${this._publicProductUrl}/cities`;
      return this._http.get(url)
            .map((response: Response) => <string[]> response.json())
            .do(data => console.log("Got cities"))
            .catch(this.handleError);
    }
    getTopSpots(): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/top/${this.topSpotsCount}`;
      return this._http.get(url)
            .map((response: Response) => <ISpot[]> response.json())
            .do(data => console.log("Got top spots!"))
            .catch(this.handleError);
    }
    createSpot(spot: ISpot){
      let user = <IUser> JSON.parse(localStorage.getItem('user'));
      let url = `${this._userProductUrl}/${user.id}/spots`;
      
      return this._http.post(url, spot, { headers: this.getHeaders()})
                  .map((response: Response) => <ISpot> response.json())
                  .do(data => {
                    console.log("Created a spot!");
                    console.log(data);
                  })
                  .catch(this.handleError);
    }
    getCreatedSpots(): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/created_spots`;
      return this._http.get(url, { headers: this.getHeaders() })
            .map((response: Response) => <ISpot[]> response.json())
            .do(data => {
              console.log("Got created spots!");
            })
            .catch(this.handleError);
    }
    getSpotsForReview(): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/unapproved_spots`;
      return this._http.get(url, { headers: this.getHeaders()})
            .map((response: Response) => <ISpot[]> response.json())
            .do(data => {
              console.log("Got spots for review!");
            })
            .catch(this.handleError);
    }
    reviewSpot(spotID: number, review: boolean): Observable<ISpot> {
      let approved = {'spot': {'approved': review}};
      let url =  `${this._publicProductUrl}/${spotID}/review`;

      return this._http.put(url, approved, { headers: this.getHeaders()})
            .map((response: Response) => <ISpot> response.json())
            .do(data => {
              console.log("Reviewed a spot! Approved: " + review);
              console.log(data);
            })
            .catch(this.handleError);
    }
    updateSpot(spot: ISpot): Observable<ISpot> {
      let url = `${this._userProductUrl}/${spot.user_id}/spots/${spot.id}`;

      return this._http.put(url, spot, { headers: this.getHeaders()})
            .map((response: Response) => <ISpot> response.json())
            .do(data => {
              console.log("Updated a spot!");
              console.log(data);
            })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
       // in a real world app, we may send the server to some remote logging infrastructure
       // instead of just logging it to the console
       console.error(error);
       return Observable.throw(error.json().error || 'Server error');
    }

    private getHeaders(): Headers {
      let auth_token = localStorage.getItem('auth_token');
      return new Headers({'Authorization': auth_token});
    }

    getParticularCategorySpots(spots: ISpot[], filter: string): ISpot[] {
      filter = filter ? filter.toLocaleLowerCase() : null;
      if (!spots) return spots;
      return (typeof spots !== "undefined" && filter) ? spots.filter((spot: ISpot) =>
          spot.category.toLocaleLowerCase().indexOf(filter) !== -1) : spots;
    }

    getParticularCitySpots(spots: ISpot[], filter: string): ISpot[] {
      filter = filter ? filter.toLocaleLowerCase() : null;
      return filter ? spots.filter((spot: ISpot) =>
          spot.city.toLocaleLowerCase().indexOf(filter) !== -1) : spots;
    }    
}
