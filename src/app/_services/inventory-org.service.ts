import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { map } from 'rxjs/operators';
import { Company } from '../masters/_models/company.model';
import { Observable } from 'rxjs';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrgService {
  // headers: any;
  // private headers = new HttpHeaders({ 'content-type': 'application/json' });
  private companyId = Number(JSON.parse(localStorage.getItem('userDetails')).companyId);
  private apiUrl_getIO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/sorted';
  private apiUrl_getIOBYId = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/details';
  private apiUrl_addIO = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit';
  private apiUrlGetSearch =
    Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/search';
  constructor(private http: HttpClient, private autheticationService: AutheticationService) {
    // this.headers = this.autheticationService.getHeaders();
  }

  public getInventoryOrgList() {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    return this.http.get(this.apiUrl_getIO + '/' + this.companyId);
  }
  getInventoryOrgById(id: any) {
    return this.http.get(this.apiUrl_getIOBYId + '/' + id)
  }
  createInventoryOrg(inventoryOrg: any): any {
    return this.http.post(this.apiUrl_addIO, inventoryOrg);
  }
  updateInventoryOrg(id: number, operatingUnit: any): any {
    return this.http.put(this.apiUrl_addIO + '/' + id, operatingUnit);
  }
  getInventoryOrgSearch(OUSearchInfo: any): any {
    return this.http.post(this.apiUrlGetSearch, OUSearchInfo);
  }
}


