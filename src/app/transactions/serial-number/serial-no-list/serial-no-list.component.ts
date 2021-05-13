import {
  Component,
  OnInit,
  ViewChild,
  Renderer,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { SerialNoService } from 'src/app/_services/transactions/serial-no.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { MatSort, Sort } from '@angular/material';

export interface SerialLovInterface {
    value: number;
    label: string;
}

export interface ParameterDataElement {
    serialBatchId: any;
    serialCurrentLgId: number;
    serialCurrentLocatorId: number;
    serialDescription: string;
    serialHostId: number;
    serialId: number;
    serialInboundId: number;
    serialInspectionStatus: string;
    serialItemId: number;
    showLov?                   : string,
    searchValue?               : string,
    inlineSearchLoader?        : string,
    serialItemCode: string;
    serialIuId: any;
    serialIuCode?: string;
    serialLpnId: number;
    materialStatusId: number;
    serialNumber: string
    serialOnhandStockId: number;
    serialOutboundId: number;
    serialParentNum: number;
    serialPreviousStatus: number;
    serialQuantity: number;
    serialReservationId: number;
    serialRevision: any;
    serialShipDate: Date;
    serialStatusId: number;
    serialStatus?: string;
    serialSupplierBatchNum: string;
    updatedDate: string;
    createdBy: number;
    creationDate: string;
    updatedBy: number;
    editing: boolean;
    action: string;
    addNewRecord?: boolean;
    enabledSerialItemList? : any ;
    batchNumberList?: any;
    locatorList?: any;
    lpnList?: any;
    revisionList?: any;
    originalData?: any;
}

@Component({
    selector: 'app-serial-no-list',
    templateUrl: './serial-no-list.component.html',
    styleUrls: ['./serial-no-list.component.css']
})
export class SerialNoListComponent implements OnInit, AfterViewInit, OnDestroy {
    listProgress = false;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'serial_Sno',
        // 'serialIuId',
        'serialItemCode',
        'serialNumber',
        'serialShipDate',
        'serialRevision',
        'serialBatchId',
        'serialDescription',
        'serialCurrentLgId',
        'serialCurrentLocatorId',
        'serialStatusId',
        'serialLpnId',
        'serialMaterialStatus',
        'action'
    ];

    columns: any = [
        { field: 'serial_Sno', name: '#', width: 75, baseWidth: 3 },
        // { field: 'serialIuId', name: 'IU', width: 75, baseWidth: 8 },
        { field: 'serialItemCode', name: 'Item', width: 75, baseWidth: 9 },
        { 
            field: 'serialNumber',
            name: 'Serial #',
            width: 75,
            baseWidth: 7
        },
        { field: 'serialShipDate', name: 'Date', width: 75, baseWidth: 8 },
        { field: 'serialRevision', name: 'Revision', width: 75, baseWidth: 7 },
        { field: 'serialBatchId', name: 'Batch', width: 75, baseWidth: 8 },
        {
            field: 'serialDescription',
            name: 'Description',
            width: 75,
            baseWidth: 12
        },
        {
            field: 'serialCurrentLgId',
            name: 'Current LG',
            width: 75,
            baseWidth: 8
        },
        {
            field: 'serialCurrentLocatorId',
            name: 'Current Locator',
            width: 75,
            baseWidth: 10
        },
        { field: 'serialStatusId', name: 'Status', width: 75, baseWidth: 6 },
        { field: 'serialLpnId', name: 'LPN', width: 75, baseWidth: 7 },
        { field: 'serialMaterialStatus', name: 'Material Status', width: 75, baseWidth: 10 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
    ];

    serialTableMessage = '';
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    private searchInfoArrayunsubscribe: any;
    showSearch = true;
    isDisable = true;
    isEditable = false;
    isEdit = false;
    isAdd = false;
    saveInprogress = false;

    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

    tooltipPosition: TooltipPosition[] = ['below'];

    enabledInventoryCodeList: any;
    allLocatorGroupList: any[];
    serialStatusList: any[];
    refreshSearchLov: any = '';
    enabledSerialItemList: any[];
    selectedRowIndex = null;
  materialStatusLovList: any = [];

    constructor(
        private snackBar: MatSnackBar,
        private render: Renderer,
        public commonService: CommonService,
        private serialNoService: SerialNoService,
        private http: HttpClient,
        private subInventorys: SubInventoryService
    ) {
        this.searchEnable = true;
    }

    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/sno-search.json');

    ngOnInit() {
               this.serialNoService.defaultIuDataObservable.subscribe((data: any) => {
            console.log(data);
            this.defaultIUSelectionChange(data);
        });
        this.materialStatusLOV();
        this.showSearch = true;
        this.getInventoryOrgLov();
        this.getAllLoctorGroupsLov();
        this.getSerialStatusList();
        // this.getItemSerialControlled();
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchSerialNo();
            this.searchForSerialNo();
        });
        this.commonService.getScreenSize();
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        console.log('searchToggle');
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    // search for Onhand
    searchForSerialNo() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchSerialNo() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (serialSearchInfo: any) => {
                this.isEdit = false;
                // This code is used for not loading the search result when module loads
                if (serialSearchInfo.fromSearchBtnClick === true) {
                    this.selectedRowIndex = null;
                    this.customTable.nativeElement.scrollLeft = 0;
                    // serialSearchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(serialSearchInfo);
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    this.isAdd = false;
                    this.isEdit = false;

                    if (serialSearchInfo.searchType === 'serialNo') {
                        this.listProgress = true;
                        this.serialNoService
                            .getSerialNoSearch(serialSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];

                                            for (const rowData of data.result) {
                                                rowData.action = '';
                                                rowData.editing = false;
                                                rowData.serialStatusId =
                                                    rowData.serialStatusId !==
                                                    null
                                                        ? Number(
                                                              rowData.serialStatusId
                                                          )
                                                        : null;
                                                rowData[
                                                    'originalData'
                                                ] = Object.assign({}, rowData);
                                                this.parameterData.push(
                                                    rowData
                                                );
                                            }
                                            this.parameterDataSource = new MatTableDataSource<
                                                any
                                            >(this.parameterData);
                                            this.parameterDataSource.paginator = this.paginator;
                                            // Sorting Start
                                             const sortState: Sort = {active: '', direction: ''};
                                             this.sort.active = sortState.active;
                                             this.sort.direction = sortState.direction;
                                             this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.parameterDataSource.sort = this.sort;
                                            // this.parameterDataSource
                                            //     .connect()
                                            //     .subscribe(d => {
                                            //         this.parameterDataSource.sortData(
                                            //             this.parameterDataSource
                                            //                 .filteredData,
                                            //             this.parameterDataSource
                                            //                 .sort
                                            //         );
                                            //     });
                                        } else {
                                            this.serialTableMessage =
                                                data.message;
                                        }
                                    } else {
                                        // alert(data.message);
                                        this.openSnackBar(
                                            data.message,
                                            '',
                                            'error-snackbar'
                                        );
                                    }
                                },
                                (error: any) => {
                                    this.listProgress = false;
                                    this.openSnackBar(
                                        error.error.message,
                                        '',
                                        'error-snackbar'
                                    );
                                }
                            );
                    }
                } else {
                    return;
                }
            }
        );
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
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
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        this.isAdd = true;
        this.isDisable = false;
        this.isEdit = false;
        this.parameterData.unshift({
            serialBatchId: '',
            serialCurrentLgId: null,
            serialCurrentLocatorId: null,
            serialDescription: null,
            serialHostId: null,
            serialId: null,
            serialInboundId: null,
            serialInspectionStatus: null,
            serialItemId: null,
            serialItemCode: '',
            showLov: 'hide',
            inlineSearchLoader: 'hide',
            serialIuId: String((JSON.parse(localStorage.getItem('defaultIU'))).id),
            serialLpnId: null,
            materialStatusId: null,
            serialNumber: null,
            serialOnhandStockId: null,
            serialOutboundId: null,
            serialParentNum: null,
            serialPreviousStatus: null,
            serialQuantity: null,
            serialReservationId: null,
            serialRevision: '',
            serialShipDate: new Date(),
            serialStatusId: null,
            serialSupplierBatchNum: null,
            batchNumberList: [{ label: ' Please Select', value: '' }],
            revisionList: [{ label: ' Please Select', value: '' }],
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            creationDate: null,
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedDate: null,
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
    }

    beginEdit(rowData: any, $event: any) {
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
            this.isAdd = false;
            this.isEdit = true;
            this.isDisable = false;
             if((JSON.parse(localStorage.getItem('defaultIU'))).id !== rowData.serialIuId){
             this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id)
            }
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
        if (this.parameterData[index].editing === true) {
            this.parameterData[index].serialStatusId = this.parameterData[
                index
            ].originalData.serialStatusId;
            this.parameterData[index].serialDescription = this.parameterData[
                index
            ].originalData.serialDescription;
            this.parameterData[index].inlineSearchLoader = this.parameterData[
                index
            ].originalData.inlineSearchLoader;
            this.parameterData[index].showLov = this.parameterData[
                index
            ].originalData.showLov;
            this.parameterData[index].serialIuCode                = this.parameterData[index].originalData.serialIuCode;
            this.parameterData[index].materialStatusId                = this.parameterData[index].originalData.materialStatusId;
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

    // Get the lov for Inventory Orgarnization
    getInventoryOrgLov() {
        this.enabledInventoryCodeList = [
            { viewValue: ' Please Select', key: '' }
        ];
        this.subInventorys.getInventoryOrgList().subscribe(
            (data: any) => {
                const inventoryCodelov = data.result;
                for (const rowData of inventoryCodelov) {
                    if (rowData.iuEnabledFlag === 'Y') {
                        this.enabledInventoryCodeList.push({
                            key: String(rowData.iuId),
                            viewValue: rowData.iuCode
                        });
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
        console.log('list-----');
        console.log(this.enabledInventoryCodeList);
    }

    // Get the Locator Groups List
    getAllLoctorGroupsLov() {
        this.allLocatorGroupList = [];
        this.commonService.getLocatorGroupList().subscribe(
            (data: any) => {
                const locatorGroupLov = data.result;
                if (!data.message) {
                    for (const rowData of locatorGroupLov) {
                        if (rowData.lgEnabledFlag === 'Y') {
                            this.allLocatorGroupList.push({
                                value: rowData.lgId,
                                label: rowData.lgCode
                            });
                        }
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    // Get the lov for Serial Status
    getSerialStatusList() {
        this.serialStatusList = [{ label: ' Please Select', value: '' }];
        this.serialNoService.getSerialStatusList().subscribe(
            (data: any) => {
                const serialStatuslov = data.result;
                for (const rowData of serialStatuslov) {
                    this.serialStatusList.push({
                        value: Number(rowData.lookupValue),
                        label: rowData.lookupValueDesc
                    });
                }
            },
            error => {
                this.openSnackBar(error , '', 'error-snackbar');
            }
        );
        console.log(this.serialStatusList);
    }

    // IUSelectionChanged(event: any, index, iuId) {
    //     if (event.source.selected && event.isUserInput === true && iuId) {
    //         this.serialNoService.getLOvsBasedon('item','iu',iuId).subscribe((data: any) => {
    //             this.parameterData[index].enabledSerialItemList = [{ label: ' Please Select', value: null }];
    //             if (data.status === 200) {
    //                 if (data.result.length) {
    //                     for (const IUData of data.result) {
    //                         if (IUData.itemSerialCntrldFlag === 'Y'){
    //                             this.parameterData[index].enabledSerialItemList.push({
    //                                 value: Number(IUData.itemId),
    //                                 label: IUData.itemName
    //                             });
    //                         }
    //                     }
    //                 }else{
    //                     this.parameterData[index].enabledSerialItemList = [];
    //                     this.parameterData[index].enabledSerialItemList.push({
    //                         value: null,
    //                         label: 'No Data Found'
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // }
    // getItemSerialControlled() {
    //     // if (event.source.selected && event.isUserInput === true && iuId) {
    //         this.serialNoService.getItemSerialEnabled().subscribe((data: any) => {
    //             this.enabledSerialItemList = [{ label: ' Please Select', value: null }];
    //             if (data.status === 200) {
    //                 if (data.result.length) {
    //                     for (const IUData of data.result) {
    //                         // if (IUData.itemSerialCntrldFlag === 'Y') {
    //                             this.enabledSerialItemList.push({
    //                                 value: String(IUData.itemId),
    //                                 label: IUData.itemName
    //                             });
    //                         // }
    //                     }
    //                 } else {
    //                     this.enabledSerialItemList = [];
    //                     this.enabledSerialItemList.push({
    //                         value: null,
    //                         label: 'No Data Found'
    //                     });
    //                 }
    //             }
    //         });
    //     // }
    // }

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
            this.getItemLovBySerial(
                this.parameterData[index].searchValue,
                index,
                event
            );
        } else {
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].searchValue = '';
            this.parameterData[index].serialItemId = null;
        }
    }

    getItemLovBySerial(itemName, index, event) {
        this.commonService
            .getItemLovBySerial('item', 'serial')
            .subscribe(
                (data: any) => {
                    this.enabledSerialItemList = [
                        {
                            key: '',
                            viewValue: ' Please Select',
                            itemDescription: ''
                        }
                    ];

                    if (data.result && data.result.length) {
                        data = data.result;
                        this.enabledSerialItemList = [];
                        for (let i = 0; i < data.length; i++) {
                            this.enabledSerialItemList.push({
                                key: data[i].itemId,
                                viewValue: data[i].itemName,
                                data: data[i]
                            });
                        }
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.parameterData[index].showLov = 'show';
                        this.parameterData[index].searchValue = '';

                        // Set the first element of the search

                        this.parameterData[index].serialItemId = data[0].itemId;
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

    // iu selection change function
    // iuSelectionChanged(event: any, index: any) {
    //     if (event.source.selected && event.isUserInput === true) {
    //         this.parameterData[index].serialIuCode = event.source.viewValue;
    //     }
    // }

defaultIUSelectionChange(iuId){
       for (const pData of this.parameterData) {
           if(pData.editing){
                for (const iuData of this.enabledInventoryCodeList) {
                    if(iuData.key === String(iuId)){
                        pData.serialIuCode = iuData.viewValue;
                        pData.serialIuId = iuData.key;
                    }
                }
           }
            if(pData.addNewRecord){
                for (const iuData of this.enabledInventoryCodeList) {
                    if(iuData.key === String(iuId)){
                        pData.serialIuCode = iuData.viewValue;
                        pData.serialIuId = iuData.key;
                    }
                }
           }
       }
}
    // status selection change function
    statusSelectionChanged(event: any, index: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.parameterData[index].serialStatus = event.source.viewValue;
        }
    }

    itemSelectionChanged(event: any, index, itemId) {
        if (event.source.selected && event.isUserInput === true && itemId) {
            this.serialNoService
                .getLOvsBasedon('batch-number', 'item', itemId)
                .subscribe((data: any) => {
                    this.parameterData[index].batchNumberList = [
                        { label: ' Please Select', value: '' }
                    ];
                    if (data.status === 200) {
                        if (data.result.length) {
                            data.result = data.result.sort((a, b) =>
                                a.batchNumber
                                    ? a.batchNumber.localeCompare(b.batchNumber)
                                    : a.batchNumber
                            );

                            for (const batchData of data.result) {
                                if (batchData.batchEnabledFlag === 'Y') {
                                    this.parameterData[
                                        index
                                    ].batchNumberList.push({
                                        value: Number(batchData.batchId),
                                        label: batchData.batchNumber
                                    });
                                }
                            }
                        } else {
                            this.parameterData[index].batchNumberList = [];
                            this.parameterData[index].batchNumberList.push({
                                value: null,
                                label: 'Please Select'
                            });
                        }
                    }
                    this.parameterData[index].serialItemCode =
                        event.source.viewValue;
                });

            this.serialNoService
                .getLOvsBasedon('revision', 'item', itemId)
                .subscribe((data: any) => {
                    this.parameterData[index].revisionList = [
                        { label: ' Please Select', value: '' }
                    ];
                    if (data.status === 200) {
                        if (data.result.length) {
                            data.result = data.result.sort((a, b) =>
                                a.revsnNumber
                                    ? a.revsnNumber.localeCompare(b.revsnNumber)
                                    : a.revsnNumber
                            );

                            for (const revisionData of data.result) {
                                this.parameterData[index].revisionList.push({
                                    value: Number(revisionData.revsnId),
                                    label: revisionData.revsnNumber
                                });
                            }
                        } else {
                            this.parameterData[index].revisionList = [];
                            this.parameterData[index].revisionList.push({
                                value: null,
                                label: 'Please Select'
                            });
                        }
                    }
                });
        }
    }

    LGSelectionChanged(event: any, index, lgId) {
        if (event.source.selected && event.isUserInput === true && lgId) {
            this.serialNoService
                .getLOvsBasedon('locator', 'lg', lgId)
                .subscribe((data: any) => {
                    this.parameterData[index].locatorList = [
                        { label: ' Please Select', value: null }
                    ];
                    if (data.status === 200) {
                        if (data.result.length) {
                            for (const locatorData of data.result) {
                                this.parameterData[index].locatorList.push({
                                    value: Number(locatorData.locatorId),
                                    label: locatorData.locCode
                                });
                            }
                        } else {
                            this.parameterData[index].locatorList = [];
                            this.parameterData[index].locatorList.push({
                                value: null,
                                label: 'Please Select'
                            });
                        }
                    }
                });
        }
    }

    LocatorSelectionChanged(event: any, index, locatorId) {
        if (event.source.selected && event.isUserInput === true && locatorId) {
            this.serialNoService
                .getLOvsBasedon('lpn', 'locator', locatorId)
                .subscribe((data: any) => {
                    this.parameterData[index].lpnList = [
                        { label: ' Please Select', value: null }
                    ];
                    if (data.status === 200) {
                        if (data.result.length) {
                            for (const locatorData of data.result) {
                                this.parameterData[index].lpnList.push({
                                    value: Number(locatorData.lpnId),
                                    label: locatorData.lpnNum
                                });
                            }
                        } else {
                            this.parameterData[index].lpnList = [];
                            this.parameterData[index].lpnList.push({
                                value: null,
                                label: 'Please Select'
                            });
                        }
                    }
                });
        }
    }


    regExpMatch(inputValue) {
        if (inputValue) {
            const rgxExp = inputValue.match(
                /[A-Z]{1,2}\d[0-9]{2,3}/g
            );
            if (rgxExp !== null) {
                return true;
            } else {
                return false;
            }
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
                        pData.serialIuId &&
                        pData.serialItemId &&
                        this.regExpMatch(pData.serialNumber) &&
                        pData.serialStatusId
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i].serialIuId = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i+1),
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
                        pData.serialIuId &&
                        pData.serialItemId &&
                        pData.serialNumber &&
                        pData.serialStatusId
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
            this.addSerial(dataArray);
        } else {
            this.updateSerial(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        }
        console.log(dataArray);
    }
  materialStatusLOV(){
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
                                    value: rowData.materialStatusId,
                                    label: rowData.materialStatusName
                                });
                            }
                            }
                        }
                })
    }
    addSerial(data) {
        const body = [];

        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);

            tempObj.serialIuId = Number(dataElement.serialIuId);
            tempObj.serialItemId = Number(dataElement.serialItemId);
            tempObj.serialShipDate = this.serialNoService.dateFormat(
                dataElement.serialShipDate
            );
            tempObj.serialBatchId =
                (dataElement.serialBatchId && dataElement.serialBatchId !== '') 
                    ? Number(dataElement.serialBatchId)
                    : null;
            tempObj.serialRevision =
                (dataElement.serialRevision && dataElement.serialRevision !== '')
                    ? Number(dataElement.serialRevision)
                    : null;

            body.push(tempObj);
        });
        this.serialNoService.createSerial(body).subscribe(
            result => {
                this.saveInprogress = false;
                if (result.status === 200) {
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.searchForSerialNo();
                } else {
                    this.isAdd = true;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
                // }

                for (const Serial of data) {
                    Serial.editing = true;
                    Serial.addNewRecord = true;
                }
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    updateSerial(data) {
        const body = [];
        data.forEach(dataElement => {
            dataElement.serialBatchId =
                dataElement.serialBatchId !== null
                    ? Number(dataElement.serialBatchId)
                    : null;
            dataElement.serialCurrentLgId =
                dataElement.serialCurrentLgId !== null
                    ? Number(dataElement.serialCurrentLgId)
                    : null;
            dataElement.serialCurrentLocatorId =
                dataElement.serialCurrentLocatorId !== null
                    ? Number(dataElement.serialCurrentLocatorId)
                    : null;
            dataElement.serialId =
                dataElement.serialId !== null
                    ? Number(dataElement.serialId)
                    : null;
            dataElement.serialItemId =
                dataElement.serialItemId !== null
                    ? Number(dataElement.serialItemId)
                    : null;
            dataElement.serialIuId =
                dataElement.serialIuId !== null
                    ? Number(dataElement.serialIuId)
                    : null;
            dataElement.serialLpnId =
                dataElement.serialLpnId !== null
                    ? Number(dataElement.serialLpnId)
                    : null;
            dataElement.serialRevision =
                dataElement.serialRevision !== null
                    ? Number(dataElement.serialRevision)
                    : null;
            dataElement.serialStatusId =
                dataElement.serialStatusId !== null
                    ? Number(dataElement.serialStatusId)
                    : null;
            dataElement.serialQuantity =
                dataElement.serialQuantity !== null
                    ? Number(dataElement.serialQuantity)
                    : null;
            dataElement.updatedBy =
                dataElement.updatedBy !== null
                    ? Number(dataElement.updatedBy)
                    : null;
            dataElement.createdBy =
                dataElement.createdBy !== null
                    ? Number(dataElement.createdBy)
                    : null;

            body.push(dataElement);
        });
        this.serialNoService.updateSerial(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.searchForSerialNo();
                } else {
                    this.isEdit = true;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
                // }
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                this.isEdit = true;
                for (const Ser of data) {
                    if (
                        this.parameterData.find(
                            d => (d.serialId = Ser.serialId)
                        )
                    ) {
                        const index = this.parameterData.indexOf(Ser);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = true;
                    }
                }
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(
        //         this.parameterDataSource.filteredData,
        //         this.parameterDataSource.sort
        //     );
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
        this.commonService.getScreenSize();
    }
        sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}
