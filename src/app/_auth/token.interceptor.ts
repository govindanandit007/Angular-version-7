import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AutheticationService } from '../_services/authetication.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<
        any
    >(null);
    private constant: any = Constants;
    constructor(public authService: AutheticationService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!request.url.startsWith(this.constant.flexiAPIUrl)) {
            if (this.authService.getAccessToken()) {
                request = this.addToken(request, this.authService.getAccessToken());
            }
        } else {
            request = this.addToken(request, 'flexi-API');
        }
        return next.handle(request).pipe(
            catchError(error => {
                // console.log("401 error: " + JSON.stringify(error));
                if (
                    (error instanceof HttpErrorResponse &&
                        error.status === 401) ||
                    (error instanceof HttpErrorResponse && error.status === 0)
                ) {
                    // return this.handle401Error(request, next);                     
                    this.authService.logout();
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string) {

        const index = request.url.indexOf('oauth/token')
        if (token === 'flexi-API') {
            const authExternalToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJWaXNpb24gQ29ycG9yYXRpb24iLCJuYmYiOjE2MDMyODE1NTUsImV4cCI6MjIzNDQzMzU1NSwiaWF0IjoxNjAzMjgxNTU1LCJpc3MiOiJFeHByZXNzTGFiZWxTZXJ2ZXIiLCJhdWQiOiJFeHByZXNzTGFiZWxDbGllbnQifQ.1yrLzkRQUwOc9flEyyO49OLPW7C1spJSSsdzl5xaDRs'
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authExternalToken}`,
                    // 'Content-Type': 'application/json'
                }
            });
        } else if (index < 0) {
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            const tk = localStorage.getItem('token');
            return request.clone({
                // body : params,
                setHeaders: {
                    Authorization: `Basic ${tk}`,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                }
            });
        }

    }

    // private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    //     if (!this.isRefreshing) {
    //         this.isRefreshing = true;
    //         this.refreshTokenSubject.next(null);

    //         return this.authService.refreshToken().pipe(
    //             switchMap((token: any) => {
    //                 this.isRefreshing = false;
    //                 this.refreshTokenSubject.next(token.access_token);
    //                 return next.handle(
    //                     this.addToken(request, token.access_token)
    //                 );
    //             })
    //         );
    //     } else {
    //         return this.refreshTokenSubject.pipe(
    //             filter(token => token != null),
    //             take(1),
    //             switchMap(jwt => {
    //                 return next.handle(this.addToken(request, jwt));
    //             })
    //         );
    //     }
    // }
}
