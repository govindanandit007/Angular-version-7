import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { JobScheduleService } from 'src/app/_services/settings/job-schedule.service';


@Component({
  selector: 'app-job-history-search',
  templateUrl: './job-history-search.component.html',
  styleUrls: ['./job-history-search.component.css']
})
export class JobHistorySearchComponent implements OnInit, OnDestroy {
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

 
  firstDate =  new Date();
  secondDate =  new Date();
  firstTime : string = '00:00';
  secondTime : string = '00:00';
   

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(public commonService: CommonService, public jobScheduleService: JobScheduleService) { }

  ngOnInit() {
    this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
      // this.clearSearchFields();
      if (data.searchArray) {
        this.searchFieldData = [];
        this.searchType = data.searchType;
        this.searchDataType = data.type;
        this.searchLabel = data.searchFor;
        for (const fieldData of data.searchArray) {
          this.searchFieldData.push(fieldData);
        }
      }
      
      
    });
  }

  hideSearchContainer() {
    this.searchComponentToggle.emit(this.hideSearch);
  }

  onStartDateChanged(){
   
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
    
        
        if ( (this.firstDate !== null && this.dateFormat(this.firstDate) !== '' && fieldData.lovType === 'firstDate') || 
             (this.firstTime !== null && fieldData.lovType === 'firstTime') ){
            this.tempArray.startTime = this.dateFormat(this.firstDate) + ' ' + this.firstTime + ':00';
        }

        if ( (this.secondDate !== null && this.dateFormat(this.secondDate) !== '' && fieldData.lovType === 'secondDate') || 
              (this.secondTime !== null && fieldData.lovType === 'secondTime') ){
            this.tempArray.finishTime = this.dateFormat(this.secondDate) + ' ' + this.secondTime + ':00';
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
   this.firstDate  = null;
   this.secondDate = null;
   this.firstTime  = null;
   this.secondTime = null;
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }

 
  ngOnDestroy() {
    this.commonService.searhForMasters({});
    this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
  }


}

