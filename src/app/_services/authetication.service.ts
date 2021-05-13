import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from 'src/app/_shared/Constants';
import { map } from 'rxjs/operators';
import { UserIdleService } from 'angular-user-idle';
import * as CryptoJS from 'crypto-js';
import { CommonService } from './common/common.service';
import { MatDialog } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AutheticationService {
    public key = 'access_token';
    public AccessToken = 'access_token';
    public RefreshToken = 'refresh_token';
    abc: any = Constants;

    isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn = this.isLoggedInSubject.asObservable();
    options: any;
    private accessApiLogin =
        Constants.apiBaseUrl + 'wmsapi-authorization/oauth/token';
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private headersForToken: any = '';
    loggedInUser = '';
    loggedInPass = '';
    screensArraySubject = new BehaviorSubject<any>([]);
    screenArray = this.screensArraySubject.asObservable();

    constructor(
        private router: Router,
        public http: HttpClient,
        public userIdleService: UserIdleService,
        public commonService: CommonService,
        private dialogRef: MatDialog
    ) {
        if (
            localStorage.getItem('isLoggedIn') === undefined ||
            window.localStorage.getItem('isLoggedIn') === 'undefined'
        ) {
            localStorage.setItem('isLoggedIn', 'false');
        }
        // this.options = this.requestHeaderService.getOptions();
    }

    isLoggedInChange(bValue: boolean) {
        this.isLoggedInSubject.next(bValue);
    }

    // get user screen array
    getUserScreenArray(arrayValue: any) {
        this.screensArraySubject.next(arrayValue);
    }

    getHeaders() {
        const header = {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', `bearer ${this.getAccessToken()}`)
        };
        // const options = { headers: header };
        return header;
    }

    // public getCookie(key: string) {
    //   return this.cookieService.get(key);
    // }

    // public setCookie(key: string, value: string) {
    //   this.cookieService.set(key, value);
    // }

    // public removeCookie(key: string) {
    //   this.cookieService.delete(key);
    // }

    private hasToken(): boolean {
        // return JSON.parse(localStorage.getItem('isLoggedIn'));
        return !!this.getAccessToken();
    }

    // Generating 64 bit hash to authenticate
    make_base_auth(user, password) {
         
        const tok = user + ':' + password;
        const hash = btoa(tok);
        return 'Basic ' + hash;
    }

    /*  Login the user then tell all the subscribers about the new status */
    // loginAccess(userName: string, userPassword: string): any {
    //   this.headers.append('Authorization', this.make_base_auth(userName, userPassword));
    //   const body = `{"username":"${Constants.authUser}","password":"${Constants.authPass}","grant_type":"password"}`;
    //   return this.http
    //     .post(this.accessApiLogin, body, { headers: this.headers })
    //     .pipe(map(user => {
    //       return user;
    //     }));
    // }

    /* Log out the user then tell all the subscribers about the new status */
    logout(): void {
        if (localStorage.getItem('isLoggedIn') !== undefined) {
             
            localStorage.setItem('isLoggedIn', 'false');
            // localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userDetails');
            document.cookie = 'username=;0;path=/';
            this.getUserScreenArray([]);
            this.commonService.unsubscribePingAPI(['logout']);
            this.removeTokens();
            this.isLoggedInSubject.next(false);
            this.userIdleService.stopTimer();
            this.userIdleService.stopWatching();
            localStorage.removeItem('navModules');
            localStorage.removeItem('currentModule');
            this.dialogRef.closeAll();
            this.router.navigate(['/']);
        }
    }

    // get refresh token
    refreshToken() { 
        const rememberData = JSON.parse(
            window.localStorage.getItem('rememberMe')
        );

        const userData = JSON.parse(window.localStorage.getItem('userDetails'));

        this.getEncryptedPassword(rememberData).subscribe(
            (result: any) => {
                let params = new HttpParams();
                params = params.append('username', Constants.tokenUser);
                params = params.append('password', Constants.tokenPass);
                params = params.append('grant_type', 'refresh_token');
                params = params.append(
                    'refresh_token',
                    `${this.getRefreshToken()}`
                );

                const headers = new HttpHeaders();
                 
                // headers.append( 'Authorization','Basic ' + btoa(rememberData.username + ':' + result.password) )
                headers.append(
                    'Authorization',
                    'Basic ' + btoa(userData.userId + ':' + 'pm52CqG5FB7KEtFo')
                );
                headers.append(
                    'Content-Type',
                    'application/x-www-form-urlencoded'
                );

                localStorage.setItem(
                    'token',
                    btoa(rememberData.username + ':' + result.password)
                );

                const options = { headers };

                this.http
                    .post(
                        'http://192.168.1.54:8081/wmsapi-authorization/oauth/token',
                        params,
                        options
                    )
                    .subscribe(
                        (tokens: any) => {
                            this.storeTokens(tokens);
                        },
                        (error: any) => { 
                        }
                    );
            },
            (error: any) => { 
            }
        );
    }

    getEncryptedPassword(rememberData: any) {
        return this.http.get(
            'http://192.168.1.54:8081/wmsapi-master/service/user/encrypt/' +
                this.decryptPass(rememberData.userpass)
        );
    }

    // get access token
    getAccessToken() {
        return localStorage.getItem(this.AccessToken);
    }

    getRefreshToken() {
        return localStorage.getItem(this.RefreshToken);
    }

    storeAccessToken(jwt: string) {
        localStorage.setItem(this.AccessToken, jwt);
    }

    storeTokens(tokens: any) {
        localStorage.setItem(this.AccessToken, tokens.access_token);
        localStorage.setItem(this.RefreshToken, tokens.refresh_token);
    }

    removeTokens() {
        localStorage.removeItem(this.AccessToken);
        localStorage.removeItem(this.RefreshToken);
    }

    // method is used to encrypt the password
    encryptPass(data) {
        try {
            return CryptoJS.AES.encrypt(
                JSON.stringify(data),
                Constants.authPass
            ).toString();
        } catch (e) { 
        }
    }

    // method is used to decrypt the password
    decryptPass(data) {
        try {
            const bytes = CryptoJS.AES.decrypt(data, Constants.authPass);
            if (bytes.toString()) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;
        } catch (e) { 
        }
    }

    getScreenUrlArray() {
        this.commonService
            .getScreenTypesByUserId()
            .subscribe((userRoles: any) => {
                if (userRoles.status === 200) {
                    // console.log(userRoles.result);
                    if (userRoles.result.length) {
                        const screenUrlArray = [];
                        for (let i = 0; i < userRoles.result.length; i++) {
                            if (userRoles.result[i].screenTypes === 'Web') {
                                screenUrlArray.push(
                                    userRoles.result[i].screenUrl
                                );
                            }
                        }
                        this.getUserScreenArray(screenUrlArray);
                        return true;
                    }
                }
            });
    }
}
