import { Component, OnDestroy } from '@angular/core';

import { AuthService } from './../auth.service';
import { User } from './../user';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent{

  constructor(public authService: AuthService) {}
}
