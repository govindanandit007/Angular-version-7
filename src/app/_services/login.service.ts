import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private apiUrlLogin = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/validate';
  constructor(private http: HttpClient) { }

  public validateLogin(userName: string, userPassword: string): any {
    const body = `{"userName":"${userName}","userPassword":"${userPassword}"}`;
    return this.http.post(this.apiUrlLogin, body, { headers: this.headers })
      .pipe(map(user => {
        return user;
      }));
  }
  isSpaceonFirstPosition(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    const element = evt.currentTarget.value;
    if ((charCode === 32 && element === '') || 
    charCode === 34 || 
    charCode === 47) {
      return false;
    } else {
      return true
    }
    // if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    //     return false;

    // return true;
  }

  resetPassword(user, access_token): any {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'bearer'+ access_token });
    return this.http.put(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/user/reset-password',
      user, { headers: this.headers }
    );
  }
}
