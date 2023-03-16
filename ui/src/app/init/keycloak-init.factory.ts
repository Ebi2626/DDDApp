import { KeycloakService } from "keycloak-angular";
import { firstValueFrom, from, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ConfigInitService } from "./config-init.service";

export function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigInitService
) {
  return () =>
    firstValueFrom(
      configService.getConfig().pipe(
        switchMap<any, any>((config) => {
          return from(keycloak.init({
            config: {
              url: config['KEYCLOAK_URL'] + '/auth',
              realm: config['KEYCLOAK_REALM'],
              clientId: config['KEYCLOAK_CLIENT_ID'],
            },
            initOptions: {
              redirectUri: 'http://localhost:4201/dashboard',
              checkLoginIframe: false,
            },
          }));
        }
        )
      ))
}

