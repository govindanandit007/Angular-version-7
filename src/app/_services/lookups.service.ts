import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  companyId = Number(
    JSON.parse(localStorage.getItem('userDetails')).companyId
  );
  private apiUrlGet = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/search';
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/list/search';
  private apiUrlAddLookups = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/insertBatch';
  private apiUrlUpdateLookups = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/updateBatch';
  constructor(private http: HttpClient, private autheticationService: AutheticationService) {
  }

  getLookups(obj: any): any {
    return this.http.post(this.apiUrlGet, obj);
  }
  searchLookups(obj: any): any {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    let queryString = '';
    if (obj.lookupName) {
      queryString += 'lookupName=' + obj.lookupName + '&';
    }
    if (obj.lookupMainDesc) {
      queryString += 'lookupMainDesc=' + obj.lookupMainDesc + '&';
    }
    if (obj.lookupEnabledFlag !== undefined) {
      queryString += 'lookupEnabledFlag=' + obj.lookupEnabledFlag;
    }
    return this.http.get(this.apiUrlSearch + '/' + this.companyId + '?' + queryString);
  }

  createLookups(lookupArray: any): any {
    return this.http.post(this.apiUrlAddLookups, lookupArray);
  }
  updateLookups(lookupArray: any): any {
    return this.http.put(this.apiUrlUpdateLookups, lookupArray);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
}
