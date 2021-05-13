import { Component, ElementRef, HostListener, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, TooltipPosition, MatDialog } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { ContractsService } from 'src/app/_services/3pl/contracts.service';

export interface ParameterDataElement {
  sno?: any;
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

export interface ParameterDataElementItemSearch {
  itemName: string;
  itemId: any;
  itemDescription: string;
}

@Component({
  selector: 'app-add-contracts',
  templateUrl: './add-contracts.component.html',
  styleUrls: ['./add-contracts.component.css']
})
export class AddContractsComponent implements OnInit {

  contractId: any = null;
  customerId: any = null;
  formTitle: string = 'Create Contract :';
  transactionTypes: any[] = [];
  contractStatusList: any[] = [];
  billingFrequencyList: any[] = [];
  activityAreaList: any[] = [];
  txnTypeList: any[] = [];
  activityList: any[] = [];
  currencyList: any[] = [];
  _3plCustomerList: any[] = [];
  activityGroupList: any[] = [];
  iuList: any[] = [];
  subActivities: any[] = [];
  isEdit = false;
  isAdd = false;
  selectedRowIndex: any = null;
  ContractsForm: FormGroup;
  contractsHeaderId: any = null;
  saveInprogress = false;
  systemDate: any = new Date();
  setEndDate: any = new Date();
  startDateSelected = '';
  endDateSelected = '';
  contractEndDate: any = null;
  itemList: any[] = [];
  uomList: any[] = [{ label: 'Please Select', value: '' }];
  userList: any[] = [{ label: 'Please Select', value: null }];
  stockLocatorList: any[] = [{ label: 'Please Select', value: null }];
  locatorGroupList: any[] = [{ label: 'Please Select', value: null }];
  listProgressPopup: any = false;
  searchItemName: any = '';
  searchDescription: any = '';
  isDailogOpen: any = false;
  currentIndex: any = null;
  itemTableMessage: any = '';
  dialogHeaderData: any = {};
  currentSelectedData: any = null;

  parameterDataItemSearch: ParameterDataElementItemSearch[] = [];
  parameterDataSourceItemSearch = new MatTableDataSource<ParameterDataElementItemSearch>(this.parameterDataItemSearch);
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
  @ViewChild('dateChangeDialog', { static: true }) dateChangeDialog: TemplateRef<any>;
  @ViewChild('paginatorSearchItem', { static: false }) paginatorSearchItem: MatPaginator;

  tooltipPosition: TooltipPosition[] = ['below'];

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );
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
    // 'count',
    'startDate',
    'endDate',
    'totalCounter',
    'unbilledCounter',
    'lineAmount',
    'enableFlag',
    'action'
  ];

  parameterDisplayedColumnsItemSearch: string[] = [
    'No',
    'itemName',
    'itemDescription'
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
    { field: 'lineAmount', name: 'Total Amt.', width: 75, baseWidth: 5 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
  ];

  activityTableMessage = '';
  fromEdit: any = false;
  isEditRoles = false;

  constructor(
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private contractsService: ContractsService,
    private dialog: MatDialog
  ) { }

  validationMessages = {
    customerId: {
      required: 'Customer Name is required.'
    },
    status: {
      required: 'Status is required.'
    },
    billingFrequency: {
      required: 'Billing Frequency is required.'
    },
    startDate: {
      required: 'Start Date is required.'
    },
    endDate: {
      required: 'End Date is required.'
    },
    lastComputationDate: {
      required: 'Last Computation Date is required.'
    },
    currency: {
      required: 'Currency is required.'
    },
    total: {
      required: 'Total is required.'
    }
  };

  contractsFormErrors = {
    customerId: '',
    status: '',
    billingFrequency: '',
    startDate: '',
    endDate: '',
    lastComputationDate: '',
    currency: '',
    total: ''
  };

  ngOnInit() {
    // this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
    this.contractsService.defaultIuDataObservable.subscribe((data: any) => {
      if (data !== '') {
        if (!this.isEdit) {
          this.ContractsForm.patchValue({ iuId: data });
        }
      }
    });
    this.contrastFeedForm();
    const endDate = new Date(this.ContractsForm.controls.startDate.value);
    this.setEndDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1));
    this.getUomLov();
    this.getUserLov();
    this.get3PLCustomerList();
    this.getContractStatusLOV();
    this.getActivityAreaLOV();
    this.getBillingFrequencyLOV();
    this.getCurrencyLOV();
    this.getIuLovEnabled();
    // this.getActivityGroupLOV();     
    this.route.params.subscribe(params => {
      if (params.id) {
        this.contractId = Number(params.id.split('-')[0]);
        this.isEdit = true;
        this.systemDate = '';
        this.formTitle = 'Edit Contract :';
        this.contractsHeaderId = this.contractId;
        this.contractsService
          .getContractDetails(this.contractId)
          .subscribe((data: any) => {
            this.ContractsForm.get('startDate').clearValidators();
            this.ContractsForm.get('startDate').updateValueAndValidity();
            this.ContractsForm.get('endDate').clearValidators();
            this.ContractsForm.get('endDate').updateValueAndValidity();
            this.ContractsForm.get('lastComputationDate').clearValidators();
            this.ContractsForm.get('lastComputationDate').updateValueAndValidity();
            data.result[0].lastComputationDate = new Date(data.result[0].lastComputationDate);
            data.result[0].enableFlag = data.result[0].enableFlag === 'Y' ? true : false;
            this.ContractsForm.patchValue(data.result[0]);
            this.ContractsForm.controls["total"].setValue(data.result[0].totalAmount);             
            this.ContractsForm.controls["total"].disable();             
            this.customerId = data.result[0].customerId;
            this.contractEndDate = data.result[0].endDate;
            this.renderEditRoles(data.result[0].contractLine);
            //this.getStockLocatorLOV(this.customerId);
            this.getLocatorGroupLOV(this.customerId);
          });
      } else {
        this.formTitle = 'Create Contract :';
        setTimeout(() => { this.addRow(); }, 100);
      }
    });

    this.commonService.getScreenSize(264);
    this.onStartDateChanged('');
  }

  ngOnChanges(){
   
  }

  renderEditRoles(data) {
    let array: any = [];
    for (const [index, pData] of data.entries()) {
      array.push({
        contractLineId: pData.contractLineId,
        itemId: pData.itemId,
        itemName: pData.itemName,
        lgId: pData.lgId,
        lgCode: pData.lgCode,
        locatorId: pData.locatorId,
        locatorName: pData.locCode,
        userId: pData.userId,
        userName: pData.userName,
        uom: pData.UOM,
        unitOfMeasure: pData.unitOfMeasure,
        rate: pData.rate,
        cCount: pData.cCount,
        startDate: pData.startDate,
        endDate: pData.endDate,
        enableFlag: pData.enableFlag === 'Y' ? true : false,
        originalData: pData,
        subactivity: pData.subactivity,
        activityArea: pData.activityArea,
        ActvityAreaDesc: pData.ActvityAreaDesc,
        transactionType: pData.transactionType,
        transactionTypeDesc: pData.transactionTypeDesc,
        activity: pData.activity,
        activityDesc: pData.activityDesc,
        totalCounter: pData.totalCounter,
        unbilledCounter: pData.unbilledCounter,
        lineAmount: pData.lineAmount,
        editing: false,
        addNewRecord: false,
        txnTypeList: [],
        activityList: []
      });
    }


    this.parameterData = array;
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
    );
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;

  }

  goToTxnDetails(element) {
    this.router.navigate(['contracts/transactionDetail/' + this.contractId + '-' + element.contractLineId]);
  }

  addRow() {
    this.selectedRowIndex = null;
    this.paginator.pageIndex = 0;
    if (this.matTableRef.nativeElement.clientHeight > 240) {
      const elem = document.getElementById('customTable');
      elem.scrollTop = 0;
    }
    for (const pData of this.parameterData) {
      if (pData.editing === true && pData.addNewRecord === false) {
        this.openSnackBar('Please update your records first.', '', 'error-snackbar');
        return;
      }
    }
    let startDate = new Date(this.ContractsForm.controls.startDate.value);
    let todayDate = new Date()
    let endDate = this.ContractsForm.controls.endDate.value !== null ? new Date(this.ContractsForm.controls.endDate.value) : '';
    this.isAdd = true;
    this.isEditRoles = false;

    this.parameterData.unshift({
      itemId: '',
      itemName: '',
      lgId: '',
      lgCode: '',
      locatorId: '',
      locatorName: '',
      userId: '',
      userName: '',
      uom: '',
      unitOfMeasure: '',
      rate: '',
      cCount: 0,
      startDate: this.contractsService.dateFormat(new Date()),
      endDate: this.contractEndDate,
      enableFlag: false,
      subactivity: '',
      activityArea: '',
      ActvityAreaDesc: '',
      transactionType: '',
      transactionTypeDesc: '',
      activity: '',
      activityDesc: '',
      editing: true,
      addNewRecord: true,
      inlineSearchLoader: 'hide',
      totalCounter: 0,
      unbilledCounter: 0,
      lineAmount: 0,
      txnTypeList: [],
      activityList: []
    });

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
  }

  beginEdit(rowData: any, $event: any, index: any) {

    for (const pData of this.parameterData) {
      if (pData.addNewRecord === true) {
        this.openSnackBar('Please add your records first.', '', 'default-snackbar');
        return;
      }
    }

    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEditRoles = true;
      this.fromEdit = true;
      rowData.inlineSearchLoader = 'hide';
      rowData.searchValue = rowData.itemName;
    }
  }

  disableEdit(rowData: any, index: any) {
    if (this.parameterData[index].editing === true) {
      this.selectedRowIndex = null;
      this.parameterData[index].itemId = this.parameterData[index].originalData.itemId;
      this.parameterData[index].lgId = this.parameterData[index].originalData.lgId;
      this.parameterData[index].locatorId = this.parameterData[index].originalData.locatorId;
      this.parameterData[index].userId = this.parameterData[index].originalData.userId;
      this.parameterData[index].uom = this.parameterData[index].originalData.uom;
      this.parameterData[index].rate = this.parameterData[index].originalData.rate;
      this.parameterData[index].cCount = this.parameterData[index].originalData.cCount;
      this.parameterData[index].enableFlag = this.parameterData[index].originalData.enableFlag === 'N' ? false : true;
      this.parameterData[index].editing = false;
      this.isEditRoles = false;
    };
  }

  deleteRow(rowData: any, rowIndex: number) {
    this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    this.checkIsAddRow();
  }

  checkIsAddRow() {
    let cnt = 0;
    const pLength = this.parameterData.length;
    for (const pdata of this.parameterData) {
      if (pdata.addNewRecord === true) {
        return;
      } else {
        cnt++;
      }
    }
    if (cnt === pLength) {
      this.isAdd = false;
    }
  }

  contrastFeedForm() {
    this.ContractsForm = this.fb.group({
      customerId: [null, Validators.required],
      contractCode: [{ value: '', disabled: true }],
      customerCode: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: this.isEdit }],
      iuId: [(JSON.parse(localStorage.getItem('defaultIU'))).id],
      enableFlag: [true],
      status: ['', Validators.required],
      billingFrequency: ['', Validators.required],
      startDate: [this.contractsService.dateFormat(new Date()), Validators.required],
      endDate: [null, Validators.required],
      lastComputationDate: [{ value: null, disabled: true }],
      currency: ['', Validators.required],
      total: [{ value: 0, disabled: true }]
    });
  }

  onStartDateChanged(event: any) {
    let endDate = new Date(this.ContractsForm.controls.startDate.value);
    this.setEndDate = new Date(new Date(endDate).setDate(endDate.getDate()))
    if (!this.isEdit) {
      for (const pData of this.parameterData) {
        pData.startDate = this.ContractsForm.controls.startDate.value;
      }
    }
    this.startDateSelected = this.ContractsForm.controls.endDate.value;
  }

  onEndDateChanged(event: any) {
    if (!this.isEdit) {
      for (const pData of this.parameterData) {
        pData.endDate = this.ContractsForm.controls.endDate.value;
      }
    }
  }

  changeDate() {
    for (const pData of this.parameterData) {
      pData.endDate = this.ContractsForm.controls.endDate.value;
    }
    this.dialog.closeAll();
  }

  closeDialog(data?: string) {
    // this.ContractsForm.patchValue({ endDate: data });
    // this.ContractsForm.controls.endDate.value = data;
    this.dialog.closeAll();
  }

  contractsLogValidationErrors(group: FormGroup = this.ContractsForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.contractsLogValidationErrors(abstractControl);
      } else {
        this.contractsFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.contractsFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  checkValidNumber(event: any) {

    if (Number(this.ContractsForm.value.total) === 0) {
      this.ContractsForm.patchValue({ total: '' });
    }
  }

  onSubmit(event: any, form: any) {
    if (event) {
      event.stopImmediatePropagation();
      if (this.ContractsForm.valid) {
        if (this.isEdit) {
          this.ContractsForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          this.ContractsForm.value.enableFlag = this.ContractsForm.value.enableFlag == true ? 'Y' : 'N';
          this.ContractsForm.value.total = Number(this.ContractsForm.value.total);
          this.ContractsForm.value.contractId = this.contractId;
          const data = this.getContracts(this.ContractsForm.value);
          if (data === 'validateError') {
            return
          }
          if (!this.parameterData.length) {
            this.openSnackBar('Please add minimum one activity group', '', 'default-snackbar');
            return
          }
          this.saveInprogress = true;
          this.contractsService
            .updateContracts(data, this.contractsHeaderId)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {

                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['contracts']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );

        } else {
          if (!this.parameterData.length) {
            this.openSnackBar('Please enter contract lines', '', 'default-snackbar');
            return
          }

          this.ContractsForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          this.ContractsForm.value.enableFlag = this.ContractsForm.value.enableFlag == true ? 'Y' : 'N';
          this.ContractsForm.value.total = Number(this.ContractsForm.value.total);
          this.ContractsForm.value.startDate = this.contractsService.dateFormat(this.ContractsForm.value.startDate);
          this.ContractsForm.value.endDate = this.contractsService.dateFormat(this.ContractsForm.value.endDate);
          const data = this.getContracts(this.ContractsForm.value);
          if (data === 'validateError') {
            return
          }
          if (!this.parameterData.length) {
            this.openSnackBar('Please add minimum one contract line', '', 'default-snackbar');
            return
          }
          this.saveInprogress = true;
          this.contractsService
            .createContracts(data)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['contracts']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                  this.saveInprogress = false;
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
              }
            );

        }
      } else {
        this.selectedRowIndex = null;

        for (const [i, pData] of this.parameterData.entries()) {
          if (
            pData.activityGroupId === ''
          ) {
            this.selectedRowIndex = i;
            break;
          }
        }
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
        this.saveInprogress = false;
      }
    }
  }

  // get Stock locator LOV
  getStockLocatorLOV(customerId) {
    if (customerId) {
      this.stockLocatorList = [{ label: 'Please Select', value: '' }];
      this.commonService
        .getCommonLovBasedOn('locator', '3pl-customer', customerId)
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
  }
  // Get locator Group LOV
  getLocatorGroupLOV(customerId) {
    if (customerId) {
      this.locatorGroupList = [{ label: 'Please Select', value: '' }];
      this.commonService
        .getCommonLovBasedOn('LG', '3pl-customer', customerId)
        .subscribe((data: any) => {
          if (!data.message) {
            for (const rowData of data.result) {              
              this.locatorGroupList.push({
                value: rowData.id,
                label: rowData.name,

              });
            }            
          }
        });
    }

  }
  // LG Selection changed
  LGSelectionChanged(event: any, value: any) {
    if (event.source.selected && event.isUserInput === true) {
       this.getStockLocatorLOV(value);       
    }
  }


  getItemLov(index?, templateRef?) {
    let itemNameEncoded = '';
    itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
    itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded;

    this.commonService.getItemLovByScreen('item', 'so', null, itemNameEncoded).subscribe((data: any) => {
      this.listProgressPopup = true;
      this.parameterData[index].itemList = [{
        key: '',
        viewValue: ' Please Select',
        itemDescription: ''
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.parameterData[index].itemList = [];
        for (let i = 0; i < data.length; i++) {
          this.parameterData[index].itemList.push({
            value: data[i].itemId,
            label: data[i].itemName,
            data: data[i]

          })
        }
        this.parameterData[index].inlineSearchLoader = 'hide';
        // Set the first element of the search
        if (this.parameterData[index].itemList.length === 1) {
          this.parameterData[index].itemId = data[0].itemId;
          this.parameterData[index].searchValue = data[0].itemName;
          this.parameterData[index].itemName = data[0].itemName;
        } else {
          this.openItemListDialog(this.parameterData[index].itemList, templateRef);
        }
      } else {
        this.parameterData[index].inlineSearchLoader = 'hide';
        this.openItemListDialog([], templateRef);
      }
    },
      (error: any) => {        
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
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

  getContracts(data) {
    const addContractLineArray = [];
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (  pData.activity === '' || 
              pData.activityArea === '' || 
              pData.transactionType === '' || 
              pData.itemId === '' || 
              pData.uom === '' || 
              pData.rate === '') {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'default-snackbar');
          return 'validateError';
        }

      }
      let obj: any = {};
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.editing === true) {
          obj = {
            activityArea: pData.activityArea,
            transactionType: pData.transactionType,
            activity: pData.activity,
            itemId: pData.itemId ? Number(pData.itemId) : null,
            lgId: pData.lgId ? Number(pData.lgId) : null,
            locatorId: pData.locatorId ? Number(pData.locatorId) : null,
            userId: pData.lgId ? Number(pData.userId) : null,
            uom: pData.uom,
            rate: Number(pData.rate),
            startDate: this.contractsService.dateFormat(pData.startDate),
            endDate: this.contractsService.dateFormat(pData.endDate),
            enableFlag: pData.enableFlag === true ? 'Y' : 'N'
          }

          if (this.isEdit && !pData.addNewRecord) {
            obj.contractLineId = Number(pData.contractLineId);
          }
          addContractLineArray.push(obj);
          obj = {};
        }
        data.contractLine = addContractLineArray;
      }
      return data;
    } else {
      data.contractLine = addContractLineArray;
      return data;
    }
  }

  getUomLov() {
    this.uomList = [{ label: 'Please Select', value: '' }];
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
    this.userList = [{ label: 'Please Select', value: '' }];
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

  // Get Contracts Status LOV
  getActivityAreaLOV() {
    this.activityAreaList = [{ label: 'Please Select', value: '' }];
    this.commonService
      .getLookupLOV('WH Domains')
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.activityAreaList.push({
            value: rowData.lookupValue,
            label: rowData.lookupValueDesc
          });
        }
      });
  }

  lookupNameChangeSelection(event: any, lookupName: any, parentValue: any, currentIndex: any) {
    if (event.source.selected && event.isUserInput === true && parentValue !== '') {
      this.getLookupForParentValue(lookupName, parentValue, currentIndex);
    }
  }

  getLookupForParentValue(lookupName, parentValue, currentIndex) {
    if (parentValue === '') {
      return
    }
    this.commonService.getLookupByLookupName(lookupName, parentValue).subscribe(
      (data: any) => {
        if (data.status === 200 && data.result) {
          for (const [i, pData] of this.parameterData.entries()) {
            if (currentIndex === i) {
              if (lookupName === 'TXN_TYPE_CODE') {
                this.parameterData[i].txnTypeList = [{ label: ' Please Select', value: '' }];
              } else {
                this.parameterData[i].activityList = [{ label: ' Please Select', value: '' }];
              }
              for (const lovItem of data.result) {
                if (lookupName === 'TXN_TYPE_CODE' && lovItem.lookupValueEnabledFlag === 'Y') {
                  this.parameterData[i].txnTypeList.push({
                    label: lovItem.lookupValueDesc,
                    value: lovItem.lookupValue,
                    data: lovItem
                  });
                }
                if (lookupName === '3PL_ACTIVITIES' && lovItem.lookupValueEnabledFlag === 'Y') {
                  this.parameterData[i].activityList.push({
                    label: lovItem.lookupValueDesc,
                    value: lovItem.lookupValue,
                    data: lovItem
                  });
                }
              }
            }
          }
        }
      },
      error => {
        this.openSnackBar(error, '', 'default-snackbar');
      })
  }


  // Get Contracts Status LOV
  getContractStatusLOV() {
    this.contractStatusList = [];
    this.commonService
      .getLookupLOV('CONTRACT_STATUS')
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.contractStatusList.push({
            value: rowData.lookupValue,
            label: rowData.lookupValueDesc
          });
        }
      });
  }

  // get Billing Frequency LOV
  getBillingFrequencyLOV() {
    this.billingFrequencyList = [];
    this.commonService
      .getLookupLOV('BILLING_FREQ')
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.billingFrequencyList.push({
            value: rowData.lookupValue,
            label: rowData.lookupValueDesc
          });
        }
      });
  }

  //  Get Currency LOV
  getCurrencyLOV() {
    this.currencyList = [];
    this.commonService
      .getLookupLOV('CURRENCY_CODE')
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.currencyList.push({
            value: rowData.lookupValue,
            label: rowData.lookupValueDesc
          });
        }
      });
  }

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
  getActivityGroupLOV() {
    this.activityGroupList = [];
    this.contractsService
      .getActivityGroupLov()
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.activityGroupList.push({
            id: rowData.activityGroupId,
            code: rowData.activityGroupCode,
            name: rowData.activityGroupName,
            startDate: rowData.startDate,
            endDate: rowData.endDate,
            enableFlag: rowData.enableFlag,
          });
        }
      });

  }
  // get enabled IU
  getIuLovEnabled() {
    this.iuList = [{ label: ' Please Select', value: '' }];
    this.commonService.getIULOV().subscribe(
      (data: any) => {
        if (data.result) {
          for (const rowData of data.result) {
            if (rowData.iuEnabledFlag === 'Y') {
              this.iuList.push({
                label: rowData.iuCode,
                value: rowData.iuId
              });
            }
          }
        }
      },
      (error: any) => {
        this.openSnackBar(error, '', 'default-snackbar');
      }
    );
  }
  startDateChanged(event: any, index) {
    this.parameterData[index].startDate = null;
  }

  searchItem(event: any, index: any, value: any, templateRef: TemplateRef<any>) {
    if (this.isDailogOpen === true) {
      return;
    }
    this.searchItemName = value
    this.parameterData[index].inlineSearchLoader = 'show';
    this.currentIndex = index;
    this.getItemLov(index, templateRef);
  }

  getSelectedItemRecord(data, index) {
    this.selectedRowIndex = index;
    this.currentSelectedData = data;
  }

  goFor(type: string, data?: any) {
    if (type === 'view') {
      // data.dialogHeaderData = this.dialogHeaderData;
      // console.log(data)
      // const dialogRef = this.dialog.open(ItemTxnViewDialogComponent, {
      //   width: '80vw',
      //   data: data,
      //   autoFocus: false
      // });

      // dialogRef.afterClosed().subscribe(response => {
      //   // if (response !== undefined) {
      //   //     this.goFor('edit', response);
      //   // }
      // });
    }
  }

  // Group Name Selection changed
  // groupNameSelectionChanged(event: any, index: number, groupData: any, value: any) {
  //   if (event.source.selected && event.isUserInput === true && value !== '') {
  //     for (const rowData of this.parameterData) {
  //       if (!this.fromEdit && value !== '' && rowData.activityGroupId === value && this.parameterData[index].activityGroupId !== value) {
  //         setTimeout(() => {
  //           this.parameterData[index].activityGroupId = '';
  //           this.parameterData[index].groupCode = '';
  //           this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  //           this.parameterDataSource.paginator = this.paginator;
  //           this.parameterDataSource.sort = this.sort;
  //         }, 1000);
  //         this.openSnackBar('Group is already added in this group.', '', 'default-snackbar');
  //         return;
  //       }
  //     }
  //     this.fromEdit = false;
  //     this.parameterData[index].groupCode = groupData.code;

  //   }
  // }

  // Customer Selection changed
  customerSelectionChanged(event: any, value: any, data: any) {
    if (this.isAdd && event.source.selected && event.isUserInput === true && value !== '') {
      this.ContractsForm.patchValue({ customerCode: data.data.code });
     // this.getStockLocatorLOV(value);
      this.getLocatorGroupLOV(value);
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

  clearSearchFields() {
    this.searchItemName = '';
    this.searchDescription = '';
  }

  saveSelectedItem() {
    if (this.currentIndex !== null && this.currentSelectedData !== null) {
      this.parameterData[this.currentIndex].itemId = this.currentSelectedData.itemId;
      this.parameterData[this.currentIndex].itemName = this.currentSelectedData.itemName;
      this.parameterData[this.currentIndex].searchValue = this.currentSelectedData.itemName;
    }
    this.closeDialog();
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
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


}





