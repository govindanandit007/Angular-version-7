import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
import { AutheticationService } from '../authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityGroupService {

  private apiUrlCreateGroup  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/create';
  private apiUrlSearchGroup  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/search';
  private apiUrlUpdateGroup  = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/update';
  private apiUrlGroupDetails = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/activity-group/details';

  
  constructor(private http: HttpClient, private commonService : CommonService, private autheticationService: AutheticationService) {}

  createGroup(data: any): any {
    return this.http.post(this.apiUrlCreateGroup, data);
  }

  searchGroup(data: any): any {
    return this.http.post(this.apiUrlSearchGroup, data);
  }

  updateGroup(data, id): any {
    return this.http.put(this.apiUrlUpdateGroup +'/' +id, data);
  }

  getGroupDetails(groupId){
    return this.http.get( this.apiUrlGroupDetails +'/'+ groupId);
  }



  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
 




}

