import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/_services/login.service';
import { AutheticationService } from 'src/app/_services/authetication.service';
import { UserIdleService } from 'angular-user-idle';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatSnackBar, } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
// import { userInfo } from 'os';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginError = '';
    loginForm: FormGroup;
    rememberMe = false;
    isLoggedIn = false;
    passwordHide = true;
    loaderShow = false;
    unsubscribePing : any = '';
    validationMessages = {
        username: {
            required: 'Username is required.'
        },
        password: {
            required: 'Password is required.'
        }
    };

    formErrors = {
        username: '',
        password: ''
    };
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public loginService: LoginService,
        private autheticationService: AutheticationService,
        private userIdleService: UserIdleService,
        private dialog: MatDialog,
        public commonService: CommonService
       

    ) {
        this.createLoginForm();
    }

    createLoginForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        localStorage.setItem('isLoggedIn', 'false');
        if (
            window.localStorage.getItem('rememberMe') === '' ||
            window.localStorage.getItem('rememberMe') === null
        ) {
            window.localStorage.setItem('rememberMe', '');
        } else {
            const rememberData = JSON.parse(
                window.localStorage.getItem('rememberMe')
            );
            this.loginForm.controls.username.patchValue(rememberData.username);
            this.loginForm.controls.password.patchValue(this.autheticationService.decryptPass(rememberData.userpass));
            this.rememberMe = true;
        }

        this.commonService.unsubscribePing.subscribe((data: any) => {
            if(data[0] === 'logout'){
                this.unsubscribePing ? this.unsubscribePing.unsubscribe() : '';
            }
        })
    }
    logValidationErrors(group: FormGroup = this.loginForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            } else {
                this.formErrors[key] = '';
                if ((abstractControl && !abstractControl.valid &&
                    (abstractControl.touched || abstractControl.dirty)) ||
                    (abstractControl && !abstractControl.valid && abstractControl.untouched)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }

    login() {
        this.loginError = '';
    }

    // convenience getter for easy access to form fields
    get credentials() {
        return this.loginForm.controls;
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            
                this.logValidationErrors(); 
            return;
        }
        const username = this.credentials.username.value;
        const password = this.credentials.password.value;
        this.loaderShow = true;
        this.loginService
            .validateLogin(username, password)
            .subscribe(
                (result: {
                    success: any;
                    result: any[];
                    message: string;
                    token: any;
                }) => {
                    if (result.success) {
                        localStorage.setItem(
                            'userDetails',
                            JSON.stringify(result.result[0])
                        );
                        if (this.rememberMe === true) {
                            const rememberMeObj: any = {};
                            rememberMeObj.username = this.loginForm.controls.username.value;
                            rememberMeObj.userpass = this.autheticationService.encryptPass(this.loginForm.controls.password.value);
                            rememberMeObj.rememberMe = true;
                            localStorage.setItem(
                                'rememberMe',
                                JSON.stringify(rememberMeObj)
                            );
                        }else{
                            window.localStorage.setItem('rememberMe', '');
                        }
                        this.autheticationService.storeTokens(result.token);
                        this.autheticationService.isLoggedInChange(true);

                        // Start watching for user inactivity.
                        this.userIdleService.startWatching();

                        // Start watching when user idle is starting.
                        this.userIdleService
                            .onTimerStart()
                            .subscribe(count => console.log(''));

                        // refresh token after 3590 seconds
                        this.unsubscribePing = this.userIdleService.ping$.subscribe(() => { 
                            this.autheticationService.refreshToken();
                           
                        });

                        // Start watch when time is up.
                        this.userIdleService.onTimeout().subscribe(() => { 
                            this.autheticationService.logout();
                        });

                        localStorage.setItem('isLoggedIn', 'true');
                        this.loaderShow = false;
                        this.router.navigate(['home']);
                    } else {
                        this.loaderShow = false;
                        this.loginError = result.message;
                        // if(result)
                        if(result.result.length){
                            const dialogRef = this.dialog.open(
                                LoginPasswordSetDialogComponent,
                                {
                                    width: '25vw',
                                    data:{ 
                                        userId: result.result[0].userId,
                                        accessToken: result.token.access_token,
                                    }
                                     
                                }
                            );

                            dialogRef.afterClosed().subscribe(response => { 
                                if (response !== undefined) {
                                }
                            });
                        }
                    }
                }
            );
    }
}

// Password Reset Dialog Component
@Component({
    selector: 'app-login-passwordset-dialog',
    templateUrl: './login-passwordset-dialog.html',
    styleUrls: ['./login.component.css']
})
export class LoginPasswordSetDialogComponent {
    constructor(
        public loginService: LoginService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<LoginPasswordSetDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    passwordHide = true;
    passwordReset = '';
    isPasswordEmpty = false;
    onCloseClick(): void {
        this.dialogRef.close();
    }
    resetPassword(event: any){
        if (this.passwordReset !== ''){
            const finalData={
                userId: this.data.userId,
                userPassword: this.passwordReset,
            }
            this.loginService
                .resetPassword(finalData, this.data.accessToken)
                .subscribe(
                    data => {
                        if (data.status === 200) {
                            this.openSnackBar(data.message, '', 'success-snackbar');
                            this.dialogRef.close();
                        } else {
                            this.openSnackBar(data.message, '', 'error-snackbar');
                        }
                    },
                    error => {
                        this.openSnackBar(error.error.message, '', 'error-snackbar');
                    }
                );
        }else{
            this.isPasswordEmpty = true;
        }
    }
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }
}
