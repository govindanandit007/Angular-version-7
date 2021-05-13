import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, 
  HostListener, AfterViewInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, Sort, MatTable, MatTableDataSource, 
  MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';
import { ContractsService } from '../../../_services/3pl/contracts.service';
import { MatAccordion } from '@angular/material/expansion';
import { TableUtil } from '../../../_shared/tableUtil';
export interface ParameterDataElement {
  sno? : any;
  contractNumber: any;
  customerName: any;
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
  action?: string;
}

export interface TxnDetailParameterDataElement {
  txnNo: string;
  batchCount: number;
  originalTxnId: number;
  serialCount: number;
  txnDate: string;
  txnDestinationTypeCode: string;
  txnFromIuId: number;
  txnFromLgId: number;
  txnFromLocatorId: number;
  txnHostId: number;
  txnId: number;
  txnInspectionQualityCode: string;
  txnInspectionStatusCode: string;
  txnItemId: number;
  txnItemRevisionId: number;
  txnLpnId: number;
  txnQuantity: number;
  txnReceiptId: number;
  txnReceiptLineId: number;
  txnSourceId: number;
  txnSourceType: string;
  txnToIuId: number;
  txnToLgId: number;
  txnToLocatorId: number;
  txnTransferLpnId: number;
  txnType: string;
  txnUomCode: string;
  itemName: string;
  receiptNum: any;
  receiptLineNum: any;
  revsnNumber: any;
  sourceLineNumber: any;
  sourceNumber: any;
  transferLpnNumber: any;
  txnLpnNumber: any;
  txnToIuCode: string;
  txnToLgCode: string;
  txnToLocatorCode: string;
  txnFromIuCode: string;
  txnFromLgCode: string;
}

@Component({
  selector: 'app-billing-execution-list',
  templateUrl: './billing-execution-list.component.html',
  styleUrls: ['./billing-execution-list.component.css']
})
export class BillingExecutionListComponent implements OnInit {

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
    'requestNumber',
    'programName',
    'startDate',
    'endDate',
    'status',
    'parameter',
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 3 },
      { field: 'requestNumber', name: 'Request #', width: 75, baseWidth: 15 },
      { field: 'programName', name: 'Program Name', width: 75, baseWidth: 20 },
      { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 15 },
      { field: 'endDate', name: 'End Date', width: 75, baseWidth: 15 },
      { field: 'status', name: 'Status', width: 75, baseWidth: 10 },
      { field: 'parameter', name: 'Parameter', width: 75, baseWidth: 15 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];
  
  activityTableMessage = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private http: HttpClient,
    private contractService: ContractsService,
    public dialog: MatDialog
  ) {this.searchEnable = true;}

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/billing-execution-history.json');
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
          if (searchInfo.searchType === 'actBilEngExecHis') {
              this.listProgress = true;
              this.contractService
                  .searchBillingExecutionHistory(searchInfo.searchArray)
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

// go for add, edit and view
goFor(type:string, data?:any){
  if(type==='view'){
      const dialogData = [];
      dialogData.push(data);
      const dialogRef = this.dialog.open(billingExecutionViewDialogComponent, {
          width: '90vw',
          data: dialogData[0],
          autoFocus: false
      });

      dialogRef.afterClosed().subscribe(response => {
          if (response !== undefined) {
              this.goFor('edit', response);
          }
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

}


@Component({
  selector: 'app-item-txn-dialog',
  templateUrl: './billing-execution-detail.html',
  styleUrls: ['./billing-execution-list.component.css']
})
export class billingExecutionViewDialogComponent   {
  parameterData: TxnDetailParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<TxnDetailParameterDataElement>(
      this.parameterData
  );
  dataProgress = false;
  resultData = [];
  contactCode = null;
  message = '';
  txnDetailsHeader = [];  
  tooltipPosition: TooltipPosition[] = ['below'];
  contractList = [{ label: ' Please Select', value: '' }];
  contactId = '';
  requestNumber = '';
  txnDetailBulkData: TxnDetailParameterDataElement[] = [];
  txnDetailBulkDataSource = new MatTableDataSource<TxnDetailParameterDataElement>(
      this.txnDetailBulkData
  );
  parameterDisplayedColumns: string[] = [
    'txnNo',
    'contractCode',
    'description',
    'billingFrequencyName',
    'lastComputationDate',
    'statusName',
    'txnType',
    'txnDate',
    'txnItemId',
    'UOM',
    'txnSourceId',
    'sourceLineNumber',
    'txnSourceType',
    'txnDestinationTypeCode',
    'txnReceiptId',
    'txnReceiptLineId',
    'lineAmount',
    'txnQuantity',
    'rate',
    'userName',
    'txnItemRevisionId',
    'txnTransferLpnId',
    'txnLpnId',
    'txnFromIuId',
    'txnToIuId',
    'txnFromLocatorId',
    'txnToLocatorId',
    'txnFromLgId',
    'txnToLgId',
    'txnInspectionQualityCode',
    'txnInspectionStatusCode',
    'customerName'
  ];

  columns: any = [
    { field: 'txnNo', name: '#', width: 75, baseWidth: 1 },
    { field: 'txnType', name: 'Txn Type', width: 75, baseWidth: 10 },
    { field: 'txnDate', name: 'Txn Date', width: 75, baseWidth: 4 },
    { field: 'txnQuantity', name: 'Qty', width: 75, baseWidth: 2 },
    { field: 'txnItemId', name: 'Item', width: 75, baseWidth: 3 },
    { field: 'txnSourceId', name: 'Source', width: 75, baseWidth: 3.5 },
    { field: 'sourceLineNumber', name: 'Source Line', width: 75, baseWidth: 4.5 },
    { field: 'txnSourceType', name: 'Source Type', width: 75, baseWidth: 4.5 },
    { field: 'txnDestinationTypeCode', name: 'Destination Type', width: 75, baseWidth: 8 },
    { field: 'txnReceiptId', name: 'Receipt', width: 75, baseWidth: 3.5 },
    { field: 'txnReceiptLineId', name: 'Receipt Line', width: 75, baseWidth: 4.5 },
    { field: 'UOM', name: 'UOM', width: 75, baseWidth: 3 },
    { field: 'txnItemRevisionId', name: 'Item Rev', width: 75, baseWidth: 4.5 },
    { field: 'txnTransferLpnId', name: 'Transfer LPN', width: 75, baseWidth: 5 },
    { field: 'txnLpnId', name: 'LPN', width: 75, baseWidth: 4.5 },
    { field: 'txnFromIuId', name: 'From IU', width: 75, baseWidth: 3.5 },
    { field: 'txnToIuId', name: 'To IU', width: 75, baseWidth: 3.5 },
    { field: 'txnFromLgId', name: 'From LG', width: 75, baseWidth: 3.5 },
    { field: 'txnToLgId', name: 'To LG', width: 75, baseWidth: 3 },
    { field: 'txnFromLocatorId', name: 'From Locator', width: 75, baseWidth: 7 },
    { field: 'txnToLocatorId', name: 'To Locator', width: 75, baseWidth: 4 },
    { field: 'rate', name: 'Rate', width: 75, baseWidth: 2 },
    { field: 'locationName', name: 'Locator', width: 75, baseWidth: 4 },
    { field: 'userName', name: 'User Name', width: 75, baseWidth: 4 },
    { field: 'customerName', name: 'Customer', width: 75, baseWidth: 6 },
    { field: 'lineAmount', name: 'Billing Amt.', width: 75, baseWidth: 6 },
    { field: 'txnInspectionQualityCode', name: 'Inspection Qty', width: 100, baseWidth: 10 },
    { field: 'txnInspectionStatusCode', name: 'Inspection Status', width: 75, baseWidth: 10 },
    { field: 'contractCode', name: 'Contract Number', width: 75, baseWidth: 10 },
    { field: 'description', name: 'Description', width: 75, baseWidth: 10 },
    { field: 'billingFrequencyName', name: 'Billing Frequency', width: 75, baseWidth: 10 },
    { field: 'lastComputationDate', name: 'Last Computation Date', width: 75, baseWidth: 10 },
    { field: 'statusName', name: 'Status', width: 75, baseWidth: 10 },
  ];

  
  @ViewChild('matTableTxn', { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild('paginatorTxnLines', { static: false }) paginator: MatPaginator;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  constructor(
      public dialogRef: MatDialogRef<billingExecutionViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private activityService: ActivityMasterService,
      public commonService: CommonService,
      public contractService: ContractsService,
      private dialog: MatDialog
  ) {
    this.requestNumber = data.requestNumber;
    this.contactId = '';
    this.getBillingExeHistoryDetail(this.requestNumber,'');
    
  }
   
  onCloseClick(): void {
      // this.dialogRef.close({activityHeaderId : this.activityHeaderId});
  }

  onCloseDialog(): void {
    this.dialog.closeAll();  
  }

  getBillingExeHistoryDetail(id,type) {
    this.dataProgress = true;
    let contactId = this.contactId ? `&contractId=${this.contactId}` : '';
    this.resultData = [];
    this.txnDetailBulkData = [];
    this.contractService.getBillingExecutionHistoryDetail(id,contactId).subscribe((data: any) => {
        if (data.status === 200 ) {
          if ( !data.message && data.result.length) {
                for (const txnData of data.result) {
                  this.resultData.push(txnData);
                  if(type !== 'SEARCH'){
                    this.contractList.push({
                      label: txnData.contractCode, 
                      value: txnData.contractId
                    });
                  }
                  for(const txnlineData of txnData.txnDetails){
                    this.txnDetailBulkData.push(txnlineData)
                  }
                }
                this.txnDetailBulkDataSource = new MatTableDataSource<TxnDetailParameterDataElement>(this.txnDetailBulkData);
                this.dataProgress = false;
            }else{
              this.message = 'No Transaction Defined';
            }
           
        }
    });
  }

  getDataForTxnLine(element){
    const txnDetailsLine = element.txnDetails;
    this.parameterDataSource = new MatTableDataSource<any>(txnDetailsLine);    
    setTimeout(() => {       
      this.parameterDataSource.paginator = this.paginator;
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
  }

  searchForContracts(type){
    this.getBillingExeHistoryDetail(this.requestNumber,type);
  }

  exportTable(event,contactCode) {
    event.stopPropagation();
    TableUtil.exportTableToExcel(`txnDetailTable${contactCode}`,"Flexi WMS - Txn Details");
  }
  exportBulkTable() {
    TableUtil.exportTableToExcel('txnDetailBulkTable',"Flexi WMS - Bulk Txn Details");
  }

}