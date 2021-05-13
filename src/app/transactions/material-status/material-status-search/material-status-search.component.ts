import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { MaterialStatusService } from 'src/app/_services/transactions/material-status.service';

@Component({
  selector: 'app-material-status-search',
  templateUrl: './material-status-search.component.html',
  styleUrls: ['./material-status-search.component.css']
})
export class MaterialStatusSearchComponent implements OnInit, OnDestroy {

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
  IuCodeArray: any = [];
  // entityValue: string;
  entityValue = new FormControl('');
  itemCodeArray: any = [];
  statusValue: string;
  statusArray: any = [];

  entityError: any = null;
  entityType = '';

  batchNumberValue: string = '';
  locatorGroupValue: string = '';
  serialNumberFromValue: string = '';
  serialNumberToValue: string = '';

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService, public materialStatusService: MaterialStatusService,) { }

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

      if (this.searchDataType !== '' && this.searchDataType !== undefined) {
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

      if ( fieldData.lovType === 'IuCode') {
        this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
      }

      if (this.entityValue.value !== '' && fieldData.lovType === 'entity') {
        this.tempArray[fieldData.key] = this.entityValue.value;
      }

      if (this.statusValue !== '' && fieldData.lovType === 'status') {
        this.tempArray[fieldData.key] = String(this.statusValue);
      }

    }
    if (this.batchNumberValue !== '') {
      this.tempArray['entityValue'] = this.batchNumberValue;
    }
    if (this.locatorGroupValue !== '') {
      this.tempArray['entityValue'] = this.locatorGroupValue;
    }
    if (this.serialNumberFromValue !== '') {
      this.tempArray['fromSerialNumber'] = this.serialNumberFromValue;
    }
    if (this.serialNumberToValue !== '') {
      this.tempArray['toSerialNumber'] = this.serialNumberToValue;
    }
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick: true
    };
    this.commonService.getsearhForMasters(this.finalArray);
    if (this.finalArray.searchArray.entity === undefined || this.finalArray.searchArray.entity === '') {
      this.entityError = '';
    } else {
      this.entityError = null;
    }
    console.log(this.finalArray);
    this.entityValue.markAsTouched();
  }

  clearSearchFields() {
    this.IuCodeArray = [];
    this.entityValue = new FormControl('');
    // this.entityValue('');
    // this.entityValue.value = ''
    this.itemCodeArray = [];

    this.statusValue = '';
    this.statusArray = [];

    this.batchNumberValue = '';
    this.serialNumberFromValue = '';
    this.serialNumberToValue = '';

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
  entitySelectionChanged(event: any, entityValue) {
    if (event.source.selected && event.isUserInput === true) {
      this.entityType = entityValue;
      this.batchNumberValue = '';
      this.serialNumberFromValue = '';
      this.serialNumberToValue = '';
    }
  }
  getSearchLOVData(searchType: string) {
    if (searchType !== '') {

      this.commonService.getSearchLOV('IU').subscribe(
        (result: any) => {

          for (const listElement of this.searchFieldData) {
            if (listElement.lovType === 'IuCode') {
              listElement.list = [{
                label: ' Please Select',
                value: ''
              }];
              if (result.status === 200) {
                if (result.result) {
                  const data = result.result;
                  for (const lovItem of data) {
                    listElement.list.push({
                      label: lovItem.code,
                      value: String(lovItem.id),
                    });
                  }
                }
              }
            }
          }
      })
      this.commonService
        .getLookupLOV('Entity')
        .subscribe((result: any) => {
          for (const listElement of this.searchFieldData) {
            if (listElement.lovType === 'entity') {
              listElement.list = [{
                label: ' Please Select',
                value: ''
              }];
              if (result.status === 200) {
                if (result.result) {
                  const data = result.result;
                  for (const lovItem of data) {
                    listElement.list.push({
                      label: lovItem.lookupValue,
                      value: lovItem.lookupValue,
                    });
                  }
                }
              }
            }
          }
      });
      this.commonService.getMaterialStatusLOV().subscribe(
        (result: any) => {
            for (const listElement of this.searchFieldData) {
              if (listElement.lovType === 'status') {
                listElement.list = [{
                  label: ' Please Select',
                  value: ''
                }];
                if(result.status === 200){
                  if(result.result){
                    const data = result.result;
                    for(const lovItem of data){
                      listElement.list.push({
                        label: lovItem.materialStatusName,
                        value: lovItem.materialStatusId
                      });
                    }
                  }
                }
              }
            }
        })
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
