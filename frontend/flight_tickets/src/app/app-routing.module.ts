import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './auth-guard.service';
import { UsersComponent } from './users/users.component';
import { PaymentsComponent } from './payments/payments.component';
import { FlightListComponent } from './flight-list/flight-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'signup', title: 'Register', component: SignupComponent },
  { path: 'profile', title: 'Profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'users', title: 'Users', component: UsersComponent, canActivate: [AuthGuardService] },
  { path: 'flightslist', title: 'Flights List', component: FlightListComponent },
  { path: 'payments', title: 'Payments', component: PaymentsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
