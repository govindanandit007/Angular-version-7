import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { SystemOptionService } from 'src/app/_services/settings/system-option.service';

@Component({
  selector: 'app-system-option-search',
  templateUrl: './system-option-search.component.html',
  styleUrls: ['./system-option-search.component.css']
})
export class SystemOptionSearchComponent implements OnInit, OnDestroy {

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
  ouValue: string;
  ouCodeArray: any = [];
  sysOptNameValue: string;
  sysOptNameArray: any = [];

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  @Input() isIU: boolean;
  constructor(public commonService: CommonService,
  public systemOptionService: SystemOptionService,) { }

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

        if (fieldData.lovType === 'IuCode') {
          this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
        }

        if (this.ouValue !== '' && fieldData.lovType === 'ouCode') {
          this.tempArray[fieldData.key] = this.ouValue;
        }

        if (this.sysOptNameValue !== '' && fieldData.lovType === 'sysOptionName') {
          this.tempArray[fieldData.key] = this.sysOptNameValue;
        }

      
    }
     
    if(this.isIU){
      delete this.tempArray.ouId;
    }
    if(!this.isIU){
      delete this.tempArray.iuId;
    }
    
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
     
    this.commonService.getsearhForMasters(this.finalArray); 
  }

  clearSearchFields() {
    // this.IuValue = '';
    this.IuCodeArray = [];

    this.ouValue = '';
    this.ouCodeArray = [];
 
    this.sysOptNameValue = '';
    this.sysOptNameArray = [];

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
              for (const listElement of this.searchFieldData) {

                for (const lovItem of data) {
                  listElement.value = lovItem.id;

                  // for IU code
                  if (listElement.lovType === 'IuCode') {
                    if (!this.IuCodeArray.includes(lovItem.iuId)) {
                      this.IuCodeArray.push(lovItem.iuId);
                      listElement.list.push({
                        label: lovItem.iuCode,
                        value: String(lovItem.iuId)
                      });
                    } else { }
                  }

                  // for Item values
                  if (listElement.lovType === 'ouCode') {
                    if (!this.ouCodeArray.includes(lovItem.ouId)) {
                      this.ouCodeArray.push(lovItem.ouId);
                      listElement.list.push({
                        label: lovItem.ouCode,
                        value: String(lovItem.ouId)
                      });
                    } else { }
                  }

                  // for Serial Number
                  if (listElement.lovType === 'sysOptionName') {
                    if (!this.sysOptNameArray.includes(lovItem.sysOptionId)) {
                      this.sysOptNameArray.push(lovItem.sysOptionId);
                      listElement.list.push({
                        label: lovItem.sysOptionName,
                        value: String(lovItem.sysOptionId)
                      });
                    } else { }
                  }


                }
                listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
              } 
            }
          }

        },
        (error: any) => {
          //console.log(error.error.message);
        }
      );
   
    }
  }

  

  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }


}
