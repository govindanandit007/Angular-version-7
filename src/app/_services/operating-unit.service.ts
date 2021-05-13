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
export class OperatingUnitService {
    // private headers = new HttpHeaders({ 'content-type': 'application/json' });
    private companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );
    private apiUrlGetOU =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/opr-unit';
    private apiUrlAddOU =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/opr-unit';
    private apiUrlGetOUById =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/opr-unit/details';
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/opr-unit/search';

    constructor(
        private http: HttpClient,
        private autheticationService: AutheticationService
    ) { }

    getOperatingUnitList() {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get(this.apiUrlGetOU + '/' + this.companyId);
    }
    getOperatingUnitById(id: number) {
        return this.http.get(this.apiUrlGetOUById + '/' + id);
    }
    createOperatingUnit(operatingUnit: any): any {
        return this.http.post(this.apiUrlAddOU, operatingUnit);
    }
    updateOperatingUnit(id: number, operatingUnit: any): any {
        return this.http.put(this.apiUrlAddOU + '/' + id, operatingUnit);
    }

    getOperatingUnitSearch(OUSearchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, OUSearchInfo);
    }
}
