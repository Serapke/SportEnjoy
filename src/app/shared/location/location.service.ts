import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
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
		geocoder: google.maps.Geocoder;

    constructor(private _http: Http) {
		this.geocoder = new google.maps.Geocoder();
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

	geocode(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[]> {
		console.log("getting location");
		console.log(latLng);
        return new Observable<google.maps.GeocoderResult[]>((observer: Observer<google.maps.GeocoderResult[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ 'location': latLng }, (
                // Results & status.
                (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();
                    } else {
                        console.log('Geocoding service: geocoder failed due to: ' + status);
                        observer.error(status);
                    }
                })
            );
        });
    }

	private handleError(error: Response) {
		// in a real world app, we may send the server to some remote logging infrastructure
		// instead of just logging it to the console
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
