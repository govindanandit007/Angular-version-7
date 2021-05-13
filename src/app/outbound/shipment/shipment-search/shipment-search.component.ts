import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { ShipmentService } from 'src/app/_services/outbound/shipment.service';

@Component({
  selector: 'app-shipment-search',
  templateUrl: './shipment-search.component.html',
  styleUrls: ['./shipment-search.component.css']
})
export class ShipmentSearchComponent implements OnInit {
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

  shipmentNumberValue: string;

  IuValue: string;
  iuCodeArray: any = [];

  statusValue: string;
  statusValueArray: any = [];


  shipmentCustomerValue: string;
  shipmentCustomerArray: any = [];

  dateFrom: string;
  dateTo: string;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService, private shipmentService: ShipmentService) { }

  ngOnInit() {
       this.shipmentService.defaultIuDataObservable.subscribe((data: any) => {
       this.IuValue = String(data);
   });
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

      if (this.shipmentNumberValue !== '' && fieldData.lovType === 'shipmentNumber') {
        this.tempArray[fieldData.key] = this.shipmentNumberValue;
      }
      
      if (fieldData.lovType === 'IuCode') {
        this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
      }

      if (this.statusValue !== '' && fieldData.lovType === 'status') {
        this.tempArray[fieldData.key] = this.statusValue;
      }

      if (this.shipmentCustomerValue !== '' && fieldData.lovType === 'shipmentCustomer') {
        this.tempArray[fieldData.key] = this.shipmentCustomerValue;
      }

      if (this.dateFrom !== '' && this.dateFormat(this.dateFrom) !== '' && fieldData.lovType === 'plannedShipDateFrom') {
        this.tempArray[fieldData.key] = this.dateFormat(this.dateFrom);
      }

      if (this.dateTo !== '' && this.dateFormat(this.dateTo) !== '' && fieldData.lovType === 'plannedShipDateTo') {
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

    this.shipmentNumberValue = '';

    this.iuCodeArray = [];

    this.statusValue = '';
    this.statusValueArray = [];
    

    this.shipmentCustomerValue = '';
    this.shipmentCustomerArray = [];

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
      //             if (listElement.lovType === 'soNumber') {
      //               if (!this.soNumberArray.includes(lovItem.soId)) {
      //                 this.soNumberArray.push(lovItem.soId);
      //                 listElement.list.push({
      //                   label: lovItem.soNumber,
      //                   value: String(lovItem.soId)
      //                 });
      //               } else { }
      //             }

            

      //             // for OU code
      //             if (listElement.lovType === 'IuCode') {
      //               if (!this.iuCodeArray.includes(lovItem.iuId)) {
      //                 this.iuCodeArray.push(lovItem.iuId);
      //                 listElement.list.push({
      //                   label: lovItem.iuCode,
      //                   value: String(lovItem.iuId)
      //                 });
      //               } else { }
      //             }

      //             // for Customer
      //             if (listElement.lovType === 'shipmentCustomer') {
      //               if (!this.soNumberArray.includes(lovItem.statusCode)) {
      //                 this.soNumberArray.push(lovItem.statusCode);
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
      this.commonService.getIULOV().subscribe(
        (result: any) => {
          if (result.status === 200) {
            if (result.result) {
              const data = result.result;
              console.log('Final list---');
              for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'IuCode') {
                  for (const lovItem of data) {
                    if (lovItem.iuEnabledFlag === 'Y') {
                      listElement.list.push({
                        label: lovItem.iuCode,
                        value: String(lovItem.iuId)
                      });
                    }
                  }
                  listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
                }

              }
              console.log(this.searchFieldData);
            }
          }
        },
        (error: any) => {
          console.log(error.error.message);
        }
      );

      this.commonService.getShipmentStatusLOV().subscribe(
        (result: any) => {
          if (result.status === 200) {
            if (result.result) {
              const data = result.result;
              console.log('Final list---');
              for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'status') {
                  for (const lovItem of data) {
                      listElement.list.push({
                        label: lovItem.statusDescription,
                        value: lovItem.status
                      });
                  }
                  listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
                }

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
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
    this.commonService.searhForMasters({});
  }
}
