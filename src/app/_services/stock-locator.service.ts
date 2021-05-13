import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class StockLocatorService {
    companyId = Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
    );
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/stock-locator/search/';
    private apiUrlAddStockLocator =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/stock-locator/batchInsert';
    private apiUrlUpdateStockLocator =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/stock-locator/batchUpdate';

    defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

    constructor(private http: HttpClient, private commonService : CommonService) {}

    getStockLocatorSearch(OUSearchInfo: any): any {
        this.companyId = JSON.parse(
            localStorage.getItem('userDetails')
        ).companyId;
        return this.http.post(
            this.apiUrlGetSearch + this.companyId,
            OUSearchInfo
        );
    }

    createStockLocators(stockLocatorArray: any): any {
        return this.http.post(this.apiUrlAddStockLocator, stockLocatorArray);
    }
    updateStockLocators(stockLocatorArray: any): any {
        return this.http.put(this.apiUrlUpdateStockLocator, stockLocatorArray);
    }
}
