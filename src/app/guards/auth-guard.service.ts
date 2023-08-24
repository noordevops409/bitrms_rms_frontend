import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, NavigationEnd, RouterStateSnapshot, UrlTree, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private activeRouteData: any = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {


  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let routeData: any = route.data;
    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }
    let userData = this.userService.getData();
    if (userData && !Object.keys(routeData).length) {
      return true;
    } else if (Object.keys(routeData).length && routeData.roleIds && routeData.roleIds.length) {
      if (routeData.roleIds.includes(authToken.roleId)) {
        return true;
      } else {
        this.router.navigate(['pages', 'dashboard'], { replaceUrl: true });
        return false;
      }
    } else {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['login'], { replaceUrl: true });
      return false;
    }
  }
}
