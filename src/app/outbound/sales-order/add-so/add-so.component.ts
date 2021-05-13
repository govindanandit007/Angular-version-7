import {
  Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, AfterViewInit, TemplateRef,
  ViewChildren,
  OnDestroy
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog,
  MatTable, MatSort, Sort
} from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { SalesOrderService } from 'src/app/_services/outbound/sales-order.service';
import { SystemOptionService } from 'src/app/_services/settings/system-option.service';
import { QueryList } from '@angular/core';
import { JsonExporterService } from 'mat-table-exporter';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
  select?: boolean;
  soLineId?: number;
  soId?: number;
  soSourceHeaderId?: number;
  soSourceLineId?: number;
  soIuId: number,
  soLineNumber: number,
  soItemId: number,
  shipmentCreated: any,
  itemName?: string,
  showLov?: string,
  searchValue?: string,
  itemList?: any,
  inlineSearchLoader?: string,
  soItemRevisionId: any,
  soItemRevisionList: any,
  revsnNumber?: any;
  soLineQuantity: number,
  soReservedQuantity: number,
  soAllocatedQuantity: number,
  UOM?: string,
  soQtyUomCode: string,
  soShippedQuantity: number,
  soLineStatus: string,
  soLinePriority: string,
  soPlannedShipDate: string,
  soPlannedDlvyDate: string,
  soRmaRoutingType: any,
  crossDockEnabled: any,
  addCrossDock?: any,
  updateCrossDock?: any,
  action: string;
  editing: boolean;
  addNewRecord?: boolean;
  isDefault?: boolean;
  originalData?: any;
  UOMList?: any[];
  rmaValueList?: any[];
  isReservedQtyLower: boolean;
  soWaveEligibleQty?: any;
  createdBy?: any;
  updatedBy?: any;
  soRemainingQty?: any;
}

export interface ParameterDataElementItemSearch {
  itemName: string;
  itemId: any;
  itemDescription: string;
}

export interface ParameterDataElementCrossDock {
  crossDockId?: any,
  poId: string;
  poLineId: any;
  poLineQty: any;
  remainingQty: any;
  sourceType: any;
  poNumber: any;
  poLineNumber: any;
  editing: boolean;
  action: string;
  addNewRecord?: boolean;
  poList?: any[],
  poLineList?: any[],
  originalData?: any,
  disablePoLineLov?: boolean,
  processFlag?: any
}


@Component({
  selector: 'app-add-so',
  templateUrl: './add-so.component.html',
  styleUrls: ['./add-so.component.css']
})
export class AddSoComponent implements OnInit, AfterViewInit, OnDestroy {

  parameterData: ParameterDataElement[] = [];
  soLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  rmaParameterData: ParameterDataElement[] = [];
  rmaLineDataSource = new MatTableDataSource<ParameterDataElement>(this.rmaParameterData);
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  soId: number;
  salesOrderForm: FormGroup;
  ouCodeList: any[] = [];
  statusList: any[] = [];
  typeList: any[] = [];
  priorityList: any[] = [];
  customerList: any[] = [];
  customerSiteList: any[] = [];
  iuList: any[] = [];
  itemList: any[] = [];
  inlineStatusList: any[] = [];
  weightUomList: any[] = [];
  volumeUomList: any[] = [];
  showLov = 'hide';
  inlineSearchLoader = 'hide';
  saveInprogress = false;
  crossDockFlag = false;
  minDate = new Date();
  salesOrderStatus: any;
  crossDockForm: FormGroup;
  poList: any[] = [];
  poLineList: any[] = [];
  disablePoLineLov = true;
  currentDate = new Date;
  currentIndex: any = null;
  currentSelectedData: any = null;
  selectedRowIndex: any = null;
  searchItemName: any = '';
  searchDescription: any = '';
  isDailogOpen: any = false;
  isRowSelected: boolean = true;
  selectAllRow: boolean = true;
  doRMAFlag: boolean = true;
  currentCrossIndex: any = null;
  disableCrossIcon: any = false;

  listProgressPopup: any = false;
  itemTableMessage: any = '';
  parameterDataItemSearch: ParameterDataElementItemSearch[] = [];
  parameterDataSourceItemSearch = new MatTableDataSource<ParameterDataElementItemSearch>(this.parameterDataItemSearch);
  timer: any ='';
  listProgressPopupCrossDock: any = false;
  crossDockTableMessage: any = 'No Data Found';
  parameterDataCrossDock: ParameterDataElementCrossDock[] = [];
  parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);

  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild('crossDockTable', { read: ElementRef, static: false }) matCrossDockTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorSearchItem', { static: false }) paginatorSearchItem: MatPaginator;
  @ViewChild('paginatorCrossDock', { static: false }) paginatorCrossDock: MatPaginator;
  @ViewChildren('iufield') iuFields: QueryList<HTMLElement>;
  @ViewChild('myDialog', { static: true }) confirmationDialog: TemplateRef<any>;

  parameterDisplayedColumnsItemSearch: string[] = [
    'No',
    'itemName',
    'itemDescription'
  ];

  parameterDisplayedColumnsCrossDock: string[] = [
    'No',
    'poNumber',
    'poLineNumber',
    'poLineQty',
    'remainingQty',
    'action'
  ];

  crossDockDialogColumns: any = [
    { field: 'No', name: '#', width: 20, baseWidth: 7 },
    { field: 'poNumber', name: 'PO Number', width: 50, baseWidth: 15 },
    { field: 'poLineNumber', name: 'Line Number + Item Name', width: 50, baseWidth: 37 },
    { field: 'poLineQty', name: 'PO Line Qty', width: 50, baseWidth: 13 },
    { field: 'remainingQty', name: 'Remaining Qty', width: 50, baseWidth: 13 },
    { field: 'action', name: 'Action', width: 50, baseWidth: 15 }
  ]

  itemDialogColumns: any = [
    { field: 'No', name: '#', width: 75, baseWidth: 10 },
    { field: 'itemName', name: 'Item Name', width: 75, baseWidth: 20 },
    { field: 'itemDescription', name: 'Item Description', width: 75, baseWidth: 70 }
  ]

  soLineDisplayedColumns: string[] = [
    'soLineNumber',
    'soIuId',
    'soItemId',
    'soItemRevisionId',
    'soQtyUomCode',
    'soRemainingQty',
    'soLineQuantity',
    'soShippedQuantity',
    'soReservedQuantity',
    'soAllocatedQuantity',
    'soLineStatus',
    'soLinePriority',
    'soPlannedShipDate',
    'soPlannedDlvyDate',
    'crossDockEnabled',
    // 'crossDock',
    'action'
  ];

  rmaLineDisplayedColumns: string[] = [
    'select',
    'soLineNumber',
    'rmaSoLineNum',
    'soItemId',
    'soItemRevisionId',
    'soQtyUomCode',
    'soRemainingQty',
    'soLineQuantity',
    'soReservedQuantity',
    'soRmaRoutingType',
    'soLineStatus',
    'returnableDate',
    'action'
  ];

  columns: any = [
    { field: 'soLineNumber', name: 'Line #', width: 75, baseWidth: 6 },
    { field: 'soIuId', name: 'IU', width: 75, baseWidth: 3 },
    { field: 'soItemId', name: 'Item', width: 75, baseWidth: 8 },
    { field: 'soItemRevisionId', name: 'Item Revision', width: 75, baseWidth: 8 },
    { field: 'soQtyUomCode', name: 'UOM', width: 75, baseWidth: 4 },
    { field: 'soLineQuantity', name: 'Qty', width: 75, baseWidth: 4 },
    { field: 'soShippedQuantity', name: 'Shipped Qty', width: 75, baseWidth: 7 },
    { field: 'soReservedQuantity', name: 'Reserved Qty', width: 75, baseWidth: 7 },
    { field: 'soAllocatedQuantity', name: 'Allocated Qty', width: 75, baseWidth: 7 },
    { field: 'soLineStatus', name: 'Status', width: 75, baseWidth: 4 },
    { field: 'soLinePriority', name: 'Priority', width: 75, baseWidth: 4 },
    { field: 'soPlannedShipDate', name: 'Planned Ship Date', width: 75, baseWidth: 9 },
    { field: 'soPlannedDlvyDate', name: 'Planned Delivery Date', width: 75, baseWidth: 10 },
    { field: 'soRmaRoutingType', name: 'Receipt routing', width: 75, baseWidth: 10 },
    { field: 'crossDockEnabled', name: 'Cross Dock Enabled', width: 75, baseWidth: 10 },
    { field: 'soLineId', name: 'SO Line Number', width: 75, baseWidth: 4 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 9 },
    { field: 'select', name: 'Selection Check', width: 75, baseWidth: 10 },
    { field: 'soRemainingQty', name: 'SO Remaining Qty', width: 75, baseWidth: 14 },
  ];

  columnsRMA: any = [
    { field: 'soLineNumber', name: 'RMA #', width: 75, baseWidth: 12 },
    { field: 'soIuId', name: 'IU', width: 75, baseWidth: 6 },
    { field: 'soItemId', name: 'Item', width: 75, baseWidth: 5 },
    { field: 'soItemRevisionId', name: 'Item Revision', width: 75, baseWidth: 12 },
    { field: 'soQtyUomCode', name: 'UOM', width: 75, baseWidth: 5 },
    { field: 'soLineQuantity', name: 'Qty', width: 75, baseWidth: 5 },
    { field: 'soShippedQuantity', name: 'Shipped Qty', width: 75, baseWidth: 10 },
    { field: 'soReservedQuantity', name: 'Return Qty', width: 75, baseWidth: 5 },
    { field: 'soAllocatedQuantity', name: 'Allocated Qty', width: 75, baseWidth: 7 },
    { field: 'soLineStatus', name: 'Status', width: 75, baseWidth: 6 },
    { field: 'soLinePriority', name: 'Priority', width: 75, baseWidth: 4 },
    { field: 'soPlannedShipDate', name: 'Planned Ship Date', width: 75, baseWidth: 9 },
    { field: 'soPlannedDlvyDate', name: 'Planned Delivery Date', width: 75, baseWidth: 10 },
    { field: 'soRmaRoutingType', name: 'Receipt routing', width: 75, baseWidth: 10 },
    { field: 'crossDockEnabled', name: 'Cross Dock Enabled', width: 75, baseWidth: 10 },
    { field: 'rmaSoLineNum', name: 'SO Line #', width: 75, baseWidth: 4 },
    { field: 'returnableDate', name: 'Returnable Date', width: 75, baseWidth: 23 },
    { field: 'soRemainingQty', name: 'SO Remaining Qty', width: 75, baseWidth: 14 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 6 },
    { field: 'select', name: 'Selection Check', width: 75, baseWidth: 5 },
  ];


  poLineListJson = {
    poId: '',
    itemId: ''
  }

  poListJson = {
    itemId: '',
    soIuId: ''
  }

  systemDate: any = new Date();
  isAddCrossDock: boolean;
  isEditCrossDock: boolean;
  currentsoIuId: any;
  currentItemId: any;
  soNumValue: any;
  soTypeValue: any;
  soStatusValue: any;
  iuId: any;
  iuCodeList: any;

  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    private salesOrderService: SalesOrderService,
    public systemOptionService: SystemOptionService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  validationMessages = {
    soNumber: {
      required: 'SO Number is required.'
    },
    soOuId: {
      required: 'OU is required.'
    },
    soType: {
      required: 'Type is required.'
    },
    soStatus: {
      required: 'Status is required.'
    },
    soDate: {
      required: 'Date is required.'
    },
    soPriority: {
      required: 'Priority is required.'
    },
    soTpId: {
      required: 'Customer is required.'
    },
    soTpSiteId: {
      required: 'Customer site is required.'
    },
    poId: {
      required: 'PO Id is required.'
    },
    poLineId: {
      required: 'PO Line  is required.'
    }
  };

  soFormErrors = {
    soNumber: '',
    soOuId: '',
    soType: '',
    soStatus: '',
    soDate: '',
    soPriority: '',
    soTpId: '',
    soTpSiteId: ''
  };

  crossDockValidationMessages = {
    poId: {
      required: 'Purchase order Id is required.'
    },
    poLineId: {
      required: 'Purchase order line Id is required.'
    }
  };

  crossDockFormErrors = {
    poId: null,
    poLineId: null
  };

  setCrossDockForm() {
    this.crossDockForm = this.fb.group({
      poId: [null, Validators.required],
      poLineId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id; 
    this.timer = Observable.interval(500)
    .subscribe((val) => {      
      let currIuId =  JSON.parse(localStorage.getItem('defaultIU')).id;
      if(this.iuId !== currIuId && !this.isEdit){
        this.iuId = currIuId;
        this.getIUOULOV();
      }
      if(this.isEdit){  
        this.iuId = currIuId;       
      }           
    });        
    this.getOperatingUnitLOV();
    this.getIUOULOV();
    this.getLookUpLOV('SO_TYPES');
    this.getLookUpLOV('SO_STATUS');
    this.getLookUpLOV('SO_PRIORITY');
    this.getUomLov('Volume');
    this.getUomLov('Weight');
    this.setCrossDockForm()
    this.route.params.subscribe(params => { 
      if (params.id) {
        this.isEdit = true;
        this.salesOrderFeedForm();
        this.formTitle = 'Edit Sales Order';
        this.soId = params.id;
        this.salesOrderService
          .getSoById(params.id)
          .subscribe((data: any) => {
            this.salesOrderForm.patchValue(data.result[0]); 
            this.salesOrderForm.patchValue({ searchValue: data.result[0].tpName });
            this.salesOrderForm.controls.searchValue.disable();
            this.salesOrderForm.get('soDate').clearValidators();
            this.salesOrderForm.get('soDate').updateValueAndValidity();
            // this.salesOrderForm.controls.soDate.disable();
            this.customerSelectionChanged({ source: { selected: true }, isUserInput: true }, data.result[0].soTpId);
            this.formTitle = 'Edit Sales Order : ' + data.result[0].soNumber;
            if (data.result[0].soLineDetails) {
              this.renderEditRoles(data.result[0].soLineDetails);
            }
            this.salesOrderStatus = this.salesOrderForm.get('soStatus').value;
          });
      } else { 
        this.salesOrderFeedForm();
        this.formTitle = 'Create Sales Order :';
        this.salesOrderForm.patchValue({ soType: 'STD' });
        this.salesOrderForm.patchValue({ soStatus: 'CREATED' });
        this.salesOrderForm.patchValue({ soPriority: 'LOW' });
        setTimeout(() => { this.addRow(); }, 100);
      }
    });
    this.commonService.getScreenSize(140);
  }

  // Form Group
  salesOrderFeedForm() {
    if (!this.isEdit) {
      this.salesOrderForm = this.fb.group({
        soNumber: [{ value: '', disabled: true }],
        soOuId: ['', Validators.required],
        soType: ['', Validators.required],
        soStatus: ['', Validators.required],
        soDate: [this.salesOrderService.dateFormat(new Date()), Validators.required],
        soPriority: ['', Validators.required],
        soTpId: ['', Validators.required],
        searchValue: ['', Validators.required],
        soTpSiteId: ['', Validators.required]
      });
    } else {
      this.salesOrderForm = this.fb.group({
        soNumber: [{ value: '', disabled: true }],
        soOuId: ['', Validators.required],
        soType: ['', Validators.required],
        soStatus: ['', Validators.required],
        soDate: [{ value: this.salesOrderService.dateFormat(new Date()), disabled: true }],
        soPriority: ['', Validators.required],
        soTpId: ['', Validators.required],
        searchValue: [''],
        soTpSiteId: ['', Validators.required]
      });
    }
  }

  // Get OU and Inventory Unit LOV
  getIUOULOV() {
    this.iuCodeList = [];
    this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id; 
    this.commonService.getInventoryOrgById(this.iuId).subscribe(
      (data: any) => {
          if (data.status === 200) {
            for (const ouData of data.result) {
              this.iuCodeList.push({
                value: ouData.iuOuId,            
                iuId: ouData.iuId,
                iuCode: ouData.iuCode,            
              });
            }            
            let currentobj = this.iuCodeList.find(obj => obj.iuId === this.iuId);
            if (currentobj && !this.isEdit) {
             this.salesOrderForm.controls["soOuId"].setValue(currentobj.value);
            }else if(!this.isEdit){
              this.salesOrderForm.controls["soOuId"].setValue(null);
            }
            
          }
        },
        (error: any) => {
            console.log(error.error.message);
        });
  }
  // Get Operating Unit LOV
  getOperatingUnitLOV() {
    this.ouCodeList = [];
    this.commonService
      .getOULOV()
      .subscribe((data: any) => {
        for (const ouData of data.result) {
          this.ouCodeList.push({
            value: ouData.ouId,
            label: ouData.ouCode
          });
        }
      });
  }

  crossDockLogValidationErrors(group: FormGroup = this.crossDockForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.crossDockLogValidationErrors(abstractControl);
      } else {
        this.crossDockFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.crossDockFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  soLogValidationErrors(group: FormGroup = this.salesOrderForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.soLogValidationErrors(abstractControl);
      } else {
        this.soFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.soFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  fetchNewSearchListForCustomer(event: any, index: any, searchFlag: any) {
    const value = this.salesOrderForm.value.searchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }

    if (this.showLov === 'hide') {

      this.inlineSearchLoader = 'show';
      this.getItemLovByScreenForCustomer(this.salesOrderForm.value.searchValue, index, event)
    } else {
      this.showLov = 'hide';
      this.customerList = [{ value: '', label: ' Please Select' }];
      this.salesOrderForm.patchValue({ soTpId: null });
      this.salesOrderForm.patchValue({ searchValue: '' });
    }
  }

  getItemLovByScreenForCustomer(itemName, index, event) {
    this.commonService.getItemLovByScreen('tp-name', 'trading-partner', 'CUST', itemName).subscribe((data: any) => {
      this.customerList = [{ value: '', label: ' Please Select' }];

      if (data.result && data.result.length) {
        data = data.result;
        this.customerList = [];;
        for (let i = 0; i < data.length; i++) {
          if(data[i].tpCompanyId === JSON.parse(localStorage.getItem('userDetails')).companyId){
            this.customerList.push({
              value: data[i].tpId,
              label: data[i].tpName
            })
          }
        }
        this.inlineSearchLoader = 'hide';
        this.showLov = 'show';
        this.salesOrderForm.patchValue({ searchValue: '' });

        // Set the first element of the search
        this.salesOrderForm.patchValue({ soTpId: data[0].tpId });
      } else {
        this.inlineSearchLoader = 'hide';
        this.salesOrderForm.patchValue({ searchValue: '' });
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  getCustomersLOV() {
    this.customerList = [];
    this.commonService
      .getCustomerLOV()
      .subscribe((data: any) => {
        for (const tpData of data.result) {
          this.customerList.push({
            value: tpData.tpId,
            label: tpData.tpName
          });
        }
      });
  }

  // IU LOV on OU Selection Changed
  ouSelectionChanged(event: any, Id: number) {
    if (event.source.selected) {
      this.commonService.getIUBasedOnOULOV(Id).subscribe((data: any) => {
        this.iuList = [];
        if (data.result && data.result.length) {
          for (const IUData of data.result) {
            this.iuList.push({
              value: IUData.iuId,
              label: IUData.iuCode,
              name: IUData.iuName
            });
          } 
          if(!this.isEdit){
            let currentobj = this.iuList.find(obj => obj.value === this.iuId);            
            if (data.result.length) {
              for (const pData of this.parameterData) {
               // pData.soIuId = this.iuList[0].value;
                if (currentobj) {
                  pData.soIuId = currentobj.value;
                 }else{
                  pData.soIuId = this.iuList[0].value;
                 }
              }
            } else {
              for (const pData of this.parameterData) {
                pData.soIuId = null;
              }
            }
          }
        }
      });
      for (const item of this.parameterData) {
        item.addCrossDock = [];
      }
    }
  }

  customerSelectionChanged(event: any, Id: number) {
    if (event.source.selected && event.isUserInput === true) {
      this.customerSiteList = [];
      this.commonService.getSupplierSiteLOV(Id).subscribe((data: any) => {
        if (data.result) {
          for (const customerSiteData of data.result) {
            this.customerSiteList.push({
              value: customerSiteData.tpSiteId,
              label: customerSiteData.tpSiteName
            });
          }
        }
        data.result.length === 1 ? this.salesOrderForm.patchValue({ soTpSiteId: data.result[0].tpSiteId }) : '';
      });
    }
  }

  onSoPlannedShipDateChanged(event: any, index) {
    this.parameterData[index].soPlannedDlvyDate = null;
  }

  onIUChanged(event: any, element, index) {
    if (event.source.selected) {
      this.parameterData[index].addCrossDock = [];
    }
  }

  crossDockCheckboxChanged(event: any, element, index) {
    if (event) {
      if (element.crossDockEnabled === false) {
        this.parameterData[index].addCrossDock = [];
      }
    }
  }

  // Get Item LOV
  getItemLOV() {
    this.itemList = [];
    this.commonService
      .getItemLOVWithRevision()
      .subscribe((data: any) => {
        for (const itemData of data.result) {
          this.itemList.push({
            value: Number(itemData.itemId),
            label: itemData.itemName,
            itemRevisionNum: itemData.itemRevisionNum
          });
        }
      });
  }

  itemFieldFocus(){
    debugger
      this.disableCrossIcon = true
  }

  searchItem(event: any, index: any, value: string, templateRef: TemplateRef<any>){
    if (this.isDailogOpen === true) {
      return;
    }
    this.searchItemName = value
    this.parameterData[index].inlineSearchLoader = 'show';
    this.currentIndex = index;
    this.getItemLov(index, templateRef);
  }

  beginRMAAdd(templateRef: TemplateRef<any>) {
    if (this.isDailogOpen === true) {
      return;
    }
    // this.currentIndex = index;
    this.isDailogOpen = true;
    this.rmaParameterData = [];
    const soNumValue = this.salesOrderForm.get('soNumber').value;
    const soTypeValue = this.salesOrderForm.get('soType').value;
    const soStatusValue = this.salesOrderForm.get('soStatus').value;
    this.soNumValue = soNumValue;
    this.soTypeValue = soTypeValue;
    this.soStatusValue = soStatusValue;

    setTimeout(() => {
      this.salesOrderForm.patchValue({ soNumber: '' });
      this.salesOrderForm.patchValue({ soType: 'RMA' });
      this.salesOrderForm.patchValue({ soStatus: 'CREATED' });
    }, 0);

    if (templateRef) {
      const dialogRef: any = this.dialog.open(templateRef, {
        autoFocus: false,
        width: '80vw',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        this.isDailogOpen = false;
      });
      for (const [j] of this.parameterData.entries()) {
        this.rmaParameterData.push(Object.assign({}, this.parameterData[j]));
      }
      for (const rmaData of this.rmaParameterData) {
        rmaData.select = true;
        rmaData.soRmaRoutingType = "2STEP";
        rmaData.soLineStatus = "CREATED";
        rmaData['rmaValueList'] = [];
      }
     
      this.getValueLov(8);
      this.rmaLineDataSource = new MatTableDataSource<ParameterDataElement>(this.rmaParameterData);
    }

  }

  getValueLov(value) {
    this.systemOptionService
      .getValueLOV({ sysOptionId: value })
      .subscribe((data: any) => {
        if (data.result) {
          for (const [i] of this.rmaParameterData.entries()) {
            this.rmaParameterData[i].rmaValueList = [{ value: '', label: 'Please Select' }];
            for (const temp of data.result) {
              this.rmaParameterData[i].rmaValueList.push({
                value: temp.code,
                label: temp.value,
                data: temp
              });
            }
          }
        }
         
      });
  }

  disableRMAEdit(rowData: any, index: any) {
    if (this.rmaParameterData[index].editing === true) {
      this.rmaParameterData[index].isDefault = this.rmaParameterData[index].originalData.isDefault;
      this.rmaParameterData[index].soIuId = this.rmaParameterData[index].originalData.soIuId;
      this.rmaParameterData[index].soLineNumber = this.rmaParameterData[index].originalData.soLineNumber;
      this.rmaParameterData[index].soItemId = this.rmaParameterData[index].originalData.soItemId;
      this.rmaParameterData[index].itemName = this.rmaParameterData[index].originalData.itemName;
      this.rmaParameterData[index].soItemRevisionId = this.rmaParameterData[index].originalData.soItemRevisionId;
      this.rmaParameterData[index].soLineQuantity = this.rmaParameterData[index].originalData.soLineQuantity;
      this.rmaParameterData[index].soReservedQuantity = this.rmaParameterData[index].originalData.soReservedQuantity;
      this.rmaParameterData[index].soAllocatedQuantity = this.rmaParameterData[index].originalData.soAllocatedQuantity;
      this.rmaParameterData[index].soQtyUomCode = this.rmaParameterData[index].originalData.soQtyUomCode;
      this.rmaParameterData[index].soShippedQuantity = this.rmaParameterData[index].originalData.soShippedQuantity;
      //  this.rmaParameterData[index].soLineStatus          = this.rmaParameterData[index].originalData.soLineStatus;
      this.rmaParameterData[index].soLinePriority = this.rmaParameterData[index].originalData.soLinePriority;
      this.rmaParameterData[index].soPlannedShipDate = this.rmaParameterData[index].originalData.soPlannedShipDate;
      this.rmaParameterData[index].soPlannedDlvyDate = this.rmaParameterData[index].originalData.soPlannedDlvyDate;
      this.rmaParameterData[index].isReservedQtyLower = this.rmaParameterData[index].originalData.isReservedQtyLower;
      //  this.rmaParameterData[index].soRmaRoutingType      = this.rmaParameterData[index].originalData.soRmaRoutingType;
      this.rmaParameterData[index].editing = false;
      this.isEditRoles = false;
    };
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
          this.parameterData[index].soItemId = data[0].itemId;
          this.parameterData[index].searchValue = data[0].itemName;
          this.parameterData[index].itemName = data[0].itemName;
          this.getUOMList(data[0].itemId, index);
          this.getRevisionlist(data[0].itemId, index);
          this.disableCrossIcon = false;
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

  openItemListDialog(itemList, templateRef?: TemplateRef<any>) {
    this.disableCrossIcon = false
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

  closeDialog(dialogType?: string) {
    this.dialog.closeAll();
    if (dialogType !== 'RMA') { 
      document.getElementById('row' + this.currentIndex).focus();
      if (this.isEdit === false) {
        if (this.parameterData[this.currentIndex].addCrossDock.length) {
          this.parameterData[this.currentIndex].addCrossDock = [];
          this.parameterData[this.currentIndex].crossDockEnabled = false;
          this.parameterDataCrossDock = [];
          this.parameterDataSourceCrossDock = new MatTableDataSource<any>(this.parameterDataCrossDock);
          this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
        } else {
          this.parameterData[this.currentIndex].crossDockEnabled = false;
        }
      }
      this.parameterData[this.currentIndex].searchValue = this.parameterData[this.currentIndex].itemName;
    } else {
      this.salesOrderForm.patchValue({ soNumber: this.soNumValue });
      this.salesOrderForm.patchValue({ soType: this.soTypeValue });
      this.salesOrderForm.patchValue({ soStatus: this.soStatusValue });
    } 
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

  saveSelectedItem() {
    if (this.currentIndex !== null && this.currentSelectedData !== null) {
      if (this.parameterData[this.currentIndex].soItemId !== this.currentSelectedData.itemId) {
        if (this.isEdit === true && !this.parameterData[this.currentIndex].addNewRecord) {
          this.deleteCrossDockList(this.currentIndex);
        }
        if ((this.isEdit === true && !this.parameterData[this.currentIndex].addNewRecord) ||
          this.parameterData[this.currentIndex].addNewRecord) {
          this.parameterData[this.currentIndex].addCrossDock = [];
        }
      }
      this.parameterData[this.currentIndex].soItemId = this.currentSelectedData.itemId;
      this.parameterData[this.currentIndex].itemName = this.currentSelectedData.itemName;
      this.parameterData[this.currentIndex].searchValue = this.currentSelectedData.itemName;
      // this.parameterData[this.currentIndex].addCrossDock = [];
      this.getUOMList(this.currentSelectedData.itemId, this.currentIndex);
      this.getRevisionlist(this.currentSelectedData.itemId, this.currentIndex);
    }
    this.closeDialog();
  }

  deleteCrossDockList(index) {
    if (this.parameterData[index].addCrossDock.length === 0) {
      return;
    }
    const crossDockArray = [];
    for (const itemData of this.parameterData[index].addCrossDock) {
      crossDockArray.push({ crossDockId: itemData.crossDockId })
    }
    const data = {
      addCrossDock: crossDockArray
    }
    this.salesOrderService.deleteCrossDockList(data).subscribe(
      (data: any) => {
        if (data && data.status === 200) {
          if (data.message === 'deleted') {
            this.parameterData[index].addCrossDock = [];
          } else {
            this.openSnackBar('Cross Dock list not deleted', '', 'error-snackbar');
          }
        } else {
          this.openSnackBar(data.message, '', 'error-snackbar');
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      });
  }

  clearSearchFields() {
    this.searchItemName = '';
    this.searchDescription = '';
  }


  getRevisionlist(itemId, index) {

    this.commonService.getRevisionLovByItem(itemId)
      .subscribe(
        (data: any) => {
          if (data.status === 200) {
            if (data.result && data.result.length) {
              this.parameterData[index].soItemRevisionList = [];
              this.parameterData[index].soItemRevisionId = data.result[0].revsnId
              for (const rowData of data.result) {
                this.parameterData[index].soItemRevisionList.push({
                  value: rowData.revsnId,
                  label: rowData.revsnNumber
                });
              }
            } else {
              this.parameterData[index].soItemRevisionList = [{
                value: 0,
                label: '0'
              }];
              this.parameterData[index].soItemRevisionId = 0;

            }


          } else {
            this.openSnackBar(data.message, '', 'error-snackbar');
          }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
  }


  // Get UOM List
  getUOMList(itemId, index) {

    this.parameterData[index].UOMList = [];
    this.salesOrderService
      .getUomByItem(itemId)
      .subscribe((data: any) => { 
        this.parameterData[index].UOMList.push({
          value: data.result[0].primaryUomCode,
          label: data.result[0].psUnitOfMeasure
        });
        if (!this.isEdit) {
          this.parameterData[index].soQtyUomCode = data.result[0].primaryUomCode;
        }
        if (data.result[0].secondaryUomCode !== null) {
          this.parameterData[index].UOMList.push({
            value: data.result[0].secondaryUomCode,
            label: data.result[0].suUnitOfMeasure
          });
        }

      });
  }

  // get UOM LOV
  getUomLov(uomName: string) {
    if (uomName === 'Volume') {
      this.volumeUomList = [{ label: ' Please Select', value: '' }];
      this.salesOrderService.getUomLOV(uomName).subscribe((data: any) => {
        if (data.result) {
          for (const rowData of data.result) {
            this.volumeUomList.push({
              value: rowData.uomCode,
              label: rowData.unitOfMeasure
            });
          }
        }
      });
    }
    if (uomName === 'Weight') {
      this.weightUomList = [{ label: ' Please Select', value: '' }];
      this.salesOrderService.getUomLOV(uomName).subscribe((data: any) => {
        if (data.result) {
          for (const rowData of data.result) {
            this.weightUomList.push({
              value: rowData.uomCode,
              label: rowData.unitOfMeasure
            });
          }
        }
      });
    }
  }

  getSOLinesForAdd(data) {
    const soLineArray = [];
    data.soDate = this.salesOrderService.dateFormat(data.soDate);
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.soIuId === null || pData.soItemId === null || pData.soQtyUomCode === null
          || pData.soLineQuantity === null) {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        // if( pData.editing === true && pData.itemName !== pData.searchValue){
        //   this.selectedRowIndex = i;
        //   this.openSnackBar('Please enter all required fields in row ' + (i+1), '', 'error-snackbar');
        //   return 'validateError';
        // }
        if(pData.soLineQuantity && Number(pData.soLineQuantity) === 0){
          this.selectedRowIndex = i;
          this.openSnackBar('Sales Order Qty Should be a non-Zero value in Row ' + (i+1), '', 'default-snackbar');
          return 'validateError';
        }
        if (pData.soLineQuantity && pData.soShippedQuantity && pData.soLineQuantity < pData.soShippedQuantity) {
          this.openSnackBar(
            'SO quantity should be equal or greater then SO receipt quantity in SO line ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
      }
      for (const [i, pData] of this.parameterData.entries()) {
        delete pData.action;
        delete pData.editing;
        delete pData.addNewRecord;
        delete pData.isDefault;
        delete pData.itemList;
        delete pData.UOMList;
        delete pData.showLov;
        delete pData.inlineSearchLoader;
        if(!pData.crossDockEnabled){
          pData.addCrossDock = [];
        }
        pData.soLineQuantity = pData.soLineQuantity !== null ? Number(pData.soLineQuantity) : 0;
        pData.soShippedQuantity = pData.soShippedQuantity !== null ? Number(pData.soShippedQuantity) : 0;
        pData.soReservedQuantity = pData.soReservedQuantity !== null ? Number(pData.soReservedQuantity) : 0;
        pData.soPlannedShipDate = this.salesOrderService.dateFormat(pData.soPlannedShipDate);
        pData.soPlannedDlvyDate = (pData.soPlannedDlvyDate === '' || pData.soPlannedDlvyDate === null)
          ? null : this.salesOrderService.dateFormat(pData.soPlannedDlvyDate);
        pData.crossDockEnabled = pData.crossDockEnabled ? 'Y' : 'N';
        pData.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;

        soLineArray.push(pData);

      }
      data.addSalesOrderLines = soLineArray;
      return data;
    } else {
      data.addSalesOrderLines = soLineArray;
      return data;

    }
  }
  getSOLinesForEdit(data) {
    const soLineArray = [];
    const updatesoLineArray = [];
    data.soDate = this.salesOrderService.dateFormat(this.salesOrderForm.controls.soDate.value); 
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.editing) {
          if (pData.soIuId === null || pData.soItemId === null || pData.soQtyUomCode === null
            || pData.soLineQuantity === null) {
            this.selectedRowIndex = i;
            this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
            return 'validateError';
          }
        }
        // if( pData.editing === true && pData.itemName !== pData.searchValue){
        //   this.selectedRowIndex = i;
        //   this.openSnackBar('Please enter all required fields in row ' + (i+1), '', 'error-snackbar');
        //   return 'validateError';
        // }
        if(pData.soLineQuantity && Number(pData.soLineQuantity) === 0){
          this.selectedRowIndex = i;
          this.openSnackBar('Sales Order Qty Should be a non-Zero value in Row ' + (i+1), '', 'default-snackbar');
          return 'validateError';
        }
        if (pData.soLineQuantity && pData.soShippedQuantity && pData.soLineQuantity < pData.soShippedQuantity) {
          this.selectedRowIndex = i;
          this.openSnackBar(
            'SO quantity should be equal or greater then shipping quantity in SO line ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.isReservedQtyLower) {
          this.selectedRowIndex = i;
          this.openSnackBar(
            'Reserved Quantity should not be more then ' + pData.originalData.soReservedQuantity + ' in SO line' + (i + 1),
            '', 'error-snackbar');
          return 'validateError';
        }
      }
      for (const [i, pData] of this.parameterData.entries()) {
        delete pData.action;
        delete pData.editing;
        delete pData.addNewRecord;
        delete pData.itemList;
        delete pData.showLov;
        delete pData.inlineSearchLoader;
        if(!pData.crossDockEnabled){
          pData.addCrossDock = [];
        }
        pData.soLineQuantity = pData.soLineQuantity !== null ? Number(pData.soLineQuantity) : 0;
        pData.soShippedQuantity = pData.soShippedQuantity !== null ? Number(pData.soShippedQuantity) : 0;
        pData.soReservedQuantity = pData.soReservedQuantity !== null ? Number(pData.soReservedQuantity) : 0;
        pData.soPlannedShipDate = this.salesOrderService.dateFormat(pData.soPlannedShipDate);
        pData.soPlannedDlvyDate = (pData.soPlannedDlvyDate === '' || pData.soPlannedDlvyDate === null)
          ? null : this.salesOrderService.dateFormat(pData.soPlannedDlvyDate);
        pData.crossDockEnabled = pData.crossDockEnabled ? 'Y' : 'N';


        if (pData.soLineId) {
          if (pData.editing || this.isEdit) {
            pData.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
            updatesoLineArray.push(pData);
          }
        } else {
          pData.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          soLineArray.push(pData)
        }
      }

      data.addSalesOrderLines = soLineArray;
      data.updateSalesOrderLines = updatesoLineArray;
      return data;
    }
  }

  quantityFocusOut(event: any, index: any, value: any) {
    if (value && Number(value) === 0) {
      this.parameterData[index].soLineQuantity = null;
    }
  }


  quantityRMAFocusOut(event: any, index: any, value: any) {
    if (Number(value) > this.parameterData[index].soLineQuantity) {
      this.rmaParameterData[index].soLineQuantity = this.parameterData[index].soLineQuantity;
      this.openSnackBar('Please Enter less then or equal to ' + this.parameterData[index].soLineQuantity, '', 'error-snackbar');
    }
  }

  // Cross Dock popup code 6342
  openCrossDockPopup(event: any, index: any, element: any, templateRef: TemplateRef<any>) {
    if (element.soItemId && element.soIuId) {
      this.currentCrossIndex = index;
      this.currentsoIuId = element.soIuId;
      this.currentItemId = element.soItemId
      this.getPoList(element.soItemId, element.soIuId);

      for (const rowData of this.parameterData[index].addCrossDock) {
        rowData.processFlag = rowData.processFlag === 'Y' ? true : false;
      }

      this.parameterDataCrossDock = this.parameterData[index].addCrossDock;
      this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
      setTimeout(() => {
        this.paginatorCrossDock.pageSizeOptions = this.commonService.paginationArray;
        this.paginatorCrossDock.pageSize = Number(window.localStorage.getItem('paginationSize') ?
          window.localStorage.getItem('paginationSize') : 10);
        this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
        this.commonService.setTableResize(this.matCrossDockTableRef.nativeElement.clientWidth, this.crossDockDialogColumns);
      }, 100);
      
      const dialogRef = this.dialog.open(templateRef, {
        autoFocus: false,
        width: '65vw',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.updateCloseDialogData();
      });

     
    } else {
      this.openSnackBar('Please select the item and IU', '', 'error-snackbar');
    }
  }

  updateCloseDialogData() {
  this.parameterData[this.currentCrossIndex].addCrossDock = this.parameterDataCrossDock; 
  let nullPoIdLineCount = 0; 
  for (const rowData of this.parameterData[this.currentCrossIndex].addCrossDock) {       
       if(rowData.poId === '' && rowData.poLineId === ''){
        rowData.poId = null;
        rowData.poLineId = null;
        nullPoIdLineCount++;
       }
      rowData.processFlag = rowData.processFlag === true ? 'Y' : 'N';       
  }
  if(nullPoIdLineCount === this.parameterData[this.currentCrossIndex].addCrossDock.length ){
    this.parameterData[this.currentCrossIndex].crossDockEnabled = false;
  }
}

  getPoList(itemId, soIuId) {
    this.poList = [];
    this.poListJson = { itemId, soIuId };
    this.salesOrderService.getPoList(this.poListJson)
      .subscribe((data: any) => {
        if (data.result && data.result.length) {
          for (const rowData of data.result) {
            this.poList.push({
              value: rowData.poId,
              label: rowData.poNumber
            });
          }
        }
      });
  }

  getCrossDockDetails(soLineId, index) {
    let obj: any = {};
    let tempArray: any = [];
    this.salesOrderService.getCrossDockDetails(soLineId)
      .subscribe((data: any) => {
        if (data.result && data.result.length) {
          for (const crossDockObj of data.result) {
            obj = {
              crossDockId: crossDockObj.crossDockId,
              poId: crossDockObj.xpoId,
              poNumber: crossDockObj.poNumber,
              poLineId: crossDockObj.xpoLineId,
              poLineNumber: crossDockObj.poLineNumber,
              poLineQty: crossDockObj.poLineQty,
              remainingQty: crossDockObj.remainingQty,
              sourceType: 'SO',
              action: '',
              poList: this.poList,
              poLineList: [],
              editing: false,
              disablePoLineLov: false,
              processFlag: crossDockObj.processFlag,
              addNewRecord: false
            }

            const temp: any = Object.assign({}, obj);
            temp.originalData = Object.assign({}, obj);
            tempArray.push(temp)
          }
          this.setParameterData(tempArray, index);

        }
      });

  }

  setParameterData(tempArray, index) {
    this.parameterData[index].addCrossDock = tempArray;
  }

  poLineChanged(event: any, index: any, element, item) {
    if (event.source.selected) {

      let count = 0;
      this.selectedRowIndex = null;
      for (const [i, rowData] of this.parameterDataCrossDock.entries()) {
        if (rowData.poId !== '' && rowData.poLineId !== '') {
          if (rowData.poId === element.poId && rowData.poLineId === element.poLineId) {
            count++;
            if (count === 2) {
              this.selectedRowIndex = index;
              this.parameterDataCrossDock[index].poLineId = '';
              this.parameterDataCrossDock[index].poLineNumber = ''
              this.parameterDataCrossDock[index].poId = '';
              this.parameterDataCrossDock[index].poLineList = [];
              this.openSnackBar('PO and PO line combination already exist' + (index + 1), '', 'error-snackbar');
              return;
            }
          }
        }
      }

      this.parameterDataCrossDock[index].poLineNumber = item.label;
      this.parameterDataCrossDock[index].poLineQty = item.data.poLineQty;
      this.parameterDataCrossDock[index].remainingQty = item.data.remainingQty;
    }
  }

  poChanged(event: any, index: any) {
    if (event.source.selected) {
      this.parameterDataCrossDock[index].poNumber = event.source.selected.viewValue;
      this.parameterDataCrossDock[index].poList = this.poList;
      this.getPoLineList(this.parameterDataCrossDock[index].poId, index);
    }
  }

  getPoLineList(poID, index) {
    this.parameterDataCrossDock[index].poLineList = [];
    this.poLineListJson.poId = poID;
    this.poLineListJson.itemId = this.currentItemId;
    this.salesOrderService.getPoLineList(this.poLineListJson)
      .subscribe((data: any) => {
        if (data.result && data.result.length) {
          for (const rowData of data.result) {
            this.parameterDataCrossDock[index].poLineList.push({
              value: rowData.poLineId,
              label: rowData.poLineNumber,
              data: rowData
            });
          }
          if (data.result.length) {
            this.parameterDataCrossDock[index].poLineId = data.result[0].poLineId;
          }

        } else if (data.message) {
          this.openSnackBar('No PO Line found', '', 'error-snackbar');
        }
      });
  }

  beginCrossDockEdit(rowData: any, $event: any, index: any) {

    for (const pData of this.parameterDataCrossDock) {
      if (pData.addNewRecord === true) {
        this.openSnackBar('Please add your records first.', '', 'error-snackbar');
        return;
      }
    }
    if (!rowData.processFlag && rowData.editing === false) {
      rowData.editing = true;
      this.isAddCrossDock = false;
      this.isEditCrossDock = true;
      this.getPoLineList(rowData.poId, index);
    } else if (rowData.processFlag) {
      this.openSnackBar('Can\'t edit this Line', '', 'error-snackbar');
      return;
    }
  }

  disableCrossDockEdit(rowData: any, index: any) {
    if (this.parameterDataCrossDock[index].editing === true) {
      this.parameterDataCrossDock[index].poId = this.parameterDataCrossDock[index].originalData.poId;
      this.parameterDataCrossDock[index].poLineId = this.parameterDataCrossDock[index].originalData.poLineId;
      this.parameterDataCrossDock[index].poNumber = this.parameterDataCrossDock[index].originalData.poNumber;
      this.parameterDataCrossDock[index].poLineNumber = this.parameterDataCrossDock[index].originalData.poLineNumber;
      this.parameterDataCrossDock[index].poLineQty = this.parameterDataCrossDock[index].originalData.poLineQty;
      this.parameterDataCrossDock[index].remainingQty = this.parameterDataCrossDock[index].originalData.remainingQty;

      this.parameterDataCrossDock[index].editing = false;
      this.parameterDataCrossDock[index].addNewRecord = false;
      this.parameterDataCrossDock[index].disablePoLineLov = false;
      this.isEditCrossDock = false;
    };
  }

  deleteCrossDockRow(rowData: any, rowIndex: number) {
    if (rowIndex === this.selectedRowIndex) {
      this.selectedRowIndex = null;
    }
    this.parameterDataCrossDock.splice(rowIndex, 1);
    this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
    this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
    this.checkIsCrossDockAddRow();

  }

  checkIsCrossDockAddRow() {
    let cnt = 0;
    const pLength = this.parameterDataCrossDock.length;
    for (const pdata of this.parameterDataCrossDock) {
      if (pdata.addNewRecord === true) {
        return;
      } else {
        cnt++;
      }
    }
    if (cnt === pLength) {
      this.isAddCrossDock = false;
    }
  }

  addPoRow() {
    this.isAddCrossDock = true;
    this.isEditCrossDock = false;
    this.parameterDataCrossDock.unshift(
      {
        crossDockId: null,
        poId: '',
        poNumber: '',
        poLineId: '',
        poLineQty: null,
        remainingQty: null,
        poLineNumber: '',
        sourceType: 'SO',
        action: '',
        poList: this.poList,
        poLineList: [],
        editing: true,
        disablePoLineLov: true,
        addNewRecord: true
      });
    this.parameterDataSourceCrossDock = new MatTableDataSource<any>(this.parameterDataCrossDock);
    this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
  }

  validateDuplicateEntries(event: any, index, element) {

  }

  addPOList(type: string) {

    let tempArray = [];
    this.parameterData[this.currentCrossIndex].addCrossDock = [];
    for (const [i, rowData] of this.parameterDataCrossDock.entries()) {
      if (rowData.poId !== '' && rowData.poLineId !== '') {
        rowData.editing = false;
        rowData.addNewRecord = false;
        const temp: any = Object.assign({}, rowData);
        rowData.originalData = temp;
        tempArray.push(rowData);
      } else {
        this.selectedRowIndex = i;
        this.openSnackBar('please fill the records' + (i + 1), '', 'error-snackbar');
        return;
      }
    }

    for (const rowData of tempArray) {
      rowData.processFlag = rowData.processFlag === true ? 'Y' : 'N';
    }

    this.parameterData[this.currentCrossIndex].addCrossDock = tempArray;
    this.dialog.closeAll();
  }


  onSubmit(event: any, formId: any) {
    if (event) {
      event.stopImmediatePropagation();
      if(!this.isEdit && this.salesOrderForm.get('soTpId').value){
        this.salesOrderForm.get('searchValue').clearValidators();
        this.salesOrderForm.get('searchValue').updateValueAndValidity();
      }
    
      if (this.salesOrderForm.valid) {
        if (this.isEdit) {
          this.salesOrderForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          const data = this.getSOLinesForEdit(this.salesOrderForm.value);
          if (data === 'validateError') {
            return
          }
          this.saveInprogress = true;
          this.salesOrderService
            .updateSO(data, this.soId)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['salesorders']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        } else {
          if (!this.parameterData.length) {
            this.openSnackBar('Please enter sales order line', '', 'error-snackbar');
            return
          }
          this.salesOrderForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId
          const data = this.getSOLinesForAdd(this.salesOrderForm.value);
          if (data === 'validateError') {
            return
          }
          this.saveInprogress = true;
          this.salesOrderService.createSO(data)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openDialog('Success', resultData.message);
                  this.router.navigate(['salesorders']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        }
      } else {
        this.selectedRowIndex = null;
        for (const [i, pData] of this.parameterData.entries()) {
          if (
            pData.soIuId === null ||
            pData.soItemId === null ||
            pData.soQtyUomCode === null ||
            pData.soLineQuantity === null
          ) {
            this.selectedRowIndex = i;
            break;
          }
        }
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
      }
    }
  }

  getRMALinesForAdd(data) {
    const soLineArray = [];
    data.soDate = this.salesOrderService.dateFormat(this.salesOrderForm.controls.soDate.value);
    data.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
    if (this.rmaParameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.rmaParameterData.entries()) {
        delete pData.action;
        delete pData.editing;
        delete pData.addNewRecord;
        delete pData.isDefault;
        delete pData.itemList;
        delete pData.UOMList;
        delete pData.showLov;
        delete pData.inlineSearchLoader;
        pData.soLineQuantity = pData.soLineQuantity !== null ? Number(pData.soLineQuantity) : 0;
        pData.soShippedQuantity = pData.soShippedQuantity !== null ? Number(pData.soShippedQuantity) : 0;
        pData.soReservedQuantity = pData.soReservedQuantity !== null ? Number(pData.soReservedQuantity) : 0;
        pData.soPlannedShipDate = this.salesOrderService.dateFormat(pData.soPlannedShipDate);
        pData.soPlannedDlvyDate = (pData.soPlannedDlvyDate === '' || pData.soPlannedDlvyDate === null)
          ? null : this.salesOrderService.dateFormat(pData.soPlannedDlvyDate);
        pData.crossDockEnabled = pData.crossDockEnabled ? 'Y' : 'N';
        pData.soSourceHeaderId = pData.soId;
        pData.soSourceLineId = pData.soLineId;
        if (pData.select === true) {
          soLineArray.push(pData);
        }
      }
      data.addSalesOrderLines = soLineArray;
      return data;
    } else {
      data.addSalesOrderLines = soLineArray;
      return data;

    }
  }

  // select / unselect all wave line checkbox
  selectAll(action: string) {
    if (action === 'FROMHEADER') {
      for (const pData of this.rmaParameterData) {
        if (this.selectAllRow) {
          pData.select = true;
          this.isRowSelected = true;
        } else {
          pData.select = false;
          this.isRowSelected = false;
        }
      }
    } else {
      let selectRowCount = 0;
      for (const data of this.rmaParameterData) {
        if (data.select) {
          selectRowCount++;
        }
      }
      this.isRowSelected = selectRowCount > 0 ? true : false;
      if (selectRowCount === this.rmaParameterData.length) {
        this.selectAllRow = true;
      } else {
        this.selectAllRow = false;
      }
    }
  }

  onSubmitRMA(event: any) {
    if (event) {
      event.stopImmediatePropagation();

      if (this.salesOrderForm.valid) {
        if (!this.rmaParameterData.length) {
          this.openSnackBar('Please enter sales order line', '', 'error-snackbar');
          return
        }
        this.salesOrderForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
        const data = this.getRMALinesForAdd(this.salesOrderForm.value);
        if (data === 'validateError') {
          return
        }

        this.saveInprogress = true;
        this.salesOrderService.createSO(data)
          .subscribe(
            (resultData: any) => {
              this.saveInprogress = false;
              if (resultData.status === 200) {
                this.openSnackBar(resultData.message, '', 'success-snackbar');
                // this.openDialog('Success', resultData.message);
                this.closeDialog("RMA");
                this.router.navigate(['salesorders']);
              } else {
                this.openSnackBar(resultData.message, '', 'error-snackbar');
                this.closeDialog("RMA");
              }
            },
            error => {
              this.saveInprogress = false;
              this.openSnackBar(error.error.message, '', 'error-snackbar');
              this.closeDialog("RMA");
            }
          );
      } else {
        this.selectedRowIndex = null;
        for (const [i, pData] of this.rmaParameterData.entries()) {
          if (
            pData.soIuId === null ||
            pData.soItemId === null ||
            pData.soQtyUomCode === null ||
            pData.soLineQuantity === null
          ) {
            this.selectedRowIndex = i;
            break;
          }
        }
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
      }
    }
  }

  renderEditRoles(data) {

    for (const [index, pData] of data.entries()) {

      if (pData.crossDockEnabled === 'Y') {
        this.crossDockFlag = true;
      }

      if (pData.crossDockEnabled === 'N') {
        this.crossDockFlag = false;
      }
      if (pData.soRemainingQty === 0) {
        this.doRMAFlag = false;
      } else {
        this.doRMAFlag = true;
      }
      // doRMAFlag
      let obj = {
        soLineId: pData.soLineId,
        soId: pData.soId,
        soIuId: pData.soIuId,
        soLineNumber: pData.soLineNumber,
        soItemId: pData.soItemId,
        shipmentCreated: pData.shipmentCreated,
        crossDockEnabled: this.crossDockFlag,
        addCrossDock: [],
        updateCrossDock: pData.crossDockDetails,
        itemName: pData.itemName,
        soItemRevisionId: pData.soItemRevisionId,
        revsnNumber: pData.revsnNumber,
        UOM: pData.UOM,
        soQtyUomCode: pData.soQuantityUomCode,
        soLineQuantity: pData.soLineQuantity,
        soShippedQuantity: pData.soShippedQuantity,
        soLineStatus: pData.soLineStatus,
        soLinePriority: pData.soLinePriority,
        soLinePriorityName: pData.soLinePriorityName,
        soPlannedShipDate: pData.soShipmentPlannedDate,
        soPlannedDlvyDate: pData.soDeliveryPlannedDate,
        soNetWeight: pData.soNetWeight !== 0 ? pData.soNetWeight : null,
        soGrossWeight: pData.soGrossWeight !== 0 ? pData.soGrossWeight : null,
        soWeightUomCode: pData.soWeightUomCode,
        soReservedQuantity: pData.soReservedQuantity,
        soAllocatedQuantity: pData.soAllocatedQuantity,
        soVolume: pData.soVolume !== 0 ? pData.soVolume : null,
        soVolumeUomCode: pData.soVolumeUomCode,
        soRmaRoutingType: pData.soRmaRoutingType,
        weightUOM: pData.weightUOM,
        volumeUOM: pData.volumeUOM,
        soWaveEligibleQty: pData.soWaveEligibleQty,
        soItemRevisionList: [],
        action: '',
        editing: false,
        addNewRecord: false,
        isDefault: true,
        isReservedQtyLower: false,
        soRemainingQty: pData.soRemainingQty,
        returnableDate: pData.returnableDate
      }

      const temp: any = Object.assign({}, obj);
      temp.originalData = Object.assign({}, obj);

      this.parameterData.push(temp);
      this.getUOMList(pData.soItemId, index);
      this.getRevisionlist(pData.soItemId, index);


    } 
    
    // Sorting Start
    const sortState: Sort = {active: '', direction: ''};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    // Sorting End
     
    this.soLineDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    this.soLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.soLineDataSource.paginator = this.paginator;
    this.soLineDataSource.sort = this.sort;

  }

  addRow() {
    this.selectedRowIndex = null; 

      //Sorting will work in ascending order when page add new row function call   
    if(this.sort.direction === 'desc'){
      const sortState: Sort = {active: 'soLineNumber', direction: 'asc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      this.soLineDataSource.sort = this.sort;
      }
      
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
    let MaxLineNumber = 0;
    if (this.parameterData.length) {
      MaxLineNumber = Math.max.apply(Math, this.parameterData.map(function (key) { return key.soLineNumber; }))
    }
    this.isAdd = true;
    this.isEditRoles = false;
    let currentobj = this.iuList.find(obj => obj.value === this.iuId);
    let soIuId = null;
    if(currentobj){
      soIuId = currentobj.value;
    }     
    this.parameterData.push({
      //soIuId: this.iuList.length === 1 ? this.iuList[0].value : null,
      soIuId: soIuId,
      soLineNumber: this.isEdit ? MaxLineNumber + 1 : this.parameterData.length + 1,
      soItemId: null,
      shipmentCreated: 'N',
      showLov: 'hide',
      inlineSearchLoader: 'hide',
      soItemRevisionId: null,
      soItemRevisionList: [],
      soLineQuantity: null,
      soQtyUomCode: '',
      soShippedQuantity: null,
      soReservedQuantity: null,
      soAllocatedQuantity: null,
      soLineStatus: 'CREATED',
      soLinePriority: '',
      soPlannedShipDate: this.salesOrderService.dateFormat(new Date()),
      soPlannedDlvyDate: '',
      crossDockEnabled: false,
      soRmaRoutingType: '',
      addCrossDock: [],
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false,
      isReservedQtyLower: false,
      originalData: {}
    });
    // soNetWeight: null,
    // soGrossWeight: null,
    // soWeightUomCode: '',
    // soVolume: null,
    // soVolumeUomCode: '',

    this.soLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.paginator.pageIndex = Math.floor(this.parameterData.length / this.paginator.pageSize);
    this.soLineDataSource.paginator = this.paginator;
    this.soLineDataSource.sort = this.sort;
    setTimeout(() => {
      this.iuFields.last.focus();
    }, 100);
    // this.soLineDataSource.connect().subscribe(d => {
    //     this.soLineDataSource.sortData(this.soLineDataSource.filteredData,this.soLineDataSource.sort);
    // });
  }

  beginEdit(rowData: any, $event: any, index: any) {

    for (const pData of this.parameterData) {
      if (pData.addNewRecord === true) {
        this.openSnackBar('Please add your records first.', '', 'error-snackbar');
        return;
      }
    }

    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEditRoles = true;
      rowData.showLov = 'hide';
      rowData.inlineSearchLoader = 'hide';
      rowData.searchValue = rowData.itemName;
      if (rowData.crossDockEnabled === true) {
        // this.getCrossDockDetails(rowData.soLineId, index);
        // this.getPoList(rowData.soItemId, rowData.soIuId);
      }
    }
  }

  beginEditForRMA(rowData: any, $event: any, index: any) {
    for (const pData of this.rmaParameterData) {
      if (pData.addNewRecord === true) {
        this.openSnackBar('Please add your records first.', '', 'error-snackbar');
        return;
      }
    }
    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEditRoles = true;
      rowData.showLov = 'hide';
      rowData.inlineSearchLoader = 'hide';
      rowData.searchValue = rowData.itemName;
      if (rowData.crossDockEnabled === true) {
        this.getCrossDockDetails(rowData.soLineId, index);
        this.getPoList(rowData.soItemId, rowData.soIuId);
      }
    }
  }

  disableEdit(rowData: any, index: any) {
    if (rowData.editing === true) {
      this.parameterData[index].isDefault = this.parameterData[index].originalData.isDefault;
      this.parameterData[index].soIuId = this.parameterData[index].originalData.soIuId;
      this.parameterData[index].soLineNumber = this.parameterData[index].originalData.soLineNumber;
      this.parameterData[index].soItemId = this.parameterData[index].originalData.soItemId;
      this.parameterData[index].itemName = this.parameterData[index].originalData.itemName;
      this.parameterData[index].soItemRevisionId = this.parameterData[index].originalData.soItemRevisionId;
      this.parameterData[index].soLineQuantity = this.parameterData[index].originalData.soLineQuantity;
      this.parameterData[index].soReservedQuantity = this.parameterData[index].originalData.soReservedQuantity;
      this.parameterData[index].soAllocatedQuantity = this.parameterData[index].originalData.soAllocatedQuantity;
      this.parameterData[index].soQtyUomCode = this.parameterData[index].originalData.soQtyUomCode;
      this.parameterData[index].soShippedQuantity = this.parameterData[index].originalData.soShippedQuantity;
      this.parameterData[index].soLineStatus = this.parameterData[index].originalData.soLineStatus;
      this.parameterData[index].soLinePriority = this.parameterData[index].originalData.soLinePriority;
      this.parameterData[index].soPlannedShipDate = this.parameterData[index].originalData.soPlannedShipDate;
      this.parameterData[index].soPlannedDlvyDate = this.parameterData[index].originalData.soPlannedDlvyDate;
      this.parameterData[index].isReservedQtyLower = this.parameterData[index].originalData.isReservedQtyLower;
      this.parameterData[index].editing = false;
      this.isEditRoles = false;
    };
  }

  deleteRow(rowData: any, rowIndex: number) {
    if( this.parameterData.length < 2){
      this.openSnackBar('User should add atleast one SO line.', '', 'error-snackbar');
      return;
    }
    this.selectedRowIndex = null;
    this.currentIndex = rowIndex;
    this.parameterData.splice(rowIndex, 1);
    this.soLineDataSource = new MatTableDataSource<
      ParameterDataElement
    >(this.parameterData);
   
    this.checkIsAddRow();
    // let count = this.parameterData.length + 1;     
    // for (const pData of this.parameterData) {
    //   if(pData.addNewRecord){
    //     pData.soLineNumber = --count;
    //   }     
    // }
    let count = 0;
    for (const pData of this.parameterData) {
      if(count <= this.parameterData.length){
        pData.soLineNumber = ++count;         
      }     
    }
    this.soLineDataSource.paginator = this.paginator;
    this.soLineDataSource.sort = this.sort;
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

  checkReservedQty(evt: any, index: number) {
    const previousValue = this.parameterData[index].originalData.soLineQuantity;
    const currentValue = Number(this.parameterData[index].soReservedQuantity);
    if (currentValue > previousValue) {
      this.parameterData[index].isReservedQtyLower = true;
    } else {
      this.parameterData[index].isReservedQtyLower = false;
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
  }

  soReserveQuantityUpdate(index) {
    if ((Number(this.parameterData[index].soLineQuantity) !== 0) && Number(this.parameterData[index].soLineQuantity) < this.parameterData[index].originalData.soLineQuantity) {
      //  this.dialog.open(this.confirmationDialog);
      const dialogRef = this.dialog.open(this.confirmationDialog, {
        width: '500px',
        disableClose: true,
        data: { index: index, soLineQty: this.parameterData[index].soLineQuantity, soLinePreviousQty: this.parameterData[index].originalData.soLineQuantity }
      });

      dialogRef.afterClosed().subscribe(result => { 
      });
    }

  }

  updateReserveQuantity(event: any, index, soLineQty) {
    this.parameterData[index].soReservedQuantity = soLineQty;
    this.parameterData[index].originalData.soLineQuantity = soLineQty;
    this.dialog.closeAll();
  }

  closeConfirmationDialog(data) {
    this.parameterData[data.index].soLineQuantity = data.soLinePreviousQty;
    this.dialog.closeAll();

  }
  // open dialog
  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        type: dialogType,
        message: dialogMessage
      },
      disableClose: true
    });
  }

  // Get Lookup LOV's
  getLookUpLOV(lookupName: string) {
    if (lookupName === 'SO_TYPES') {
      this.typeList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.typeList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    if (lookupName === 'SO_STATUS') {
      this.statusList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            if(rowData.lookupValue === 'CREATED' && !this.isEdit){
              this.statusList.push({
                value: rowData.lookupValue,
                label: ''
              });
            }else{
            this.statusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
          }
        });
    }
    if (lookupName === 'SO_PRIORITY') {
      this.priorityList = [{ label: ' Please Select', value: '' }];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.priorityList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
  }

  ngAfterViewInit() {
    this.soLineDataSource.sort = this.sort;
    // this.soLineDataSource.connect().subscribe(d => {
    //     this.soLineDataSource.sortData(this.soLineDataSource.filteredData,this.soLineDataSource.sort);
    // });
    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10)
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(140);
  }
  ngOnDestroy(){
    this.timer ? this.timer.unsubscribe() : '';
  }
  sortChanged($event){
    // Added for pagination inilitization
    this.paginator.pageIndex = 0;             
    this.parameterData = this.soLineDataSource.sortData(this.soLineDataSource.filteredData, this.soLineDataSource.sort);      
   
}
}
