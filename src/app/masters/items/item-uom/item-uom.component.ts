import {
    Component,
    OnInit,
    ViewChild,
    Renderer,
    EventEmitter,
    Output,
    OnDestroy,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitOfMeasureService } from 'src/app/_services/uom/unit-of-measure.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ItemsComponent } from '../items.component';
import { ItemsService } from 'src/app/_services/items.service';
import { MatSort, Sort } from '@angular/material';
import { HttpClient } from '@angular/common/http';

export interface ParameterDataElement {
    // serialNumber: number;
    uom_Sno?: number;
    uom_conversion_item: string;
    uom_conversion_itemName?: string;
    showLov?                   : string,
    searchValue?               : string,
    inlineSearchLoader?        : string,
    itemLov?: any;
    uom_conversion_itemDes: string;
    uom_conversion_unit: string;
    uom_conversion_unit_id: number;
    uom_conversion_class: string;
    uom_conversion: string;
    uom_conversion_baseUnit: string;
    uom_conversion_baseUnit_id: number;
    uom_conversion_Date: string;
    uomLov?: any;
    enabled_flag: boolean;
    action: string;
    editing: boolean;
    addNewRecord?: boolean;
    originalData?: any;
}

@Component({
    selector: 'app-item-uom',
    templateUrl: './item-uom.component.html',
    styleUrls: ['./item-uom.component.css'],
    providers: [UnitOfMeasureService]
})
export class ItemUomComponent implements OnInit, AfterViewInit, OnDestroy {
    isEditable = false;
    isEdit = false;
    isAdd = false;
    listProgress = false;
    itemLov = [];
    uomLov = [];
    itemLovAll = [];
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    searchEnableFlag = false;
    searchIconValue: any = '';
    saveInprogress = false;

    uomTableMessage = '';
    // uomTableMessage = 'No Unit Of Measure defined.';
    showSearch = true;

    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/item-UOM-search.json');
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'uom_Sno',
        'uom_conversion_item',
        'uom_conversion_itemDes',
        'uom_conversion_unit',
        'uom_conversion_class',
        'uom_conversion',
        'uom_conversion_baseUnit',
        'uom_conversion_Date',
        'enabled_flag',
        'action'
    ];
    columns: any = [
        { field: 'uom_Sno', name: '#', width: 75, baseWidth: 4 },
        {
            field: 'uom_conversion_item',
            name: 'Item',
            width: 150,
            baseWidth: 12
        },
        {
            field: 'uom_conversion_itemDes',
            name: 'Item Description',
            width: 150,
            baseWidth: 15
        },
        {
            field: 'uom_conversion_unit',
            name: 'UOM',
            width: 150,
            baseWidth: 11
        },
        {
            field: 'uom_conversion_class',
            name: 'Class',
            width: 150,
            baseWidth: 8
        },
        {
            field: 'uom_conversion',
            name: 'Conversion',
            width: 180,
            baseWidth: 12
        },
        {
            field: 'uom_conversion_baseUnit',
            name: 'Base UOM',
            width: 150,
            baseWidth: 11
        },
        {
            field: 'uom_conversion_Date',
            name: 'Disable Date',
            width: 100,
            baseWidth: 11
        },
        {
            field: 'enabled_flag',
            name: 'Enable Flag',
            width: 100,
            baseWidth: 10
        },
        { field: 'action', name: 'Action', width: 75, baseWidth: 8 }
    ];
    selectedRowIndex = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private uomService: UnitOfMeasureService,
        private render: Renderer,
        public commonService: CommonService,
        private itemsService: ItemsService,
        private itemscomponent: ItemsComponent,
        private http: HttpClient
    ) {}

    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false })
    public customTable: ElementRef<any>;

    ngOnInit() {
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForUomItems();
            this.searchUomItems();
        });
        //this.getItemLovEnabled();
        this.getItemLovAll();
        this.commonService.getScreenSize(-35);
        this.searchIconValue = this.itemsService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
    }

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    tooltipPosition: TooltipPosition[] = ['below'];

    searchUomItems() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {
                this.isEdit = false;
                //
                // This code is used for not loading the search result when module loads
                if (searchInfo.fromSearchBtnClick === true) {
                    this.selectedRowIndex = null;
                    if(this.customTable.nativeElement) {                  
                    this.customTable.nativeElement.scrollLeft = 0;
                    }
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    // this.uomTableMessage = 'No Unit Of Measure Item defined.';
                    this.uomTableMessage = '';
                    if (searchInfo.searchType === 'uomCon') {
                        this.listProgress = true;
                        this.uomService
                            .getUomConversionSearch(searchInfo.searchArray)
                            .subscribe(
                                data => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];
                                            let count = 1;
                                            let temp = {};

                                            for (const rData of data.result) {
                                                const obj = {
                                                    uom_Sno: count++,
                                                    uom_conversion_item:
                                                        rData.itemId,
                                                    uom_conversion_itemName:
                                                        rData.itemName,
                                                    uom_conversion_itemDes:
                                                        rData.itemDescription,
                                                    uom_conversion_unit:
                                                        rData.fromUom,
                                                    uom_conversion_unit_id:
                                                        rData.fromUomId,
                                                    uom_conversion_class:
                                                        rData.uomClass,
                                                    uom_conversion:
                                                        rData.conversionRate,
                                                    uom_conversion_baseUnit:
                                                        rData.toUom,
                                                    uom_conversion_baseUnit_id:
                                                        rData.toUomId,
                                                    uom_conversion_Date:
                                                        rData.disableDate,
                                                    enabled_flag:
                                                        rData.uomEnabledFlag ===
                                                        'Y'
                                                            ? true
                                                            : false,

                                                    action: '',
                                                    editing: false,
                                                    addNewRecord: false
                                                };
                                                obj[
                                                    'originalData'
                                                ] = Object.assign({}, obj);
                                                this.parameterData.push(obj);
                                            }

                                            this.parameterDataSource = new MatTableDataSource<
                                                ParameterDataElement
                                            >(this.parameterData);
                                            this.parameterDataSource.paginator = this.paginator;
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.parameterDataSource.sort = this.sort;
                                            // this.parameterDataSource.connect().subscribe(d => {
                                            //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                                            //         this.parameterDataSource.sort);
                                            // });
                                        } else {
                                            this.uomTableMessage = data.message;
                                        }
                                    } else {
                                        this.openSnackBar(data.message, '', 'error-snackbar');
                                    }
                                },
                                (error: any) => {
                                    this.listProgress = false;
                                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                                }
                            );
                    }
                } else {
                    return;
                }
            }
        );
    }

    searchForUomItems() {
        this.searchArrayunsubscribe = this.itemscomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'itemUOM') {
                    this.commonService.searhForMasters(this.dataForSearch);
                    this.itemsService.displaySearchComponent(this.showSearch);
                }
            }
        );
    }
    searchComponentOpen() {
        this.itemsService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }

    fetchNewSearchList(event: any, index: any, searchFlag: any, value: any) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        // if( this.parameterData[index].showLov === 'hide' &&
        // (value === undefined || value === '' || ( value && value.trim() ==='' ) )){
        //   this.openSnackBar('Please enter the search value', '','error-snackbar');
        //   return;
        // }

        if (this.parameterData[index].showLov === 'hide') {
            this.parameterData[index].inlineSearchLoader = 'show';
            this.getItemLovByScreen(
                this.parameterData[index].searchValue,
                index,
                event
            );
        } else {
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].searchValue = '';
            this.parameterData[index].uom_conversion_item = '';
            this.parameterData[index].uom_conversion_itemDes = '';
        }
    }

    getItemLovByScreen(itemName, index, event) {
        this.commonService
            .getItemLovByScreen('item', 'item-uom-conversion', '', itemName)
            .subscribe(
                (data: any) => {
                    this.parameterData[index].itemLov = [
                        {
                            key: '',
                            viewValue: ' Please Select',
                            itemDescription: ''
                        }
                    ];

                    if (data.result && data.result.length) {
                        data = data.result;
                        this.parameterData[index].itemLov = [];
                        for (let i = 0; i < data.length; i++) {
                            this.parameterData[index].itemLov.push({
                                key: data[i].itemId,
                                viewValue: data[i].itemName,
                                data: data[i]
                            });
                        }
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.parameterData[index].showLov = 'show';
                        this.parameterData[index].searchValue = '';

                        // Set the first element of the search
                        this.parameterData[index].uom_conversion_item =
                            data[0].itemId;
                        this.parameterData[index].uom_conversion_itemDes =
                            data[0].itemDescription;
                    } else {
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.openSnackBar(
                            'No match found',
                            '',
                            'error-snackbar'
                        );
                    }
                },
                (error: any) => {
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
    }

    beginEdit(rowData: any, $event: any,index) {
        for (const pData of this.parameterData) {
            if (pData.addNewRecord === true) {
                this.openSnackBar(
                    'Please add your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        if (rowData.editing === false) {
            rowData.editing = true;
            rowData.addNewRecord = false;
            this.isAdd = false;
            this.isEdit = true;
           
            let itemData = {itemDescription: rowData.uom_conversion_itemDes,itemEnabledFlag:rowData.itemEnabledFlag,
                            itemId: rowData.uom_conversion_item,itemName:rowData.uom_conversion_itemName};
            this.setUOMitemDescription({source:{selected: true}},index,{
                                                                     data:itemData,
                                                                     key:rowData.uom_conversion_item});
            // this.render.setElementClass($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.isEdit = false;
            // this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (rowData.editing === true) {
            this.parameterData[index].uom_Sno = this.parameterData[
                index
            ].originalData.uom_Sno;
            this.parameterData[index].uom_conversion = this.parameterData[
                index
            ].originalData.uom_conversion;
            this.parameterData[index].uom_conversion_Date = this.parameterData[
                index
            ].originalData.uom_conversion_Date;
            this.parameterData[
                index
            ].uom_conversion_baseUnit = this.parameterData[
                index
            ].originalData.uom_conversion_baseUnit;
            this.parameterData[
                index
            ].uom_conversion_baseUnit_id = this.parameterData[
                index
            ].originalData.uom_conversion_baseUnit_id;
            this.parameterData[index].uom_conversion_class = this.parameterData[
                index
            ].originalData.uom_conversion_class;
            this.parameterData[index].uom_conversion_item = this.parameterData[
                index
            ].originalData.uom_conversion_item;
            this.parameterData[
                index
            ].uom_conversion_itemDes = this.parameterData[
                index
            ].originalData.uom_conversion_itemDes;
            this.parameterData[index].uom_conversion_unit = this.parameterData[
                index
            ].originalData.uom_conversion_unit;
            this.parameterData[
                index
            ].uom_conversion_unit_id = this.parameterData[
                index
            ].originalData.uom_conversion_unit_id;
            this.parameterData[index].inlineSearchLoader = this.parameterData[
                index
            ].originalData.inlineSearchLoader;
            this.parameterData[index].showLov = this.parameterData[
                index
            ].originalData.showLov;
            (this.parameterData[
                index
            ].uom_conversion_itemName = this.parameterData[
                index
            ].originalData.uom_conversion_itemName),
                (this.parameterData[index].enabled_flag = this.parameterData[
                    index
                ].originalData.enabled_flag);
            this.parameterData[index].editing = false;
        }
        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.checkIsAddRow();
    }

    checkIsAddRow() {
        let cnt = 0;
        const pLength = this.parameterData.length;
        for (const pdata of this.parameterData) {
            if (pdata.addNewRecord === true) {
                return;
            } else {
                cnt++;
            }
        }
        if (cnt === pLength) {
            this.isAdd = false;
        }
    }

    addRow() {
        this.selectedRowIndex = null;
        this.paginator.pageIndex = 0; 
        if (
            this.matTableRef.nativeElement.clientHeight >
            this.commonService.getTableHeight()
        ) {
            const elem = document.getElementById('customTable');
            if (elem) elem.scrollTop = 0;
            this.customTable.nativeElement.scrollLeft = 0;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === false) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        // Sorting will work in ascending order when page add new row function call
        this.sort.sort({id: '', start: 'asc', disableClear: false});
        this.isAdd = true;
        this.isEdit = false;
        let count = 0;
        this.parameterData.unshift({
            uom_Sno: count++,
            uom_conversion_item: '',
            showLov: 'hide',
            inlineSearchLoader: 'hide',
            uom_conversion_itemDes: '',
            uom_conversion_unit: '',
            uom_conversion_unit_id: null,
            uom_conversion_class: '',
            uom_conversion: '',
            uom_conversion_baseUnit: '',
            uom_conversion_baseUnit_id: null,
            uom_conversion_Date: '',
            enabled_flag: true,
            action: '',
            editing: true,
            addNewRecord: true
        });
        for (const pData of this.parameterData) {
            pData.uom_Sno = count++;
        }
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    setUOMitemDescription(event, index, data) {
        if (event.source.selected) {
            this.parameterData[index].uom_conversion_itemDes =
                data.data.itemDescription;
            this.parameterData[index].uom_conversion_itemName =
                data.data.itemName;

            this.itemsService
                .UOMByItemId(data.key)
                .subscribe((UOMdata: any) => {
                    if (UOMdata.status === 200) {
                        this.parameterData[index].uomLov = [];
                        data = UOMdata.result;
                        if (data !== undefined) {
                            if (data.length) {
                                for (var i = 0; i < data.length; i++) {
                                    this.parameterData[index].uomLov.push({
                                        key: data[i].uomId,
                                        viewValue: data[i].unitOfMeasure,
                                        data: data[i]
                                    });
                                }
                            }
                        }
                    }
                });
        }
    }

    // getItemLovEnabled() {
    //     this.uomService.getItemLov().subscribe(
    //         (data: any) => {
    //             data = data.result;
    //             if (data.length) {
    //                 for (var i = 0; i < data.length; i++) {
    //                     this.itemLov.push({
    //                         key: data[i].itemId,
    //                         viewValue: data[i].itemName,
    //                         itemDescription: data[i].itemDescription
    //                     });
    //                 }
    //             }
    //         },
    //         (error: any) => {
    //             this.openSnackBar(error.error.message, '', 'error-snackbar');
    //         }
    //     );
    // }

    getItemLovAll() {
        this.uomService.getItemLovAll().subscribe(
            (data: any) => {
                data = data.result;
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.itemLovAll.push({
                            key: data[i].id,
                            viewValue: data[i].name
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    getUomLov() {
        this.uomService.getUomLov().subscribe(
            (data: any) => {
                if (data.status == 200) {
                    data = data.result;
                    if (data.length) {
                        for (var i = 0; i < data.length; i++) {
                            this.uomLov.push({
                                key: data[i].uomId,
                                viewValue: data[i].unitOfMeasure,
                                data: data[i]
                            });
                        }
                    }
                } else {
                    this.openSnackBar(
                        data.result.message,
                        '',
                        'error-snackbar'
                    );
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    setUomFields(event, index, data) {
        if (event.source.selected) {
            this.parameterData[index].uom_conversion_unit =
                data.data.unitOfMeasure;
            this.parameterData[index].uom_conversion_unit_id = data.data.uomId;
            this.parameterData[index].uom_conversion_class = data.data.uomClass;
            this.parameterData[index].uom_conversion_baseUnit =
                data.data.baseUnitOfMeasure;
            this.parameterData[index].uom_conversion_baseUnit_id =
                data.data.baseUomId;
        }
    }

    onSubmit(type: string) {
        const dataArray: any[] = [];
        this.saveInprogress = true;
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.uom_conversion_item != '' &&
                        pData.uom_conversion != ''
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i + 1),
                            '',
                            'error-snackbar'
                        );
                        return;
                    }
                }
            } else {
                if (pData.editing === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.uom_conversion_item !== '' &&
                        pData.uom_conversion !== ''
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].editing = true;
                        this.parameterData[i].originalData = {};
                        delete pData.originalData;
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i + 1),
                            '',
                            'error-snackbar'
                        );
                        return;
                    }
                }
            }
        }
        if (type === 'save') {
            this.addUomItem(dataArray);
        } else {
            this.updateUomItem(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        }
    }

    addUomItem(data) {
        let tempObect = {};
        let uomArray = [];

        if (this.parameterData.length) {
            for (var i = 0; i < data.length; i++) {
                // delete data[i].action;
                // delete data[i].editing;
                // delete data[i].addNewRecord;
                tempObect['createdBy'] = Number(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );
                tempObect['conversionRate'] = Number(data[i].uom_conversion);
                tempObect['disableDate'] = data[i].uom_conversion_Date
                    ? this.uomService.dateFormat(data[i].uom_conversion_Date)
                    : null;
                tempObect['fromUomId'] = data[i].uom_conversion_unit_id;
                tempObect['itemId'] = data[i].uom_conversion_item;
                tempObect['toUomId'] = data[i].uom_conversion_baseUnit_id;
                tempObect['uomClass'] = data[i].uom_conversion_class;
                tempObect['uomEnabledFlag'] =
                    data[i].enabled_flag === true ? 'Y' : 'N';
                tempObect['updatedBy'] = Number(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );
                uomArray.push(tempObect);
                tempObect = {};
            }
        }

        this.uomService.insertUomCon(uomArray).subscribe(
            result => {
                if (result.status === 200) {
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.isAdd = false;
                    this.parameterData.forEach(dataElement => {
                        dataElement.editing = false;
                        dataElement.addNewRecord = false;
                    });
                } else {
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[
                //         error.error.index[i] - 1
                //     ].addNewRecord = true;
                // }
                this.isAdd = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itemUOM of data) {
                    itemUOM.editing = true;
                    itemUOM.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    updateUomItem(data) {
        let tempObect = {};
        let uomArray = [];

        if (this.parameterData.length) {
            for (var i = 0; i < data.length; i++) {
                tempObect['createdBy'] = Number(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );
                tempObect['conversionRate'] = Number(data[i].uom_conversion);
                tempObect['disableDate'] = data[i].uom_conversion_Date
                    ? this.uomService.dateFormat(data[i].uom_conversion_Date)
                    : null;
                tempObect['fromUomId'] = data[i].uom_conversion_unit_id;
                tempObect['itemId'] = data[i].uom_conversion_item;
                tempObect['toUomId'] = data[i].uom_conversion_baseUnit_id;
                tempObect['uomClass'] = data[i].uom_conversion_class;
                tempObect['uomEnabledFlag'] =
                    data[i].enabled_flag === true ? 'Y' : 'N';
                tempObect['updatedBy'] = Number(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );

                uomArray.push(tempObect);
                tempObect = {};
            }
        }

        this.uomService.updateUomConItem(uomArray).subscribe(
            result => {
                if (result.status === 200) {
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.isEdit = false;
                    this.parameterData.forEach(dataElement => {
                        dataElement.editing = false;
                    });
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');
                    this.isEdit = false;
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[
                //         error.error.index[i] - 1
                //     ].addNewRecord = true;
                // }
                this.isEdit = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itmUOM of data) {
                    if (
                        this.parameterData.find(
                            d => (d.uom_Sno = itmUOM.uom_Sno)
                        )
                    ) {
                        const index = this.parameterData.indexOf(itmUOM);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = false;
                    }
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.searchArrayunsubscribe
            ? this.searchArrayunsubscribe.unsubscribe()
            : '';
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(
                window.localStorage.getItem('paginationSize')
                    ? window.localStorage.getItem('paginationSize')
                    : 10
            );
        }, 100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(-35);
    }
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}
