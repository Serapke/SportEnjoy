import { provideRouter, RouterConfig }  from '@angular/router';
import { TopSpotsComponent } from './spots/spots-top/spots-top.component';
import { SpotDetailComponent } from './spots/spot-detail/spot-detail.component';
import { SpotsComponent } from './spots/spots.component';
import { SpottersComponent } from './spotters/spotters.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ReviewComponent } from './review/review.component';
import { SpotAddComponent } from './spots/spot-add/spot-add.component';
import { SpotUpdateComponent } from './spots/spot-update/spot-update.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';
import { LoggedInGuard } from './shared/logged-in.guard';
import { LoginService } from './login/login.service';
import { UserPasswordUpdateComponent } from "./users/user-password-update/user-password-update.component";
import { UserInfoUpdateComponent } from "./users/user-info-update/user-info-update.component";
import {SpotCommentComponent} from "./spots/spot-comment/spot-comment.component";
import {FlaggedCommentsComponent} from "./review/flagged-comments.component";
import {SpotAddImagesComponent} from "./spots/spot-add-images/spot-add-images.component";

export const routes: RouterConfig = [
	{
	  path: 'top-places',
	  component: TopSpotsComponent
	},
    {
        path: '',
		redirectTo: '/spots',
        pathMatch: 'full'
    },
	{
		path: 'spots',
		component: SpotsComponent,
	},
	{
		path: 'spot/:id',
		component: SpotDetailComponent
	},
	{
		path: 'spotters',
		component: SpottersComponent
	},
	{
		path: 'contact',
		component: ContactComponent
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: 'register',
		component: LoginComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: 'add-spot',
		component: SpotAddComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: 'review',
		component: ReviewComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: 'spot/:id/update',
		component: SpotUpdateComponent,
		canActivate: [LoggedInGuard]
	},
  {
    path: 'spot/:id/comment',
    component: SpotCommentComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'spot/:id/comment/:original_message_id',
    component: SpotCommentComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'spot/:id/add-images',
    component: SpotAddImagesComponent,
    canActivate: [LoggedInGuard]
  },
	{
		path: 'users',
		component: UsersComponent,
		canActivate: [LoggedInGuard]
	},
  {
    path: 'user/update-password',
    component: UserPasswordUpdateComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'user/update-info',
    component: UserInfoUpdateComponent,
    canActivate: [LoggedInGuard]
  },
	{
		path: 'user/:id',
		component: UserComponent,
		canActivate: [LoggedInGuard]
	}
];

export const appRouterProviders = [
  provideRouter(routes),
  	LoggedInGuard,
  	LoginService
];
