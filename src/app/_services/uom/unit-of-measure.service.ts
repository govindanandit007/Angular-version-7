import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  companyId = Number(
    JSON.parse(localStorage.getItem('userDetails')).companyId
  );

  private apiUrlGetUOM       = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom';
  private apiUrlUpdateUom    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/updateBatch';
  private apiUrlCreateUom    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/insertBatch';
  private apiUrlGetClassLov  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=UOM_CLASS';
  private apiUrlGetItemLov   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov';
  private apiUrlGetItemLovAll   = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/ITEM/001';
  private apiUrlGetUomDetail = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/details';
  private apiUrlGetUomItems  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom-conversion/byuom';
  private apiUrlUpdateUomConUOM = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom-conversion/batchUpdate/UOM';
  private apiUrlUpdateUomConITEM = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom-conversion/batchUpdate/ITEM';
  private apiUrlInsertUomCon = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom-conversion/batchInsert';

  private apiUrlGetUomSearch              = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/search';
  private apiUrlGetUomConversionSearch    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom-conversion/search';

  private apiUrlGetUomLov    = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov';
  private apiUrlGetItemLovByUOMClass = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/item/lov/byclass';
  private apiGetBaseUomByClass = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/uom/lov/byclass/';
 


  
  constructor(private http: HttpClient, private autheticationService: AutheticationService) { }

  getAllUom() {
    return this.http.get( this.apiUrlGetUOM );
  }

  updateUom(data): any {
      return this.http.put( this.apiUrlUpdateUom, data);
  }

  createUom(data): any {
      return this.http.post( this.apiUrlCreateUom, data);
  }

  getClassLov() {
    return this.http.get( this.apiUrlGetClassLov );
  }
  



  getItemLovByUOMClass(uomClass) {
    return this.http.get(this.apiUrlGetItemLovByUOMClass +'/' + uomClass );
  }

  getItemLovAll() {
    return this.http.get( this.apiUrlGetItemLovAll );
  }

  getItemLov() {
    return this.http.get( this.apiUrlGetItemLov);
  }

  getUomDetail(id) {
    return this.http.get( this.apiUrlGetUomDetail + "/" + id);
  }

  
  getUomItems(id) {
    return this.http.get( this.apiUrlGetUomItems + "/" + id);
  }

  getUOMSearch(userSearchInfo: any): any {
    return this.http.post(this.apiUrlGetUomSearch, userSearchInfo);
  }

  getUomConversionSearch(userSearchInfo: any): any {
     
    return this.http.post(this.apiUrlGetUomConversionSearch, userSearchInfo);
  }

  updateUomConUom(data): any {
      return this.http.put( this.apiUrlUpdateUomConUOM, data);
  }

  updateUomConItem(data): any {
    return this.http.put( this.apiUrlUpdateUomConITEM, data);
}

  insertUomCon(data): any {
      return this.http.post( this.apiUrlInsertUomCon, data);
  }

  getUomLov() {
    return this.http.get( this.apiUrlGetUomLov);
  }

  getBaseUomByClass(classId) {
    return this.http.get( this.apiGetBaseUomByClass + classId);
  }


  dateFormat(dateData: any) {
      const dp = new DatePipe(navigator.language);
      const p = 'y-MM-dd'; // YYYY-MM-DD
      const dtr = dp.transform(new Date(dateData), p);
      return dtr;
  }
  

 

}
