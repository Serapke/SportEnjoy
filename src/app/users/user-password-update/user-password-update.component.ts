import {Component} from "@angular/core";
import {UserService} from "../user.service";

@Component({
  templateUrl: '/user-password-update.component.html',
  styleUrls: ['/user-password-update.component.css']
})
export class UserPasswordUpdateComponent {
  current_password: string;
  password: string;
  password_confirmation: string;
  submitted: boolean = false;
  submitting: boolean = false;

  constructor(
    private _userService: UserService,
  ) {
  }

  onSubmit() {
    this.submitting = true;
    this._userService.updateUserPassword(this.current_password, this.password, this.password_confirmation)
      .subscribe(() => {
          this.submitted = true;
          this.submitting = false;
        }, error => {
          console.error("Error: " + error);
        }
      );
  }
}
