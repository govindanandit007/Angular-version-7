import {
    Component,
    OnInit,
    Renderer,
    Output,
    Input,
    EventEmitter,
    ViewChild,
    OnDestroy,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    NgModel
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog, MatSort, Sort } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { ItemsComponent } from '../items.component';
import { CommonService } from 'src/app/_services/common/common.service';
import { ItemsService } from 'src/app/_services/items.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';

export interface RevisionNumberLovInterface {
    value: string;
    label: string;
}

export interface ParameterDataElement {
    // serialNumber?: number;
    iuCode: string;
    parentItemId: number;
    itemName? : string;
    showLov? : string,
    searchValue? : string,
    inlineSearchLoader? : string,
    isRevisionCntrld? : string,
    parentItemName: string;
    parentRevsnId: number;
    revsnNumber?: number;
    xrefItemName: string;
    xrefItemBarcode: string;
    xrefStartDate: string;
    xrefEnabledFlag: boolean;
    xrefEndDate: string;
    xrefId: number;
    xrefIuId: number;
    updatedBy: number;
    createdBy: number;
    editing: boolean;
    action: string;
    addNewRecord?: boolean;
    itemsList?: any;
    revisionNumberList?: any[];
    originalData?: any;
}

@Component({
    selector: 'app-item-x-ref',
    templateUrl: './item-x-ref.component.html',
    styleUrls: ['./item-x-ref.component.css']
})
export class ItemXRefComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    showSearch = true;
    isDisable = true;
    itemXRefMessage = '';
    // itemXRefMessage = 'No Item Cross References defined.';
    parameterData: ParameterDataElement[] = [];
    parameterDisplayedColumns: string[] = [
        'iuCode',
        'parentItemId',
        'xrefItemName',
        'itemBarcode',        
        'parentRevsnId',
        'xrefStartDate',
        'xrefEnabledFlag',
        'action'
    ];
    columns: any = [
        { field: 'iuCode', name: '#', width: 75, baseWidth: 7 },
        { field: 'parentItemId', name: 'Item', width: 75, baseWidth: 13 },
       
        {
            field: 'xrefItemName',
            name: 'Cross Item Name',
            width: 75,
            baseWidth: 16
        },
        { field: 'xrefItemBarcode', name: 'Cross Item Barcode', width: 150, baseWidth: 16 },
        {
            field: 'parentRevsnId',
            name: 'Revision #',
            width: 75,
            baseWidth: 12.5 
        },
        {
            field: 'xrefStartDate',
            name: 'Effective Date',
            width: 75,
            baseWidth: 13
        },
        {
            field: 'xrefEnabledFlag',
            name: 'Enable Flag',
            width: 75,
            baseWidth: 10
        },
        { field: 'action', name: 'Action', width: 75, baseWidth: 12 }
    ];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    isEditable = false;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    itemsList = [];
    itemRevisionList = [];
    revisionNumberList: any[];
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    searchEnableFlag = false;
    searchIconValue: any = '';
    saveInprogress = false;

    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/item-x-ref-search.json');

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    selectedRowIndex = null;

    constructor(
        private render: Renderer,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private itemsService: ItemsService,
        private itemscomponent: ItemsComponent,
        private http: HttpClient
    ) {}

    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    ngOnInit() {
        this.isEdit = false;
        this.showSearch = true;
        this.getItemReVision();
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForItemXRef();
            this.searchItemXRef();
        });
        this.commonService.getScreenSize(30);
        this.searchIconValue = this.itemsService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
    }

    searchItemXRef() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (itemSearchInfo: any) => {
                // This code is used for not loading the search result when module loads
                if (itemSearchInfo.fromSearchBtnClick === true) {
                    this.selectedRowIndex = null;
                    // itemSearchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(itemSearchInfo);
                    this.isEdit = false;
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.sort = this.sort;
                    // this.itemXRefMessage = 'No Item Cross References defined.';
                    this.itemXRefMessage = '';
                    if (itemSearchInfo.searchType === 'itemCrossRef') {
                        this.listProgress = true;
                        this.itemsService
                            .getItemXrefSearch(itemSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            // let count = 1;
                                            this.parameterData = [];
                                            for (const rowData of data.result) {
                                                // rowData.serialNumber = count++;
                                                if (
                                                    rowData.xrefEnabledFlag ===
                                                    'N'
                                                ) {
                                                    rowData.xrefEnabledFlag = false;
                                                } else {
                                                    rowData.xrefEnabledFlag = true;
                                                }
                                                if(rowData.parentRevsnId === null){
                                                    rowData.parentRevsnId = 0;
                                                }
                                                rowData.action = '';
                                                rowData.editing = false;
                                                rowData.inlineSearchLoader =
                                                    'hide';
                                                rowData.showLov = 'hide';
                                                rowData[
                                                    'originalData'
                                                ] = Object.assign({}, rowData);
                                                this.parameterData.push(
                                                    rowData
                                                );
                                               this.setRevisionNumberList();
                                            }
                                            console.log(this.parameterData);
                                            this.parameterDataSource = new MatTableDataSource(
                                                this.parameterData
                                            );
                                            this.parameterDataSource.paginator = this.paginator;
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.parameterDataSource.sort = this.sort;
                                            // this.parameterDataSource.connect().subscribe(d => {
                                            //     // this.parameterData = d
                                            //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                                            // });
                                        } else {
                                            this.itemXRefMessage = data.message;
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
    setRevisionNumberList() {
        for (const [index, rowData] of this.parameterData.entries()) {
        const data = { value: rowData.parentItemId, data: rowData };
        this.itemCodeChanged({ source: { selected: true } }, index, data,'from');
    }
    }

    searchForItemXRef() {
        this.searchArrayunsubscribe = this.itemscomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'itemCrossRef') {
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
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
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
        //   this.openSnackBar('Please enter the search value', '','default-snackbar');
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
            this.parameterData[index].parentItemId = null;
        }
    }

    //   getItemForXRefList() {
    //     this.itemsService.getItemsForXref().subscribe((data: any) => {
    //         this.itemsList = [];
    //         for (const items of data.result) {
    //             this.itemsList.push({
    //                 value: items.itemId,
    //                 label: items.itemName
    //             });
    //         }
    //     });
    // }

    getItemLovByScreen(itemName, index, event) {
        this.commonService
            .getItemLovByScreen('item', 'item-xref', null, itemName)
            .subscribe(
                (data: any) => {
                    this.parameterData[index].itemsList = [
                        {
                            key: '',
                            viewValue: ' Please Select',
                            itemDescription: ''
                        }
                    ];

                    if (data.result && data.result.length) {
                        data = data.result;
                        this.parameterData[index].itemsList = [];
                        for (let i = 0; i < data.length; i++) {
                            this.parameterData[index].itemsList.push({
                                value: data[i].itemId,
                                label: data[i].itemName,
                                data: data[i]
                            });
                        }
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.parameterData[index].showLov = 'show';
                        this.parameterData[index].searchValue = '';

                        let currentobj =  this.parameterData[index].itemsList.find(d => d.value === this.parameterData[index].parentItemId);
                        if (currentobj) { 
                            this.parameterData[index].parentItemId = currentobj.value;                             
                            this.parameterData[index].itemName = currentobj.label; 
                            // const data = { value:currentobj.value, data: this.parameterData[index] };
                            // this.itemCodeChanged({ source: { selected: true } }, index, data);                            
                        }else{
                        // Set the first element of the search
                        this.parameterData[index].parentItemId = data[0].itemId;
                        
                        }
                    } else {
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.openSnackBar(
                            'No match found',
                            '',
                            'default-snackbar'
                        );
                    }
                },
                (error: any) => {
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
    }

    getItemReVision() {
        this.itemsService.getItemReVision().subscribe((data: any) => {
            this.itemRevisionList = [];
            for (const items of data.result) {
                this.itemRevisionList.push({
                    value: items.revsnId,
                    label: items.revsnNumber,
                    revsnItemId: items.revsnItemId,
                    isRevisionCntrld: items.revsnEnabledFlag
                });
            }
        });
    }
    itemCodeChanged(event: any, index, item,from?) {
         
        const itemCode = item.value;
        if (event.source.selected) {             
            this.parameterData[index].itemName = item.data.itemName;            
            if(from){
            this.parameterData[index].parentRevsnId = item.data.parentRevsnId;
            }else{
                this.parameterData[index].isRevisionCntrld = item.data.revsnEnabledFlag;
            }
            this.parameterData[index].revisionNumberList = [];

            for (const rowData of this.itemRevisionList) {
                if (rowData.revsnItemId === itemCode) {
                    this.parameterData[index].revisionNumberList.push({
                        value: rowData.value,
                        label: rowData.label
                    });
                }
            }
            if(this.parameterData[index].revisionNumberList.length === 0){
                 
                    this.parameterData[index].revisionNumberList = [];
                    this.parameterData[index].revisionNumberList.push({
                        value: 0,
                        label: '0'
                    });
                this.parameterData[index].parentRevsnId = 0;
                this.parameterData[index].revsnNumber = null;
            }else{
                let currentobj =  this.parameterData[index].revisionNumberList.find(d => d.value === this.parameterData[index].parentRevsnId);
                        if (currentobj) { 
                            this.parameterData[index].parentRevsnId = currentobj.value;
                            this.parameterData[index].revsnNumber = currentobj.label;
                        }
            }
        }
    }

    beginEdit(rowData: any, $event: any, index: any) {
        for (const pData of this.parameterData) {
            if (pData.addNewRecord === true) {
                this.openSnackBar(
                    'Please add your records first.',
                    '',
                    'default-snackbar'
                );
                return;
            }
        } 
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            this.isEdit = true;
            this.isDisable = false;
            rowData.searchValue = rowData.itemName;
            this.getItemLovByScreen(rowData.itemName,index,null);
            //const data = { value: rowData.parentItemId, data: rowData };
            //this.itemCodeChanged({ source: { selected: true } }, index, data);
            // this.render.setElementClass($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.isAdd = true;
            // this.isEdit = false;
            // this.isDisable = true;
            // this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }

    disableEdit(rowData: any, index: any) {
        if (rowData.editing === true) {
            this.parameterData[index].iuCode = this.parameterData[
                index
            ].originalData.iuCode;
            this.parameterData[index].parentItemId = this.parameterData[
                index
            ].originalData.parentItemId;
            this.parameterData[index].parentItemName = this.parameterData[
                index
            ].originalData.parentItemName;
           
            // this.parameterData[index].revisionNumberList = this.parameterData[
            //     index
            // ].originalData.revisionNumberList;
            this.parameterData[index].parentRevsnId = this.parameterData[
                index
            ].originalData.parentRevsnId;
            this.parameterData[index].revsnNumber = this.parameterData[
                index
            ].originalData.revsnNumber;
            this.parameterData[index].xrefEnabledFlag = this.parameterData[
                index
            ].originalData.xrefEnabledFlag;
            this.parameterData[index].xrefEndDate = this.parameterData[
                index
            ].originalData.xrefEndDate;
            this.parameterData[index].xrefId = this.parameterData[
                index
            ].originalData.xrefId;
            this.parameterData[index].xrefItemName = this.parameterData[
                index
            ].originalData.xrefItemName;
            this.parameterData[index].xrefItemBarcode = this.parameterData[
                index
            ].originalData.xrefItemBarcode;
            this.parameterData[index].xrefIuId = this.parameterData[
                index
            ].originalData.xrefIuId;
            this.parameterData[index].xrefStartDate = this.parameterData[
                index
            ].originalData.xrefStartDate;
            this.parameterData[index].inlineSearchLoader = this.parameterData[
                index
            ].originalData.inlineSearchLoader;
            this.parameterData[index].itemName = this.parameterData[
                index
            ].originalData.itemName;
            this.parameterData[index].showLov = this.parameterData[
                index
            ].originalData.showLov;
            this.parameterData[index].editing = false;    
            const data = { value: rowData.parentItemId, data: rowData };
            this.itemCodeChanged({ source: { selected: true } }, index, data,'from');        
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
        this.isDisable = true;
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
         // Sorting will work in ascending order when page add new row function call
         this.sort.sort({id: '', start: 'asc', disableClear: false});
        if (
            this.matTableRef.nativeElement.clientHeight >
            this.commonService.getTableHeight()
        ) {
            const elem = document.getElementById('customTable');
            elem.scrollTop = 0;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'default-snackbar'
                );
                return;
            }
        }
        this.isAdd = true;
        this.isDisable = false;
        this.isEdit = false;
        this.parameterData.unshift({
            iuCode: '',
            parentItemName: null,
            showLov: 'hide',
            inlineSearchLoader: 'hide',
            isRevisionCntrld: 'N',
            xrefEndDate: '',
            xrefId: null,
            xrefIuId: null,
            parentItemId: null,
            parentRevsnId: null,
            revsnNumber: null,
            revisionNumberList: [],
            xrefItemName: '',
            xrefItemBarcode: '',
            itemsList: [],
            xrefStartDate: this.itemscomponent.dateFormat(new Date()),
            xrefEnabledFlag: true,
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
    }

    onSubmit(type: string) {
        const dataArray: any[] = [];
        this.saveInprogress = true;
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.parentItemId &&
                        pData.xrefItemName &&
                        pData.xrefItemBarcode &&
                        pData.parentRevsnId !== undefined &&
                        // (pData.isRevisionCntrld === 'N' ||
                        //    pData.parentRevsnId) &&
                        pData.xrefStartDate) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i].inlineSearchLoader = 'hide';
                        this.parameterData[i].showLov = 'hide';
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
                            'default-snackbar'
                        );
                        return;
                    }
                }
            } else {
                if (pData.editing === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.parentItemId &&
                        pData.xrefItemName &&
                        pData.xrefItemBarcode &&
                        pData.parentRevsnId !== undefined &&
                        // (pData.isRevisionCntrld === 'N' ||
                        //     pData.parentRevsnId ) &&
                        pData.xrefStartDate
                    ) {
                        this.parameterData[i].originalData = {};
                        delete pData.originalData;
                        this.parameterData[i].editing = true;
                        this.parameterData[i].inlineSearchLoader = 'hide';
                        this.parameterData[i].showLov = 'show';
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                        dataArray.push(pData);
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i + 1),
                            '',
                            'default-snackbar'
                        );
                        return;
                    }
                }
            }
        }
        if (type === 'save') {
            this.createXRefs(dataArray);
        } else {
            this.updateXRefs(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        }
        console.log(dataArray);
    }

    createXRefs(data) {
        const body = [];
        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            tempObj.xrefEnabledFlag =
                tempObj.xrefEnabledFlag === true ? 'Y' : 'N';

            tempObj.createdBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;
            const dp = new DatePipe(navigator.language);
            const p = 'y-MM-dd'; // YYYY-MM-DD
            tempObj.xrefStartDate = dp.transform(
                new Date(tempObj.xrefStartDate),
                p
            );
            delete tempObj.revisionNumberList;
            delete tempObj.parentItemName;
            delete tempObj.revisionNumber;
            // delete tempObj.xrefId;
            delete tempObj.action;
            delete tempObj.editing;
            delete tempObj.addNewRecord;
            delete tempObj.updatedBy;
            body.push(tempObj);
            // setTimeout(
            //     () =>
            //         (dataElement.xrefEnabledFlag =
            //             dataElement.xrefEnabledFlag === 'Y' ? true : false),
            //     200
            // );
        });
        this.itemsService.createXRefs(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isDisable = true;
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    //this.searchForItemXRef();
                    //this.searchItemXRef();
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                this.isAdd = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itemRef of data) {
                    itemRef.editing = true;
                    itemRef.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    updateXRefs(data) {
        const body = [];

        data.forEach(dataElement => {
            const dp = new DatePipe(navigator.language);
            const p = 'y-MM-dd'; // YYYY-MM-DD

            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            tempObj.xrefStartDate = dp.transform(
                new Date(dataElement.xrefStartDate),
                p
            );
            tempObj.xrefEnabledFlag =
                tempObj.xrefEnabledFlag === true ? 'Y' : 'N';
            tempObj.updatedBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;

            // delete tempObj.parentItemName;
            // delete tempObj.revisionNumber;
            // delete tempObj.revisionNumberList;
            delete tempObj.action;
            delete tempObj.editing;
            body.push(tempObj);
        });
        this.itemsService.updateXRefs(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isDisable = true;
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                this.isEdit = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itmRef of data) {
                    if (
                        this.parameterData.find(d => (d.xrefId = itmRef.xrefId))
                    ) {
                        const index = this.parameterData.indexOf(itmRef);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = true;
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
        //     // this.parameterData = d
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
        this.commonService.getScreenSize(30);
    }
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}
