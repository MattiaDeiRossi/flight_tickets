import { Component } from '@angular/core';
import { User } from '../interfaces';
import { UsersService } from '../users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  public users: User[] = [];

  constructor(public hs: UsersService, private router: Router) {
    this.getUsers();
  }

  getUsers() {
    this.hs.get_users().subscribe({
      next: (d) => {
        this.users = d;
      },
      error: (err) => {
        Swal.fire({
          title: err.message,
          icon: 'warning',
          allowOutsideClick: false,
        }).then(() => { })
      }
    })
  }

  onFlights(user: User) {
    this.hs.get_user(user.username).subscribe({
      next: (usr) =>{
        console.log(usr._id)
        this.router.navigate(['/myflights'],{ queryParams: { idUser: usr._id } });
      },
      error: (e)=>{
        console.log(e.error)
      }
    })
  }

  onDelete(del_username: User) {
    Swal.fire({
      title: "Do you really want to purchase delete user?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.hs.del_user(del_username.username).subscribe({
          next: (d) => {
            console.log('User deleted: ' + JSON.stringify(d));
            this.getUsers();
          },
          error: (err) => {
            Swal.fire({
              title: err.message,
              icon: 'warning',
              allowOutsideClick: false,
            }).then(() => { })
          }
        })

        Swal.fire("Done!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Cancelled", "", "info");
        return;
      }
    });

  }
}
