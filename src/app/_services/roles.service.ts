import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrlScreens = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/screenTypes';
  private apiUrlScreensById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/roleScreenAgn';
  private apiUrlGet = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/search';
  private apiUrlGetById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/details';
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/search';
  private apiUrlAddRole = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/create';
  private apiUrlAddRoleScreen = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/roleScreenAgn/insertBatch';
  private apiUrlUpdateRole = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/update';
  private apiUrlUpdateRoleScreen = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/roleScreenAgn/updateBatch';
  private apiUrlgetDefaultAndEnabledScreen = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/role/lov';

  constructor(private http: HttpClient, private autheticationService: AutheticationService) { }
  companyId = '';
  getAllScreens(): any {
    return this.http.get(this.apiUrlScreens);
  }
  getRole(obj: any): any {
    return this.http.post(this.apiUrlGet, obj);
  }

  getRoleById(id: any): any {
    return this.http.get(this.apiUrlGetById + '/' + id);
  }
  getDefaultRole(): any {
    this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    return this.http.get(this.apiUrlgetDefaultAndEnabledScreen + '/' + this.companyId +'?enableFlag=Y&roleName=')
  }

  addRole(obj: any): any {
    return this.http.post(this.apiUrlAddRole, obj);
  }
  updateRole(obj: any): any {
    return this.http.put(this.apiUrlUpdateRole + '/' + obj.roleId, obj);
  }
  getAllScreensById(roleId): any {
    return this.http.get(this.apiUrlScreensById + '/' + roleId);
  }
  addRoleScreens(obj: any): any {
    return this.http.post(this.apiUrlAddRoleScreen, obj);
  }
  updateRoleScreens(obj: any): any {
    return this.http.put(this.apiUrlUpdateRoleScreen, obj);
  }

  getRoleSearch(roleSearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, roleSearchInfo);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }
}
