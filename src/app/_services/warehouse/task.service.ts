import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrlGetSearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/search';
    private apiUrlGetSummarySearch =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/summarySearch';
    private apiUrlGetUser =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lov-based/search?show=user&basedOn=task&text';
    private apiUrlUpdate =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/update';
    private apiUrlTaskDetails =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/taskByGroup';
    private apiUrlTaskBatchList =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/batchList';
    private apiUrlTaskSerialList =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/task/serialList';

        defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

    constructor(private http: HttpClient, private commonService : CommonService) {}
    getTaskSearch(searchInfo: any): any {
        return this.http.post(this.apiUrlGetSearch, searchInfo);
    }
    getTaskSummarySearch(searchInfo: any): any {
        return this.http.post(this.apiUrlGetSummarySearch, searchInfo);
    }

    getUserLovByScreen(text) {
        return this.http.get(this.apiUrlGetUser + '=' + text);
    }
    updateTask(data): any {
        return this.http.put(this.apiUrlUpdate, data);
    }

    getTaskDetails(data: any): any {
        return this.http.post(this.apiUrlTaskDetails, data);
    }

    getTaskBatchList(data: any): any {
        return this.http.post(this.apiUrlTaskBatchList, data);
    }

    getTaskSerialList(data: any): any {
        return this.http.post(this.apiUrlTaskSerialList, data);
    }

    


}
