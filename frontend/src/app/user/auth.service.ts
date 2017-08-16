import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';

import { User } from './user';

interface IAuthResponse {
  readonly success?: boolean;
  readonly authenticated?: boolean;
  readonly user?: User;
  readonly token?: string;
  readonly redirect?: string;
}

@Injectable()
export class AuthService {
  public error: string;
  public loggedIn = false;
  private _jwtHelper: JwtHelper = new JwtHelper();
  private _user;
  private API = "/api/user";

  constructor(
    private _http: Http,
    private _router: Router,
  ) {
    this.getAuthenticatedState();
    this._watchForRedirectTarget();

    localStorage['redirect'] = '/';
  }

  public getAuthenticatedState(): Promise<Boolean> {
    var token = localStorage['id_token'];
    const tokenIsPresentAndExpired = token
      && this._jwtHelper.isTokenExpired(token);
    
    return this._http.get(this.API+'/authenticate')
    .map( res => res.json())
    .toPromise()
      .then(res => {
        console.log(res);
        if (res && res.user && res.token) {
          this.setAuthenticatedUser(res);
          return true;
        }

        return false;
      });;
  }

  public logout(): void {
    if (!localStorage['id_token']) {
      return;
    }

    this._http.get(this.API+'/logout')
      .subscribe(() => {
        this._setUnauthenticatedUser();
        this._router.navigate(['/']);
      });
  }

  public setAuthenticatedUser(res: IAuthResponse): void {
    this._user = res.user;
    this.loggedIn = true;
    localStorage['id_token'] = res.token;
  }

  public user() {
    return this._user;
  }

  private _onAuthenticated(res): void {
    this.setAuthenticatedUser(res);
    this._router.navigateByUrl(localStorage['redirect'] || '/');
  }

  private _setUnauthenticatedUser() {
    this._user = null;

    this.loggedIn = false;

    localStorage.removeItem('id_token');
  }

  private _watchForRedirectTarget(): void {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .filter(event => event['url'] !== '/login')
      .filter(event => event['url'] !== '/signup')
      .subscribe(event => localStorage['redirect'] = event['url']);
  }
}
