import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private apiUrlSearchContracts  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contract/search';
  private apiUrlContractDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contract/get';
  private apiUrlActivityGroupLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/getlov';
  private apiUrlCreateContracts  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contract/create';
  private apiUrlUpdateContracts  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contract/update';
  private apiUrlgetActivityItem  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contractLine/getItems?';
  private apiUrlgetActivityLov  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/details';
  private apiUrlSearchBiilingTxnHistory  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/actBilTxnHistory/search';
  private apiUrlContractItemDetails  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/actBilTxnHistory/detailsByItem';
  private apiUrlSearchBiilingExecutionHistory  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/actBilEngExecHis/search';
  private apiUrlBillingExecutionDetails  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/actBilEngExecHis/get';
  private apiUrlTxnDetails  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/contractLine/getTxnDetails';

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private commonService : CommonService, private autheticationService: AutheticationService) {}

  searchContracts(data: any): any {
    return this.http.post(this.apiUrlSearchContracts, data);
  }
 
  getContractDetails(contractId){
    return this.http.get( this.apiUrlContractDetails +'/'+ contractId);
  }

  getContractItemDetail(contractItemId){
    return this.http.get( this.apiUrlContractItemDetails +'/'+ contractItemId);
  }

  getActivityGroupLov(){
    return this.http.get( this.apiUrlActivityGroupLov);
  }

  createContracts(data: any): any {
    return this.http.post(this.apiUrlCreateContracts, data);
  }

  updateContracts(data, id): any {
    return this.http.put(this.apiUrlUpdateContracts +'/' +id, data);
  }

  getActivityItem(contractId, contractLineId, activityGroupId, activityId){
    return this.http.get( this.apiUrlgetActivityItem + 'contractId=' + contractId + '&contractLineId='+ contractLineId +'&activityGroupId=' + activityGroupId + '&activityId=' + activityId);
  }

  getActivityLOV(activityGroupId){
    return this.http.get( this.apiUrlgetActivityLov + '/' + activityGroupId);
  }
  
  searchBillingTxnHistory(data: any): any {
    return this.http.post(this.apiUrlSearchBiilingTxnHistory, data);
  }

  searchBillingExecutionHistory(data: any): any {
    return this.http.post(this.apiUrlSearchBiilingExecutionHistory, data);
  }

  getBillingExecutionHistoryDetail(requestId,contractId){
    // http://localhost:8080/service/actBilEngExecHis/get?requestId=1903&contractId=372
    return this.http.get(`${this.apiUrlBillingExecutionDetails}?requestId=${requestId}${contractId}`);
  }
  
  getTxnDetails(contractId,contractLineId,fromDate,toDate){
    return this.http.get(`${this.apiUrlTxnDetails}?contractId=${contractId}&contractLineId=${contractLineId}${fromDate}${toDate}`);
  }
  
  
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
}
