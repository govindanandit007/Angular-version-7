import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/search';
  private apiUrlGetItemLov   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/batch-number/item';
  private apiUrlGetBatchLov   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/lov';
  private apiUrlGetItemLovAll   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/ITEM/001';
  private apiUrlGetIuLovAll   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/IU/001';
  private apiUrlCreateBatch   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/batchCreate';
  private apiUrlUpdateBatch   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/batchUpdate';
  private apiUrlGetUomLov   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov/byclass/';

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private commonService : CommonService) { }

  getBatchSearch(batchSearchInfo: any): any{
    return this.http.post(this.apiUrlSearch, batchSearchInfo);
  }

  createBatch(batchArray: any): any {
    return this.http.post(this.apiUrlCreateBatch, batchArray);
  }
  updateBatch(batchArray: any): any {
    return this.http.put(this.apiUrlUpdateBatch, batchArray);
  }

  getBatchById(id:number){
    return this.http.get(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch/details/' + id
    );
  }
  getItemLovAll() {
    return this.http.get( this.apiUrlGetItemLovAll );
  }

  getItemLov() {
    return this.http.get( this.apiUrlGetItemLov);
  }
  getBatchLovById(id) {
    return this.http.get( this.apiUrlGetBatchLov + '?itemId=' + id);
  }
  getUomLOV(uomName) {
    return this.http.get( this.apiUrlGetUomLov + uomName);
  }

  getIuLovAll() {
    return this.http.get( this.apiUrlGetIuLovAll);
  }

  dateFormat(dateData: any) {
      const dp = new DatePipe(navigator.language);
      const p = 'y-MM-dd'; // YYYY-MM-DD
      const dtr = dp.transform(new Date(dateData), p);
      return dtr;
  }
}
