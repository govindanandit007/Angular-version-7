import { CommonService } from './../../../_services/common/common.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/_services/warehouse/task.service';

@Component({
    selector: 'app-task-search',
    templateUrl: './task-search.component.html',
    styleUrls: ['./task-search.component.css']
})
export class TaskSearchComponent implements OnInit, OnDestroy {
    searchLabel = '';
    searchFieldData = [];
    searchType = '';
    searchDataType = '';
    public hideSearch = false;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchdataArrayUnsubscribe: any = '';
    pickSlipNumber: any = '';
    taskNumber: any = '';
    taskStatus: any = '';
    iuCode: any = '';
    itemName: any = '';
    taskLg: any = '';
    revisionNumber: any = '';
    shipmentNumber: any = '';
    salesOrder: any = '';
    workOrder: any = '';
    waveNumber: any = '';
    employee: any = '';
    cycleCountName: any = '';
    tempArray: any = {};
    finalArray: any = {};
    companyKey = '';
    taskType: any = '';
    taskTypeArray: any = [];
    taskIuCodeArray: any = [];
    taskStatusCodeArray: any = [];
    replenishmentNum: any = '';

    constructor(public commonService: CommonService,private taskService: TaskService,) {}

    ngOnInit() {

        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe(
            (data: any) => {
                if (
                 !localStorage.getItem('taskSearchArray') &&
                 !localStorage.getItem('taskDtailPage')
             ) {
                this.clearSearchFields();
             }
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

                if (
                    this.searchDataType !== '' &&
                    this.searchDataType !== undefined
                ) {
                    this.getSearchLOVData(this.searchDataType);
                }

                if (
                    this.searchDataType !== '' &&
                    this.searchDataType !== undefined &&
                    data.lovSearchFromAdd_update === true
                ) {
                    data.lovSearchFromAdd_update = false;
                    this.commonService.searhForMasters(data);
                    this.getSearchLOVData(this.searchDataType);
                }
            }
        );

             if (
                 localStorage.getItem('taskSearchArray') &&
                 localStorage.getItem('taskDtailPage')
             ) {
                 this.SearchFieldValueFill(
                     JSON.parse(localStorage.getItem('taskSearchArray'))
                         .searchArray
                 );
             }
    }
    SearchFieldValueFill(searchArray){ 
        if(searchArray.pickSlipNumber){
            this.pickSlipNumber = searchArray.pickSlipNumber;
        }
        if (searchArray.taskNumber) {
            this.taskNumber = searchArray.taskNumber;
        }
        if(searchArray.taskStatus){
            this.taskStatus = searchArray.taskStatus;
        }
        if (searchArray.iuCode) {
            this.iuCode = searchArray.iuCode;
        }
        if (searchArray.taskType) {
            this.taskType = searchArray.taskType;
        }
        if (searchArray.itemName) {
            this.itemName = searchArray.itemName;
        }
        if (searchArray.taskLg) {
            this.taskLg = searchArray.taskLg;
        }
        if (searchArray.revisionNumber) {
            this.revisionNumber = searchArray.revisionNumber;
        }
        if (searchArray.shipmentNumber) {
            this.shipmentNumber = searchArray.shipmentNumber;
        }
        if (searchArray.salesOrder) {
            this.salesOrder = searchArray.salesOrder;
        }
        if (searchArray.workOrder) {
            this.workOrder = searchArray.workOrder;
        }
        if (searchArray.waveNumber) {
            this.waveNumber = searchArray.waveNumber;
        }
        if (searchArray.employee) {
            this.employee = searchArray.employee;
        }
        if (searchArray.replenishmentNum) {
            this.replenishmentNum = searchArray.replenishmentNum;
        }
        if (searchArray.cycleCountName) {
            this.cycleCountName = searchArray.cycleCountName;
        }
    }
    ngOnDestroy() {
        this.commonService.searhForMasters({});
        this.searchdataArrayUnsubscribe
            ? this.searchdataArrayUnsubscribe.unsubscribe()
            : '';
    }

    // Hide Search Bar
    hideSearchContainer() {
        this.searchComponentToggle.emit(this.hideSearch);
    }

    // Get Search Options
    getSearhInfo() {
        this.tempArray = {}; 
        for (const fieldData of this.searchFieldData) {
            if (
                this.pickSlipNumber ||
                this.taskNumber ||
                this.taskStatus ||
                this.iuCode ||
                this.itemName ||
                this.taskLg ||
                this.revisionNumber ||
                this.shipmentNumber ||
                this.salesOrder ||
                this.workOrder ||
                this.waveNumber ||
                this.employee ||
                this.cycleCountName ||
                this.taskType ||
                this.replenishmentNum
            ) {
                if (
                    this.pickSlipNumber !== '' &&
                    fieldData.lovType === 'pickSlipNumber'
                ) {
                    this.tempArray[fieldData.key] = this.pickSlipNumber;
                } else if (
                    this.taskNumber !== '' &&
                    fieldData.lovType === 'taskNumber'
                ) {
                    this.tempArray[fieldData.key] = this.taskNumber;
                } else if (
                    this.taskStatus !== '' &&
                    fieldData.lovType === 'taskStatus'
                ) {
                    this.tempArray[fieldData.key] = this.taskStatus;
                } else if (
                    fieldData.lovType === 'iuCode'
                ) {
                    this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                } else if (
                    this.itemName !== '' &&
                    fieldData.lovType === 'itemName'
                ) {
                    this.tempArray[fieldData.key] = this.itemName;
                }  else if (
                    this.taskLg !== '' &&
                    fieldData.lovType === 'taskLg'
                ) {
                    this.tempArray[fieldData.key] = this.taskLg;
                }else if (
                    this.revisionNumber !== '' &&
                    fieldData.lovType === 'revisionNumber'
                ) {
                    this.tempArray[fieldData.key] = this.revisionNumber;
                } else if (
                    this.shipmentNumber !== '' &&
                    fieldData.lovType === 'shipmentNumber'
                ) {
                    this.tempArray[fieldData.key] = this.shipmentNumber;
                } else if (
                    this.salesOrder !== '' &&
                    fieldData.lovType === 'salesOrder'
                ) {
                    this.tempArray[fieldData.key] = this.salesOrder;
                }else if (
                    this.workOrder !== '' &&
                    fieldData.lovType === 'workOrder'
                ) {
                    this.tempArray[fieldData.key] = this.workOrder;
                } else if (
                    this.waveNumber !== '' &&
                    fieldData.lovType === 'waveNumber'
                ) {
                    this.tempArray[fieldData.key] = this.waveNumber;
                } else if (
                    this.employee !== '' &&
                    fieldData.lovType === 'employee'
                ) {
                    this.tempArray[fieldData.key] = this.employee;
                } else if (
                    this.cycleCountName !== '' &&
                    fieldData.lovType === 'cycleCountName'
                ) {
                    this.tempArray[fieldData.key] = this.cycleCountName;
                } else if (
                    this.taskType !== '' &&
                    fieldData.lovType === 'tasktype'
                ) {
                    this.tempArray[fieldData.key] = this.taskType;
                } else if (
                    this.replenishmentNum !== '' &&
                    fieldData.lovType === 'replenishmentNum'
                ) {
                    this.tempArray[fieldData.key] = this.replenishmentNum;
                } else {
                }
            }
        }
        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick: true
        };
        window.localStorage.setItem(
            'taskSearchArray',
            JSON.stringify(this.finalArray)
        );
        this.commonService.getsearhForMasters(this.finalArray); 
    }

    //
    getSearchLOVData(searchType: string) {
        if (searchType !== '') {
            this.commonService.getSearchLOV(searchType).subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        if (result.result) {
                            const data = result.result; 
                            for (const listElement of this.searchFieldData) {
                                for (const lovItem of data) {
                                    // for IU
                                    if (listElement.lovType === 'taskStatus') {
                                        // listElement.list.push({
                                        //   label: lovItem.statusName,
                                        //   value: String(lovItem.statusId)
                                        // });
                                        if (
                                            !this.taskStatusCodeArray.includes(
                                                lovItem.statusCode
                                            )
                                        ) {
                                            this.taskStatusCodeArray.push(
                                                lovItem.statusCode
                                            );
                                            listElement.list.push({
                                                label: lovItem.statusName,
                                                value: String(
                                                    lovItem.statusCode
                                                )
                                            });
                                        } else {
                                        }
                                    }
                                    if (listElement.lovType === 'iuCode') {
                                        if (
                                            !this.taskIuCodeArray.includes(
                                                lovItem.iuId
                                            )
                                        ) {
                                            this.taskIuCodeArray.push(
                                                lovItem.iuId
                                            );
                                            listElement.list.push({
                                                label: lovItem.iuCode,
                                                value: String(lovItem.iuId)
                                            });
                                        } else {
                                        }
                                    }

                                    if (listElement.lovType === 'tasktype') {
                                        if (
                                            !this.taskTypeArray.includes(
                                                lovItem.taskType
                                            )
                                        ) {
                                            this.taskTypeArray.push(
                                                lovItem.taskType
                                            );
                                            listElement.list.push({
                                                label: lovItem.taskTypeName,
                                                value: String(lovItem.taskType)
                                            });
                                        } else {
                                        }
                                    }
                                    // if (listElement.lovType === 'revisionNumber') {
                                    //   listElement.list.push({
                                    //     label: lovItem.revisionNumber,
                                    //     value: String(lovItem.revisionId)
                                    //   });
                                    // }
                                }
                                listElement.list = listElement.list.sort(
                                    (a, b) =>
                                        a.label
                                            ? a.label.localeCompare(b.label)
                                            : a.label
                                );
                            } 
                        }
                    }
                },
                (error: any) => {
                   // console.log(error.error.message);
                }
            );


        }
    }

    // Clear Search Options
    clearSearchFields() {
        this.pickSlipNumber = '';
        this.taskNumber = '';
        this.taskStatus = '';
        // this.iuCode = '';
        this.itemName = '';
        this.taskLg = ''
        this.revisionNumber = '';
        this.shipmentNumber = '';
        this.salesOrder = '';
        this.workOrder = '';
        this.waveNumber = '';
        this.employee = '';
        this.cycleCountName = '';
        this.taskType = '';
        this.replenishmentNum = '';
        this.taskIuCodeArray = [];
        this.taskTypeArray = [];
        this.taskStatusCodeArray = [];
    }
}

