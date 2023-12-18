import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit(f: NgForm) {
    this.auth.login(f.value.username, f.value.password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + f.value.username);
        // console.log('User service token: ' + this.auth.get_token());
        this.router.navigate(['/flightslist']);
        
      },
      error: (err) => {
        alert('Login error: ' + err.message);
      }
    });
  }
}
