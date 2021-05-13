import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionInquiriesService {
  private apiUrlGetAllData  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction';
  private apiUrlGetAllBatch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/batch';
  private apiUrlGetAllSerial = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/serial';
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/transaction/search';

  private apiUrlGetTransactionType    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/transaction/transaction-type';
  private apiUrlGetTransactionSource  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/transaction/transaction-source';
  private apiUrlGetTransactionIU      = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/transaction/iu';

 defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  

  
  getTransactionSearch(onTransactionSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, onTransactionSearchInfo);
  }


  getAllTransactions() {
    return this.http.get(this.apiUrlGetAllData);
  }

  // getAllBatch(txnId) {
  //   return this.http.get(this.apiUrlGetAllBatch + txnId);
  // }

  getAllBatch(data: any): any {
    return this.http.post(this.apiUrlGetAllBatch, data);
  }

  // getAllSerial(txnId) {
  //   return this.http.get(this.apiUrlGetAllSerial + txnId);
  // }

  getAllSerial(data: any): any {
    return this.http.post(this.apiUrlGetAllSerial, data);
  }

  getTransactionType() {
    return this.http.get(this.apiUrlGetTransactionType);
  }
  getTransactionSource() {
    return this.http.get(this.apiUrlGetTransactionSource);
  }
  getTransactionIU() {
    return this.http.get(this.apiUrlGetTransactionIU);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}
