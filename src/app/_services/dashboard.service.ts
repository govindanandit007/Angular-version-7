import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private companyId = Number(
    JSON.parse(localStorage.getItem('userDetails')).companyId
  );
 
  private apiUrlGetChartDataInbound =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Dashboard/Flexi';
  private apiUrlGetChartDataWarehouse =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Dashboard/FlexiWareHouse';
  private apiUrlGetChartDataMaster =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Dashboard/FlexiMaster';
  private apiUrlGetChartDataOutbound =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Dashboard/FlexiOutbound';
  private apiUrlGetChartDataTransactions =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Dashboard/FlexiTransactions';

  constructor( private http: HttpClient, private commonService: CommonService ) { }

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  getChartDataInbound(): any {
    return this.http.post(this.apiUrlGetChartDataInbound, {companyId: this.companyId, iuId: JSON.parse(localStorage.getItem('defaultIU')).id});
  }

  getChartDataWarehouse(): any {
    return this.http.post(this.apiUrlGetChartDataWarehouse, {companyId: this.companyId, iuId: JSON.parse(localStorage.getItem('defaultIU')).id});
  }

  getChartDataMaster(): any {
    return this.http.post(this.apiUrlGetChartDataMaster, {companyId: this.companyId, iuId: JSON.parse(localStorage.getItem('defaultIU')).id});
  }

  getChartDataOutbound(): any {
    return this.http.post(this.apiUrlGetChartDataOutbound, {companyId: this.companyId, iuId: JSON.parse(localStorage.getItem('defaultIU')).id});
  }

  getChartDataTransactions(): any {
    return this.http.post(this.apiUrlGetChartDataTransactions, {companyId: this.companyId, iuId: JSON.parse(localStorage.getItem('defaultIU')).id});
  }





}
