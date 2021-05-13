import { Component, OnInit,
  ViewChild,
  Renderer,
  EventEmitter,
  Output,
  OnDestroy,
  TemplateRef,
  ElementRef,
  HostListener,
  AfterViewInit, } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { OutboundLpnService } from 'src/app/_services/outbound/outbound-lpn.service';
import { MatDialog, MatSort } from '@angular/material';

export interface ParameterDataElement {
  txnNo                     : string;
  batchCount                : number;            
  originalTxnId             : number;               
  serialCount               : number;                                                  
  txnDate                   : string;         
  txnDestinationTypeCode    : string;                       
  txnFromIuId               : number;                                             
  txnFromLgId               : number;                                                  
  txnFromLocatorId          : number;                                                       
  txnHostId                 : number;          
  txnId                     : number;       
  txnInspectionQualityCode  : string;                          
  txnInspectionStatusCode   : string;                         
  txnItemId                 : number;           
  txnItemRevisionId         : number;                    
  txnLpnId                  : number;          
  txnQuantity               : number;                                                 
  txnReceiptId              : number;               
  txnReceiptLineId          : number;                                                       
  txnSourceId               : number;              
  txnSourceLineId           : number;                                                   
  txnSourceType             : string;             
  txnToIuId                 : number;                                             
  txnToLgId                 : number;                                              
  txnToLocatorId            : number;               
  txnTransferLpnId          : number;                                                       
  txnType                   : string;         
  txnUomCode                : string; 
  itemName                  : string; 
  receiptNum                : any;
  receiptLineNum            : any;
  revsnNumber               : any;
  sourceLineNumber          : any;
  sourceNumber              : any;
  transferLpnNumber         : any;
  txnLpnNumber              : any;
  txnToIuCode               : string; 
  txnToLgCode               : string; 
  txnToLocatorCode          : string; 
  txnFromIuCode             : string; 
  txnFromLgCode             : string; 
  
  
}

export interface ParameterDataElementSerial {
   No                       : string;
   serialNo                 : string;
}

export interface ParameterDataElementBatch {
  No                       : string;
  batchNo                  : string;
  qty                      : any;
  serialList               : any;
}


@Component({
  selector: 'app-outbound-lpn-list',
  templateUrl: './outbound-lpn-list.component.html',
  styleUrls: ['./outbound-lpn-list.component.css']
})

export class OutboundLpnListComponent implements OnInit, AfterViewInit, OnDestroy {

      listProgress = false;
      listProgressPopup = false;
      isEdit = false;
      isAdd = false;
      parameterData: ParameterDataElement[] = [];
      parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      parameterDisplayedColumns: string[] = [
            'txnNo',
            'txnType',
            'txnDate',  
            'txnQuantity',  
            'txnUomCode',
            'txnSourceId',                                                             
            'txnSourceLineId',                                                                                             
            'txnSourceType',   
            'txnDestinationTypeCode',
            'txnReceiptId',                                                            
            'txnReceiptLineId',    
            'txnItemId',                                                           
            'txnItemRevisionId',  
            'txnTransferLpnId', 
            'txnLpnId',      
            'txnFromIuId',  
            'txnToIuId', 
            'txnFromLgId', 
            'txnToLgId',  
            'txnFromLocatorId',   
            'txnToLocatorId',    
            'txnInspectionQualityCode',                                                           
            'txnInspectionStatusCode',      
            'batchCount',   
            'serialCount'
          ];
  
          columns: any =  [
            {field: 'txnNo', name: 'No', width: 75, baseWidth: 2 },
            {field: 'txnType', name: 'Transaction Type', width: 75, baseWidth: 5 },
            {field: 'txnDate', name: 'Transaction Date', width: 75, baseWidth: 5},
            {field: 'txnQuantity', name: 'Qty', width: 75, baseWidth: 2 },
            {field: 'txnUomCode', name: 'UOM', width: 75, baseWidth: 3 },
            {field: 'txnSourceId', name: 'Source', width: 75, baseWidth: 3 },
            {field: 'txnSourceLineId', name: 'Source Line', width: 75, baseWidth: 4},
            {field: 'txnSourceType', name: 'Source Type', width: 75, baseWidth: 5 },
            {field: 'txnDestinationTypeCode', name: 'Destination Type', width: 75, baseWidth: 5},
            {field: 'txnReceiptId', name: 'Receipt', width: 75, baseWidth: 3 },
            {field: 'txnReceiptLineId', name: 'Receipt Line', width: 75, baseWidth: 4 },
            {field: 'txnItemId', name: 'Item', width: 75, baseWidth: 6 },
            {field: 'txnItemRevisionId', name: 'Item Revision', width: 75, baseWidth: 4 },
            {field: 'txnTransferLpnId', name: 'Transfer LPN', width: 75, baseWidth: 4 },
            {field: 'txnLpnId', name: 'LPN', width: 75, baseWidth: 3 },
            {field: 'txnFromIuId', name: 'From IU', width: 75, baseWidth: 5 },
            {field: 'txnToIuId', name: 'To IU', width: 75, baseWidth: 4},
            {field: 'txnFromLgId', name: 'From LG', width: 75, baseWidth: 4 },
            {field: 'txnToLgId', name: 'To LG', width: 75, baseWidth: 3 },
            {field: 'txnFromLocatorId', name: 'From Locator', width: 75, baseWidth: 5 },
            {field: 'txnToLocatorId', name: 'To Locator', width: 75, baseWidth: 5 },
          
            {field: 'txnInspectionQualityCode', name: 'Inspection Status', width: 75, baseWidth: 5 },
            {field: 'txnInspectionStatusCode', name: 'Inspection Quality', width: 75, baseWidth: 5 },
           
            {field: 'batchCount', name: 'Batch', width: 75, baseWidth: 4 },
            {field: 'serialCount', name: 'Serial', width: 75, baseWidth: 4 },
           
        ]
  
      parameterDataSerial: ParameterDataElementSerial[] = [];
      parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
      parameterDisplayedColumnsSerial: string[] = [
        'No',                
        'serialNumber'                                                                    
      ];
  
      parameterDataBatch: ParameterDataElementBatch[] = [];
      parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
      parameterDisplayedColumnsBatch: string[] = [
        'No',                    
        'batchNumber',                 
        'txnBatchQuantity',
        'serialList'                                                                              
      ];
  
      transactionTableMessage = '';
      serialTableMessage = '';
      batchTableMessage = '';
      isBatch : any = false;
      isBackBtnEnable : any = false;
      txnSearchParameters : any = null;
  
   
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    private searchInfoArrayunsubscribe: any;
    showSearch = true;
  
    @ViewChild(MatPaginator,  { static: false }) paginator: MatPaginator;
    @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
    @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
  
    
    tooltipPosition: TooltipPosition[] = ['below'];
  
    constructor(
      private snackBar: MatSnackBar,
      private render: Renderer,
      public commonService: CommonService,
      private http: HttpClient,
      private outboundLpnService: OutboundLpnService,
      private dialog: MatDialog
    ) {
      this.searchEnable = true;
    }
  
    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/outbound-lpn.json');
    
  
    ngOnInit() {
      //this.getAllTransactions();
      this.showSearch = true;
      this.searchJson.subscribe((data: any) => {
          this.dataForSearch = data;
          this.searchForTxnInquery();
          this.searchTxnInquery();
      });
      this.commonService.getScreenSize();
    }
  
    searchTxnInquery(){
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((onTransactionSearchInfo: any) => {
          this.txnSearchParameters = onTransactionSearchInfo;
          this.parameterDataSource = new MatTableDataSource([]);
           
          if (onTransactionSearchInfo.searchType === 'outbound-lpn') {
            this.customTable.nativeElement.scrollLeft = 0;
  
            if(onTransactionSearchInfo.searchArray.txnType === undefined || onTransactionSearchInfo.searchArray.txnType === '' ){
              this.openSnackBar(' Please Select the transaction type', '', 'default-snackbar');
              return;
            }
             
            const data = onTransactionSearchInfo.searchArray;
            if(data.txnNumberId !== undefined && data.txnNumberId !== '' && 
              (data.txnSourceType === '' ||  data.txnSourceType === undefined) ){
              this.openSnackBar(' Please Select the transaction source', '', 'default-snackbar');
              return;
            } 
            // This code is used for not loading the search result when module loads 
            if(onTransactionSearchInfo.fromSearchBtnClick === true){
              // onTransactionSearchInfo.fromSearchBtnClick = false;
              // this.commonService.getsearhForMasters(onTransactionSearchInfo);
              this.listProgress = true;
              this.outboundLpnService
                  .getTransactionSearch(onTransactionSearchInfo.searchArray)
                  .subscribe(
                      (data: any) => {
                        
                          this.listProgress = false;
                          if (data.status === 200) {
                              if (!data.message) {
                                  this.parameterDataSource = new MatTableDataSource<
                                      any
                                  >(data.result);
                                  this.parameterDataSource.paginator = this.paginator;
                                  this.parameterDataSource.sort = this.sort;
                                  // this.parameterDataSource.connect().subscribe(d => {
                                  //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                                  // });
                              } else {
                                  this.transactionTableMessage = data.message;
                              }
                          } else {
                              // alert(data.message);
                              this.openSnackBar(data.message, '', 'error-snackbar');
  
                          }
                      },
                      (error: any) => {
                          this.listProgress = false;
                          // alert(error.error.message);
                          this.openSnackBar(error.error.message, '', 'error-snackbar');
                      }
                  );
            }else{
                return;
            }
           
             
            
              
          }
      });
  
    }
  
    searchForTxnInquery(){
      this.commonService.searhForMasters(this.dataForSearch);
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
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
  
  
  
    getAllTransactions(){
      this.listProgress = true;
      this.outboundLpnService.getAllTransactions()
      .subscribe(
          (data: any) => {
              this.listProgress = false;
              if (data.status === 200) {
                 
                  if (!data.message) {
                      for (const rowData of data.result) {
                          this.parameterData.push(rowData);
                      }
                      this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                      this.parameterDataSource.paginator = this.paginator;
                  } else {
                      this.transactionTableMessage = data.message;
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
  
    openBatchPopup(templateRef: TemplateRef<any>, element: any){
      if(element.batchCount === 0){
        return
      }
      this.listProgressPopup = true;
       
      const data = {
        txnId: element.txnId,
        batchNumber : this.txnSearchParameters.searchArray.batchNumber  ? this.txnSearchParameters.searchArray.batchNumber  : null,
        serialNumber: this.txnSearchParameters.searchArray.serialNumber ? this.txnSearchParameters.searchArray.serialNumber : null
      }
  
      this.outboundLpnService.getAllBatch(data)
      .subscribe(
          (data: any) => {
              this.listProgressPopup = false;
              this.parameterDataBatch = [];
              if (data.status === 200) {
                   
                  if (!data.message) {
                      this.isBatch = true;
                      this.dialog.open(templateRef, {
                        autoFocus: false,
                        minWidth: 260
                      });
                      for (const rowData of data.result) {
                          this.parameterDataBatch.push(rowData);
                      }
                      this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                      this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                      setTimeout(() => {
                        this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
                    }, 100);
                     
                  } else {
                      this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                      this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                      setTimeout(() => {
                        this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
                    }, 100);
                      this.batchTableMessage = data.message;
                      this.isBatch = true;
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
  
    openSerialPopup(templateRef: TemplateRef<any>, element: any){
      this.isBackBtnEnable = false;
      if(element.serialCount === 0){
        return
      }
      this.listProgressPopup = true;
  
      // const data = {
      //   serial: this.txnSearchParameters
      //   transactionNumber : element.txnId
      // }
       
      const data = {
        txnId: element.txnId,
        batchNumber : this.txnSearchParameters.searchArray.batchNumber  ? this.txnSearchParameters.searchArray.batchNumber  : null,
        serialNumber: this.txnSearchParameters.searchArray.serialNumber ? this.txnSearchParameters.searchArray.serialNumber : null
      }
  
      this.outboundLpnService.getAllSerial(data)
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
                      this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                      setTimeout(() => {
                        this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
                    }, 100);
                     
                  } else {
                      this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                      this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                      setTimeout(() => {
                        this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
                    }, 100);
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
      // const data = {
      //   batchid : ""
      //   batchnumber : this.txnSearchParameters,
      //   serial: this.txnSearchParameters
      //   transactionNumber : element.txnId
      // }
      const data = {
        txnBatchId: element.txnBatchId,
        txnId: element.txnId,
        batchNumber : this.txnSearchParameters.searchArray.batchNumber  ? this.txnSearchParameters.searchArray.batchNumber  : null,
        serialNumber: this.txnSearchParameters.searchArray.serialNumber ? this.txnSearchParameters.searchArray.serialNumber : null
      }
  
  
      this.outboundLpnService.getAllSerial(data)
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
                      this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                     
                  } else {
                      this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                      this.parameterDataSourceSerial.paginator = this.paginatorSerial;
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
  
    backToBatchList(){
      this.isBatch = true;
      this.isBackBtnEnable = false;
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
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        }, 500);
        setTimeout(() => {
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
    }
  
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize();
    }
  
  
  }
  
