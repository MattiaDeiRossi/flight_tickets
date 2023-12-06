import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  private protectedRoutes: { path: string, roles: string[] }[] = [
    { path: 'users', roles: ['boss'] },
    { path: 'profile', roles: ['boss','employee'] },

  ];

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.auth.get_role();
    // console.log(userRole)
    const requestedRoute = route.routeConfig?.path;// Rimuovi il '/' iniziale dalla URL
    // console.log(requestedRoute);

    const allowedRoles = this.protectedRoutes
      .filter(route => route.path === requestedRoute)
      .map(route => route.roles)
      .flat();

    if (allowedRoles.includes(userRole)) {
      return true; // L'utente può accedere
    } else {
      alert('Unauthorized');
      return false; 
    }
  }
}
