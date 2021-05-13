import { Component, OnInit, ViewChild, TemplateRef, ElementRef, 
  Output, EventEmitter, HostListener, AfterViewInit, OnDestroy, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatPaginator, TooltipPosition, MatTableDataSource, MatTable, MatSort, Sort, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { ShipmentService } from 'src/app/_services/outbound/shipment.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { HttpClient } from '@angular/common/http';
// import { ParameterDataElement } from 'src/app/lookups/lookup-list/lookup-list.component';

export interface ParameterDataElement {
  sno: number;
  shipmentNumber: string;
  iuCode: string;
  customer: string;
  customerSite: string;
  shippedDateFrom: string;
  shippedDateTo: string;
  action: string;
}

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentListComponent implements OnInit,  AfterViewInit, OnDestroy {
  searchEnable: boolean;
  isEdit = false;
  isAdd = false;
  dataResult = false;
  private searchInfoArrayunsubscribe: any;
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild('paginatorViewShipment', { static: false }) paginatorViewShipment: MatPaginator;
  @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
  tooltipPosition: TooltipPosition[] = ['below'];
  listProgress = false;
  shipmentTableMessage = '';
  parameterDisplayedColumns: string[] = [
    'sno',
    'shipmentNumber',
    'iuCode',
    'customer',
    'customerSite',
    'soDeliveryPlannedDate',
    //'shippedDateTo',
    'shipmentStatus',
    'shipmentDate',
    'shipmentDeliveryDate', 
    'shipmentCarrier',
    'action'
  ];
  columns: any = [
    { field: 'sno', name: '#', width: 75, baseWidth: 4 },
    { field: 'shipmentNumber', name: 'Shipment #', width: 75, baseWidth: 9 },
    { field: 'iuCode', name: 'IU', width: 75, baseWidth: 8 },
    { field: 'customer', name: 'Customer', width: 75, baseWidth: 10 },
    { field: 'customerSite', name: 'Customer Site', width: 75, baseWidth: 13 },
    { field: 'soDeliveryPlannedDate', name: 'Planned Shipped Date', width: 75, baseWidth: 12 },
    //{ field: 'shippedDateTo', name: 'Planned Shipped Date To', width: 75, baseWidth: 15 },
    { field: 'shipmentStatus', name: 'Shipment Status', width: 75, baseWidth: 10 },
    { field: 'shipmentDate', name: 'Actual Ship Date', width: 75, baseWidth: 10 },
    { field: 'shipmentDeliveryDate', name: 'Actual Delivery Date', width: 75, baseWidth: 11 },
    { field: 'shipmentCarrier', name: 'Carrier', width: 75, baseWidth: 6 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ]
  showSearch = true;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public dialog: MatDialog,
    private shipmentService: ShipmentService,
    private http: HttpClient) 
    {
      this.searchEnable = true;
      this.commonService.getScreenSize(-84); 
    }

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/shipment-search.json'); 
  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.searchShipment();
      this.searchForShipment();
    });

    const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
    if(graphSearchData !== null){
        this.search(graphSearchData);
        localStorage.removeItem('graphSearchData');
    }

  }
  searchShipment() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {
  
        // This code is used for not loading the search result when module loads 
        if (searchInfo.fromSearchBtnClick === true) {
          this.customTable.nativeElement.scrollLeft = 0;
          this.parameterData = [];
          this.parameterDataSource = new MatTableDataSource<
            ParameterDataElement
          >(this.parameterData);
          this.parameterDataSource.paginator = this.paginator;
          if (searchInfo.searchType === 'shipment') {
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
    this.shipmentService
      .getShipmentSearch(data)
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
            this.shipmentTableMessage = data.message;
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
  searchForShipment() {
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
       
     
      dialogData.push(element.shipmentId);
      const dialogRef = this.dialog.open(ShipmentViewDialogComponent, {
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
      this.router.navigate(['shipment/createshipment']);
    } else {
      this.router.navigate(['shipment/editshipment/' + element]);
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
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   

}


@Component({
  selector: 'app-shipment-view-dialog',
  templateUrl: './shipmentViewDialog.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentViewDialogComponent {
  shipmentColumns: string[] = [
    'No',
    'salesOrder',
    'soLine',
    'item',
    'itemRevision',
    'shipmentQty',
    'UOM',
    'shippedQty',
    'plannedShippedDate',
    'status',
    'netWeight',
    'grossWeight',
    'weightUOM',
    'volume',
    'volumeUOM'
  ];
  resultData = [];
  parameterDataSourceView = new MatTableDataSource<any>([]);
  @ViewChild('paginatorViewShipment', { static: false }) paginatorViewShipment: MatPaginator;

  constructor(
      private shipmentService: ShipmentService,
      public commonService: CommonService,
      public dialogRef: MatDialogRef<ShipmentViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getPoDetailsById(data);
  }

  onCloseClick(): void {
      this.dialogRef.close();
  }

  dataObject: any = {}
  getPoDetailsById(id) {
    this.shipmentService.getShipmentDetailsById(id).subscribe((data: any) => {
        if (data.status === 200) {
           
          data = data.result[0];
         this.setData(data);
            let temp = []
            if (data.shipmentLines && data.shipmentLines.length) {
              this.paginatorViewShipment.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorViewShipment.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
              this.parameterDataSourceView = new MatTableDataSource<any>(data.shipmentLines);
              this.parameterDataSourceView.paginator = this.paginatorViewShipment;
            }
        }
    });
  }

  setData(data){
    this.dataObject = data
  }

  
}
