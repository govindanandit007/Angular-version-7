import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { Constants } from 'src/app/_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class SerialNoService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/serial-number/search';
  private apiUrlSerialStatus = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=Serial_Status';
  private apiUrlCreateSerial = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/serial-number/batchInsert';
  private apiUrlUpdateSerial = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/serial-number/batchUpdate';
  private apiUrlItemSerialControlled = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov/itemType/SERIAL/Y';
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getSerialNoSearch(serialNoSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, serialNoSearchInfo);
  }

  getLOvsBasedon(searchName: string, basedName: string, id: string) {
    return this.http.get(
      Constants.apiBaseUrl+
      Constants.apiMasterUrl + 'service/lov-based?show='+
      searchName+
      '&basedOn='+
      basedName+
      '&id='+
      id
    );
  }

  getSerialStatusList() {
    return this.http.get(this.apiUrlSerialStatus);
  }

  createSerial(batchArray: any): any {
    return this.http.post(this.apiUrlCreateSerial, batchArray);
  }
  updateSerial(batchArray: any): any {
    return this.http.put(this.apiUrlUpdateSerial, batchArray);
  }
  getItemSerialEnabled() {
    return this.http.get(this.apiUrlItemSerialControlled);
  }
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}
