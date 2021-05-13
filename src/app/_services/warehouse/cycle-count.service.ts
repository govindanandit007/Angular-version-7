import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class CycleCountService {

  private apiUrlGetSearch                   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/cyclecount/search';
  private apiUrlCreate                      = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/cyclecount/create';
  private apiUrlUpdate                      = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/cyclecount/update';
  private apiUrlgetDetail                   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/cyclecount/details';
  private apiUrlGetItemByClass              = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based?show=item&basedOn=item-class&id=';
  private apiUrlGetCreateItemAssign         = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccitem';
  private apiUrlGetItemByClassForAssignment = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccitem/getByClassCode/';
  private apiUrlUpdateItemAssignment        = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccitem/update';
  private urlDeleteItemAssignment           = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccitem/';
  private apiUrlCycleCountSearch            = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccreview/search';
  private apiUrlCycleCountUpdate            = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccreview/update';
  private apiUrlGenerateCycleCount          = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/ccreview/cyclecountgenerate';
  private apiUrlGetAllIU                    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/cycle-count/iu';
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();


  constructor(
    private http: HttpClient, private commonService : CommonService
  ) { }

  getCycleCountSearch(searchInfo: any): any {
    return this.http.post(this.apiUrlGetSearch, searchInfo);
  }

  createCycleCount(data): any {
    return this.http.post( this.apiUrlCreate, data);
  }

  updateCycleCount(data): any {
    return this.http.put( this.apiUrlUpdate +'/'+ data.cycleCountId, data);
  }

  getDetails(id:any){
    return this.http.get(this.apiUrlgetDetail +'/'+ id);
  }

  getItemByClass(classCode:any){
    return this.http.get(this.apiUrlGetItemByClass + classCode);
  }

  createItemAssignment(data: any): any {
    return this.http.post(this.apiUrlGetCreateItemAssign, data);
  }

  getItemByClassForAssignment(classCode:any){
    return this.http.get(this.apiUrlGetItemByClassForAssignment + classCode);
  }

  updateItemAssignment(data): any {
    return this.http.put( this.apiUrlUpdateItemAssignment, data);
  }

  deleteItemAssignment(id: any) {
    return this.http.delete(this.urlDeleteItemAssignment + id);
  }


  searchCycleCountReview(data: any): any {
    return this.http.post(this.apiUrlCycleCountSearch, data);
  }

  updateCycleCountReview(data): any {
    return this.http.put( this.apiUrlCycleCountUpdate, data);
  }

  generarteCycleCount(data: any): any {
    return this.http.post(this.apiUrlGenerateCycleCount, data);
  }


  getAllIU(){
    return this.http.get(this.apiUrlGetAllIU);
  }
  




}
