import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { SalesOrderService } from 'src/app/_services/outbound/sales-order.service';

@Component({
  selector: 'app-rma-search',
  templateUrl: './rma-search.component.html',
  styleUrls: ['./rma-search.component.css']
})
export class RmaSearchComponent implements OnInit {
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
  soNumberValue: string;
  soNumberArray: any = [];

  rmaNumberValue: string;
  rmaNumberArray: any = [];

  OuValue: string;
  ouCodeArray: any = [];

  IuValue: string;
  iuCodeArray: any = [];

  soStatusValue: string;
  soStatusArray: any = [];

  soTypeValue: string;
  soTypeArray: any = [];

  customerNameValue: string;
  customerNameArray: any = [];

  customerSiteValue: string;
  customerSiteArray: any = [];

  priorityValue: string;
  priorityArray: any = [];

  itemCodeValue: string;
  itemCodeArray: any = [];

  dateFrom : string;
  dateTo : string;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,private salesOrderService: SalesOrderService,) { }

  ngOnInit() {
      // this.salesOrderService.defaultIuDataObservable.subscribe((data: any) => {
      //   this.IuValue = String(data);
      // });
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
      // if (fieldData.value) {

        if (this.soNumberValue !== '' && fieldData.lovType === 'soNumber') {
          this.tempArray[fieldData.key] = this.soNumberValue;
        }

        if (this.rmaNumberValue !== '' && fieldData.lovType === 'rmaNumber') {
          this.tempArray[fieldData.key] = this.rmaNumberValue;
        }

        if (this.OuValue !== '' && fieldData.lovType === 'OuCode') {
          this.tempArray[fieldData.key] = this.OuValue;
        }
        if (fieldData.lovType === 'IuCode') {
          this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }

        if (this.soStatusValue !== '' && fieldData.lovType === 'soStatus') {
          this.tempArray[fieldData.key] = this.soStatusValue;
        }

        if (this.soTypeValue !== '' && fieldData.lovType === 'soType') {
          this.tempArray[fieldData.key] = this.soTypeValue;
        }

        if (this.customerNameValue !== '' && fieldData.lovType === 'soCustomerName') {
          this.tempArray[fieldData.key] = this.customerNameValue;
        }

        if (this.customerSiteValue !== '' && fieldData.lovType === 'soCustomerSite') {
          this.tempArray[fieldData.key] = this.customerSiteValue;
        }

        if (this.priorityValue !== '' && fieldData.lovType === 'soPriorityName') {
          this.tempArray[fieldData.key] = this.priorityValue;
        }

        if (this.itemCodeValue !== '' && fieldData.lovType === 'itemCode') {
          this.tempArray[fieldData.key] = this.itemCodeValue;
        }

        if ( this.dateFrom !== '' && this.dateFormat(this.dateFrom) !== '' && fieldData.lovType === 'plannedShipDateFrom' ){
          this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
        }

        if ( this.dateTo !== '' && this.dateFormat(this.dateTo) !== '' && fieldData.lovType === 'plannedShipDateTo' ){
          this.tempArray[fieldData.key] = this.dateFormat(this.dateTo);
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
    this.soNumberValue = '';
    this.soNumberArray = [];
    
    this.rmaNumberValue = '';
    this.rmaNumberArray = [];

    this.OuValue = '';
    this.ouCodeArray = [];

    this.IuValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
    this.iuCodeArray = [];
    
    this.soStatusValue = '';
    this.soStatusArray = [];

    this.soTypeValue = 'STD';
    this.soTypeArray = [];

    this.customerNameValue = '';
    this.customerNameArray = [];

    this.customerSiteValue = '';
    this.customerSiteArray = [];

    this.priorityValue = '';
    this.priorityArray = [];

    this.itemCodeValue = '';
    this.itemCodeArray = [];
    
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
      this.commonService.getSearchLOV(searchType).subscribe(
        (result: any) => {
          if (result.status === 200) {

            if (result.result) {
              const data = result.result;
              console.log('Final list---');
              for (const listElement of this.searchFieldData) {

                for (const lovItem of data) {
                  listElement.value = lovItem.id;

                  // for ASN Number values
                  if (listElement.lovType === 'soNumber') {
                    if (!this.soNumberArray.includes(lovItem.soId)) {
                      this.soNumberArray.push(lovItem.soId);
                      listElement.list.push({
                        label: lovItem.soNumber,
                        value: String(lovItem.soId)
                      });
                    } else { }
                  }

                  // for OU code
                  if (listElement.lovType === 'OuCode') {
                    if (!this.ouCodeArray.includes(lovItem.ouId)) {
                      this.ouCodeArray.push(lovItem.ouId);
                      listElement.list.push({
                        label: lovItem.ouCode,
                        value: String(lovItem.ouId)
                      });
                    } else { }
                  }

                  // for OU code
                  if (listElement.lovType === 'IuCode') {
                    if (!this.iuCodeArray.includes(lovItem.iuId)) {
                      this.iuCodeArray.push(lovItem.iuId);
                      listElement.list.push({
                        label: lovItem.iuCode,
                        value: String(lovItem.iuId)
                      });
                    } else { }
                  }

                  // for Status values
                  if (listElement.lovType === 'soStatus') {
                    if (!this.soNumberArray.includes(lovItem.statusCode) && lovItem.statusCode !== null) {
                      this.soNumberArray.push(lovItem.statusCode);
                      listElement.list.push({
                        label: (lovItem.statusName).trim(),
                        value: lovItem.statusCode
                      });
                    } else { }
                  }

                  // for Type values
                  if (listElement.lovType === 'soType') {
                    if (!this.soTypeArray.includes(lovItem.typeCode)) {
                      this.soTypeArray.push(lovItem.typeCode);
                      listElement.list.push({
                        label: lovItem.typeName,
                        value: lovItem.typeCode
                      });
                    } else { }
                  }

                  // for Priority values
                  if (listElement.lovType === 'soPriorityName') {
                    if (!this.priorityArray.includes(lovItem.priorityCode)) {
                      this.priorityArray.push(lovItem.priorityCode);
                      listElement.list.push({
                        label: lovItem.priorityName,
                        value: String(lovItem.priorityCode)
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

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
