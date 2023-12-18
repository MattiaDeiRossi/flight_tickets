import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightDocument, User } from '../interfaces';
import { FlightsService } from '../flights.service';
import { AuthService } from '../auth.service';

export interface UserTimeout {
  flightId: number;
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

  constructor(private fs: FlightsService, private router: Router, private auth: AuthService) {
    this.fs.get_flights().subscribe({
      next: (n) => {
        this.flights = n;

        for (let i = 0; i < this.flights.length; i++) {
          this.costs.push(Math.random() * 150);
        }
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  purchaseTicket(_t6: any) {
    if(this.addUserTimer(this.auth.get_username(), 0 ))
      this.router.navigate(['/payments'])
  }

  addUserTimer(username: string, flightId: number, duration: number=2000): boolean {
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

      }, duration);
      return true;
    } else {
      return false;
    }
  }

  isFlightIdPresent(flightId: number): boolean {
    for (const username of Object.keys(this.timers)) {
      const userTimers = this.timers[username];
      if (userTimers.some(timer => timer.flightId === flightId)) {
        return true;
      }
    }
    return false;
  }
}
