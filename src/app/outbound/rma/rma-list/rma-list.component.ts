import {
    Component, OnInit, ViewChild, Renderer, Output, EventEmitter, TemplateRef,
    OnDestroy, Optional, Inject, HostListener, ElementRef, AfterViewInit
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { Action } from 'rxjs/internal/scheduler/Action';
import { SalesOrderService } from 'src/app/_services/outbound/sales-order.service';

export interface ParameterDataElement {
    soId: string;
    soNumber: string;
    rmaNumber: string;
    soType: string;
    soDate: string;
    soStatus: string;
    soTypeName?: string;
    statusName?: string;
    ouCode: string;
    tpName: string;
    tpSiteName: string;
    soPriority: string;
    action: string;
}

@Component({
    selector: 'app-rma-list',
    templateUrl: './rma-list.component.html',
    styleUrls: ['./rma-list.component.css']
})
export class RmaListComponent implements OnInit {

    searchEnable: boolean;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    private searchInfoArrayunsubscribe: any;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    listProgressRMA = false;
    soTableMessage = '';
    currentSelectedData: any = null;
    selectedRowIndex: any = null;
    soForRMA: any = '';
    soForRMAList: any = [{ value   : '', label : ' Please Select' }];
    parameterDisplayedColumns: string[] = [
        'soId',
        'soNumber',
        'rmaNumber',
        'soType',
        'soDate',
        'soStatus',
        'soOU',
        'soCustomer',
        'soCustomerSite',
        'soPriority',
        'action'
    ];

    columns: any = [
        { field: 'soId', name: '#', width: 75, baseWidth: 5 },
        { field: 'soNumber', name: 'SO #', width: 75, baseWidth: 7 },
        { field: 'soType', name: 'Type', width: 75, baseWidth: 12 },
        { field: 'soDate', name: 'Date', width: 75, baseWidth: 9.5 },
        { field: 'soStatus', name: 'Status', width: 75, baseWidth: 9 },
        { field: 'soOU', name: 'OU', width: 75, baseWidth: 8 },
        { field: 'soCustomer', name: 'Customer', width: 75, baseWidth: 12 },
        { field: 'soCustomerSite', name: 'Customer Site', width: 75, baseWidth: 16 },
        { field: 'soPriority', name: 'Priority', width: 75, baseWidth: 7 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 8 },
        { field: 'rmaNumber', name: 'RMA #', width: 75, baseWidth: 10 }
    ]
    showSOLov: String = 'hide';
    inlineSOSearchLoader:String = 'hide';
    soSearchValue: String = '';
    showSearch = true;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );

    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
    @ViewChild('myDialog', { static: true }) confirmationDialog: TemplateRef<any>;
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        private salesOrderService: SalesOrderService,
        public dialog: MatDialog,
        private http: HttpClient
    ) {
        this.searchEnable = true;
        this.commonService.getScreenSize(-84);
    }
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/rma-search.json'); 
    ngOnInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchSalesOrder();
            this.searchForSalesOrder();
        });
    }

    getSelectedItemRecord(data, index) {
        this.selectedRowIndex = index;
        this.currentSelectedData = data;
        console.log(this.currentSelectedData)
    }

    searchSalesOrder() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {

                // This code is used for not loading the search result when module loads 
                if (searchInfo.fromSearchBtnClick === true) {
                    this.customTable.nativeElement.scrollLeft = 0;
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                    this.parameterDataSource.paginator = this.paginator;
                    if (searchInfo.searchType === 'salesorder') {
                        this.listProgress = true;
                        this.salesOrderService
                            .getSOSearch(searchInfo.searchArray)
                            .subscribe(data => {
                                if (data.status === 200) {
                                    if (!data.message) {
                                        this.parameterData = [];
                                        this.listProgress = false;
                                        this.dataResult = true;
                                        for (const rData of data.result) {
                                            rData.action = '';
                                            this.parameterData.push(rData);
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
                                        this.listProgress = false;
                                        this.dataResult = false;
                                        this.soTableMessage = data.message;
                                    }
                                } else {
                                    this.listProgress = false;
                                    this.openSnackBar(
                                        data.message,
                                        '',
                                        'error-snackbar'
                                    );
                                }
                            });
                    }
                } else {
                    this.listProgress = false;
                    return;
                }
            }
        );
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.commonService.getsearhForMasters([]);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    // search for purchase order
    searchForSalesOrder() {
        this.commonService.searhForMasters(this.dataForSearch);
        // this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        // console.log('searchToggle');
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    getLovForSo() {
        this.soForRMA = '';
        this.soForRMAList = [];
        const soSearch = { soIuId: String((JSON.parse(localStorage.getItem('defaultIU'))).id), soType: "STD",soNumber:this.soSearchValue }
        this.listProgressRMA = true;
        this.salesOrderService.getSOSearch(soSearch)
            .subscribe(data => {
                if (data.status === 200) {
                    this.listProgressRMA = false;
                    this.inlineSOSearchLoader = 'hide';
                    this.showSOLov = 'show';
                    if (!data.message) {
                        // this.soForRMA = data.result[0].soId;
                        let temp = [];
                        for (const rData of data.result) {
                            if((rData.soStatus === 'SHIPPED' && rData.rmaEdit ==='Y') && (rData.rmaStatusCode === null || rData.rmaStatusCode === 'INRECVNG' || rData.rmaStatusCode === 'RECEIVED')){
                                temp.push({
                                    value: rData.soId,
                                    label: rData.soNumber
                                });
                            }
                        }
                        if(temp.length === 0){
                            temp.push({
                                value: '',
                                label: 'Shipped SO unavailable.'
                            })
                        }else{
                            temp.unshift({ value   : '', label : ' Please Select' });
                        }
                       this.soForRMAList = temp;
                       temp.length === 1 ?  this.soForRMA = temp[0].value : this.soForRMA = temp[1].value;                       
                       
                    }else{
                        this.listProgressRMA = false;
                        this.openSnackBar(
                            data.message,
                            '',
                            'error-snackbar'
                        );
                    }
                    
                } else {
                    this.listProgressRMA = false;
                    this.openSnackBar(
                        data.message,
                        '',
                        'error-snackbar'
                    );
                }
            });

    }
    fetchNewSearchListForSO(event: any, searchFlag: any) {
        let charCode = event.which ? event.which : event.keyCode;
         if (charCode === 9) {
           event.preventDefault();
           charCode = 13;
         }
         if (!searchFlag && charCode !== 13) {
           return;
         }
         if (this.showSOLov === 'hide') {
           this.inlineSOSearchLoader = 'show';
          this.getLovForSo();
         } else {
           this.showSOLov = 'hide';
           this.soSearchValue = '';
           //this.so = null;
         }
       }
    // go for add, edit and view
    goFor(type: string, element?: any) {
        if (type === 'view') {
            const dialogData = [];
            dialogData.push(element);
          const dialogRef = this.dialog.open(rmaViewDialogComponent, {
              width: '80vw',
              data: dialogData,
              autoFocus: false
          });

          dialogRef.afterClosed().subscribe(response => {
              if (response !== undefined) {
                  this.goFor('add', response);
              }
          });
        } else if (type === 'add') {
            if (element) {
                let idForDetail = '';
                if(element.soStatus === 'SHIPPED' && (element.rmaStatusCode === null || element.rmaStatusCode === 'INRECVNG' || element.rmaStatusCode === 'RECEIVED')){
                    idForDetail = element.soId;
                }
                if(element.rmaStatusCode === 'CREATED'){
                    idForDetail = element.rmaId;
                }
                this.router.navigate(['rma/addrma/' + idForDetail]);
            } else {
                //this.getLovForSo();
                const dialogRef = this.dialog.open(this.confirmationDialog, {
                    width: '600px',
                    disableClose: true,
                });

                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed', result);
                    // this.animal = result;
                });
            }

        }
    }

    goForRMA() {
        const soId = this.soForRMA;
        if(soId){
            this.router.navigate(['rma/addrma/' + soId]);
            this.dialog.closeAll();
        }
    }
    closeDialog() {
        this.soForRMA = '';
        this.dialog.closeAll();
    }

    // Reserved Sales Order
    reservedSo(action, id, index) {
        const body = { actionName: action, soId: id, soLineId: null, userId: Number(JSON.parse(localStorage.getItem('userDetails')).userId) }
        this.salesOrderService.reservedSO(body).subscribe(data => {
            if (data.status === 200) {
                if (data.result[0].statusName === 'Reserved') {
                    this.openSnackBar(data.message, '', 'success-snackbar');
                } else {
                    this.openSnackBar(data.message, '', 'default-snackbar');
                }
                if (data.result.length) {
                    this.parameterData[index].statusName = data.result[0].statusName;
                }
            } else {
                this.openSnackBar(data.message, '', 'error-snackbar');
            }
        },
            error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            })
    }

    // open dialog
    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage,
                autoFocus: false
            }
        });
    }

    @HostListener('window:resize', [])
    onResize(): void {
        this.commonService.getScreenSize(-84);
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    }
 
    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        //   this.parameterDataSource.connect().subscribe(d => {
        //       this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        //   });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10)
        }, 100);
    }
    

}

@Component({
    selector: 'app-rma-view-dialog',
    templateUrl: './rma-view-dialog.html',
    styleUrls: ['./rma-list.component.css']
    })
    export class rmaViewDialogComponent {
    soViewdColumns: string[] = [
        'soLineNumber',
        'rmaSoLineNum',
        'soItemId',
        'soItemRevisionId',
        'soQtyUomCode',
        'rmaSoLineQty',
        'soRemainingQty',
        'soLineQuantity',
        'soReservedQuantity',
        // 'soLineReceiptQty',        
        'soRmaRoutingType',
        'soLineStatus',
        'returnableDate'
    ];
    resultData = [];
    addRMA: boolean = false;
    editRMA: boolean = false;
    parameterDataSource = new MatTableDataSource<any>(this.resultData);
    dataProgress = false;
    soHostId= null;    
    rmaDate= '';
    constructor(
        private salesOrderService: SalesOrderService,
        public dialogRef: MatDialogRef<rmaViewDialogComponent>,
        private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // rmaId
      this.getSoDetailsById(data[0].rmaId);
      if(data[0].rmaStatusCode === 'CREATED'){
        this.editRMA = true;
    }
    if((data[0].soStatus === 'SHIPPED' && data[0].rmaEdit ==='Y') && (data[0].rmaStatusCode === 'INRECVNG' || data[0].rmaStatusCode === 'RECEIVED')){
        this.addRMA = true;
    }
    }
    
    onCloseClick(): void {
        this.dialogRef.close();
    }
    
    getSoDetailsById(id) {
      this.dataProgress = true;
      this.salesOrderService.getSoById(id).subscribe((data: any) => {
          if (data.status === 200) {
            console.log(data.result[0] )
            this.soHostId = data.result[0].soHostId;
            this.rmaDate = data.result[0].soDate;
            // if(data.result[0].rmaNumber === null && data.result[0].rmaStatus === null){
            //     this.addRMA = true;
            // }
            // if(data.result[0].soStatus === 'CREATED'){
            //     this.editRMA = true;
            // }
            // if(data.result[0].soStatus === 'INRECVNG' || data.result[0].soStatus === 'RECEIVED'){
            //     this.addRMA = true;
            // }
                
            //   console.log(data.result[0].soLineDetails[0]);
              if (data.result[0].soLineDetails.length) {
                  for (const soLineData of data.result[0].soLineDetails) {
                    if (soLineData.crossDockEnabled === 'Y') {
                        soLineData.crossDockEnabled = true;
                    }
                    if (soLineData.crossDockEnabled === 'N') {
                      soLineData.crossDockEnabled = false;
                    }
                    
                      this.resultData.push(soLineData);
                      this.parameterDataSource = new MatTableDataSource<any>(
                          this.resultData
                      );
                  }
    
                // this.parameterDataSource = new MatTableDataSource<any>(data.result[0]);
                this.dataProgress = false;
              }
          }
      });
    }
     
    
 }
  
