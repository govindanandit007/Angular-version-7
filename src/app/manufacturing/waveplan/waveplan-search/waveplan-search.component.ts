import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { WaveService } from 'src/app/_services/transactions/wave.service';
import {ActivatedRoute,Router,NavigationEnd} from '@angular/router';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';

@Component({
  selector: 'app-waveplan-search',
  templateUrl: './waveplan-search.component.html',
  styleUrls: ['./waveplan-search.component.css']
})
export class WaveplanSearchComponent implements OnInit, OnDestroy {
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
    waveNumberValue: string;
    waveNumberArray: any = [];
  
    IuValue: string;
    iuCodeArray: any = [];
  
    waveStatusValue: string;
    waveStatusArray: any = [];
  
     

    assemblyNoValue: string;
    assemblyNoArray: any = [];
  
    workOrderNumberValue: string;
    workOrderNumberArray: any = [];
  
    policyValue: string;
    policyArray: any = [];
  
    customerList: any = [];
    woNumberList: any = [];
    allWoNumberList: any = [];
  
    screenName = '';
    currentRoute: string;
    allCustomerArrayList: any = [];
  
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(public commonService: CommonService, private woService: WorkOrderService,private router: Router) { }
  
    ngOnInit() {
      this.currentRoute = this.router.url.split('/')[1];
      if(this.currentRoute === 'wavemfg'){
        this.screenName = 'MFG';
      }

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
  
  
        if (this.searchDataType !== '' && this.searchDataType !== undefined &&
          data.lovSearchFromAdd_update === true) {
          data.lovSearchFromAdd_update = false;
          this.commonService.searhForMasters(data);
          this.getSearchLOVData(this.searchDataType);
        }
  
      });
    }
  
    hideSearchContainer() {
      this.commonService.searhForMasters({});
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
  
        if (this.waveNumberValue !== '' && fieldData.lovType === 'waveNumber') {
          this.tempArray[fieldData.key] = this.waveNumberValue;
        }
  
        if (fieldData.lovType === 'IuCode') {
          this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }
        if (this.assemblyNoValue !== '' && fieldData.lovType === 'assemblyItem') {
          this.tempArray[fieldData.key] = this.assemblyNoValue;
        }
  
        if (this.waveStatusValue !== '' && fieldData.lovType === 'waveStatus') {
          this.tempArray[fieldData.key] = this.waveStatusValue;
        }
  
        if (this.workOrderNumberValue !== '' && fieldData.lovType === 'workOrderNumber') {
          this.tempArray[fieldData.key] = this.workOrderNumberValue;
        }
  
        if (this.policyValue !== '' && fieldData.lovType === 'wavePolicy') {
          this.tempArray[fieldData.key] = this.policyValue;
        }
  
        // }
      }
      this.finalArray = {
        searchType: this.searchType,
        searchArray: this.tempArray,
        fromSearchBtnClick: true
      };
      this.commonService.getsearhForMasters(this.finalArray); 
    }
  iuchanged(event: any, value){
      
      if (event.source.selected === true && event.isUserInput === true) { 

      }
    }
  customerChanged(event: any, value){
      
      if (event.source.selected === true && event.isUserInput === true) { 
        if(value !== ''){
          // this.woNumberList = [];
           this.woNumberList = [{
            label: ' Please Select',
            value: ''
          }];
              for (const data of this.allWoNumberList) {
                  if(data.customerId === value){
                    this.woNumberList.push({
                      label: data.label,
                      value: data.value,
                });
                  }
              }
  
        }else{
          this.woNumberList = this.allWoNumberList;
        }
      }
    }
    clearSearchFields() {
      this.waveNumberValue = '';
      this.waveNumberArray = [];
  
      // this.IuValue = '';
      //this.iuCodeArray = [];
  
      this.waveStatusValue = '';
      this.waveStatusArray = [];
  
       this.assemblyNoValue = '';
       this.assemblyNoArray = [];
  
      // this.soNumberValue = '';
      // this.soNumberArray = [];
  
      // this.shipmentNumberValue = '';
      // this.shipmentNumberArray = [];
  
      // this.customerValue = '';
      // this.customerArray = [];
  
      this.workOrderNumberValue = '';
      this.workOrderNumberArray = [];
  
      this.policyValue = '';
      this.policyArray = [];
  
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
        this.woService.getSearchLOV(searchType).subscribe(
          (result: any) => {
            if (result.status === 200) {
  
              if (result.result) {
                const data = result.result; 
                for (const listElement of this.searchFieldData) {
  
                  for (const lovItem of data) {
                    listElement.value = lovItem.id;
  
                    // for Wave Number values
                    if (listElement.lovType === 'waveNumber') {
                      if (!this.waveNumberArray.includes(lovItem.asnId)) {
                        this.waveNumberArray.push(lovItem.asnId);
                        listElement.list.push({
                          label: lovItem.asnNumber,
                          value: String(lovItem.asnId)
                        });
                      } else { }
                    }
  
                    // for IU code
                    if (listElement.lovType === 'IuCode') {
                      if (!this.iuCodeArray.includes(lovItem.iuId)) {
                        this.iuCodeArray.push(lovItem.iuId);
                        listElement.list.push({
                          label: lovItem.iuCode,
                          value: String(lovItem.iuId)
                        });
                      } else { }
                    }
  
                    // for Wave Status values
                    if (listElement.lovType === 'waveStatus') {
                      if (!this.waveStatusArray.includes(lovItem.status)) {
                        this.waveStatusArray.push(lovItem.status);
                        listElement.list.push({
                          label: lovItem.statusDescription,
                          value: String(lovItem.status)
                        });
                      } else { }
                    }
                    if (listElement.lovType === 'workOrderNumber') {
                    if (!this.workOrderNumberArray.includes(lovItem.woNumber)) {
                      this.workOrderNumberArray.push(lovItem.woNumber);
                      this.woNumberList.push({
                        label: lovItem.woNumber,
                        value: lovItem.woNumber,
                      });
                       
                    }
                  }
                   // for Work Order assemblyItem
                  if (listElement.lovType === 'assemblyItem') {
                    if (!this.assemblyNoArray.includes(lovItem.assemblyItemId) && lovItem.assemblyItemId) {
                      this.assemblyNoArray.push(lovItem.assemblyItemId);
                      listElement.list.push({
                        label: lovItem.assemblyItemName,
                        value: String(lovItem.assemblyItemId)
                      });
                    } else { }
                  }

                    // for Policy
                    if (listElement.lovType === 'wavePolicy'  ) {
                      if (!this.policyArray.includes(lovItem.wavePolicyId) && lovItem.wavePolicyId !== null) {
                        this.policyArray.push(lovItem.wavePolicyId);
                         
                        listElement.list.push({
                          label: lovItem.policyName,
                          value: String(lovItem.wavePolicyId)
                        });
                      } else { }
                    }
  
                    
                  }
                  listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
                } 
              }
            }
          },
          (error: any) => {
            console.log(error.error.message);
          }
        );
      }
    }
      // Get Inventory Unit LOV
    getCustomerLov(iuId) {
      this.customerList = [];
       
      this.woNumberList = [];
      this.allWoNumberList = [];
      this.workOrderNumberArray = [];
      this.allCustomerArrayList = [];
      // this.ouEnabledCodeList = [];
      this.commonService.getIUBasedLOV(iuId).subscribe(
        (result: any) => {
          
          this.woNumberList = [{
            label: ' Please Select',
            value: ''
          }];
          this.allWoNumberList = [{
            label: ' Please Select',
            value: ''
          }];
          if (result.status === 200) {
            if (result.result) {
              const data = result.result;
              for (const lovItem of data) {
             
              if (!this.workOrderNumberArray.includes(lovItem.woNumber)) {
                this.workOrderNumberArray.push(lovItem.woNumber);
                this.woNumberList.push({
                  label: lovItem.woNumber,
                  value: lovItem.woNumber,
                });
                this.allWoNumberList.push({
                  label: lovItem.woNumber,
                  value: lovItem.woNumber,
                  customerId : String(lovItem.customerId)
                });
              }
              }
            // }
            }
          }
        })  
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
        listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
      } 
    }
  
    ngOnDestroy() {
      this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
    }
  
  }
  
  