
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class SystemOptionService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/search';
  private apiUrlSystemOption = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/lov';
  private apiUrlValueLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/value';
  private apiUrlDeleteSysOptLine =  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/delete/';
  private apiUrlCreateSysOption = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/create';
  private apiUrlUpdateSysOption = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/systemoption/update';

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  
  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getSystemOptionSearch(serialNoSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, serialNoSearchInfo);
  }

  getSystemOptionNameLOV(data: any): any {
    return this.http.post(this.apiUrlSystemOption, data);
  }

  getValueLOV(data: any): any {
    return this.http.post(this.apiUrlValueLov, data);
  }

  deleteSysOptLine(id: any) {
    return this.http.delete(this.apiUrlDeleteSysOptLine + id);
  }

  createSystemOption(data: any): any {
    return this.http.post(this.apiUrlCreateSysOption, data);
  }

  updateSystemOption(data: any): any {
    return this.http.put(this.apiUrlUpdateSysOption, data);
  }

   

  
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}

