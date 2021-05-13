import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { AutheticationService } from './authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class SubInventoryService {
    private companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );
    private apiUrlGetSubInventory =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/location-group/sorted';
    private apiUrlGetSubInvById =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/location-group/details/';
    private apiUrlGetIOLOV =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/inv-unit';
    private apiUrlAddSubInvtory =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/location-group/';
    private apiUrlSubInvtoryTypeLOV =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=Location Group Types';
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/location-group/search';
    private apiUrlGetUomLov = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-based?show=uom&basedOn=item&id=';
    private apiUrlItemAssignment = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lgItemAssignment/';
    private apiUrlGetItemAssignment = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lgItemAssignment/details/';
    private apiUrlGetLocatorByLg = Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/lov-based/search/';
    private apiUrlRepCriteriaByLg = Constants.apiBaseUrl + Constants.apiMasterUrl + '/service/lov-based/search/';

    defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

    constructor(private http: HttpClient, private autheticationService: AutheticationService, private commonService : CommonService) {
    }

    public getSubInventoryList() {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get(this.apiUrlGetSubInventory + '/' + this.companyId);
    }

    public getSubInventoryById(id: number) {
        return this.http.get(this.apiUrlGetSubInvById + id);
    }

    public getInventoryOrgList() {
        this.companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get(this.apiUrlGetIOLOV + '/' + this.companyId);
    }

    public getSubInvertoryTypeLOVList() {
        return this.http.get(this.apiUrlSubInvtoryTypeLOV);
    }

    public addSubInvertory(subInvertoryData: any): any {
        return this.http.post(this.apiUrlAddSubInvtory, subInvertoryData);
    }

    public updateSubInvertory(id: number, subInvertoryData: any): any {
        return this.http.put(this.apiUrlAddSubInvtory + id, subInvertoryData);
    }

    getSubInventorySearch(SearchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, SearchInfo);
    }

    getUomByItem(itemId:number){
      return this.http.get(this.apiUrlGetUomLov + itemId);
    }

    public addItemAssignment(data: any): any {
        return this.http.post(this.apiUrlItemAssignment, data);
    }

    public updateItemAssignment(data: any): any {
        return this.http.put(this.apiUrlItemAssignment, data);
    }

    getItemAssignmentByLg(lgId:number){
      return this.http.get(this.apiUrlGetItemAssignment + lgId);
    }

    deleteItemAssignmennt(id:number){
      return this.http.delete(this.apiUrlItemAssignment + id);
    }

    getLocatorByLg( column, text) {
        const show    = '&show=locator';
        const basedOn = 'basedOn=lg';
        column  = column  ? '&column='  + column  : '';
        text    = text    ? '&text='    + encodeURIComponent(text)    : '';

        return this.http.get(
            this.apiUrlGetLocatorByLg +'?' + basedOn + column + show + text
            );
    }

    getRepCriteriaByLg( data) {
        const show    = '&show=replenish-criteria';
        const basedOn = 'basedOn=item-lg';
        const column  = data  ? '&column='  + data  : '';
     

        return this.http.get(
            this.apiUrlRepCriteriaByLg +'?' + basedOn + show + column
            );
    }



}
