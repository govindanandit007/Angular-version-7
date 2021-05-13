import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Inject, OnInit, Optional, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { ContractsService } from 'src/app/_services/3pl/contracts.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';


export interface ParameterDataElement {
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

export interface ParameterDataElementItemSearch {
  itemName: string;
  itemId: any;
  itemDescription: string;
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  formTitle: string = 'Activity Items :';
  transactionTypes: any[] = [];
  subActivities: any[] = [];
  isEdit = false;
  isAdd = false;
  fromEdit: any = false;
  selectedRowIndex: any = null;
  saveInprogress = false;
  listProgress = false;
  activityGroupList: any[] = [];
  stockLocatorList: any[] = [];
  locatorGroupList: any[] = [];
  itemList: any[] = [];
  uomList: any[] = [];
  userList: any[] = [];
  activityList: any[] = [];
  _3plCustomerList: any[] = [];
  ActivityItemForm: FormGroup;
  // contractsHeaderId: any = null;
  systemDate: any = new Date();
  groupId: any = null;
  contractId: any = null;
  contractLineId: any = null;
  activityId: any = null;
  activityChangeId: any = null;
  activityChangeCode: any = null;
  customerId: any = null;
  contractEndDate: any = null;
  addItem: boolean = false;
  updateItem: boolean = false;
  groupStartDate: any = '';
  groupEndDate: any = '';
  pageLoad: boolean = false;
  dialogHeaderData: any = {};
  currentSelectedData: any = null;
  inlineSearchLoader = 'hide';
  searchItemName: any = '';
  searchDescription: any = '';
  isDailogOpen: any = false;
  currentIndex: any = null;
  listProgressPopup: any = false;
  itemTableMessage: any = '';
  screenMaxHeight:any;
  parameterDataItemSearch: ParameterDataElementItemSearch[] = [];
  parameterDataSourceItemSearch = new MatTableDataSource<ParameterDataElementItemSearch>(this.parameterDataItemSearch);

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
  @ViewChild('myDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  @ViewChild('paginatorSearchItem', { static: false }) paginatorSearchItem: MatPaginator;

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch = true;

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/billing-txn-history.json');

  tooltipPosition: TooltipPosition[] = ['below'];
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );

  parameterDisplayedColumnsItemSearch: string[] = [
    'No',
    'itemName',
    'itemDescription'
  ];

  parameterDisplayedColumns: string[] = [
    'txnNo',
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
    // 'lgName',
    // 'locationName',
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
    { field: 'txnType', name: 'Txn Type', width: 75, baseWidth: 4 },
    { field: 'txnDate', name: 'Txn Date', width: 75, baseWidth: 4 },
    { field: 'txnQuantity', name: 'Qty', width: 75, baseWidth: 2.5 },
    { field: 'txnItemId', name: 'Item', width: 75, baseWidth: 3.5 },
    { field: 'txnSourceId', name: 'Source', width: 75, baseWidth: 3.5 },
    { field: 'sourceLineNumber', name: 'Source Line', width: 75, baseWidth: 4.5 },
    { field: 'txnSourceType', name: 'Source Type', width: 75, baseWidth: 4.5 },
    { field: 'txnDestinationTypeCode', name: 'Destination Type', width: 75, baseWidth: 5.5 },
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
    { field: 'txnFromLocatorId', name: 'From Locator', width: 75, baseWidth: 5 },
    { field: 'txnToLocatorId', name: 'To Locator', width: 75, baseWidth: 4 },
    { field: 'rate', name: 'Rate', width: 75, baseWidth: 2.5 },
    { field: 'locationName', name: 'Locator', width: 75, baseWidth: 4 },
    { field: 'userName', name: 'User Name', width: 75, baseWidth: 4 },
    { field: 'customerName', name: 'Customer', width: 75, baseWidth: 6 },
    { field: 'lineAmount', name: 'Billing Amt.', width: 75, baseWidth: 6 },
    { field: 'txnInspectionQualityCode', name: 'Inspection Qty', width: 75, baseWidth: 6 },
    { field: 'txnInspectionStatusCode', name: 'Inspection Status', width: 75, baseWidth: 10 },
  ];

  activityTableMessage = '';

  constructor(private snackBar: MatSnackBar,
    public commonService: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private contractsService: ContractsService,
    private http: HttpClient,
    public dialog: MatDialog) { 
      this.searchEnable = true;
      this.getScreenSize();
    }

  ngOnInit() {
    this.activityItemFeedForm();
    // this.getActivityGroupLOV();
    // this.getItemLOV();
    // this.getUomLov();
    // this.getUserLov();
    // this.get3PLCustomerList();
    // this.getActivityLov();

    this.route.params.subscribe(params => {
      if (params.id) {
        this.contractId = Number(params.id.split('-')[0]);
        this.contractLineId = Number(params.id.split('-')[1]);
        this.isEdit = true;
        this.formTitle = '3PL Transaction Details :';
        this.getContractDetails();
        this.getTxnDetails();
      }
    });

    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.searchTxnDetail();
      this.searchForTxnDetail();
    });

    this.commonService.getScreenSize(176);
  }

  // show / hide search section
  getSearchToggle(searchToggle: boolean) {
  
    if (searchToggle === true) {
      this.searchEnable = searchToggle;
    } else {
      this.searchEnable = searchToggle;
    }
  }

  searchForTxnDetail() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

  searchTxnDetail() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {
          // This code is used for not loading the search result when module loads 
          if(searchInfo.fromSearchBtnClick === true){
            if (searchInfo.searchType === 'BillingTxnHistory') {
                this.listProgress = true;
                this.parameterData = [];
                this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                let fromDate = searchInfo.searchArray.txnDateFrom ? `&txnDateFrom=${searchInfo.searchArray.txnDateFrom}` : '';
                let toDate = searchInfo.searchArray.txnDateTo ? `&txnDateTo=${searchInfo.searchArray.txnDateTo}` : '';
             
                this.contractsService
                    .getTxnDetails(this.contractId, this.contractLineId ,fromDate,toDate)
                    .subscribe((data: any) => {
                        if (data.status === 200) {
                            if (!data.message) {
                                this.parameterData = [];
                                this.listProgress = false;
                                this.parameterDataSource = new MatTableDataSource<
                                    ParameterDataElement
                                >(this.parameterData);
                                this.parameterData = data.result;
                                this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                                
                                
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

  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }


  getTxnDetails() {
    this.listProgress = true;
    this.contractsService
      .getTxnDetails(this.contractId, this.contractLineId,'','')
      .subscribe((data: any) => {
        this.listProgress = false;
        if (data.status === 200 && !data.message) {
          this.parameterData = data.result;
          this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
        }
      });
  }

  renderEditRoles(data) {
    let array: any = [];
    for (const [index, pData] of data.entries()) {

      array.push({
        itemId: pData.itemId,
        itemName: pData.itemName,
        lgId: pData.lgId,
        lgCode: pData.lgCode,
        locatorId: pData.locatorId,
        locatorName: pData.locatorName,
        userId: pData.userId,
        userName: pData.userName,
        uom: pData.uom,
        unitOfMeasure: pData.unitOfMeasure,
        rate: pData.rate,
        cCount: pData.cCount,
        contractActivityItemId: pData.contractActivityItemId,
        startDate: pData.startDate,
        endDate: pData.endDate,
        enableFlag: pData.enableFlag === 'Y' ? true : false,
        originalData: pData,
        transactionType: pData.transactionType,
        subactivity: pData.subactivity,
        editing: false,
        addNewRecord: false
      });
    }


    this.parameterData = array;
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
    );
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;


  }
  gotoItem() {
    this.router.navigate(['contracts/activityitems/1-1']);
  }
  // Get Customer Lov
  get3PLCustomerList() {
    this._3plCustomerList = [];
    this.commonService.getSearchLOV('3PLCUSTOMER').subscribe(
      (result: any) => {
        this._3plCustomerList = [{
          label: ' Please Select',
          value: ''
        }];
        if (result.status === 200) {
          if (result.result) {
            const data = result.result;
            for (const lovItem of data) {
              if (lovItem.enabledFlag === 'Y') {
                this._3plCustomerList.push({
                  label: lovItem.name,
                  value: lovItem.id,
                  data: lovItem
                });
              }
            }
          }
        }
      },
      error => {
        this.openSnackBar(error, '', 'default-snackbar');
      })
  }

  // Get Activity Group LOV
  getContractDetails() {
    this.contractsService
      .getContractDetails(this.contractId)
      .subscribe((data: any) => {
        this.ActivityItemForm.patchValue({ "contractCode": data.result[0].contractCode });
        this.ActivityItemForm.patchValue({ "customerName": data.result[0].customerName });
        for (const pData of data.result[0].contractLine) {
          if (pData.contractLineId === this.contractLineId) {
            this.ActivityItemForm.patchValue(pData);
            this.ActivityItemForm.patchValue({ "lineAmount": pData.lineAmount ? pData.lineAmount : 0 });
          }
        }
       
      });
  }
  // Get Activity Group LOV
  getActivityGroupLOV(activityGroupData) {
    this.activityGroupList = [];
    for (const rowData of activityGroupData) {
      this.activityGroupList.push({
        id: rowData.activityGroupId,
        code: rowData.activityGroupCode,
        name: rowData.activityGroupName,
        startDate: rowData.startDate,
        endDate: rowData.endDate,
        enableFlag: rowData.enableFlag,
      });
    }

  }
  // get Stock locator LOV
  getStockLocatorLOV() {
    this.stockLocatorList = [];
    this.commonService
      .getCommonLovBasedOn('locator', '3pl-customer', this.customerId)
      .subscribe((data: any) => {
        if (!data.message) {
          for (const rowData of data.result) {           
            this.stockLocatorList.push({
              value: rowData.locatorId,
              label: rowData.locCode,
            });
          }
        }
      });

  }
  // Get locator Group LOV
  getLocatorGroupLOV() {
    this.locatorGroupList = [];
    this.commonService
      .getCommonLovBasedOn('LG', '3pl-customer', this.customerId)
      .subscribe((data: any) => {
        if (!data.message) {
          for (const rowData of data.result) {
            this.locatorGroupList.push({
              value: rowData.id,
              label: rowData.code,

            });
          }
        }
      });

  }

  openItemListDialog(itemList, templateRef?: TemplateRef<any>) {   
    this.parameterDataItemSearch = [];
    this.parameterDataSourceItemSearch = new MatTableDataSource<any>([]);
    this.isDailogOpen = true;
    if (itemList.length) {
      if (templateRef) {
        const dialogRef: any = this.dialog.open(templateRef, {
          autoFocus: false,
          width: '70vw',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {

          this.isDailogOpen = false;
        });
      }


      for (const rowData of itemList) {
        this.parameterDataItemSearch.push(rowData.data);
      }
      this.parameterDataSourceItemSearch = new MatTableDataSource<any>(this.parameterDataItemSearch);
      setTimeout(() => {
        this.paginatorSearchItem.pageSizeOptions = this.commonService.paginationArray;
        this.paginatorSearchItem.pageSize = Number(window.localStorage.getItem('paginationSize') ?
          window.localStorage.getItem('paginationSize') : 10);
        this.parameterDataSourceItemSearch.paginator = this.paginatorSearchItem;
      }, 100);
      this.listProgressPopup = false;
    } else {
      this.parameterDataSourceItemSearch = new MatTableDataSource<any>(this.parameterDataItemSearch);
      this.itemTableMessage = 'No data found';
      setTimeout(() => {
        this.parameterDataSourceItemSearch.paginator = this.paginatorSearchItem;
        this.paginatorSearchItem.pageSizeOptions = this.commonService.paginationArray;
        this.paginatorSearchItem.pageSize = Number(window.localStorage.getItem('paginationSize') ?
          window.localStorage.getItem('paginationSize') : 10);
      }, 100);
      this.listProgressPopup = false;
      if (templateRef) {
        const dialogRef: any = this.dialog.open(templateRef, {
          autoFocus: false,
          width: '70vw',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isDailogOpen = false;
        });
      }
    }

  }

  updateDialogDatasourse() {
    this.parameterDataItemSearch = [];
    this.parameterDataSourceItemSearch = new MatTableDataSource<any>([]);
    this.listProgressPopup = true;
    this.selectedRowIndex = null;
    let itemNameEncoded = '';
    itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
    itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded;

    this.commonService.getItemLovByScreen('item', 'so', null, itemNameEncoded).subscribe((data: any) => {
      let itemList: any = [];

      if (data.result && data.result.length) {
        data = data.result;
        itemList = [];
        for (let i = 0; i < data.length; i++) {
          itemList.push({
            value: data[i].itemId,
            label: data[i].itemName,
            data: data[i]

          })
        }
        this.openItemListDialog(itemList);
      } else {
        itemList = [];
        this.openItemListDialog(itemList);
      }
    },
      (error: any) => {
       this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  closeDialog(dialogType?: string) {
    this.dialog.closeAll();
    document.getElementById('row' + this.currentIndex).focus();
    this.currentSelectedData = null;
    // this.currentIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
    this.selectedRowIndex = null;
    this.isDailogOpen = false;

  }

  getSelectedItemRecord(data, index) {
    this.selectedRowIndex = index;
    this.currentSelectedData = data;
  }

  clearSearchFields() {
    this.searchItemName = '';
    this.searchDescription = '';
  }

  getUomLov() {
    this.uomList = [{ label: ' Please Select', value: '' }];
    this.commonService.getSearchLOV('UOM').subscribe((data: any) => {
      if (data.result) {
        for (const rowData of data.result) {
          this.uomList.push({
            value: rowData.code,
            label: rowData.name
          });
        }
      }
    });
  }

  getUserLov() {
    this.userList = [{ label: ' Please Select', value: null }];
    this.commonService.getSearchLOV('USER').subscribe((data: any) => {
      if (data.result) {

        for (const rowData of data.result) {
          this.userList.push({
            value: Number(rowData.id),
            label: rowData.name
          });
        }
      }
    });
  }

  activityGroupListChanged(event: any, data, value, label) {
    if (event.source.selected && event.isUserInput === true && value !== '') {
      this.getActivityLov(value);
      this.ActivityItemForm.patchValue({ groupCode: data.code });
      this.ActivityItemForm.patchValue({ activityCode: '' });
      this.ActivityItemForm.patchValue({ transactionType: '' });
      this.ActivityItemForm.patchValue({ subactivity: '' });
      this.groupStartDate = data.startDate;
      this.groupEndDate = data.endDate;
      this.groupId = value;
      this.dialogHeaderData.groupName = label;
    }
  }

  getActivityLov(value) {
    if (value === '' || value === undefined) {
      return
    }
    this.activityList = [];
    this.contractsService.getActivityLOV(value).subscribe((data: any) => {
      if (data.result) {

        for (const rowData of data.result[0].activityDetailLines) {

          this.activityList.push({
            value: rowData.activityId,
            label: rowData.activityName,
            code: rowData.activityCode,
            data: rowData
          });
        }
      }
    });
  }

  // Group Name Selection changed
  activityNameSelectionChanged(event: any, activityData: any, value: any, label: any) {
    if (event.source.selected && value !== '' && this.activityChangeId !== value) {
      this.ActivityItemForm.patchValue({ activityCode: activityData.code });

      this.ActivityItemForm.patchValue({ transactionType: activityData.data.transactionTypeDesc });
      this.ActivityItemForm.patchValue({ subactivity: activityData.data.subactivityDesc });
      this.activityId = value;
      this.activityChangeId = value;
      this.activityChangeCode = activityData.code;
      // this.getActivityItemDetails();
      this.pageLoad = true;
      this.dialogHeaderData.activityName = label;
    }
    if (this.activityChangeId === value) {
      this.ActivityItemForm.patchValue({ activityCode: this.activityChangeCode });
    }

  }

  activityItemFeedForm() {
    this.ActivityItemForm = this.fb.group({
      contractCode: [''],
      customerName: [''],
      ActvityAreaDesc: [''],
      transactionTypeDesc: [''],
      activityDesc: [''],
      itemName: [''],
      lgCode: [''],
      locCode: [''],
      userName: [''],
      lineAmount: [''],
      unitOfMeasure: ['']
    });
  }

  goFor(type: string, data?: any) {
    if (type === 'view') {
      data.dialogHeaderData = this.dialogHeaderData;
      const dialogRef = this.dialog.open(ItemTxnViewDialogComponent, {
        width: '80vw',
        data: data,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(response => {
        // if (response !== undefined) {
        //     this.goFor('edit', response);
        // }
      });
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });

  }

  backToContact(){
    this.router.navigate(['contracts/editcontract/'+this.contractId]);
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
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ?
        window.localStorage.getItem('paginationSize') : 10);
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
  styleUrls: ['./items.component.css']
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
      if (data.status === 200) {
        if (!data.message && data.result.length) {

          for (const activityData of data.result) {
            this.resultData.push(activityData);
            this.parameterDataSource = new MatTableDataSource<any>(
              this.resultData
            );
            this.parameterDataSource.paginator = this.paginator;
          }
          this.dataProgress = false;
        } else {
          this.message = 'No Transaction Defined';
        }
      }
    });
  }
}
