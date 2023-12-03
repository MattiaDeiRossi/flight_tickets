import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css'
})
export class FlightSearchComponent {
  filteredCities: string[] = [];
  selectedCity: string = "";
  allowedCities: string[] = ["City1", "City2"];

  selectCity(city: any) {
    this.selectedCity = city;
    this.filteredCities = [];
  }
  onCityInputChange() {
    this.filteredCities = this.allowedCities.filter((city: string) =>
      city.toLowerCase().includes(this.selectedCity.toLowerCase())
    );
  }
  onSubmit(f: NgForm) {

  }

}
