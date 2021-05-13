import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../_shared/Constants';

@Injectable({
    providedIn: 'root'
})
export class ReceiptsService {
    private apiUrlSearch = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/search';
    private apiUrlCreateReceipt = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/create';
    private apiUrlUpdateReceipt = Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/update/';
    constructor(private http: HttpClient) {}


    getReceiptDetailById(id): any {
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/details/' + id
        );
    }


    updateReceipt(receiptID, data): any {
        return this.http.put(
            this.apiUrlUpdateReceipt + receiptID, data
        );
    }
    createReceipt(data): any {
        return this.http.post(this.apiUrlCreateReceipt, data);
    }


    getReceiptSearch(receiptSearchInfo: any): any{
        return this.http.post(this.apiUrlSearch, receiptSearchInfo);
    }

    getSourceLOV(id:number){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/details/' + id
        );
    }

    getSourceLineLOV(sourceId:number, sourceDocCode:string ){
         
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/sourceLineLovs/' + sourceDocCode +'/?sourceId='+sourceId
        );
    }

    getfromIULOV( sourceCode:any ){
         
        let companyId = JSON.parse(localStorage.getItem('userDetails')).companyId;
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/inv-unit/fromLov/'+ companyId +'?sourceCode=' + sourceCode +'&ouId='
        );
    }

    getLGLOV(sourceLineId:number, sourceDocCode:string ){
           
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/location-group/lov/'+ sourceDocCode +"/"+ sourceLineId
        );
    }

    getToLocator(toLgId:number ){
          
       return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/stock-locator/lov/'+ toLgId
       );
   }

   getLPNLOV(iuID){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + "service/lpn/lovRecev/" + iuID + "?itemId=1"
        
        );
    }

    generateLPN(data): any {
        return this.http.post( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/lpn/generate', data);
    }


    getReceiptById(sourceType, headerIUcode){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/sourceLovs/' + sourceType + '/' + headerIUcode
        );
      }

    getBatchLOV(itemId){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/batch-number/lov?itemId=' + itemId
        
        );
    }

    generateBatchID(itemId){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/generate/batchOrSerialNumber/BATCH/'+ itemId +'?qty=0'
        
        );
    }

    generateSerialID(itemId, qty){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/receipt/generate/batchOrSerialNumber/SERIAL/'+ itemId +'?qty='+ qty
        
        );
    }

    getSerialLOV(itemId, iuId ){
        return this.http.get( Constants.apiBaseUrl + Constants.apiMasterUrl + 'service/serial-number/lov/byItem/' + itemId +'?iuId='+ iuId 
        
        );
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
}
