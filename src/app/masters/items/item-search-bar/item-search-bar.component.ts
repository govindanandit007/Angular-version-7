import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
export interface User {
  label: string;
  value?: string;
}
@Component({
  selector: 'app-item-search-bar',
  templateUrl: './item-search-bar.component.html',
  styleUrls: ['./item-search-bar.component.css']
})
export class ItemSearchBarComponent implements OnInit, OnDestroy {
  searchFieldData = [];
    searchType = '';
    searchLabel = '';
    public hideSearch = false;
    tempArray: any = {};
    finalArray: any = {};
    companyKey = '';
    searchDataType = '';
    seachLOVItem: string;
    searchdataArrayUnsubscribe: any;
    is3plCompany: any = [];
    // ngModel values defines--

    codeValue: string;
    xrefItemBarcode: string;
    revsnNumber: string;
    nameValue: string;
    customerValue: string;
    invCodeValue: string;
    lgCodeValue: string;
    enableValue: string;
    classValue: string;
    ouIuValue: string;

    codeArray : any = [{
        label: ' Please Select',
        value: ''
    }];
    nameArray : any = [{
        label: ' Please Select',
        value: ''
    }];

    myControl = new FormControl();

    options: User[] = [
        {label: 'Mary', value: '1'},
        {label: 'Shelley', value: '2'},
        {label: 'Igor', value: '3'}
      ];
    filteredOptions: Observable<User[]>;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(public commonService: CommonService) {}
    
    ngOnInit() {
        this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
            this.clearSearchFields();
            if (data.searchArray) {

                if (data.searchArray[0].type ==='selectionChangeLOV' ){
                    data.searchArray[1].list = data.searchArray[1].list[0]
                }
                this.searchFieldData = [];
                this.codeArray = [{
                    label: ' Please Select',
                    value: ''
                }];
                this.nameArray = [{
                    label: ' Please Select',
                    value: ''
                }];
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

        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(label => label ? this._filter(label) : this.options.slice())
        );
    }

    ngOnDestroy(){
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
    }

    displayFn(user?: User): string | undefined {
      return user ? user.label : undefined;
      }

        private _filter(label: string): User[] {
          const filterValue = label.toLowerCase();
          return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
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
                if (this.codeValue !== '' &&
                    (fieldData.lovType === 'code' || fieldData.lovType === 'name')
                ) {
                  this.tempArray[fieldData.key] = this.codeValue;
                }
                if (this.customerValue !== '' &&
                    (fieldData.lovType === 'customer')
                ) {
                  this.tempArray[fieldData.key] = this.customerValue;
                }

                if (
                    this.enableValue !== '' &&
                    fieldData.lovType === 'enableFlag'
                ) {
                    this.tempArray[fieldData.key] = this.enableValue;
                }
                if (this.xrefItemBarcode !== '' && fieldData.lovType === 'xrefItemBarcode')
                {
                    this.tempArray[fieldData.key] = this.xrefItemBarcode;
                }
                if (this.revsnNumber !== '' && fieldData.lovType === 'revsnNumber')
                {
                    this.tempArray[fieldData.key] = this.revsnNumber;
                }

            }
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
        this.invCodeValue = '';
        this.lgCodeValue = '';
        this.codeValue = '';
        this.customerValue = '';
        this.nameValue = '';
        this.enableValue = '';
        this.classValue = '';
        this.ouIuValue = '';
        this.xrefItemBarcode = '';
        this.revsnNumber = '';

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
                                                lgId : lovItem.lgId,
                                                iuId : lovItem.iuId

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
                                        } else if (listElement.lookupType === 'lookupDes'){
                                            listElement.list.push({
                                                label: lovItem.name,
                                                value: String(listElement.value)
                                            });
                                        }else {
                                            listElement.list.push({
                                                label: lovItem.name,
                                                value: String(listElement.value)
                                            });
                                            this.nameArray.push({
                                                label: lovItem.name,
                                                value: String(listElement.value),
                                                lgId : lovItem.lgId,
                                                iuId : lovItem.iuId
                                            });
                                        }
                                    }


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

    getDependentList(event, fieldValue, typeValue) {
        if (typeValue === 'code' && event.source.selected) {
            this.nameValue = String(fieldValue);
        }
        if (typeValue === 'name' && event.source.selected) {
            this.codeValue = String(fieldValue);
        }
    }

}
