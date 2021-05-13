import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-uom-conversion-search-bar',
  templateUrl: './uom-conversion-search-bar.component.html',
  styleUrls: ['./uom-conversion-search-bar.component.css']
})
export class UomConversionSearchBarComponent implements OnInit {
  searchFieldData = [];
  searchType = '';
  searchLabel = '';
  public hideSearch = false;
  tempArray: any = {};
  finalArray: any = {};
  companyKey = '';
  searchDataType = '';
  seachLOVItem: string;

  // ngModel values defines--
  codeValue: string;
  nameValue: string;
  invCodeValue: string;
  lgCodeValue: string;
  enableValue: string;
  classValue: string;
  ouIuValue: string;
  ouCodeArray: any = [{
    label: ' Please Select',
    value: ''
  }];
  codeArray: any = [{
    label: ' Please Select',
    value: ''
  }];
  nameArray: any = [{
    label: ' Please Select',
    value: ''
  }];
  iuCodeArray: any = [{
    label: ' Please Select',
    value: ''
  }];
  lgCodeArray: any = [{
    label: ' Please Select',
    value: ''
  }];
  ouNameArray: any = [{
    label: ' Please Select',
    value: ''
  }];

  ouLovinIUSearch: any = [{
    label: ' Please Select',
    value: ''
  }]
  iuLovinLGSearch: any = [{
    label: ' Please Select',
    value: ''
  }]
  iuLovinSLSearch: any = [{
    label: ' Please Select',
    value: ''
  }]
  lgLovinSLSearch: any = [{
    label: ' Please Select',
    value: ''
  }]
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService) { }

  ngOnInit() {
    this.commonService.searchdataArray.subscribe((data: any) => {
      this.clearSearchFields();
      if (data.searchArray) {
        if (data.searchArray[0].type === 'selectionChangeLOV') {
          data.searchArray[1].list = data.searchArray[1].list[0]
        }
        this.searchFieldData = [];
        this.ouCodeArray = [{
          label: ' Please Select',
          value: ''
        }];
        this.codeArray = [{
          label: ' Please Select',
          value: ''
        }];
        this.nameArray = [{
          label: ' Please Select',
          value: ''
        }];
        this.iuCodeArray = [{
          label: ' Please Select',
          value: ''
        }];
        this.lgCodeArray = [{
          label: ' Please Select',
          value: ''
        }];
        this.ouNameArray = [{
          label: ' Please Select',
          value: ''
        }]
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
      this.getSearchLOVData(this.searchDataType, data.UOMClass);
     
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
      if (fieldData.value) {
        if (
          this.codeValue !== '' &&
          (fieldData.lovType === 'code' ||
            fieldData.lovType === 'name')
        ) {
          if (fieldData.lookupType === 'lookupDes') {
            for (const fieldlist of fieldData.list) {
              if (fieldlist.value === this.codeValue) {
                this.tempArray[fieldData.key] = fieldlist.label;
              }
            }
          } else {
            this.tempArray[fieldData.key] = this.codeValue;
          }
        }
        if (
          this.codeValue !== '' &&
          (fieldData.lovType === 'iuAndLgCode' ||
            fieldData.lovType === 'iuAndLgName')
        ) {
          this.tempArray[fieldData.key] = this.codeValue;
        }
        if (
          this.invCodeValue !== '' &&
          fieldData.lovType === 'INVCode'
        ) {
          this.tempArray[fieldData.key] = this.invCodeValue;
        }
        if (
          this.lgCodeValue !== '' &&
          fieldData.lovType === 'LocGroupCode'
        ) {
          this.tempArray[fieldData.key] = this.lgCodeValue;
        }
        if (
          this.enableValue !== '' &&
          fieldData.lovType === 'enableFlag'
        ) {
          this.tempArray[fieldData.key] = this.enableValue;
        }
        if (
          this.classValue !== '' &&
          fieldData.lovType === 'uomClass'
        ) {
          this.tempArray[fieldData.key] = this.classValue;
        }
        if (
          this.ouIuValue !== '' &&
          fieldData.lovType === 'iuOUCode'
        ) {
          this.tempArray[fieldData.key] = this.ouIuValue;
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
    this.invCodeValue = '';
    this.lgCodeValue = '';
    this.codeValue = '';
    this.nameValue = '';
    this.enableValue = '';
    this.classValue = '';
    this.ouIuValue = '';

    if (
      String(JSON.parse(localStorage.getItem('userDetails')).userId) ===
      '-1' ||
      this.companyKey === ''
    ) {
      this.tempArray = {};
    }
  }

  getSearchLOVData(searchType: string, uomClass:string) {
    if (searchType !== '' && uomClass !== undefined) {
      let tempData = {
        lovType: 'ITEMUOM',
        id: uomClass,
        enableFlag: null,
        companyId: null
      }
      this.commonService.getSearchUOMCONLOV(tempData).subscribe(
        (result: any) => {

          if (result.status === 200) {
            if (result.result) {
              const data = result.result; 
              const tempArrayForClass = [
                {
                  label: ' Please Select',
                  value: ''
                }
              ];

              this.ouCodeArray = [
                {
                  label: ' Please Select',
                  value: ''
                }
              ];
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
              this.iuCodeArray = [
                {
                  label: ' Please Select',
                  value: ''
                }
              ];
              this.lgCodeArray = [
                {
                  label: ' Please Select',
                  value: ''
                }
              ];
              for (const listElement of this.searchFieldData) {
                if (listElement.lovType !== 'enableFlag') {
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
                        lgId: lovItem.lgId,
                        iuId: lovItem.iuId

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
                        lgId: lovItem.lgId,
                        iuId: lovItem.iuId
                      });
                    }
                  }
                  listElement.list  =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
                }
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

  getDependentList(event, fieldValue, typeValue) {

    if (typeValue === 'code' && event.source.selected) {
      this.nameValue = String(fieldValue);
    }
    if (typeValue === 'name' && event.source.selected) {
      this.codeValue = String(fieldValue);
    }
  }


}
