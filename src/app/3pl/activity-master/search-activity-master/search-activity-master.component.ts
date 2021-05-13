import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-search-activity-master',
  templateUrl: './search-activity-master.component.html',
  styleUrls: ['./search-activity-master.component.css']
})
export class SearchActivityMasterComponent implements OnInit {

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
  iuCodeList = []

  activityName: any = '';
  activityCode: any = '';
  enableValue: any = '';

  // ngModel values defines--
  transactionType: string;
  subActivities: string;
  transactionTypeList: any[] = [];
  subActivitiesList: any[] = [];

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,private snackBar: MatSnackBar) { }

  ngOnInit() {
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
      }

      if( this.searchDataType !== '' && this.searchDataType !== undefined && 
          data.lovSearchFromAdd_update === true ){
          data.lovSearchFromAdd_update = false;
          this.commonService.searhForMasters(data);
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

        if (this.transactionType !== '' && fieldData.lovType === 'transactionType') {
          this.tempArray[fieldData.key] = this.transactionType;
        }

        if (this.subActivities !== '' && fieldData.lovType === 'subActivities') {
          this.tempArray[fieldData.key] = this.subActivities;
        }

        if (this.activityName !== '' && fieldData.lovType === 'activityName') {
          this.tempArray[fieldData.key] = this.activityName;
        }

        if (this.activityCode !== '' && fieldData.lovType === 'activityCode') {
          this.tempArray[fieldData.key] = this.activityCode;
        }

        if ( this.enableValue !== '' && fieldData.lovType === 'enableFlag') {
          this.tempArray[fieldData.key] = this.enableValue;
        }

      }
   
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(this.finalArray);
  }

  clearSearchFields() {
    this.transactionType = '';
    this.subActivities   = '';
    this.activityName    = '';
    this.activityCode    = '';
    this.enableValue     = '';
    // this.transactionTypeList = [];
    this.subActivitiesList = [];
 
   
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
      this.commonService.getLookupLOV('3PL_TRANSACTION_TYPE').subscribe(
        (data: any) => {
          this.transactionTypeList = [{
            label: ' Please Select',
            value: ''
          }];
          if (data.status === 200) {
            if (data.result && data.result.length) {
              for (const listElement of this.searchFieldData) {

                for (const lovItem of data.result) {
                  if (listElement.lovType === 'transactionType') {
                    if (!this.transactionTypeList.includes(lovItem.lookupValue)) {
                      this.transactionTypeList.push({
                        label: lovItem.lookupValueDesc,
                        value: String(lovItem.lookupValue)
                      });
                      // listElement.list.push({
                      //   label: lovItem.lookupValueDesc,
                      //   value: String(lovItem.lookupValue)
                      // });
                    } else { }
                  }

                  if (listElement.lovType !== 'enableFlag' ) {
                    listElement.list = [
                        {
                            label: ' Please Select',
                            value: ''
                        }
                    ];
                    
                }
                }
              
                listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
            
              }
            }
          }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
      
    }
  }

  transactionTypeListChanged(event: any, value){
    if (event.source.selected && event.isUserInput === true) {
      setTimeout(() => {
        this.getSubActivities(value)
      }, 500);
    }
  }

  getSubActivities(value) {
    if(value === ''){
      return
    }
    this.subActivitiesList = [];
    this.commonService.getLookupByLookupName('3PL_SUBACTIVITY', value).subscribe(
      (data: any) => {
        this.subActivitiesList = [{
          label: ' Please Select',
          value: ''
        }];
        if (data.status === 200) {
          if (data.result  && data.result.length) {
            for (const listElement of this.searchFieldData) {

              for (const lovItem of data.result) {
                // listElement.value = lovItem.lookupValue;

                if (listElement.lovType === 'subActivities') {
                  if (!this.subActivitiesList.includes(lovItem.lookupValue)) {
                    this.subActivitiesList.push({
                      label: lovItem.lookupValueDesc,
                      value: String(lovItem.lookupValue)
                    });
                    // listElement.list.push({
                    //   label: lovItem.lookupValueDesc,
                    //   value: String(lovItem.lookupValue)
                    // });
                  } else { }
                }



              }
              listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
            }
          }
        }
      },
      error => {
        this.openSnackBar(error, '','default-snackbar');
      })
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
