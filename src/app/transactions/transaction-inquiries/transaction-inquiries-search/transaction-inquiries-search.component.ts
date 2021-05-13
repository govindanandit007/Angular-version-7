import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { TransactionInquiriesService } from 'src/app/_services/transactions/transaction-inquiries.service';
import { SerialNoService } from 'src/app/_services/transactions/serial-no.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-transaction-inquiries-search',
    templateUrl: './transaction-inquiries-search.component.html',
    styleUrls: ['./transaction-inquiries-search.component.css']
})
export class TransactionInquiriesSearchComponent implements OnInit, OnDestroy{
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
    defaultIUUnsubscribe: any = '';

    txnType: any = [];
    txnTypeValue: any = '';
    txnTypeError: any = null;
    txnSource: any = [];
    txnSourceValue: any = '';
    txnNumber: any = [];
    txnNumberValue: any = '';
    txnItem: any = [];
    txnItemValue: any = '';
    txnIU: any = [];
    txnToIU: any = [];
    txnIUValue: any = '';
    txnToIUValue: any = '';
    txnLG: any = [];
    txnLGValue: any = '';
    txnLocator: any = [];
    txnLocatorValue: any = '';
    txnToLocatorValue = '';
    txnReceiptNumValue: any = '';

    LPNFromValue: string;
    transLPNValue: string;
    LPNToValue: string;
    LPNFromArray: any = [];
    LPNToArray: any = [];

    batchFromValue: string;
    batchToValue: string;
    batchFromArray: any = [];
    batchToArray: any = [];

    serialFromValue: string;
    serialToValue: string;
    serialFromArray: any = [];
    serialToArray: any = [];

    iuTransactionTypeList: any = [];

    dateFrom: any = new Date();
    dateTo: any = new Date();
    lgFromValue: string;
    iuDisabled: string = '';
    iuId: string = '';
    timer: any = '';
    setEndDate: string;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(
        public commonService: CommonService,
        private transactionService: TransactionInquiriesService,
        private serialNoService: SerialNoService
    ) {}

    ngOnInit() {
        this.setEndDate = this.dateFrom;
        this.IuTransactionType();
                 // timer used for set iu value on change header value
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      // console.log('called'); 
      if( String((JSON.parse(localStorage.getItem('defaultIU'))).id) !== this.iuId){
        if (this.iuDisabled == 'To') {
                    this.txnToIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                } else if (this.iuDisabled == 'From') {
                    this.txnIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                } else {
                    this.txnToIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                    this.txnIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                }
                // else{

                // }
                this.iuId = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
            }
      

   
    });
        //  this.defaultIUUnsubscribe = this.serialNoService.defaultIuDataObservable.subscribe((data: any) => {
        //     if (data !== '') {
        //         console.log(this.iuDisabled);
        //         // this.txnToIUValue = String(data);
        //         if (this.iuDisabled == 'To') {
        //             this.txnToIUValue = String(
        //                 JSON.parse(localStorage.getItem('defaultIU')).id
        //             );
        //         } else if (this.iuDisabled == 'From') {
        //             this.txnIUValue = String(
        //                 JSON.parse(localStorage.getItem('defaultIU')).id
        //             );
        //         } else {
        //             this.txnToIUValue = String(
        //                 JSON.parse(localStorage.getItem('defaultIU')).id
        //             );
        //             this.txnIUValue = String(
        //                 JSON.parse(localStorage.getItem('defaultIU')).id
        //             );
        //         }
        //         // else{

        //         // }
        //         this.iuId = data;
        //     }
        // });
        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe(
            (data: any) => {
                this.clearSearchFields();
                if (data.searchArray) {
                    this.searchFieldData = [];
                    this.searchType = data.searchType;
                    this.searchDataType = data.type;
                    this.searchLabel = data.searchFor;
                    for (const fieldData of data.searchArray) {
                        this.searchFieldData.push(fieldData);
                    }
                }

                if (
                    this.searchDataType !== '' &&
                    this.searchDataType !== undefined
                ) {
                    this.getSearchLOVData(this.searchDataType);
                }

                if (
                    this.searchDataType !== '' &&
                    this.searchDataType !== undefined &&
                    data.lovSearchFromAdd_update === true
                ) {
                    data.lovSearchFromAdd_update = false;
                    this.commonService.searhForMasters(data);
                    this.getSearchLOVData(this.searchDataType);
                }
            }
        );
    }

    IuTransactionType() {
        this.iuTransactionTypeList = [];
        this.commonService
            .getLookupLOV('IU_TRX_TYPE')
            .subscribe((data: any) => {
                if(!data.message){
                for (const rowData of data.result) {
                    this.iuTransactionTypeList.push({
                        value: rowData.lookupValue,
                        label: rowData.lookupValueDesc
                    });
                }
                }
                // this.txnToIUValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
            });
    }

    txnTypeChanged(event: any, txn_type, data) {
        if (event.source.selected === true && event.isUserInput === true) {
            
            for (const rowData of this.iuTransactionTypeList) {
                if (rowData.value === txn_type && rowData.label == 'FROM_IU') {
                    this.txnIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                    this.iuDisabled = 'From';
                    this.txnToIUValue = '';
                }
                if (rowData.value === txn_type && rowData.label == 'TO_IU') {
                    this.txnToIUValue = String(
                        JSON.parse(localStorage.getItem('defaultIU')).id
                    );
                    this.iuDisabled = 'To';
                    this.txnIUValue = '';
                }
                
            }
            if(this.iuTransactionTypeList.length){
                const findReplenisment =  this.iuTransactionTypeList.some(code => code.value === txn_type);
                if(!findReplenisment){
                    this.txnToIUValue = '';
                    this.txnIUValue = '';
                }
            }

            if(data.parentValue == 'Manufacturing'){
                this.txnSourceValue = 'WO';
            }else{
                this.txnSourceValue = '';
            }
        }
    }
    hideSearchContainer() {
        this.searchComponentToggle.emit(this.hideSearch);
    }

    onStartDateChanged(event: any){
        this.setEndDate = this.dateFrom;
        this.dateTo = this.dateFrom;
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
            //if (fieldData.value) {
            if (this.txnTypeValue !== '' && fieldData.lovType === 'txn-Type') {
                this.tempArray['txnType'] = this.txnTypeValue;
            }

            if (
                this.txnSourceValue !== '' &&
                fieldData.lovType === 'txn-Source'
            ) {
                this.tempArray['txnSourceType'] = this.txnSourceValue;
            }

            if (
                this.txnNumberValue !== '' &&
                fieldData.lovType === 'txn-Number'
            ) {
                this.tempArray['txnNumberId'] = this.txnNumberValue;
            }

            if (this.txnItemValue !== '' && fieldData.lovType === 'txn-item') {
                this.tempArray['itemName'] = this.txnItemValue;
            }

            if (this.txnIUValue !== '' && fieldData.lovType === 'txn-IU') {
                this.tempArray['txnIuId'] = this.txnIUValue;
            }

            if (this.txnToIUValue !== '' && fieldData.lovType === 'txn-ToIU') {
                this.tempArray['txnToIuId'] = this.txnToIUValue;
            }

            if (this.txnLGValue !== '' && fieldData.lovType === 'txn-LG') {
                // this.tempArray['txnLgId'] = this.txnLGValue;
                this.tempArray[fieldData.key] = this.txnLGValue;
            }

            if (
                this.lgFromValue !== '' &&
                fieldData.lovType === 'txn-from-LG'
            ) {
                this.tempArray[fieldData.key] = this.lgFromValue;
            }

            if (
                this.txnLocatorValue !== '' &&
                fieldData.lovType === 'txn-Locator'
            ) {
                this.tempArray['txnLocatorId'] = this.txnLocatorValue;
            }

            if (
                this.txnToLocatorValue !== '' &&
                fieldData.lovType === 'txn-ToLocator'
            ) {
                this.tempArray['txnToLocatorId'] = this.txnToLocatorValue;
            }

            if (
                this.txnReceiptNumValue !== '' &&
                fieldData.lovType === 'txn-receiptNum'
            ) {
                this.tempArray[fieldData.key] = this.txnReceiptNumValue;
            }

            // if (this.LPNFromValue !== '' && fieldData.lovType === 'LPNFrom' ||
            //     this.LPNToValue !== '' && fieldData.lovType === 'LPNTo') {
            //     this.tempArray['lpnNumber'] = (this.LPNToValue === '') ?
            //     this.LPNFromValue + '-' + this.LPNFromValue : this.LPNFromValue + '-' + this.LPNToValue;
            // }
            if (this.LPNFromValue !== '' && fieldData.lovType === 'LPNFrom') {
                this.tempArray['lpnNumber'] = this.LPNFromValue;
            }
            if (
                this.transLPNValue !== '' &&
                fieldData.lovType === 'transferLPN'
            ) {
                this.tempArray['txnTransferLpn'] = this.transLPNValue;
            }

            if (
                (this.batchFromValue !== '' &&
                    fieldData.lovType === 'BatchFrom') ||
                (this.batchToValue !== '' && fieldData.lovType === 'BatchTo')
            ) {
                this.tempArray['batchNumber'] =
                    this.batchToValue === ''
                        ? this.batchFromValue + '-' + this.batchFromValue
                        : this.batchFromValue + '-' + this.batchToValue;
            }

            if (
                (this.serialFromValue !== '' &&
                    fieldData.lovType === 'SerialFrom') ||
                (this.serialToValue !== '' && fieldData.lovType === 'SerialTo')
            ) {
                this.tempArray['serialNumber'] =
                    this.serialToValue === ''
                        ? this.serialFromValue
                        : this.serialFromValue + '-' + this.serialToValue;
            }

            if (
                (this.dateFrom !== '' &&
                    this.dateFormat(this.dateFrom) !== '' &&
                    fieldData.lovType === 'fromDate') ||
                (this.dateTo !== '' &&
                    this.dateFormat(this.dateTo) !== '' &&
                    fieldData.lovType === 'toDate')
            ) {
                this.tempArray['txnDate'] =
                    this.dateTo === ''
                        ? this.dateFormat(this.dateFrom)
                        : this.dateFormat(this.dateFrom) +
                          '>' +
                          this.dateFormat(this.dateTo);
            }

            //}
        }
        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick: true
        };
        this.commonService.getsearhForMasters(this.finalArray);
        if (
            this.finalArray.searchArray.txnType === undefined ||
            this.finalArray.searchArray.txnType === ''
        ) {
            this.txnTypeError = '';
        } else {
            this.txnTypeError = null;
        }
        console.log(this.finalArray);
    }

    getSearchLOVData(searchType: string) {
        if (searchType !== '') {
            this.commonService.getLookupLOV('TXN_TYPE_CODE').subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        if (result.result) {
                            const data = result.result;
                            for (const listElement of this.searchFieldData) {
                                if (listElement.lovType === 'txn-Type') {
                                    for (const lovItem of data) {
                                        listElement.list.push({
                                            label: lovItem.lookupValueDesc,
                                            value: String(lovItem.lookupValue),
                                            parentValue : lovItem.parentValue
                                        });
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

            this.transactionService.getTransactionSource().subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        if (result.result) {
                            const data = result.result;
                            for (const listElement of this.searchFieldData) {
                                if (listElement.lovType === 'txn-Source') {
                                    for (const lovItem of data) {
                                        listElement.list.push({
                                            label: lovItem.txnSource,
                                            value: String(lovItem.txnSourceType)
                                        });
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

            this.transactionService.getTransactionIU().subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        if (result.result) {
                            const data = result.result;
                            for (const listElement of this.searchFieldData) {
                                if (listElement.lovType === 'txn-IU') {
                                    for (const lovItem of data) {
                                        listElement.list.push({
                                            label: lovItem.txnIuCode,
                                            value: String(lovItem.txnIuId)
                                        });
                                    }
                                }
                                if (listElement.lovType === 'txn-ToIU') {
                                    for (const lovItem of data) {
                                        listElement.list.push({
                                            label: lovItem.txnIuCode,
                                            value: String(lovItem.txnIuId)
                                        });
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

            // this.commonService.getSearchLOV(searchType).subscribe(
            //   (result: any) => {
            //     if (result.status === 200) {
            //       if (result.result) {
            //         const data = result.result;
            //         console.log('Final list---');
            //
            //         for (const listElement of this.searchFieldData) {
            //
            //           for (const lovItem of data) {

            //             //listElement.value = lovItem.txnId;

            //             // for Transaction Type
            //             if (listElement.lovType === 'txn-Type') {
            //               if (!this.txnType.includes(lovItem.txnType)) {
            //                 this.txnType.push(lovItem.txnType);
            //                 listElement.list.push({
            //                   label: lovItem.txnType,
            //                   value: String(lovItem.txnType)
            //                 });
            //               } else { }
            //             }

            //             // for Transaction Source
            //             if (listElement.lovType === 'txn-Source') {
            //               if (!this.txnSource.includes(lovItem.txnSourceType)) {
            //                 this.txnSource.push(lovItem.txnSourceType);
            //                 listElement.list.push({
            //                   label: lovItem.txnSourceType,
            //                   value: String(lovItem.txnSourceType)
            //                 });
            //               } else { }
            //             }

            //             // for Transaction Number
            //             if (listElement.lovType === 'txn-Number') {
            //               if (!this.txnNumber.includes(lovItem.transactionId)) {
            //                 this.txnNumber.push(lovItem.transactionId);
            //                 listElement.list.push({
            //                   label: lovItem.transactionNumber,
            //                   value: String(lovItem.transactionId)
            //                 });
            //               } else { }
            //             }

            //             // for Item
            //             if (listElement.lovType === 'txn-item') {
            //               if (!this.txnItem.includes(lovItem.itemId)) {
            //                 this.txnItem.push(lovItem.itemId);
            //                 listElement.list.push({
            //                   label: lovItem.itemName,
            //                   value: String(lovItem.itemId)
            //                 });
            //               } else { }
            //             }

            //             // for IU
            //             if (listElement.lovType === 'txn-IU') {
            //               if (!this.txnIU.includes(lovItem.txnIuId)) {
            //                 this.txnIU.push(lovItem.txnIuId);
            //                 listElement.list.push({
            //                   label: lovItem.txnIuCode,
            //                   value: String(lovItem.txnIuId)
            //                 });
            //               } else { }
            //             }

            //             // for To IU
            //             if (listElement.lovType === 'txn-ToIU') {
            //               if (!this.txnToIU.includes(lovItem.txnIuId)) {
            //                 this.txnToIU.push(lovItem.txnIuId);
            //                 listElement.list.push({
            //                   label: lovItem.txnIuCode,
            //                   value: String(lovItem.txnIuId)
            //                 });
            //               } else { }
            //             }

            //             // for LG
            //             if (listElement.lovType === 'txn-LG') {
            //               if (!this.txnLG.includes(lovItem.lgId)) {
            //                 this.txnLG.push(lovItem.lgId);
            //                 listElement.list.push({
            //                   label: lovItem.lgCode,
            //                   value: String(lovItem.lgId)
            //                 });
            //               } else { }
            //             }

            //             // for Locator
            //             if (listElement.lovType === 'txn-Locator') {
            //               if (!this.txnLocator.includes(lovItem.txnLocatorId)) {
            //                 this.txnLocator.push(lovItem.txnLocatorId);
            //                 listElement.list.push({
            //                   label: lovItem.txnLocCode,
            //                   value: String(lovItem.txnLocatorId)
            //                 });
            //               } else { }
            //             }

            //             // for LPN From
            //             if (listElement.lovType === 'LPNFrom') {
            //               if (!this.LPNFromArray.includes(lovItem.lpnNumber) && lovItem.lpnNumber !== null) {
            //                   this.LPNFromArray.push(lovItem.lpnNumber);
            //                   listElement.list.push({
            //                       label: lovItem.lpnNumber,
            //                       value: String(lovItem.lpnNumber)
            //                   });
            //               } else { }
            //             }

            //             // for LPN To
            //             if (listElement.lovType === 'LPNTo') {
            //                 if (!this.LPNToArray.includes(lovItem.lpnNumber) && lovItem.lpnNumber !== null) {
            //                     this.LPNToArray.push(lovItem.lpnNumber);
            //                     listElement.list.push({
            //                         label: lovItem.lpnNumber,
            //                         value: String(lovItem.lpnNumber)
            //                     });
            //                 } else { }
            //             }

            //             // for Batch From
            //             if (listElement.lovType === 'BatchFrom') {
            //                 if (!this.batchFromArray.includes(lovItem.batchNumber) && lovItem.batchNumber !== null) {
            //                     this.batchFromArray.push(lovItem.batchNumber);
            //                     listElement.list.push({
            //                         label: lovItem.batchNumber,
            //                         value: String(lovItem.batchNumber)
            //                     });
            //                 } else { }
            //             }

            //             // for Batch To
            //             if (listElement.lovType === 'BatchTo') {
            //                 if (!this.batchToArray.includes(lovItem.batchNumber) && lovItem.batchNumber !== null) {
            //                     this.batchToArray.push(lovItem.batchNumber);
            //                     listElement.list.push({
            //                         label: lovItem.batchNumber,
            //                         value: String(lovItem.batchNumber)
            //                     });
            //                 } else { }

            //             }

            //             // for Serial From
            //             if (listElement.lovType === 'SerialFrom') {
            //                 if (!this.serialFromArray.includes(lovItem.serialNumber) && lovItem.serialNumber !== null) {
            //                     this.serialFromArray.push(lovItem.serialNumber);
            //                     listElement.list.push({
            //                         label: lovItem.serialNumber,
            //                         value: String(lovItem.serialNumber)
            //                     });
            //                 } else { }
            //             }

            //             // for Serial To
            //             if (listElement.lovType === 'SerialTo') {
            //                 if (!this.serialToArray.includes(lovItem.serialId) && lovItem.serialNumber !== null) {
            //                     this.serialToArray.push(lovItem.serialNumber);
            //                     listElement.list.push({
            //                         label: lovItem.serialNumber,
            //                         value: String(lovItem.serialNumber)
            //                     });
            //                 } else { }
            //             }

            //             listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)

            //           }

            //         }

            //         console.log(this.searchFieldData);
            //       }
            //     }
            //   },
            //   (error: any) => {
            //     console.log(error.error.message);
            //   }
            // );

            // this.txnToIUValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
            this.txnToIUValue = String(
                JSON.parse(localStorage.getItem('defaultIU')).id
            );
            this.txnIUValue = String(
                JSON.parse(localStorage.getItem('defaultIU')).id
            );
        }
    }

    clearSearchFields() {
        this.txnTypeValue = '';
        this.txnSourceValue = '';
        this.txnNumberValue = '';
        this.txnItemValue = '';
        // this.txnIUValue = '';
        // this.txnToIUValue         = '';
        this.txnLGValue = '';
        this.txnLocatorValue = '';
        this.txnToLocatorValue = '';
        this.LPNFromValue = '';
        this.transLPNValue = '';
        this.LPNToValue = '';
        this.batchFromValue = '';
        this.batchToValue = '';
        this.serialFromValue = '';
        this.serialToValue = '';
        this.dateFrom = '';
        this.dateTo = '';
        this.lgFromValue = '';
        this.txnReceiptNumValue = '';
        if(this.iuDisabled == 'To'){
        this.txnIUValue = '';
        }
        if(this.iuDisabled == 'From'){
        this.txnToIUValue = '';
        }
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }

    getDependentList(event, fieldValue, lovTypeFrom, lovTypeTO) {
        let tempArray = [];
        for (const listElement of this.searchFieldData) {
            if (listElement.lovType === lovTypeFrom) {
                tempArray = listElement.list;
            }
            if (listElement.lovType === lovTypeTO) {
                listElement.list = [];

                let valueArray = [];
                for (const item of tempArray) {
                    if (item.value.toLowerCase() !== '') {
                        valueArray.push(item.value.toLowerCase());
                    }
                }

                valueArray = this.sort(valueArray);

                for (const [i, key] of valueArray.entries()) {
                    if (key.toLowerCase() === fieldValue.toLowerCase()) {
                        valueArray = valueArray.splice(i, valueArray.length);
                        break;
                    }
                }

                valueArray = this.sort(valueArray);
                let newTempArray = [];
                for (const item of valueArray) {
                    for (const [i, key] of tempArray.entries()) {
                        if (item.toLowerCase() === key.value.toLowerCase()) {
                            newTempArray.push(key);
                        }
                    }
                }

                for (const item of newTempArray) {
                    listElement.enable = false;
                    listElement.list.push(item);
                }

                if (fieldValue === '') {
                    listElement.list = tempArray;
                    listElement.enable = true;
                }
            }

            if (lovTypeTO === 'LPNTo') {
                this.LPNToValue = fieldValue;
            }
            if (lovTypeTO === 'BatchTo') {
                this.batchToValue = fieldValue;
            }
            if (lovTypeTO === 'SerialTo') {
                this.serialToValue = fieldValue;
            }
            listElement.list = listElement.list.sort((a, b) =>
                a.label ? a.label.localeCompare(b.label) : a.label
            );
        }
        console.log(this.searchFieldData);
    }

    // parseItem (item) {
    //   const [, stringPart = '', numberPart = 0] = /(^[a-zA-Z]*)(\d*)$/.exec(item) || [];
    //   return [stringPart, numberPart];
    // }

    // sort (array) {
    //   return array.sort((a, b) => {
    //     let [stringA, numberA] : any = this.parseItem(a);
    //     let [stringB, numberB] : any = this.parseItem(b);
    //     let comparison : any = stringA.localeCompare(stringB);
    //     return comparison === 0 ? Number(numberA) - Number(numberB) : comparison;
    //   });
    // }

    sort(array) {
        return array.sort((a, b) => {
            // convert to strings and force lowercase
            a = typeof a === 'string' ? a.toLowerCase() : a.toString();
            b = typeof b === 'string' ? b.toLowerCase() : b.toString();
            return a.localeCompare(b);
        });
    }

    ngOnDestroy() {
       this.timer ? this.timer.unsubscribe() : '';
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe
            ? this.searchdataArrayUnsubscribe.unsubscribe()
            : '';
        this.defaultIUUnsubscribe
            ? this.defaultIUUnsubscribe.unsubscribe()
            : '';
    }
}
