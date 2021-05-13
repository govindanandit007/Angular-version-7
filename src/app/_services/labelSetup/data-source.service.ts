import { Injectable } from '@angular/core';
import { Constants } from 'src/app/_shared/Constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private apiUrlSearch = Constants.flexiAPIUrl + 'api/Rest/GetDataSource/?AppUserName=admin@visioncorp.com';
  private apiUrlGetDataSource = Constants.flexiAPIUrl + 'api/Rest/GetDataSource/?Id=';
  private apiPostModels = Constants.flexiAPIUrl + 'api/Rest/PostModels';
  constructor(private http: HttpClient) { }

  getDataSourceSearch(): any {
    return this.http.get(this.apiUrlSearch);
  }

  getDataSourceById(id): any {
    return this.http.get(this.apiUrlGetDataSource + id + '&AppUserName=admin@visioncorp.com');
  }

  createDataSource(data): any {
    const headers = { 'content-type': 'application/json'};
    return this.http.post(this.apiPostModels, data,{'headers':headers});
  }

}
