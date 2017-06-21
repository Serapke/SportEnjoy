import {OnInit, Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SpotService} from "../spot.service";
import {TextTransformService} from "../../shared/text-transform.service";
import {ISpot} from "../spot";
import {FileService} from "../../shared/file.service";

@Component({
  templateUrl: './spot-add-images.component.html',
  styleUrls: ['./spot-add-images.component.css'],
})
export class SpotAddImagesComponent implements OnInit {
  images: any[] = [];
  spot: ISpot;
  errorMessage: string;
  files: any[] = [];
  submitted: boolean = false;
  submitting: boolean = false;

  constructor(
    private _spotService: SpotService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fileService: FileService,
    private _textTransformService: TextTransformService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this.getSpot(id);
    });
  }

  getSpot(id: number) {
    this._spotService.getSpot(id)
      .subscribe(
        spot => {
          this.spot = spot;
        },
        error => this.errorMessage = <any>error
      );
  }

  changeListener($event) : void {
    this.images = [];
    this.files = $event.target.files;
    console.log(this.files);
    Array.from(this.files).forEach((item) => {
      this._fileService.read(item)
        .subscribe(
          data => {
            this.images.push({data: data, title: ""});
          }
        );
    });
  }

  toSpot() {
    this._router.navigate(['/spot/' + this.spot.id]);
  }

  onSubmit() {
    this.submitting = true;
    this._spotService.addImages(this.spot.id, this.images)
      .subscribe(
        spot => {
          this.spot = spot;
          this.submitted = true;
          this.submitting = false;
        },
        error => this.errorMessage = <any>error
      );
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  decode(s: string): string {
    s = s.replace(/\s/g, "_");
    return s;
  }
}
