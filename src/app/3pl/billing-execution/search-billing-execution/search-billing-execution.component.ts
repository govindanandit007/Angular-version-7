import { DatePipe } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ContractsService } from 'src/app/_services/3pl/contracts.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-search-billing-execution',
  templateUrl: './search-billing-execution.component.html',
  styleUrls: ['./search-billing-execution.component.css']
})
export class SearchBillingExecutionComponent implements OnInit {

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

  requestNumber: any = '';
  statusCode: any = '';
  activityName: any = '';
  itemName: any = '';
  contractId: string;
  contractList: any[] = [ {label: 'Please Select', value: ''} ];
  dateFrom: string;
  dateTo: string;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,private snackBar: MatSnackBar,
  public contractService: ContractsService) { }

  ngOnInit() {
    this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
      this.clearSearchFields();
      if (data.searchArray) {
         
        this.searchFieldData = [];
        this.searchType = data.searchType;
        this.searchDataType = 'JOB_STATUS';
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
    });
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

        if (this.requestNumber !== '' && fieldData.lovType === 'requestNumber') {
          this.tempArray[fieldData.key] = this.requestNumber;
        }

        if (this.statusCode !== '' && fieldData.lovType === 'status') {
          this.tempArray[fieldData.key] = this.statusCode;
        }

        if ( this.dateFrom !== '' && fieldData.lovType === 'fromDate') {
          this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
        }

        if ( this.dateTo !== '' && fieldData.lovType === 'toDate') {
          this.tempArray[fieldData.key] = this.dateFormat(this.dateTo);
        }

        // if (
        //     (this.dateFrom !== '' &&
        //         this.dateFormat(this.dateFrom) !== '' &&
        //         fieldData.lovType === 'fromDate') ||
        //     (this.dateTo !== '' &&
        //         this.dateFormat(this.dateTo) !== '' &&
        //         fieldData.lovType === 'toDate')
        // ) {
        //     this.tempArray['txnDate'] =
        //         this.dateTo === ''
        //             ? this.dateFormat(this.dateFrom)
        //             : this.dateFormat(this.dateFrom) +
        //               '>' +
        //               this.dateFormat(this.dateTo);
        // }

      }
   
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(this.finalArray);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
}

  clearSearchFields() {
    this.contractId = '';
    this.requestNumber = '';
    this.statusCode = '';
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

  getSearchLOVData(searchType: string) {
    if (searchType !== '') {

      this.commonService
        .getLookupLOV(searchType)
        .subscribe((data: any) => {
          if (data.status === 200) {
            if (data.result && data.result.length){
              for(const listElement of this.searchFieldData){
                for(const lovItem of data.result){
                  if(listElement.lovType === 'status'){
                    this.contractList.push({
                      label: lovItem.lookupValueDesc,
                      value: lovItem.lookupValue
                    });
                  }
                }
                listElement.list = listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
              }
            }
          }
        },(error: any) => { 
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        });
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: [typeClass]
    });
  }

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
