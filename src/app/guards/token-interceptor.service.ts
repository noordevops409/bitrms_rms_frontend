import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from '../shared/services/user.service';
import { Observable, filter, map, catchError, throwError } from 'rxjs';

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
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigate(['logout'], { replaceUrl: true });
        }
        return throwError(err.error.error_description);
      })
    )
  }

}
