import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightDocument, FlightUserPayment, User } from '../interfaces';
import { FlightsService } from '../flights.service';
import { AuthService } from '../auth.service';
import { PaymentsService } from '../payments.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


interface SearchForm {
  departure: string,
  arrival: string,
  departure_date: Date
}

export interface UserTimeout {
  flightId: string;
  timeout: any;
}

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent {
  duration: number = 1000 * 60 * 0.5; // 1/2 minute;
  flights: FlightDocument[] = [];
  timers: { [username: string]: UserTimeout[] } = {};
  search: SearchForm = {
    departure: '',
    arrival: '',
    departure_date: new Date()
  }
  cities: string[] = [];

  constructor(private py: PaymentsService, private fs: FlightsService, private router: Router, private auth: AuthService) {
    this.refreshFlights()
  }

  refreshFlights() {
    this.fs.get_flights().subscribe({
      next: (flights: FlightDocument[]) => {
        this.py.get_payments().subscribe({
          next: (flights_sold: FlightUserPayment[]) => {
            this.filterFlights(flights, flights_sold);
            this.cities = Array.from(new Set([...this.flights.map(flight => flight.departure.airport), ...this.flights.map(flight => flight.arrival.airport)]));
            this.cities.sort();

            this.flights.forEach((f: FlightDocument) => {
              f.price = Math.random() * 150;
            })

            // this.fs.update_flights(this.flights).subscribe({
            //   next: (n) => {

            //   },
            //   error: (e) => {
            //     console.log(e)
            //   }
            // })
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

  addUserTimer(username: string, flightId: string): void {
    if (!this.timers[username]) {
      this.timers[username] = [];
    }

    const userTimer: UserTimeout = {
      flightId: flightId,
      timeout: setTimeout(() => {
        Swal.fire({
          title: 'Timeout reached for payment',
          icon: 'warning',
          allowOutsideClick: false,
        }).then(() => {
          this.auth.logout();
          this.router.navigate(['/login']);
        });
      }, this.duration)
    };

    this.timers[username].push(userTimer);

  }

  stopUserTimer(username: string) {
    const userTimeout = this.timers[username].pop();

    if (userTimeout) {
      clearTimeout(userTimeout.timeout);
    }
  }

  onSubmit(f: NgForm) {
    console.log(f.value)
    this.fs.get_flights_by_departure_arrival_startdate(f.value.departure, f.value.arrival, f.value.departureDate).subscribe({
      next: (fs) => {

        this.py.get_payments().subscribe({
          next: (flights_sold: FlightUserPayment[]) => {
            this.filterFlights(fs, flights_sold);
            this.flights.forEach((f: FlightDocument) => {
              f.price = Math.random() * 150;
            })
          },
          error: (e) => {
            console.log(e)
          }
        })
      },
      error: (e) => {
        if (e.error.error === "No flights found") {
          Swal.fire({
            title: e.error.error,
            icon: 'warning',
            allowOutsideClick: false,
          }).then(() => { })

          this.fs.get_flights_by_departure_arrival(f.value.departure, f.value.arrival).subscribe({
            next: (d) => {

              this.py.get_payments().subscribe({
                next: (flights_sold: FlightUserPayment[]) => {
                  this.filterFlights(d, flights_sold);
                  this.flights.forEach((f: FlightDocument) => {
                    f.price = Math.random() * 150;
                  })
                },
                error: (e) => {
                  console.log(e)
                }
              })

            },
            error: (e) => {
              this.flights = []
            }
          })
        }
      }
    })
  }


  onPurchase(flight: any) {
    this.addUserTimer(this.auth.get_username(), flight._id);
    const payment: FlightUserPayment = {
      userId: this.auth.get_id(),
      flightId: flight._id,
      isPaid: true
    }


    Swal.fire({
      title: "Do you really want to purchase that flight ticket?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.py.post_payment(payment).subscribe({
          next: (n) => {
            if (n.result) {
              this.stopUserTimer(this.auth.get_username())
              this.refreshFlights()
              Swal.fire("Done!", "", "success");
            }
          },
          error: (e) => {
            console.log(e)
            Swal.fire("Cancelled", "", "info");

          }
        })

      } else if (result.isDenied) {
        Swal.fire("Cancelled", "", "info");
        this.stopUserTimer(this.auth.get_username())
        return;
      }
    });


  }
}
