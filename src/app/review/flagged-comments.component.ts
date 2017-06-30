import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ISpot } from '../spots/spot';
import { SpotService } from '../spots/spot.service';
import { TextTransformService } from '../shared/text-transform.service';
import {ISpotComment} from "../spots/spot-comment";
import {TruncatePipe} from "../shared/truncate.pipe";

@Component({
  selector: 'ng-FlaggedComments',
  templateUrl: './flagged-comments.component.html',
  styleUrls: ['./flagged-comments.component.css'],
  pipes: [ TruncatePipe ],
  directives: [ROUTER_DIRECTIVES]
})
export class FlaggedCommentsComponent {
  comments: ISpotComment[];
  errorMessage: string;
  contentSize: number = 50;
  CONTENT_SIZE_MIN: number = 50;

  constructor(
    private _spotService: SpotService,
    private _textTransformService: TextTransformService,
    private _router: Router) {}

  ngOnInit(): void {
    if (document.body.clientWidth < 450) {
      this.CONTENT_SIZE_MIN = 15;
      this.contentSize = this.CONTENT_SIZE_MIN;
    }
    this.getFlaggedComments();
  }

  prettify(word: string): string {
    return this._textTransformService.capitalize(word);
  }

  private getFlaggedComments() {
    this._spotService.getCommentsForReview()
      .subscribe(
        comments => {
          this.comments = comments;
        },
        error =>  {
          this.errorMessage = <any>error;
          console.log(this.errorMessage)
        }
      )
  }

  toggleFullContent() {
    this.contentSize = this.contentSize == this.CONTENT_SIZE_MIN ? 0 : this.CONTENT_SIZE_MIN;
  }

  unflag(id: number) {
    this._spotService.unflagComment(id)
      .subscribe(
        comments => {
          this.comments = comments;
        },
        error =>  {
          this.errorMessage = <any>error;
          console.log(this.errorMessage)
        }
      )
  }

  remove(id: number) {
    this._spotService.removeComment(id)
      .subscribe(
        comments => {
          this.comments = comments;
        },
        error =>  {
          this.errorMessage = <any>error;
          console.log(this.errorMessage)
        }
      )
  }
}
