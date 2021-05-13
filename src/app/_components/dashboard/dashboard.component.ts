import { Component, OnInit,  AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { CommonService } from 'src/app/_services/common/common.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'
// import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { StringResources } from 'src/app/_services/stringResources';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit,  AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;

  public previousLocation: any = 'fromLogin';
  public dashboardUrl: any = '';
  currentDashboard: any = ''
  dashboardGraphTImer:any =  null;


 
  pendingReceiptsChart: any = null;
  pendingPutawayChart: any = null;
  pendingQCReceiptsChart: any = null;
  pendingReplenishmentChart: any = null;
  pendingCycleCountChart: any = null;
  subInventoryBarChart: any = null;
  usersBarChart: any = null;
  activeItemsCategoriesChart: any = null;
  activeTPCustomerChart: any = null;
  activeTPSupplierChart: any = null;
  activeItemsChart: any = null;
  pendingPickReleaseChart: any = null;
  pendingPickReleaseUserChart: any = null;
  pendingPickReleaseLgChart: any = null;
  pendingShipConfirmChart: any = null;
  onhandStockLGBarChart: any = null;
  lpnControlledLGChart: any = null;


  pendingReceiptsData: any = {};
  pendingPutawayData: any = {};
  pendingQCReceiptsData: any = {};
  pendingReplenishmentChartData: any = {};
  pendingCycleCountChartData: any = {};
  subInventoryBarChartData: any = {};
  usersBarChartData: any = {};
  activeItemsCategoriesData: any = {};
  activeTPCustomerChartData: any = {};
  activeTPSupplierChartData: any = {};
  activeItemsData: any = {};
  pendingPickReleaseChartData: any = {};
  pendingPickReleaseUserChartData: any = {};
  pendingPickReleaseLgChartData: any = {};
  pendingShipConfirmChartData: any = {};
  onhandStockLGBarChartData: any = {};
  lpnControlledLGChartData: any = {};
  iuObservable: any = {};


  // reportArray: any = ['Pick Slip','Wave Inquiry Report', 'PO Receiving Report', 'ASN Receiving Report'];
  // reportArray: any = ['Wave Inquiry Report'];
  // reportList: any = true;

  // title = 'Report Viewer';
  // viewerContainerStyle = {
  //     position: 'absolute',
  //     left: '0px',
  //     right: '0px',
  //     top: '0px',
  //     bottom: '0px',
  //     width: '100%',
  //     height: '100%',
  //     overflow: 'scroll',
  //     clear: 'both',
  //     ['font-family']: 'ms sans serif'
  // };

  // reportSource: any = '';
  // @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;

  constructor(location: PlatformLocation,
    private router: Router,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private commonService: CommonService
    ) {
    location.onPopState(() => {
       if(window.location.href.indexOf('dashboard') !== -1){
          history.pushState(null, null, window.location.href) 
        }
        
        if(this.getPreviousLocation() === 'fromLogin'){          
          window.history.forward();          
          return;
        } 
        this.setPreviousLocation();
    });
    

  }

  ngOnInit() {
    document.cookie = 'username' + '=' + JSON.parse(localStorage.getItem('userDetails')).userEmail + ';path=/';
    // this.currentDashboard = localStorage.getItem('currentModule');
    this.currentDashboard = 'Master';
    this.iuObservable  = this.dashboardService.defaultIuDataObservable.subscribe((data: any) => { 
        this.getDashboardData();
    });
  }

  ngAfterViewInit() {
    am4core.useTheme(am4themes_animated);
    this.getDashboardData();
    this.dashboardGraphTImer = Observable.interval(120000).subscribe((val) => { 
      this.getDashboardData();
    });
  
  }

  onTabChanged(event:any){
    if(event && event.tab.textLabel === 'Master'){
      this.currentDashboard = 'Master';
    }

    if(event && event.tab.textLabel === 'Inbound'){
      this.currentDashboard = 'Inbound';
    }

    if(event && event.tab.textLabel === 'Warehouse'){
      this.currentDashboard = 'Warehouse';
    }

    if(event && event.tab.textLabel === 'Outbound'){
      this.currentDashboard = 'Outbound';
    }

    if(event && event.tab.textLabel === 'Transactions'){
      this.currentDashboard = 'Transactions';
    }

    // if(event && event.tab.textLabel === 'Reports'){
    //   this.reportList = true;
    //   this.currentDashboard = 'Reports';
    // }

    this.getDashboardData();


  }

  // ready(){ 
  // }

  // viewerToolTipOpening(e: any, args: any){
      
  // }

  // loadReport(reportName){
  //   this.reportList = false;
  //   setTimeout(() => {
  //     const language = navigator.language;
  //     let resources = StringResources.english; // Default.
  //     if (language === 'ja-JP') { resources = StringResources.japanese;}
  //     this.viewer.viewerObject.stringResources = Object.assign(this.viewer.viewerObject.stringResources, resources);
  //     if( reportName === 'Wave Inquiry Report'){
  //       this.reportSource = {
  //         report: 'Wave Inquiry Report.trdp',
  //         parameters: {}
  //       };
  //     }
  //     if( reportName === 'Pick Slip'){
  //         this.reportSource = {
  //           report: 'PackingSlipBackup.trdp',
  //           parameters: {PickSlip:1619}
  //         };
  //     }
  //     if( reportName === 'PO Receiving Report'){
  //       this.reportSource = {
  //         report: 'PO_Receiving_Report.trdp',
  //         parameters: {PickSlip:1619}
  //       };
  //     }
  //     if( reportName === 'ASN Receiving Report'){
  //       this.reportSource = {
  //         report: 'ASN_Receiving_Report.trdp',
  //         parameters: {PickSlip:1619}
  //       };
  //     }
  //     this.viewer.setReportSource(this.reportSource)
  //     this.viewer.refreshReport()
  //   }, 2000);
    
  // }

  // backToReports(){
  //   this.reportList = true;
  // }

  setPreviousLocation(){
    this.previousLocation = window.location.href;
  }

  getPreviousLocation(){
    return this.previousLocation;
  }

  getDashboardUrl(){
    return this.dashboardUrl;
  }
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });

  }

  getDashboardData(){
    this.destroyGraph();
    if(this.currentDashboard === 'Master'){
        this.dashboardService.getChartDataMaster().subscribe(
          (data: any) => {
              if (data.result) {
                this.renderMasterData(data.result);
              }
          },
          (error: any) => {              
              this.openSnackBar(error.error.message, '', 'error-snackbar');
          }
        );
    }
    if(this.currentDashboard === 'Inbound'){
      this.dashboardService.getChartDataInbound().subscribe(
          (data: any) => {
              if (data.result) {
                this.renderInboundData(data.result);
              }
          },
          (error: any) => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
          }
        );
    }
    if(this.currentDashboard === 'Warehouse'){
      this.dashboardService.getChartDataWarehouse().subscribe(
        (data: any) => {
            if (data.result) {
              this.renderWarehouseData(data.result); 
            }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
    }
    if(this.currentDashboard === 'Outbound'){
      this.dashboardService.getChartDataOutbound().subscribe(
        (data: any) => {
            if (data.result) {
              this.renderOutboundData(data.result); 
            }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
    }
  
    if(this.currentDashboard === 'LabelSetup'){
      
    }
    if(this.currentDashboard === 'Transactions'){
      this.dashboardService.getChartDataTransactions().subscribe(
        (data: any) => {
            if (data.result) {
              this.renderTransactionData(data.result); 
            }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
    }
  }

  renderMasterData(data){
    for (const rowData of data) {
      if( rowData.module === 'Active_Items_Categories'){
          this.activeItemsCategoriesData.data = [{
            name: 'Active Count',
            value: rowData.activeCount,
            color: am4core.color('#098CCD')
          }, {
            name: 'Inactive Count',
            value: rowData.inactiveCount,
            color: am4core.color('#FFD150')
          }];
           
          this.activeItemsCategoriesData.grandTotal = rowData.totalCount
      }
      if( rowData.module === 'Active_Trading_Partners_Supplier'){
          this.activeTPSupplierChartData.data = [{
            name: 'Active Count',
            value: rowData.activeCount,
            color: am4core.color('#159333')
          }, {
            name: 'Inactive Count',
            value: rowData.inactiveCount,
            color: am4core.color('#098CCD')
          }];  
          this.activeTPSupplierChartData.grandTotal = rowData.totalCount
      } 
      if( rowData.module === 'Active_Trading_Partners_Customer'){
        this.activeTPCustomerChartData.data = [{
          name: 'Active Count',
          value: rowData.activeCount,
          color: am4core.color('#7982B9')
        }, {
          name: 'Inactive Count',
          value: rowData.inactiveCount,
          color: am4core.color('#A5C1DC')
        }];  
        this.activeTPCustomerChartData.grandTotal = rowData.totalCount
    } 
      if(rowData.module === 'Active_Items'){
          this.activeItemsData.data = [{
            name: 'Active Count',
            value: rowData.activeCount,
            color: am4core.color('#A5C1DC')
          }, {
            name: 'Inactive Count',
            value: rowData.inactiveCount,
            color: am4core.color('#566D44')
          }];
          this.activeItemsData.grandTotal = rowData.totalCount
        }
    }
    this.activeItemsCategories();
    this.activeTPCustomer();
    this.activeTPSuppliers();
    this.activeItems();
  }

  renderInboundData(data){
    for (const rowData of data) {
      if( rowData.module === 'Pending_Putaway'){
        this.pendingPutawayData.data = [{
          name: 'Pending',
          value: rowData.pending,
          color: am4core.color('orange')
        }, {
          name: 'Complete',
          value: rowData.completed,
          color: am4core.color('lightblue')
        }, {
          name: 'Total for Day',
          value: rowData.totalDay,
          color: am4core.color('green')
        }]; 
        this.pendingPutawayData.grandTotal = rowData.grandTotal;

      }
      if( rowData.module === 'Pending_QC_Receipts'){
        this.pendingQCReceiptsData.data = [{
          name: 'Pending',
          value: rowData.pending,
          color: am4core.color('#7982B9')
        }, {
          name: 'Complete',
          value: rowData.completed,
          color: am4core.color('#FFC154')
        }, {
          name: 'Total for Day',
          value: rowData.totalDay,
          color: am4core.color('#47B39C')
        }]; 
        this.pendingQCReceiptsData.grandTotal = rowData.grandTotal;
      }
      if( rowData.module === 'Pending_Receipts'){
        this.pendingReceiptsData.data = [{
          name: 'Pending',
          value: rowData.pending,
          color: am4core.color('#7982B9')
        }, {
          name: 'Complete',
          value: rowData.completed,
          color: am4core.color('#A5C1DC')
        }, {
          name: 'Total for Day',
          value: rowData.totalDay,
          color: am4core.color('#E9F6FA')
        }];
      }
    }
    this.pendingReceipts();
    this.pendingPutaway();
    this.pendingQCReceipts();
  }

  renderWarehouseData(data){
    for (const rowData of data) {
      if( rowData.module === 'Pending_Replenishment_Task'){
          this.pendingReplenishmentChartData.data = [{
            name: 'Pending',
            value: rowData.pending,
            color: am4core.color('#7982B9')
          }, {
            name: 'Complete',
            value: rowData.completed,
            color: am4core.color('#A5C1DC')
          }, {
            name: 'Total for Day',
            value: rowData.totalDay,
            color: am4core.color('#E9F6FA')
          }];
          this.pendingReplenishmentChartData.grandTotal = rowData.grandTotal;
      }
      if( rowData.module === 'Pending_Cycle_Count_Task'){
          this.pendingCycleCountChartData.data = [{
            name: 'Pending',
            value: rowData.pending,
            color: am4core.color('#7982B9')
          }, {
            name: 'Complete',
            value: rowData.completed,
            color: am4core.color('#A5C1DC')
          }, {
            name: 'Total for Day',
            value: rowData.totalDay,
            color: am4core.color('#E9F6FA')
          }];
          this.pendingCycleCountChartData.grandTotal = rowData.grandTotal;
      } 
      if(rowData.module === 'Number_of_Task_User_Wise'){
          for (const rowData1 of rowData.user){
            rowData1.color = am4core.color('#73D2DE')
          }
          this.usersBarChartData.data = rowData.user;
      }
      if(rowData.module === 'Number_of_Task_LG_Wise'){
        for (const rowData1 of rowData.Lg){
          rowData1.color = am4core.color('#73D2DE')
        }
        this.subInventoryBarChartData.data = rowData.Lg;
      }
    }
    this.pendingReplenisment();
    this.pendingCycleCount();
    this.getSubInventoryBarChart();
    this.getUsersBarChart();
  }

  renderTransactionData(data){
    for (const rowData of data) {
      if(rowData.module === 'LPN_CNTRL_LG'){
          for (const rowData1 of rowData.Lg){
            rowData1.color = rowData1.count === 'Y' ? am4core.color('green'): am4core.color('red')
            rowData1.Enabled = rowData1.count === 'Y' ? 1 : 0
          }
           
          this.lpnControlledLGChartData.data = rowData.Lg;
      }
      if(rowData.module === 'Onhand_Stock_LG_Wise'){
        for (const rowData1 of rowData.LgOnhandStock){
          rowData1.color = am4core.color('#73D2DE');
        }
        this.onhandStockLGBarChartData.data = rowData.LgOnhandStock;
      }
    }
    this.onhandStockLG();
    //this.lpnControlledLG();
  
  }

  renderOutboundData(data){
    for (const rowData of data) {
      if( rowData.module === 'Pending_Ship_Confirm'){
        this.pendingShipConfirmChartData.data = [{
          name: 'Pending',
          value: rowData.pending,
          color: am4core.color('#7982B9')
        }, {
          name: 'Complete',
          value: rowData.completed,
          color: am4core.color('#EE9944')
        }, {
          name: 'Total for Day',
          value: rowData.totalDay,
          color: am4core.color('#99BB55')
        }];
        this.pendingShipConfirmChartData.grandTotal = rowData.grandTotal;
      } 
      if( rowData.module === 'Pending_Pick_Release'){
          this.pendingPickReleaseChartData.data = [{
            name: 'Pending',
            value: rowData.pending,
            color: am4core.color('#EE9944')
          }, {
            name: 'Complete',
            value: rowData.completed,
            color: am4core.color('#098CCD')
          }, {
            name: 'Total for Day',
            value: rowData.totalDay,
            color: am4core.color('#99BB55')
          }];
          this.pendingPickReleaseChartData.grandTotal = rowData.grandTotal;
      } 
      if(rowData.module === 'Pending_Pick_Release'){
          for (const rowData1 of rowData.user){
            rowData1.color = am4core.color('#73D2DE')
          }
          this.pendingPickReleaseUserChartData.data = rowData.user;
      }
      if(rowData.module === 'Pending_Pick_Release'){
        for (const rowData1 of rowData.Lg){
          rowData1.color = am4core.color('#73D2DE')
        }
        this.pendingPickReleaseLgChartData.data = rowData.Lg;
      }
    }
      this.pendingPickRelease();
      this.pendingPickReleaseUser();
      this.pendingPickReleaseLg();
      this.pendingShipConfirm();
  }
  
  gotoNavigation(data, type){
    let searchData : any = null
    if(data.name === 'Active Count' && type === 'activeItems'){
      searchData = {itemEnabledFlag:'Y'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'items', routeTitle: 'Items'} ) );
    }
    if(data.name === 'Inactive Count' && type === 'activeItems'){
      searchData = {itemEnabledFlag:'N'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'items', routeTitle: 'Items'} ) );
    }
    if(data.name === 'Active Count' && type === 'activeItemsCategories'){
      searchData = {categoryEnabledFlag:'Y'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'category', routeTitle: 'Category'} ) );
    }
    if(data.name === 'Inactive Count' && type === 'activeItemsCategories'){
      searchData = {categoryEnabledFlag:'N'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'category', routeTitle: 'Category'} ) );
      }
    if(data.name === 'Active Count' && type === 'activeTPCustomer'){
      searchData = {tpCompanyId:'121',tpType:'CUST',tpEnabledFlag:'Y'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'tradingpartners', routeTitle: 'Trading Partner'} ) );
    }
    if(data.name === 'Inactive Count' && type === 'activeTPCustomer'){
      searchData = {tpCompanyId:'121',tpType:'CUST',tpEnabledFlag:'N'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'tradingpartners', routeTitle: 'Trading Partner'} ) );
    }
    if(data.name === 'Active Count' && type === 'activeTPSupplier'){
      searchData = {tpCompanyId:'121',tpType:'SUPP',tpEnabledFlag:'Y'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'tradingpartners', routeTitle: 'Trading Partner'} ) );
    }
    if(data.name === 'Inactive Count' && type === 'activeTPSupplier'){
      searchData = {tpCompanyId:'121',tpType:'SUPP',tpEnabledFlag:'N'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'tradingpartners', routeTitle: 'Trading Partner'} ) );
    }
    if(type === 'warehouseSubInventory'){
      searchData = {sourceLgId: data.name};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(type === 'warehouseUsers'){
      searchData = {userName: data.name};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(type === 'outboundSubInventory'){
      searchData = {sourceLgId: data.name};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(type === 'outboundUsers'){
      searchData = {userName: data.name};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingReplenishment'){
      searchData = {taskStatus:'NEW',taskType:'REPL'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingReplenishment'){
      searchData = {taskStatus:'COMPLETED',taskType:'REPL'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingCycleCount'){
      searchData = {taskStatus:'NEW',taskType:'CC'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingCycleCount'){
      searchData = {taskStatus:'COMPLETED',taskType:'CC'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'task', routeTitle: 'Task'} ) );
    }
    if( type === 'onhandLgWise'){
      searchData = { stockLocation :'INVENTORY',lgCode: data.name };
      localStorage.setItem('graphSearchData', JSON.stringify({searchArray : searchData} ) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'onhand', routeTitle: 'Onhand'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingPickRelease'){
      searchData = { waveIuId :'1070', waveStatus :'PNDNG'}
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'wave', routeTitle: 'Wave Planning'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingPickRelease'){
      searchData = { waveIuId :'1070', waveStatus :'RLSD'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'wave', routeTitle: 'Wave Planning'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingShipConfirm'){
      searchData = { shipmentStatus :'NEW'}
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'shipment', routeTitle: 'Shipment'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingShipConfirm'){
      searchData = { shipmentStatus :'SHIPPED'}
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'shipment', routeTitle: 'Shipment'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingReceipt'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingReceipt'){
      searchData = {txnType:'RECEIVE', txnSourceType :'PO', txnIuId :'1070'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'transactions', routeTitle: 'Transaction Inquiry'} ) );
    }
    if(data.name === 'Total for Day' && type === 'pendingReceipt'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingPutaway'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingPutaway'){
      searchData = {txnType:'PUTAWAY', txnSourceType :'PO', txnIuId :'1070'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'transactions', routeTitle: 'Transaction Inquiry'} ) );
    }
    if(data.name === 'Total for Day' && type === 'pendingPutaway'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
    if(data.name === 'Pending' && type === 'pendingQCReceipts'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
    if(data.name === 'Complete' && type === 'pendingQCReceipts'){
      searchData = {txnType:'INSPECT', txnSourceType :'PO', txnIuId :'1070'};
      localStorage.setItem('graphSearchData', JSON.stringify(searchData) );
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'transactions', routeTitle: 'Transaction Inquiry'} ) );
    }
    if(data.name === 'Total for Day' && type === 'pendingQCReceipts'){
      localStorage.setItem('graphRouting', JSON.stringify({ routeKey : 'purchaseorder', routeTitle: 'Purchase Order'} ) );
    }
  
  }


  pendingReceipts(){
    this.pendingReceiptsChart = am4core.create('pendingReceiptsChart', am4charts.PieChart3D);
    this.pendingReceiptsChart.data = this.pendingReceiptsData.data

    const pieSeries = this.pendingReceiptsChart.series.push(new am4charts.PieSeries3D());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingReceiptsChart.innerRadius = am4core.percent(0);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingReceipt');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingReceiptsChart.exporting.menu = new am4core.ExportMenu();

    this.pendingReceiptsChart.legend = new am4charts.Legend();
    this.pendingReceiptsChart.legend.useDefaultMarker = true;
    const marker = this.pendingReceiptsChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingReceiptsChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = '';
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingReceiptsChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg';
    this.pendingReceiptsChart.logo.height = -15000;

  }

  pendingPutaway(){
    this.pendingPutawayChart = am4core.create('pendingPutawayChart', am4charts.PieChart3D);
    this.pendingPutawayChart.data = this.pendingPutawayData.data

    const pieSeries = this.pendingPutawayChart.series.push(new am4charts.PieSeries3D());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingPutawayChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingPutaway');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingPutawayChart.exporting.menu = new am4core.ExportMenu();

    this.pendingPutawayChart.legend = new am4charts.Legend();
    this.pendingPutawayChart.legend.useDefaultMarker = true;
    const marker = this.pendingPutawayChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingPutawayChart.legend.valueLabels.template.text = '';
    
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingPutawayData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingPutawayChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingPutawayChart.logo.height = -15000;

  }

  pendingQCReceipts(){
    this.pendingQCReceiptsChart = am4core.create('pendingQCReceiptsChart', am4charts.PieChart);
    this.pendingQCReceiptsChart.data = this.pendingQCReceiptsData.data

    const pieSeries = this.pendingQCReceiptsChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingQCReceiptsChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingQCReceipts');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingQCReceiptsChart.exporting.menu = new am4core.ExportMenu();

    this.pendingQCReceiptsChart.legend = new am4charts.Legend();
    this.pendingQCReceiptsChart.legend.useDefaultMarker = true;
    const marker = this.pendingQCReceiptsChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingQCReceiptsChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingQCReceiptsData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingQCReceiptsChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingQCReceiptsChart.logo.height = -15000;
  }

  pendingReplenisment(){
    this.pendingReplenishmentChart = am4core.create('pendingReplenishmentChart', am4charts.PieChart);
    this.pendingReplenishmentChart.data = this.pendingReplenishmentChartData.data

    const pieSeries = this.pendingReplenishmentChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingReplenishmentChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingReplenishment');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingReplenishmentChart.exporting.menu = new am4core.ExportMenu();

    this.pendingReplenishmentChart.legend = new am4charts.Legend();
    this.pendingReplenishmentChart.legend.useDefaultMarker = true;
    const marker = this.pendingReplenishmentChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingReplenishmentChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingReplenishmentChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingReplenishmentChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingReplenishmentChart.logo.height = -15000;
  }

  pendingCycleCount(){
    this.pendingCycleCountChart = am4core.create('pendingCycleCountChart', am4charts.PieChart);
    this.pendingCycleCountChart.data = this.pendingCycleCountChartData.data

    const pieSeries = this.pendingCycleCountChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingCycleCountChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingCycleCount');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingCycleCountChart.exporting.menu = new am4core.ExportMenu();

    this.pendingCycleCountChart.legend = new am4charts.Legend();
    this.pendingCycleCountChart.legend.useDefaultMarker = true;
    const marker = this.pendingCycleCountChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingCycleCountChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingCycleCountChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingCycleCountChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingCycleCountChart.logo.height = -15000;
  }

  activeItemsCategories(){
    this.activeItemsCategoriesChart = am4core.create('activeItemsCategoriesChart', am4charts.PieChart);
    this.activeItemsCategoriesChart.data = this.activeItemsCategoriesData.data

    const pieSeries = this.activeItemsCategoriesChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.activeItemsCategoriesChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'activeItemsCategories');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.activeItemsCategoriesChart.exporting.menu = new am4core.ExportMenu();

    this.activeItemsCategoriesChart.legend = new am4charts.Legend();
    this.activeItemsCategoriesChart.legend.useDefaultMarker = true;
    const marker = this.activeItemsCategoriesChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.activeItemsCategoriesChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.activeItemsCategoriesData.grandTotal);
        label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.activeItemsCategoriesChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.activeItemsCategoriesChart.logo.height = -15000;
  }

  activeTPCustomer(){
    this.activeTPCustomerChart = am4core.create('activeTPCustomerChart', am4charts.PieChart);
    this.activeTPCustomerChart.data = this.activeTPCustomerChartData.data

    const pieSeries = this.activeTPCustomerChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.activeTPCustomerChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'activeTPCustomer');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.activeTPCustomerChart.exporting.menu = new am4core.ExportMenu();

    this.activeTPCustomerChart.legend = new am4charts.Legend();
    this.activeTPCustomerChart.legend.useDefaultMarker = true;
    const marker = this.activeTPCustomerChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.activeTPCustomerChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.activeTPCustomerChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.activeTPCustomerChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.activeTPCustomerChart.logo.height = -15000;
  }

  activeTPSuppliers(){
    this.activeTPSupplierChart = am4core.create('activeTPSupplierChart', am4charts.PieChart);
    this.activeTPSupplierChart.data = this.activeTPSupplierChartData.data

    const pieSeries = this.activeTPSupplierChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.activeTPSupplierChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'activeTPSupplier');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.activeTPSupplierChart.exporting.menu = new am4core.ExportMenu();

    this.activeTPSupplierChart.legend = new am4charts.Legend();
    this.activeTPSupplierChart.legend.useDefaultMarker = true;
    const marker = this.activeTPSupplierChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.activeTPSupplierChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.activeTPSupplierChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.activeTPSupplierChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.activeTPSupplierChart.logo.height = -15000;
  }

  activeItems(){
    this.activeItemsChart = am4core.create('activeItemsChart', am4charts.PieChart);
    this.activeItemsChart.data = this.activeItemsData.data

    const pieSeries = this.activeItemsChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.activeItemsChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'activeItems');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.activeItemsChart.exporting.menu = new am4core.ExportMenu();

    this.activeItemsChart.legend = new am4charts.Legend();
    this.activeItemsChart.legend.useDefaultMarker = true;
    const marker = this.activeItemsChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.activeItemsChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.activeItemsData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.activeItemsChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.activeItemsChart.logo.height = -15000;
  }

  getSubInventoryBarChart(){
    this.subInventoryBarChart = am4core.create('subInventoryBarChart', am4charts.XYChart);
    this.subInventoryBarChart.data =  this.subInventoryBarChartData.data
    this.subInventoryBarChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.subInventoryBarChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Locator Groups';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.subInventoryBarChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.subInventoryBarChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'name';
    series.name = 'count';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    this.subInventoryBarChart.cursor = new am4charts.XYCursor();
    this.subInventoryBarChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'warehouseSubInventory');
    },this);
    this.subInventoryBarChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
    
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
  
    this.subInventoryBarChart.logo.height = -15000;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return target.dataItem ? this.subInventoryBarChart.colors.getIndex(target.dataItem.index) : fill;
    });
    
    const fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0, 1, 1, 0];
    fillModifier.offsets = [0, 0.45, 0.55, 1];
    fillModifier.gradient.rotation = 90;
    series.columns.template.fillModifier = fillModifier;

  }

  getUsersBarChart(){
    this.usersBarChart = am4core.create('usersBarChart', am4charts.XYChart);
    this.usersBarChart.data =  this.usersBarChartData.data
    this.usersBarChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.usersBarChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Users';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.usersBarChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.usersBarChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'name';
    series.name = 'count';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    this.usersBarChart.cursor = new am4charts.XYCursor();
    this.usersBarChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'warehouseUsers');
    },this);
    this.usersBarChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
    
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
  
    this.usersBarChart.logo.height = -15000;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return target.dataItem ? this.usersBarChart.colors.getIndex(target.dataItem.index) : fill;
    });
    
    const fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0, 1, 1, 0];
    fillModifier.offsets = [0, 0.45, 0.55, 1];
    fillModifier.gradient.rotation = 90;
    series.columns.template.fillModifier = fillModifier;

  }

  pendingPickRelease(){
    this.pendingPickReleaseChart = am4core.create('pendingPickReleaseChart', am4charts.PieChart);
    this.pendingPickReleaseChart.data = this.pendingPickReleaseChartData.data

    const pieSeries = this.pendingPickReleaseChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingPickReleaseChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingPickRelease');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingPickReleaseChart.exporting.menu = new am4core.ExportMenu();

    this.pendingPickReleaseChart.legend = new am4charts.Legend();
    this.pendingPickReleaseChart.legend.useDefaultMarker = true;
    const marker = this.pendingPickReleaseChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingPickReleaseChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingPickReleaseChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingPickReleaseChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingPickReleaseChart.logo.height = -15000;
  }

  pendingPickReleaseUser(){
    this.pendingPickReleaseUserChart = am4core.create('pendingPickReleaseUserChart', am4charts.XYChart);
    this.pendingPickReleaseUserChart.data =  this.pendingPickReleaseUserChartData.data
    this.pendingPickReleaseUserChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.pendingPickReleaseUserChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Users';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.pendingPickReleaseUserChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.pendingPickReleaseUserChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'name';
    series.name = 'count';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    this.pendingPickReleaseUserChart.cursor = new am4charts.XYCursor();
    this.pendingPickReleaseUserChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'outboundUsers');
    },this);
    this.pendingPickReleaseUserChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
    
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
  
    this.pendingPickReleaseUserChart.logo.height = -15000;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return target.dataItem ? this.pendingPickReleaseUserChart.colors.getIndex(target.dataItem.index) : fill;
    });
    
    const fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0, 1, 1, 0];
    fillModifier.offsets = [0, 0.45, 0.55, 1];
    fillModifier.gradient.rotation = 90;
    series.columns.template.fillModifier = fillModifier;
  }

  pendingPickReleaseLg(){
    this.pendingPickReleaseLgChart = am4core.create('pendingPickReleaseLgChart', am4charts.XYChart);
    this.pendingPickReleaseLgChart.data =  this.pendingPickReleaseLgChartData.data
    this.pendingPickReleaseLgChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.pendingPickReleaseLgChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Locator Groups';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.pendingPickReleaseLgChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.pendingPickReleaseLgChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'name';
    series.name = 'count';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    this.pendingPickReleaseLgChart.cursor = new am4charts.XYCursor();
    this.pendingPickReleaseLgChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'outboundSubInventory');
    },this);
    this.pendingPickReleaseLgChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
    
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
  
    this.pendingPickReleaseLgChart.logo.height = -15000;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return target.dataItem ? this.pendingPickReleaseLgChart.colors.getIndex(target.dataItem.index) : fill;
    });
    
    const fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0, 1, 1, 0];
    fillModifier.offsets = [0, 0.45, 0.55, 1];
    fillModifier.gradient.rotation = 90;
    series.columns.template.fillModifier = fillModifier;
  }

  pendingShipConfirm(){
    this.pendingShipConfirmChart = am4core.create('pendingShipConfirmChart', am4charts.PieChart);
    this.pendingShipConfirmChart.data = this.pendingShipConfirmChartData.data

    const pieSeries = this.pendingShipConfirmChart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    this.pendingShipConfirmChart.innerRadius = am4core.percent(40);
    pieSeries.slices.template.stroke = am4core.color('#4a2abb');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'pendingShipConfirm');
    },this);
    pieSeries.slices.template.stroke = am4core.color('#ffffff00');
    this.pendingShipConfirmChart.exporting.menu = new am4core.ExportMenu();

    this.pendingShipConfirmChart.legend = new am4charts.Legend();
    this.pendingShipConfirmChart.legend.useDefaultMarker = true;
    const marker = this.pendingShipConfirmChart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('red');
    this.pendingShipConfirmChart.legend.valueLabels.template.text = '';
    pieSeries.slices.template.tooltipText = '{name}: {value}';

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const label = pieSeries.createChild(am4core.Label);
    label.text = String(this.pendingShipConfirmChartData.grandTotal);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 16;
    label.fontWeight = 'bold';
    this.pendingShipConfirmChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
    this.pendingShipConfirmChart.logo.height = -15000;
  }

  onhandStockLG(){
    this.onhandStockLGBarChart = am4core.create('onhandStockLGBarChart', am4charts.XYChart);
    this.onhandStockLGBarChart.data =  this.onhandStockLGBarChartData.data
    this.onhandStockLGBarChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.onhandStockLGBarChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Locator Group';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.onhandStockLGBarChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.onhandStockLGBarChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'name';
    series.name = 'count';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    this.onhandStockLGBarChart.cursor = new am4charts.XYCursor();
    this.onhandStockLGBarChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext,'onhandLgWise');
    },this);
    this.onhandStockLGBarChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
    
    series.tooltip.pointerOrientation = 'vertical';
    series.columns.template.column.cornerRadiusTopLeft = 2;
    series.columns.template.column.cornerRadiusTopRight = 2;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
  
    this.onhandStockLGBarChart.logo.height = -15000;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return target.dataItem ? this.onhandStockLGBarChart.colors.getIndex(target.dataItem.index) : fill;
    });
    
    const fillModifier = new am4core.LinearGradientModifier();
    fillModifier.brightnesses = [0, 1, 1, 0];
    fillModifier.offsets = [0, 0.45, 0.55, 1];
    fillModifier.gradient.rotation = 90;
    series.columns.template.fillModifier = fillModifier;
  
  }

  lpnControlledLG(){
    this.lpnControlledLGChart = am4core.create('lpnControlledLGChart', am4charts.XYChart);
    this.lpnControlledLGChart.data =  this.lpnControlledLGChartData.data
    this.lpnControlledLGChart.scrollbarX = new am4core.Scrollbar();
    
    
    // Create axes
    const categoryAxis = this.lpnControlledLGChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.title.text = 'Locator Group';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 50;


    const  valueAxis = this.lpnControlledLGChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = '';
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    const series = this.lpnControlledLGChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'Enabled';
    series.dataFields.categoryX = 'name';
    series.name = 'Enabled LG';
    series.tooltipText = '{name}: [bold]{valueY}[/]';
    series.stacked = true;
    
    // Add cursor
    // this.lpnControlledLGChart.cursor = new am4charts.XYCursor();
    this.lpnControlledLGChart.exporting.menu = new am4core.ExportMenu();

    series.columns.template.events.on('hit', function(event) {
      this.gotoNavigation(event.target.dataItem._dataContext);
    },this);
    this.lpnControlledLGChart.exporting.menu.items[0].icon = 'assets/images/icons/download.svg'; 
   
     
    this.lpnControlledLGChart.logo.height = -15000;

    this.lpnControlledLGChart.legend = new am4charts.Legend();
    this.lpnControlledLGChart.legend.position = "top";
   
  
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.destroyGraph();
    this.dashboardGraphTImer ? this.dashboardGraphTImer.unsubscribe() : '';
    this.iuObservable && Object.keys(this.iuObservable).length ? this.iuObservable.unsubscribe() : '';
    

  }

  destroyGraph(){
    if(this.currentDashboard === 'Master'){
      this.activeTPSupplierChart ? this.activeTPSupplierChart.dispose() : '';
      this.activeTPCustomerChart ? this.activeTPCustomerChart.dispose() : '';
      this.activeItemsChart ? this.activeItemsChart.dispose() : '';
      this.activeItemsCategoriesChart ? this.activeItemsCategoriesChart.dispose() : '';
    }
    if(this.currentDashboard === 'Inbound'){
      this.pendingReceiptsChart ? this.pendingReceiptsChart.dispose() : '';
      this.pendingReceiptsChart ? this.pendingPutawayChart.dispose() : '';
      this.pendingReceiptsChart ? this.pendingQCReceiptsChart.dispose() : '';
    }

    if(this.currentDashboard === 'Warehouse'){
      this.pendingReplenishmentChart ? this.pendingReplenishmentChart.dispose() : '';
      this.pendingCycleCountChart ? this.pendingCycleCountChart.dispose() : '';
      this.subInventoryBarChart ? this.subInventoryBarChart.dispose() : '';
      this.usersBarChart ? this.usersBarChart.dispose() : '';
    }
    if(this.currentDashboard === 'Outbound'){
      this.pendingPickReleaseChart ? this.pendingPickReleaseChart.dispose() : '';
      this.pendingPickReleaseLgChart ? this.pendingPickReleaseLgChart.dispose() : '';
      this.pendingPickReleaseUserChart ? this.pendingPickReleaseUserChart.dispose() : '';
      this.pendingShipConfirmChart ? this.pendingShipConfirmChart.dispose() : '';
    }

    if(this.currentDashboard === 'Transactions'){
      this.lpnControlledLGChart ? this.lpnControlledLGChart.dispose() : '';
      this.onhandStockLGBarChart ? this.onhandStockLGBarChart.dispose() : '';
    }

    if(this.currentDashboard === 'Settings'){
      
    }
    if(this.currentDashboard === 'LabelSetup'){
      
    }



  }


}


