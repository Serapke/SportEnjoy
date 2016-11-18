import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Http, Response} from '@angular/http';
import { MapsAPILoader } from 'angular2-google-maps/core';

declare var google: any;

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class LocationService {
    location: Location;
    errorMessage: string;
    latlng: any;
    geocoder: any;
    public position: any;

    constructor(
      private _http: Http,
      private _loader: MapsAPILoader
    ) {}

  public getUserLocation(): Observable<any> {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            this.position = position;
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
      } else {
        observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
      }
    });
  }

  geocode(latitude: number, longitude: number): Observable<any> {
    this.latlng = {lat: latitude, lng: longitude};
    return new Observable<any>((observer: Observer<any>) => {
      // Invokes geocode method of Google Maps API geocoding.
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({'location': this.latlng }, (
        // Results & status.
        (results: any, status: any) => {
          if (status === "OK") {
            observer.next(results);
            observer.complete();
          } else {
            alert('Geocoding service: geocoder failed due to: ' + status);
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
