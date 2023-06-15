import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {

  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const authenticated = await this.keycloak.isLoggedIn();
    if (!authenticated) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
