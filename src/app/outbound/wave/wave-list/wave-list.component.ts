import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter, HostListener, AfterViewInit, OnDestroy, Optional, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog, TooltipPosition, MatTable, MatSort, Sort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { WaveService } from 'src/app/_services/transactions/wave.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';

export interface ParameterDataElement {
  sno: number;
  waveNumber: string;
  iuCode: string;
  iuName: string;
  status: string;
  taskType: string;
  policy: string;
  action: string;
}
@Component({
  selector: 'app-wave-list',
  templateUrl: './wave-list.component.html',
  styleUrls: ['./wave-list.component.css']
})
export class WaveListComponent implements OnInit, AfterViewInit, OnDestroy {
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
  waveTableMessage = '';
  parameterDisplayedColumns: string[] = [
    'sno',
    'waveNumber',
    'iuCode',
    'waveStatus',
    'waveTaskPolicy',
    'action'
  ];
  columns: any = [
    { field: 'sno', name: '#', width: 75, baseWidth: 7 },
    { field: 'waveNumber', name: 'Wave #', width: 75, baseWidth: 15 },
    { field: 'iuCode', name: 'IU', width: 75, baseWidth: 20 },
    { field: 'waveStatus', name: 'Status', width: 75, baseWidth: 23 },
    // { field: 'waveTaskType', name: 'Task Type', width: 75, baseWidth: 15 },
    { field: 'waveTaskPolicy', name: 'Policy', width: 75, baseWidth: 25 },
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
    private waveService: WaveService,
    private http: HttpClient
    ) {
    this.searchEnable = true;
    this.commonService.getScreenSize(-84); 
     }

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/wave-search.json');
  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.searchWave();
      this.searchForWave();
    });

    const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
    if(graphSearchData !== null){
        this.search(graphSearchData);
        localStorage.removeItem('graphSearchData');
    }

  }

  searchWave() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {

        // This code is used for not loading the search result when module loads 
        if (searchInfo.fromSearchBtnClick === true) {
    
          // searchInfo.fromSearchBtnClick = false;
          // this.commonService.getsearhForMasters(searchInfo);
          this.parameterData = [];
          this.parameterDataSource = new MatTableDataSource<
            ParameterDataElement
          >(this.parameterData);
          this.parameterDataSource.paginator = this.paginator;
          if (searchInfo.searchType === 'wave') {
            this.search(searchInfo.searchArray);
          }
        } else {
          this.listProgress = false;
          return;
        }

      }
    );
  }

  search(data){
    this.listProgress = true;
    this.waveService
      .getWaveSearch(data)
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
            //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
            //     this.parameterDataSource.sort);
            // });
          } else {
            this.listProgress = false;
            this.dataResult = false;
            this.waveTableMessage = data.message;
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
  searchForWave() {
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
      const dialogRef = this.dialog.open(WaveViewDialogComponent, {
        width: '80vw',
        data: dialogData,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(response => {
        if (response !== undefined) {
          this.goFor('edit', response);
        }
      });
    } else if (type === 'add') {
      this.router.navigate(['wave/addwavecriteria']);
    } else {
      this.router.navigate(['wave/editwave/' + element]);
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
  onResize(): void {
    this.commonService.getScreenSize(-84); 
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  }
   
  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    // this.parameterDataSource.connect().subscribe(d => {
    //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);
    // });
    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100); 
  }
}
@Component({
  selector: 'app-wave-view-dialog',
  templateUrl: './wave-view-dialog.html',
  styleUrls: ['./wave-list.component.css']
})
export class WaveViewDialogComponent {
  waveViewdColumns: string[] = [
    'serialNumber',
    'soNumber',
    'soLineNumber',
    'itemName',
    'revsnNumber',
    'soShipmentNumber',
    'waveQuantity',
    'waveQuantityUomCode',
    'waveStatus',
    'taskNumber'
    // 'asnReceiptRouting'
  ];
  resultData = [];
  waveParameterDataSource = new MatTableDataSource<any>(this.resultData);
  dataProgress = false;
  wavePickSlipGroupName = '';
  constructor(
    public router: Router,
    private dialog: MatDialog,
    private waveService: WaveService,
    public dialogRef: MatDialogRef<WaveViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     
    this.getWaveDetailsById(data[0].waveId);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  getWaveDetailsById(id) {
    this.dataProgress = true;
    this.waveService.getWaveById(id).subscribe((data: any) => {
      if (data.status === 200) {         
        this.wavePickSlipGroupName = data.result.wavePickSlipGroupName;
        if (data.result.waveLines.length) {
          for (const waveLineData of data.result.waveLines) {
            this.resultData.push(waveLineData);           
            this.waveParameterDataSource = new MatTableDataSource<any>(
              this.resultData
            );
          }
        }
        this.dataProgress = false;
      }
    });
  }

  showAllocations(id, waveIuId) {
    // const itemsArr = [];
    // this.dialog.open(AllocationsViewItemsDialogComponent, {
    //   width: '80vw',
    //   data: itemsArr
    // });
    this.router.navigate(['wave/allocations/'+ id +'/'+ waveIuId]);
    this.dialog.closeAll();
  }
}

export interface allocationParameterDataElement {
  sno: number;
  item: string;
  description: any;
}

@Component({
  selector: 'app-allocations-view-items-dialog',
  templateUrl: './allocations-view-dialog.html',
  styleUrls: ['./wave-list.component.css']
})

export class AllocationsViewItemsDialogComponent {
  allocationParameterDisplayedColumns: string[] = ['sno', 'item', 'description'];
  parameterDataClassItem: allocationParameterDataElement[] = [];
  allocationParameterDataSource = new MatTableDataSource<allocationParameterDataElement>(this.parameterDataClassItem);
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  waveNumberInput = '';
  IUInput = '';
  dataProgress = false;

  constructor(
    public router: Router,
    public commonService: CommonService,
    public dialogRef: MatDialogRef<AllocationsViewItemsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.parameterDataClassItem = data;
    this.allocationParameterDataSource = new MatTableDataSource<allocationParameterDataElement>(this.parameterDataClassItem);
  }
  allocationsDisplayedColumns: string[] = [
    'No',
    'item',
    'revision',
    'allocatedQty',
    'UOM',
    'salesOrder',
    'soLine',
    'LG',
    'locator',
    'lpn',
    'batch',
    'pickSlipNumber',
    // 'action'
  ];
  columns: any = [
    { field: 'No', name: 'No', width: 75, baseWidth: 3 },
    { field: 'item', name: 'Item', width: 75, baseWidth: 8 },
    { field: 'revision', name: 'Revision', width: 75, baseWidth: 8 },
    { field: 'allocatedQty', name: 'Allocated Qty', width: 75, baseWidth: 10 },
    { field: 'UOM', name: 'UOM', width: 75, baseWidth: 8 },
    { field: 'salesOrder', name: 'Sales Order', width: 75, baseWidth: 10 },
    { field: 'soLine', name: 'SO Line', width: 75, baseWidth: 8 },
    { field: 'LG', name: 'LG', width: 75, baseWidth: 8 },
    { field: 'locator', name: 'Locator', width: 75, baseWidth: 7 },
    { field: 'lpn', name: 'LPN', width: 75, baseWidth: 5 },
    { field: 'batch', name: 'Batch', width: 75, baseWidth: 5 },
    { field: 'pickSlipNumber', name: 'Pick Slip Number', width: 75, baseWidth: 15 },
    // { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
  ]


  onAllocationCloseClick(): void {
    this.dialogRef.close();
  }

  editAllocations(): void{
    this.dialogRef.close();
    this.router.navigate(['wave/allocations']);

  }
}
