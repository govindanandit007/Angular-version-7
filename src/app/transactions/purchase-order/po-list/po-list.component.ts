import {Component, OnInit, ViewChild, Renderer, Output, EventEmitter, TemplateRef,
    OnDestroy, Optional, Inject, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSort , Sort} from '@angular/material';

export interface ParameterDataElement {
    roleId: number;
    roleName: string;
    roleEnableFlag: boolean;
    roleDefaultFlag: boolean;
    action: string;
}

@Component({
    selector: 'app-po-list',
    templateUrl: './po-list.component.html',
    styleUrls: ['./po-list.component.css']
})
export class PoListComponent implements OnInit, AfterViewInit, OnDestroy {
    searchEnable: boolean;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    private searchInfoArrayunsubscribe: any;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    poTableMessage = '';
    parameterDisplayedColumns: string[] = [
        'poId',
        'poNumber',
        'poType',
        'poStatus',
        'ouCode',
        'supplierName',
        'supplierSiteName',
        'poCurrencyCodeValue',
        'poAmount',
        'action'
    ];

    columns: any =  [
        {field: 'poId', name: '#', width: 75, baseWidth: 6 },
        {field: 'poNumber', name: 'PO #', width: 75, baseWidth: 8 },
        {field: 'poType', name: 'Type', width: 75, baseWidth: 10.5 },
        {field: 'poStatus', name: 'Status', width: 75, baseWidth: 10.5 },
        {field: 'ouCode', name: 'OU', width: 75, baseWidth: 10.5 },
        {field: 'supplierName', name: 'Supplier', width: 75, baseWidth: 11.5 },
        {field: 'supplierSiteName', name: 'Supplier Site', width: 75, baseWidth: 12 },
        {field: 'poCurrencyCodeValue', name: 'Currency', width: 75, baseWidth: 10.5 },
        {field: 'poAmount', name: 'Amount', width: 75, baseWidth: 10.5},
        {field: 'action', name: 'Action', width: 75, baseWidth: 10 }
    ]

    showSearch = true;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );

    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private purchaseOrderService: PurchaseOrderService,
        private http: HttpClient
    ) {
        this.searchEnable = true;
        this.commonService.getScreenSize(-84);                
    }
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/po-search.json');    
    
    ngOnInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchPurchaseOrder();
            this.searchForPurchaseOrder();
        });
    }

    searchPurchaseOrder() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {

                // This code is used for not loading the search result when module loads 
                if(searchInfo.fromSearchBtnClick === true){
              
                    this.customTable.nativeElement.scrollLeft = 0;
                    this.parameterData = [];
                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
                if (searchInfo.searchType === 'po') {
                    this.listProgress = true;
                    this.purchaseOrderService
                        .getPOSearch(searchInfo.searchArray)
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
                                } else {
                                    this.listProgress = false;
                                    this.dataResult = false;
                                    this.poTableMessage = data.message;
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
                }else{
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
    searchForPurchaseOrder() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    // go for add, edit and view
    goFor(type:string, element?:any){
      if(type==='view'){
        const dialogData = [];
            dialogData.push(element);
            const dialogRef = this.dialog.open(PoViewDialogComponent, {
                width: '85vw',               
                data: dialogData,
                autoFocus: false
            });

            dialogRef.afterClosed().subscribe(response => {
                this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize'));
                this.parameterDataSource.paginator = this.paginator;
                if (response !== undefined) {
                    this.goFor('edit', response);

                }
            });
      } else if(type === 'add'){
        this.router.navigate(['purchaseorder/addpo']);
      } else{
        this.router.navigate(['purchaseorder/editpo/' + element]);
      }
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
    onResize() : void{
        this.commonService.getScreenSize(-84);
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    } 

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        setTimeout(() => { 
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
}

export interface ParameterDataElementCrossDock {
    crossDockId? : any,
    soId          : string;
    soLineId      : any;
    poIuId?       : any;
    soLineQty     : any;
    remainingQty  : any;
    sourceType    : string;
    soNumber      : any;
    soLineNumber  : any;    
    addNewRecord? : boolean;
    soList?       : any[] , 
    soLineList?   : any[] ,
    originalData? : any,
    processFlag? : any
  }
@Component({
  selector: 'app-po-view-dialog',
  templateUrl: './po-view-dialog.html',
  styleUrls: ['./po-list.component.css']
})
export class PoViewDialogComponent {
  poViewdColumns: string[] = [
      'poLineNumber',
      'poIuId',
      'poItemId',
      'poItemRevision',
      'poUomCode',
      'poQuantity',
      'poPrice',
      'poCurrencyCodeValue',
      'poPlannedReceiptDate',
      'poLineReceiptQty',
      'poReceiptRouting',
      'poLineAmount',
      'action'
  ];
  
  resultData = [];
  parameterDataSource = new MatTableDataSource<any>(this.resultData);

  parameterDisplayedColumnsCrossDock: string[] = [
    'No',
    'soNumber',
    'soLineNumber',
    'soLineQty',
    'remainingQty',
     
  ];
  crossDockDialogColumns: any =  [
    {field: 'No', name: '#', width: 20, baseWidth: 7 },
    {field: 'soNumber', name: 'SO Number', width: 50, baseWidth: 20 },
    {field: 'soLineNumber', name: 'Line Number + Item Name', width: 50, baseWidth: 35 },
    {field: 'soLineQty', name: 'SO Line Qty', width: 50, baseWidth: 17 },
    {field: 'remainingQty', name: 'Remaining Qty', width: 50, baseWidth: 21 },
    
  ]
  
  @ViewChild('crossDockTable', {read: ElementRef, static: false} ) matCrossDockTableRef: ElementRef;
  @ViewChild('poViewTable', {read: ElementRef, static: false} ) matViewTableRef: ElementRef;
  @ViewChild('paginatorCrossDock', { static: false }) paginatorCrossDock: MatPaginator;
  @ViewChild('paginatorView', { static: false }) paginatorView: MatPaginator;
  
  listProgressPopupCrossDock: any = false;
  crossDockTableMessage: any = 'No Data Found';
  parameterDataCrossDock: ParameterDataElementCrossDock[] = [];
  crossDockArray: any[] = [];
  parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);

  tooltipPosition: TooltipPosition[] = ['below'];
    pageSize: number = 10;
  constructor(
      private purchaseOrderService: PurchaseOrderService,
      public dialogRef: MatDialogRef<PoViewDialogComponent>,
      public commonService: CommonService,
      public dialog: MatDialog,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getPoDetailsById(data[0].poId);
  }

  onCloseClick(): void {
      this.dialogRef.close();
  }

  getPoDetailsById(id) {
    this.purchaseOrderService.getPoById(id).subscribe((data: any) => {
        if (data.status === 200) {
            console.log(data.result[0].poLines[0]);
            if (data.result[0].poLines.length) {
                for (const [index, poLineData] of data.result[0].poLines.entries()) {
                    this.resultData.push(poLineData);
                    this.parameterDataSource = new MatTableDataSource<any>(
                        this.resultData
                    );
                    this.getUOMList(poLineData.poItemId, index, poLineData.poUomCode);
                }
            }
             setTimeout(() => {
               this.paginatorView.pageSizeOptions = this.commonService.paginationArray;
               this.paginatorView.pageSize = Number(window.localStorage.getItem('paginationSize') ? 
               window.localStorage.getItem('paginationSize') : 10 );
               this.parameterDataSource.paginator = this.paginatorView;                
            }, 100);
        }
    });
  }
 // Cross Dock popup code 
 openCrossDockPopup(event: any, index: any, element: any, templateRef: TemplateRef<any>){
    this.parameterDataCrossDock = [];

        this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
        setTimeout(() => {
           this.paginatorCrossDock.pageSizeOptions = this.commonService.paginationArray;
           this.paginatorCrossDock.pageSize = Number(window.localStorage.getItem('paginationSize') ? 
           window.localStorage.getItem('paginationSize') : 10 );
           this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
           this.commonService.setTableResize(this.matCrossDockTableRef.nativeElement.clientWidth, this.crossDockDialogColumns);
        }, 100);
        const dialogRef: any = this.dialog.open(templateRef, {
          autoFocus: false,
          width: '65vw',
          disableClose: true
        });
        this.listProgressPopupCrossDock = true;
        this.getCrossDockDetails(element.poLineId,index);
 }
 closeDialog(){
    this.listProgressPopupCrossDock = false;
    let dialogref = null;      
    dialogref = this.dialog.openDialogs.pop();
    dialogref.close();
 }
  // Get UOM List
  getUOMList(itemId, index, poUomCode) {
    this.resultData[index].UOMList = [];
    this.purchaseOrderService
      .getUomByItem(itemId)
      .subscribe((data: any) => {
        this.resultData[index].UOMList.push({
          value: data.result[0].primaryUomCode,
          label: data.result[0].psUnitOfMeasure
        });
          this.resultData[index].poUomCode = poUomCode;
        if(data.result[0].secondaryUomCode !== null){
          this.resultData[index].UOMList.push({
            value: data.result[0].secondaryUomCode,
            label: data.result[0].suUnitOfMeasure
          });
        }
        
      });
  }
  getCrossDockDetails(polineid , index){        
    let obj: any = {};
    let tempArray: any = []; 
    this.setPaginationSize(null);
    this.purchaseOrderService.getCrossDockDetails(polineid)
    .subscribe((data: any) => {
        this.listProgressPopupCrossDock = false;
      if(data.result && data.result.length){
         for (const crossDockObj of data.result) {  
          obj = {
            crossDockId: crossDockObj.crossDockId,
            soId : crossDockObj.xsoId,
            soNumber : crossDockObj.soNumber,
            soLineId : crossDockObj.xsoLineId,
            soLineNumber: crossDockObj.soLineNumber,
            soLineQty: crossDockObj.soLineQty,
            remainingQty: crossDockObj.remainingQty,
            sourceType: 'PO',                   
        } 
        tempArray.push(obj)
        }
        this.parameterDataCrossDock = tempArray;
        this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
        setTimeout(() => {
           this.paginatorCrossDock.pageSizeOptions = this.commonService.paginationArray;
           this.paginatorCrossDock.pageSize = Number(window.localStorage.getItem('paginationSize') ? 
           window.localStorage.getItem('paginationSize') : 10 );
           this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
           this.commonService.setTableResize(this.matCrossDockTableRef.nativeElement.clientWidth, this.crossDockDialogColumns);
        }, 100);
       }
    });
  
}
setPaginationSize(event?: any){
    let  pageSize='10';
    if(event){
       pageSize = event && event.pageSize ? String(event.pageSize) : '10'
    }else{
       pageSize = window.localStorage.getItem('paginationSize');
    }   
    this.pageSize = Number(pageSize); 
   window.localStorage.setItem('paginationSize', pageSize );        
}
}
