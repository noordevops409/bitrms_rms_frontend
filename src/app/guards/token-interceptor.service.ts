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
            this.userService.clearAuthToken();
            this.router.navigate(['login'], { replaceUrl: true });
            return;
          }
        }
        return evt.clone();
      }),
      catchError((err: HttpErrorResponse) => {
        // Handle authentication/authorization errors and token expiration
        if (err.status === 401 || err.status === 403 || err.status === 0) {
          this.userService.clearAuthToken();
          this.router.navigate(['login'], { replaceUrl: true });
        }
        
        // Handle 500 errors related to token/session issues
        if (err.status === 500) {
          const errorText = typeof err.error === 'string' ? err.error : '';
          // Check if error is related to oauth_access_token or session issues
          if (errorText.includes('oauth_access_token') || 
              errorText.includes('DELETE command denied') ||
              errorText.includes('SQLSyntaxErrorException')) {
            console.warn('Token/Session expired or invalid. Redirecting to login...');
            this.userService.clearAuthToken();
            this.router.navigate(['login'], { replaceUrl: true });
          }
        }
        
        const errorMsg = (err.error && err.error.error_description) ? err.error.error_description : (err.message || 'Unknown error');
        return throwError(errorMsg);
      })
    )
  }

}
