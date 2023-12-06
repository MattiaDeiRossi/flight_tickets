import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { ROLES, User } from './interfaces';

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

  private token: string = '';
  public url = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {
    const loadedtoken = localStorage.getItem('token');
    if (!loadedtoken || loadedtoken.length < 1) {
      console.log("No token found in local storage");
      this.token = ""
    } else {
      this.token = loadedtoken as string;
      console.log("JWT loaded from local storage.")
    }
  }

  get_token() {
    return this.token;
  }

  get_username() {
    return (jwtDecode(this.token) as TokenData).username;
  }

  get_id() {
    return (jwtDecode(this.token) as TokenData).id;
  }

  get_role() {
    return (jwtDecode(this.token) as TokenData).role;
  }

  is_admin(): boolean {
    const roles = (jwtDecode(this.token) as TokenData).role;
    return roles === ROLES.ADMIN;
  }

  get_users(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.token,
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
        authorization: 'Bearer ' + this.token,
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
