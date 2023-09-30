import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

export interface UserContactInfo {
  name: string;
  email: string;
}

@Injectable()
export class UserInfoService {
  constructor(private http: HttpService, private jwt: JwtService) {
    this.getAdminAccessToken();
  }
  public static token: string;

  public async getAdminAccessToken(): Promise<string> {
    const tokenUrl = `http://localhost:8080/auth/realms/dddapp/protocol/openid-connect/token`;
    const request$ = this.http.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'dddapp_server',
        client_secret: 'SDUHKxQbawPshf84bJLEV1dr5S4T2c1W',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const response = await firstValueFrom(request$);
    const token = response.data?.access_token || '';
    UserInfoService.token = token;
    return token;
  }

  private async fetchUserData(userId: string, token: string) {
    const url = `http://localhost:8080/auth/admin/realms/dddapp/users/${userId}`;
    const request$ = this.http
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return [];
        }),
      );
    const response = await firstValueFrom(request$);
    return response;
  }

  public async getUserInfo(userId: string): Promise<UserContactInfo> {
    let response;
    if (UserInfoService.token) {
      response = await this.fetchUserData(userId, UserInfoService.token);
    } else {
      const token = await this.getAdminAccessToken();
      response = await this.fetchUserData(userId, token);
    }

    const userInfo: UserContactInfo = {
      name: response?.data?.firstName || '',
      email: response?.data?.email || '',
    };
    return userInfo;
  }
}
