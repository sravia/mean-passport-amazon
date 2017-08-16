import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { AUTH_PROVIDERS, AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './user/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './user/auth.service';
import { AuthenticatedGuard } from './user/authenticated.guard';
import { UnauthenticatedGuard } from './user/unauthenticated.guard';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    AuthenticatedGuard,
    UnauthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
