import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { FlightUserPayment } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  public url = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient, private auth: AuthService) {
  }


  get_payment(flightId: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/payments/' + flightId, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

  get_payments(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/payments', options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }


  post_payment(payment: FlightUserPayment): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(this.url + '/payments', payment, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

  delete_payment(flightId: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete(this.url + '/payments/'+ flightId, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

}
