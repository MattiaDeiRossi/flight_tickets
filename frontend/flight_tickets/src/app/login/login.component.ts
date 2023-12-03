import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { User } from '../interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private http: HttpService, private router: Router) { }

  onSubmit(f: NgForm) {
    console.log(f.value)
    this.http.login(f.value.username, f.value.password, f.value.checkr).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        console.log('User service token: ' + this.http.get_token());
        this.router.navigate(['/dashboard']);
        
      },
      error: (err) => {
        alert('Login error: ' + err.message);
      }
    });
  }
}
