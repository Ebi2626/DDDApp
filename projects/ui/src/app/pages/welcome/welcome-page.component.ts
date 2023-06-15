import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'ddda-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {

  constructor(private keycloakService: KeycloakService, private router: Router) {
  }

  public login() {
    this.keycloakService.login({ redirectUri: 'http://localhost:4201/dashboard' });
  }

}
