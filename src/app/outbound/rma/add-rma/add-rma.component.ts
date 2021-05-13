import {
  Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, AfterViewInit, TemplateRef,
  ViewChildren
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog,
  MatTable, MatSort
} from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { SalesOrderService } from 'src/app/_services/outbound/sales-order.service';
import { SystemOptionService } from 'src/app/_services/settings/system-option.service';
import { QueryList } from '@angular/core';
import { JsonExporterService } from 'mat-table-exporter';

export interface ParameterDataElement {
  select: boolean;
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
  soItemRevisionList: any;
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

@Component({
  selector: 'app-add-rma',
  templateUrl: './add-rma.component.html',
  styleUrls: ['./add-rma.component.css']
})
export class AddRmaComponent implements OnInit {

  orginalParameterData: ParameterDataElement[] = [];
  rmaParameterData: ParameterDataElement[] = [];
  rmaLineDataSource = new MatTableDataSource<ParameterDataElement>(this.rmaParameterData);
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  soId: number;
  redirectionType = '';
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
  currentCrossIndex: any = null;
  systemDate: any = new Date();
  isAddCrossDock: boolean;
  isEditCrossDock: boolean;
  currentsoIuId: any;
  currentItemId: any;
  soNumValue: any;
  soTypeValue: any;
  soStatusValue: any;
  isRowSelected: boolean = true;
  selectAllRow: boolean = false;
  tooltipPosition: TooltipPosition[] = ['below'];
  fromSO: boolean = false;
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  soLineDisplayedColumns: string[] = [
    'soLineNumber',
    'soItemId',
    'soItemRevisionId',
    'soQtyUomCode',
    'soLineQuantity',
    'soShippedQuantity',
    'soReservedQuantity',
    'soAllocatedQuantity',
    'soLineStatus',
    'soLinePriority',
    'soPlannedShipDate',
    'soPlannedDlvyDate',
    'crossDockEnabled',
    'action'
  ];

  rmaLineDisplayedColumns: string[] = [
    'select',
    'soLineNumber',
    'rmaSoLineNum',
    'soItemId',
    'soItemRevisionId',
    'soQtyUomCode',
    'rmaSoLineQty',
    'soRemainingQty',
    'soLineQuantity',
    'soReservedQuantity',
    // 'soLineReceiptQty',
    'soRmaRoutingType',
    'soLineStatus',
    'returnableDate',
    'action'
  ];

  columns: any = [
    { field: 'soLineNumber', name: 'RMA Line #', width: 75, baseWidth: 8 },
    { field: 'soIuId', name: 'IU', width: 75, baseWidth: 4 },
    { field: 'soItemId', name: 'Item', width: 75, baseWidth: 5 },
    { field: 'soItemRevisionId', name: 'Item Revision', width: 75, baseWidth: 12 },
    { field: 'soQtyUomCode', name: 'UOM', width: 75, baseWidth: 5 },
    { field: 'soLineQuantity', name: 'RMA Qty', width: 75, baseWidth: 5 },
    { field: 'rmaSoLineQty', name: 'Shipped Qty', width: 75, baseWidth: 7 },
    { field: 'soReservedQuantity', name: 'Received Qty', width: 75, baseWidth: 5 },
    { field: 'soAllocatedQuantity', name: 'Allocated Qty', width: 75, baseWidth: 7 },
    { field: 'soLineStatus', name: 'Status', width: 75, baseWidth: 8 },
    { field: 'soLinePriority', name: 'Priority', width: 75, baseWidth: 4 },
    { field: 'soPlannedShipDate', name: 'Planned Ship Date', width: 75, baseWidth: 9 },
    { field: 'soPlannedDlvyDate', name: 'Planned Delivery Date', width: 75, baseWidth: 10 },
    { field: 'soRmaRoutingType', name: 'Receipt routing', width: 75, baseWidth: 15 },
    { field: 'crossDockEnabled', name: 'Cross Dock Enabled', width: 75, baseWidth: 10 },
    { field: 'rmaSoLineNum', name: 'SO Line #', width: 75, baseWidth: 7 },
    { field: 'returnableDate', name: 'Returnable Date', width: 75, baseWidth: 21 },
    { field: 'soRemainingQty', name: 'SO Rem Qty', width: 75, baseWidth: 12 },
    { field: 'soLineReceiptQty', name: 'Received Qty', width: 75, baseWidth: 12 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 10 },
    { field: 'select', name: 'Selection Check', width: 75, baseWidth: 5 },
    
  ];



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

  ngOnInit() {
    this.getOperatingUnitLOV();
    this.getLookUpLOV('SO_TYPES');
    this.getLookUpLOV('RMA_STATUS');
    this.getLookUpLOV('SO_PRIORITY');
    this.commonService.getScreenSize(140);
    this.isEdit = false;
    this.route.params.subscribe(params => {
      // console.log('ng on init');
      if (params.id) {
        let id = null;
        if(params.id.includes('#')){
          id = params.id.split('#')[0];
          this.redirectionType = params.id.split('#')[1];
        }else{
          id = params.id;
          this.redirectionType = '';
        }
        this.fromSO = params.type ? true : false;
        console.log(this.fromSO);
        this.salesOrderFeedForm();
        this.formTitle = 'Create RMA :';
        this.soId = id;
        this.salesOrderService
          .getSoById(id)
          .subscribe((data: any) => {
            this.salesOrderForm.patchValue(data.result[0]);
            console.log(data.result);
            this.salesOrderForm.patchValue({ searchValue: data.result[0].tpName });
            setTimeout(()=>{
              // this.salesOrderForm.patchValue({soNumber: ''});
              this.salesOrderForm.patchValue({soType: 'RMA'});
              this.salesOrderForm.patchValue({soDate: this.salesOrderService.dateFormat(new Date())});
              this.salesOrderForm.patchValue({soStatus: 'CREATED'});
            }, 0);
            this.salesOrderForm.controls.searchValue.disable();
            this.salesOrderForm.get('soDate').clearValidators();
            this.salesOrderForm.get('soDate').updateValueAndValidity();
            this.customerSelectionChanged({source : {selected : true}, isUserInput : true} , data.result[0].soTpId);
            this.formTitle = 'Create RMA : ';
            if(data.result[0].rmaNumber === null && data.result[0].rmaStatus === null){
              this.isEdit = false;
              this.salesOrderForm.patchValue({rmaNumber: ''});
            }
            if(data.result[0].soStatus === 'CREATED'){
              this.isEdit = true;
              this.formTitle = 'Edit RMA : ' + data.result[0].rmaNumber;
            }
            if(data.result[0].soStatus === 'INRECVNG' || data.result[0].soStatus === 'RECEIVED'){
              this.isEdit = false;
              this.salesOrderForm.patchValue({rmaNumber: ''});
            }
            // + data.result[0].soNumber
            if (data.result[0].soLineDetails) {
              this.renderEditRoles(data.result[0].soLineDetails);
            }
            this.salesOrderStatus = this.salesOrderForm.get('soStatus').value;
          });
      } else {
        console.log('ng on init else');
        this.salesOrderFeedForm();
        this.formTitle = 'Create RMA :';
        this.salesOrderForm.patchValue({ soType: 'RMA' });
        this.salesOrderForm.patchValue({ soStatus: 'CREATED' });
      }
    });
  }

  // Form Group
  salesOrderFeedForm() {
    this.salesOrderForm = this.fb.group({
      soNumber: [{ value: '', disabled: true }],
      rmaNumber: [{ value: '', disabled: true }],
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

  // IU LOV on OU Selection Changed
  ouSelectionChanged(event: any, Id: number) {
    if (event.source.selected) {
      this.commonService.getIUBasedOnOULOV(Id).subscribe((data: any) => {
        this.iuList = [];
        if (data.result && data.result.length) {
          for (const IUData of data.result) {
            this.iuList.push({
              value: IUData.iuId,
              label: IUData.iuCode
            });
          }
        }
      });
      for (const item of this.rmaParameterData) {
        item.addCrossDock = [];
      }
    }
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
      rowData.soLineQuantity = this.isEdit ? rowData.soLineQuantity : null;
      rowData.showLov = 'hide';
      rowData.inlineSearchLoader = 'hide';
      rowData.searchValue = rowData.itemName;
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

      let obj = {
        select: (pData.soRemainingQty !== 0) ? true : false,
        soLineId: pData.soLineId,
        soId: pData.soId,
        soIuId: pData.soIuId,
        soLineNumber: pData.soLineNumber,
        rmaSoLineNum: pData.rmaSoLineNum,
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
        soLineStatus: 'CREATED',
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
        soRmaRoutingType: "2STEP",
        weightUOM: pData.weightUOM,
        volumeUOM: pData.volumeUOM,
        soWaveEligibleQty: pData.soWaveEligibleQty,
        soItemRevisionList: [],
        action: '',
        editing: false,
        addNewRecord: false,
        isDefault: true,
        isReservedQtyLower: false,
        rmaValueList: [],
        soRemainingQty:pData.soRemainingQty,
        returnableDate:pData.returnableDate,
        soSourceHeaderId : pData.soSourceHeaderId  ? pData.soSourceHeaderId : pData.soId,
        soSourceLineId : pData.soSourceLineId ? pData.soSourceLineId : pData.soLineId,
        rmaSoLineQty: pData.rmaSoLineQty,
        soLineReceiptQty: pData.soLineReceiptQty
      }

      const temp: any = Object.assign({}, obj);
      const mainTemp: any = Object.assign({}, obj);
      temp.originalData = Object.assign({}, obj);
      this.rmaParameterData.push(temp);
      this.orginalParameterData.push(mainTemp);
    }
    this.getValueLov(8);
    this.rmaLineDataSource = new MatTableDataSource<ParameterDataElement>(this.rmaParameterData);
    this.rmaLineDataSource.paginator = this.paginator;
    this.rmaLineDataSource.sort = this.sort;
    this.selectAll('FROMHEADER');
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
        console.log(this.rmaParameterData);
      });
  }

  disableRMAEdit(rowData: any, index: any) {
    this.selectedRowIndex = null;
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

  quantityRMAFocusOut(event:any, index: any, value: any){
   if(this.isEdit === false){    
      if(Number(value) > this.orginalParameterData[index].soRemainingQty){
        this.rmaParameterData[index].soLineQuantity = this.isEdit ? this.orginalParameterData[index].soLineQuantity : null;
        this.openSnackBar('Please enter less than or equal to SO remaining quantity', '', 'error-snackbar');
        return '0';
      }
      return '1';
    } 
    return '1';
  }
  quantityRMASubmit(event:any, index: any, value: any){         
    if(!this.isEdit){
      if(Number(value) > this.orginalParameterData[index].soRemainingQty){        
        document.getElementById('row' + index).focus();
        this.openSnackBar('Please enter less than or equal to SO remaining quantity', '', 'error-snackbar');
        return '0';
      }      
    } 
      this.selectedRowIndex = null;
      return '1';    
  }
  
  cancelRMA() {
    if(this.redirectionType === 'SO'){
      this.commonService.openConfirmationDialog('SO','salesorders');
    }else{
      this.commonService.openConfirmationDialog('RMA','rma');
    }
    this.currentSelectedData = null;
    this.currentIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
    this.selectedRowIndex = null;
    this.isDailogOpen = false;    
  }

  clearSearchFields() {
    this.searchItemName = '';
    this.searchDescription = '';
    this.currentSelectedData = null;
    this.currentIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
    this.selectedRowIndex = null;
    this.isDailogOpen = false;
  }

  getRMALinesForAdd(data) {
    const soLineArray = [];
    this.selectedRowIndex = null;
    data.soDate = this.salesOrderService.dateFormat(this.salesOrderForm.controls.soDate.value);
    if(this.isEdit){
      data.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
    }else{
      data.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
    }
    if (this.rmaParameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.rmaParameterData.entries()) {
        if(pData.editing && (!pData.soLineQuantity || pData.soLineQuantity <= 0)){
          this.selectedRowIndex = i;
          this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
          return 'validateError';
        }
        if(!pData.editing && pData.select && (!pData.soLineQuantity || pData.soLineQuantity <= 0)){
          this.selectedRowIndex = i;
          this.openSnackBar('Please click on edit to enter RMA quantity', '', 'error-snackbar');
          return 'validateError';
        }
        if(!pData.editing && pData.select && !this.isEdit){
          this.selectedRowIndex = i;
          this.openSnackBar('Please enter RMA quantity for selected RMA Line', '', 'error-snackbar');
          return 'validateError';
        }
        if(pData.editing && this.quantityRMASubmit(null,i,pData.soLineQuantity) === '0'){
          this.selectedRowIndex = i;
          this.rmaParameterData[i].soLineQuantity = this.isEdit ? this.orginalParameterData[i].soLineQuantity : pData.soLineQuantity;
          this.saveInprogress = false;
          return 'validateError';
        }
        
        this.selectedRowIndex = null;
        delete pData.action;
        // delete pData.editing;
        // delete pData.addNewRecord;
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
        pData.soSourceHeaderId = pData.soSourceHeaderId;
        pData.soSourceLineId = pData.soSourceLineId;
        if(pData.select === true){
          soLineArray.push(pData);
        }
      }
      console.log(soLineArray);
      if(this.isEdit){
        data.updateSalesOrderLines = soLineArray;
      }else{
        data.addSalesOrderLines = soLineArray;
      }
      return data;
    }
  }

  // select / unselect all wave line checkbox
  selectAll(action:string){  
    let selectRowCount = 0;
    if(action === 'FROMHEADER' && !this.isEdit){
      this.isRowSelected = false;       
      for(const pData of this.rmaParameterData){
        if(this.selectAllRow){          
          if((pData.soRemainingQty !== 0 && this.isEdit)){           
            this.isRowSelected = true;
            pData.select = true;
            selectRowCount ++;
          }else if((pData.soRemainingQty === 0 && this.isEdit)){
            pData.select = false;           
          }else if((!this.isEdit)){
            if(pData.soRemainingQty === 0){
              pData.select = false;
            }else{
              pData.select = true;
            }
            this.isRowSelected = true;
            selectRowCount ++;
          }
        } else{
          pData.select = false;
          this.isRowSelected = false;
        }
      }
    }else if(action === 'FROMHEADER'){
      this.isRowSelected = true; 
      
      for(const pData of this.rmaParameterData){
        if(this.selectAllRow){
        pData.select = true;
        selectRowCount ++;
        }else{
          pData.select = false;
          this.isRowSelected = false; 
        }
      }
      
    }else{
      for(const data of this.rmaParameterData){
        if(data.select){
            selectRowCount ++;
        }
      }
      this.isRowSelected = selectRowCount > 0 ? true : false;
    }      
      if(selectRowCount === this.rmaParameterData.length){
        this.selectAllRow = true;
      }else{
        this.selectAllRow = false;
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
        const data = this.getRMALinesForAdd(this.salesOrderForm.value);        
        if (data === 'validateError') {
          return
        }
        this.saveInprogress = true;
        this.salesOrderForm.patchValue({ soNumber: '' });
        if(this.isEdit){
          this.salesOrderService.updateSO(data,this.soId)
          .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  if(this.redirectionType === 'SO'){
                    this.router.navigate(['salesorders']);
                  }else{
                    this.router.navigate(['rma']);
                  }
                } else {
                  
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
          );
        }else{
          this.salesOrderService.createSO(data)
          .subscribe(
              (resultData: any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  if(this.redirectionType === 'SO'){
                    this.router.navigate(['salesorders']);
                  }else{
                    this.router.navigate(['rma']);
                  }
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
          );
        }
     /*   */
 

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

  fetchNewSearchListForCustomer(event: any, index: any, searchFlag: any){
    const value = this.salesOrderForm.value.searchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if(charCode === 9){
       event.preventDefault();
       charCode = 13;
    }
    if ( !searchFlag && charCode !== 13 ){
      return;
    }

    if(this.showLov === 'hide'){

    this.inlineSearchLoader = 'show';
    this.getItemLovByScreenForCustomer(this.salesOrderForm.value.searchValue, index, event)
    }else{
        this.showLov = 'hide';
        this.customerList = [{ value   : '', label : ' Please Select' }];
        this.salesOrderForm.patchValue({ soTpId: null });
        this.salesOrderForm.patchValue({ searchValue: '' });
    }
  }

  getItemLovByScreenForCustomer(itemName, index, event){
    this.commonService.getItemLovByScreen( 'tp-name', 'trading-partner', 'CUST' , itemName).subscribe((data: any) => {
        this.customerList = [{ value   : '', label : ' Please Select' }];

        if( data.result && data.result.length){
          data =  data.result;
          this.customerList = [];
          for(let i=0; i<data.length; i++){
              this.customerList.push({
                value   : data[i].tpId,
                label : data[i].tpName
            })
          }
          this.inlineSearchLoader = 'hide';
          this.showLov = 'show';
          this.salesOrderForm.patchValue({ searchValue: '' });

          // Set the first element of the search
          this.salesOrderForm.patchValue({ soTpId: data[0].tpId });
        }else{
          this.inlineSearchLoader = 'hide';
          this.salesOrderForm.patchValue({ searchValue: '' });
          this.openSnackBar('No match found', '','error-snackbar');
        }
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  customerSelectionChanged(event: any, Id: number) {
    if (event.source.selected && event.isUserInput === true) {
      this.customerSiteList = [];
      this.commonService.getSupplierSiteLOV(Id).subscribe((data: any) => {
        if(data.result){
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

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
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
    if (lookupName === 'RMA_STATUS') {
      this.statusList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.statusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
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
    this.rmaLineDataSource.sort = this.sort;
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
    this.commonService.getScreenSize(140);
  }

}
