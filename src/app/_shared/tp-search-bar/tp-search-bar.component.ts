import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-tp-search-bar',
  templateUrl: './tp-search-bar.component.html',
  styleUrls: ['./tp-search-bar.component.css']
})
export class TpSearchBarComponent implements OnInit, OnDestroy {

  searchFieldData = [];
  searchType = '';
  searchLabel = '';
  public hideSearch = false;
  tempArray: any = {};
  finalArray: any = {};
  companyKey = '';
  searchDataType = '';
  seachLOVItem: string;
  searchdataArrayUnsubscribe: any;
 

  // ngModel values defines--
  codeValue: string;
  nameValue: string;
  enableValue: string;
  classValue: string;
  tpCodeValue: string;
  tpNameValue: string;
  activityBillingFlag: string;

  codeArray : any = [{
      label: ' Please Select',
      value: ''
  }];
  nameArray : any = [{
      label: ' Please Select',
      value: ''
  }];
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService) {}

  ngOnInit() {
    this.searchdataArrayUnsubscribe =  this.commonService.searchdataArray.subscribe((data: any) => {
          this.clearSearchFields();
          if (data.searchArray) {
              this.searchFieldData = [];
              this.codeArray = [{
                  label: ' Please Select',
                  value: ''
              }];
              this.nameArray = [{
                  label: ' Please Select',
                  value: ''
              }];
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
                if (fieldData.value) {
                    if ( this.codeValue !== '' &&
                    (fieldData.lovType === 'code' || fieldData.lovType === 'name')
                    ) {
                        if (fieldData.lookupType === 'lookupDes'){
                            for (const fieldlist of fieldData.list){
                                if (fieldlist.value === this.codeValue){
                                    this.tempArray[fieldData.key] = fieldlist.label;
                                }
                            }
                        }else{
                      this.tempArray[fieldData.key] = this.codeValue;
                    }
              }
              if(this.tpCodeValue !=='' && fieldData.lovType === 'tpcode'){
                this.tempArray[fieldData.key] = this.tpCodeValue;
            }
            if(this.tpNameValue !=='' && fieldData.lovType === 'tpname'){
                this.tempArray[fieldData.key] = this.tpNameValue;
            }
            
            if ( this.enableValue !== '' && fieldData.lovType === 'enableFlag' ) {
                this.tempArray[fieldData.key] = this.enableValue;
            }

            if (
                this.activityBillingFlag !== '' &&
                fieldData.lovType === 'activityBillingFlag'
            ) {
                this.tempArray[fieldData.key] = this.activityBillingFlag;
            }
            
            if (fieldData.tpType === 'SUPP') {
                this.tempArray.tpType = 'SUPP';
            }
            if (fieldData.tpType === 'CUST') {
                this.tempArray.tpType = 'CUST';
            }
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
      this.codeValue = '';
      this.nameValue = '';
      this.enableValue = '';
      this.tpCodeValue = '';
      this.tpNameValue = '';
      this.activityBillingFlag = '';
      
      if (String(JSON.parse(localStorage.getItem('userDetails')).userId) === '-1' || this.companyKey === '' ) {
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
                          this.codeArray = [
                              {
                                  label: ' Please Select',
                                  value: ''
                                }
                            ];
                            this.nameArray = [
                                {
                                    label: ' Please Select',
                                    value: ''
                                }
                            ];
                            
                            for (const listElement of this.searchFieldData) {
                                if (listElement.lovType !== 'enableFlag' &&
                                    listElement.lovType !== 'activityBillingFlag') {
                                    listElement.list = [
                                        {
                                            label: ' Please Select',
                                            value: ''
                                      }
                                  ];
                                 
                                }
                                for (const lovItem of data) {
                                    listElement.value = lovItem.id;
                                    if (listElement.lovType === 'code') {
                                        if (
                                            listElement.tpType === 'CUST' ||
                                            listElement.tpType === 'SUPP'
                                            ) {
                                                if (
                                                    lovItem.type ===
                                                    listElement.tpType
                                                    ) {
                                                        listElement.list.push({
                                                            label: lovItem.code,
                                                            value: String(
                                                                listElement.value
                                                                )
                                                            });
                                                        }
                                                        
                                                    } else {
                                                        listElement.list.push({
                                                            label: lovItem.code,
                                                            value: String(listElement.value)
                                                        });
                                                        this.codeArray.push({
                                                            label: lovItem.code,
                                                            value: String(listElement.value),
                                                            lgId : lovItem.lgId,
                                                            iuId : lovItem.iuId
                                                            
                                                        });
                                                    }
                                                }
                                                if (listElement.lovType === 'name') {
                                                    if (
                                                        listElement.tpType === 'CUST' ||
                                                        listElement.tpType === 'SUPP'
                                                        ) {
                                                            if (
                                                                lovItem.type ===
                                                                listElement.tpType
                                                                ) {
                                                                    listElement.list.push({
                                                                        label: lovItem.name,
                                                                        value: String(
                                                                            listElement.value
                                                                            )
                                                                        });
                                                                    }
                                                                } else {
                                                                    listElement.list.push({
                                                                        label: lovItem.name,
                                                                        value: String(listElement.value)
                                                                    });
                                                                    this.nameArray.push({
                                                                        label: lovItem.name,
                                                                        value: String(listElement.value),
                                                                        lgId : lovItem.lgId,
                                                                        iuId : lovItem.iuId
                                                                    });
                                                                }
                                                            }                                  
                                                        }
                                                    } 
                                                } 
                                            }
                                        },
                                        (error: any) => { 
                                        }
          );
        }
    }

    getDependentList(event, fieldValue, typeValue) {
        if (typeValue === 'code' && event.source.selected) {
            this.nameValue = String(fieldValue);
        }
        if (typeValue === 'name' && event.source.selected) {
            this.codeValue = String(fieldValue);
        }
    }
    
}

