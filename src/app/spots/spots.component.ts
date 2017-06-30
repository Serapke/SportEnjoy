import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import 'rxjs/Rx';
import { LocationService } from '../shared/location/location.service';
import { SpottersJoinDirective } from '../shared/spotters-join/spotters-join.directive';
import { SpotService } from './spot.service';
import { Observable } from 'rxjs/Observable';
import { ISpot } from './spot';
import { SpotFilterPipe } from './spot-filter.pipe';
import { SebmGoogleMapInfoWindow, SebmGoogleMap} from 'angular2-google-maps/core';
import { TextTransformService } from '../shared/text-transform.service';

@Component({
  templateUrl: './spots.component.html',
  styleUrls: ['./spots.component.css'],
  pipes: [SpotFilterPipe],
  directives: [
    ROUTER_DIRECTIVES,
    SebmGoogleMap,
    SpottersJoinDirective
  ]
})
export class SpotsComponent implements OnInit {
  showingLocalSpots: boolean = false;

  spots: ISpot[];

  showSearchProperties: number = 0;
  rotatedSearchPropertiesArrow: boolean = false;

  errorMessage: string;
  selectedCity: string;
  selectedCategory: string;
  selectedPage: number;
  selectedSorting: string = '';
  listFilter: string = '';
  noImage: string = 'https://s3-eu-west-1.amazonaws.com/sportenjoy-files-upload/defaults/test.png';

  contentSize: number = 50;
  CONTENT_SIZE_MIN: number = 50;

  // Map params
  centerLat: number = 54.8;
  centerLng: number = 23.9;
  userLat: number;
  userLng: number;
  zoom: number = 6;
  mapDraggable: boolean;

  showSortProperties: boolean = false;
  selectedSpot: ISpot;
  openInfoWindow: SebmGoogleMapInfoWindow;
  userLocation: any;

  constructor(
    private _spotService: SpotService,
    private _route: ActivatedRoute,
    private _locationService: LocationService,
    private _textTransformService: TextTransformService,
    private _ngZone: NgZone,
      private _router: Router
  ) {
    this.mapDraggable = document.body.clientWidth < 992 ? false : true;
  }

  ngOnInit(): void {
    if (document.body.clientWidth < 450) {
      this.CONTENT_SIZE_MIN = 35;
      this.contentSize = this.CONTENT_SIZE_MIN;
    }
    this.getSpots();
  }

  getSpots(): void {
    this._route
      .params
      .subscribe(params => {
        this.selectedCity = params['location'];
        this.selectedCategory = params['category'];
        this.selectedPage = parseInt(params['page']);

        this.selectedCategory = this._textTransformService.escapeCharacters(this.selectedCategory);

        if (this.selectedCity && this.selectedCategory && this.selectedPage) {
          console.log(this.selectedCity + " " + this.selectedCategory + " " + this.selectedPage);
          this.getParticularSpots(this.selectedCategory, this.selectedCity, this.selectedPage);
        } else {
          this.getAllSpots();
          this.getLocalSpots();
        }
      });
  }

  getParticularSpots(category: string, city: string, page: number) {
    category = category.replace(/-/g, ' ');
    console.log("Get particular spots: "  + category + " " + city);
    this._spotService.getParticularSpots(city, category, page)
      .subscribe(spots => {
        this.spots = spots;
        if (spots[0]) {
          this.centerLat = this.spots[0].latitude;
          this.centerLng = this.spots[0].longitude;
          this.zoom = 10;
        }
      });
  }

  getAllSpots(): void {
    this._spotService.getSpots()
          .subscribe(spots => {
        this.spots = spots;
        this.sortSpotsByRating();
        this.selectedSorting = 'rating';
      }, error => {
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      });
  }

  getLocalSpots(): void {
    this._locationService.getUserLocation()
      .subscribe(position => {
        this.userLocation = position.coords;
        this._spotService.getLocalSpots(this.userLocation)
          .subscribe(spots => {
            // Setting user location marker
            this.userLat = this.userLocation.latitude;
            this.userLng = this.userLocation.longitude;
            // Centering map to user location
            this.centerLat = this.userLocation.latitude;
            this.centerLng = this.userLocation.longitude;

            this.showingLocalSpots = true;
            this.zoom = 12;
            // -----------
            this.spots = spots;
          });
      }, error => {
        this.errorMessage = error;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapDraggable = event.target.innerWidth < 992 ? false : true;
  }

  toggleSearchProperties(): void {
    if (this.showSearchProperties == 0) {
      this.showSearchProperties = 189;
      this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
      return;
    }
    this.rotatedSearchPropertiesArrow = !this.rotatedSearchPropertiesArrow;
    this.showSearchProperties = 0;
  }
  clickedMarker(spot: ISpot, i, infoWindow): void {
    console.log(infoWindow);
    this.selectedSpot = spot;
    // Center map on selected marker
    this.centerLat = this.selectedSpot.latitude;
    this.centerLng = this.selectedSpot.longitude;
    this.makeSelectedSpotFirst(i);

    if (this.openInfoWindow && this.openInfoWindow !== infoWindow){
      this.openInfoWindow.close();
    }
    this.openInfoWindow = infoWindow;
  }
  toggleDraggability(): void {
    this.mapDraggable = !this.mapDraggable;
  }
  toggleSortProperties(): boolean {
    return this.showSortProperties = !this.showSortProperties;
  }
  gotoDetail(spot: ISpot) {
    this._router.navigate(['/spot', spot.id]);
  }

  sortSpotsByAlphabet(): void {
    this.selectedSorting = 'alphabet';
    let spots = this.selectedSpot ? this.spots.slice(1) : this.spots;
    let sortedSpotters = spots.sort((a, b) => {
      if (this.selectedSpot && (a.id == this.selectedSpot.id || b.id == this.selectedSpot.id))
        return 0;
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
    this.spots = sortedSpotters;
    if (this.selectedSpot) this.spots.unshift(this.selectedSpot);
  }

  sortSpotsByRating(): void {
    this.selectedSorting = 'rating';
    let spots = this.selectedSpot ? this.spots.slice(1) : this.spots;
    let sortedSpotters = spots.sort((a, b) => {
      if (this.selectedSpot && (a.id == this.selectedSpot.id || b.id == this.selectedSpot.id))
        return 0;
      if (a.rating < b.rating) {
        return 1;
      }
      if (a.rating > b.rating) {
        return -1;
      }
      return 0;
    });
    this.spots = sortedSpotters;
    if (this.selectedSpot) this.spots.unshift(this.selectedSpot);
  }

  sortSpotsByBeenHere(): void {
    this.selectedSorting = 'beenHere';
    let spots = this.selectedSpot ? this.spots.slice(1) : this.spots;
    let sortedSpotters = spots.sort((a, b) => {
      if (a.beenHere < b.beenHere) {
        return 1;
      }
      if (a.beenHere > b.beenHere) {
        return -1;
      }
      return 0;
    });
    this.spots = sortedSpotters;
    if (this.selectedSpot) this.spots.unshift(this.selectedSpot);
  }

  makeSelectedSpotFirst(i) {
    let first = this.spots[0];
    this.spots[0] = this.selectedSpot;
    this.spots[i] = first;
  }

  gotoSpotters() {
    this._router.navigate(['/spotters']);
  }
}
