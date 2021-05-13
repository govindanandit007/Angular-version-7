import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';
import { from, throwError, BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/search';
  private apiUrlGetById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/details';
  private apiUrlAddPO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po';
  private apiUrlUpdatePO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/batchUpdate';
  private apiUrlSoList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/soLov';
  private apiUrlSoLineList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/soLineLov';
  private apiUrlCrossDockDetails   = Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/po/crossDock/';

  private apiUrlGetUomLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based?show=uom&basedOn=item&id=';
  private apiUrlGetRevisionLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?show=revision&basedOn=item&column=';
  private apiUrlDeleteCrossDockList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/crossDock/delete';

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();
  
  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getPOSearch(poSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, poSearchInfo);
  }

  createPO(poData): any {
    return this.http.post(this.apiUrlAddPO, poData);
  }
  updatePO(poData, id): any {
    return this.http.put(this.apiUrlAddPO +'/' +id, poData);
  }
  getPoById(id:number){
    return this.http.get(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/po/details/' + id
    );
  }

  getUomByItem(itemId:number){
    return this.http.get(this.apiUrlGetUomLov + itemId);
  }

  getRevisionLovByItem(itemId:number){
    return this.http.get(this.apiUrlGetRevisionLov + itemId);
  }
  getSoList(data){
    return this.http.post( this.apiUrlSoList, data);
  }

  getSoLineList(data){
    return this.http.post( this.apiUrlSoLineList , data);
  }
  getCrossDockDetails(poLineId){
    return this.http.get( this.apiUrlCrossDockDetails + poLineId);
  }
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

  deleteCrossDockList(data) {
    return this.http.post(this.apiUrlDeleteCrossDockList, data);
  }
//  setDefaultIU(data: any){
//         this.defaultIuDataSource.next(data);
//     }
}
