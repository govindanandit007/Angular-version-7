import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

import { Constants } from 'src/app/_shared/Constants';
@Injectable({
  providedIn: 'root'
})
export class MaterialStatusService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/search';
  private apiUrlMaterialStatus = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=MATERIAL_STATUS';
  private apiUrlEntityValue = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/lov/?iuId=';
  private apiUrlUpdateMaterialStatus = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/batchUpdate';
  // private apiUrlCreateSerial = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/serial-number/batchInsert';
  // private apiUrlItemSerialControlled = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov/itemType/SERIAL/Y';
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getMaterialStatusSearch(materialStatusSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, materialStatusSearchInfo);
  }

  getEntityValueLOV(iuId: string, entity: string) {
    return this.http.get(
     this.apiUrlEntityValue+
      iuId+
      '&entity='+
      entity
    );
  }

  getMaterialStatusList() {
    return this.http.get(this.apiUrlMaterialStatus);
  }

  // createSerial(batchArray: any): any {
  //   return this.http.post(this.apiUrlCreateSerial, batchArray);
  // }
  updateMaterialStatus(batchArray: any): any {
    return this.http.put(this.apiUrlUpdateMaterialStatus, batchArray);
  }
  // getItemSerialEnabled() {
  //   return this.http.get(this.apiUrlItemSerialControlled);
  // }
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

}
