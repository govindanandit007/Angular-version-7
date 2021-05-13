import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-search-contracts',
  templateUrl: './search-contracts.component.html',
  styleUrls: ['./search-contracts.component.css']
})
export class SearchContractsComponent implements OnInit {

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

  customernumber: any = '';
  customernumberArray: any = [];

  customername: any = '';
  customerArray: any = [];

  code: any = '';
  codeArray: any = [];

  enableValue:any = '';

  dateFrom: string;
  dateTo: string;
 

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService) { }

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

        if (this.customername !== '' && fieldData.lovType === 'customername') {
          this.tempArray[fieldData.key] = this.customername;
        }

        if (this.code !== '' && fieldData.lovType === 'code') {
          this.tempArray[fieldData.key] = this.code;
        }

        if ( this.enableValue !== '' && fieldData.lovType === 'enableFlag') {
          this.tempArray[fieldData.key] = this.enableValue;
        }

        if ( this.enableValue !== '' && fieldData.lovType === 'enableFlag') {
          this.tempArray[fieldData.key] = this.enableValue;
        }

        if ( this.dateFrom !== '' && fieldData.lovType === 'fromDate') {
          this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
        }
        if ( this.dateTo !== '' && fieldData.lovType === 'toDate') {
          this.tempArray[fieldData.key] = this.dateFormat(this.dateTo);
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

  dateFormat(dateData: any) {
    if(dateData === undefined){
      return;
    }
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

  clearSearchFields() {
    

    this.customername = '';
    this.customerArray = [];
    this.code = '';
    this.codeArray = [];
    this.enableValue = ''
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
      this.commonService.getSearchLOV(searchType).subscribe(
        (result: any) => {
          if (result.status === 200) {
             
            if (result.result) {
              const data = result.result; 
              for (const listElement of this.searchFieldData) {

                for (const lovItem of data) {
                  listElement.value = lovItem.id;

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
        }
      );
    }
  }

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
  }

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
