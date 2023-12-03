import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { User } from './interfaces';

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
export class HttpService {
  private token: string = '';
  public url = 'http://localhost:8080';

  constructor(private http: HttpClient) {
    console.log('Http service instantiated');
    const loadedtoken = localStorage.getItem('token');
    if (!loadedtoken || loadedtoken.length < 1) {
      console.log("No token found in local storage");
      this.token = ""
    } else {
      this.token = loadedtoken as string;
      console.log("JWT loaded from local storage.")
    }
  }

  login(username: string, password: string, remember: boolean): Observable<any> {
    console.log('Login: ' + username + ' ' + password);
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(username + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    return this.http.get(this.url + '/login', options).pipe(
      tap((data) => {
        const recv = JSON.parse(JSON.stringify(data));
        // console.log(recv);
        if (recv.error == true)
          alert('User does not exists');
        this.token = (data as ReceivedToken).token;
        if (remember) {
          localStorage.setItem('token', this.token as string);
        }
      }));
  }

  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('token', this.token);
  }

  register(user: User): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url + '/users', user, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );

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
    for (let idx = 0; idx < roles.length; ++idx) {
      if (roles[idx] === 'ADMIN') {
        return true;
      }
    }
    return false;
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
