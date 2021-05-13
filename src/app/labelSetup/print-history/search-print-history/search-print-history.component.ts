import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { PrintHistoryService } from 'src/app/_services/labelSetup/print-history.service';

@Component({
    selector: 'app-search-print-history',
    templateUrl: './search-print-history.component.html',
    styleUrls: ['./search-print-history.component.css']
})
export class SearchPrintHistoryComponent implements OnInit {
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

    // ngModel values defines--
    userValue: string;
    userArray: any = [];

    labelValue: string;

    printerValue: string;
    printerArray: any = [];

    statusValue: string;
    statusArray: any = [];

    dateFrom: string;
    dateTo: string;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(
        public commonService: CommonService,
        private printHistoryService: PrintHistoryService
    ) {}

    ngOnInit() {
        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe(
            (data: any) => {
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
                }
    
                if( this.searchDataType !== '' && this.searchDataType !== undefined && 
                    data.lovSearchFromAdd_update === true ){
                    data.lovSearchFromAdd_update = false;
                    this.commonService.searhForMasters(data);
                    this.getSearchLOVData(this.searchDataType);
                }
            }
        );
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

            if (this.userValue !== '' && fieldData.lovType === 'user') {
                this.tempArray[fieldData.key] = this.userValue;
            }

            if (this.labelValue !== '' && fieldData.lovType === 'label') {
                this.tempArray[fieldData.key] = this.labelValue;
            }

            if (this.printerValue !== '' && fieldData.lovType === 'printer') {
                this.tempArray[fieldData.key] = this.printerValue;
            }

            if (this.statusValue !== '' && fieldData.lovType === 'status') {
                this.tempArray[fieldData.key] = this.statusValue;
            }

            if (
                this.dateFrom !== '' &&
                this.dateFormat(this.dateFrom) !== '' &&
                fieldData.lovType === 'plannedShipDateFrom'
            ) {
                this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
            }

            if (
                this.dateTo !== '' &&
                this.dateFormat(this.dateTo) !== '' &&
                fieldData.lovType === 'plannedShipDateTo'
            ) {
                this.tempArray[fieldData.key] = this.dateFormat(this.dateTo);
            }

            // }
        }

         ;
        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick: true
        };
        this.commonService.getsearhForMasters(this.finalArray); 
    }

    clearSearchFields() {
        this.userValue = '';
        this.userArray = [];

        this.labelValue = '';

        this.printerValue = '';
        this.printerArray = [];

        this.statusValue = '';
        this.statusArray = [];

        this.dateFrom = '';
        this.dateTo = '';

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

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }

    getSearchLOVData(searchType: string) {
        if (searchType !== '') {
            // this.commonService.getSearchLOV(searchType).subscribe(
            //   (result: any) => {
            //     if (result.status === 200) {

            //       if (result.result) {
            //         const data = result.result;
            //         console.log('Final list---');
            //         for (const listElement of this.searchFieldData) {

            //           for (const lovItem of data) {
            //             listElement.value = lovItem.id;

            //             // for ASN Number values
            //             if (listElement.lovType === 'user') {
            //               if (!this.userArray.includes(lovItem.soId)) {
            //                 this.userArray.push(lovItem.soId);
            //                 listElement.list.push({
            //                   label: lovItem.user,
            //                   value: String(lovItem.soId)
            //                 });
            //               } else { }
            //             }

            //             // for OU code
            //             if (listElement.lovType === 'printer') {
            //               if (!this.printerArray.includes(lovItem.iuId)) {
            //                 this.printerArray.push(lovItem.iuId);
            //                 listElement.list.push({
            //                   label: lovItem.printer,
            //                   value: String(lovItem.iuId)
            //                 });
            //               } else { }
            //             }

            //             // for status
            //             if (listElement.lovType === 'status') {
            //               if (!this.userArray.includes(lovItem.statusCode)) {
            //                 this.userArray.push(lovItem.statusCode);
            //                 listElement.list.push({
            //                   label: lovItem.statusName,
            //                   value: lovItem.statusCode
            //                 });
            //               } else { }
            //             }

            //           }
            //           listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
            //         }
            //         console.log(this.searchFieldData);
            //       }
            //     }
            //   },
            //   (error: any) => {
            //     console.log(error.error.message);
            //   }
            // );
            // this.commonService.getIULOV().subscribe(
            //     (result: any) => {
            //         if (result.status === 200) {
            //             if (result.result) {
            //                 const data = result.result;
            //                 console.log('Final list---');
            //                 for (const listElement of this.searchFieldData) {
            //                     if (listElement.lovType === 'printer') {
            //                         for (const lovItem of data) {
            //                             if (lovItem.iuEnabledFlag === 'Y') {
            //                                 listElement.list.push({
            //                                     label: lovItem.printerName,
            //                                     value: String(
            //                                         lovItem.printerName
            //                                     )
            //                                 });
            //                             }
            //                         }
            //                         listElement.list = listElement.list.sort(
            //                             (a, b) =>
            //                                 a.label
            //                                     ? a.label.localeCompare(b.label)
            //                                     : a.label
            //                         );
            //                     }
            //                 }
            //                 console.log(this.searchFieldData);
            //             }
            //         }
            //     },
            //     (error: any) => {
            //         console.log(error.error.message);
            //     }
            // );

            this.printHistoryService.getPrintHistoryList().subscribe(
                (result: any) => {
                    if (result) {
                        // if (result.result) {
                            const data = result; 
                            for (const listElement of this.searchFieldData) {
                                if (listElement.lovType === 'label') {
                                   
                                    for (const lovItem of data) {
                                        // if (lovItem.iuEnabledFlag === 'Y') {
                                          if (
                                              !this.printerArray.includes(
                                                  lovItem.labelName
                                              )
                                          ) {
                                              this.printerArray.push(
                                                  lovItem.labelName
                                              );
                                              listElement.list.push({
                                                  label: lovItem.labelName,
                                                  value: String(
                                                      lovItem.labelName
                                                  )
                                              });
                                          }
                                    }
                                    // listElement.list = listElement.list.sort(
                                    //     (a, b) =>
                                    //         a.label
                                    //             ? a.label.localeCompare(b.label)
                                    //             : a.label
                                    // );
                                }
                                 if (listElement.lovType === 'printer') {
                                     for (const lovItem of data) {
                                        //  if (lovItem.iuEnabledFlag === 'Y') {
                                          if (
                                              !this.printerArray.includes(
                                                  lovItem.printerName
                                              )
                                          ) {
                                              this.printerArray.push(
                                                  lovItem.printerName
                                              );
                                              listElement.list.push({
                                                  label: lovItem.printerName,
                                                  value: String(
                                                      lovItem.printerName
                                                  )
                                              });
                                          }
                                     }
                                 }
                                     listElement.list = listElement.list.sort(
                                         (a, b) =>
                                             a.label
                                                 ? a.label.localeCompare(
                                                       b.label
                                                   )
                                                 : a.label
                                     );
                            } 
                        // }
                    }
                },
                (error: any) => {
                    console.log(error.error.message);
                }
            );
        }
    }

    ngOnDestroy() {
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe
            ? this.searchdataArrayUnsubscribe.unsubscribe()
            : '';
    }
}
