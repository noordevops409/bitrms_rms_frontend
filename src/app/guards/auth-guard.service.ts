import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(): boolean {
    let userData = this.userService.getData();
    if(userData) {
      return true;
    } else {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['login'], { replaceUrl: true });
      return false;
    }
  }
}
