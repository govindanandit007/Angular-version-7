import { Injectable } from '@angular/core';
import { Constants } from 'src/app/_shared/Constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ManualPrintService {
    private apiUrlGetLabel = Constants.flexiAPIUrl + 'api/Rest/GetLabel?';
    private apiUrlGetHistoryprint =
        Constants.flexiAPIUrl +
        'api/Rest/GetHistoryPrint?AppUserName=admin@visioncorp.com&Label=';
    private apiPrintManualPrint = Constants.flexiAPIUrl + 'api/Rest/Print';
    constructor(private http: HttpClient) {}

    getLabel(): any {
        return this.http.get(
            this.apiUrlGetLabel + 'AppUserName=admin@visioncorp.com'
        );
    }
    getLabelById(id): any {
        return this.http.get(
            this.apiUrlGetLabel +
                'id=' +
                id +
                '&AppUserName=admin@visioncorp.com'
        );
    }
    getHistoryPrintByLabel(name): any {
        return this.http.get(this.apiUrlGetHistoryprint + name);
    }

    printManualPrint(data): any {
        const headers = { 'content-type': 'application/json' };
        return this.http.post(this.apiPrintManualPrint, data, {
            headers: headers
        });
    }
}
