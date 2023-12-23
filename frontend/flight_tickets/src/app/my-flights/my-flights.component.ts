import { Component } from '@angular/core';
import { FlightDocument, FlightUserPayment } from '../interfaces';
import { PaymentsService } from '../payments.service';
import { FlightsService } from '../flights.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-flights',
  templateUrl: './my-flights.component.html',
  styleUrl: './my-flights.component.css'
})
export class MyFlightsComponent {
  flights: FlightDocument[] = [];
  idUser: string = ''

  constructor(private py: PaymentsService, private fs: FlightsService, public auth: AuthService, private route: ActivatedRoute) {
  
    this.route.queryParams.subscribe(params => {
      this.idUser = params['idUser'];
    });
    if(!this.idUser){
      // console.log("empty")
      this.idUser = this.auth.get_id();
    }

    // console.log(this.idUser)

    this.getMyFlights();
  }

  getMyFlights(){
    this.fs.get_flights().subscribe({
      next: (flights: FlightDocument[]) => {
        this.py.get_payments().subscribe({
          next: (flights_sold: FlightUserPayment[]) => {
            this.filterFlights(flights, flights_sold);
          },
          error: (e) => {
            console.log(e)
          }
        })
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  filterFlights(flights: FlightDocument[], flights_sold: FlightUserPayment[]) {
    this.flights = flights.filter(flight => flights_sold.some(soldFlight => (soldFlight.flightId === flight._id) && (soldFlight.userId === this.idUser)));
  }

  onRefund(flight: FlightDocument){
    this.py.delete_payment(flight._id).subscribe({
      next: (n)=>{
        this.getMyFlights();
      },
      error: (e)=>{
        console.log(e)
      }
    })
  }
}
