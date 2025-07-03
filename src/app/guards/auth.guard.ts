import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const isLoggedIn = this.authService.getCurrentUser() !== null;
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
        }
        // Check for admin routes
        if (next.data['roles'] && next.data['roles'].includes('Admin')) {
            const isAdmin = this.authService.isAdmin();
            if (!isAdmin) {
                this.router.navigate(['/']);
                return false;
            }
        }
        return true;
    }
}