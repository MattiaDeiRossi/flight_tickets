import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLES, User } from '../interfaces';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private auth: AuthService, private router: Router, private us: UsersService) { }

  onSubmit(f: NgForm) {
    this.auth.login(f.value.username, f.value.password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + f.value.username);
        // console.log('User service token: ' + this.auth.get_token());

        this.us.get_user(f.value.username).subscribe({
          next: (user : User) => {
            if (user.role === ROLES.ADMIN)
              this.router.navigate(['/users']);
            else
              this.router.navigate(['/flightslist']);
          },
          error: (e) => {
            Swal.fire({
              title: e.message,
              icon: 'error',
              allowOutsideClick: false,
            });
          }          
        })


      },
      error: (err) => {
        Swal.fire({
          title: err.message,
          icon: 'error',
          allowOutsideClick: false,
        });
      }
    });
  }
}
