import { Component } from '@angular/core';
import { User } from '../interfaces';
import { AuthService } from '../auth.service';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public user: User = { password: '', username: '', role: '' };

  constructor(private auth: AuthService, private router: Router) {
    this.user.username = auth.get_username();
    this.user.role = auth.get_role();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
