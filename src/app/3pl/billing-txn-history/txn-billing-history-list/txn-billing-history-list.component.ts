import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, 
  HostListener, AfterViewInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, Sort, MatTable, MatTableDataSource, 
  MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';
import { ContractsService } from '../../../_services/3pl/contracts.service';


export interface ParameterDataElement {
  sno? : any;
  contractNumber: any;
  customerName: any;
  txnDate:any;
  activityGroupName : any;
  activityGroupCode : any;
  activityName : any;
  activityCode : any;
  itemName : any;
  lgName : any;
  locationName : any;
  userName : any;
  uomName : any;
  rate : any; 
  count : any; 
  startDate : any; 
  endDate : any; 
  chargeCode : any; 
  action?: string;
  subactivity?: any;
  transactionType?: any;
  inspectionQuality?: any;
  txnDestinationType?: any
}

@Component({
  selector: 'app-txn-billing-history-list',
  templateUrl: './txn-billing-history-list.component.html',
  styleUrls: ['./txn-billing-history-list.component.css']
})
export class TxnBillingHistoryListComponent implements OnInit {

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    private searchInfoArrayunsubscribe: any;
    showSearch = true;
    
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
  
    tooltipPosition: TooltipPosition[] = ['below'];
  
    listProgress = false;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );

    parameterDisplayedColumns: string[] = [
      'sno',
      'contractNumber',
      'customerName',
      'txnDate',
      'activityGroupName',
      'activityGroupCode',
      'activityName',
      'activityCode',
      'itemName',
      'lgName',
      'locationName',
      'userName', 
      'uomName', 
      'rate', 
      'count',
      'startDate',
      'endDate', 
      'chargeCode', 
      'action'
    ];
  
    columns: any = [
        { field: 'sno', name: '#', width: 75, baseWidth: 3 },
        { field: 'contractNumber', name: 'Contract Number', width: 75, baseWidth: 6 },
        { field: 'customerName', name: 'Customer Name', width: 75, baseWidth: 6 },
        { field: 'txnDate', name: 'Transaction Date', width: 75, baseWidth: 8 },
        { field: 'activityGroupName', name: 'Group Name', width: 75, baseWidth: 6 },
        { field: 'activityGroupCode', name: 'Group Code', width: 75, baseWidth: 6 },
        { field: 'activityName', name: 'Activity Name', width: 75, baseWidth: 6 },
        { field: 'activityCode', name: 'Activity Code', width: 75, baseWidth:6 },
        { field: 'itemName', name: 'Item Name', width: 75, baseWidth: 5 },
        { field: 'lgName', name: 'Locator Group', width: 75, baseWidth: 6 },
        { field: 'locationName', name: 'Stock Locator', width: 75, baseWidth: 6 },
        { field: 'userName', name: 'User', width: 75, baseWidth: 5 },
        { field: 'uomName', name: 'UOM', width: 75, baseWidth: 5 },
        { field: 'rate', name: 'Rate', width: 75, baseWidth: 5 },
        { field: 'count', name: 'Count', width: 75, baseWidth: 5 },
        { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 5 },
        { field: 'endDate', name: 'End Date', width: 75, baseWidth: 5 },
        { field: 'chargeCode', name: 'Charge Code', width: 75, baseWidth: 5 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 6 }
    ];
  
    activityTableMessage = '';
  
  
    constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      public commonService: CommonService,
      private http: HttpClient,
      private contractService: ContractsService,
      public dialog: MatDialog){
      this.searchEnable = true;
      this.getScreenSize();
      
    }
  
    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/billing-txn-history.json');
    screenMaxHeight:any;
  
    ngOnInit() {
  
      this.searchJson.subscribe((data: any) => {
        this.dataForSearch = data;
          this.searchActivityMaster();
          this.searchForActivityMaster();
      });
  
    }
  
  
     // show / hide search section
    getSearchToggle(searchToggle: boolean) { 
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }
  
    searchForActivityMaster() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
  
    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
  
    searchActivityMaster() {
      this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
        (searchInfo: any) => {
   
            // This code is used for not loading the search result when module loads 
            if(searchInfo.fromSearchBtnClick === true){
              // if(searchInfo.searchArray.transactionTypeId === '' || searchInfo.searchArray.transactionTypeId === undefined ){
              //   this.openSnackBar('Please select the Transaction Type', '','default-snackbar');
              //   return;
              // }
              this.customTable.nativeElement.scrollLeft = 0;
              this.parameterData = [];
              this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
              this.parameterDataSource.paginator = this.paginator;
              if (searchInfo.searchType === 'BillingTxnHistory') {

                  // if(searchInfo.searchArray.contractId === undefined || searchInfo.searchArray.contractId === '' ){
                  //   this.openSnackBar(' Please select the contract number', '', 'default-snackbar');
                  //   return;
                  // }
                  this.listProgress = true;
                  this.contractService
                      .searchBillingTxnHistory(searchInfo.searchArray)
                      .subscribe(data => {
                          if (data.status === 200) {
                              if (!data.message) {
                                  this.parameterData = [];
                                  this.listProgress = false;
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
                                  this.activityTableMessage = data.message;
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
  
    goFor(type:string, data?:any){
      if(type==='view'){
         
           
          const dialogRef = this.dialog.open(ItemTxnViewDialogComponent, {
              width: '80vw',
              data: data,
              autoFocus: false
          });
  
          dialogRef.afterClosed().subscribe(response => {
           
          });
      }
    }
  
    openSnackBar(message: string, action: string, typeClass: string) {
      this.snackBar.open(message, action, {
          duration: 3500,
          panelClass: [typeClass]
      });
    }
  
    ngOnDestroy() {
      this.searchInfoArrayunsubscribe
          ? this.searchInfoArrayunsubscribe.unsubscribe()
          : '';
      this.commonService.getsearhForMasters([]);
    }
  
    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
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
        this.screenMaxHeight = (screenHeight - 248) + 'px';
      //   this.scrWidth = window.innerWidth; 
  }
  
  }
  
  
  @Component({
    selector: 'app-item-txn-dialog',
    templateUrl: './item-txn-detail.html',
    styleUrls: ['./txn-billing-history-list.component.css']
  })
  export class ItemTxnViewDialogComponent {
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    dataProgress = false;
    resultData = [];
    activityHeaderId = null;
    message = '';
  
    parameterDisplayedColumns: string[] = [
      'sno',
      'txnType',
      'sourceTypeName',
      'receiptNumber',
      'lpn',
      'txnDate',
      'revNumber',
      // 'rate',
      // 'txnAmount',
      // 'lgName',
      // 'locationName',
      'txnQuantity',
      'txnDestinationType',
      'uom',
      // 'uomName',
      'primaryQty',
      'primaryUom',
      'secondaryQty',
      'secondaryUom',
      'toIuName',
      'toLgName',
      'toLocatorName',
      'fromIuName',
      'fromLgName',
      'fromLocatorName',
      'inspectionName',
      'inspectionQty',
      'inspectionQuality',
      'userName'
    ];
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
    constructor(
        public dialogRef: MatDialogRef<ItemTxnViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private activityService: ActivityMasterService,
        public commonService: CommonService,
        public contractService: ContractsService,
        private dialog: MatDialog
    ) {
        
      this.getContractItemDetail(data.contractActivityItemId);
      // this.getContractItemDetail(181);
  
      this.activityHeaderId = data.contractActivityItemId;
    }
  
    onCloseClick(): void {
        // this.dialogRef.close({activityHeaderId : this.activityHeaderId});
    }
  
    onCloseDialog(): void {
      this.dialog.closeAll();  
    }
  
    getContractItemDetail(id) {
      this.dataProgress = true;
      this.contractService.getContractItemDetail(id).subscribe((data: any) => {
          if (data.status === 200 ) {
            if ( !data.message && data.result.length) {
                
                  for (const activityData of data.result) {
                    this.resultData.push(activityData);
                    this.parameterDataSource = new MatTableDataSource<any>(
                        this.resultData
                    ); 
                    this.parameterDataSource.paginator = this.paginator;
                  }
                  this.dataProgress = false;
              }else{
                this.message = 'No Transaction Defined';
              }
          }
      });
    }
  }
  