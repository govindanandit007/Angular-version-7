import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { from, throwError, BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialStatusSetupService {
    private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/searchs';
    private apiUrlAddMaterialStatusSetup = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/create';
    private apiUrlUpdateMaterialStatusSetup = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/update';
    private apiUrlMaterialStatusSetupDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/material/details/';

    defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();
  
    constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

    getMaterialStatusSetupSearch(materialSetupSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, materialSetupSearchInfo);
  }

  createMaterialStatusSetup(data): any {
    return this.http.post(this.apiUrlAddMaterialStatusSetup, data);
  }

  updateMaterialStatusSetup(data, id): any {
    return this.http.put(this.apiUrlUpdateMaterialStatusSetup +'/' +id, data);
  }

  getMaterialStatusSetupById(id:number){
    return this.http.get(
      this.apiUrlMaterialStatusSetupDetails + id
    );
  }


}
