import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginComponent } from './containers/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { TokenInterceptor } from './token.interceptor';
import { AuthGuard } from './auth.gaurd';
import { AutheticationService } from '../_services/authetication.service';
import { UserIdleModule } from 'angular-user-idle';

@NgModule({
  declarations: [],
  providers: [
    AuthGuard,
    AutheticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    UserIdleModule.forRoot({ idle: 900, timeout: 1, ping: 3500 })
  ]
})
export class AuthModule { }
