import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot } from '@angular/router';
import { AutheticationService } from '../_services/authetication.service';


@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate, CanLoad {
    constructor(
        public router: Router,
        private authenticationService: AutheticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const isAuthenticate = this.authenticationService.screenArray.subscribe(screens => {
            if(screens.length){
                if(screens.includes(route.data.path)){ 
                    return true;
                } else{ 
                    this.router.navigate(['/accessDenied']);
                    return false;
                }
            }
            this.authenticationService.getScreenUrlArray();
        });

        if(isAuthenticate){
            return true;
        }
        this.router.navigate(['/accessDenied']);
        return false;
        // return this.canLoad();
    }

    canLoad() {
        if (!this.authenticationService.isLoggedIn) { 
            this.router.navigate(['/']);
        }
        return this.authenticationService.isLoggedIn;
    }
}