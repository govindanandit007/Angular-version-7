import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { DatePipe } from '@angular/common';
import { OutboundLpnService } from 'src/app/_services/outbound/outbound-lpn.service';

@Component({
  selector: 'app-outbound-lpn-search',
  templateUrl: './outbound-lpn-search.component.html',
  styleUrls: ['./outbound-lpn-search.component.css']
})
export class OutboundLpnSearchComponent implements OnInit {
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
  
    iuCodeValue: any = '';
    iuCodeArray: any = [];
    lpnStatusValue: any = '';
    lpnStatusArray: any = [];
    lpnNumValue: any = '';
    soNumValue: any = '';
    shipmentNumValue: any = '';
    waveNumValue: any = '';
    itemValue: any = '';
    palletNumValue: any = '';
    batchNumValue: any = '';
    serialFromValue: any = '';
    serialToValue: any = '';
   
  
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(public commonService: CommonService, public outboundLpnService: OutboundLpnService) { }
  
    ngOnInit() {
      this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
        this.clearSearchFields();
        if (data.searchArray) {
          this.searchFieldData = [];
          this.searchType = data.searchType;
          this.searchDataType = data.type;
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
          if (this.iuCodeValue !== '' && fieldData.lovType === 'iuId') {
              this.tempArray.iuId = this.iuCodeValue;
          }
          if (this.lpnStatusValue !== '' && fieldData.lovType === 'lpnStatus') {
            this.tempArray.lpnStatus = this.lpnStatusValue;
          }
          if (this.lpnNumValue !== '' && fieldData.lovType === 'lpnNumber') {
            this.tempArray.lpnNumber = this.lpnNumValue;
          }
          if (this.soNumValue !== '' && fieldData.lovType === 'soNumber') {
            this.tempArray.soNumber = this.soNumValue;
          }
          if (this.shipmentNumValue !== '' && fieldData.lovType === 'shipmentNumber') {
            this.tempArray.shipmentNumber = this.shipmentNumValue;
          }
          if (this.waveNumValue !== '' && fieldData.lovType === 'waveNumber') {
            this.tempArray.waveNumber = this.waveNumValue;
          }
          if (this.itemValue !== '' && fieldData.lovType === 'itemName') {
            this.tempArray.itemName = this.itemValue;
          }
          if (this.palletNumValue !== '' && fieldData.lovType === 'palletNumber') {
            this.tempArray.palletNumber = this.palletNumValue;
          }
          if (this.batchNumValue !== '' && fieldData.lovType === 'batchNumber') {
            this.tempArray.batchNumber = this.batchNumValue;
          }
          if (this.serialFromValue !== '' && fieldData.lovType === 'SerialFrom' || 
              this.serialToValue !== '' && fieldData.lovType === 'SerialTo') {
              this.tempArray['serialNumber'] = (this.serialToValue === '') ? 
              this.serialFromValue : this.serialFromValue + '-' + this.serialToValue;
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
                   
                    // For IU Code
                    if (listElement.lovType === 'iuId') {
                      if (!this.iuCodeArray.includes(lovItem.iuId)) {
                        this.iuCodeArray.push(lovItem.iuId);
                        listElement.list.push({
                          label: lovItem.iuCode,
                          value: String(lovItem.iuId)
                        });
                      } else { }
                    }

                    // For Lpn Status
                    if (listElement.lovType === 'lpnStatus') {
                      if (!this.lpnStatusArray.includes(lovItem.lookupValue)) {
                        this.lpnStatusArray.push(lovItem.lookupValue);
                        listElement.list.push({
                          label: lovItem.lookupValueDesc,
                          value: String(lovItem.lookupValue)
                        });
                      } else { }
                    }
  
  
                    listElement.list     =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)
                   
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
  
    clearSearchFields() {
      this.iuCodeValue        = '';
      this.iuCodeArray        = [];
      this.lpnStatusValue     = '';
      this.lpnStatusArray     = [];
      this.lpnNumValue        = '';
      this.soNumValue         = '';
      this.shipmentNumValue   = '';
      this.waveNumValue       = '';
      this.itemValue          = '';
      this.palletNumValue     = '';
      this.batchNumValue      = '';
      this.serialFromValue    = '';
      this.serialToValue      = '';
    }
  
    dateFormat(dateData: any) {
      const dp = new DatePipe(navigator.language);
      const p = 'y-MM-dd'; // YYYY-MM-DD
      const dtr = dp.transform(new Date(dateData), p);
      return dtr;
    }
  
  
  
    sort (array) {
      return array.sort((a, b) => {
        // convert to strings and force lowercase
        a = typeof a === 'string' ? a.toLowerCase() : a.toString();
        b = typeof b === 'string' ? b.toLowerCase() : b.toString();
        return a.localeCompare(b);
    });
  
  
    }
  
  
    ngOnDestroy() {
      this.commonService.searhForMasters({});
      this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
    }
  
  
  
  
  }
  