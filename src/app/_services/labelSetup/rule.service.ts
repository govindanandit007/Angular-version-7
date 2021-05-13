import { Injectable } from '@angular/core';
import { Constants } from 'src/app/_shared/Constants';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RuleService {
    private apiUrlSearch =
        Constants.flexiAPIUrl +
        'api/Rest/GetRule/?AppUserName=admin@visioncorp.com';
    private apiUrlGetRule = Constants.flexiAPIUrl + 'api/Rest/GetRule/?Id=';
    private apiUrlAddRule = Constants.flexiAPIUrl + 'api/Rest/PostRule?';

    constructor(private http: HttpClient) {}

    getRuleSearch(): any {
        return this.http.get(this.apiUrlSearch);
    }

    getRuleById(id): any {
        return this.http.get(
            this.apiUrlGetRule + id + '&AppUserName=admin@visioncorp.com'
        );
    }

    createRule(data,formData, id): any {
         
        let ruleForType = '';
        let description = '';
        // let ruleId = ''
        if (formData.Type === 'Printer'){
          ruleForType = '&PrinterID=' + Number(formData.LabelName);  
        }
        if (formData.Type === 'Label'){
          ruleForType = '&LabelID=' + Number(formData.LabelName);  
        }
        if (formData.Description !==''){
            description = '&Description=' + formData.Description;
        }
        if(id !== undefined || id !== ''){
            id = '&id=' + id;
        }
            return this.http.post(
                this.apiUrlAddRule +
                    'Name=' +
                    formData.Name +
                    description +
                    id +
                    ruleForType +
                    '&Expression=' +
                    data +
                    '&Rule=null&Type=null&IsActive=' +
                    formData.IsActive +
                    '&active=' +
                    formData.active +
                    '&AppUserName=admin@visioncorp.com',
                data
            );
    }
}
