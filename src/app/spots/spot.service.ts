import { Injectable } from '@angular/core';
import { ISpot } from './spot';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';
import { TextTransformService } from '../shared/text-transform.service';
import { IUser } from '../users/user';
import {ISpotComment} from "./spot-comment";

@Injectable()
export class SpotService {
    location: Location[];
    private _publicProductUrl = 'https://sportenjoy-api.herokuapp.com/spots';
    // private _publicProductUrl = 'http://localhost:3000/spots';
    private _userProductUrl = 'https://sportenjoy-api.herokuapp.com/users';
    private _mainUrl = 'https://sportenjoy-api.herokuapp.com/';
    topSpotsCount: number = 8;
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
    getParticularSpots(city: string, category: string, page: number): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/particularSpots?city=${city}&category=${category}&page=${page}`;
      return this._http.get(url)
        .map((response: Response) => <ISpot[]> response.json())
        .do(data => {
          console.log("Got particular spots!");
        })
        .catch(this.handleError);

    }
    getSpot(id: number): Observable<ISpot> {
      let url = `${this._publicProductUrl}/${id}`;
      return this._http.get(url, {headers: this.getHeaders()})
            .map((response: Response) => <ISpot> response.json())
            .do(data => {
              console.log("Got a spot!");
              console.log(data);
            })
            .catch(this.handleError);
    }
    getLocalSpots(coordinates: any): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/localSpots?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
      return this._http.get(url)
            .map((response: Response) => <ISpot[]> response.json())
            .do(data => console.log("Got local spots!"))
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
      let url = `${this._publicProductUrl}/${spotID}/review`;

      return this._http.put(url, approved, { headers: this.getHeaders()})
            .map((response: Response) => <ISpot> response.json())
            .do(data => {
              console.log("Reviewed a spot! Approved: " + review);
              console.log(data);
            })
            .catch(this.handleError);
    }
    rateSpot(spotID: number, value: number): Observable<ISpot> {
      let rate = { 'value': value };
      let url = `${this._publicProductUrl}/${spotID}/rate`;

      return this._http.post(url, rate, { headers: this.getHeaders()})
        .map((response: Response) => <ISpot> response.json())
        .do(data => {
          console.log("Rated a spot with value: " + value);
          console.log(data);
        })
        .catch(this.handleError);
    }
    commentSpot(spotID: number, content: string, commentID: number): Observable<ISpot> {
      let comment;
      if (commentID != null) {
        comment = { 'content': content, 'original_message_id': commentID };
      } else {
        comment = { 'content': content };
      }
      let url = `${this._publicProductUrl}/${spotID}/comment`;
      return this._http.post(url, comment, { headers: this.getHeaders()})
        .map((response: Response) => <ISpot> response.json())
        .do(data => {
          console.log("Commented a spot with value: " + content);
          console.log(data);
        })
        .catch(this.handleError);
    }
    reportComment(spotID: number, commentID: number): Observable<ISpot> {
      let comment = { 'comment_id': commentID };
      let url = `${this._publicProductUrl}/${spotID}/comment_report`;

      return this._http.put(url, comment, { headers: this.getHeaders() })
        .map((response: Response) => <ISpot> response.json())
        .do(data => {
          console.log("Reported a spot comment");
          console.log(data);
        })
        .catch(this.handleError);
    }
    getCommentsForReview(): Observable<ISpotComment[]> {
      let url = `${this._publicProductUrl}/flagged_comments`;

      return this._http.get(url, { headers: this.getHeaders() })
        .map((response: Response) => <ISpotComment[]> response.json())
        .do(data => {
          console.log("Got comments for review!");
          console.log(data);
        })
        .catch(this.handleError);
    }
    unflagComment(commentID: number): Observable<ISpotComment[]> {
      let url = `${this._mainUrl}/comment/${commentID}`;

      return this._http.put(url, {}, { headers: this.getHeaders() })
        .map((response: Response) => <ISpotComment[]> response.json())
        .do(data => {
          console.log("Unflagged comment with comment id: " + commentID);
          console.log(data);
        })
        .catch(this.handleError);
    }
    removeComment(commentID: number): Observable<ISpotComment[]> {
      let url = `${this._mainUrl}/comment/${commentID}`;

      return this._http.delete(url, { headers: this.getHeaders() })
        .map((response: Response) => <ISpotComment[]> response.json())
        .do(data => {
          console.log("Removed comment with comment id: " + commentID);
          console.log(data);
        })
        .catch(this.handleError);
    }
    addImages(spotID: number, images: any[]): Observable<ISpot> {
      let payload = { 'images': images };
      let url = `${this._publicProductUrl}/${spotID}/upload_images`;

      return this._http.post(url, payload, { headers: this.getHeaders() })
        .map((response: Response) => <ISpot> response.json())
        .do(data => {
          console.log("Added images to spot with id: " + spotID);
          console.log(data);
        })
        .catch(this.handleError);
    }
    getRecentlyViewedSpots(): Observable<ISpot[]> {
      let url = `${this._publicProductUrl}/recently_viewed`;

      return this._http.get(url, { headers: this.getHeaders() })
        .map((response: Response) => <ISpot[]> response.json())
        .do(data => {
          console.log("Got recently viewed spots");
          console.log(data);
        })
    }
    getSpotRating(spotID: number): Observable<number> {
      let url = `${this._publicProductUrl}/${spotID}/rating`;

      return this._http.get(url, { headers: this.getHeaders()})
        .map((response: Response) => <number> response.json())
        .do(data => {
          console.log("Got spot rating!");
          console.log(data);
        })
        .catch(this.handleError);
    }

    updateSpot(spot: ISpot): Observable<ISpot> {
      let url = `${this._userProductUrl}/${spot.author.id}/spots/${spot.id}`;

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
}
