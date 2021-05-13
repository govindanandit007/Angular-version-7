import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';
import { CommonService } from 'src/app/_services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class PutawayPolicyService {
    companyId = Number;
    private apiUrlSearchPoicyRouting =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/policy-routing/search';
    private apiUrlGetIuLovAll =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lovs/IU/';
    private apiUrlGetRoutingLogicLov =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lov/policy-routing/logic-list';
    private apiUrlGetRoutingPolicyLov =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lov-based?basedOn';
        // Constants.apiMasterUrl + 'service/lov-based?show=policy-name&basedOn=policy-routing&id=';
    // private apiUrlGetRoutingPickingPolicyLov =
    //     'http://150.136.164.157:8080/wmsapi-master/service/lov-based?basedOn=picking&id=880&show=policy-name';
    private apiUrlGetRoutingOperatorLov =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=POLICY_ROUTING_OPERATOR';
    private apiUrlGetRoutingValueTableLov =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov-table?tableName=';
    private apiUrlGetRoutingValueLookupLov =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lookup/enabled?lookupName=';
    private deletePolicyRouting =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/policy-routing/';
    private apiUrlCreateRouting =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/policy-routing/batchInsert';
    private apiUrlUpdateRouting =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/policy-routing/batchUpdate';

    // APIs for policy rules ===
    private apiUrlGetPutawayPolicyDetails =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service';
        // Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/putaway-policy/details/';

    private apiUrlGetAllPriority =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/putaway-policy/priority/';

    private apiForPutawayPolicyAction =
    Constants.apiBaseUrl + Constants.apiMasterUrl + 'service';
        // Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/putaway-policy';

    private apiForSortingValueLov =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/algorithm/';
    private apiForPutawayPolicyLogicList =
        Constants.apiBaseUrl +
        Constants.apiMasterUrl + 'service/lov/putaway-policy/';

    private apiForGetAlgorithmList =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lov/algorithm/';

    private apiForDeletePriority =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/putaway-policy/priority/';

    private apiForDeleteRules =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/policy-rules/';

    private apiForDeleteSort =
        Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/policy-sort/';
    defaultIuDataObservable = this.commonService.defaultIuDataSource.asObservable();

    constructor(private http: HttpClient, private commonService : CommonService) {}

    // get policy routing list by IU Id
    getPolicyRoutingList(body: any): any {
        return this.http.post(this.apiUrlSearchPoicyRouting, body);
    }

    // batch insert routing
    batchInsert(body: any): any {
        return this.http.post(this.apiUrlCreateRouting, body);
    }

    // batch update routing
    batchUpdate(body: any): any {
        return this.http.put(this.apiUrlUpdateRouting, body);
    }

    // get all IU
    getIuLovAll() {
        this.companyId = JSON.parse(
            localStorage.getItem('userDetails')
        ).companyId;
        return this.http.get(this.apiUrlGetIuLovAll + this.companyId);
    }

    // get routing logic lov
    getRoutingLogic() {
        return this.http.get(this.apiUrlGetRoutingLogicLov);
    }

    // get routing policy lov
    getRoutingPolicy(basedOnData, showData, iuId) {
        return this.http.get(this.apiUrlGetRoutingPolicyLov + '=' + basedOnData + '&show=' + showData + '&id='+ iuId);
    }

    // get routing operator lov
    getRoutingOperator() {
        return this.http.get(this.apiUrlGetRoutingOperatorLov);
    }

    // get routing value table lov
    getRoutingValueTable(sourceValue, logicCode, iuId) {
        return this.http.get(
            this.apiUrlGetRoutingValueTableLov +
                sourceValue +
                '&iuId=' +
                iuId +
                '&columnName=' +
                logicCode
        );
    }

    // get routing value lookup lov
    getRoutingValueLookup(sourceValue) {
        return this.http.get(this.apiUrlGetRoutingValueLookupLov + sourceValue);
    }

    // delete policy routing
    deletePolicyRounting(id: any) {
        return this.http.delete(this.deletePolicyRouting + id);
    }

    // *** APIs functions for Putaway policy rules ***//
    // get putaway policy details---

    getPutwayPolicyDetails(policyType, policyId) {
        return this.http.get(this.apiUrlGetPutawayPolicyDetails +'/'+policyType +'/details/' + policyId);
    }

    getAllPutawayPolicyPriority() {
        return this.http.get(this.apiUrlGetAllPriority);
    }

    getAllPutawayPolicyLogicList(type) {
        return this.http.get(this.apiForPutawayPolicyLogicList + type);
    }

    getAllAlgorithmList(type) {
        return this.http.get(this.apiForGetAlgorithmList + type);
    }

    // Putaway Policy Insert
    putawayPolicyInsert(policyType:string,body: any): any {
        return this.http.post(this.apiForPutawayPolicyAction + '/' + policyType, body);
    }

    // Putaway Policy Update
    putawayPolicyUpdate(policyType:string, body: any, policyId: number): any {
        return this.http.put(
            this.apiForPutawayPolicyAction + '/'+ policyType +'/'+ policyId,
            body
        );
    }

    deletePriority(priorityId) {
        return this.http.delete(this.apiForDeletePriority + priorityId);
    }

    deleteRules(ruleId) {
        return this.http.delete(this.apiForDeleteRules + ruleId);
    }

    deleteSort(sortId) {
        return this.http.delete(this.apiForDeleteSort + sortId);
    }

    // get routing logic lov
    getSortingValueLov(type) {
        return this.http.get(this.apiForSortingValueLov + type);
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
}
