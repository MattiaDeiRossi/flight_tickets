import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  public url = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  createOrder(cart: any): Observable<any> {
    return this.http.post<any>(`${this.url}/orders`, { cart }).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));;
  }

  captureOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.url}/orders/${orderId}/capture`, {}).pipe(
      tap((data) => {
        return JSON.parse(JSON.stringify(data));
      }));;
  }
}
