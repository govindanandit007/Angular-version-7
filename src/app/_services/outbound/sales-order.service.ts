import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/search';
  private apiUrlAddSO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/create';
  private apiUrlUpdateSO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/update';
  private apiUrlGetUomLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based?show=uom&basedOn=item&id=';
  private apiUrlGetUomLovByClass   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov/byclass/';
  private apiUrlReservedSO   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/reserve';
  private apiUrlPoList   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/poLov';
  private apiUrlPoLineList   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/poline';
  private apiUrlCrossDockDetails   = Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/salesorder/crossDock/';
  private apiUrlDeleteCrossDockList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/crossDock/delete';
 
 defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

    constructor(private http: HttpClient, private commonService : CommonService, private autheticationService: AutheticationService) {}

  getSOSearch(searchInfo: any): any {
    return this.http.post(this.apiUrlSearch, searchInfo);
  }
  createSO(data): any {
    return this.http.post(this.apiUrlAddSO, data);
  }
  updateSO(data, id): any {
    return this.http.put(this.apiUrlUpdateSO +'/' +id, data);
  }

  getSoById(id:number){
    return this.http.get(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/salesorder/details/' + id
    );
  }

  getUomByItem(itemId:number){
    return this.http.get(this.apiUrlGetUomLov + itemId);
  }

  getUomLOV(uomName) {
    return this.http.get( this.apiUrlGetUomLovByClass + uomName);
  }

  reservedSO(data: any): any {
    return this.http.post(this.apiUrlReservedSO, data);
  }

  getPoList(data){
    return this.http.post( this.apiUrlPoList, data);
  }

  getPoLineList(data){
    return this.http.post( this.apiUrlPoLineList , data);
  }

  getCrossDockDetails(soId){
    return this.http.get( this.apiUrlCrossDockDetails + soId);
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





  public tabs: any[] = [
    // new Tab(Comp1Component, "Comp1 View", { parent: "AppComponent" }),
    // new Tab(Comp2Component, "Comp2 View", { parent: "AppComponent" })
  ];

  public tabSub = new BehaviorSubject<any[]>(this.tabs);

  public removeTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.tabs.length > 0) {
      this.tabs[this.tabs.length - 1].active = true;
    }
    this.tabSub.next(this.tabs);
  }

  public addTab(tab: any) {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    }
    tab.id = this.tabs.length + 1;
    tab.active = true;
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }

  
}
