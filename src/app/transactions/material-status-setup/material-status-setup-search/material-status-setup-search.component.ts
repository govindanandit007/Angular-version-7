import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { MaterialStatusService } from 'src/app/_services/transactions/material-status.service';

@Component({
  selector: 'app-material-status-setup-search',
  templateUrl: './material-status-setup-search.component.html',
  styleUrls: ['./material-status-setup-search.component.css']
})
export class MaterialStatusSetupSearchComponent implements OnInit, OnDestroy{
searchFieldData = [];
  searchType = '';
  searchLabel = '';
  public hideSearch = false;
  tempArray: any = {};
  finalArray: any = {};
  companyKey = '';
  searchDataType = '';
  searchdataArrayUnsubscribe: any = '';

  // ngModel values defines--
  nameValue: string;
  nameArray: any = [];
  enableFlagValue: string;


  txnTypeError:any = null;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,public materialStatusService: MaterialStatusService,) { }

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
        // this.getSearchLOVData(this.searchDataType);
      }

      if( this.searchDataType !== '' && this.searchDataType !== undefined && 
          data.lovSearchFromAdd_update === true ){
          data.lovSearchFromAdd_update = false;
          this.commonService.searhForMasters(data);
          // this.getSearchLOVData(this.searchDataType);
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
      // if (fieldData.value) {

        if (this.nameValue !== '' && fieldData.lovType === 'materialStatusName') {
          this.tempArray[fieldData.key] = this.nameValue;
        }

        if (this.enableFlagValue !== '' && fieldData.lovType === 'enableFlag') {
          this.tempArray[fieldData.key] = this.enableFlagValue;
        }
    }
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(this.finalArray);
    console.log(this.finalArray);
  }

  clearSearchFields() {
    this.nameValue = '';
    this.nameArray = [];

    this.enableFlagValue = '';
 
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

  // getSearchLOVData(searchType: string) {
  //   if (searchType !== '') {

  //        this.commonService.getSearchLOV('IU').subscribe(
  //                   (result: any) => {

  //                      for (const listElement of this.searchFieldData) {
  //                        if(listElement.lovType === 'materialStatusName'){
  //                       listElement.list = [{
  //                           label: ' Please Select',
  //                           value: ''
  //                       }];
  //                       if (result.status === 200) {
  //                           if (result.result) {
  //                               const data = result.result;
  //                               for (const lovItem of data) {
  //                                   listElement.list.push({
  //                                   label: lovItem.code,
  //                                   value: String(lovItem.id),
  //                               });
  //                           }
  //                           }
  //                       }
  //                        }
  //                      }
  //               })
  //   }
  // }

  getDependentList(event, fieldValue, lovType) {
    for (const listElement of this.searchFieldData) {
      if (listElement.lovType === lovType) {
        const tempArray = listElement.list;
        listElement.list = [{
          label: ' Please Select',
          value: ''
        }];
        for (const item of tempArray) {
          if (Number(item.value) >= Number(fieldValue)) {
            listElement.enable = false;
            listElement.list.push(item);
          }

        }
        if (fieldValue === '') {
          listElement.list = tempArray;
          listElement.enable = true;
        }
      }
      listElement.list  =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
    }
    
    console.log(this.searchFieldData);
  }

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }


}

