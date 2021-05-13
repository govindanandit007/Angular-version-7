import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, HostListener, Inject, Optional } from '@angular/core';
import { MatTableDataSource, MatTable, MatSort, Sort, MatDialogRef, MatPaginator, TooltipPosition, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { HttpClient } from '@angular/common/http';
import { PrintHistoryService } from 'src/app/_services/labelSetup/print-history.service';
import { PrinterManagerService } from 'src/app/_services/labelSetup/printer-manager.service';
export interface ParameterDataElement {
   rowSelect: boolean,
   id: number,
  sno: number;
  name: string;
  server: string;
  port: string;
  enabled: boolean;
  action?: string;
}
@Component({
  selector: 'app-print-history-list',
  templateUrl: './print-history-list.component.html',
  styleUrls: ['./print-history-list.component.css']
})
export class PrintHistoryListComponent implements OnInit {
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
  printHistoryTableMessage = '';
  selectAllRow = false;
  showSelectAll = false;
  printerLov = [];
  printerName = '';
  parameterDisplayedColumns: string[] = [
    'rowSelect',
    'id',
    'labelName',
    'requestedBy',
    'printerName',
    'copies',
    'status',
    'creationDate',
    'action'
  ];
  columns: any = [
    { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
    { field: 'id', name: 'ID', width: 75, baseWidth: 5 },
    { field: 'labelName', name: 'Label Name', width: 75, baseWidth: 14 },
    { field: 'requestedBy', name: 'Requested By', width: 75, baseWidth: 16 },
    { field: 'printerName', name: 'Printer Name', width: 75, baseWidth: 15 },
    { field: 'copies', name: 'Copies', width: 75, baseWidth: 9 },
    { field: 'status', name: 'Status', width: 75, baseWidth: 10 },
    { field: 'creationDate', name: 'Print Time', width: 75, baseWidth: 17 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
  ]
  showSearch = true;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public dialog: MatDialog,
    private printHistoryService: PrintHistoryService,
    private printerManagerService: PrinterManagerService,
    private http: HttpClient) {
    this.searchEnable = true;
    this.getScreenSize();
  }

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/print-history-search.json');
  screenMaxHeight: any;
  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.getPrintHistoryList();
      this.getPrinterLOV();
      this.searchForPrintHistory();
    });
  }
  getPrintHistoryList() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {

          this.screenMaxHeight = '440px'
        // This code is used for not loading the search result when module loads 
        if (searchInfo.fromSearchBtnClick === true) {
          // searchInfo.fromSearchBtnClick = false;
            this.listProgress = true;
          // this.commonService.getsearhForMasters(searchInfo);
          this.parameterData = [];
          this.parameterDataSource = new MatTableDataSource<
            ParameterDataElement
          >(this.parameterData);
          this.parameterDataSource.paginator = this.paginator;
          if (searchInfo.searchType === 'printHistory') {
            this.parameterData = [];
            this.printHistoryService
              .getPrintHistoryList()
              .subscribe(data => {
                this.listProgress = false;
                this.dataResult = true;
                for (const rData of data) {
                  rData.action = '';
                  if (rData.active === 'No') {
                    rData.active = false;
                  } else {
                    rData.active = true;
                  }
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
                this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];

                this.parameterDataSource.connect().subscribe(d => {
                  this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                    this.parameterDataSource.sort);
                });
        //   } else {
        //     this.listProgress = false;
        //     this.dataResult = false;
        //     this.shipmentTableMessage = data.message;
        //   }
        // } else {
        //   this.listProgress = false;
        //   this.openSnackBar(
        //     data.message,
        //     '',
        //     'error-snackbar'
        //   );
        // }
    this.getScreenSize();
              });
          }
        } else {
          this.listProgress = false;
          return;
        }

      }
    );
  }
  // getPrintHistoryLists() {

  //   this.printHistoryService
  //     .getPrintHistoryList()
  //     .subscribe(data => {
  //       // if (data.status === 200) {
  //       //   if (!data.message) {
  //       this.listProgress = false;
  //       this.dataResult = true;
  //       for (const rData of data) {
  //         rData.action = '';
  //         if (rData.active === 'No') {
  //           rData.active = false;
  //         } else {
  //           rData.active = true;
  //         }
  //         this.parameterData.push(rData);
  //       }
  //       this.parameterDataSource = new MatTableDataSource<
  //         ParameterDataElement
  //       >(this.parameterData);
  //       this.parameterDataSource.paginator = this.paginator;
  //       this.parameterDataSource.sort = this.sort;
  //       this.parameterDataSource.connect().subscribe(d => {
  //         this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
  //           this.parameterDataSource.sort);
  //       });
  //       //   } else {
  //       //     this.listProgress = false;
  //       //     this.dataResult = false;
  //       //     this.shipmentTableMessage = data.message;
  //       //   }
  //       // } else {
  //       //   this.listProgress = false;
  //       //   this.openSnackBar(
  //       //     data.message,
  //       //     '',
  //       //     'error-snackbar'
  //       //   );
  //       // }
  //     });
  // }

  // Get printer LOV
  getPrinterLOV() {
    this.printerLov = [{ label: ' Please Select', value: '' }];
    this.printerManagerService.getPrinterLOV('admin@visioncorp.com')
      .subscribe((data: any) => {
        for (const rowData of data) {
          this.printerLov.push({
            value: rowData.name,
            label: rowData.name
          });
        }
      });
  }
  // select / unselect all print history checkbox
  selectAll() {
    for (const pData of this.parameterData) {
      if (this.selectAllRow) {
        pData.rowSelect = true;
        // this.showCreateWaveBtn = true;
      } else {
        pData.rowSelect = false;
        // this.showCreateWaveBtn = false;
      }

    }
  }

  // row selection change
  rowSelectionChange() {
    let selectRowCount = 0;
    for (const data of this.parameterData) {
      if (data.rowSelect) {
        selectRowCount++;
      }
    }
    // this.showCreateWaveBtn = selectRowCount > 0 ? true : false;
  }

  // search for Print History
  searchForPrintHistory() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
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
  goFor(type: string, element?: any) {
    if (type === 'view') {
      const dialogData = [];
       
      dialogData.push(element);
      const dialogRef = this.dialog.open(PrintHistoryViewDialogComponent, {
        width: '60vw',
        data: dialogData,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(response => {
        if (response !== undefined) {
          this.goFor('edit', response);
        }
      });
    } else if (type === 'print') {
      // this.router.navigate(['shipment/createshipment']);
      this.getReprintWithPrinter(element)
    }
  }

  printMultiple(event) {

    const printLineArray = [];
    let tempObject = {};
    let id;
    for (const [i, pData] of this.parameterData.entries()) {
      if (pData.rowSelect === true) {
        id= pData.id;
        printLineArray.push(id)
      }
    }
      if(this.printerName!== '' && printLineArray.length){
    this.printHistoryService
      .reprintWithMultiplePrinter(printLineArray.join(), this.printerName, 'admin@visioncorp.com')
      .subscribe(resultData => {
        this.openSnackBar(resultData, '', 'success-snackbar');
      },
            (error: any) => {
                        this.openSnackBar(
                                error.error,
                                '',
                                'error-snackbar'
                            );

            })
    }else{
        this.openSnackBar(this.printerName === ''?'Please select printer name':'Please select atleast one row', '', 'default-snackbar');
    }
    // data.waveLines = printLineArray;
    // return printLineArray;
  }
  getReprintWithPrinter(data){
    this.printHistoryService
      .reprintWithPrinter(data, 'admin@visioncorp.com')
      .subscribe(resultData => {
        this.openSnackBar(resultData, '', 'success-snackbar');
      })
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
  @HostListener('window:resize', [])
  onResize(): void {
    this.getScreenSize();

    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  }
  getScreenSize(event?) {
    const screenHeight = window.innerHeight;
    this.screenMaxHeight = (screenHeight - 248) + 'px';
    //   this.scrWidth = window.innerWidth; 
  }

  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
  }
}


@Component({
  selector: 'app-print-history-view-dialog',
  templateUrl: './printHistoryViewDialog.html',
  styleUrls: ['./print-history-list.component.css']
})
export class PrintHistoryViewDialogComponent {
  // shipmentColumns: string[] = [
  //   'No',
  //   'salesOrder',
  //   'soLine',
  //   'item',
  //   'itemRevision',
  //   'shipmentQty',
  //   'UOM',
  //   'shippedQty',
  //   'plannedShippedDate',
  //   'status',
  //   'netWeight',
  //   'grossWeight',
  //   'weightUOM',
  //   'volume',
  //   'volumeUOM'
  // ];
  // resultData = [];
  // parameterDataSource = new MatTableDataSource<any>(this.resultData);

  constructor(
    // private shipmentService: ShipmentService,
    public dialogRef: MatDialogRef<PrintHistoryViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.getPoDetailsById(data);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  dataObject: any = {}
  // getPoDetailsById(id) {
    // this.shipmentService.getShipmentDetailsById(id).subscribe((data: any) => {
    //   if (data.status === 200) {

    //     data = data.result[0];
    //     this.setData(data);

    //     if (data.shipmentLines && data.shipmentLines.length) {
    //       for (const [index, shipmentLineData] of data.shipmentLines.entries()) {
    //         this.resultData.push(shipmentLineData);
    //         this.parameterDataSource = new MatTableDataSource<any>(
    //           this.resultData
    //         );
    //       }
    //     }
    //   }
    // });
  // }

  // setData(data) {
  //   this.dataObject = data
  // }


}
