import { Component, OnInit, Renderer, ViewChild, AfterViewInit, Optional, Inject, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TradingPartnerService } from 'src/app/_services/masters/trading-partner.service';
import { MatTableDataSource, TooltipPosition, MatTabChangeEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

interface PeriodicElement {
  No?: number;
  tpId: number;
  tpCode: string;
  tpName: string;
  tpAddress: string;
  tpEnabledFlag: boolean;
  activityBillingFlag?: boolean;
  addNewRecord?: boolean;
}

export interface CustomerNestedElement {
  createdBy: number;
  creationDate: string;
  tpId: number;
  tpSiteAddress1: string;
  tpSiteAddress2: string;
  tpSiteAddress3: string;
  tpSiteCity: string;
  tpSiteCode: string;
  tpSiteCompanyId: number;
  tpSiteCountry: string;
  tpSiteDescription: string;
  tpSiteDisableDate: string;
  tpSiteEnabledFlag: string;
  tpSiteId: number;
  tpSiteName: string;
  tpSitePersonEmail: string;
  tpSitePersonName: string;
  tpSitePersonPhoneNum: string;
  tpSitePhone: string;
  tpSitePincode: string;
  tpSiteStateCounty: string;
  tpSiteType: string;
  updatedBy: number;
  updatedDate: string;
  valueList: object;
}

let customerNestedElementData: CustomerNestedElement[] = [];
let supplierNestedElementData: CustomerNestedElement[] = [];
@Component({
  selector: 'app-trading-partner',
  templateUrl: './trading-partner.component.html',
  styleUrls: ['./trading-partner.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class TradingPartnerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('supplierPaginator', { static: false }) supplierPaginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below']
  parameterData: PeriodicElement[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.parameterData);
  customerNestedDataSource = customerNestedElementData;
  customerNestedDisplayedColumns: string[] = ['position', 'tpSiteName', 'tpSiteCode', 'tpSiteAddress1', 'activityBillingFlag', 'tpSiteEnabledFlag', 'action'];
  customerColumnsToDisplay = ['No', 'tpName', 'tpCode', 'tpAddress', 'tpEnabledFlag', 'action'];
  sppliersDataSource = new MatTableDataSource<PeriodicElement>(this.parameterData);
  supplierNestedDataSource = supplierNestedElementData;
  supplierNestedDisplayedColumns: string[] = ['position', 'tpSiteName', 'tpSiteCode', 'tpSiteAddress1', 'tpSiteEnabledFlag', 'action'];
  supplierColumnsToDisplay = ['No', 'tpName', 'tpCode', 'tpAddress', 'tpEnabledFlag', 'action'];
  expandedElement: PeriodicElement | null;
  listProgress = false;
  customerSiteMessage = '';
  supplierSiteMessage = '';
  disableAllBtn: any = false;


  public addNewRecord = false;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  showSearch = true;
  searchEnable: boolean;
  searchForType = 'Cust';
  tpCustMessage = '';
  tpSuppMessage = '';
  private searchInfoArrayunsubscribe: any;
  private searchArrayunsubscribe: any;
  selectedIndex = 0;
  screenMaxHeight: any;
  refreshSearchLov: any = '';
  is3plCompany = false;
  constructor(
    private tradingPartnerService: TradingPartnerService,
    private render: Renderer,
    private router: Router,
    private dialog: MatDialog,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.searchEnable = true;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.is3plCompany) {
        this.customerColumnsToDisplay = ['No', 'tpName', 'tpCode', 'tpAddress', 'activityBillingFlag', 'tpEnabledFlag', 'action'];
      }
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
    this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;


  }
  dataForSearchCustomer: any;
  dataForSearchSupplier: any;
  searchJsonForCustomer: any = this.http.get('./assets/search-jsons/tp-customer-search.json');
  searchJsonForSupplier: any = this.http.get('./assets/search-jsons/tp-supplier-search.json');
  ngOnInit() {
    this.searchJsonForCustomer.subscribe((data: any) => {
      this.dataForSearchCustomer = data;
      this.searchTP();
      this.searchForTP();
    });
    this.route.params.subscribe(params => {
      if (params.tpType === 'Customers') {
        this.tabChanged('Customers');
      }
      if (params.tpType === 'Suppliers') {
        this.tabChanged('Suppliers');
      }
    });
    this.commonService.getScreenSize(-30); 

    const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
    if (graphSearchData !== null) {
      if (graphSearchData.tpType === 'CUST') {
        this.selectedIndex = 0;
        this.searchCustomer(graphSearchData);
      }
      if (graphSearchData.tpType === 'SUPP') {
        this.selectedIndex = 1;
        this.searchSupplier(graphSearchData)
      }
      localStorage.removeItem('graphSearchData');
    }

  }

  searchForTP() {
    if (this.searchForType === 'Cust') {
      this.commonService.searhForMasters(this.dataForSearchCustomer);
    } else {
      this.searchJsonForSupplier.subscribe((data: any) => {
        this.dataForSearchSupplier = data;
        this.commonService.searhForMasters(this.dataForSearchSupplier);
      });
    }
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }
  tradingPartnerSiteAdd(rowData: any, type: string) {
    this.router.navigate(['tradingpartners/addTradingPartnerSite/' + type + '/' + rowData.tpId]);
  }
  tradingPartnerEdit(rowData: any, $event: any, type: string, tpType: string) {
    if (type === 'edit') {
      this.router.navigate(['tradingpartners/editTradingPartner/' + tpType + '/' + rowData.tpId]);
    }
    if (type === 'view') {
      this.disableAllBtn = true;
      setTimeout(() => { this.disableAllBtn = false; }, 1000);
      this.tradingPartnerService
        .getTpDetailsById(rowData.tpId)
        .subscribe((data: any) => {
          const dataResult = data.result[0];
          dataResult.tpEnabledFlag =
            dataResult.tpEnabledFlag === 'Y' ? true : false;
          dataResult.activityBillingFlag =
            dataResult.activityBillingFlag === 'Y' ? true : false;
          const dialogRef = this.dialog.open(
            // tslint:disable-next-line: no-use-before-declare
            TradingPartnerViewDialogComponent,
            {
              width: '70vw',
              data: dataResult
            }
          );
          dialogRef.afterClosed().subscribe(response => {
            console.log('The dialog was closed');
            if (response !== undefined) {
              this.router.navigate(['tradingpartners/editTradingPartner/' + tpType + '/' + response]);
            }
          });
        });
    }
  }
  tradingPartnerSiteEdit(rowData: any, $event: any, type: string, tpType: string) {
    if (type === 'edit') {
      this.router.navigate(['tradingpartners/editTradingPartnerSite/' + tpType + '/' + rowData.tpSiteId]);
    }
    if (type === 'view') {
      this.disableAllBtn = true;
      setTimeout(() => { this.disableAllBtn = false; }, 1000);
      this.tradingPartnerService
        .getTpSiteDetailsById(rowData.tpSiteId)
        .subscribe((data: any) => {
          console.log(data);
          const dataResult = data.result[0];
          dataResult.tpSiteEnabledFlag =
            dataResult.tpSiteEnabledFlag === 'Y' ? true : false;

          const dialogRef = this.dialog.open(
            // tslint:disable-next-line: no-use-before-declare
            TradingPartnerSiteViewDialogComponent,
            {
              width: '70vw',
              data: dataResult
            }
          );
          dialogRef.afterClosed().subscribe(response => {
            console.log('The dialog was closed');
            if (response !== undefined) {
              this.router.navigate(['tradingpartners/editTradingPartnerSite/' + tpType + '/' + response]);
            }
          });
        });
    }
  }
  customerDeleteRow(rowData: any, $event: any) {
    this.parameterData.shift();
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.parameterData);
    // this.dataSource.paginator = this.paginator;
  }

  addTradingPartner() {
    const tpType = this.selectedIndex === 0 ? 'Customers' : 'Suppliers'
    this.router.navigate(['tradingpartners/addTradingPartner/' + tpType]);
  }


  // Get All Sites By Passing Tranding Partner ID as Request Paramater
  getCustomerSitesByPartnerId(tpId: number) {
    this.customerSiteMessage = '';
    if (this.expandedElement != null) {
      customerNestedElementData = [];
      this.customerNestedDataSource = []
      this.tradingPartnerService.getAllSitesByTP(tpId).subscribe((result: any) => {
        if (!result.message) {
          for (const m of result.result) {
            m.tpSiteEnabledFlag = m.tpSiteEnabledFlag === 'Y' ? true : false;
            customerNestedElementData.push(m);
          }
        } else {
          this.customerSiteMessage = result.message;
        }
        // Updating the data
        this.customerNestedDataSource = customerNestedElementData;
      });
    }
  }

  getSupplierSitesByPartnerId(tpId: number) {
    this.supplierSiteMessage = '';
    if (this.expandedElement != null) {
      this.supplierNestedDataSource = [];
      supplierNestedElementData = [];

      this.tradingPartnerService.getAllSitesByTP(tpId).subscribe((result: any) => {
        if (!result.message) {
          for (const m of result.result) {
            m.tpSiteEnabledFlag = m.tpSiteEnabledFlag === 'Y' ? true : false;
            supplierNestedElementData.push(m);
          }
        } else {
          this.supplierSiteMessage = result.message;
        }
        // Updating the data
        this.supplierNestedDataSource = supplierNestedElementData;
      });
    }
  }
  tabChanged(tabChangeEvent: any) {
    if (tabChangeEvent === 'Customers') {
      this.selectedIndex = 0;
    }
    if (tabChangeEvent === 'Suppliers') {
      this.selectedIndex = 1;
    }
    if (tabChangeEvent.tab) {
      if (tabChangeEvent.tab.textLabel === 'Customers') {
        this.selectedIndex = 0;
      }
      if (tabChangeEvent.tab.textLabel === 'Suppliers') {
        this.selectedIndex = 1;
      }
    }
    this.customerNestedDataSource = [];
    this.supplierNestedDataSource = [];
    this.dataSource = new MatTableDataSource<
      PeriodicElement
    >([]);
    this.sppliersDataSource = new MatTableDataSource<
      PeriodicElement
    >([]);
    if (tabChangeEvent.index === 0) {
      this.searchForType = 'Cust';
      this.searchForTP();

      return;
    }
    if (tabChangeEvent.index === 1) {
      this.searchForType = 'Supp';
      this.searchForTP();

      return;
    }
    if (this.selectedIndex === 0) {
      this.searchForType = 'Cust';
      this.searchForTP();

      return;
    }
    if (this.selectedIndex === 1) {
      this.searchForType = 'Supp';
      this.searchForTP();

      return;
    }
    this.searchForTP();
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

  checkSearch() {
    let returnType: any = '';
    if (this.refreshSearchLov === 'refresh') {
      returnType = true;
      this.refreshSearchLov = '';
    } else {
      returnType = false;
    }
    return returnType;
  }

  searchTP() {
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((TPSearchInfo: any) => {
      const checksearchSource = this.checkSearch();
      if (checksearchSource === true) {
        return;
      }
      if (TPSearchInfo.searchType === 'tpCust') {
        this.searchCustomer(TPSearchInfo.searchArray);
      }
      if (TPSearchInfo.searchType === 'tpSupp') {
        this.searchSupplier(TPSearchInfo.searchArray)
      }
    });
  }

  searchCustomer(data) {
    this.listProgress = true;
    this.parameterData = [];
    this.dataSource = new MatTableDataSource<
      PeriodicElement
    >(this.parameterData);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
    this.tradingPartnerService
      .getTPSearch(data)
      .subscribe(
        (data: any) => {
          this.listProgress = false;
          if (data.status === 200) {
            if (!data.message) {
              this.parameterData = [];
              let num = 1;
              for (const rowData of data.result) {
                if (rowData.tpType === 'CUST') {
                  this.parameterData.push({
                    No: this.paginator.pageSize * this.paginator.pageIndex + num++,
                    tpId: rowData.tpId,
                    tpName: rowData.tpName,
                    tpCode: rowData.tpCode,
                    tpAddress: rowData.tpAddress1,
                    tpEnabledFlag: rowData.tpEnabledFlag === 'Y' ? true : false,
                    activityBillingFlag: rowData.activityBillingFlag === 'Y' ? true : false
                  })
                }
              }
              console.log('mat- table' + this.parameterData);
              this.dataSource = new MatTableDataSource<PeriodicElement>(this.parameterData);
              this.dataSource.paginator = this.paginator;
              setTimeout(() => {
                this.paginator.pageSizeOptions = this.commonService.paginationArray;
                this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
              }, 100);

            } else {
              this.tpCustMessage = data.message;
            }
          }
        },
        (error: any) => {
          this.listProgress = false;
          // alert(error.error.message);
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );

  }

  searchSupplier(data) {
    this.listProgress = true;
    this.parameterData = [];
    this.sppliersDataSource = new MatTableDataSource<
      PeriodicElement
    >(this.parameterData);
    this.sppliersDataSource.paginator = this.supplierPaginator;
    this.tradingPartnerService
      .getTPSearch(data)
      .subscribe(
        (data: any) => {
          this.listProgress = false;
          if (data.status === 200) {
            if (!data.message) {
              this.parameterData = [];
              let suppNum = 1;
              for (const rowData of data.result) {
                if (rowData.tpType === 'SUPP') {
                  this.parameterData.push({
                    No: this.paginator.pageSize * this.paginator.pageIndex + suppNum++,
                    tpId: rowData.tpId,
                    tpName: rowData.tpName,
                    tpCode: rowData.tpCode,
                    tpAddress: rowData.tpAddress1,
                    tpEnabledFlag: rowData.tpEnabledFlag === 'Y' ? true : false

                  })
                }
              }
              this.sppliersDataSource = new MatTableDataSource<PeriodicElement>(this.parameterData);
              this.sppliersDataSource.paginator = this.supplierPaginator;
              this.supplierPaginator.pageSizeOptions = this.commonService.paginationArray;
              this.supplierPaginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10)

            } else {
              this.tpSuppMessage = data.message;
            }
          }
        },
        (error: any) => {
          this.listProgress = false;
          // alert(error.error.message);
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );

  }

  ngOnDestroy() {
    this.searchInfoArrayunsubscribe
      ? this.searchInfoArrayunsubscribe.unsubscribe()
      : '';

    // this.refreshSearchLov = '';
    this.commonService.getsearhForMasters([]);
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.getScreenSize(-30); 
  }  
}

// Trading Partner View Dialog Component
@Component({
  selector: 'app-trading-partner-view-dialog',
  templateUrl: './trading-partner-view-dialog.component.html'
})
export class TradingPartnerViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TradingPartnerViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
// Trading Partner Site View Dialog Component
@Component({
  selector: 'app-trading-partner-site-view-dialog',
  templateUrl: './trading-partner-site-view-dialog.component.html'
})
export class TradingPartnerSiteViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TradingPartnerSiteViewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
