import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLES, User } from '../interfaces';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user: User = { password: '', username: '', role: '' };
  public admincode: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit(f: NgForm) {
    if(this.user.role === ROLES.ADMIN && this.admincode != '00000000'){
      Swal.fire({
        title: "AdminCode is wrong!",
        icon: 'error',
        allowOutsideClick: false,
      }).then(()=>{
        return;
      })
    }

    this.auth.register(this.user).subscribe({
      next: (d) => {
        console.log('Registration complete of: ' + JSON.stringify(d));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire({
          title: err.message,
          icon: 'error',
          allowOutsideClick: false,
        }).then(()=>{
          return;
        })
      }
    })
  }
}
