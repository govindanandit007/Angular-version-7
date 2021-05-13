import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { WaveService } from 'src/app/_services/transactions/wave.service';
import {ActivatedRoute,Router,NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-wave-search',
  templateUrl: './wave-search.component.html',
  styleUrls: ['./wave-search.component.css']
})

export class WaveSearchComponent implements OnInit, OnDestroy {
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

  taskTypeValue: string;
  taskTypeArray: any = [];

  soNumberValue: string;
  soNumberArray: any = [];

  shipmentNumberValue: string;
  shipmentNumberArray: any = [];

  customerValue: string;
  customerArray: any = [];

  workOrderNumberValue: string;
  workOrderNumberArray: any = [];

  policyValue: string;
  policyArray: any = [];

  customerList: any = [];
  woNumberList: any = [];
  allWoNumberList: any = [];

   
   
  allCustomerArrayList: any = [];

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService, private waveService: WaveService,private router: Router) { }

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

      if (this.waveStatusValue !== '' && fieldData.lovType === 'waveStatus') {
        this.tempArray[fieldData.key] = this.waveStatusValue;
      }

      // if (this.taskTypeValue !== '' && fieldData.lovType === 'waveTaskType') {
      //   this.tempArray[fieldData.key] = this.taskTypeValue;
      // }

      if (this.soNumberValue !== '' && fieldData.lovType === 'soNumber') {
        this.tempArray[fieldData.key] = this.soNumberValue;
      }
      if (this.shipmentNumberValue !== '' && fieldData.lovType === 'shipmentNumber') {
        this.tempArray[fieldData.key] = this.shipmentNumberValue;
      }

      if (this.customerValue !== '' && fieldData.lovType === 'customer') {
        this.tempArray[fieldData.key] = this.customerValue;
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
    console.log(this.finalArray);
  } 
  clearSearchFields() {
    this.waveNumberValue = '';
    this.waveNumberArray = [];

    this.iuCodeArray = [];

    this.waveStatusValue = '';
    this.waveStatusArray = [];

    // this.taskTypeValue = '';
    // this.taskTypeArray = [];

    this.soNumberValue = '';
    this.soNumberArray = [];

    this.shipmentNumberValue = '';
    this.shipmentNumberArray = [];

    this.customerValue = '';
    this.customerArray = [];

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
      this.commonService.getSearchLOV(searchType).subscribe(
        (result: any) => {
          if (result.status === 200) {

            if (result.result) {
              const data = result.result;
              console.log('Final list---');
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

                  // for Task Type
                  if (listElement.lovType === 'waveTaskType') {
                    if (!this.taskTypeArray.includes(lovItem.taskType)) {
                      this.taskTypeArray.push(lovItem.taskType);
                      listElement.list.push({
                        label: lovItem.taskTypeDesc,
                        value: String(lovItem.taskType)
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

                  // for Customer
                  if (listElement.lovType === 'customer'  ) {
                    if (!this.customerArray.includes(lovItem.customerId) && lovItem.customerId !== null) {
                      this.customerArray.push(lovItem.customerId);
                       
                      listElement.list.push({
                        label: lovItem.customerName,
                        value: String(lovItem.customerId)
                      });
                      
                    } else { }
                  }
                }
                listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
              }
              console.log(this.searchFieldData);
            }
          }
        },
        (error: any) => {
          console.log(error.error.message);
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
      listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
    }

    console.log(this.searchFieldData);
  }

  ngOnDestroy() {
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}

