import { Injectable } from '@angular/core';
import { AuthGuard } from './auth-guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { AuthenticationService } from '../services/login/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate, CanActivateChild {
  constructor(private authGuard: AuthGuard,
              private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = route.data['role'] as string;
    return this.authGuard.canActivate(route, state) && this.authenticationService.checkPermission(role);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = childRoute.data['role'] as string;
    return this.authGuard.canActivateChild(childRoute, state)
        && this.authenticationService.checkPermission(role);
  }
}





