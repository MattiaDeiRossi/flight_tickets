import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightDocument, FlightUserPayment, User } from '../interfaces';
import { FlightsService } from '../flights.service';
import { AuthService } from '../auth.service';
import { PaymentsService } from '../payments.service';
import { NgForm } from '@angular/forms';

interface SearchForm{
  departure: string,
  arrival: string,
  departure_date: Date
}

export interface UserTimeout {
  flightId: string;
  duration: number;
}

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent {
  flights: FlightDocument[] = [];
  costs: number[] = [];
  timers: { [username: string]: UserTimeout[] } = {};
  search: SearchForm = {
    departure: '',
    arrival: '',
    departure_date: new Date()
  }
  cities: string[] = [];

  constructor(private py: PaymentsService, private fs: FlightsService, private router: Router, private auth: AuthService) {
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
    this.flights = flights.filter(flight => !flights_sold.some(soldFlight => soldFlight.flightId === flight._id));
  }

  purchaseTicket(flight: FlightDocument) {
    if (this.addUserTimer(this.auth.get_username(), flight._id))
      this.router.navigate(['/payments'], { queryParams: { flightId: flight._id } })
  }

  addUserTimer(username: string, flightId: string, duration: number = 50000): boolean {
    const isFlightIdPresent = this.isFlightIdPresent(flightId);

    if (!isFlightIdPresent) {
      if (!this.timers[username]) {
        this.timers[username] = [];
      }

      const userTimer: UserTimeout = {
        flightId: flightId,
        duration: duration,
      };

      this.timers[username].push(userTimer);

      setTimeout(() => {
        alert("Timeout reached for payment");
        this.router.navigate(['/flightslist'])
      }, duration);
      return true;
    } else {
      return false;
    }
  }

  isFlightIdPresent(flightId: string): boolean {
    for (const username of Object.keys(this.timers)) {
      const userTimers = this.timers[username];
      if (userTimers.some(timer => timer.flightId === flightId)) {
        return true;
      }
    }
    return false;
  }
  
  onSubmit(f: NgForm) {
    console.log(f.value)
    this.fs.get_flights_by_departure_arrival_startdate(f.value.departure, f.value.arrival, f.value.departureDate).subscribe({
      next: (fs)=>{

        this.py.get_payments().subscribe({
          next: (flights_sold: FlightUserPayment[]) => {
            this.filterFlights(fs, flights_sold);
            console.log("here")

          },
          error: (e) => {
            console.log(e)
          }
        })
      },
      error: (e) => {
        if(e.error.error === "No flights found"){
          alert(e.error.error)
          this.fs.get_flights_by_departure_arrival(f.value.departure, f.value.arrivar).subscribe({
            next: (d)=>{

              console.log(d)

              this.py.get_payments().subscribe({
                next: (flights_sold: FlightUserPayment[]) => {
                  this.filterFlights(d, flights_sold);
                  this.cities = [...new Set(this.flights.map(flight => flight.departure.airport).concat(this.flights.map(flight => flight.arrival.airport)))];
                },
                error: (e) => {
                  console.log(e)
                }
              })

            },
            error: (e)=>{
              console.log(e)
            }
          })
        }
      }
    })
  }

}
