import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { ROLES, User } from './interfaces';
import Swal from 'sweetalert2';

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
export class AuthService {

  private token: string = '';
  public url = 'http://localhost:8081';

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

  login(username: string, password: string): Observable<any> {
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
        if (recv.error == true){
          Swal.fire({
            title: 'User does not exists',
            icon: 'error',
            allowOutsideClick: true,
          })
        }
        this.token = (data as ReceivedToken).token;
        localStorage.setItem('token', this.token as string);
      }));
  }

  logout() {
    console.log('Logging out');
    this.token = ''
    localStorage.removeItem('token')
  }

  is_logged(): boolean {
    return this.token != '';
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
    try {
      const roles = (jwtDecode(this.token) as TokenData).role;
      return roles === ROLES.ADMIN;
    } catch (error) {
      return false;
    }
  }

  register(user: User): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url + '/register', user, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );

  }

}
