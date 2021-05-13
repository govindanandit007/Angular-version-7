import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrlEligibleShipmentShowLines = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/shipment/showLines';
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/shipment/search';
  private apiUrlCreateShipment = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/shipment/generateShipment';
  private apiUrlShipmentDetail = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/shipment/details/';
  private apiUrlSoLineList = Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/lov-based?';
  private apiUrlGetSoLovByText =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/lov-based/search?';
  private deleteShipmentLine =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/shipment-lines/';
  private apiUrlUpdateShipment =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/shipment';
  private apiUrlShipmentContent =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/shipment/shipmentContent';
  private apiUrlShipShipment=  Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/shipment/shipButton';
  private apiUrlShipmentContentSerial =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/shipment/shipSerialList';
  private apiUrlShipmentContentBatch =  Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/shipment/shipBatchList';



defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getShipmentSearch(waveSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, waveSearchInfo);
  }

  eligibleShipmentShowLines(data): any {
    return this.http.post(this.apiUrlEligibleShipmentShowLines, data);
  }

  createShipment(data): any {
    return this.http.post(this.apiUrlCreateShipment, data);
  }

  shipmentContent(data): any {
    return this.http.post(this.apiUrlShipmentContent, data);
  }

  shipmentContentBatch(data): any {
    return this.http.post(this.apiUrlShipmentContentBatch, data);
  }

  shipmentContentSerial(data): any {
    return this.http.post(this.apiUrlShipmentContentSerial, data);
  }

  getShipmentDetailsById(id) {
    return this.http.get(this.apiUrlShipmentDetail + id);
  }

  getSoLovByText(text) {
    const show    = '&show=so';
    const basedOn = 'basedOn=shipment-line';
    text    = text    ? '&text='    + encodeURIComponent(text)    : '';
    return this.http.get(this.apiUrlGetSoLovByText + basedOn + show + text );
  }

  getSoLineList(id) {
    return this.http.get(this.apiUrlSoLineList + 'basedOn=so&id='+id+'&show=so-line');
  }

  deletePolicyRounting(id: any) {
    return this.http.delete(this.deleteShipmentLine + id);
  }

  updateShipment(data, id): any {
    return this.http.put(this.apiUrlUpdateShipment +'/' +id, data);
  }

  shipShipment(data): any {
    return this.http.post(this.apiUrlShipShipment, data);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
}
}
