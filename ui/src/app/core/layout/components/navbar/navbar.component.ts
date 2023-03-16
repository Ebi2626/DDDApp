import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NavItem } from './navbar.model';

@Component({
  selector: 'dddapp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isOpen: boolean = false;
  navigation: NavItem[] = [
    {
      name: "Dashboard",
      route: "dashboard",
    },
    {
      name: "Cele",
      route: "targets",
    },
    {
      name: "Zadania",
      route: "tasks",
    },
    {
      name: "Kategorie",
      route: "categories",
    },
    {
      name: "Ustawienia",
      route: "settings",
    }
  ];

  constructor(private keycloak: KeycloakService, private location: Location) {
  }

  public logout() {
    const redirectionUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/welcome`;
    this.keycloak.logout(redirectionUrl);
  }

}
