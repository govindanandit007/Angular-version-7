

import {
  Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, AfterViewInit, TemplateRef,
  ViewChildren
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog,
  MatTable, MatSort, Sort
} from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { QueryList } from '@angular/core';

import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';
import { JsonpInterceptor } from '@angular/common/http';

export interface ParameterDataElement {
  qtyPerUOM?: number;
  woLineId?: number;
  woLineIuId: number,
  woLineNumber: number,
  woCmpItemId: number,
  itemName?: string,
  showLov?: string,
  searchValue?: string,
  itemList?: any,
  inlineSearchLoader?: string,
  woCmpConsumedQty?: number,
  woReservedQuantity?: number,
  woAllocatedQuantity?: number,
  UOM?: string,
  woCmpUom: string,
  woCmpQty: number,
  revisionId?: number,
  woItemRevisionList?: any[],
  woCmpReqDate: string,
  woCmpCompDate: string,
  perAssembly?: number,
  action: string;
  editing: boolean;
  addNewRecord?: boolean;
  isDefault?: boolean;
  originalData?: any;
  UOMList?: any[];
  isReservedQtyLower?: boolean;
  woWaveEligibleQty?: any;
  createdBy?: any;
  updatedBy?: any;
}

export interface ParameterDataElementItemSearch {
  itemName: string;
  itemId: any;
  itemDescription: string;
}


@Component({
  selector: 'app-create-wo',
  templateUrl: './create-wo.component.html',
  styleUrls: ['./create-wo.component.css']
})

export class CreateWoComponent implements OnInit, AfterViewInit {

  parameterData: ParameterDataElement[] = [];
  woLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  isRefWo = false;
  formTitle: string;
  woId: number;
  workOrderForm: FormGroup;
  ouCodeList: any[] = [];
  statusList: any[] = [];
  typeList: any[] = [];
  subtypeList: any[] = [];
  woSubTypeList: any[] = [];
  priorityList: any[] = [];
  customerList: any[] = [];
  customerSiteList: any[] = [];
  iuList: any[] = [];
  itemList: any[] = [];
  itemComponentList: any[] = [];
  inlineStatusList: any[] = [];
  weightUomList: any[] = [];
  uomList: any[] = [];
  volumeUomList: any[] = [];
  showLov = 'hide';
  inlineSearchLoader = 'hide';
  inlineItemSearchLoader = 'hide';
  saveInprogress = false;
  crossDockFlag = false;
  minDate = new Date();


  currentDate = new Date;
  currentIndex: any = null;
  currentSelectedData: any = null;
  selectedRowIndex: any = null;
  itemSelectedRowIndex: any = null;
  searchItemName: any = '';
  searchDescription: any = '';
  isDailogOpen: any = false;
  disableCrossIcon: any = false;

  currentDialog: any = '';
  currentCrossIndex: any = null;

  listProgressPopup: any = false;
  itemTableMessage: any = '';
  parameterDataItemSearch: ParameterDataElementItemSearch[] = [];
  parameterDataSourceItemSearch = new MatTableDataSource<ParameterDataElementItemSearch>(this.parameterDataItemSearch);

  listProgressPopupCrossDock: any = false;
  crossDockTableMessage: any = 'No Data Found';

  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorSearchItem', { static: false }) paginatorSearchItem: MatPaginator;
  @ViewChild('paginatorCrossDock', { static: false }) paginatorCrossDock: MatPaginator;
  @ViewChildren('itemField') itemFields: QueryList<HTMLElement>;
  @ViewChild('myDialog', { static: true }) confirmationDialog: TemplateRef<any>;

  parameterDisplayedColumnsItemSearch: string[] = [
    'No',
    'itemName',
    'itemDescription'
  ];

  itemDialogColumns: any = [
    { field: 'No', name: '#', width: 75, baseWidth: 10 },
    { field: 'itemName', name: 'Item Name', width: 75, baseWidth: 20 },
    { field: 'itemDescription', name: 'Item Description', width: 75, baseWidth: 70 }
  ]

  woLineDisplayedColumns: string[] = [
    'woLineNumber',
    //  'woLineIuId',
    'woCmpItemId',
    'revisionId',
    'woCmpUom',
    'woCmpQty',
    'woCmpReqDate',
    'woCmpCompDate',
    //  'woCmpConsumedQty',
    'action'
  ];

  columns: any = [
    { field: 'woLineNumber', name: 'Line #', width: 75, baseWidth: 12 },
    // {field: 'woLineIuId', name: 'IU', width: 75, baseWidth: 11 },
    { field: 'woCmpItemId', name: 'Component Item', width: 75, baseWidth: 16 },
    { field: 'revisionId', name: 'Item Rev', width: 75, baseWidth: 11 },
    { field: 'woCmpUom', name: 'UOM', width: 75, baseWidth: 11 },
    { field: 'woCmpQty', name: 'Qty', width: 75, baseWidth: 10 },
    { field: 'woCmpReqDate', name: 'Required Date', width: 75, baseWidth: 14 },
    { field: 'woCmpCompDate', name: 'Completion Date', width: 75, baseWidth: 14 },
    // {field: 'woCmpConsumedQty', name: 'Consumed Qty', width: 75, baseWidth: 14 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 12 }
  ];


  systemDate: any = new Date();
  isAddCrossDock: boolean;
  isEditCrossDock: boolean;
  currentwoIuId: any;
  currentItemId: any;
  currentRoute: string;
  title: string;
  screenType: string;
  inlineWOSearchLoader: string = 'hide';
  showWOLov: string = 'hide';
  WOSearchValue: string = '';
  showItemLov: string = 'hide';
  searchValue: string;
  itemRevisionList: any[];
  iuSelected = null;
  iuId: number;
  refWOList: any;
  woActualQty: number = null;
  woQtyBasedOnUOM: number = null;
  woAssmItemId: number = null;
  woUom: any;
  woCmpReqDate: string;
  woCompletionDate: string;
  assemblyQtyPerUOM: any;
  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    private workOrderService: WorkOrderService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.currentRoute = this.router.url.split('/')[1]; 
    if (this.currentRoute === 'kitting') {
      this.title = 'Kitting';
      this.screenType = 'KT'
    } else {
      this.title = 'Dekitting';
      this.screenType = 'DKT';
    }
    
  }

  validationMessages = {
    woNumber: {
      required: 'WO Number is required.'
    },

    woType: {
      required: 'Type is required.'
    },
    woSubType: {
      required: 'Type is required.'
    },
    woStatus: {
      required: 'Status is required.'
    },
    woReqDate: {
      required: 'Date is required.'
    },
    woReqQty: {
      required: 'Quantity is required.'
    },
    woPriority: {
      required: 'Priority is required.'
    },
    woAssmItemId: {
      required: 'Item is required.'
    },
    woUOM: {
      required: 'UOM is required.'
    },
    woTpSiteId: {
      required: 'Customer site is required.'
    },
    woTpId: {
      required: 'Customer  is required.'
    }
  };

  woFormErrors = {
    woNumber: '',
    woOuId: '',
    woType: '',
    woSubType: '',
    woStatus: '',
    woReqDate: '',
    woReqQty: '',
    woPriority: '',
    woAssmItemId: '',
    woTpSiteId: '',
    woTpId: '',
    woUom: ''
  };


  ngOnInit() {
    this.defaultIUSelectionChange(this.iuId)
    this.workOrderService.defaultIuDataObservable.subscribe((data: any) => {
      
      this.defaultIUSelectionChange(data);
    });
    this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
    this.getLookUpLOV('SO_PRIORITY', this.screenType);
    this.getWoItemLov(); 
    this.route.params.subscribe(params => { 
      if (params.id) {
        this.formTitle = 'Edit ' + this.title + 'Work Order :';
        this.isEdit = true;
        this.workOrderFeedForm();
        this.woId = params.id;
        this.workOrderService
          .getWoById(params.id)
          .subscribe((data: any) => {
            this.workOrderForm.patchValue(data.result[0]);    
            this.workOrderForm.patchValue({ searchItemValue: data.result[0].assemblyItem });
            this.workOrderForm.patchValue({ woUom: data.result[0].woUom });
            this.workOrderForm.controls.woDescription.disable();
            this.workOrderForm.controls.woDescription.disable();
            this.workOrderForm.get('woReqDate').clearValidators();
            this.workOrderForm.get('woReqDate').updateValueAndValidity();
            this.workOrderForm.controls.woReqDate.disable();
            this.workOrderForm.controls.woCompletionDate.disable();
            this.getItemLovByScreen(decodeURI(data.result[0].assemblyItem), null);
            this.formTitle = 'Edit ' + this.title + ' Work Order :' + data.result[0].woNumber;
            this.renderEditRoles(data.result[0].woLineDetails);
          });
      } else { 
        this.iuSelected = this.iuId;
        this.workOrderFeedForm();
        this.formTitle = 'Create ' + this.title + ' Work Order :';
        // this.workOrderForm.patchValue({woType: 'STD'});
        this.workOrderForm.patchValue({ woStatus: 'CREATED' });
      }
    });
  }
  defaultIUSelectionChange(iuId) {
    this.iuId = iuId;
    if (!this.isEdit) { this.iuSelected = iuId; }

  }
  
  // Form Group
  workOrderFeedForm() {
    this.getLookUpLOV('WO_TYPES', this.screenType);
    this.getLookUpLOV('WO_STATUS', this.screenType);
    this.getLookUpLOV('WO_ACTIVITY_TYPE', this.screenType);
    if (!this.isEdit) {
      this.workOrderForm = this.fb.group({
        woAssmItemId: ['', Validators.required],
        woNumber: [{ value: '', disabled: true }],
        referenceWoId: [null],
        woRefNumber: [null],
        woSearchValue: [''],
        woIuId: [null],
        woReqQty: ['', Validators.required],
        woReqDate: [this.workOrderService.dateFormat(new Date()), Validators.required],
        woCompletionDate: [{ value: null, disabled: false }],
        woCompletionQty: [''],
        woDescription: [{ value: '', disabled: true }],
        woPriority: ['', Validators.required],
        woStatus: ['', Validators.required],
        woType: ['', Validators.required],
        woSubType: ['', Validators.required],
        woUom: ['', Validators.required],
        // woTpSiteId: ['', Validators.required],
        // woTpId: ['', Validators.required],
        searchValue: [''],
        searchItemValue: ['', Validators.required],
        woStatusName: [''],
        woSubTypeName: [''],
        itemCategoryId: [''],
        reqQty: [{ value: '', disabled: false }],

      });
      setTimeout(() => {
        this.addRow();
      }, 100);
     
    } else {
      this.workOrderForm = this.fb.group({
        woAssmItemId: ['', Validators.required],
        woNumber: [{ value: '', disabled: true }],
        woIuId: [null],
        referenceWoId: [null],
        woRefNumber: [null],
        woReqQty: [{ value: '', disabled: true }],
        woReqDate: [''],
        woCompletionDate: [{ value: '', disabled: true }],
        woCompletionQty: [''],
        woDescription: [{ value: '', disabled: true }],
        woPriority: ['', Validators.required],
        woStatus: ['', Validators.required],
        woType: ['', Validators.required],
        woSubType: ['', Validators.required],
        woUom: ['', Validators.required],
        // woTpSiteId: ['', Validators.required],
        // woTpId: ['', Validators.required],
        searchValue: [''],
        woStatusName: [{ value: '', disabled: true }],
        woSubTypeName: [{ value: '', disabled: true }],
        itemCategoryId: [''],
        searchItemValue: [''],
        reqQty: [{ value: '', disabled: false }],

      });
    }
  }

  // Get Operating Unit LOV
  getOperatingUnitLOV() {
    this.ouCodeList = [{ value: '', label: ' Please Select' }];
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
  getWoItemLov() {

    this.itemComponentList = [];
    this.workOrderService
      .getItemLOV()
      .subscribe((data: any) => {
        for (const itemData of data.result) {
          this.itemComponentList.push({
            value: Number(itemData.id),
            label: itemData.name,

          });
        }
      });
  }


  woLogValidationErrors(group: FormGroup = this.workOrderForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.woLogValidationErrors(abstractControl);
      } else {
        this.woFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.woFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  fetchNewSearchListForCustomer(event: any, index: any, searchFlag: any) {
    const value = this.workOrderForm.value.searchValue;
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
      this.getItemLovByScreenForCustomer(this.workOrderForm.value.searchValue, index, event)
    } else {
      this.showLov = 'hide';
      this.customerList = [{ value: '', label: ' Please Select' }];
      this.workOrderForm.patchValue({ woTpId: null });
      this.workOrderForm.patchValue({ searchValue: '' });
    }
  }

  getItemLovByScreenForCustomer(itemName, index, event) {
    this.commonService.getItemLovByScreen('tp-name', 'trading-partner', 'CUST', itemName).subscribe((data: any) => {
      this.customerList = [{ value: '', label: ' Please Select' }];

      if (data.result && data.result.length) {
        data = data.result;
        this.customerList = [];
        for (let i = 0; i < data.length; i++) {
          this.customerList.push({
            value: data[i].tpId,
            label: data[i].tpName
          })
        }
        this.inlineSearchLoader = 'hide';
        this.showLov = 'show';
        this.workOrderForm.patchValue({ searchValue: '' });

        // Set the first element of the search
        this.workOrderForm.patchValue({ woTpId: data[0].tpId });
      } else {
        this.inlineSearchLoader = 'hide';
        this.workOrderForm.patchValue({ searchValue: '' });
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


  iuSelectionChanged(event: any, Id: any, index) {
    if (!this.isEdit) {
      this.iuSelected = Id;
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

      });
    }
  }

  onWoReqDateChanged(event: any, index) {
    this.parameterData[index].woCmpCompDate = null;
  }

  searchItem(event: any, index: any, value: string, templateRef: TemplateRef<any>) {
    //if (this.isDailogOpen === true || (event.type === 'blur' &&  (!value || value.trim() === ''))) {
    if (this.isDailogOpen === true ) {
      return;
    }
    this.searchItemName = value
    this.parameterData[index].inlineSearchLoader = 'show';
    this.currentIndex = index;
    this.getItemLov(index, templateRef);
  }

  getItemLov(index?, templateRef?) {
    let itemNameEncoded = '';
    itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
    itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded;

    this.commonService.getItemLovByScreen('item', 'wo_components', null, itemNameEncoded).subscribe((data: any) => {
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
          this.parameterData[index].woCmpItemId = data[0].itemId;
          this.parameterData[index].searchValue = data[0].itemName;
          this.parameterData[index].itemName = data[0].itemName;
          this.disableCrossIcon = false;
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
    this.itemSelectedRowIndex = null;
    let itemNameEncoded = '';
    itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
    itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded;
    this.commonService.getItemLovByScreen('item', 'wo_components', null, itemNameEncoded).subscribe((data: any) => {
    
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

  itemFieldFocus(){
    this.disableCrossIcon = true
  }

  openItemListDialog(itemList, templateRef?: TemplateRef<any>) {
    this.disableCrossIcon = false
    this.parameterDataItemSearch = [];
    this.parameterDataSourceItemSearch = new MatTableDataSource<any>([]);
    this.currentDialog = 'item';
    this.isDailogOpen = true;
    if (itemList.length) {
      if (templateRef) {
        this.dialog.open(templateRef, {
          autoFocus: false,
          width: '70vw'
        });
      }
      this.dialog.afterAllClosed.subscribe(result => {
        this.updateCloseDialogData();
      });

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
        this.dialog.open(templateRef, {
          autoFocus: false,
          width: '70vw'
        });
        this.dialog.afterAllClosed.subscribe(result => {
          this.updateCloseDialogData();
        });
      }
    }

  }

  closeDialog() {
    this.dialog.closeAll();
    document.getElementById('row' + this.currentIndex).focus();
    this.parameterData[this.currentIndex].searchValue = this.parameterData[this.currentIndex].itemName;
    this.currentSelectedData = null;
    this.currentIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
    this.itemSelectedRowIndex = null;
    this.isDailogOpen = false;

  }

  getSelectedItemRecord(data, index) {
    this.itemSelectedRowIndex = index;
    this.currentSelectedData = data;
  }

  saveSelectedItem() {
    if (this.currentIndex !== null && this.currentSelectedData !== null) {
      this.parameterData[this.currentIndex].woCmpItemId = this.currentSelectedData.itemId;
      this.parameterData[this.currentIndex].itemName = this.currentSelectedData.itemName;
      this.parameterData[this.currentIndex].searchValue = this.currentSelectedData.itemName;

      this.getUOMList(this.currentSelectedData.itemId, this.currentIndex);
      this.getRevisionlist(this.currentSelectedData.itemId, this.currentIndex);
    }
    this.closeDialog();
  }

  clearSearchFields() {
    this.itemSelectedRowIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
  }
  // On Required date changed
  onRequiredDateChanged(event: any) {
    /* this block is commented to make wocompletiondate remains null on 11thMarch21 uncommented on 15thMarch */
    let requiredDate = new Date(this.workOrderForm.controls.woReqDate.value);
    let completionDate = new Date(this.workOrderForm.controls.woCompletionDate.value);    
    this.woCmpReqDate = this.workOrderForm.controls.woReqDate.value;   
    if(this.workOrderForm.controls.woCompletionDate.value){
    completionDate < requiredDate ? this.workOrderForm.patchValue({ woCompletionDate: this.workOrderForm.controls.woReqDate.value }) : '';
    this.woCompletionDate = this.workOrderForm.controls.woCompletionDate.value;
    }
    
    if(this.parameterData.length){
      for(const pData of this.parameterData){
          pData.woCmpReqDate = this.workOrderForm.controls.woReqDate.value; 
      }
    }
  }

  completionDateChange(event: any){
    this.woCompletionDate = this.workOrderForm.controls.woCompletionDate.value;
    if(this.parameterData.length){
      for(const pData of this.parameterData){
          pData.woCmpCompDate = this.workOrderForm.controls.woCompletionDate.value; 
      }
    }
  }

  //get revisionlist

  getRevisionlist(itemId, index) {

    this.commonService.getRevisionLovByItem(itemId)
      .subscribe(
        (data: any) => {
          if (data.status === 200) {
            if (data.result && data.result.length) {
              this.parameterData[index].woItemRevisionList = [];
              this.parameterData[index].revisionId = data.result[0].revsnId
              for (const rowData of data.result) {
                this.parameterData[index].woItemRevisionList.push({
                  value: rowData.revsnId,
                  label: rowData.revsnNumber
                });
              }
            } else {
              this.parameterData[index].woItemRevisionList = [{
                value: 0,
                label: '0'
              }];
              this.parameterData[index].revisionId = 0;

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
    this.workOrderService
      .getUomByItem(itemId)
      .subscribe((data: any) => { 
        this.parameterData[index].UOMList.push({
          value: data.result[0].primaryUomCode,
          label: data.result[0].psUnitOfMeasure,
          qtyPerUOM: Number(data.result[0].primaryUomConversionRate)
        });
        if (this.parameterData[index].editing) {
          this.parameterData[index].woCmpUom = data.result[0].primaryUomCode;
        }
        /*
        if (data.result[0].secondaryUomCode !== null) {
          this.parameterData[index].UOMList.push({
            value: data.result[0].secondaryUomCode,
            label: data.result[0].suUnitOfMeasure,
            qtyPerUOM: Number(data.result[0].secondaryUomConversionRate)
          });
        }*/

      });
  }

  // get UOM by item LOV
  onComponentItemChanged(event: any, element, index) {
    if (event.source.selected) {
      this.parameterData[index].UOMList = [];
      this.workOrderService.getUomByItem(Number(element)).subscribe((data: any) => {
        if (data.status === 200) {
          if (data.result) {
            this.parameterData[index].UOMList.push({
              value: data.result[0].primaryUomCode,
              label: data.result[0].psUnitOfMeasure,
              qtyPerUOM: Number(data.result[0].primaryUomConversionRate)
            });
            /* this block is commented because to display only primary uom
            if (data.result[0].secondaryUomCode !== null) {
              this.parameterData[index].UOMList.push({
                value: data.result[0].secondaryUomCode,
                label: data.result[0].suUnitOfMeasure,
                qtyPerUOM: Number(data.result[0].secondaryUomConversionRate)
              });
            }*/
          }
        }
      });
    }
  }
  onUOMChanged(event: any,i, element){
    if (event.source.selected && event.isUserInput) { 
       this.parameterData[i].qtyPerUOM = element.qtyPerUOM; 
    }
  }
  onHeaderUOMChanged(event: any, element){
    if (event.source.selected  && event.isUserInput) { 
      this.assemblyQtyPerUOM = element.qtyPerUOM; 
    }
  }
  
  onItemChanged(event: any, element) {
    if (event.source.selected  && event.isUserInput) {
      
      this.workOrderForm.patchValue({ woDescription: element.description });
            this.workOrderForm.patchValue({ itemCategoryId:element.itemCategoryId });
      
      this.workOrderService.getUomByItem(Number(element.value)).subscribe((data: any) => {
        if (data.status === 200) {
          if (data.result) {
            this.uomList = []; 
            this.uomList.push({
              value: data.result[0].primaryUomCode,
              label: data.result[0].psUnitOfMeasure,
              qtyPerUOM: Number(data.result[0].primaryUomConversionRate)
            });
             /* this block is commented because to display only primary uom
            if (data.result[0].secondaryUomCode !== null) {
              this.uomList.push({
                value: data.result[0].secondaryUomCode,
                label: data.result[0].suUnitOfMeasure,
                qtyPerUOM: Number(data.result[0].secondaryUomConversionRate)
              });
            } */
            if (!this.isEdit) {
              this.workOrderForm.patchValue({ woUom: this.uomList[0].value });
            }
          }
        }
      });
      document.getElementById('itemQty').focus();
    }

  }

  getUomLov(uomName: string) {
    if (uomName === 'Volume') {
      this.volumeUomList = [{ label: ' Please Select', value: '' }];
      this.workOrderService.getUomLOV(uomName).subscribe((data: any) => {
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
      this.workOrderService.getUomLOV(uomName).subscribe((data: any) => {
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

  getWOLinesForAdd(data) {
    const woLineArray = [];
    data.woReqDate = this.workOrderService.dateFormat(this.workOrderForm.controls.woReqDate.value);
    if(this.workOrderForm.controls.woCompletionDate.value){
      data.woCompletionDate = this.workOrderService.dateFormat(this.workOrderForm.controls.woCompletionDate.value);
      }
    data.woReqQty = Number(this.workOrderForm.controls.woReqQty.value);
    data.woDescription = this.workOrderForm.controls.woDescription.value;

    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {

        if (pData.woLineIuId === null || pData.woCmpItemId === null || pData.woCmpUom === null) {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.editing === true && pData.itemName !== pData.searchValue) {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (!pData.woCmpQty || Number(pData.woCmpQty) === 0) {
          this.selectedRowIndex = i;
          document.getElementById('row' + (i)).focus();
          this.openSnackBar('Component Quantity should be a non zero value in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (this.woLineQuantityCheck(i, 'submit') === '0') {
          this.selectedRowIndex = i;
          document.getElementById('row' + (i)).focus();
          this.openSnackBar('Component Quantity should be equal or in multiples of Required Quantity in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }

      }

      for (const [i, pData] of this.parameterData.entries()) {
        delete pData.action;
        delete pData.editing;
        delete pData.addNewRecord;
        delete pData.isDefault;
        delete pData.itemList;
        //delete pData.UOMList;
        delete pData.showLov;
        delete pData.woItemRevisionList;
        delete pData.inlineSearchLoader;
        pData.woLineIuId = this.iuId;
        pData.woCmpQty = pData.woCmpQty !== null ? Number(pData.woCmpQty) : 0;
        // pData.woCmpConsumedQty = pData.woCmpConsumedQty !== null ? Number(pData.woCmpConsumedQty) : 0;
        pData.woCmpReqDate = this.workOrderService.dateFormat(pData.woCmpReqDate);
        pData.woCmpCompDate = (pData.woCmpCompDate === '' || pData.woCmpCompDate === null)
          ? null : this.workOrderService.dateFormat(pData.woCmpCompDate);

        pData.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;

        woLineArray.push(pData);

      }
      data.addWorkOrderLines = woLineArray; 
      return data;
    } else {
      data.addWorkOrderLines = woLineArray;
      return data;

    }

  }

  getWOLinesForEdit(data) {

    const woLineArray = [];
    const updatewoLineArray = [];
    data.woReqDate = this.workOrderService.dateFormat(this.workOrderForm.controls.woReqDate.value);
    if(this.workOrderForm.controls.woCompletionDate.value){
    data.woCompletionDate = this.workOrderService.dateFormat(this.workOrderForm.controls.woCompletionDate.value);
    }
    data.woReqQty = Number(this.workOrderForm.controls.woReqQty.value);
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.woLineIuId === null || pData.woCmpItemId === null || pData.woCmpQty === null
          || pData.woCmpQty === null) {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.editing === true && pData.itemName !== pData.searchValue) {
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (!pData.woCmpQty || Number(pData.woCmpQty) === 0) {
          this.selectedRowIndex = i;
          document.getElementById('row' + (i)).focus();
          this.openSnackBar('Component Quantity should be a non zero value in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        if (this.woLineQuantityCheck(i, 'submit') === '0') {
          this.selectedRowIndex = i;
          document.getElementById('row' + (i)).focus();
          this.openSnackBar('Component Quantity should be equal or in multiples of Required Quantity in row ' + (i + 1), '', 'error-snackbar');
          return 'validateError';
        }
        

      }
      
      for (const [i, pData] of this.parameterData.entries()) {
        delete pData.action;
        delete pData.editing;
        delete pData.addNewRecord;
        delete pData.isDefault;
        delete pData.itemList;
        //delete pData.UOMList;
        delete pData.showLov;
        delete pData.woItemRevisionList;
        delete pData.inlineSearchLoader;
        pData.woCmpQty = pData.woCmpQty !== null ? Number(pData.woCmpQty) : 0;
        //pData.woCmpConsumedQty = pData.woCmpConsumedQty !== null ? Number(pData.woCmpConsumedQty) : 0;

        pData.woCmpReqDate = this.workOrderService.dateFormat(pData.woCmpReqDate);
        pData.woCmpCompDate = (pData.woCmpCompDate === '' || pData.woCmpCompDate === null)
          ? null : this.workOrderService.dateFormat(pData.woCmpCompDate);
        if (pData.woLineId) {
          if (pData.editing || this.isEdit) {
            pData.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
            updatewoLineArray.push(pData);

          }
        } else {
          pData.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          woLineArray.push(pData)
        }
      }

      data.addWorkOrderLines = woLineArray;
      data.updateWorkOrderLines = updatewoLineArray;
      return data;
    }
  }

  quantityFocusOut(event: any, index: any, value: any) {
    if (value && !this.isEdit && Number(value) === 0) {
      this.parameterData[index].woCmpQty = null;
    }
  }

  headerQuantityFocusOut(event: any) {
    const value = this.workOrderForm.value.woReqQty;

    if (value && Number(value) === 0) {
      this.workOrderForm.patchValue({ woReqQty: null });
    } else {
      this.workOrderForm.patchValue({ woReqQty: Number(value) });
    }
  }

  updateCloseDialogData() {

    if (this.currentDialog === 'item') {
      this.isDailogOpen = false;
    }
    this.currentDialog = '';

  }

  onSubmit(event: any, formId: any) {
    if (event) {
      event.stopImmediatePropagation();
      if (!this.isEdit) { 
        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
        this.iuSelected = this.iuId;
       }
      this.workOrderForm.controls["woIuId"].setValue(this.iuId);
      if(this.workOrderForm.controls["woAssmItemId"].value){
        this.workOrderForm.get('searchItemValue').clearValidators();
        this.workOrderForm.get('searchItemValue').updateValueAndValidity();
      }
      if (this.workOrderForm.valid && Number(this.workOrderForm.value.woReqQty) !== 0) {
        if (this.isRefWo && this.isEdit) {
          this.calculateDekitLineQty();
          this.workOrderForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          this.workOrderForm.controls["referenceWoId"].setValue(this.workOrderForm.value.woRefNumber);
          this.workOrderForm.controls["woAssmItemId"].setValue(this.woAssmItemId);
          this.workOrderForm.controls["woUom"].setValue(this.woUom);

          this.workOrderForm.value.woSubType = 'DIS';

          //this.workOrderForm.value.woUom = this.woAssmItemId;
          const data = this.getWOLinesForAdd(this.workOrderForm.value);
          if (data === 'validateError') {
            return;
          }
          data.woCompletionQty = null;
          this.saveInprogress = true;
          this.workOrderService.createWO(data)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openDialog('Success', resultData.message);
                  this.router.navigate([this.currentRoute]);
                } else {
                  this.saveInprogress = false;
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        }
        if (this.isEdit && !this.isRefWo) {
          this.workOrderForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;

          const data = this.getWOLinesForEdit(this.workOrderForm.value);
          if (data === 'validateError') {
            return
          }
          this.saveInprogress = true;
          data.woCompletionQty = null;
          this.workOrderService
            .updateWO(data, this.woId)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate([this.currentRoute]);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        } else if (!this.isEdit && !this.isRefWo) {
          if (!this.parameterData.length) {
            this.openSnackBar('Please enter work order line', '', 'error-snackbar');
            return;
          }
          this.workOrderForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;

          const data = this.getWOLinesForAdd(this.workOrderForm.value);
          if (data === 'validateError') {
            return;
          }
          data.woCompletionQty = null;
          this.saveInprogress = true;
          this.workOrderService.createWO(data)
            .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openDialog('Success', resultData.message);
                  this.router.navigate([this.currentRoute]);
                } else {
                  this.saveInprogress = false;
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        }
      } else {
        this.selectedRowIndex = null;
        for (const [i, pData] of this.parameterData.entries()) {
          if (
            pData.woLineIuId === null ||
            pData.woCmpItemId === null ||
            pData.woCmpUom === null ||
            pData.woCmpQty === null
          ) {
            this.selectedRowIndex = i;
            break;
          }
        }
        if (!this.workOrderForm.valid) {
          this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
        }
        else if (Number(this.workOrderForm.value.woReqQty) === 0) {
          document.getElementById('itemQty').focus();
          this.openSnackBar('Required Quantity can\'t be a zero', '', 'error-snackbar');
        }
      }
    }
  }

  renderEditRoles(data) {
    this.parameterData = [];
    for (const [index, pData] of data.entries()) {
      if (!this.iuSelected) {
        this.iuSelected = pData.woLineIuId;
      }

      let obj = {
        woLineId: pData.woLineId,
        woLineIuId: pData.woLineIuId,
        woLineNumber: pData.woLineNumber,
        woCmpItemId: pData.woCmpItemId,
        perAssembly: pData.perAssembly,
        itemName: pData.itemName,
        revsnNumber: pData.revsnNumber,
        woCmpUom: pData.woCmpUom,

        woCmpQty: pData.woCmpQty,
        woCmpConsumedQty: pData.woCmpConsumedQty,

        woCmpCompDate: pData.woCmpCompDate,
        woCmpReqDate: pData.woCmpReqDate,

        woItemRevisionList: [],
        action: '',
        editing: false,
        addNewRecord: false,
        isDefault: true,
        isReservedQtyLower: false,
      }
      const temp: any = Object.assign({}, obj);
      temp.originalData = Object.assign({}, obj);
      this.parameterData.push(temp);
      this.getUOMList(pData.woCmpItemId, index);
      this.getRevisionlist(pData.woCmpItemId, index);
    }
    this.woLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);  
    // Sorting Start
    const sortState: Sort = {active: '', direction: ''};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    // Sorting End
    this.woLineDataSource.sort = this.sort;
    this.woLineDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    this.woLineDataSource.paginator = this.paginator;
  }

  addRow() {
    this.selectedRowIndex = null;     
    //Sorting will work in ascending order when page add new row function call   
    if(this.sort.direction === 'desc'){
    const sortState: Sort = {active: 'woLineNumber', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.woLineDataSource.sort = this.sort;
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
      //  if (pData.inlineSearchLoader === 'show') {
      //   this.openSnackBar('Please update your record first.', '', 'error-snackbar');
      //   return;
      // }
    }
    let MaxLineNumber = 0;
    if (this.parameterData.length) {
      MaxLineNumber = Math.max.apply(Math, this.parameterData.map(function (key) { return key.woLineNumber; }))
    }
    
    this.isAdd = true;
    this.isEditRoles = false;
    this.woCmpReqDate = this.workOrderForm.controls.woReqDate.value;
    this.woCompletionDate = this.workOrderForm.controls.woCompletionDate.value;
     
    if(this.isEdit){
      this.woCmpReqDate = this.workOrderService.dateFormat(new Date());
    }
    
     
    this.parameterData.push({
      woLineIuId: this.iuSelected ? this.iuSelected : null,
      woLineNumber: this.isEdit ? MaxLineNumber + 1 : this.parameterData.length + 1,
      woCmpItemId: null,
      showLov: 'hide',
      inlineSearchLoader: 'hide',
      woCmpQty: null,
      woCmpUom: '',
      perAssembly: null,
      woCmpReqDate: this.woCmpReqDate,
      woCmpCompDate: this.woCompletionDate,
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false,
      isReservedQtyLower: false,
    });
    this.woLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
     
    this.paginator.pageIndex = Math.floor(this.parameterData.length / this.paginator.pageSize);
    this.woLineDataSource.paginator = this.paginator;
  }

  beginEdit(rowData: any, $event: any, index: any) {
    if (this.isRefWo) {
      this.openSnackBar('Line Can not be edited', '', 'error-snackbar');
      return;
    }
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

    }
  }

  disableEdit(rowData: any, index: any) {
    if (rowData.editing === true) {
      this.parameterData[index].isDefault = this.parameterData[index].originalData.isDefault;
      this.parameterData[index].woLineIuId = this.parameterData[index].originalData.woLineIuId;
      this.parameterData[index].woLineNumber = this.parameterData[index].originalData.woLineNumber;
      this.parameterData[index].woCmpItemId = this.parameterData[index].originalData.woCmpItemId;
      this.parameterData[index].itemName = this.parameterData[index].originalData.itemName;
      this.parameterData[index].perAssembly = this.parameterData[index].originalData.perAssembly;
      this.parameterData[index].woCmpQty = this.parameterData[index].originalData.woCmpQty;
      this.parameterData[index].woCmpUom = this.parameterData[index].originalData.woCmpUom;
      this.parameterData[index].woCmpConsumedQty = this.parameterData[index].originalData.woCmpConsumedQty;
      this.parameterData[index].woCmpReqDate = this.parameterData[index].originalData.woCmpReqDate;
      this.parameterData[index].woCmpCompDate = this.parameterData[index].originalData.woCmpCompDate;
      this.parameterData[index].editing = false;
      this.isEditRoles = false;
    };
  }

  deleteRow(rowData: any, rowIndex: number) {
    this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.woLineDataSource = new MatTableDataSource<
      ParameterDataElement
    >(this.parameterData);
    
    this.checkIsAddRow();
    let count = 0;
    for (const pData of this.parameterData) {
      if(count <= this.parameterData.length){
        pData.woLineNumber = ++count;         
      }     
    }
    this.woLineDataSource.paginator = this.paginator;
    this.woLineDataSource.sort = this.sort;
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
    const currentValue = Number(this.parameterData[index].woReservedQuantity);
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
  calculateDekitLineQty() {
    if (this.isRefWo) {
      const value = this.workOrderForm.value.woReqQty;
      if (value > this.woActualQty) {
        this.workOrderForm.controls['woReqQty'].setValue(this.woActualQty);
        for (const [i, pdata] of this.parameterData.entries()) {
          this.parameterData[i].woCmpQty = pdata.originalData.woCmpQty;
        }
        this.openSnackBar('Work Order Quantity should be equal or less than the Actual Required Quantity- ' + this.woActualQty, '', 'error-snackbar');
        return;
      }
      const assemblyItemQty = Number(value);
      for (const [i, pdata] of this.parameterData.entries()) {
        this.parameterData[i].woCmpQty = pdata.perAssembly * assemblyItemQty;
      }
    }
  }
  woLineQuantityCheck(index, from) {
    if(!this.parameterData[index].editing) {
      return '1';
    } 
    const value = this.workOrderForm.value.woReqQty;
    let assemblyItemQty = Number(value);
    let componentQty = Number(this.parameterData[index].woCmpQty);
    const componentQtyPerUom = Number(this.parameterData[index].qtyPerUOM);
   // componentQty = componentQty * componentQtyPerUom;
    //assemblyItemQty = assemblyItemQty * this.assemblyQtyPerUOM;
     
    if (value && assemblyItemQty !== 0 && componentQty !== 0) {
      let rem = componentQty % assemblyItemQty;
      if (from && rem !== 0) {
        return '0';
      }
      if (rem !== 0) {
        document.getElementById('row' + index).focus();
        this.openSnackBar('Component Quantity should be equal or in multiples of Required Quantity', '', 'error-snackbar');
        return '0';
      }
    }
    return '1';

  } 
  soReserveQuantityUpdate(index) {
    if (this.parameterData[index].woCmpQty < this.parameterData[index].originalData.woCmpQty) {
      // this.dialog.open(this.confirmationDialog);
      const dialogRef = this.dialog.open(this.confirmationDialog, {
        width: '500px',
        data: { index: index, woCmpQty: this.parameterData[index].woCmpQty, woLinePreviousQty: this.parameterData[index].originalData.woCmpQty }
      });

      dialogRef.afterClosed().subscribe(result => { 
      });
    }

  }
  updateReserveQuantity(event: any, index, woLineQty) {
    this.parameterData[index].woReservedQuantity = woLineQty;
    this.parameterData[index].originalData.soLineQuantity = woLineQty;
    this.dialog.closeAll();
  }

  closeConfirmationDialog(data) {
    this.parameterData[data.index].woCmpQty = data.woLinePreviousQty;
    this.dialog.closeAll();

  }
  // open dialog
  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        type: dialogType,
        message: dialogMessage
      }
    });
  }

  // Get Lookup LOV's
  getLookUpLOV(lookupName: string, screenType: string) {
    const methodType = this.isEdit ? 'Update' : 'Create';
    let data = { lookupName: lookupName, screenType: screenType, methodType: methodType };
    if (lookupName === 'WO_TYPES') {
      this.typeList = [{ label: ' Please Select', value: '' }];
      this.workOrderService
        .getWoLookupLOVBased(data)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.typeList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });

          }
          if (screenType === 'KT') {
            let currentobj = this.typeList.find(d => d.value === 'STANDARD');
            if (currentobj) {
              this.workOrderForm.controls["woType"].setValue(currentobj.value);
            }
          }
          if (screenType === 'DKT') {
            let currentobj = this.typeList.find(d => d.value === 'NON_STANDARD');
            if (currentobj) {
              this.workOrderForm.controls["woType"].setValue(currentobj.value);
            }
          }
        });
    }
    if (lookupName === 'WO_STATUS') {
      this.statusList = [{ label: ' Please Select', value: '' }];
      this.workOrderService
        .getWoLookupLOVBased(data)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.statusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });//UNRELEASED
          }
          if (screenType === 'KT') {
            let currentobj = this.statusList.find(d => d.value === 'UNRELEASED');
            if (currentobj) {
              this.workOrderForm.controls["woStatus"].setValue(currentobj.value);
            }
          }
          if (screenType === 'DKT') {
            let currentobj = this.statusList.find(d => d.value === 'UNRELEASED');
            if (currentobj) {
              this.workOrderForm.controls["woStatus"].setValue(currentobj.value);
            }
          }
        });

    }
    if (lookupName === 'WO_ACTIVITY_TYPE') {
      this.woSubTypeList = [{ label: ' Please Select', value: '' }];
      this.workOrderService
        .getWoLookupLOVBased(data)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.woSubTypeList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
          if (screenType === 'KT') {
            let currentobj = this.woSubTypeList.find(d => d.value === 'ASM');
            if (currentobj) {
              this.workOrderForm.controls["woSubType"].setValue(currentobj.value);
            }
          }
          if (screenType === 'DKT') {
            let currentobj = this.woSubTypeList.find(d => d.value === 'DIS');
            if (currentobj) {
              this.workOrderForm.controls["woSubType"].setValue(currentobj.value);
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
          let currentobj = this.priorityList.find(d => d.value === 'MEDIUM');
          this.workOrderForm.controls["woPriority"].setValue(currentobj.value);
        });

    }
  } 
  ngAfterViewInit() {
    this.woLineDataSource.sort = this.sort;
    this.woLineDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10)
    }, 100);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(206);
  }

  fetchNewSearchList(event: any, index: any, searchFlag: any) {
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }

    if (!searchFlag && charCode !== 13) {
      return;
    }

    if (this.showItemLov === 'hide') {
      this.inlineItemSearchLoader = 'show';
      this.getItemLovByScreen(this.workOrderForm.value.searchItemValue, event);
    } else {
      this.showItemLov = 'hide';
      this.searchValue = '';
      this.itemList = [{ value: '', label: ' Please Select', description: '', itemCategoryId: '' }];
      this.workOrderForm.patchValue({ woAssmItemId: null });
      this.workOrderForm.patchValue({ searchItemValue: '' });
    }
  }

  getItemLovByScreen(itemName, event) { 
    this.commonService
      .getItemLovByScreen('item', 'wo', null, itemName)
      .subscribe(
        (data: any) => {
          this.itemList = [{ value: '', label: ' Please Select', description: '', itemCategoryId: '' }];

          if (data.result && data.result.length) {
            data = data.result;
            this.itemList = [];
            for (let i = 0; i < data.length; i++) {
              this.itemList.push({
                value: Number(data[i].itemId),
                label: data[i].itemName,
                description: data[i].itemDescription,
                itemCategoryId: data[i].itemCategoryId,
              });
            }
            this.inlineItemSearchLoader = 'hide';
            this.showItemLov = 'show';
            this.searchValue = '';

            // Set the first element of the search

            this.workOrderForm.patchValue({ woAssmItemId: data[0].itemId });
            this.workOrderForm.patchValue({ woDescription: data[0].itemDescription });
            this.workOrderForm.patchValue({ itemCategoryId: data[0].itemCategoryId });
            this.workOrderForm.patchValue({ searchItemValue: '' });
             
          } else {
            this.inlineItemSearchLoader = 'hide';
            this.workOrderForm.patchValue({ woAssmItemId: null });
            this.workOrderForm.patchValue({ woDescription: '' });
            this.workOrderForm.patchValue({ itemCategoryId: '' });
            this.workOrderForm.patchValue({ searchItemValue: '' });
            this.openSnackBar(
              'No match found',
              '',
              'error-snackbar'
            );
          }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
  }

  getItemReVision() {
    this.workOrderService.getItemReVision().subscribe((data: any) => {
      this.itemRevisionList = [];
      for (const items of data.result) {
        this.itemRevisionList.push({
          value: items.revsnId,
          label: items.revsnNumber,
          revsnItemId: items.revsnItemId,
          isRevisionCntrld: items.revsnEnabledFlag
        });
      }
    });
  }
  openConfirmationDialog() {
    this.commonService.openConfirmationDialog('Work order', this.currentRoute)
  }
  sortChanged($event?){
    // Added for pagination inilitization
    this.paginator.pageIndex = 0;             
    this.parameterData = this.woLineDataSource.sortData(this.woLineDataSource.filteredData, this.woLineDataSource.sort);      
   
}
}


