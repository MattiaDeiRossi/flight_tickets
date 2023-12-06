import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit(f: NgForm) {
    this.auth.register(f.value).subscribe({
      next: (d) => {
        console.log('Registration complete of: ' + JSON.stringify(d));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Sign up error: ' + err.message);
      }
    })
  }
}
