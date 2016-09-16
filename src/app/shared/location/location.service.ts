import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Http, Response} from '@angular/http';
import {MapsAPILoader} from 'angular2-google-maps/core';

const GEOLOCATION_ERRORS = {
	'errors.location.unsupportedBrowser': 'Browser does not support location services',
	'errors.location.permissionDenied': 'You have rejected access to your location',
	'errors.location.positionUnavailable': 'Unable to determine your location',
	'errors.location.timeout': 'Service timeout has been reached'
};
declare var google: any;

@Injectable()
export class LocationService {
		url: string = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=';
		apiKey: string = 'AIzaSyBGMkgxkPh9OchfxtnYFAB2m_SqnuKI5dM';
		location: Location;
		errorMessage: string;
		latlng: any;

    constructor(private _http: Http, private _loader: MapsAPILoader) {
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

	geocode(latitude: number, longitude: number): Observable<any> {
		console.log("getting location");
		console.log(latitude);
		console.log(longitude);
		this.latlng = {lat: latitude, lng: longitude};
        return new Observable<any>((observer: Observer<any>) => {
			console.log("in observer");
			this._loader.load().then(() => {
				let geocoder: google.maps.Geocoder = new google.maps.Geocoder;
				// Invokes geocode method of Google Maps API geocoding.
				geocoder.geocode({'location': this.latlng }, (
					// Results & status.
					(results: any, status: any) => {
						console.log("was");
						console.log(status);
						if (status === "OK") {
							console.log(results);
							observer.next(results);
							observer.complete();
						} else {
							alert('Geocoding service: geocoder failed due to: ' + status);
							observer.error(status);
						}
					})
            	);
			});
        });
		
    }

	private handleError(error: Response) {
		// in a real world app, we may send the server to some remote logging infrastructure
		// instead of just logging it to the console
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
