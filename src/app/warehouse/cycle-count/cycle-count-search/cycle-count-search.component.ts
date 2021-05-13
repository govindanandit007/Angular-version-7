import { CommonService } from './../../../_services/common/common.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CycleCountService } from 'src/app/_services/warehouse/cycle-count.service';

@Component({
  selector: 'app-cycle-count-search',
  templateUrl: './cycle-count-search.component.html',
  styleUrls: ['./cycle-count-search.component.css']
})
export class CycleCountSearchComponent implements OnInit, OnDestroy {
  searchLabel = '';
  searchFieldData = [];
  searchType = '';
  searchDataType = '';
  public hideSearch = false;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchdataArrayUnsubscribe: any = '';
  cycleCount:any = '';
  cycleCountLG:any = '';
  cycleCountIU:any = '';
  tempArray: any = {};
  finalArray: any = {};
  companyKey = '';

  constructor(
    public commonService: CommonService,
    public cycleCountService: CycleCountService
  ) { }

  ngOnInit() {
    this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
      this.clearSearchFields();
      if (data.searchArray) {
        this.searchFieldData = [];
        this.searchType = data.searchType;
        this.searchDataType = data.type;
        this.searchLabel = data.searchFor;
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

  // Hide Search Bar
  hideSearchContainer() {
    this.searchComponentToggle.emit(this.hideSearch);
  }

  ngOnDestroy(){
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }

  // Get Search Options
  getSearhInfo() {
    this.tempArray = {};

        for (const fieldData of this.searchFieldData) {
            // if (this.cycleCount || this.cycleCountIU || this.cycleCountLG) {
                if(fieldData.lovType === 'cycle-count-name' && this.cycleCount!== '') {
                  this.tempArray[fieldData.key] = this.cycleCount;
                } else if(fieldData.lovType === 'cycle-count-IU') {
                  this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                } else if(fieldData.lovType === 'cycle-count-LG' && this.cycleCountLG!== '') {
                  this.tempArray[fieldData.key] = this.cycleCountLG;
                } else { }
            // }
        }
        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick: true
        };
        this.commonService.getsearhForMasters(this.finalArray); 
  }

  //
  getSearchLOVData(searchType: string) {
      
    if (searchType !== '') {
      this.commonService.getIULOV().subscribe(
        (result: any) => {
          if (result.status === 200) {
            if (result.result) {
              const data = result.result; 
              for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'cycle-count-IU') {
                 for (const lovItem of data) {
                      if (lovItem.iuEnabledFlag === 'Y') {
                        listElement.list.push({
                          label: lovItem.iuCode,
                          value: String(lovItem.iuId)
                        });
                      }
                  }
                  listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
                }

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

  // Clear Search Options
  clearSearchFields() {
    this.cycleCount     = '';
    this.cycleCountLG   = '';
    // this.cycleCountIU   = '';
  }

}
