import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter, TemplateRef, HostListener, Inject, Optional } from '@angular/core';
import { MatTableDataSource, MatTable, MatSort, Sort, MatDialogRef, MatPaginator, TooltipPosition, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { HttpClient } from '@angular/common/http';
// import { ShipmentViewDialogComponent } from 'src/app/outbound/shipment/shipment-list/shipment-list.component';
import { PrinterManagerService } from 'src/app/_services/labelSetup/printer-manager.service';

export interface ParameterDataElement {
  sno: number;
  name: string;
  server: string;
  port: string;
  enabled: boolean;
  action?: string;
}

@Component({
  selector: 'app-printer-manager-list',
  templateUrl: './printer-manager-list.component.html',
  styleUrls: ['./printer-manager-list.component.css']
})
export class PrinterManagerListComponent implements OnInit, AfterViewInit {
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
  shipmentTableMessage = '';
  parameterDisplayedColumns: string[] = [
    'sno',
    'name',
    'server',
    'port',
    'enabled',
    'action'
  ];
  columns: any = [
    { field: 'sno', name: '#', width: 75, baseWidth: 5 },
    { field: 'name', name: 'Name', width: 75, baseWidth: 25 },
    { field: 'server', name: 'Server', width: 75, baseWidth: 30 },
    { field: 'port', name: 'Port', width: 75, baseWidth: 15 },
    { field: 'enabled', name: 'Enabled', width: 75, baseWidth: 15 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
  ]
  showSearch = true;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );
  printerLov = [];
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public dialog: MatDialog,
    private printerManagerService: PrinterManagerService,
    private http: HttpClient) {
    this.searchEnable = true;
    this.getScreenSize();
  }

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/printer-manager-search.json');
  screenMaxHeight: any;
  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.getPrintManagerList();
      this.getPrinterLOV();
       this.searchForPrinterManager();
    });
  }
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
  getPrintManagerList(){
   
    this.printerManagerService
      .getPrinterSearch()
      .subscribe(data => {
        // if (data.status === 200) {
        //   if (!data.message) {
            this.listProgress = false;
            this.dataResult = true;
            for (const rData of data) {
              rData.port = Number(rData.port);
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

            // this.parameterDataSource.connect().subscribe(d => {
            //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
            //     this.parameterDataSource.sort);
            // });
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
  //search for searchForPrinterManager
  searchForPrinterManager() {
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
       

      dialogData.push(element.id);
      const dialogRef = this.dialog.open(PrinterManagerViewDialogComponent, {
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
      this.router.navigate(['printermanager/createprintermanager']);
    } else {
      this.router.navigate(['printermanager/editprintermanager/' + element]);
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
  selector: 'app-printer-manager-view-dialog',
  templateUrl: './printerManagerViewDialog.html',
  styleUrls: ['./printer-manager-list.component.css']
})
export class PrinterManagerViewDialogComponent {
  printerColumns: string[] = [
    'No',
    'name',
    'description',
    'ipAddress',
    'port',
    'language',
    'DPI',
    'enabled',
  ];
  resultData = [];
  parameterDataSource = new MatTableDataSource<any>(this.resultData);
  

  constructor(
    private printerManagerService: PrinterManagerService,
    private router: Router,
    public dialogRef: MatDialogRef<PrinterManagerViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     
    this.getPoDetailsById(data);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  gotoEdit(element) {    
    this.router.navigate(['printermanager/editprintermanager/' + element]);       
  this.dialogRef.close();
}
  dataObject: any = {}
  getPoDetailsById(id) {
    this.printerManagerService.getPrintManagerById(id).subscribe((data: any) => {
      // if (data.status === 200) {

        data = data[0];
        this.setData(data);
      this.printerManagerService
        .getPrinterById(data.id)
        .subscribe((data: any) => {
          // this.renderEditRoles(data);
          
          // this.parameterDataSource = new MatTableDataSource<any>(
          //     data
          //   );
          for (const [index, pData] of data.entries()) {
            const obj = {
              name: pData.name,
              description: pData.description,
              ipAddress: pData.ipAddress,
              port: pData.port,
              language: pData.language,
              dpi: pData.dpi,
              isActive: pData.isActive === 1 ? true : false,
            }
            // obj['originalData'] = Object.assign({}, obj);
            this.resultData.push(obj);
          }
          this.parameterDataSource = new MatTableDataSource<any>(
            this.resultData
          );
        });
        // if (data.shipmentLines && data.shipmentLines.length) {
        //   for (const [index, shipmentLineData] of data.shipmentLines.entries()) {
        //     this.resultData.push(shipmentLineData);
           
          // }
        // }
      // }
    });
  }

  setData(data) {
    data.isActive === 1 ? data.isActive = true : data.isActive = false;
    this.dataObject = data
  }


}
