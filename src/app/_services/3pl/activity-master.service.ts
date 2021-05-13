import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityMasterService {

  private apiUrlCreateActivity  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity/create';
  private apiUrlSearchActivity  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity/search';
  private apiUrlUpdateActivtiy  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity/update';
  private apiUrlActivityDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity/details';

  
  constructor(private http: HttpClient, private commonService : CommonService, private autheticationService: AutheticationService) {}

  createActivity(data: any): any {
    return this.http.post(this.apiUrlCreateActivity, data);
  }

  searchActivity(data: any): any {
    return this.http.post(this.apiUrlSearchActivity, data);
  }

  updateActivtiy(data, id): any {
    return this.http.put(this.apiUrlUpdateActivtiy +'/' +id, data);
  }

  getActivityDetails(activityId){
    return this.http.get( this.apiUrlActivityDetails +'/'+ activityId);
  }



  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
 




}
