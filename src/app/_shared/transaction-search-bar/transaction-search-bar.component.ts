import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { OnHandService } from 'src/app/_services/transactions/on-hand.service';


@Component({
    selector: 'app-transaction-search-bar',
    templateUrl: './transaction-search-bar.component.html',
    styleUrls: ['./transaction-search-bar.component.css']
})
export class TransactionSearchBarComponent implements OnInit, OnDestroy {
    searchFieldData = [];
    searchType = '';
    searchLabel = '';
    public hideSearch = false;
    tempArray: any = {};
    finalArray: any = {};
    companyKey = '';
    searchDataType = '';
    seachLOVItem: string;
    searchdataArrayUnsubscribe: any = '';
    searchData:any=null

    // ngModel values defines--
    poOuValue: string;
    IuValue: string;
    poStatusValue: string;
    poNumberValue: string;
    receiptNumValue: string;
    batchNumberValue: string;
    batchStatusValue: string;
    batchMaterialStatusValue: string;
    poSupplierNameValue: string;
    poSupplierNameArray: any = [];
    IuCodeArray:any = [];
    poOuCodeArray:any = [];
    poStatusArray:any = [];

    // ngModel values defines for ONHAND--
    itemValue: string;
    itemCodeArray: any = [];
    categoryValue: string;
    categoryCodeArray: any = [];
    lgValue: string;
    onhandStockLocatorValue: string;
    onhandLPNValue: string;
    lgCodeArray: any = [];
    stockLocatorValue: string;
    stockLocatorCodeArray: any = [];


    LPNFromValue: string;
    LPNToValue: string;
    LPNDetailValue : string;
    LPNFromArray: any = [];
    LPNToArray: any = [];
    LPNDetailArray: any = [];

    batchFromValue: string;
    batchToValue: string;
    batchFromArray: any = [];
    batchToArray: any = [];

    serialFromValue: string;
    serialToValue: string;
    serialFromArray: any = [];
    serialToArray: any = [];
    
    serialNumValue:string;
    serialNumberArray: any = [];
    
    asnNumberValue: string;
    asnSupplierNameValue: string;

    onhandTypeList = [
        {value : 'RECEIVING', label: 'Receiving'},
        {value : 'INVENTORY', label: 'Inventory'}
    ]
    onhandTypeValue = 'INVENTORY';

    batchStatusLov : any= [];
    materialStatusLovList : any= [];
    stockLocatorLOVList : any= [];
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    
    constructor(public commonService: CommonService, public onhandService: OnHandService) {}

    ngOnInit() {
        this.getBatchStatusLOVLOV();
        this.onhandStockLocatorLOV();
        this.materialStatusLOV();

        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
             
            this.clearSearchFields();
 
            if (data.searchArray) {
                this.searchFieldData = [];
                this.searchType = data.searchType;
                this.searchDataType = data.type;
                if (
                    this.searchDataType !== 'COMPANY' &&
                    data.companyKey !== undefined
                ) {
                    this.companyKey = data.companyKey;
                    this.tempArray = {
                        [this.companyKey]: String(
                            JSON.parse(localStorage.getItem('userDetails'))
                                .companyId
                        )
                    };
                }
                this.searchLabel = data.searchFor;
                for (const fieldData of data.searchArray) {
                    this.searchFieldData.push(fieldData);
                }
            }

            if( this.searchDataType !== '' && this.searchDataType !== undefined ){
                this.getSearchLOVData(this.searchDataType);
                this.getStockLocatorForOnhand(data.stockLocatorParameter.iuId +'-'+ data.stockLocatorParameter.lgId)
            }

            if( this.searchDataType !== '' && this.searchDataType !== undefined && 
                data.lovSearchFromAdd_update === true ){
                data.lovSearchFromAdd_update = false;
                this.commonService.searhForMasters(data);
                this.getSearchLOVData(this.searchDataType); 
                this.getStockLocatorForOnhand(data.stockLocatorParameter.iuId +'-'+ data.stockLocatorParameter.lgId)
            }

        });
    }
    ngOnDestroy(){
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
    }

    hideSearchContainer() {
        this.searchComponentToggle.emit(this.hideSearch);
    }
    getSearhInfo() {
        this.tempArray = {};
        if (this.searchDataType !== 'COMPANY' && this.companyKey !== '') {
            this.tempArray = {
                [this.companyKey]: String(
                    JSON.parse(localStorage.getItem('userDetails')).companyId
                )
            };
        }
        
        for (const fieldData of this.searchFieldData) {

            // if (fieldData.value) {

                if (this.poStatusValue !== '' && fieldData.lovType === 'poStatus') {
                    this.tempArray[fieldData.key] = this.poStatusValue;
                }
                if (this.poNumberValue !== '' && fieldData.lovType === 'poNumber') {
                    this.tempArray[fieldData.key] = this.poNumberValue;
                }
                if (this.receiptNumValue !== '' && fieldData.lovType === 'receiptNum') {
                    this.tempArray[fieldData.key] = this.receiptNumValue;
                }
                if (this.batchNumberValue !== '' && fieldData.lovType === 'batchNumber') {
                    this.tempArray[fieldData.key] = this.batchNumberValue;
                }
                if (this.batchStatusValue !== '' && fieldData.lovType === 'batchStatus') {
                    this.tempArray[fieldData.key] = this.batchStatusValue;
                }
                if (this.batchMaterialStatusValue !== '' && fieldData.lovType === 'batchMaterialStatus') {
                    this.tempArray[fieldData.key] = this.batchMaterialStatusValue;
                }
                if (this.poOuValue !== '' && fieldData.lovType === 'poOuCode') {
                    this.tempArray[fieldData.key] = this.poOuValue;
                }
                if (fieldData.lovType === 'IuCode') {
                    this.tempArray[fieldData.key] =String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                }
                if (this.onhandTypeValue !== '' && fieldData.lovType === 'onhandType') {
                    this.tempArray[fieldData.key] = this.onhandTypeValue;
                }
                if (this.poSupplierNameValue !== '' && fieldData.lovType === 'poSupplierName') {
                    this.tempArray[fieldData.key] = this.poSupplierNameValue;
                }
                if (this.itemValue !== '' && fieldData.lovType === 'itemCode') {
                    this.tempArray[fieldData.key] = this.itemValue;
                }
                if (this.categoryValue !== '' && fieldData.lovType === 'categoryCode') {
                    this.tempArray[fieldData.key] = this.categoryValue;
                }
                if (this.lgValue !== '' && fieldData.lovType === 'locatorGroupCode') {
                    this.tempArray[fieldData.key] = this.lgValue;
                }
                if (this.onhandStockLocatorValue !== '' && fieldData.lovType === 'onhandStockLocator') {
                    this.tempArray[fieldData.key] = this.onhandStockLocatorValue;
                }
                if (this.onhandLPNValue !== '' && fieldData.lovType === 'onhandLPN') {
                    this.tempArray[fieldData.key] = this.onhandLPNValue;
                }
                if (this.stockLocatorValue !== '' && fieldData.lovType === 'stockLocatorCode') {
                    this.tempArray[fieldData.key] = this.stockLocatorValue;
                }

                if (this.LPNDetailValue !== '' && fieldData.lovType === 'LPNDetail') {
                     
                    this.tempArray[fieldData.key] = this.LPNDetailValue;
                }

                if (this.LPNFromValue !== '' && fieldData.lovType === 'LPNFrom' ||
                    this.LPNToValue !== '' && fieldData.lovType === 'LPNTo') {
                    this.tempArray[fieldData.key] = (this.LPNToValue === '') ?
                    this.LPNFromValue + '-' + this.LPNFromValue : this.LPNFromValue + '-' + this.LPNToValue;
                }

                if (this.batchFromValue !== '' && fieldData.lovType === 'BatchFrom' ||
                    this.batchToValue !== '' && fieldData.lovType === 'BatchTo') {
                    this.tempArray[fieldData.key] = (this.batchToValue === '') ?
                    this.batchFromValue + '-' + this.batchFromValue : this.batchFromValue + '-' + this.batchToValue;
                }

                if (this.serialFromValue !== '' && fieldData.lovType === 'SerialFrom' ||
                    this.serialToValue !== '' && fieldData.lovType === 'SerialTo') {
                    this.tempArray[fieldData.key] = (this.serialToValue === '') ?
                    this.serialFromValue : this.serialFromValue + '-' + this.serialToValue;
                    if( this.serialToValue === '' &&   this.serialFromValue !== '' ){
                        this.tempArray[fieldData.key]  = this.serialFromValue + '-' + this.serialFromValue;
                    }
                    if( this.serialToValue !== '' &&   this.serialFromValue === '' ){
                        this.tempArray[fieldData.key]  = this.serialToValue + '-' + this.serialToValue;
                    }
                }

                if (this.serialNumValue !== '' && fieldData.lovType === 'serialNum') {
                    this.tempArray[fieldData.key] = this.serialNumValue;
                }
            if (this.asnNumberValue !== '' && fieldData.lovType === 'asnNumber') {
                    this.tempArray[fieldData.key] = this.asnNumberValue;
                }
            if (this.asnSupplierNameValue !== '' && fieldData.lovType === 'asnSupplierName') {
                this.tempArray[fieldData.key] = this.asnSupplierNameValue;
                }
            // }
        }

        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick : true
        };
        this.commonService.getsearhForMasters(this.finalArray); 
    }

    clearSearchFields() {
        this.poStatusValue = '';
        this.poNumberValue = '';
        this.asnNumberValue = '';
        this.asnSupplierNameValue = '';
        this.receiptNumValue = '';
        this.batchNumberValue = '';
        this.batchStatusValue = '';
        this.batchMaterialStatusValue = '';
        this.poOuValue = '';
        // this.IuValue = '';
        this.poSupplierNameValue = '';
        this.poSupplierNameArray = [];
        this.IuCodeArray = [];
        this.poOuCodeArray = [];
        this.poStatusArray = [];
        this.itemValue = '';
        this.itemCodeArray = [];
        this.categoryValue = '';
        this.categoryCodeArray = [];
        this.lgValue = '';
        this.onhandStockLocatorValue = '';
        this.onhandLPNValue = '';
        this.lgCodeArray = [];
        this.stockLocatorValue = '';
        this.stockLocatorCodeArray = [];

        this.LPNFromValue = '';
        this.LPNToValue = '';
        this.LPNDetailValue = '';
        this.LPNFromArray = [];
        this.LPNToArray = [];
        this.LPNDetailArray = [];

        this.batchFromValue = '';
        this.batchToValue = '';
        this.batchFromArray = [];
        this.batchToArray = [];

        this.serialFromValue = '';
        this.serialToValue = '';
        this.serialFromArray = [];
        this.serialToArray = [];

        this.serialNumValue = '';
        this.serialNumberArray = [];

     
        this.onhandTypeValue = 'INVENTORY';

        for (const listElement of this.searchFieldData) {
            listElement.enable = true;
        }

        if (
            String(JSON.parse(localStorage.getItem('userDetails')).userId) ===
                '-1' ||
            this.companyKey === ''
        ) {
            this.tempArray = {};
        }
    }

    getSearchLOVData(searchType: string) {
        if (searchType !== '') {
        this.commonService.getSearchLOV(searchType).subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        if (result.result) {
                            const data = result.result;
                            for (const listElement of this.searchFieldData) {
                                // if (listElement.lovType === 'poNumber'     ||
                                //     listElement.lovType === 'receiptNum'   ||
                                //     listElement.lovType === 'batchNumber'  ||
                                //     listElement.lovType === 'itemCode'     ||
                                //     listElement.lovType === 'serialNum'){
                                //     listElement.list = [{
                                //         label: ' Please Select',
                                //         value: ''
                                //     }];
                                // }
                                for (const lovItem of data) {
                                    listElement.value = lovItem.id;

                                    // for po status
                                    if (listElement.lovType === 'poStatus') {
                                        if(!this.poStatusArray.includes(lovItem.statusCode)){
                                            this.poStatusArray.push(lovItem.statusCode);
                                            listElement.list.push({
                                                label: lovItem.statusName,
                                                value: String(lovItem.statusCode)
                                            });
                                        } else {}
                                    }

                                    // for po number
                                    if (listElement.lovType === 'poNumber') {
                                        listElement.list.push({
                                            label: lovItem.poNumber,
                                            value: String(lovItem.poNumber)
                                        });
                                    }

                                    // for receipt number
                                    if (listElement.lovType === 'receiptNum') {
                                        listElement.list.push({
                                            label: lovItem.receiptNum,
                                            value: String(lovItem.receiptNum)
                                        });
                                    }

                                    // for receipt number
                                    if (listElement.lovType === 'batchNumber') {
                                        listElement.list.push({
                                            label: lovItem.batchNum,
                                            value: String(lovItem.id)
                                        });
                                    }

                                    // for po OU code
                                    if (listElement.lovType === 'poOuCode') {
                                        if(!this.poOuCodeArray.includes(lovItem.ouId)){
                                            this.poOuCodeArray.push(lovItem.ouId);
                                            listElement.list.push({
                                                label: lovItem.ouCode,
                                                value: String(lovItem.ouId)
                                            });
                                        } else {}
                                    }

                                    // for IU code
                                    if (listElement.lovType === 'IuCode' ) {
                                        if (!this.IuCodeArray.includes(lovItem.iuId) && lovItem.iuId !== null){
                                            this.IuCodeArray.push(lovItem.iuId);
                                            listElement.list.push({
                                                label: lovItem.iuCode,
                                                value: String(lovItem.iuId)
                                            });
                                        } else {}
                                    }

                                    // for po supplier name
                                    if (listElement.lovType === 'poSupplierName') {
                                        if(!this.poSupplierNameArray.includes(lovItem.supplierId)){
                                            this.poSupplierNameArray.push(lovItem.supplierId);
                                            listElement.list.push({
                                                label: lovItem.supplierName,
                                                value: String(lovItem.supplierId)
                                            });
                                        } else {}
                                    }

                                    // for Item values
                                    if (listElement.lovType === 'itemCode') {
                                        if (!this.itemCodeArray.includes(lovItem.itemId) && lovItem.itemId !== null) {
                                            this.itemCodeArray.push(lovItem.itemId);
                                            listElement.list.push({
                                                label: lovItem.itemName,
                                                value: String(lovItem.itemId)
                                            });
                                        } else { }
                                    }

                                    // for Category
                                    if (listElement.lovType === 'categoryCode') {
                                        if (!this.categoryCodeArray.includes(lovItem.ctgryId)) {
                                            this.categoryCodeArray.push(lovItem.ctgryId);
                                            listElement.list.push({
                                                label: lovItem.ctgryCode,
                                                value: String(lovItem.ctgryId)
                                            });
                                        } else { }
                                    }

                                    // for Locator Group
                                    if (listElement.lovType === 'locatorGroupCode') {
                                        if (!this.lgCodeArray.includes(lovItem.lgId)) {
                                            this.lgCodeArray.push(lovItem.lgId);
                                            listElement.list.push({
                                                label: lovItem.lgName,
                                                value: String(lovItem.lgId)
                                            });
                                        } else { }
                                    }

                                    // for Stock Locator
                                    // line no:436  label: lovItem.locCode + "   "+ lovItem.locId
                                    // this is changed on 27thjan2021
                                     
                                    if (listElement.lovType === 'stockLocatorCode' && listElement.formType !== 'ONHANDSTOCK') {
                                        if (!this.stockLocatorCodeArray.includes(lovItem.locId)) {
                                            this.stockLocatorCodeArray.push(lovItem.locId);
                                            listElement.list.push({
                                                label: lovItem.locCode,
                                                value: String(lovItem.locId)
                                            });
                                        } else { }
                                    }

                                     // for LPN Detial in Onhand Detial page
                                     if (listElement.lovType === 'LPNDetail') {
                                        if (!this.LPNDetailArray.includes(lovItem.lpnId) ) {
                                            this.LPNDetailArray.push(lovItem.lpnId);
                                            listElement.list.push({
                                                label: lovItem.lpnNum,
                                                value: String(lovItem.lpnId)
                                            });
                                        } else { }
                                    }

                                    // for LPN From
                                    if (listElement.lovType === 'LPNFrom') {
                                        if (!this.LPNFromArray.includes(lovItem.lpnId) && lovItem.lpnId !== null) {
                                            this.LPNFromArray.push(lovItem.lpnId);
                                            listElement.list.push({
                                                label: lovItem.lpnNum,
                                                value: String(lovItem.lpnId)
                                            });
                                        } else { }
                                    }

                                    // for LPN To
                                    if (listElement.lovType === 'LPNTo') {
                                        if (!this.LPNToArray.includes(lovItem.lpnId) && lovItem.lpnId !== null) {
                                            this.LPNToArray.push(lovItem.lpnId);
                                            listElement.list.push({
                                                label: lovItem.lpnNum,
                                                value: String(lovItem.lpnId)
                                            });
                                        } else { }
                                    }

                                    // for Batch From
                                    if (listElement.lovType === 'BatchFrom') {
                                        if (!this.batchFromArray.includes(lovItem.batchNumber) && lovItem.batchNumber !== null) {
                                            this.batchFromArray.push(lovItem.batchNumber);
                                            listElement.list.push({
                                                label: lovItem.batchNumber,
                                                value: String(lovItem.batchNumber)
                                            });
                                        } else { }
                                    }

                                    // for Batch To
                                    if (listElement.lovType === 'BatchTo') {
                                        if (!this.batchToArray.includes(lovItem.batchNumber) && lovItem.batchNumber !== null) {
                                            this.batchToArray.push(lovItem.batchNumber);
                                            listElement.list.push({
                                                label: lovItem.batchNumber,
                                                value: String(lovItem.batchNumber)
                                            });
                                        } else { }

                                    }

                                    // for Serial From
                                    if (listElement.lovType === 'SerialFrom') {
                                        if (!this.serialFromArray.includes(lovItem.serialNumber) && lovItem.serialNumber !== null) {
                                            this.serialFromArray.push(lovItem.serialNumber);
                                            listElement.list.push({
                                                label: lovItem.serialNumber,
                                                value: String(lovItem.serialNumber)
                                            });
                                        } else { }
                                    }

                                    // for Serial To
                                    if (listElement.lovType === 'SerialTo') {
                                        if (!this.serialToArray.includes(lovItem.serialNumber) && lovItem.serialNumber !== null) {
                                            this.serialToArray.push(lovItem.serialNumber);
                                            listElement.list.push({
                                                label: lovItem.serialNumber,
                                                value: String(lovItem.serialNumber)
                                            });
                                        } else { }
                                    }

                                    // for Serial Number
                                    if (listElement.lovType === 'serialNum') {
                                        if (!this.serialNumberArray.includes(lovItem.id) && lovItem.id !== null) {
                                            this.serialNumberArray.push(lovItem.id);
                                            listElement.list.push({
                                                label: lovItem.serialNum,
                                                value: String(lovItem.id)
                                            });
                                        } else { }
                                    }


                                }
                                listElement.list  =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)

                            } 
                        }
                    }
                },
                (error: any) => {
                     
                }
            );
        }
        
    }

    getBatchStatusLOVLOV() {
 
        this.batchStatusLov = [{label: ' Please Select', value:''}];
        this.commonService
            .getLookupLOV('BATCH_STATUS')
            .subscribe((data: any) => {
            for (const rowData of data.result) {
                this.batchStatusLov.push({
                value: rowData.lookupValue,
                label: rowData.lookupValueDesc
                });
            }
            });
    }
    materialStatusLOV(){
             this.commonService.getMaterialStatusLOV().subscribe(
                    (result: any) => {
                        this.materialStatusLovList = [{
                            label: ' Please Select',
                            value: ''
                        }];
                        if (result.status === 200) {
                            if (result.result) {
                                const data = result.result;
                                for (const rowData of data) {
                                this.materialStatusLovList.push({
                                    value: String(rowData.materialStatusId),
                                    label: rowData.materialStatusName
                                });
                            }
                            }
                        }
                })
    }
    onhandStockLocatorLOV(){
             this.commonService.getStockLocatorLOV().subscribe(
                    (result: any) => {
                        this.stockLocatorLOVList = [{
                            label: ' Please Select',
                            value: ''
                        }];
                        if (result.status === 200) {
                            if (result.result) {
                                const data = result.result;
                                for (const rowData of data) {
                                this.stockLocatorLOVList.push({
                                    value: rowData.code,
                                    label: rowData.code
                                });
                            }
                            }
                        }
                })
    }
    getStockLocatorForOnhand(searchData){
        this.onhandService.getOnhandStocklocatorData(searchData).subscribe(
            (result: any) => {
              if (result.status === 200) {
                if (result.result) {
                  const data = result.result;
                  for (const listElement of this.searchFieldData) {
                    if (listElement.lovType === 'stockLocatorCode') {
                      for (const lovItem of data) {
                        if (!this.stockLocatorCodeArray.includes(lovItem.locId)) {
                            this.stockLocatorCodeArray.push(lovItem.locId);
                            listElement.list.push({
                                label: lovItem.locCode,
                                value: String(lovItem.locId)
                            });
                          } else { }
                      }
                    }
                  }
                 
                }
              }
            },
            (error: any) => {
              console.log(error.error.message);
              
            }
          );
    }

    getDependentList(event, fieldValue, lovTypeFrom, lovTypeTO ) {
        let tempArray =  [];
        for (const listElement of this.searchFieldData) {
            if (listElement.lovType === lovTypeFrom){
              tempArray = listElement.list
            }
            if (listElement.lovType === lovTypeTO){
                listElement.list = [];

                let valueArray = [];
                for (const item of tempArray) {
                  if(item.value.toLowerCase() !== ''){
                    valueArray.push(item.value.toLowerCase())
                  }
                }

                valueArray = this.sort(valueArray)

                for (const [i,key] of valueArray.entries()) {
                  if(key.toLowerCase() === fieldValue.toLowerCase()){
                    valueArray = valueArray.splice(i,valueArray.length );
                    break;
                  }
                }

                valueArray = this.sort(valueArray)
                let newTempArray = []
                for (const item of valueArray) {
                  for (const [i,key] of tempArray.entries()) {
                    if( item.toLowerCase() === key.value.toLowerCase()){
                      newTempArray.push(key)
                    }
                  }
                }


                for (const item of newTempArray) {
                        listElement.enable = false;
                        listElement.list.push(item);
                }


                if (fieldValue === ''){
                    listElement.list = tempArray;
                    listElement.enable = true;
                }
            }

            if (lovTypeTO === 'LPNTo'){
                this.LPNToValue = fieldValue;
            }
            if (lovTypeTO === 'BatchTo') {
                this.batchToValue = fieldValue;
            }
            if (lovTypeTO === 'SerialTo') {
                this.serialToValue = fieldValue;
            }

        } 
      }




    sort (array) {
            return array.sort((a, b) => {
            // convert to strings and force lowercase
            a = typeof a === 'string' ? a.toLowerCase() : a.toString();
            b = typeof b === 'string' ? b.toLowerCase() : b.toString();
            return a.localeCompare(b);
        });
    }

    onserialfocus(event: any, type: any){
        if(type === 'SerialTo'){
            this.serialToValue   = this.serialFromValue;
        }else{ 
            this.serialFromValue = this.serialToValue;
        }
    }


}
