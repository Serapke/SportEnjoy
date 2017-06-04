import {Component, OnInit} from "@angular/core";
import {UserService} from "../user.service";
import {IUser} from "../user";
import {LoginService} from "../../login/login.service";

@Component({
  templateUrl: '/user-info-update.component.html',
  styleUrls: ['/user-info-update.component.css']
})
export class UserInfoUpdateComponent implements OnInit {
  user: IUser;
  submitted: boolean = false;
  submitting: boolean = false;

  constructor(
    private _userService: UserService,
    private _loginService: LoginService
  ) {
  }

  ngOnInit() {
    this.user = this._loginService.getCurrentUser();
  }

  onSubmit() {
    this.submitting = true;
    this._userService.updateUserInfo(this.user)
      .subscribe((data) => {
          this._loginService.setUserToLocalStorage(data);
          this.submitted = true;
          this.submitting = false;
        }, error => {
          console.error("Error: " + error);
        }
      );
  }
}
