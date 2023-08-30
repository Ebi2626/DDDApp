import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/core/services/token.service';
import { UserInfo } from 'src/app/shared/models/user.model';

@Component({
  selector: 'dddapp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  userData$: Observable<UserInfo>;

  constructor(private tokenService: TokenService) {
    this.userData$ = tokenService.userInfo$;
  }

  changePassword() {
    this.tokenService.changePassword();
  }
}
