import { Component } from '@angular/core';
import { User } from '../interfaces';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  public users: User[] = [];
  public del_username: string = "";

  constructor(private hs: UsersService, private router: Router) {
    this.getUsers();
  }

  getUsers(){
    this.hs.get_users().subscribe({
      next: (d) => {
        this.users = d;
      },
      error: (err) => {
        alert('Login error: ' + err.message);
      }
    })
  }

  setDelUsername(user: User){
    this.del_username = user.username;
  }
  onClicked(del_username: string) {
    this.hs.del_user(del_username).subscribe({
      next: (d) => {
        console.log('User deleted: ' + JSON.stringify(d));
        this.getUsers();
      },
      error: (err) => {
        alert('Login error: ' + err.message);
      }
    })
  }
}
