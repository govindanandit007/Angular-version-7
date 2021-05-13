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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { Action } from 'rxjs/internal/scheduler/Action';
import { SalesOrderService } from 'src/app/_services/outbound/sales-order.service';

export interface ParameterDataElement {
    soId            : string;
    soNumber        : string;
    soType          : string;
    soDate          : string;
    soStatus        : string;
    statusName      ?: string;
    ouCode          : string;
    tpName          : string;
    tpSiteName      : string;
    soPriority      : string;
    action          : string;
}

@Component({
  selector: 'app-solist',
  templateUrl: './solist.component.html',
  styleUrls: ['./solist.component.css']
})
export class SolistComponent implements OnInit, AfterViewInit, OnDestroy {
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
  soTableMessage = '';
  parameterDisplayedColumns: string[] = [
    'soId',          
    'soNumber',       
    'soType',          
    'soDate',          
    'soStatus',        
    'soOU',            
    'customerName',      
    'customerSiteName',  
    'soPriority',      
    'action'          
  ];

  columns: any =  [
      {field: 'soId', name: '#', width: 75, baseWidth: 5 },
      {field: 'soNumber', name: 'SO #', width: 75, baseWidth: 8 },
      {field: 'soType', name: 'Type', width: 75, baseWidth: 10 },
      {field: 'soDate', name: 'Date', width: 75, baseWidth: 10 },
      {field: 'soStatus', name: 'Status', width: 75, baseWidth: 15 },
      {field: 'soOU', name: 'OU', width: 75, baseWidth: 7 },
      {field: 'customerName', name: 'Customer', width: 75, baseWidth: 13 },
      {field: 'customerSiteName', name: 'Customer Site', width: 75, baseWidth: 16 },
      {field: 'soPriority', name: 'Priority', width: 75, baseWidth: 8 },
      {field: 'action', name: 'Action', width: 75, baseWidth: 8 },
  ]

  showSearch = true;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );

  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
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
  searchJson: any = this.http.get('./assets/search-jsons/so-search.json');

  ngOnInit() {
      this.parameterDataSource.paginator = this.paginator;
      this.searchJson.subscribe((data: any) => {
          this.dataForSearch = data;
          this.searchSalesOrder();
          this.searchForSalesOrder();
      });
  }

  searchSalesOrder() {
      this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
          (searchInfo: any) => {
              // This code is used for not loading the search result when module loads 
              if(searchInfo.fromSearchBtnClick === true){
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
  // go for add, edit and view
  goFor(type:string, element?:any){
    if(type==='view'){
      const dialogData = [];
          dialogData.push(element);
          const dialogRef = this.dialog.open(SoViewDialogComponent, {
              width: '80vw',
              data: dialogData,
              autoFocus: false
          });
          dialogRef.afterClosed().subscribe(response => {
            //    
              if (response.soStatus === "SHIPPED") {
                this.router.navigate(['rma/addrma/' + response.soId+'#SO']);
              }else{
                this.goFor('edit', response);
              }
          });
    } else if(type === 'add'){
      this.router.navigate(['salesorders/addso']);
    } else{
      this.router.navigate(['salesorders/editso/' + element.soId]);
    }
  }

  // Reserved Sales Order
  reservedSo(action, id, index){
    const body = { actionName: action, soId: id, soLineId: null, userId: Number(JSON.parse(localStorage.getItem('userDetails')).userId) }
    this.salesOrderService.reservedSO(body).subscribe(data => {
        if(data.status === 200){
            if(data.result[0].statusName === 'Reserved'){
                this.openSnackBar(data.message,'','success-snackbar');
            } else{
                this.openSnackBar(data.message,'','error-snackbar');
            }
            if(data.result.length){
                this.parameterData[index].statusName = data.result[0].statusName;
            }
            this.searchSalesOrder();
        } else {
            this.openSnackBar(data.message,'','error-snackbar');
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
  onResize() : void{
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
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
  }
}

@Component({
selector: 'app-so-view-dialog',
templateUrl: './so-view-dialog.html',
styleUrls: ['./solist.component.css']
})
export class SoViewDialogComponent {
soViewdColumns: string[] = [
    'soLineId',
    'soIuId',
    'soLineNumber',
    'soItemId',
    'soItemRevisionId',
    'soUomCode',
    'soLineQuantity',
    'crossDockEnabled',
    'soShippedQuantity',
    'soReservedQuantity',
    'soAllocatedQuantity',
    'soLineStatus',
    'soLinePriority',
    'soShipmentPlannedDate',
    'soShipmentActualDate',
    'soNetWeight',
    'soGrossWeight',
    'soWeightUomCode',
    'soVolume',
    'soVolumeUomCode'
];
resultData = [];
parameterDataSource = new MatTableDataSource<any>(this.resultData);
dataProgress = false;
isServerError = false;
constructor(
    private salesOrderService: SalesOrderService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SoViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.getSoDetailsById(data[0].soId);
}
onCloseClick(): void {
    this.dialogRef.close();
}
openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
  }
getSoDetailsById(id) {
  this.dataProgress = true;
  this.salesOrderService.getSoById(id).subscribe((data: any) => {
      if (data.status === 200) {
           
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
      }else{
        this.openSnackBar(data.message, '', 'error-snackbar');
        this.dataProgress = false;
        this.isServerError = true;
      }
  },(error: any) => {
    this.dataProgress = false;
    this.isServerError = true;
    this.openSnackBar(error.error.message, '', 'error-snackbar');
     
  });
}
}
