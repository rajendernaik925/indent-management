import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: any): boolean | UrlTree {

    const role = localStorage.getItem('rightsToAccess');  // manager / employee
    const expectedRole = route.data['expectedRole'];      // set inside routes

    if (!role) {
      return this.router.parseUrl('/login'); // or your login route
    }

    // ALLOW if role matches
    if (role === expectedRole) {
      return true;
    }

    // BLOCK + redirect correctly
    if (role === 'manager') {
      return this.router.parseUrl('/manager');
    }

    if (role === 'employee') {
      return this.router.parseUrl('/employee');
    }

    return false;
  }
}
