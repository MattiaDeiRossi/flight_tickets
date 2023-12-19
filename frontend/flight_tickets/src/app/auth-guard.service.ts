import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  private protectedRoutes: { path: string, roles: string[] }[] = [
    { path: 'users', roles: ['admin'] },
    { path: 'myprofile', roles: ['client', 'admin'] },
    { path: 'myflights', roles: ['client'] },
    { path: 'flightslist', roles: ['client'] },
  ];

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.auth.get_role();
    const requestedRoute = route.routeConfig?.path;// Rimuovi il '/' iniziale dalla URL

    const allowedRoles = this.protectedRoutes
      .filter(route => route.path === requestedRoute)
      .map(route => route.roles)
      .flat();

    if (allowedRoles.includes(userRole)) {
      return true; 
    } else {
      Swal.fire({
        title: 'Unauthorized',
        icon: 'error',
        allowOutsideClick: true,
      }).then(() => {
        return false;
      });
      return false; 
    }
  }
}
