import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private token: string = '';
  public url = 'http://localhost:8081/api/payments';
  
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

  create_checkout_session(): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url + '/create-checkout-session', {}, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );
  }
}
