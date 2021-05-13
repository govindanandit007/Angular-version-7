import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class OnHandService {
  private apiUrlSearch       = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/search';
  private apiUrlOnhandUpdate = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/batchUpdate';
  private apiUrlBatchList    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/batchList';
  private apiUrlSerialList    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/serialList';
  private apiUrlOnhandDetails    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/details';
  private apiUrlGetOnhandIU      = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/onhand/iu';
  private apiUrlAllAvailableQty     = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/AvlblQty';
  private apiUrlOnhandStocklocator     = 
  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=locator&show=onhand-detail&column=';

     defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getOnhandSearch(onHandSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, onHandSearchInfo);
  }

  updateOnhand(data): any {
    return this.http.put( this.apiUrlOnhandUpdate, data);
  }

  getBatchList(data: any): any {
    return this.http.post(this.apiUrlBatchList, data);
  }

  getSerialList(data: any): any {
    return this.http.post(this.apiUrlSerialList, data);
  }

  getOnhandDetails(data: any): any {
    return this.http.post(this.apiUrlOnhandDetails, data);
  }

  getOnhandIU(){
    return this.http.get(this.apiUrlGetOnhandIU);
  }

  getOnhandStocklocatorData(data){
    return this.http.get(this.apiUrlOnhandStocklocator + data);
  }

  getAllAvailableQty(data: any): any {
    return this.http.post(this.apiUrlAllAvailableQty, data);
  }


  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}
