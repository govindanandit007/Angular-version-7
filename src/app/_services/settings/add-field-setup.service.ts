import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AddFieldSetupService {
  private companyId = Number(
    JSON.parse(localStorage.getItem('userDetails')).companyId
  );


  private apiUrlScreenLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/SCREEN/';
  private apiUrlScreenDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Addlsetup/details';
  private apiUrlCreate = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/Addlsetup/create';

  defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

  constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) { }

  getScreenNames(){
    return this.http.get( this.apiUrlScreenLov + this.companyId);
  }

  getScreenDetails(data){
    return this.http.post( this.apiUrlScreenDetails, data);
  }

  createAddtionalField(data){
    return this.http.post( this.apiUrlCreate, data);
  }


}
