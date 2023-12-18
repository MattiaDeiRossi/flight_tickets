import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { FlightDocument } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {

  public url = 'http://localhost:8081/api/flights';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  get_flights(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/flights', options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

  update_flights(flights: FlightDocument[]) {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.put(this.url + '/flights', flights, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }


  get_flights_by_departure_arrival(departure: string, arrival: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/flights/' + departure + '/' + arrival, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }

  get_flights_by_departure_arrival_startdate(departure: string, arrival: string, startdate: Date): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.auth.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(this.url + '/flights/' + departure + '/' + arrival +'/' + startdate, options).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));
  }
}
