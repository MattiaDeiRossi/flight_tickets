import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../payments.service';
import { FlightUserPayment } from '../interfaces';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  flightId: string = '';
  
  constructor(private route: ActivatedRoute, private py: PaymentsService, private auth: AuthService){
    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
    });
  }

  onSubmit(f: NgForm) {
    const payment : FlightUserPayment = {
      userId: this.auth.get_id(),
      flightId: this.flightId,
      isPaid: true
    }
    this.py.post_payment(payment).subscribe({
      next: (n)=>{
        
      },
      error: (e)=>{
        console.log(e)
      }
    })
  }
}
