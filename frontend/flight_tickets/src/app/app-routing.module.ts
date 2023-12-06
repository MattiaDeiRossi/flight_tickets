import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { AuthGuardService } from './auth-guard.service';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'signup', title: 'Register', component: SignupComponent },
  { path: 'profile', title: 'Profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'users', title: 'Users', component: UsersComponent, canActivate: [AuthGuardService]},
  { path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
  { path: 'flightsearch', title: 'Flight Search', component: FlightSearchComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
