import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-job-list-search',
  templateUrl: './job-list-search.component.html',
  styleUrls: ['./job-list-search.component.css']
})
export class JobListSearchComponent implements OnInit {

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

  jobNameValue: string;
  jobNameArray: any  = [];
  jobTypeValue: string;
  jobTypeArray: any  = [];
  jobIntervalValue: string;
  jobIntervalArray: any  = [];
  jobStatusValue: string;
  jobStatusArray: any  = [];


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

        if (this.jobTypeValue !== '' && fieldData.lovType === 'jobType') {
          this.tempArray[fieldData.key] = this.jobTypeValue;
        }

        if (this.jobNameValue !== '' && fieldData.lovType === 'jobName') {
          this.tempArray[fieldData.key] = this.jobNameValue;
        }

        if (this.jobIntervalValue !== '' && fieldData.lovType === 'jobInterval') {
          this.tempArray[fieldData.key] = this.jobIntervalValue;
        }

        if (this.jobStatusValue !== '' && fieldData.lovType === 'jobStatus') {
          this.tempArray[fieldData.key] = this.jobStatusValue;
        }


    }
    this.finalArray = {
      searchType: this.searchType,
      searchArray: this.tempArray,
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(this.finalArray);
    console.log(this.finalArray);
  }

  clearSearchFields() {
    this.jobTypeValue = '';
    this.jobTypeArray = [];

    this.jobNameValue = '';
    this.jobNameArray = [];

    this.jobIntervalValue = '';
    this.jobIntervalArray = [];

    this.jobStatusValue = '';
    this.jobStatusArray = [];

    for (const listElement of this.searchFieldData) {
      listElement.enable = true;
    }

    if (
      String(JSON.parse(localStorage.getItem('userDetails')).userId) === '-1' ||  this.companyKey === '' ) {
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

                  // for Job Type
                  if (listElement.lovType === 'jobType') {
                    if (!this.jobTypeArray.includes(lovItem.jobType)) {
                      this.jobTypeArray.push(lovItem.jobType);
                      listElement.list.push({
                        label: lovItem.jobTypeName,
                        value: String(lovItem.jobType)
                      });
                    } else { }
                  }

                  // for Interval values
                  if (listElement.lovType === 'jobInterval') {
                    if (!this.jobNameArray.includes(lovItem.jobInterval)) {
                      this.jobNameArray.push(lovItem.jobInterval);
                      listElement.list.push({
                        label: lovItem.jobIntervalName,
                        value: String(lovItem.jobInterval)
                      });
                    } else { }
                  }

                  // for status
                  if (listElement.lovType === 'jobStatus') {
                    if (!this.jobStatusArray.includes(lovItem.jobStatus) && lovItem.jobStatus !== null) {
                      this.jobStatusArray.push(lovItem.jobStatus);
                      listElement.list.push({
                        label: lovItem.jobStatusName,
                        value: String(lovItem.jobStatus)
                      });
                    } else { }
                  }


                }
                listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
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
