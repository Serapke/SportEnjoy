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
		url: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
		apiKey: string = 'AIzaSyBGMkgxkPh9OchfxtnYFAB2m_SqnuKI5dM';
		location: Location;
		errorMessage: string;

    constructor(private _http: Http) {
    }

		public getLocation(): Observable<any> {
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

}
