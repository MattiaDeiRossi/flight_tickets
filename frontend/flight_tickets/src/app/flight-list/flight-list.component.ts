import { Component } from '@angular/core';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent {
purchaseTicket(_t6: any) {
throw new Error('Method not implemented.');
}
  flights: any = [];
  loadMoreCount = 10;

  constructor() {
    this.loadFlights();
  }

  loadFlights() {
    for (let i = 0; i < this.loadMoreCount; i++) {
      const flight = {
        departure: 'City' + (i + 1),
        destination: 'City' + (i + 2),
        departureDate: new Date().toDateString(),
        arrivalDate: new Date(new Date().getTime() + 86400000).toDateString(), // Adding 1 day (86400000 milliseconds)
        cost: Math.floor(Math.random() * 500) + 100 // Random cost between 100 and 600
      };
      this.flights.push(flight);
    }
  }

  onScroll(event: any) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
      this.loadFlights();
    }
  }
}
