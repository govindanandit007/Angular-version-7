import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root'
})
export class AsnService {
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/search';
  // private apiUrlAddASN = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/create';
  private apiUrlAddASN = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/createWithContent';
  
  // private apiUrlUpdateASN = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/update';
  private apiUrlUpdateASN = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/updateWithContent';
  private apiUrlGetPOLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/polov';
  private apiUrlGetPOLineLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based/search';
  private apiUrlItemContrl = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/itemDetails/';
  private apiUrlAsnDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/detailsWithContent/';
  // private apiUrlAsnDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/asn/details/';

  constructor(private http: HttpClient, private autheticationService: AutheticationService) { }

  getASNSearch(searchInfo: any): any {
    return this.http.post(this.apiUrlSearch, searchInfo);
  }
  createASN(data): any {
    return this.http.post(this.apiUrlAddASN, data);
  }
  updateASN(data, id): any {
    return this.http.post(this.apiUrlUpdateASN +'/' +id, data);
  }
  getPOLov(data): any {
    return this.http.put(this.apiUrlGetPOLov, data);
  }
  // getPolineByPo(poId: number) {
  //   // return this.http.get(this.apiUrlGetPOLineLov + poId);
  // }
  getPolineByPo(show, basedOn, column, text) {
    show = show ? 'show=' + show : '';
    basedOn = basedOn ? '&basedOn=' + basedOn : '';
    column = column ? '&column=' + column : '';
    text = text ? '&text=' + text : '';
    return this.http.get(this.apiUrlGetPOLineLov + '/?' + show + basedOn + column + text);
  }
  
  getAsnById(id:number){
    return this.http.get(
      this.apiUrlAsnDetails + id
    );
  }

  getItemContrl(id:number){
    return this.http.get( this.apiUrlItemContrl + id );
  }



  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
}
