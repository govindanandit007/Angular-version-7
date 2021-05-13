import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import {ActivatedRoute,Router,NavigationEnd} from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';

@Component({
  selector: 'app-wo-search',
  templateUrl: './wo-search.component.html',
  styleUrls: ['./wo-search.component.css']
})
export class WoSearchComponent implements OnInit, OnDestroy {
  searchFieldData = [];
  searchType = '';
  searchLabel = '';
  public hideSearch = false;
  tempArray: any = {};
  finalArray: any = {};
  companyKey = '';
  searchDataType = '';
  seachLOVItem: string;
  screenType: string;
  searchdataArrayUnsubscribe: any = '';

  // ngModel values defines--
  IuValue: string;
  iuCodeArray: any = [];

  woNumberValue: string;
  woNumberArray: any = [];

  assemblyNoValue: string;
  assemblyNoArray: any = [];

  customerNameValue: string;
  customerNameArray: any = [];

  soNumber: string;
  soNumberArray: any = [];

  typeValue: string;
  typeArray: any = [];

  activityType: string;
  activityTypeArray: any = [];

  woStatusValue: string;
  woStatusArray: any = [];

  dateFrom : string;
  dateTo : string;

  priorityValue: string;
  priorityArray: any = [];

  currentRoute: string;
   

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,
              public route: ActivatedRoute,
              public woService: WorkOrderService,
              private router: Router) {}

  ngOnInit() {
    this.currentRoute = this.router.url.split('/')[1]; 
    if(this.currentRoute === 'kitting'){
      this.screenType = 'KT';
    }else{
      this.screenType = 'DKT';                 
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
      
        if (this.IuValue !== '' && fieldData.lovType === 'IuCode') {
          this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }

        if (this.woNumberValue !== '' && fieldData.lovType === 'woNumber') {
          this.tempArray[fieldData.key] = this.woNumberValue;
        }

        if (this.assemblyNoValue !== '' && fieldData.lovType === 'assemblyItem') {
          this.tempArray[fieldData.key] = this.assemblyNoValue;
        }

        if (this.customerNameValue !== '' && fieldData.lovType === 'woCustomerName') {
          this.tempArray[fieldData.key] = this.customerNameValue;
        }

        if (this.soNumber !== '' && fieldData.lovType === 'soNumber') {
          this.tempArray[fieldData.key] = this.soNumber;
        }

        if (this.typeValue !== '' && fieldData.lovType ==='type') {
          this.tempArray[fieldData.key] = this.typeValue;
        }

        if (this.activityType !== '' && fieldData.lovType === 'activityType') {
          this.tempArray[fieldData.key] = this.activityType;
        }

        if ( this.dateFrom !== '' && this.dateFormat(this.dateFrom) !== '' && fieldData.lovType === 'startDate' ){
          this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
        }

        if ( this.dateTo !== '' && this.dateFormat(this.dateTo) !== '' && fieldData.lovType === 'completionDate' ){
          this.tempArray[fieldData.key] = this.dateFormat(this.dateTo);
        }

        if (this.priorityValue !== '' && fieldData.lovType === 'woPriorityName') {
          this.tempArray[fieldData.key] = this.priorityValue;
        }

        if (this.woStatusValue !== '' && fieldData.lovType === 'woStatus') {
          this.tempArray[fieldData.key] = this.woStatusValue;
        }


    }
    this.tempArray['screenType'] = this.screenType;
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick: true
    };
    this.commonService.getsearhForMasters(this.finalArray); 
  }

  clearSearchFields() {
    this.woNumberValue = '';
    this.woNumberArray = [];

    this.typeValue = '';
    this.typeArray = [];

    this.activityType = '';
    this.activityTypeArray = [];

   // this.IuValue = '';
    //this.iuCodeArray = [];

    this.assemblyNoValue = '';
    this.assemblyNoArray = [];
    
    this.woStatusValue = '';
    this.woStatusArray = [];

    this.customerNameValue = '';
    this.customerNameArray = [];

    this.soNumber = '';
    this.soNumberArray = [];

    this.priorityValue = '';
    this.priorityArray = [];
   
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
  onIUChanged(event: any, element){ 
    if (event.source.selected) {  
           
      this.woNumberArray = [];
      this.customerNameArray = [];
      this.assemblyNoArray = [];
      this.soNumberArray = [];   
      this.woService.getDetailsByIuId(Number(element),this.screenType).subscribe((result: any) => {
        if (result.status === 200) {
          if (result.result) {
           
            const data = result.result;
            for (const listElement of this.searchFieldData) {
              if (listElement.lovType === 'woNumber') {
                listElement.list= [{ "label": " Please Select",
                "value": ""}];
              }
              else if (listElement.lovType === 'woCustomerName') {
                listElement.list= [{ "label": " Please Select",
                "value": ""}];
              }
              else if (listElement.lovType === 'soNumber') {
                listElement.list= [{ "label": " Please Select",
                "value": ""}];
              }
              else if (listElement.lovType === 'assemblyItem') {
                listElement.list= [{ "label": " Please Select",
                "value": ""}];
              }
              else {
                break;
              }

              for (const lovItem of data) {
                 // for Work Order Number
                if (listElement.lovType === 'woNumber') {
                  if (!this.woNumberArray.includes(lovItem.woNumber) && lovItem.woNumber) {
                    this.woNumberArray.push(lovItem.woNumber);
                    listElement.list.push({
                      label: lovItem.woNumber,
                      value: String(lovItem.woNumber)
                    });
                  } else { }
                }

                 // for Work Order customerName
                 if (listElement.lovType === 'woCustomerName') {
                  if (!this.customerNameArray.includes(lovItem.customerId) && lovItem.customerId) {
                    this.customerNameArray.push(lovItem.customerId);
                    listElement.list.push({
                      label: lovItem.customerName,
                      value: String(lovItem.customerName)
                    });
                  } else { }
                }
                 // for Work Order so number
                 if (listElement.lovType === 'soNumber') {
                  if (!this.soNumberArray.includes(lovItem.soId) && lovItem.soId ) {
                    this.soNumberArray.push(lovItem.soId);
                    listElement.list.push({
                      label: lovItem.soNumber,
                      value: String(lovItem.soId)
                    });
                  } else { }
                }
                  // for Work Order assemblyItem
                  if (listElement.lovType === 'assemblyItem') {
                    if (!this.assemblyNoArray.includes(lovItem.itemId) && lovItem.itemId) {
                      this.assemblyNoArray.push(lovItem.itemId);
                      listElement.list.push({
                        label: lovItem.itemName,
                        value: String(lovItem.itemId)
                      });
                    } else { }
                  }

              }
            }
            //this.getSearhInfo();
          }
        }
       });
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
                    // for Work Order Number
                if (listElement.lovType === 'woNumber') {
                  if (!this.woNumberArray.includes(lovItem.woNumber) && lovItem.woNumber) {
                    this.woNumberArray.push(lovItem.woNumber);
                    listElement.list.push({
                      label: lovItem.woNumber,
                      value: String(lovItem.woNumber)
                    });
                  } else { }
                 }

                 // for Work Order customerName
                 if (listElement.lovType === 'woCustomerName') {
                  if (!this.customerNameArray.includes(lovItem.customerId) && lovItem.customerId) {
                    this.customerNameArray.push(lovItem.customerId);
                    listElement.list.push({
                      label: lovItem.customerName,
                      value: String(lovItem.customerName)
                    });
                  } else { }
                  }
                 // for Work Order so number
                 if (listElement.lovType === 'soNumber') {
                  if (!this.soNumberArray.includes(lovItem.soId) && lovItem.soId) {
                    this.soNumberArray.push(lovItem.soId);
                    listElement.list.push({
                      label: lovItem.soNumber,
                      value: String(lovItem.soId)
                    });
                  } else { }
                 }
                  // for Work Order assemblyItem
                  if (listElement.lovType === 'assemblyItem') {
                    if (!this.assemblyNoArray.includes(lovItem.itemId) && lovItem.itemId) {
                      this.assemblyNoArray.push(lovItem.itemId);
                      listElement.list.push({
                        label: lovItem.itemName,
                        value: String(lovItem.itemId)
                      });
                    } else { }
                  }
                  // for Type
                  if (listElement.lovType === 'type') {
                    if (!this.typeArray.includes(lovItem.typeCode) && lovItem.typeCode) {
                      this.typeArray.push(lovItem.typeCode);
                      listElement.list.push({
                        label: lovItem.typeName,
                        value: String(lovItem.typeCode)
                      });
                    } else { }
                  }

                  // for Activity Type
                  if (listElement.lovType === 'activityType') {
                    if (!this.activityTypeArray.includes(lovItem.woSubType) && lovItem.woSubType) {
                      this.activityTypeArray.push(lovItem.woSubType);
                      listElement.list.push({
                        label: lovItem.woSubTypeName,
                        value: lovItem.woSubType
                      });
                    } else { }
                  }

                  // for OU code
                  if (listElement.lovType === 'IuCode') {
                    if (!this.iuCodeArray.includes(lovItem.woIuId) && lovItem.woIuId) {
                      this.iuCodeArray.push(lovItem.woIuId);
                      listElement.list.push({
                        label: lovItem.iuCode,
                        value: String(lovItem.woIuId)
                      });
                    } else { }
                  }

                  // for Priority values
                  if (listElement.lovType === 'woPriorityName') {
                    if (!this.priorityArray.includes(lovItem.priorityCode) && lovItem.priorityCode) {
                      this.priorityArray.push(lovItem.priorityCode);
                      listElement.list.push({
                        label: lovItem.priorityName,
                        value: String(lovItem.priorityCode)
                      });
                    } else { }
                  }

                  // for Status values
                  if (listElement.lovType === 'woStatus') {
                    if (!this.woStatusArray.includes(lovItem.statusCode) && lovItem.statusCode) {
                      this.woStatusArray.push(lovItem.statusCode);
                      listElement.list.push({
                        label: lovItem.statusName,
                        value: lovItem.statusCode
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

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
