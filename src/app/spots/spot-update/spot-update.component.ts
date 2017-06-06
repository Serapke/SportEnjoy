import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { ISpot } from '../spot';
import { SpotService } from '../spot.service';
import { FileService } from '../../shared/file.service';
import { LocationService } from '../../shared/location/location.service';
import {TranslateService} from "ng2-translate";
import {TextTransformService} from "../../shared/text-transform.service";

@Component({
  selector: 'ng-topPlaces',
  templateUrl: '../form.html',
  styleUrls: ['../form.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SpotUpdateComponent implements OnInit, OnDestroy {
  rotatedCategoryDropdownArrow: boolean = false;
  private sub: any;
  spot: ISpot;
  oldSpot: ISpot;
  errorMessage: string;
  submitted: boolean = false;
  submitting: boolean = false;
  image: string;
  file: string = "";
  categories: string[];

  centerLat: number = 54.8;
  centerLng: number = 23.9;
  zoom: number = 16;

  constructor(
    private _spotService: SpotService,
    private _route: ActivatedRoute,
    private _fileService: FileService,
    private _locationService: LocationService,
    private _translate: TranslateService,
    private _textTransformService: TextTransformService,
    private _ngZone: NgZone,
    private _router: Router) {}

  ngOnInit(): void {
    if (!this.spot) {
      this.sub = this._route.params.subscribe(params => {
        let id = +params['id'];
        this.getSpot(id);
      });
    }
    this._spotService.getCategories()
      .subscribe(categories => {
          this.getTranslations(categories);
          console.log("got translations");
        },
        error =>  this.errorMessage = <any>error
      );
  }

  getTranslations(categories: string[]): void {
    this.categories = new Array();
    this._translate.get(categories).subscribe((translations: string[]) => {
      for (let key in translations) {
        if (translations.hasOwnProperty(key)) {
          this.categories.push(translations[key]);
        }
      }
    });
  }

  showCategories(): void {
    this.rotatedCategoryDropdownArrow = true;
  }

  hideCategories(): void {
    this.rotatedCategoryDropdownArrow = false;
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  saveCategory(category: string): void {
    this.spot.category = this.prettify(category.toLowerCase());
    this.rotatedCategoryDropdownArrow = !this.rotatedCategoryDropdownArrow;
  }

  mapClicked($event: any) {
    this.spot.latitude = $event.coords.lat;
    this.spot.longitude = $event.coords.lng;
  }

  onSubmit() {
    this.submitting = true;
    this._locationService.geocode(this.spot.latitude, this.spot.longitude).
      subscribe(position => {
        console.log(this.findAddressPart(position, "route", "short"));
        let manual_city_value = this.spot.city;
        this.spot.city = this.findAddressPart(position, "locality", "long");
        this.spot.country = this.findAddressPart(position, "country", "long");
        if (!this.spot.city || this.spot.city.length === 0)
          this.spot.city = manual_city_value;
        this._spotService.updateSpot(this.spot)
          .subscribe(() => {
            this._ngZone.run(() => {
              this.submitted = true;
              console.log(this.submitted);
              this.submitting = false;
            });
            }, error => {
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

  changeListener($event) : void {
    this.file = $event.target.files[0].name;
    this._fileService.read($event.target, this.spot).subscribe(
      data => { this.image = data; }
    );
  }

  getSpot(id: number) {
    this._spotService.getSpot(id)
      .subscribe(
        spot => {
          this.spot = spot;
          this.oldSpot = spot;
          this.image = this.spot.images;
          this.centerLat = spot.latitude;
          this.centerLng = spot.longitude;
        },
        error => this.errorMessage = <any>error
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  isAdding(): boolean {
    return false;
  }
  isUpdating(): boolean {
    return true;
  }
}
