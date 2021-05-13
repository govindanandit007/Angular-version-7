import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderIssueService {
  private apiUrlLGList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/AvlblQty';
  private apiUrlBatchList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/batchList';
  private apiUrlExistingBatchList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/existingBatchNumber';
  private apiUrlSerialList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/serialList';
  private apiUrlLPNList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/details';
  private apiUrlLineDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/WoLineDetails';
  private apiUrlLineDetailsForAI = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=DEKIT_WO_ISSUE&show=WO_LINES_DETAILS&text=';
  private apiUrlDestLOCList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=DEST_LG_ID&show=DEST_LOC&text=';
  
  private apiUrlDestLGList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/DekitLG/121';
  
  private apiUrlForAssemIsTransacted = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=ITM_WO&show=ASM_ITM_TXN&column=';
  private apiUrlLpnGenerate = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/LpnGenerate';
  private apiUrlBatchGenerate = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/BatchGenerate';
  private apiUrlSerialGenerate = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/SerialGenerate';
  private apiUrlSerialGenerateByCount = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/GenerateSerialByCount';
  private apiUrlGetOldTransactionsByWOLineID = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/transaction';
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();
   
  constructor(private http: HttpClient, private commonService : CommonService) { }

  getLgOrLocList(data):any{
    return this.http.post(this.apiUrlLGList, data);
  }
  getBatchList(data):any{
    return this.http.post(this.apiUrlBatchList, data);
  }
  getExistingBatchList(data):any{
    return this.http.post(this.apiUrlExistingBatchList, data);
  }
  getSerialList(data):any{
    return this.http.post(this.apiUrlSerialList, data);
  }
  getLPNList(data):any{
    return this.http.post(this.apiUrlLPNList, data);
  }
  getUnReservedQty(data):any{
    return this.http.post(this.apiUrlLGList, data);
  }
  getWOIssueLineDetails(data):any{
    return this.http.post(this.apiUrlLineDetails, data);
  }
  getWOIssueLineDetailsForAssemblyItem(data):any{
    return this.http.get(this.apiUrlLineDetailsForAI+data);
  }
  getLpnGenerate(data):any{
    return this.http.post(this.apiUrlLpnGenerate, data);
  } 
  getBatchGenerate(data):any{
    return this.http.post(this.apiUrlBatchGenerate, data);
  } 
  getSerialGenerate(data):any{
    return this.http.post(this.apiUrlSerialGenerate, data);
  } 
  getSerialGenerateByCount(data):any{
    return this.http.post(this.apiUrlSerialGenerateByCount, data);
  } 
  getDetaialsIsAssemblyItemTransacted(data):any{
    return this.http.get(this.apiUrlForAssemIsTransacted+data.woId+"&text="+data.itemId);
  }
  getDestLOCList(data):any{
    return this.http.get(this.apiUrlDestLOCList+data);
  } 
  getDestLGList():any{
    return this.http.get(this.apiUrlDestLGList);
  } 
  getOldTransactionsByWOLineID(data):any{
    return this.http.post(this.apiUrlGetOldTransactionsByWOLineID, data);
  }  
}
