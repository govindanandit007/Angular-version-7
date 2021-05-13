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
// import { Router } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';

export interface TaskDataElement {
    No?: number;
    pickSlipNumber: string;
    replenishmentId: number;
    replenishmentNum: string;
    shipmentNumber: string;
    salesOrder: string;
    cycleCountName: string;
    taskGroupNumber?: number;
    taskCount: string;
    action?: string;
    originalData?: any;
}

@Component({
    selector: 'app-task-summary',
    templateUrl: './task-summary.component.html',
    styleUrls: ['./task-summary.component.css']
})
export class TaskSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    parameterData: TaskDataElement[] = [];
    taskDataSource = new MatTableDataSource<TaskDataElement>(
        this.parameterData
    );
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    searchEnable: boolean;
    showSearch = true;
    private searchInfoArrayunsubscribe: any;
    taskMessage = '';
    listProgress = false;
    refreshSearchLov: any = '';
    screenMaxHeight: any;

    @Output() searchComponentToggle = new EventEmitter<boolean>();

    taskDisplayedColumns: string[] = [
        'No',
        'pickSlipNumber',
        'replenishmentNum',
        'shipmentNumber',
        'salesOrder',
        'workOrder',
        'cycleCountName',
        'taskGroupNumber',
        'taskCount',
        'action'
    ];
    columns: any = [
        { field: 'No', name: '#', width: 75, baseWidth: 6 },
        {
            field: 'pickSlipNumber',
            name: 'Pick Slip',
            width: 75,
            baseWidth: 9
        },
        {
            field: 'replenishmentNum',
            name: 'Replenishment',
            width: 75,
            baseWidth: 13
        },
        {
            field: 'shipmentNumber',
            name: 'Shipment',
            width: 75,
            baseWidth: 10
        },
        {
            field: 'salesOrder',
            name: 'Sales Order',
            width: 75,
            baseWidth: 11
        },
        {
            field: 'workOrder',
            name: 'Work Order',
            width: 75,
            baseWidth: 11
        },
        {
            field: 'cycleCountName',
            name: 'Cycle Count',
            width: 75,
            baseWidth: 11
        },
        {
            field: 'taskGroupNumber',
            name: 'Task Group #',
            width: 75,
            baseWidth: 12
        },
        { field: 'taskCount', name: 'Task Count', width: 75, baseWidth: 10 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 7 },
       
    ];

    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    constructor(
        public commonService: CommonService,
        private taskService: TaskService,
        private http: HttpClient,
        public router: Router,
        private snackBar: MatSnackBar
    ) {
        this.searchEnable = true;
    }
    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/task-search.json');
    ngOnInit() {
        this.showSearch = true;
        this.taskDataSource.sort = this.sort;
        this.taskDataSource.paginator = this.paginator;
        this.commonService.getScreenSize();
        this.searchJson.subscribe((resultData: any) => {
            this.dataForSearch = resultData;
            this.searchForTask();
            this.searchTask();
        });

        if (
            localStorage.getItem('taskSearchArray') &&
            localStorage.getItem('taskDtailPage')
        ) {
            this.search(
                JSON.parse(localStorage.getItem('taskSearchArray')).searchArray
            );
        }

        const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
        if(graphSearchData !== null){
            this.search(graphSearchData);
            localStorage.removeItem('graphSearchData');
        }
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
    searchTask() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (taskSearchInfo: any) => {
                // this.isEdit = false;
                // This code is used for updating the search module lovs when we update or add data
                const checksearchSource = this.checkSearch();
                if (checksearchSource === true) {
                    return;
                }

                // This code is used for not loading the search result when module loads
                if (taskSearchInfo.fromSearchBtnClick === true) {
                    this.parameterData = [];
                    this.taskDataSource = new MatTableDataSource();
                    this.taskDataSource.sort = this.sort;
                    setTimeout(() => {
                        this.taskDataSource.paginator = this.paginator;
                    }, 1000);
                    this.taskMessage = '';
                    // this.taskMessage = 'No category defined.';

                    if (taskSearchInfo.searchType === 'task') {
                        // this.isEdit = false;
                        // this.modifyButton = false;
                        // this.isAdd = false;
                        this.search(taskSearchInfo.searchArray);
                    }
                } else {
                    return;
                }
            }
        );
    }
    search(taskSearchInfo) {
        this.listProgress = true;
        this.taskService
            .getTaskSummarySearch(taskSearchInfo)
            .subscribe(
                (data: any) => {
                    this.listProgress = false;
                    if (data.status === 200) {
                        if (!data.message) {
                            this.parameterData = [];
                            for (const rowData of data.result) {
                                if (rowData.categoryEnabledFlag === 'N') {
                                    rowData.categoryEnabledFlag = false;
                                } else {
                                    rowData.categoryEnabledFlag = true;
                                }
                                rowData.action = '';
                                rowData.editing = false;
                                rowData.originalData = Object.assign(
                                    {},
                                    rowData
                                );
                                this.parameterData.push(rowData);
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
                            this.taskDataSource.connect().subscribe(d => {
                                this.taskDataSource.sortData(
                                    this.taskDataSource.filteredData,
                                    this.taskDataSource.sort
                                );
                            });
                        } else {
                            this.taskMessage = data.message;
                        }
                    } else {
                        this.openSnackBar(data.message, '', 'default-snackbar');
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
    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';

        this.commonService.getsearhForMasters([]);
        window.localStorage.removeItem('taskDtailPage');
    }

    gotoDetails(event: any, element: any) {
        const data = {
            pickSlipNumber: element.pickSlipNumber
                ? Number(element.pickSlipNumber)
                : null,
            taskGroupId: element.taskGroupNumber
                ? Number(element.taskGroupNumber)
                : null,
            cycleCountName: element.cycleCountName
                ? element.cycleCountName
                : '',
            // taskId: Number(element.taskId),
            shipmentId: element.shipmentId ? Number(element.shipmentId) : null,
            soId: element.soId ? Number(element.soId) : null,
            woId: element.woId ? Number(element.woId) : null,
            shipmentNumber: element.shipmentNumber,
            salesOrder: element.salesOrder,
            replenishmentId: element.replenishmentId
                ? Number(element.replenishmentId)
                : null
        };
        const navigationExtras: NavigationExtras = {
            queryParams: data
        };
        this.router.navigate(['task/taskDetails/'], navigationExtras);
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
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
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

    getScreenSize(event?) {
        const screenHeight = window.innerHeight;
        this.screenMaxHeight = screenHeight - 248 + 'px';
        //   this.scrWidth = window.innerWidth; 
    }
}
