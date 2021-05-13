import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-cc-review-search-bar',
  templateUrl: './cc-review-search-bar.component.html',
  styleUrls: ['./cc-review-search-bar.component.css']
})
export class CcReviewSearchBarComponent implements OnInit, OnDestroy {

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

    // ngModel values 
    cycleCountValue: string;
    itemNameValue: string;
    revisionNumberValue:string;
    lpnNumberValue:string;
    lgValue:string;
    locValue:string;
    taskStatusValue:string;
    userNameValue:string;
    countDateValue:string;
    approvalTypeValue:string;
    taskStatusArray:any = [];
    approvalTypeArray:any = [];


    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(public commonService: CommonService) {}

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
    ngOnDestroy(){
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe ? this.searchdataArrayUnsubscribe.unsubscribe() : '';
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

                if (this.cycleCountValue !== '' && fieldData.lovType === 'cycleCountId') {
                    this.tempArray[fieldData.key] = this.cycleCountValue;
                }
                if (this.itemNameValue !== '' && fieldData.lovType === 'itemName') {
                    this.tempArray[fieldData.key] = this.itemNameValue;
                }
                if (this.revisionNumberValue !== '' && fieldData.lovType === 'revisionNumber') {
                    this.tempArray[fieldData.key] = this.revisionNumberValue;
                }
                if (this.lpnNumberValue !== '' && fieldData.lovType === 'lpnNumber') {
                    this.tempArray[fieldData.key] = this.lpnNumberValue;
                }
                if (this.lgValue !== '' && fieldData.lovType === 'lgCode') {
                    this.tempArray[fieldData.key] = this.lgValue;
                }
                if (this.locValue !== '' && fieldData.lovType === 'locCode') {
                    this.tempArray[fieldData.key] = this.locValue;
                }
                if (this.taskStatusValue !== '' && fieldData.lovType === 'taskStatusCode') {
                    this.tempArray[fieldData.key] = this.taskStatusValue;
                }
                if (this.userNameValue !== '' && fieldData.lovType === 'userName') {
                    this.tempArray[fieldData.key] = this.userNameValue;
                }
                
                if ( this.countDateValue !== '' && this.dateFormat(this.countDateValue) !== '' && fieldData.lovType === 'countDate' ){
                    this.tempArray[fieldData.key] = this.dateFormat(this.countDateValue);
                  }
                if (this.approvalTypeValue !== '' && fieldData.lovType === 'approvalType') {
                    this.tempArray[fieldData.key] = this.approvalTypeValue;
                }
            // }
        }

        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick : true
        };
        this.commonService.getsearhForMasters(this.finalArray); 
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
      }
      clearDateField(){
        this.countDateValue = ''; 
      }
    clearSearchFields() {
        this.itemNameValue = '';
        this.revisionNumberValue = '';
        this.lpnNumberValue = '';
        this.lgValue = '';
        this.locValue = '';
        this.taskStatusValue = '';
        this.userNameValue = '';
        this.countDateValue = '';
        this.approvalTypeValue = '';
        this.taskStatusArray = [];
        this.approvalTypeArray = [];
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

                                    // for po status
                                    if (listElement.lovType === 'taskStatusCode') {
                                        if(!this.taskStatusArray.includes(lovItem.TaskStatusValue)){
                                            this.taskStatusArray.push(lovItem.TaskStatusValue);
                                            listElement.list.push({
                                                label: lovItem.TaskStatusValueDesc,
                                                value: lovItem.TaskStatusValue
                                            });
                                        } else {}
                                    }

                                    // for po number
                                    if (listElement.lovType === 'approvalType') {
                                        if(!this.approvalTypeArray.includes(lovItem.ApprovalTypeValue)){
                                            this.approvalTypeArray.push(lovItem.ApprovalTypeValue);
                                            listElement.list.push({
                                                label: lovItem.ApprovalTypeValueDesc,
                                                value: lovItem.ApprovalTypeValue
                                            });
                                        } else {}
                                    }
                                }
                                listElement.list  =  listElement.list.sort((a, b) =>  a.label ? a.label.localeCompare(b.label) :  a.label)

                            } 
                        }
                    }
                },
                (error: any) => { 
                }
            );
        }
    }

    sort (array) {
            return array.sort((a, b) => {
            // convert to strings and force lowercase
            a = typeof a === 'string' ? a.toLowerCase() : a.toString();
            b = typeof b === 'string' ? b.toLowerCase() : b.toString();
            return a.localeCompare(b);
        });
    }

}