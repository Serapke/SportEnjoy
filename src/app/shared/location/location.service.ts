import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response} from '@angular/http';

const GEOLOCATION_ERRORS = {
	'errors.location.unsupportedBrowser': 'Browser does not support location services',
	'errors.location.permissionDenied': 'You have rejected access to your location',
	'errors.location.positionUnavailable': 'Unable to determine your location',
	'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class LocationService {
		url: string = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=';
		apiKey: string = 'AIzaSyBGMkgxkPh9OchfxtnYFAB2m_SqnuKI5dM';
		location: Location;
		errorMessage: string;

    constructor(private _http: Http) {
    }

	public getUserLocation(): Observable<any> {
		return Observable.create(observer => {
			if (window.navigator && window.navigator.geolocation) {
				window.navigator.geolocation.getCurrentPosition(
					(position) => {
						observer.next(position);
						observer.complete();
					},
					(error) => {
						switch (error.code) {
							case 1:
								observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
								break;
							case 2:
								observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
								break;
							case 3:
								observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
								break;
						}
					});
			}
			else {
				observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
			}
		});
	}

	public getLocationByCoordinates(): Observable<any> {
		return this._http.get(this.url + this.apiKey)
			.map((response: Response) =>  response.json())
			.do(data => {
				console.log("Got location!");
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

}
