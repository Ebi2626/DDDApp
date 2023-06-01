import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import jwt_decode from  "jwt-decode";
import { UserInfo } from "src/app/shared/models/user.model";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private _token: any;
  set token(token: any) {
    this._token = token;
    if(token) {
      try {
        const decodedToken: any = jwt_decode(token);
        this.userInfo = {
          userId: decodedToken?.sub,
          email: decodedToken?.email,
          name: decodedToken?.given_name,
          surname: decodedToken?.family_name,
        }
      } catch(e) {
        console.log('token to: ', token);
        console.log('error to: ', e);
      }

    }
  }
  get token(){
    return this._token;
  }

  private _userInfo?: UserInfo;
  set userInfo(userInfo: UserInfo | undefined) {
    if(userInfo){
      this._userInfo = userInfo;
      this.userInfo$.next(userInfo);
    }
  }
  get userInfo() {
    return this._userInfo;
  }

  constructor(private keycloakService: KeycloakService) {
    this.keycloakService.getToken().then((token) => {
      this.token = token;
    });
  }

  public userInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject({
    email: '',
    name: '',
    surname: '',
    userId: '',
  });



}
