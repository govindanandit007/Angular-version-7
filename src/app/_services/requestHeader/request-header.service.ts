import { Injectable } from '@angular/core';
// import { RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
// import { Constants } from 'src/app/_shared/Constants';

@Injectable()
export class RequestHeaderService {
  public key = 'userId';
  private userId;

  constructor(private cookieService: CookieService) {
    this.userId = this.getCookieValue(this.key);
  }
  getOptions() {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    // const header = new HttpHeaders({ 'Content-Type': 'application/json' });

    const options = { headers: header, withCredentials: true };
    return options;
  }
  private getCookieValue(key: string) {
    const cookie = this.cookieService.get(key);
    if (cookie) {
      const cookieValue = this.cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

}
