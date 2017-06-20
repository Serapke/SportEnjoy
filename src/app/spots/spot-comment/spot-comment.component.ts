import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ISpot} from "../spot";
import {SpotService} from "../spot.service";
import {TextTransformService} from "../../shared/text-transform.service";

@Component({
  templateUrl: './spot-comment.component.html',
  styleUrls: ['./spot-comment.component.css'],
})
export class SpotCommentComponent implements OnInit {
  spot: ISpot;
  errorMessage: string;
  original_message_id: number;
  comment: string;
  submitted: boolean = false;
  submitting: boolean = false;

  constructor(
    private _spotService: SpotService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _textTransformService: TextTransformService
  ) {}

  ngOnInit() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this.getSpot(id);
      this.original_message_id = +params['original_message_id'];
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

  toSpot() {
    this._router.navigate(['/spot/' + this.spot.id]);
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  onSubmit() {
    this.submitting = true;
    this._spotService.commentSpot(this.spot.id, this.comment, this.original_message_id)
      .subscribe(
        spot => {
          this.spot = spot;
          this.submitted = true;
          this.submitting = false;
        },
        error => this.errorMessage = <any>error
      );
  }

  decode(s: string): string {
    s = s.replace(/\s/g, "_");
    return s;
  }
}
