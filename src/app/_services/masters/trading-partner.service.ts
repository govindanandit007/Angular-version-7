import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TradingPartnerService {
  private companyId = Number(JSON.parse(localStorage.getItem('userDetails')).companyId);
  private headers = new HttpHeaders({ 'content-type': 'application/json' });
  private apiUrlGetTradingPartnerCust = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/CUST';
  private apiUrlGetTradingPartnerSupp = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/SUPP';
  // Remove below line and uncomment above line after getting valid company ID
  private apiUrlGetTradingPartnerById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/details';
  private apiUrlGetTradingPartnerSiteById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/site/details';
  private apiUrlUpdateTradingPartner = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/update';
  private apiUrlUpdateTradingPartnerSite = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/site/update';
  private apiUrlSearchTradingPartner = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/search';

  // Generating Service URL To Get All The Sites By Trading Partner ID
  private serviceURLToGetSites = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/site';

  // Generating Service URL To Get All The Trading Partner Types
  private serviceURLTOGetTPTypes = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=Trading Partner Types';

  // Generating Service URL To Save Trading Partner Data
  private serviceURLToSaveTPValues = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/partner/create';

  // Generating Service URL To Save Trading Partner Site Data
  private serviceURLToSaveTPSiteValues = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/site/create';

  // Generating Service URL To Get All The Trading Partner Site Types
  private serviceURLTOGetTPSTypes = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=Trading Partner Site Types';

  constructor(private http: HttpClient) {

  }
  private subject = new Subject<any>();

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  public getTradingPartnerCustList() {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    return this.http.get(this.apiUrlGetTradingPartnerCust + '/' + this.companyId);

  }
  public getTradingPartnerSuppList() {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    return this.http.get(this.apiUrlGetTradingPartnerSupp + '/' + this.companyId);

  }
  // Get All Trading Partner Details By ID
  getTpDetailsById(tpId: number) {
    return this.http.get(this.apiUrlGetTradingPartnerById + '/' + tpId);
  }
  getTpSiteDetailsById(tpSiteId: number) {
    return this.http.get(this.apiUrlGetTradingPartnerSiteById + '/' + tpSiteId);
  }
  updateTradingPartner(tpData: any) {
    return this.http.put
      (this.apiUrlUpdateTradingPartner + '/' + tpData.tpId,
        tpData
      );
  }
  updateTradingPartnerSite(tpSiteData: any) {
    return this.http.put
      (this.apiUrlUpdateTradingPartnerSite + '/' + tpSiteData.tpSiteId,
        tpSiteData
      );
  }
  // Get All Sites By Trading Partner ID
  getAllSitesByTP(tpId: number) {
    return this.http.get(this.serviceURLToGetSites + '/' + tpId);
  }

  // Add Trading Partner
  // Get All Trading Partner Types
  getTradingPartnerTypes() {
    return this.http.get(this.serviceURLTOGetTPTypes)
  }

  // Save Trading Partner
  addTradingPartner(tradingPartnerValues: any) {
    return this.http.post(this.serviceURLToSaveTPValues, tradingPartnerValues);
  }
  getTPSearch(TPSearchInfo: any): any {
    return this.http.post(this.apiUrlSearchTradingPartner, TPSearchInfo);
  }
  // Add Trading Partner Site
  // Get Trading Partner Site Types
  getTradingPartnerSiteTypes() {
    return this.http.get(this.serviceURLTOGetTPSTypes)
  }

  // Add Trading Partner Site
  addTradingPartnerSite(tradingPartnerSiteValues: any) {
    return this.http.post(this.serviceURLToSaveTPSiteValues, tradingPartnerSiteValues);
  }

}
