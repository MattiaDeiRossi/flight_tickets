import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { ROLES, User } from './interfaces';
import { AuthService } from './auth.service';

interface TokenData {
  username: string,
  role: string,
  id: string
}

interface ReceivedToken {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public url = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  get_users(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/users', options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

  del_user(username: string) {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete(this.url + '/users/' + username, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

}
