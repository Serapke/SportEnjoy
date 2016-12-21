import { Component, OnInit, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { LoginService } from '../../login/login.service';
import { FileService } from '../../shared/file.service';
import { LocationService } from '../../shared/location/location.service';

@Component({
  selector: 'ng-topPlaces',
  templateUrl: '../form.html',
  styleUrls: ['../form.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SpotAddComponent implements OnInit {
  spot: ISpot;
  errorMessage: string;
  submitted: boolean = false;
  submitting: boolean = false;
  image: string = "";
  file: string = "";

  userPosition: any;
  centerLat: number = 54.8;
  centerLng: number = 23.9;
  zoom: number = 1;

  constructor(
    private _spotService: SpotService,
    private _loginService: LoginService,
    private _fileService: FileService,
    private _locationService: LocationService,
    private _ngZone: NgZone,
    private _router: Router) {}

  ngOnInit(): void {
    this.spot = new ISpot();
    this.getUserLocation();
  }

  setMarkerOnCurrentLocation(): void {
    this.spot.latitude = this.userPosition.coords.latitude;
    this.spot.longitude = this.userPosition.coords.longitude;
  }

  getUserLocation(): void {
    this._locationService.getUserLocation()
      .subscribe(position => {
        this.userPosition = position;
        this.centerLat = this.userPosition.coords.latitude;
        this.centerLng = this.userPosition.coords.longitude;

        this.zoom = 14;
      }, error => {
        this.errorMessage = error;
      });
  }

  changeListener($event) : void {
    this.file = $event.target.files[0].name;
      this._fileService.read($event.target, this.spot).subscribe(
      data => { this.image = data; }
    );
  }

  mapClicked($event: any) {
    this.spot.latitude = $event.coords.lat;
    this.spot.longitude = $event.coords.lng;
  }

  onSubmit() {
    this.submitting = true;
    this._locationService.geocode(this.spot.latitude, this.spot.longitude)
      .subscribe(position => {
        console.log(this.findAddressPart(position, "route", "short"));
        this.spot.city = this.findAddressPart(position, "locality", "long");
        this.spot.country = this.findAddressPart(position, "country", "long");
        this._spotService.createSpot(this.spot)
          .subscribe(() => {
            this._ngZone.run(() => {
              this.submitted = true;
              this.submitting = false;
            });
          },
          error => {
            this.errorMessage = <any>error;
            console.error("error");
          }
         );
      }, error => {
        this.spot.city = "undefined";
        this.spot.country = "undefined";
      });
  }

  findAddressPart(position: any, part: string, version: string): string {
    let address = position[0].address_components;
    for (var item of address) {
      if (item.types.indexOf(part) != -1)  {
        if (version == "long") {
          return item.long_name;
        }
        return item.short_name;
      }
    }
    return "";
  }

  isModerator() {
    return this._loginService.isModerator();
  }

  isAdding() {
    return true;
  }
  isUpdating() {
    return false;
  }
}
