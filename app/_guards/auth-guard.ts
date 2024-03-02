import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/login/authentication-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const loginResult = await this.authenticationService.isAuthenticated();
        if (loginResult) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.canActivate(childRoute, state);
    }
}
