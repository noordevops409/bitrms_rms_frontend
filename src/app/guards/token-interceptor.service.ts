import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from '../shared/services/user.service';
import { Observable, filter, pipe, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken: any = this.userService.getAuthToken();
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken.access_token}`
        }
      });

    }
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse),
      map((evt: any) => {
        if (evt.body && evt.body.message) {
          if (evt.body.message.toLowerCase().indexOf('authorization') > -1) {
            this.router.navigate(['login'], { replaceUrl: true });
            return;
          }
        }
        console.log(evt.body);
        return evt.clone();
      })
    )
  }

}
