import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  companyId = Number;
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/search';
  private apiUrlWaveSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/woWaveSearch';
  private apiUrlGetLOVSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/WOWAVE';
  private apiUrlAddWO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/create';
  private apiUrlGetDWO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/woDekitLov/';
  private apiUrlUpdateWO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/update';
  private apiUrlGetUomLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based?show=uom&basedOn=item&id=';
  private apiUrlGetUomLovByClass   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov/byclass/';
  private apiUrlGetItemLOV = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/ITEM/121';
  private apiUrlGetDkitLGLOV = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/DekitLG/121';
  private apiUrlGetItemRevision = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item-revision';
  private apiUrlGetWoTypes = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/enabled?lookupName';
  private apiUrlWaveCriteriaShowLines = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wo-wave/showLines';
  private apiUrlCreateWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave';
  private apiUrlAddWaveCriteria = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave-criteria';
  private apiUrlById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/details';
  private apiUrlWaveCriteriaById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave-criteria/details';
  private apiUrlWavePolicyLOV = 
    Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?basedOn=wave&show=policy';
  private apiUrlReleaseWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/release';
  private apiUrlUndoWave = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/wave/undo';
  private apiUrlGetStagingLocatorLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
  private apiUrlWaveCriteriaLOV = 
  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search?show=wave-criteria&basedOn=wave-criteria';
  private apiUrlWaveAllotaions = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/allocation/getLine';
  private apiUrlSOPriority = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=SO_PRIORITY';
  private apiUrlWoLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/wolov/?iuId=';
  private apiUrlWoLines = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/wolines';
  private apiUrlGetIuLovAll = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/IU/';
  private apiUrlLGList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/AvlblQty';
  private apiUrlStockLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/StockLov';
  private apiUrlTransact = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/transact';
  private apiUrlComplete = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder-issue/complete';
  private apiUrlOnhandLocatorList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/details';
  private apiUrlOnhandLGList = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/onhand/search';
  private apiUrlReservedWO   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/reserve';
  private apiUrlShowLinesForDKT = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search/?show=WO_SHOLINES&basedOn=DEKIT&text=';
  //http://150.136.110.79:8080/wmsapi-master/service/lov-based/search/?show=WO_SHOLINES&basedOn=DEKIT&text=4999
 
  
  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();
   
    
  constructor(private http: HttpClient, private commonService : CommonService) { }
  
  getWoLookupLOVBased(data) {    
    return this.http.get(this.apiUrlGetWoTypes + '=' + data.lookupName + '&screenType=' + data.screenType+'&methodType='+ data.methodType);
  }
  getWoForDekit(data) {      
    return this.http.get(this.apiUrlGetDWO + '?iuId=' + data.iuId + '&woNumber=' + data.woNumber);
  }
  createWO(data): any {
    return this.http.post(this.apiUrlAddWO, data);
  }
  updateWO(data, id): any {
    return this.http.put(this.apiUrlUpdateWO +'/' +id, data);
  }
  getWOSearch(searchInfo: any): any {
    return this.http.post(this.apiUrlSearch, searchInfo);
  }
  getWoById(id:number){
    return this.http.get(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/details/' + id
    );
  }
  getDetailsByIuId(id:number, screenType?: string){
    return this.http.get(
      Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/workorder/searchlov/?iuId=' + id + '&screenType=' + screenType
    );
  }
  getUomLOV(uomName) {
    return this.http.get( this.apiUrlGetUomLovByClass + uomName);
  }
  getUomByItem(itemId:number){
    return this.http.get(this.apiUrlGetUomLov + itemId);
  }
  getItemLOV() {
    return this.http.get(this.apiUrlGetItemLOV);
}
getDkitLGLOV() {
  return this.http.get(this.apiUrlGetDkitLGLOV);
}
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
  getItemReVision() {
    return this.http.get(this.apiUrlGetItemRevision);
}
waveCriteriaShowLines(data): any {
  return this.http.post(this.apiUrlWaveCriteriaShowLines, data);
}
createWave(data): any {
  return this.http.post(this.apiUrlCreateWave, data);
}

getWaveCriteriaById(id: number) {
  return this.http.get(
    this.apiUrlWaveCriteriaById + '/' + id
  );
}
createWaveCriteria(data): any {
  return this.http.post(this.apiUrlAddWaveCriteria, data);
}

updateWaveCriteria(data, id): any {
  return this.http.put(this.apiUrlAddWaveCriteria + '/' + id, data);
}
getWaveCriteriaLOV() {
  return this.http.get(this.apiUrlWaveCriteriaLOV);
}
getWaveSearch(waveSearchInfo: any): any {
  return this.http.post(this.apiUrlWaveSearch, waveSearchInfo);
}
getSearchLOV(searchType: string) {
  const companyId = JSON.parse(
      localStorage.getItem('userDetails')
  ).companyId;
  return this.http.get(
      this.apiUrlGetLOVSearch +'/' + companyId
  );
}
getAllocations(data):any{
  return this.http.post(this.apiUrlWaveAllotaions, data);
}

getSOPriorityLOV() {
  return this.http.get(this.apiUrlSOPriority);
}
getLocatorLov( basedOn, column, show, text) {
     
  show    = show    ? '&show='     + show    : '';
  basedOn = basedOn ? 'basedOn=' + basedOn : '';
  column  = column ? '&column=' + encodeURIComponent(column) : '';
  text    = text    ? '&text='    + text   : '';
  return this.http.get(this.apiUrlGetStagingLocatorLov +'?' + basedOn + column + show + text );
}
getWaveById(id: number) {
  return this.http.get(this.apiUrlById+'/' + id);
}
getWavePolicyLOV(iuId) {
  return this.http.get(this.apiUrlWavePolicyLOV + '&column='+ iuId);
}

releaseWave(data):any{
  return this.http.post(this.apiUrlReleaseWave, data);
}

undoWave(data):any{
  return this.http.post(this.apiUrlUndoWave, data);
}

//work-order-issue api functions
getWOLOV(iuid,woNumber,workOrderType) {
  return this.http.get( this.apiUrlWoLov + iuid+ '&woNumber='+ woNumber+ '&woType='+ workOrderType);
}

 // get all IU
 getIuLovAll() {
  this.companyId = JSON.parse(
      localStorage.getItem('userDetails')
  ).companyId;
  return this.http.get(this.apiUrlGetIuLovAll + this.companyId);
}
woIssueShowLines(data): any {
  return this.http.post(this.apiUrlWoLines, data);
}
getLGList(data):any{
  return this.http.post(this.apiUrlLGList, data);
}
getStockLov(data):any{
  return this.http.post(this.apiUrlStockLov, data);
}
transactWoIsue(data): any {
  return this.http.put(this.apiUrlTransact, data);
}
completeWoIsue(data): any {
  return this.http.put(this.apiUrlComplete, data);
}
getOnhandLGList(data):any{
  return this.http.post(this.apiUrlOnhandLGList, data);
}
getObhandLOCList(data):any{
  return this.http.post(this.apiUrlOnhandLocatorList, data);
}
waveCriteriaDekitShowLines(linetext): any {
  return this.http.get(this.apiUrlShowLinesForDKT+''+linetext);
}
  reservedWO(data: any): any {
    return this.http.post(this.apiUrlReservedWO, data);
  }
}

