import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { SerialNoService } from 'src/app/_services/transactions/serial-no.service';

@Component({
  selector: 'app-serial-no-search',
  templateUrl: './serial-no-search.component.html',
  styleUrls: ['./serial-no-search.component.css']
})
export class SerialNoSearchComponent implements OnInit, OnDestroy{
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
  IuValue: string;
  serialMaterialStatusValue: string;
  serialStatusValue: string;
  IuCodeArray: any = [];
  itemValue: string;
  itemCodeArray: any = [];
  serialNumValue: string;
  serialNumberArray: any = [];
  iuCodeList: any = [];
  serialStatusList: any = [];
  materialStatusLovList: any = [];
  serialFromValue: string;
  serialToValue: string;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService,private serialNoService: SerialNoService,private snackBar: MatSnackBar) { }

  ngOnInit() {

   this.getSerialStatusList();
   this.materialStatusLOV();
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

  hideSearchContainer() {
    this.searchComponentToggle.emit(this.hideSearch);
  }

  getSearhInfo() {
    if(this.IuValue !== ''){
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

        if (fieldData.lovType === 'IuCode') {
          this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }

        if (this.itemValue !== '' && fieldData.lovType === 'itemCode') {
          this.tempArray[fieldData.key] = this.itemValue;
        }

        if (this.serialNumValue !== '' && fieldData.lovType === 'serialNum') {
          this.tempArray[fieldData.key] = this.serialNumValue;
        }

        if (this.serialStatusValue !== '' && fieldData.lovType === 'serialStatus') {
          this.tempArray[fieldData.key] = this.serialStatusValue;
        }
        if (this.serialMaterialStatusValue !== '' && fieldData.lovType === 'serialMaterialStatus') {
          this.tempArray[fieldData.key] = this.serialMaterialStatusValue;
        }
        if (this.serialFromValue !== '' && fieldData.lovType === 'SerialFrom') {
          this.tempArray[fieldData.key] = this.serialFromValue;
        }
        if (this.serialToValue !== '' && fieldData.lovType === 'SerialTo') {
          this.tempArray[fieldData.key] = this.serialToValue;
        }

    //  }
    }
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(this.finalArray);
    console.log(this.finalArray);
  }
  }

  clearSearchFields() {
    // this.IuValue = '';
    this.IuCodeArray = [];

    this.itemValue = '';
    this.itemCodeArray = [];
 
    this.serialNumValue = '';
    this.serialNumberArray = [];

    this.serialMaterialStatusValue = '';
    this.serialStatusValue = '';
    this.serialFromValue = '';
    this.serialToValue = '';

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
 // Get Inventory Unit LOV
  getInventoryUnitCode() {
    this.iuCodeList = [];
    // this.ouEnabledCodeList = [];
    this.commonService.getSearchLOV('IU').subscribe(
      (result: any) => {
        this.iuCodeList = [{
          label: ' Please Select',
          value: ''
        }];
        if (result.status === 200) {
          if (result.result) {
            const data = result.result;
            for (const lovItem of data) {
              this.iuCodeList.push({
                label: lovItem.code,
                value: String(lovItem.id),
                ouId: String(lovItem.ouId),
              });
            }
          }
        }
      })

  }
  getSearchLOVData(searchType: string) {

  //   if (searchType !== '') {
  //     this.commonService.getSearchLOV(searchType).subscribe(
  //       (result: any) => {
  //         if (result.status === 200) {
             
  //           if (result.result) {
  //             const data = result.result;
  //             console.log('Final list---');
  //             for (const listElement of this.searchFieldData) {

  //               for (const lovItem of data) {
  //                 listElement.value = lovItem.id;

  //                 // for IU code
  //                 if (listElement.lovType === 'IuCode') {
  //                   if (!this.IuCodeArray.includes(lovItem.iuId)) {
  //                     this.IuCodeArray.push(lovItem.iuId);
  //                     listElement.list.push({
  //                       label: lovItem.iuCode,
  //                       value: String(lovItem.iuId)
  //                     });
  //                   } else { }
  //                 }

  //                 // for Item values
  //                 if (listElement.lovType === 'itemCode') {
  //                   if (!this.itemCodeArray.includes(lovItem.itemId)) {
  //                     this.itemCodeArray.push(lovItem.itemId);
  //                     listElement.list.push({
  //                       label: lovItem.itemName,
  //                       value: String(lovItem.itemId)
  //                     });
  //                   } else { }
  //                 }

  //                 // for Serial Number
  //                 if (listElement.lovType === 'serialNum') {
  //                   if (!this.serialNumberArray.includes(lovItem.id) && lovItem.id !== null) {
  //                     this.serialNumberArray.push(lovItem.id);
  //                     listElement.list.push({
  //                       label: lovItem.serialNum,
  //                       value: String(lovItem.id)
  //                     });
  //                   } else { }
  //                 }


  //               }
  //               listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
  //             }
  //             console.log(this.searchFieldData);
  //           }
  //         }
  //       },
  //       (error: any) => {
  //         console.log(error.error.message);
  //       }
  //     );
  //     console.log('1');
  //   }
  }
  materialStatusLOV(){
             this.commonService.getMaterialStatusLOV().subscribe(
                    (result: any) => {
                        this.materialStatusLovList = [{
                            label: ' Please Select',
                            value: ''
                        }];
                        if (result.status === 200) {
                            if (result.result) {
                                const data = result.result;
                                for (const rowData of data) {
                                this.materialStatusLovList.push({
                                    value: String(rowData.materialStatusId),
                                    label: rowData.materialStatusName
                                });
                            }
                            }
                        }
                })
    }
    // Get the lov for Serial Status
    getSerialStatusList() {
        this.serialStatusList = [{ label: ' Please Select', value: '' }];
        this.serialNoService.getSerialStatusList().subscribe(
            (data: any) => {
                const serialStatuslov = data.result;
                for (const rowData of serialStatuslov) {
                    this.serialStatusList.push({
                        value: rowData.lookupValue,
                        label: rowData.lookupValueDesc
                    });
                }
            },
            error => { 
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
        console.log(this.serialStatusList);
    }
    openSnackBar(message: string, action: string, typeClass: string) {
      this.snackBar.open(message, action, {
          duration: 3500,
          panelClass: [typeClass]
      });
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
    
    console.log(this.searchFieldData);
  }

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

}
