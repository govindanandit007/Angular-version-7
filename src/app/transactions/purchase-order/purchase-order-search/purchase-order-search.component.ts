import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';

@Component({
  selector: 'app-purchase-order-search',
  templateUrl: './purchase-order-search.component.html',
  styleUrls: ['./purchase-order-search.component.css']
})
export class PurchaseOrderSearchComponent implements OnInit {

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
  poStatusValue: string;
  poStatusArray: any = [];

  poNumberValue: string;
  poNumberArray: any = [];

  poOuValue: string;
  poOuArray: any = [];
  ouCodeList: any = [];
  
  IuValue: string;
  poIuArray: any = [];
  iuCodeList: any = [];

  poSupplierNameValue: string;
  supplierNameArray: any = [];

  itemValue: string;
  itemArray: any = [];
  // this.commonService.defaultIuDataSource.asObservable();

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,
  private purchaseOrderService: PurchaseOrderService) {

   }

  ngOnInit() {
  //  this.purchaseOrderService.defaultIuDataObservable.subscribe((data: any) => {
  //      this.IuValue = String(data);
  //  });
    // this.IuValue = this.commonService.defaultIuDataObservable;
    this.getOperatingUnitCode();
    this.getInventoryUnitCode();

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

  // Get Operating Unit LOV
  getOperatingUnitCode() {
    this.ouCodeList = [];
    // this.ouEnabledCodeList = [];
    this.commonService.getSearchLOV('OU').subscribe(
      (result: any) => {
        this.ouCodeList = [{
          label: ' Please Select',
          value: ''
        }];
        if (result.status === 200) {
          if (result.result) {
            const data = result.result;
            for (const lovItem of data) {
              this.ouCodeList.push({
                label: lovItem.code,
                value: String(lovItem.id),
              });
            }
          }
        }
      })
  }
  // Get Inventory Unit LOV
  getInventoryUnitCode() {
    this.iuCodeList = [];
    // this.ouEnabledCodeList = [];
    this.commonService.getSearchLOV('IU').subscribe(
      (result: any) => {
        this.iuCodeList = [{
          label: ' Please Select',
          value: '',
          name: ''
        }];
        if (result.status === 200) {
          if (result.result) {
            const data = result.result;
            for (const lovItem of data) {
              this.iuCodeList.push({
                label: lovItem.code,
                value: String(lovItem.id),
                ouId: String(lovItem.ouId),
                name: String(lovItem.ouName),
                
              });
            }

          }
        }
      })

  }

  OuSelectionChanged(event, fieldValue) {
    if (event.source.selected) {
      this.commonService.getIUBasedOnOULOV(fieldValue).subscribe((data: any) => {
        this.iuCodeList = [{
        label: ' Please Select',
        value: '',
        name: '',
      }];
        if(data.result){
          for (const IUData of data.result) {
            this.iuCodeList.push({
              value: String(IUData.iuId),
              label: String(IUData.iuCode),
              name: String(IUData.iuName),
            });
          }
        }
      });
    }
  }
  hideSearchContainer() {
    this.searchComponentToggle.emit(this.hideSearch);
  }

  getSearhInfo() {
  console.log('getSerarch');
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

      if (this.poStatusValue !== '' && fieldData.lovType === 'poStatus') {
        this.tempArray[fieldData.key] = this.poStatusValue;
      }

      if (this.poNumberValue !== '' && fieldData.lovType === 'poNumber' ) {
        this.tempArray[fieldData.key] = this.poNumberValue;
      } else {
        console.log("not empty");
      }

      if (this.poOuValue !== '' && fieldData.lovType === 'poOuCode') {
        this.tempArray[fieldData.key] = this.poOuValue;
      }
      if (fieldData.lovType === 'IuCode') {
        this.tempArray[fieldData.key] =  String((JSON.parse(localStorage.getItem('defaultIU'))).id);
      }
      if (this.poSupplierNameValue !== '' && fieldData.lovType === 'poSupplierName') {
        this.tempArray[fieldData.key] = this.poSupplierNameValue;
      }
      if (this.itemValue !== '' && fieldData.lovType === 'itemCode') {
        this.tempArray[fieldData.key] = this.itemValue;
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
    this.poStatusValue = '';
    this.poStatusArray = [];

    this.poNumberValue = '';
    this.poNumberArray = [];

    this.poOuValue = '';
    this.poOuArray = [];

    this.IuValue = '';
    this.poIuArray = [];

    this.poSupplierNameValue = '';
    this.supplierNameArray = [];

    this.itemValue = '';
    this.itemArray = [];

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

                  // for PO Status values
                  if (listElement.lovType === 'poStatus') {
                    if (!this.poStatusArray.includes(lovItem.asnId)) {
                      this.poStatusArray.push(lovItem.asnId);
                      listElement.list.push({
                        label: lovItem.statusName,
                        value: String(lovItem.statusCode)
                      });
                    } else { }
                  }

                  // for OU code
                  // if (listElement.lovType === 'OuCode') {
                  //   if (!this.poOuArray.includes(lovItem.ouId)) {
                  //     this.poOuArray.push(lovItem.ouId);
                  //     listElement.list.push({
                  //       label: lovItem.ouCode,
                  //       value: String(lovItem.ouId)
                  //     });
                  //   } else { }
                  // }

                  // for Po Number values
                  // if (listElement.lovType === 'poNumber') {
                  //   if (!this.poNumberArray.includes(lovItem.poId)) {
                  //     this.poNumberArray.push(lovItem.poId);
                  //     listElement.list.push({
                  //       label: lovItem.poName,
                  //       value: String(lovItem.poId)
                  //     });
                  //   } else { }
                  // }

                  // for Supplier Name values
                  // if (listElement.lovType === 'asnSupplierName') {
                  //   if (!this.supplierNameArray.includes(lovItem.supplierId)) {
                  //     this.supplierNameArray.push(lovItem.supplierId);
                  //     listElement.list.push({
                  //       label: lovItem.supplierName,
                  //       value: String(lovItem.supplierId)
                  //     });
                  //   } else { }
                  // }

                  // for Item Name values
                  // if (listElement.lovType === 'itemCode') {
                  //   if (!this.itemArray.includes(lovItem.itemId)) {
                  //     this.itemArray.push(lovItem.itemId);
                  //     listElement.list.push({
                  //       label: lovItem.itemName,
                  //       value: String(lovItem.itemId)
                  //     });
                  //   } else { }
                  // }
                  // // for Serial Number
                  // if (listElement.lovType === 'poNumber') {
                  //   if (!this.serialNumberArray.includes(lovItem.id) && lovItem.id !== null) {
                  //     this.serialNumberArray.push(lovItem.id);
                  //     listElement.list.push({
                  //       label: lovItem.serialNum,
                  //       value: String(lovItem.id)
                  //     });
                  //   } else { }
                  // }


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
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
