import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { StockLocatorService } from 'src/app/_services/stock-locator.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
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
    nameValue: string;
    invCodeValue: string;
    lgMaterialStatusValue: string;
    slMaterialStatusValue: string;
    lgCodeValue: string;
    customerValue: string;
    enableValue: string;
    enableValue2: string;
    activityBillingFlag: string;
    mfgFlag: string;
    ymsFlag: string;
    expressLabelFlag: string;
    classValue: string;
    ouValue: string;
    iuValue: string;
    slNameValue: string;
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
    materialStatusLovList: any = [{
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
    constructor(public commonService: CommonService, private stockLocatorService: StockLocatorService, private subInventorys: SubInventoryService,) { }

    ngOnInit() {
        this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
        this.stockLocatorService.defaultIuDataObservable.subscribe((data: any) => {
            
            this.invCodeValue = String(data);
        });
        this.subInventorys.defaultIuDataObservable.subscribe((data: any) => {
             
            this.iuValue = String(data);
        });
        this.materialStatusLOV();
        this.searchdataArrayUnsubscribe = this.commonService.searchdataArray.subscribe((data: any) => {
            this.clearSearchFields();
            if (data.searchArray) {
                if (data.type === 'IU') {
                    this.commonService.getSearchLOV('OU').subscribe(
                        (result: any) => {
                            this.ouLovinIUSearch = [{
                                label: ' Please Select',
                                value: ''
                            }];
                            if (result.status === 200) {
                                if (result.result) {
                                    const data = result.result;
                                    for (const lovItem of data) {
                                        this.ouLovinIUSearch.push({
                                            label: lovItem.code,
                                            value: String(lovItem.id),
                                        });
                                    }
                                }
                            }
                        })
                }
                if (data.type === 'LG') {
                    this.commonService.getSearchLOV('IU').subscribe(
                        (result: any) => {
                            this.iuLovinLGSearch = [{
                                label: ' Please Select',
                                value: ''
                            }];
                            if (result.status === 200) {
                                if (result.result) {
                                    const data = result.result;
                                    for (const lovItem of data) {
                                        this.iuLovinLGSearch.push({
                                            label: lovItem.code,
                                            value: String(lovItem.id),
                                        });
                                    }
                                }
                            }
                        })
                }
                if (data.type === 'SL') {
                    this.commonService.getSearchLOV('IU').subscribe(
                        (result: any) => {
                            this.iuLovinSLSearch = [{
                                label: ' Please Select',
                                value: ''
                            }];
                            if (result.status === 200) {
                                if (result.result) {
                                    const data = result.result;
                                    for (const lovItem of data) {
                                        this.iuLovinSLSearch.push({
                                            label: lovItem.code,
                                            value: String(lovItem.id),
                                        });
                                    }
                                }
                            }
                        })
                    this.commonService.getSearchLOV('LG').subscribe(
                        (result: any) => {
                            this.lgLovinSLSearch = [{
                                label: ' Please Select',
                                value: ''
                            }];
                            if (result.status === 200) {
                                if (result.result) {
                                    const data = result.result;
                                    for (const lovItem of data) {
                                        this.lgLovinSLSearch.push({
                                            label: lovItem.code,
                                            value: String(lovItem.id),
                                            iuId: String(lovItem.iuId)
                                        });
                                    }
                                }
                            }
                        })
                }
                // if (data.searchArray[0].type ==='selectionChangeLOV' ){
                //     data.searchArray[1].list = data.searchArray[1].list[0]
                // }
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


            if (this.searchDataType !== '' && this.searchDataType !== undefined) {
                this.getSearchLOVData(this.searchDataType);
                // this.invCodeValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                // this.iuValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
            }

            if (this.searchDataType !== '' && this.searchDataType !== undefined &&
                data.lovSearchFromAdd_update === true) {
                data.lovSearchFromAdd_update = false;
                this.commonService.searhForMasters(data);
                this.getSearchLOVData(this.searchDataType);
                // this.invCodeValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                // this.iuValue = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
            }

        });



    }
    materialStatusLOV() {
        this.commonService.getMaterialStatusLOV().subscribe(
            (result: any) => {
                this.materialStatusLovList = [{
                    label: ' Please Select',
                    value: ''
                }];
                if (result.status === 200) {
                    if (result.result) {
                        const data = result.result;
                        for (const rowData of data) {
                            this.materialStatusLovList.push({
                                value: String(rowData.materialStatusId),
                                label: rowData.materialStatusName
                            });
                        }
                    }
                }
            })
    }
    ngOnDestroy() {
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
                    fieldData.lovType === 'INVCode'
                ) {
                    this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);;
                }
                if (
                    this.lgCodeValue !== '' &&
                    fieldData.lovType === 'LocGroupCode'
                ) {
                    this.tempArray[fieldData.key] = this.lgCodeValue;
                }
                if (
                    this.lgMaterialStatusValue !== '' &&
                    fieldData.lovType === 'lgMaterialStatus'
                ) {
                    this.tempArray[fieldData.key] = this.lgMaterialStatusValue;
                }
                if (
                    this.slNameValue !== '' &&
                    fieldData.lovType === 'slName'
                ) {
                    this.tempArray[fieldData.key] = this.slNameValue;
                }

                if (
                    this.slMaterialStatusValue !== '' &&
                    fieldData.lovType === 'slMaterialStatus'
                ) {
                    this.tempArray[fieldData.key] = this.slMaterialStatusValue;
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
                if (
                    this.enableValue2 !== '' &&
                    fieldData.lovType === 'enableFlag2'
                ) {
                    this.tempArray[fieldData.key] = this.enableValue2;
                }

                if (
                    this.activityBillingFlag !== '' &&
                    fieldData.lovType === 'activityBillingFlag'
                ) {
                    this.tempArray[fieldData.key] = this.activityBillingFlag;
                }

                if (
                    this.mfgFlag !== '' &&
                    fieldData.lovType === 'mfgFlag'
                ) {
                    this.tempArray[fieldData.key] = this.mfgFlag;
                }

                if (
                    this.ymsFlag !== '' &&
                    fieldData.lovType === 'ymsFlag'
                ) {
                    this.tempArray[fieldData.key] = this.ymsFlag;
                }

                if (
                    this.expressLabelFlag !== '' &&
                    fieldData.lovType === 'expressLabelFlag'
                ) {
                    this.tempArray[fieldData.key] = this.expressLabelFlag;
                }

                if (fieldData.tpType === 'SUPP') {
                    this.tempArray.tpType = 'SUPP';
                }
                if (fieldData.tpType === 'CUST') {
                    this.tempArray.tpType = 'CUST';
                }
                if (
                    this.classValue !== '' &&
                    fieldData.lovType === 'uomClass'
                ) {
                    this.tempArray[fieldData.key] = this.classValue;
                }
                if (
                    this.ouValue !== '' &&
                    fieldData.lovType === 'iuOUCode'
                ) {
                    this.tempArray[fieldData.key] = this.ouValue;
                }
                if (
                    
                    fieldData.lovType === 'iuCode'
                ) {
                    this.tempArray[fieldData.key] = String((JSON.parse(localStorage.getItem('defaultIU'))).id);;
                }
            }
        }
        this.finalArray = {
            searchType: this.searchType,
            searchArray: this.tempArray,
            fromSearchBtnClick: true
        };
        this.commonService.getsearhForMasters(this.finalArray);
         
    }

    clearSearchFields() {
        // this.invCodeValue = '';
        this.lgCodeValue = '';
        this.slNameValue = '';
        this.codeValue = '';
        this.nameValue = '';
        this.customerValue = '';
        this.enableValue = '';
        this.enableValue2 = '';
        this.activityBillingFlag = '';
        this.mfgFlag = '';
        this.ymsFlag = '';
        this.expressLabelFlag = '';
        this.classValue = '';
        this.ouValue = '';
        this.lgMaterialStatusValue = '';
        this.slMaterialStatusValue = '';

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

                        if (result.message) {
                            for (const listElement of this.searchFieldData) {

                                if (
                                    listElement.lovType === 'iuOUCode'
                                ) {
                                    if (listElement.key === 'iuOuId') {
                                        listElement.list = this.ouLovinIUSearch
                                    }
                                    // if (listElement.key === 'lgIuId') {
                                    //     listElement.list = this.iuLovinLGSearch
                                    // }
                                }
                                if (
                                    listElement.lovType === 'iuCode'
                                ) {
                                    if (listElement.key === 'lgIuId') {
                                        listElement.list = this.iuLovinLGSearch
                                    }
                                }
                                if (
                                    listElement.lovType === 'INVCode'
                                ) {
                                    if (listElement.key === 'locIuId') {
                                        listElement.list = this.iuLovinSLSearch;
                                        this.iuCodeArray = this.iuLovinSLSearch

                                    }
                                }
                                if (
                                    listElement.lovType === 'LocGroupCode'
                                ) {
                                    if (listElement.key === 'locLgId') {
                                        listElement.list = this.lgLovinSLSearch
                                        this.lgCodeArray = this.lgLovinSLSearch
                                    }
                                }
                            }
                        }
                        if (result.result) {
                            const data = result.result; 
                            const tempArrayForINVCode = [
                                {
                                    label: ' Please Select',
                                    value: ''
                                }
                            ];
                            const tempArrayForLGCode = [
                                {
                                    label: ' Please Select',
                                    value: ''
                                }
                            ];
                            const tempArrayForClass = [
                                {
                                    label: ' Please Select',
                                    value: ''
                                }
                            ];
                            // const tempArrayForIuOuCode = [
                            //     {
                            //         label: ' Please Select',
                            //         value: ''
                            //     }
                            // ];
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
                                if (listElement.lovType !== 'enableFlag' &&
                                    listElement.lovType !== 'enableFlag2' &&
                                    listElement.lovType !== 'activityBillingFlag' &&
                                    listElement.lovType !== 'mfgFlag' &&
                                    listElement.lovType !== 'ymsFlag' &&
                                    listElement.lovType !== 'expressLabelFlag'
                                ) {
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
                                        } else if (listElement.lookupType === 'lookupDes') {
                                            listElement.list.push({
                                                label: lovItem.name,
                                                value: String(listElement.value)
                                            });
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

                                    if (listElement.lovType === 'iuAndLgCode') {
                                        if (listElement.key === 'iuId') {
                                            listElement.list.push({
                                                label: lovItem.code,
                                                value: String(listElement.value),
                                                ouId: lovItem.ouId
                                            });
                                            this.ouCodeArray.push({
                                                label: lovItem.code,
                                                value: String(listElement.value),
                                                ouId: lovItem.ouId
                                            })
                                        }

                                        if (listElement.key === 'lgId') {
                                            listElement.list.push({
                                                label: lovItem.code,
                                                value: String(listElement.value),
                                                iuId: lovItem.iuId
                                            });
                                            this.ouCodeArray.push({
                                                label: lovItem.code,
                                                value: String(listElement.value),
                                                iuId: lovItem.iuId
                                            })
                                        }

                                        // }
                                    }
                                    if (listElement.lovType === 'iuAndLgName') {
                                        if (listElement.key === 'iuId') {
                                            listElement.list.push({
                                                label: lovItem.name,
                                                value: String(listElement.value),
                                                ouId: lovItem.ouId
                                            });
                                            this.ouNameArray.push({
                                                label: lovItem.name,
                                                value: String(listElement.value),
                                                ouId: lovItem.ouId
                                            });
                                        }
                                        if (listElement.key === 'lgId') {
                                            listElement.list.push({
                                                label: lovItem.name,
                                                value: String(listElement.value),
                                                iuId: lovItem.iuId
                                            });
                                            this.ouNameArray.push({
                                                label: lovItem.name,
                                                value: String(listElement.value),
                                                iuId: lovItem.iuId
                                            });
                                        }
                                        //
                                    }
                                    // Only For Stock Locator Search Start
                                    if (listElement.lovType === 'INVCode') {

                                        listElement.list = this.iuLovinSLSearch
                                        this.iuCodeArray = this.iuLovinSLSearch
                                    }
                                    if (
                                        listElement.lovType === 'LocGroupCode'
                                    ) {

                                        listElement.list = this.lgLovinSLSearch
                                        this.lgCodeArray = this.lgLovinSLSearch
                                    }
                                    // Only For Stock Locator Search End

                                    if (
                                        listElement.lovType === 'uomClass'
                                    ) {
                                        tempArrayForClass.push({
                                            label: lovItem.uomClassName,
                                            value: lovItem.uomClassCode
                                        });
                                    }
                                    if (
                                        listElement.lovType === 'iuOUCode'
                                    ) {
                                        if (listElement.key === 'iuOuId') {
                                            listElement.list = this.ouLovinIUSearch
                                        }
                                        // if(listElement.key === 'lgIuId'){
                                        //     listElement.list = this.iuLovinLGSearch
                                        // }
                                    }
                                    if (
                                        listElement.lovType === 'iuCode'
                                    ) {
                                        // if(listElement.key === 'iuOuId'){
                                        //     listElement.list = this.ouLovinIUSearch
                                        // }
                                        if (listElement.key === 'lgIuId') {
                                            listElement.list = this.iuLovinLGSearch
                                        }
                                    }
                                }

                                if (listElement.lovType === 'uomClass') {
                                    listElement.list = tempArrayForClass.reduce(
                                        (accumulator, current) =>
                                            accumulator.some(
                                                x => x.value === current.value
                                            )
                                                ? accumulator
                                                : [...accumulator, current],
                                        []
                                    );
                                }

                                listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)

                            } 
                        }
                    }
                },
                (error: any) => { 
                }
            );
        }
    }

    getDependentList(event, fieldValue, typeValue) {
        // if (typeValue === 'INVCode' && event.source.selected) {
        //     this.invCodeValue = String(fieldValue);
        // }
        if (typeValue === 'LocGroupCode' && event.source.selected) {
            this.lgCodeValue = String(fieldValue);
        }

        if (typeValue === 'code' && event.source.selected) {
            this.nameValue = String(fieldValue);
        }
        if (typeValue === 'name' && event.source.selected) {
            this.codeValue = String(fieldValue);
        }
        if (typeValue === 'iuAndLgCode' && event.source.selected) {
            this.nameValue = String(fieldValue);
        }
        if (typeValue === 'iuAndLgName' && event.source.selected) {
            this.codeValue = String(fieldValue);
        }

    }
    OuSelectionChanged(event, fieldValue) {
        if (event.source.selected) {

            for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'iuAndLgCode') {
                    listElement.list = [{
                        label: ' Please Select',
                        value: ''
                    }];
                    if (fieldValue !== '') {
                        this.codeValue = '';
                        for (const item of this.ouCodeArray) {
                            if (item.ouId === Number(fieldValue)) {
                                listElement.list.push(item);
                            }
                            if (item.iuId === Number(fieldValue)) {
                                listElement.list.push(item);
                            }

                        }

                    } else {
                        listElement.list = this.ouCodeArray;
                    }
                }
                if (listElement.lovType === 'iuAndLgName') {
                    listElement.list = [{
                        label: ' Please Select',
                        value: ''
                    }];
                    for (const item of this.ouNameArray) {
                        if (item.ouId === Number(fieldValue)) {
                            listElement.list.push(item);
                        }
                        if (item.iuId === Number(fieldValue)) {
                            listElement.list.push(item);
                        }

                    }
                    if (fieldValue === '') {
                        listElement.list = this.ouNameArray;

                    }
                }
                listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
            }
        }
    }
    IUSelectionChangedinSL(event, fieldValue) {
        if (event.source.selected) {
            for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'LocGroupCode') {
                    listElement.list = [{
                        label: ' Please Select',
                        value: ''
                    }];
                    if (fieldValue !== '') {
                        // this.invCodeValue = '';
                        this.lgCodeValue = '';
                        for (const item of this.lgCodeArray) {
                            if (Number(item.iuId) === Number(fieldValue)) {
                                listElement.list.push(item);
                            }


                        }


                    } else {
                        listElement.list = this.lgCodeArray;
                    }
                }
                listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
            }
        }
    }
    LGCodeSelectionChangedinSL(event, fieldValue) {
        if (event.source.selected) {

            for (const listElement of this.searchFieldData) {
                if (listElement.lovType === 'code') {
                    listElement.list = [{
                        label: ' Please Select',
                        value: ''
                    }];
                    if (fieldValue !== '' && this.invCodeValue !== '') {
                        this.codeValue = '';
                        for (const item of this.codeArray) {
                            if (item.lgId === Number(fieldValue) && item.iuId === Number(this.invCodeValue)) {
                                listElement.list.push(item);
                            }
                        }
                    } else if (fieldValue !== '' && this.invCodeValue === '') {
                        for (const item of this.codeArray) {
                            if (item.lgId === Number(fieldValue)) {
                                listElement.list.push(item);
                            }
                        }
                    } else {
                        this.codeValue = '';
                        listElement.list = this.codeArray;
                    }
                }
                if (listElement.lovType === 'name') {
                    listElement.list = [{
                        label: ' Please Select',
                        value: ''
                    }];
                    if (fieldValue !== '' && this.invCodeValue !== '') {
                        this.nameValue = '';
                        for (const item of this.nameArray) {
                            if (item.lgId === Number(fieldValue) && item.iuId === Number(this.invCodeValue)) {
                                listElement.list.push(item);
                            }
                        }
                    } else if (fieldValue !== '' && this.invCodeValue === '') {
                        for (const item of this.nameArray) {
                            if (item.lgId === Number(fieldValue)) {
                                listElement.list.push(item);
                            }
                        }
                    } else {
                        this.nameValue = '';
                        listElement.list = this.nameArray;
                    }

                }
                listElement.list = listElement.list.sort((a, b) => a.label ? a.label.localeCompare(b.label) : a.label)
            }
        }
    }

}