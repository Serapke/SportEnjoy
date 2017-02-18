import { Injectable } from "@angular/core";

declare var FB: any;

@Injectable()
export class FacebookService {
  public static STATUS_CONNECTED = 'connected';
  public static STATUS_NOT_AUTHORIZED = 'not_authorized';


  /**
   * Used to initialize and setup the SDK.
   * @param params
   */
  init(params: FacebookInitParams): void {
    FB.init(params)
  }

  /**
   * This method lets you make calls to the Graph API.
   * @param path  This is the Graph API endpoint path. This is a required parameter.
   * @param method  This is the HTTP method that is used for API request. Default is get.
   * @param params  This is an object consisting of any parameters that you want to pass into your Graph API call.
   * @returns {Promise<any>}
   */
  api(path: string, method: FacebookApiMethod = 'get', params: any = {}): Promise<any> {
    return new Promise<any>(
      (resolve, reject) => {
        FB.api(path, method, params, (response: any) => {
          if (!response) {
            reject();
          } else if (response.error) {
            reject(response.error)
          } else {
            resolve(response)
          }
        });
      }
    );
  }

  /**
   * Login the user
   * @param options
   * @returns {Promise<any>}
   */
  login(options?: FacebookLoginOptions): Promise<any> {
    return new Promise<any>(
      (resolve, reject) => {
        FB.login((response: any) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject();
          }
        }, options);
      }
    );
  }

  /**
   * Logout the user
   * @returns {Promise<any>}
   */
  logout(): Promise<any> {
    return new Promise<any>(
      (resolve) => {
        FB.logout((response: any) => {
          resolve(response);
        });
      }
    )
  }

  /**
   * This synchronous function returns back the current authResponse.
   * @returns {FacebookAuthResponse}
   */
  getAuthResponse(): FacebookAuthResponse {
    return <FacebookAuthResponse>FB.getAuthResponse();
  }
}

export interface FacebookInitParams {
  /**
   * Application ID. Defaults to null.
   */
  appId: string;

  /**
   * Determines whether XFBML tags used by social plugins are parsed, and therefore whether the plugins are rendered
   * or not. Defaults to false.
   */
  xfbml?: boolean;

  /**
   * Determines which version of the Graph API and any API dialogs or plugins are invoked when using the .api() and
   * .ui() functions. This is a required parameter.
   */
  version: string;

}

export type FacebookApiMethod = 'get' | 'post' | 'delete';

export interface FacebookLoginOptions {

  /**
   * The granted scopes will be returned in a comma-separated list.
   */
  scope?: string;
}

export interface FacebookAuthResponse {
  /**
   * User access token
   */
  accessToken: string;
  /**
   * Access token lifetime in seconds
   */
  expiresIn: number;
  /**
   *
   */
  signedRequest: string;
  /**
   * The Facebook user ID
   */
  userID: string;
  /**
   * The granted scopes. This field is only available if you set `return_scopes` to true when calling login method.
   */
  grantedScopes?: string;
}
