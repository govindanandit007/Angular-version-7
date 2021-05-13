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
import { MatSort , Sort} from '@angular/material';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { MaterialStatusService } from 'src/app/_services/transactions/material-status.service';
import { debug } from 'console';

export interface ParameterDataElement {
    serialBatchId: any;
    serialCurrentLgId: number;
    serialCurrentLocatorId: number;
    serialDescription: string;
    serialHostId: number;
    id?: number;
    serialInboundId: number;
    serialInspectionStatus: string;
    serialItemId: number;
    showLov?: string,
    searchValue?: string,
    inlineSearchLoader?: string,
    serialItemCode: string;
    serialIuId: any;
    serialIuCode?: string;
    serialLpnId: number;
    serialNumber: string
    serialOnhandStockId: number;
    serialOutboundId: number;
    serialParentNum: number;
    serialPreviousStatus: number;
    serialQuantity: number;
    serialReservationId: number;
    serialRevision: any;
    serialShipDate: Date;
    statusId: number;
    serialStatus?: string;
    serialSupplierBatchNum: string;
    updatedDate: string;
    createdBy: number;
    creationDate: string;
    updatedBy: number;
    editing: boolean;
    action: string;
    addNewRecord?: boolean;
    enabledSerialItemList?: any;
    entityValueList?: any;
    locatorList?: any;
    lpnList?: any;
    revisionList?: any;
    originalData?: any;
    materialStatusId:any;
}

@Component({
    selector: 'app-material-status-list',
    templateUrl: './material-status-list.component.html',
    styleUrls: ['./material-status-list.component.css']
})
export class MaterialStatusListComponent implements OnInit, AfterViewInit, OnDestroy {
    listProgress = false;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'sno',
        'materialIuId',
        'materialEntity',
        'number',
        'materialStatusId',
        'action'
    ];
    columns: any = [
        { field: 'sno', name: '#', width: 75, baseWidth: 10 },
        { field: 'materialIuId', name: 'IU', width: 75, baseWidth: 20 },
        { field: 'materialEntity', name: 'Entity', width: 75, baseWidth: 20 },
        { field: 'number', name: 'Entity Value', width: 75, baseWidth: 20 },
        { field: 'materialStatusId', name: 'Material Status', width: 75, baseWidth: 20 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
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

    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

    tooltipPosition: TooltipPosition[] = ['below'];
    materialStatusList: any[];
    enabledInventoryCodeList: any;
    entityLOVList: any;
    selectedRowIndex = null;
    update: any = true;
    constructor(
        private snackBar: MatSnackBar,
        private render: Renderer,
        public commonService: CommonService,
        public materialStatusService: MaterialStatusService,
        private http: HttpClient,
        private subInventorys: SubInventoryService
    ) {
        this.searchEnable = true;
    }

    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/material-status-search.json');

    ngOnInit() {
        this.getMaterialStatusList();
        this.getInventoryOrgLov();
        this.getEntityLookupLov();
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchMaterialStatus();
            this.searchForMaterialStatus();
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

    // search for material Status
    searchForMaterialStatus() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchMaterialStatus() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (serialSearchInfo: any) => {
                this.isEdit = false;


                // This code is used for not loading the search result when module loads
                if (serialSearchInfo.fromSearchBtnClick === true) {
                    this.selectedRowIndex = null;
                    this.customTable.nativeElement.scrollLeft = 0;
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    this.isAdd = false;
                    this.isEdit = false;

                    if (serialSearchInfo.searchType === 'materialStatus') {
                        if (serialSearchInfo.searchArray.entity === undefined || serialSearchInfo.searchArray.entity === '') {
                            this.openSnackBar(' Please Select the entity', '', 'default-snackbar');
                            return;
                        }
                        this.listProgress = true;
                        this.materialStatusService
                            .getMaterialStatusSearch(serialSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];

                                            for (const rowData of data.result) {
                                                rowData.action = '';
                                                rowData.editing = false;
                                                rowData[
                                                    'originalData'
                                                ] = Object.assign({}, rowData);
                                                this.parameterData.push(
                                                    rowData
                                                );
                                            }
                                            this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                                            this.parameterDataSource.paginator = this.paginator;
                                            this.sort.sort({id: '', start: null , disableClear: false});
                                            this.parameterDataSource.sort = this.sort;
                                            // this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                        } else {
                                            this.serialTableMessage =
                                                data.message;
                                        }
                                         
                                        console.log(this.parameterData)
                                    } else {
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

    // Get the lov for Serial Status
    getMaterialStatusList() {
        this.materialStatusList = [{ label: ' Please Select', value: null }];
        this.commonService.getMaterialStatusLOV().subscribe(
            (result: any) => {
                this.materialStatusList = [{
                    label: ' Please Select',
                    value: null
                }];
                if (result.status === 200) {
                    if (result.result) {
                        const data = result.result;
                        for (const rowData of data) {
                            if(rowData.enabledFlag === 'Y'){
                                this.materialStatusList.push({
                                    value: rowData.materialStatusId,
                                    label: rowData.materialStatusName
                                });
                            }
                        }
                    }
                }
            })
        console.log(this.materialStatusList);
    }
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    beginEdit(rowData: any, $event: any) {
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
            this.update = true;
            rowData.editing = true;
            this.isAdd = false;
            this.isEdit = true;
            this.isDisable = false;
        } else {
        }
    }

    disableEdit(rowData: any, index: any) {
        if (this.parameterData[index].editing === true) {

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
            { label: ' Please Select', value: '' }
        ];
        this.subInventorys.getInventoryOrgList().subscribe(
            (data: any) => {
                const inventoryCodelov = data.result;
                for (const rowData of inventoryCodelov) {
                    if (rowData.iuEnabledFlag === 'Y') {
                        this.enabledInventoryCodeList.push({
                            value: rowData.iuId,
                            label: rowData.iuCode
                        });
                    }
                }
            },
            error => {                
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );         
    }
    // Get the lov for Inventory Orgarnization
    getEntityLookupLov() {
        this.entityLOVList = [
            { label: ' Please Select', value: '' }
        ];
        this.commonService
            .getLookupLOV('Entity')
            .subscribe((data: any) => {
                const entitylov = data.result;
                for (const rowData of entitylov) {
                    this.entityLOVList.push({
                        value: rowData.lookupValue,
                        label: rowData.lookupValue
                    });
                }

            });
    }
    // entity selection change function
    entitySelectionChanged(event: any, index, entityValue, iuid) {
        if (event.source.selected && event.isUserInput === true && entityValue && iuid) {

            this.materialStatusService
                .getEntityValueLOV(iuid, entityValue)
                .subscribe((data: any) => {
                    this.parameterData[index].entityValueList = [
                        { label: ' Please Select', value: '' }
                    ];
                    if (data.status === 200) {

                        if (data.result.length) {
                            data.result = data.result.sort((a, b) =>
                                a.number
                                    ? a.number.localeCompare(b.number)
                                    : a.number
                            );

                            for (const entityData of data.result) {
                                // if (entityData.batchEnabledFlag === 'Y') {
                                this.parameterData[
                                    index
                                ].entityValueList.push({
                                    value: Number(entityData.id),
                                    label: entityData.number
                                });
                                // }
                            }
                        } else {
                            this.parameterData[index].entityValueList = [];
                            this.parameterData[index].entityValueList.push({
                                value: null,
                                label: 'No Data Found'
                            });
                        }
                    }
                    this.parameterData[index].serialItemCode =
                        event.source.viewValue;
                });

            // this.serialNoService
            //     .getLOvsBasedon('revision', 'item', itemId)
            //     .subscribe((data: any) => {
            //         this.parameterData[index].revisionList = [
            //             { label: ' Please Select', value: '' }
            //         ];
            //         if (data.status === 200) {
            //             if (data.result.length) {
            //                 data.result = data.result.sort((a, b) =>
            //                     a.revsnNumber
            //                         ? a.revsnNumber.localeCompare(b.revsnNumber)
            //                         : a.revsnNumber
            //                 );

            //                 for (const revisionData of data.result) {
            //                     this.parameterData[index].revisionList.push({
            //                         value: Number(revisionData.revsnId),
            //                         label: revisionData.revsnNumber
            //                     });
            //                 }
            //             } else {
            //                 this.parameterData[index].revisionList = [];
            //                 this.parameterData[index].revisionList.push({
            //                     value: null,
            //                     label: 'No Data Found'
            //                 });
            //             }
            //         }
            //     });
        }
    }
    onSubmit(type: string) {
        const dataArray: any[] = [];
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'update') {
                if (pData.editing === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.statusId
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
                        this.openSnackBar(
                            'Please select status in row ' + (i + 1),
                            '',
                            'default-snackbar'
                        );
                        return;
                    }
                }
            }
        }

        if (type === 'update') {
            this.updateMaterialStatus(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        }
        console.log(dataArray);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updateMaterialStatus(data) {
        const body = [];
        data.forEach(dataElement => {
            dataElement.iuId = dataElement.iuid !== null ? Number(dataElement.iuid) : null;
            dataElement.entityValue = dataElement.id !== null ? Number(dataElement.id) : null;
            dataElement.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
            dataElement.materialStatus = dataElement.status
            body.push(dataElement);
        });
        this.update = false;
        this.materialStatusService.updateMaterialStatus(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.openSnackBar(this.capitalizeFirstLetter(result.message), '', 'success-snackbar');
                    this.searchMaterialStatus();
                } else {
                    this.update = true;
                    this.isEdit = true;
                    this.openSnackBar(this.capitalizeFirstLetter(result.message), '', 'error-snackbar');
                }
            },
            (error: any) => {
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                this.update = true;
                this.isEdit = true;
                for (const Ser of data) {
                    if (
                        this.parameterData.find(
                            d => (d.id == Ser.id)
                        )
                    ) {
                        const index = this.parameterData.indexOf(Ser);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = false;
                    }
                }
                this.openSnackBar(this.capitalizeFirstLetter(error.error.message), '', 'error-snackbar');
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
        // this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
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
