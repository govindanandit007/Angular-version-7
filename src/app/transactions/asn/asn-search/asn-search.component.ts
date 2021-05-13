import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-asn-search',
  templateUrl: './asn-search.component.html',
  styleUrls: ['./asn-search.component.css']
})

export class AsnSearchComponent implements OnInit, OnDestroy {
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
  asnNumberValue: string;
  asnNumberArray: any = [];

  OuValue: string;
  ouCodeArray: any = [];

  poNumberValue: string;
  poNumberArray: any = [];

  supplierNameValue: string;
  supplierNumberArray: any = [];

  itemCodeValue: string;
  itemCodeArray: any = [];


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

        if (this.asnNumberValue !== '' && fieldData.lovType === 'asnNumber') {
          this.tempArray[fieldData.key] = this.asnNumberValue;
        }

        if (this.OuValue !== '' && fieldData.lovType === 'OuCode') {
          this.tempArray[fieldData.key] = this.OuValue;
        }

        if (this.poNumberValue !== '' && fieldData.lovType === 'poNumber') {
          this.tempArray[fieldData.key] = this.poNumberValue;
        }
        if (this.supplierNameValue !== '' && fieldData.lovType === 'asnSupplierName') {
          this.tempArray[fieldData.key] = this.supplierNameValue;
        }
        if (this.itemCodeValue !== '' && fieldData.lovType === 'itemCode') {
          this.tempArray[fieldData.key] = this.itemCodeValue;
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
    this.asnNumberValue = '';
    this.asnNumberArray = [];

    this.OuValue = '';
    this.ouCodeArray = [];

    this.poNumberValue = '';
    this.poNumberArray = [];

    this.supplierNameValue = '';
    this.supplierNumberArray = [];

    this.itemCodeValue = '';
    this.itemCodeArray = [];

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

                  // for ASN Number values
                  if (listElement.lovType === 'asnNumber') {
                    if (!this.asnNumberArray.includes(lovItem.asnId)) {
                      this.asnNumberArray.push(lovItem.asnId);
                      listElement.list.push({
                        label: lovItem.asnNumber,
                        value: String(lovItem.asnId)
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

                  // for Po Number values
                  if (listElement.lovType === 'poNumber') {
                    if (!this.poNumberArray.includes(lovItem.poId)) {
                      this.poNumberArray.push(lovItem.poId);
                      listElement.list.push({
                        label: lovItem.poName,
                        value: String(lovItem.poId)
                      });
                    } else { }
                  }

                  // for Supplier Name values
                  if (listElement.lovType === 'asnSupplierName') {
                    if (!this.supplierNumberArray.includes(lovItem.supplierId)) {
                      this.supplierNumberArray.push(lovItem.supplierId);
                      listElement.list.push({
                        label: lovItem.supplierName,
                        value: String(lovItem.supplierId)
                      });
                    } else { }
                  }

                  // for Item Name values
                  if (listElement.lovType === 'itemCode') {
                    if (!this.itemCodeArray.includes(lovItem.itemId)) {
                      this.itemCodeArray.push(lovItem.itemId);
                      listElement.list.push({
                        label: lovItem.itemName,
                        value: String(lovItem.itemId)
                      });
                    } else { }
                  }
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
