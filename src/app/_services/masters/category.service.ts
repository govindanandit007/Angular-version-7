import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/_shared/Constants';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private companyId = Number(JSON.parse(localStorage.getItem('userDetails')).companyId);
  private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category/search';
  private apiUrlGetCategory = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category';
  private apiUrlGetCategoryById = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category/details';
  private apiUrlAddCategory = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category/create';
  private apiUrlUpdateCategory = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/category/update';
  constructor(private http: HttpClient) {

  }
  public getCategoryList() {
    // this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
    return this.http.get(this.apiUrlGetCategory);
  }
  createCategory(categoryArray: any): any {
    return this.http.post(this.apiUrlAddCategory, categoryArray);
  }
  updateCategory(categoryArray: any): any {
    return this.http.put(this.apiUrlUpdateCategory, categoryArray);
  }
  getCategorySearch(categorySearchInfo: any): any {
    return this.http.post(this.apiUrlSearch, categorySearchInfo);
  }
}
