import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  Output,
  EventEmitter,
  OnDestroy,
  ElementRef,
  HostListener,
  AfterViewInit,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource, MatDialogRef, MatDialog, MatTable, MatSort, Sort } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { TaskService } from 'src/app/_services/warehouse/task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NullAstVisitor } from '@angular/compiler';

export interface TaskDataElement {
    rowSelect?: boolean;
    No?: number;
    pickSlipNumber?: number;
    taskNumber: string;
    taskGroupNumber: string;
    taskStatus: string;
    iuCode: string;
    itemName: string;
    revisionNumber: string;
    qty: number;
    uom: string;
    shipmentNumber: string;
    salesOrder: string;
    soLine: string;
    lg: string;
    locatorCode: string;
    lpn: string;
    priority: string;
    priorityName?: string;
    userName: string;
    userId: number;
    batch: string;
    dropLg: string;
    destinationLG?: string;
    destinationLocator?: string;
    dropLocatorField: string;
    inlineSearchLoader?: string;
    showLov?: string;
    searchValue?: string;
    userList?: any;
    action?: string;
    batchCount: Number;
    serialCount: Number;
    addNewRecord?: boolean;
    editing?: boolean;
    originalData?: any;
    cycleCountName: string;
}

export interface ParameterDataElementBatch {
    No                  : string;
    batchNumber         : string;
    batchQty            : any;
    serialCount         : any;
    batchId             : any;
    batchOrginalDate    : any
    batchExpirationDate : any

}

export interface ParameterDataElementSerial {
    No                       : string;
    serialNo                 : string;
 }

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
    listProgressPopup = false;
    tooltipPosition: TooltipPosition[] = ['below'];
    parameterData: TaskDataElement[] = [];
    taskDataSource = new MatTableDataSource<TaskDataElement>(
        this.parameterData
    );
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    isEditable = false;
    isEdit = false;
    // isAdd = false;
    searchEnable: boolean;
    showSearch = true;
    private searchInfoArrayunsubscribe: any;
    taskMessage = '';
    listProgress = false;
    refreshSearchLov: any = '';
    modifyButton = false;
    modifySearchLoader = 'hide';
    userSearchValue = '';
    userId = '';
    userName = '';
    userShowLov = 'hide';
    userInlineSearchLoader = 'hide';
    userListForDialog: any[] = [];
    taskPriority = null;
    headerPickSlipNumber = null;
    headerTaskGroupNumber = null;
    headerTaskGroupId = null;
    headerCycleCountName = null;
    headerSalesOrder = null;
    headerShipmentNumber = null;
    taskSearchData: any = '';
    taskId: any = '';
    screenMaxHeight:any;
    shipmentId: any = null;
    soId: any = null;
    isBatch: any  = true;
    serialTableMessage = '';
    batchTableMessage = '';
    isBackBtnEnable : any = false;
    currentTaskId: any = null;
    taskSearchInfoDetail: any = null;
    selectAllRow = false;
    showSelectAllRow = false;
    selectedRowIndex = null;


    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @ViewChildren('myDialog', { read: TemplateRef }) myDialogRef: TemplateRef<any>;

    parameterDataBatch: ParameterDataElementBatch[] = [];
    parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
    parameterDisplayedColumnsBatch: string[] = [
      'No',                    
      'batchNumber',                 
      'batchQty',
      'batchOriginationDate',
      'batchExpirationDate',
      'serialCount'                                                                              
    ];

    parameterDataSerial: ParameterDataElementSerial[] = [];
    parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
    parameterDisplayedColumnsSerial: string[] = [
      'No',                
      'serialNumber'                                                                    
    ];


    taskDisplayedColumns: string[] = [
        'rowSelect',
        'No',
        'pickSlipNumber',
        'taskNumber',
        'taskGroupNo',
        'taskStatus',
        'iu',
        'itemName',
        'revisionNumber',
        'qty',
        'uom',
        'shipmentNumber',
        'salesOrder',
        'soLine',
        'workOrder',
        'lg',
        'locator',
        'lpn',
        'priority',
        'user',
        'dropDpn',
        'dropLG',
        'dropLocator',
        'cycleCountName',
        'batchCount',
        'serialCount',
        'action'
    ];
    columns: any = [
        { field: 'rowSelect', name: '', width: 50, baseWidth: 1.5 },
        { field: 'No', name: '#', width: 50, baseWidth: 1.5 },
        {
            field: 'pickSlipNumber',
            name: 'Pick Slip #',
            width: 150,
            baseWidth: 4.5
        },
        { field: 'taskNumber', name: 'Task #', width: 150, baseWidth: 3.5 },
        {
            field: 'taskGroupNo',
            name: 'Task Group #',
            width: 100,
            baseWidth: 5
        },
        { field: 'taskStatus', name: 'Task Status', width: 100, baseWidth: 4.5 },

        { field: 'iu', name: 'IU', width: 75, baseWidth: 3.5 },
        { field: 'itemName', name: 'Item', width: 75, baseWidth: 4.5 },
        { field: 'revisionNumber', name: 'Revision', width: 100, baseWidth: 3.5 },
        { field: 'qty', name: 'Qty', width: 100, baseWidth: 3 },
        { field: 'uom', name: 'UOM', width: 100, baseWidth: 3 },
        { field: 'shipmentNumber', name: 'Shipment', width: 100, baseWidth: 4 },
        { field: 'salesOrder', name: 'Sales Order', width: 100, baseWidth: 4 },
        { field: 'soLine', name: 'SO Line', width: 100, baseWidth: 4 },
        { field: 'workOrder', name: 'Work Order', width: 100, baseWidth: 4.5 },
        { field: 'lg', name: 'LG', width: 100, baseWidth: 3.5 },
        { field: 'locator', name: 'Locator', width: 100, baseWidth: 4 },
        { field: 'lpn', name: 'LPN', width: 100, baseWidth: 4 },
        { field: 'priority', name: 'Priority', width: 100, baseWidth: 4 },
        { field: 'user', name: 'User', width: 100, baseWidth: 4 },
        { field: 'dropDpn', name: 'Drop LPN', width: 100, baseWidth: 4 },
        { field: 'dropLG', name: 'Drop LG', width: 100, baseWidth: 4 },
        {
            field: 'dropLocator',
            name: 'Drop Locator',
            width: 100,
            baseWidth: 5
        },
        {
            field: 'cycleCountName',
            name: 'Cycle Count',
            width: 100,
            baseWidth: 4
        },
        { field: 'batchCount', name: 'Batch', width: 100, baseWidth: 3 },
        { field: 'serialCount', name: 'Serial', width: 100, baseWidth: 3 },
        { field: 'action', name: 'Action', width: 80, baseWidth: 2 }
    ];
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
    @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
    saveInprogress: boolean = false;
    woId: any;
    priorityList: { label: string; value: string; }[];
    taskPriorityName: string;
    disableAllBtn: any = false;



    constructor(
        public router: Router,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public dialog: MatDialog,
        public commonService: CommonService,
        private taskService: TaskService,
        private http: HttpClient,
        private route: ActivatedRoute
    ) {
        this.searchEnable = true;
    }
    dataForSearch: any = '';
    searchJson: any = this.http.get(
        './assets/search-jsons/task-detail-search.json'
    );

    ngOnInit() {
         window.localStorage.setItem(
             'taskDtailPage',
             'true'
         );
        this.showSearch = true;
        this.taskSearchInfoDetail = {searchType: 'taskDetail', searchArray: {}, fromSearchBtnClick: true};
        this.taskDataSource.sort = this.sort;
        this.taskDataSource.paginator = this.paginator;
        // this.taskDataSource.connect().subscribe(d => {
        //     // this.parameterData = d
        //     this.taskDataSource.sortData(this.taskDataSource.filteredData,this.taskDataSource.sort);
        // });
        this.commonService.getScreenSize();
        this.searchJson.subscribe((resultData: any) => {
            this.dataForSearch = resultData;
            this.searchForTask();
            this.searchTask();
        });
       // this.getPriorityList();

        this.route.queryParams.subscribe(params => {
            this.headerTaskGroupNumber = params.taskGroupNumber;
            this.headerTaskGroupId = params.taskGroupNumber;
            this.headerPickSlipNumber = params.pickSlipNumber;
            this.headerCycleCountName = params.cycleCountName;
            this.headerShipmentNumber = params.shipmentNumber;
            this.headerSalesOrder = params.salesOrder;
            this.taskId = params.taskId;
            this.shipmentId = params.shipmentId && params.shipmentId !== '0' ? params.shipmentId : null ;
            this.soId = params.soId;
            this.woId = params.woId;
            // this.headerrevsnNumber = params.revsnNumber;
            // this.headerlgCode = params.lgCode
            this.getTaskDetail(params);
        });
    }

    getTaskDetail(params) {
        // this.taskSearchData = params.onhandSearchData ? JSON.parse(params.onhandSearchData) : null;

 
        const data = {
            taskGroupId: Number(params.taskGroupId)
                ? Number(params.taskGroupId)
                : null,
            pickSlipNumber: params.pickSlipNumber
                ? Number(params.pickSlipNumber)
                : null,
            cycleCountName: params.cycleCountName ? params.cycleCountName : null,
            shipmentId : params.shipmentId && params.shipmentId !== '0' ? Number(params.shipmentId) : null,
            soId : params.soId ? Number(params.soId) : null,
            woId : params.woId ? Number(params.woId) : null,
            replenishmentId: params.replenishmentId ? Number(params.replenishmentId): null

        };
        // this.searchData = data;
        this.taskService.getTaskDetails(data).subscribe(
            (data: any) => {
                // this.listProgressPopup = false;
                // this.parameterDataSerial = [];
                if (data.status === 200) {
                    if (!data.message) {
                        this.parameterData = [];
                        for (const rData of data.result) {
                            rData.action = '';
                            rData.editing = false;
                            rData.originalData = Object.assign({}, rData);
                            this.parameterData.push(rData);
                        }
                        this.taskDataSource = new MatTableDataSource<
                            TaskDataElement
                        >(this.parameterData);
                        this.taskDataSource.paginator = this.paginator;
                        // Sorting Start
                           const sortState: Sort = {active: '', direction: ''};
                           this.sort.active = sortState.active;
                           this.sort.direction = sortState.direction;
                           this.sort.sortChange.emit(sortState);
                        // Sorting End
                        this.taskDataSource.sort = this.sort;
                        this.setSelectAllCheckBox();

                    } else {
                        this.taskMessage = data.message;
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

    checkSearch() {
        let returnType: any = '';
        if (this.refreshSearchLov === 'refresh') {
            returnType = true;
            this.refreshSearchLov = '';
        } else {
            returnType = false;
        }
        return returnType;
    }

    setSelectAllCheckBox(){
        for(const pData of this.parameterData){
            if( pData.taskStatus === 'New'){
              this.showSelectAllRow = true
            } 
        }
    }

    refresh(){
          
        if(this.taskSearchInfoDetail.searchType === 'task'){
            this.taskSearchInfoDetail = {searchType: 'taskDetail', searchArray: {}, fromSearchBtnClick: true}
        }
        if(this.taskSearchInfoDetail && this.taskSearchInfoDetail.length === 0 || this.taskSearchInfoDetail === null || this.taskSearchInfoDetail === '' ){
            this.taskSearchInfoDetail = {searchType: 'taskDetail', searchArray: {}, fromSearchBtnClick: true}
        }
        this.search(this.taskSearchInfoDetail)
    }

    searchTask() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (taskSearchInfo: any) => {
                this.search(taskSearchInfo)
            }
        );
    }

    search(taskSearchInfo){
        
        this.isEdit = false;
        this.customTable.nativeElement.scrollLeft = 0;
        this.taskSearchInfoDetail = taskSearchInfo;
        // This code is used for updating the search module lovs when we update or add data
        const checksearchSource = this.checkSearch();
        if (checksearchSource === true) {
            return;
        }

        // This code is used for not loading the search result when module loads
        if (taskSearchInfo.fromSearchBtnClick === true) {
            //    taskSearchInfo.fromSearchBtnClick = false;
            //    this.commonService.getsearhForMasters(taskSearchInfo);

            this.parameterData = [];
            this.taskDataSource = new MatTableDataSource();
            this.taskDataSource.sort = this.sort;
            setTimeout(() => {
                this.taskDataSource.paginator = this.paginator;
            }, 1000);
            this.taskMessage = '';
            // this.taskMessage = 'No category defined.';

            if (taskSearchInfo.searchType === 'taskDetail') {
                this.isEdit = false;
                this.modifyButton = false;
                // this.isAdd = false;
                this.listProgress = true;
                taskSearchInfo.searchArray.taskGroupId = Number(this.headerTaskGroupId) ? Number(this.headerTaskGroupId) : null ;
                taskSearchInfo.searchArray.pickSlipNumber = this.headerPickSlipNumber;
                taskSearchInfo.searchArray.cycleCountName = this.headerCycleCountName ? this.headerCycleCountName : null;
                taskSearchInfo.searchArray.shipmentNumber = this.headerShipmentNumber ? this.headerShipmentNumber : null;
                taskSearchInfo.searchArray.salesOrder = this.headerSalesOrder;

                this.taskService
                    .getTaskSearch(taskSearchInfo.searchArray)
                    .subscribe(
                        (data: any) => {
                            this.listProgress = false;
                            if (data.status === 200) {
                                if (!data.message) {
                                    this.parameterData = [];
                                    for (const rowData of data.result) {
                                        if (
                                            rowData.categoryEnabledFlag ===
                                            'N'
                                        ) {
                                            rowData.categoryEnabledFlag = false;
                                        } else {
                                            rowData.categoryEnabledFlag = true;
                                        }
                                        rowData.action = '';
                                        rowData.editing = false;
                                        rowData.originalData = Object.assign({}, rowData);
                                        this.parameterData.push(
                                            rowData
                                        );
                                    }

                                    this.taskDataSource = new MatTableDataSource<
                                        TaskDataElement
                                    >(this.parameterData);
                                    this.taskDataSource.paginator = this.paginator;
                                    this.taskDataSource.sort = this.sort;
                                } else {
                                    this.taskMessage = data.message;
                                }
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
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                        }
                    );
            }
        } else {
            return;
        }
    }
    // show / hide search section
    getSearchToggle(searchToggle: boolean) { 
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }
    // search for Task
    searchForTask() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
    // search for Category
    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    openBatchPopup(templateRef: TemplateRef<any>, element: any){
        if(element.batchCount === 0){
          return
        }
        this.listProgressPopup = true;
        this.currentTaskId = element.taskNumber;
        const data = {
            taskId:  element.taskNumber,
        }
    
        this.taskService.getTaskBatchList(data)
        .subscribe(
            (data: any) => {
                this.listProgressPopup = false;
                this.parameterDataBatch = [];
                if (data.status === 200) {
                     
                    if (!data.message) {
                        this.isBatch = true;
                        this.dialog.open(templateRef, {
                          autoFocus: false,
                          minWidth: 800,
                          width: '800'
                        });
                       
                        for (const rowData of data.result) {
                            this.parameterDataBatch.push(rowData);
                        }
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                         setTimeout(() => {
                            this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                            this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                        },500);   
                       
                    } else {
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                        setTimeout(() => {
                        this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                        this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                        },100);   
                         this.batchTableMessage = data.message;
                        this.isBatch = true;
                        this.dialog.open(templateRef, {
                          autoFocus: false,
                          minWidth: 800,
                          width: '800',
                          minHeight: 200
                        });
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
        
    }

    openSerialPopup(templateRef: TemplateRef<any>, element: any){
        this.isBackBtnEnable = false;
        if(element.serialCount === 0){
          return
        }
        this.listProgressPopup = true;
    
        const data = {
            taskId  : element.taskNumber,
            batchId : null,
        }

      
    
        this.taskService.getTaskSerialList(data)
        .subscribe(
            (data: any) => {
                this.listProgressPopup = false;
                this.parameterDataSerial = [];
                if (data.status === 200) {
                    
                    if (!data.message) {
                        this.isBatch = false;
                        this.dialog.open(templateRef, {
                          autoFocus: false,
                          minWidth: 260
                        });
                        for (const rowData of data.result) {
                            this.parameterDataSerial.push(rowData);
                        }
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100);
                    } else {
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100);
                        this.serialTableMessage = data.message;
                        this.isBatch = false;
                        this.dialog.open(templateRef, {
                          autoFocus: false,
                          minWidth: 260,
                          minHeight: 200
                        });
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
       
      }
    
      openBatchSerialPopup(templateRef: TemplateRef<any>, element: any){
        if(element.serialList === 0){
          return
        }
        this.isBatch = false;
        this.isBackBtnEnable = true
        this.listProgressPopup = true;
        const data = {
          taskId  : this.currentTaskId,
          batchId : element.batchId,
        }
       
        this.taskService.getTaskSerialList(data)
        .subscribe(
            (data: any) => {
                this.listProgressPopup = false;
                this.parameterDataSerial = [];
                if (data.status === 200) {
                    
                    if (!data.message) {
                        for (const rowData of data.result) {
                            this.parameterDataSerial.push(rowData);
                        }
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100);
                       
                    } else {
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100);
                        this.serialTableMessage = data.message;
                      
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
       
      }

      closeDialog(){
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );             
        this.dialog.closeAll();
        this.disableAllBtn = false;
      }
    
    backToBatchList(){
        this.isBatch = true;
        this.isBackBtnEnable = false;
    }

    selectAll(){
        for(const pData of this.parameterData){
          if(this.selectAllRow && pData.taskStatus === 'New'){
            pData.rowSelect = true;
          } else{
            pData.rowSelect = false;
          }
    
        }
        this.selectedRowCount()
      }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';

        this.refreshSearchLov = '';
        this.commonService.getsearhForMasters([]);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }

    beginEdit(rowData: any, index, event: any, fromEdit?:any) {
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
        if (rowData.editing === false && fromEdit === true) {
            rowData.editing = true;
            this.selectedRowCount();
            this.isEdit = true;
            rowData.inlineSearchLoader = 'hide';
            rowData.showLov = 'show';
             
            if (
                this.parameterData[index].userName !== null &&
                this.parameterData[index].userName !== undefined &&
                this.parameterData[index].userName !== ''
            ) {
                this.getUserLovByScreen(
                    this.parameterData[index].userName,
                    index,
                    event
                );
            }else{
                this.parameterData[index].showLov = 'hide';
                this.parameterData[index].searchValue = '';
            }
          
        } else if (rowData.rowSelect === true) {
            rowData.editing = false;
        } else {
           
        }

        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
    }

    selectedRowCount() {
        let selectRowCount = 0;
        for (const data of this.parameterData) {
            if (data.rowSelect) { 
                selectRowCount++;
            }
        }

        if (selectRowCount >= 2) {
            this.modifyButton = true;
        } else {
            this.modifyButton = false;
        }

        if(selectRowCount === 0){
            this.selectAllRow = false;
        }
        if(selectRowCount === this.parameterData.length){
            this.selectAllRow = true;
        }else{
            this.selectAllRow = false;
        }
    }
    
    openModifyDialog(templateRef: TemplateRef<any>, actionType) {
        // this.getNestedChildData(templateRef, element, rowIndex, 'addRule');
        // if (this.nestedParameterDataElement.length) {
        //   this.sortDialogTitle = element.priorityName;
        //   this.sortParameterData = [];
        //   this.priorityId = element.priorityId;
        //   for (const rowData of element.sort) {
        //     rowData.action = '';
        //     rowData.editing = false;
        //     this.sortParameterData.push(rowData);
        //   }

        //   this.sortParameterDataSource = new MatTableDataSource<
        //     SortParameterDataElement
        //   >(this.sortParameterData);

        //   if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) {
            this.disableAllBtn = true;
            //setTimeout(() => { this.disableAllBtn = false; }, 1000);
        this.dialog.open(templateRef, {
            hasBackdrop: false,
            width: '30%',
            autoFocus: false
            // data: rowIndex
        });
        //   }
        // } else {
        //   this.openSnackBar(
        //     'Please add atleast one rule.',
        //     '',
        //     'error-snackbar'
        //   );
        //   return;
        // }
    }

    fetchNewUserListForDialog(event: any, index: any, searchFlag: any) {
        const value = this.userSearchValue;
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.userShowLov === 'hide') {
            // if(this.userSearchValue.length > 0 && this.userSearchValue.length < this.commonService.searchInitTextLenght){
            //     this.openSnackBar('Please Enter minimum 3 Charecters', '','error-snackbar');
            //     return;
            //   }
            this.userInlineSearchLoader = 'show';
            this.getUserLovForDialog(this.userSearchValue, index, event);
        } else {
            this.userShowLov = 'hide';
            this.userSearchValue = '';
            this.userId = '';
            this.userName =  '';
        }
    }

    getUserLovForDialog(userName, index, event) {
        this.taskService.getUserLovByScreen(userName).subscribe(
            (data: any) => {
                this.userListForDialog = [
                    {
                        value: '',
                        label: ' Please Select'
                        // itemDescription: ''
                    }
                ];

                if (data.result && data.result.length) {
                    data = data.result;
                    this.userListForDialog = [];
                    for (let i = 0; i < data.length; i++) {
                        this.userListForDialog.push({
                            value: data[i].userId,
                            label: data[i].userName,
                            data: data[i]
                        });
                    }
                    this.userInlineSearchLoader = 'hide';
                    this.userShowLov = 'show';
                    // this.userSearchValue = '';

                    // Set the first element of the search
                    this.userId = data[0].userId;
                    this.userName =  data[0].userName;
                } else {
                    this.parameterData[index].inlineSearchLoader = 'hide';
                    this.openSnackBar('No match found', '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    modifyDone(event) {
        // for (const pdata of this.parameterData) {
        let searchValue = '';
        if(this.userId){
            searchValue = this.userId;
        }else if(this.userSearchValue){
            searchValue = this.userSearchValue;
        }

        if(!this.taskPriority  || !searchValue){
            this.openSnackBar('Please fill the required fields', '', 'error-snackbar');
           
            return;
        }
        // let curobj = this.priorityList.find(a => a.value === this.taskPriority);
        // if(curobj){
        //     this.taskPriorityName = curobj.label;
        // }
        for (const [index, pData] of this.parameterData.entries()) {
            if (pData.rowSelect === true) {
                pData.priority = this.taskPriority;
               // pData.priorityName = this.taskPriorityName;

                pData.userName = this.userName;
                pData.userId   = Number(this.userId);
                pData.showLov = 'show';
                // this.getUserLovByScreen(this.userSearchValue, index, event);
                this.modifyButton = true
                this.isEdit = true
                // this.supplierSelectionChanged({ source: { selected: true }, isUserInput: true }, this.userId)
            }
        }
        this.taskDataSource = new MatTableDataSource<
            TaskDataElement
        >(this.parameterData);
        this.taskDataSource.paginator = this.paginator;
        this.taskDataSource.sort = this.sort;
        this.disableAllBtn = false;
        this.dialog.closeAll();
    }

    popupUserChanged(event: any, element){

        if (event.source.selected && event.isUserInput === true) {
            this.userId   = element.value;
            this.userName = element.label;
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (rowData.editing === true) {
            this.parameterData[index].priority = this.parameterData[
                index
            ].originalData.priority;
            this.parameterData[index].userName = this.parameterData[
                index
            ].originalData.userName;
            this.parameterData[index].editing = false;
            this.parameterData[index].rowSelect = false;
            rowData.editing = false;
            // this.rowSelectChange();
            this.selectedRowCount();
        }
        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
            // this.rowSelectChange();
            this.selectedRowCount();
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.parameterData.splice(rowIndex, 1);
        this.taskDataSource = new MatTableDataSource<TaskDataElement>(
            this.parameterData
        );
        this.taskDataSource.paginator = this.paginator;
        this.taskDataSource.sort = this.sort;
        this.checkIsAddRow();
        // this.isDisable = true;
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
            // this.isAdd = false;
        }
    }
    fetchNewUserSearchList(
        event: any,
        index: any,
        searchFlag: any,
        value: any
    ) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.parameterData[index].showLov === 'hide') {
            this.parameterData[index].inlineSearchLoader = 'show';
            this.getUserLovByScreen(
                this.parameterData[index].searchValue,
                index,
                event
            );
        } else {
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].searchValue = '';
            this.parameterData[index].userId = null;
        }
    }
    getUserLovByScreen(userName, index, event) {

        this.taskService.getUserLovByScreen(userName).subscribe(
            (data: any) => {
                this.parameterData[index].userList = [
                    {
                        key: '',
                        viewValue: ' Please Select',
                        itemDescription: ''
                    }
                ];

                if (data.result && data.result.length) {
                    data = data.result;
                    this.parameterData[index].userList = [];
                    for (let i = 0; i < data.length; i++) {
                        this.parameterData[index].userList.push({
                            value: data[i].userId,
                            label: data[i].userName,
                            data: data[i]
                        });
                    }
                    this.parameterData[index].inlineSearchLoader = 'hide';
                    this.parameterData[index].showLov = 'show';
                    this.parameterData[index].searchValue = '';

                    // Set the first element of the search

                    this.parameterData[index].userId = data[0].userId;
                } else {
                    this.parameterData[index].inlineSearchLoader = 'hide';
                    this.openSnackBar('No match found', '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    userChanged(event: any, element: any, index: any){

        if (event.source.selected === true && event.isUserInput === true) {
            this.parameterData[index].userId   = element.value;
            this.parameterData[index].userName = element.label;
        }
    }


    // open dialog
    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage
            }
        });
    }

    onSubmit(event: any, type: string) {
        if (event) {
           this. saveInprogress = true;
            event.stopImmediatePropagation();
            this.selectedRowIndex = null;
            const dataArray: any[] = [];
            for (const [i, pData] of this.parameterData.entries()) {
                if (pData.rowSelect === true || pData.editing === true) {
                    if (!pData.userId) {
                        this.selectedRowIndex = i;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i + 1),
                            '',
                            'error-snackbar'
                        );
                        this.saveInprogress = false;
                        return;
                    }
                }
            }
            for (const [i, pData] of this.parameterData.entries()) {
                // if (type === 'save') {
                if (pData.rowSelect === true || pData.editing === true) {
                    if (pData.userId) {
                        const tempObj: any = {};
                        tempObj.taskId = pData.taskNumber;
                        tempObj.taskPriority = Number(pData.priority);
                        tempObj.userId = pData.userId;
                        tempObj.updatedBy = JSON.parse(
                            localStorage.getItem('userDetails')
                        ).userId;
                        dataArray.push(tempObj);
                        // this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = false;
                       
                    }
                }
            }

            this.taskService.updateTask(dataArray).subscribe(
                (resultData: any) => {
                    if (resultData.status === 200) {
                        this.isEdit = false;
                        this.openSnackBar(
                            resultData.message,
                            '',
                            'success-snackbar'
                        );

                        // this.router.navigate(['task']);
                    } else {
                        this.openSnackBar(
                            resultData.message,
                            '',
                            'error-snackbar'
                        );
                    }
                    this.saveInprogress = false;
                },
                error => {
                    this.openSnackBar(
                        error.error.message,
                        '',
                        'error-snackbar'
                    );
                    this.saveInprogress = false;
                }
            );
        }
    }

    ngAfterViewInit() {
        this.taskDataSource.sort = this.sort;
        // this.taskDataSource.connect().subscribe(d => {
        //     this.taskDataSource.sortData(
        //         this.taskDataSource.filteredData,
        //         this.taskDataSource.sort
        //     );
        // });
        setTimeout(() => {
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
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

    getScreenSize(event?) {
        const screenHeight = window.innerHeight;
          this.screenMaxHeight = (screenHeight - 248) + 'px';
        //   this.scrWidth = window.innerWidth; 
    } 
    
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.taskDataSource.sortData(this.taskDataSource.filteredData, this.taskDataSource.sort);      
       
    }
}

