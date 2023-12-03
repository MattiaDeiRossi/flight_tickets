import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private us: HttpService, private router: Router) { }

  onSubmit(f: NgForm) {
    this.us.register(f.value).subscribe({
      next: (d) => {
        console.log('Registration complete of: ' + JSON.stringify(d));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Login error: ' + err);
      }
    })
  }
}
