import { Component } from '@angular/core';
import { FlightDocument, FlightUserPayment } from '../interfaces';
import { PaymentsService } from '../payments.service';
import { FlightsService } from '../flights.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-my-flights',
  templateUrl: './my-flights.component.html',
  styleUrl: './my-flights.component.css'
})
export class MyFlightsComponent {
  flights: FlightDocument[] = [];
  costs: number[] = [];
  constructor(private py: PaymentsService, private fs: FlightsService, private auth: AuthService) {
    this.fs.get_flights().subscribe({
      next: (flights: FlightDocument[]) => {
        this.py.get_payments().subscribe({
          next: (flights_sold: FlightUserPayment[]) => {
            this.filterFlights(flights, flights_sold);


            for (let i = 0; i < this.flights.length; i++) {
              this.costs.push(Math.random() * 150);
            }
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
    this.flights = flights.filter(flight => flights_sold.some(soldFlight => (soldFlight.flightId === flight._id) && (soldFlight.userId === this.auth.get_id())));
  }
}
