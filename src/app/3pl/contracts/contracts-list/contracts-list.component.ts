import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, 
  HostListener, AfterViewInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, Sort, MatTable, MatTableDataSource, 
  MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { ContractsService } from 'src/app/_services/3pl/contracts.service';

export interface ParameterDataElement {
  sno?: any;
  customerName: any;
  code: any;
  description: any;
  lastComputaionDate: any;
  itemId: any;
  itemName?: any;
  lgId: any;
  lgCode?: any;
  locatorId: any;
  locatorName?: any;
  userId: any;
  userName?: any;
  uom: any;
  unitOfMeasure?: any;
  rate: any;
  cCount: any;
  startDate: any;
  endDate: any;
  enableFlag: any;
  contractId?: any;
  contractLineId?: any;
  activityGroupId?: any;
  activityId?: any;
  totalTxnCount?: any;
  action?: any;
  editing?: boolean;
  addNewRecord?: boolean;
  originalData?: any;
  createdBy?: any;
  updatedBy?: any;
  inlineSearchLoader?: string;
  searchValue?: string;
  itemList?: any,
  subactivity?: any,
  inspectionQuality?: any,
  txnDestinationType?: any,
  activityArea: any,
  ActvityAreaDesc: any,
  transactionType?: any,
  transactionTypeDesc?: any,
  activity?: any,
  activityDesc?: any,
  totalCounter: any,
  unbilledCounter: any,
  lineAmount: any,
  txnTypeList?: any[],
  activityList?: any[]
}

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit {

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch = true;
  

  

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  tooltipPosition: TooltipPosition[] = ['below'];

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  parameterDisplayedColumns: string[] = [
    'sno',
    'customerName',
    'contractCode',
    'description',
    'lastComputationDate',
    'enableFlag',
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 5 },
      { field: 'customerName', name: 'Customer Name', width: 75, baseWidth: 18 },
      { field: 'contractCode', name: 'Contract Number', width: 75, baseWidth: 16.5 },
      { field: 'description', name: 'Description', width: 75, baseWidth: 19 },
      { field: 'lastComputationDate', name: 'Last Computation Date', width: 75, baseWidth: 20.5 },
      { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 13 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 8 }
  ];

  activityTableMessage = '';
  screenMaxHeight:any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private contractsService: ContractsService,
    private http: HttpClient,
    public dialog: MatDialog){
    this.searchEnable = true;
    this.getScreenSize();

  }

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/contracts.json');

  ngOnInit() {

    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
        this.searchContracts();
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

   searchContracts() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {
          // This code is used for not loading the search result when module loads 
          if(searchInfo.fromSearchBtnClick === true){
            // if(searchInfo.searchArray.transactionTypeId === '' || searchInfo.searchArray.transactionTypeId === undefined ){
            //   this.openSnackBar('Please select the Transaction Type', '','default-snackbar');
            //   return;
            // }
            // this.customTable.nativeElement.scrollLeft = 0;
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            if (searchInfo.searchType === 'contracts') {
                this.listProgress = true;
                this.contractsService
                    .searchContracts(searchInfo.searchArray)
                    .subscribe(data => {
                        if (data.status === 200) {
                            if (!data.message) {
                                this.parameterData = [];
                                this.listProgress = false;
                                for (const rData of data.result) {
                                                if (
                                                    rData.enableFlag ===
                                                    'N'
                                                ) {
                                                    rData.enableFlag = false;
                                                } else {
                                                    rData.enableFlag = true;
                                                }
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
  goFor(type:string, element?:any){
    if(type==='view'){
        const dialogData = [];
        dialogData.push(element);
        const dialogRef = this.dialog.open(ContractViewDialogComponent, {
            width: '100vw',
            maxWidth: '90vw',
            data: dialogData,
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.goFor('edit', response);
            }
        });
    } else if(type === 'add'){
      this.router.navigate(['contracts/addcontract']);
    } else{
      // this.router.navigate(['contracts/editcontract/248']);
      this.router.navigate(['contracts/editcontract/' + element]);
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
  selector: 'app-contract-master-dialog',
  templateUrl: './contract-view-dialog.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractViewDialogComponent {
 parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  dataProgress = false;
  message = '';
  resultData = [];
  contractHeaderId = null;
  totalAmount=null;
  listProgress = false;
  parameterDisplayedColumns: string[] = [
    'sno',
    'ActvityAreaDesc',
    'transactionType',
    'activityDesc',
    'itemId',
    'lg',
    'stocklocator',
    'user',
    'uom',
    'rate',
    'startDate',
    'endDate',
    'totalCounter',
    'unbilledCounter',
    'lineAmount',
    'enableFlag',
  ];
  columns: any = [
    { field: 'sno', name: '#', width: 75, baseWidth: 5},
    { field: 'itemId', name: 'Item', width: 75, baseWidth: 5 },
    { field: 'lg', name: 'Locator Group', width: 75, baseWidth: 6 },
    { field: 'stocklocator', name: 'Stock Locator', width: 75, baseWidth: 7 },
    { field: 'user', name: 'User', width: 75, baseWidth: 5 },
    { field: 'uom', name: 'UOM', width: 75, baseWidth: 4 },
    { field: 'rate', name: 'Rate', width: 75, baseWidth: 5 },
    { field: 'count', name: 'Count', width: 75, baseWidth: 5 },
    { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 5 },
    { field: 'endDate', name: 'End Date', width: 75, baseWidth: 5 },
    { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 5 },
    { field: 'ActvityAreaDesc', name: 'Activity Area', width: 75, baseWidth: 7 },
    { field: 'transactionType', name: 'Transaction Type', width: 75, baseWidth: 7 },
    { field: 'activityDesc', name: 'Activity', width: 75, baseWidth: 5 },
    { field: 'totalCounter', name: 'Total Counter', width: 75, baseWidth: 7 },
    { field: 'unbilledCounter', name: 'Unbilled Counter', width: 75, baseWidth: 7 },
    { field: 'lineAmount', name: 'Total Amt.', width: 75, baseWidth: 5 }
  ];
  @ViewChild('paginatorContract', { static: false }) paginator: MatPaginator;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  constructor(
      public dialogRef: MatDialogRef<ContractViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private contractsService: ContractsService,
      public commonService: CommonService
  ) {
    this.getContractDetailsById(data);
    this.contractHeaderId = data[0].contractId;
  }
  onCloseClick(): void {
      this.dialogRef.close();
  }
  getContractDetailsById(data) {
    this.dataProgress = true;
    this.contractsService.getContractDetails(data[0].contractId).subscribe((data: any) => {
        if (data.status === 200) {
          //added below line to get totalAmount
          this.totalAmount = data.result[0].totalAmount;
          if (data.result[0].contractLine.length) {
             
                for (const contractData of data.result[0].contractLine) {
                  if (contractData.enableFlag === 'Y') {
                    contractData.enableFlag = true;
                  }else{
                    contractData.enableFlag = false;
                  }
                  this.resultData.push(contractData);
                  this.parameterDataSource = new MatTableDataSource<any>(
                      this.resultData
                  );
                  this.parameterDataSource.paginator = this.paginator;
                }
                this.dataProgress = false;
            }else{
              this.message = 'No Activity group Defined';
            }
        }
    });
    setTimeout(() => {       
      this.parameterDataSource.paginator = this.paginator;
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
  }
}
