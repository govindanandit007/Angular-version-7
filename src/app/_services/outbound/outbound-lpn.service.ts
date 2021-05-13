import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';

@Injectable({
  providedIn: 'root'
})
export class OutboundLpnService {

  private apiUrlGetAllData  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction';
  private apiUrlGetAllBatch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/batch';
  private apiUrlGetAllSerial = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/serial';
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/search';

  constructor(private http: HttpClient, private autheticationService: AutheticationService) { }

 
  getTransactionSearch(onTransactionSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, onTransactionSearchInfo);
  }


  getAllTransactions() {
    return this.http.get(this.apiUrlGetAllData);
  }

  getAllBatch(data: any): any {
    return this.http.post(this.apiUrlGetAllBatch, data);
  }

  getAllSerial(data: any): any {
    return this.http.post(this.apiUrlGetAllSerial, data);
  }


  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}
