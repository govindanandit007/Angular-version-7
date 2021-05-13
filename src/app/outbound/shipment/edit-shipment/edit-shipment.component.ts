import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef, HostListener, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, TooltipPosition, MatDialogRef, MatTableDataSource, MatTable, MatPaginator, MatSort } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { ShipmentService } from 'src/app/_services/outbound/shipment.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
export interface ParameterDataElement {

  soId: number,
  soNumber: string,
  soList: any,
  showLov? : string,
  searchValue? : string,
  inlineSearchLoader?: any,
  shipmentLineId: any,
  soLineId: number,
  solineNumber: any,
  soLineList: any,
  itemName: string,
  itemRevisionNumber: string,
  itemRevisionId: number,
  shipmentQty: number,
  qtyUomCode: any,
  shippedQty: any,
  soShipmentPlannedDate: any
  shipmentLineStatus: any,
  shipmentLineStatusValue?: any,
  netWeight: any,
  grossWeight: any,
  weightUom: any,
  volume: any,
  volumeUom: any
  addNewRecord? : any,
  action: any
}

export interface ParameterDataElementBatch {
  lpnNum          : string;
  contentQty      : string;
  qtyUomCode      : string;
  qtyUomCodeValue : string;
  paletNum        : string;
}

export interface ParameterDataElementSerial {
  No: string;
  serialNo: string;
}

export interface ParameterDataElementBatchCount {
  No: string;
  batchNo: string;
  qty: any;
  serialList: any;
}

@Component({
  selector: 'app-edit-shipment',
  templateUrl: './edit-shipment.component.html',
  styleUrls: ['./edit-shipment.component.css']
})
export class EditShipmentComponent implements OnInit, AfterViewInit {
  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    private route: ActivatedRoute,
    public commonService: CommonService,
    public shipmentService: ShipmentService,
    public dialog: MatDialog) { }
  iuCodeList: any[] = [];
  statusList: any[] = [];
  EligibleShipmentForm: FormGroup;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  shipmentId: number;
  inlineSOSearchLoader = 'hide';
  showSOLov = 'hide';
  customerList: any[] = [];
  soList: any[] = [];
  soSearchPlaceholder = 'Shipment Number';
  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  inlineCustomerSearchLoader = 'hide';
  customerSiteList: any[] = [];
  showCustomerLov = 'hide';
  listProgress = false;
  lineTableMessage = '';
  showLinesFlag = false;
  selectAllRow = false;
  saveInprogress = false;
  showGenerateShipmentBtn = false;
  currentDeletedShipment: any = {};
  editData: any = null;
  systemDate : any = new Date();
  isEndDateDisabled: any = true;
  setEndDate: any = new Date();
  disableAllBtn: any = false;


  listProgressPopup: any = '';
  contentTableMessage: any = '';
  shipmentStatus: any = null;
  isReport: any = true;
  batchSerialDialogProcess: any = false;
  parameterData: ParameterDataElement[] = [];
  shipmentDataJson: any = {};
  isBatch: any = false;
  isBackBtnEnable: any = false;
  batchTableMessage = '';
  serialTableMessage = '';

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
  @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  shipmentLineDisplayedColumns: string[] = [
    'No',
    'soNumber',
    'soLineNumber',
    'itemName',
    'revsnNumber',
    'status',
    'shipmentQty',
    'pickedQty',
    'UOM',
    'shippedQty',
    'allocatedQty',
    'backorderQty',
    'soShipmentPlannedDate',
    'netWeight',
    'grossWeight',
    'weightUom',
    'volume',
    'volumeUom',
    'action',
  ];
  columns: any = [
    { field: 'No', name: '#', width: 75, baseWidth: 1 },
    { field: 'soNumber', name: 'Sales Order', width: 75, baseWidth: 5.5 },
    { field: 'soLineNumber', name: 'SO Line', width: 75, baseWidth: 4 },
    { field: 'itemName', name: 'Item', width: 75, baseWidth: 7 },
    { field: 'revsnNumber', name: 'Item Revision', width: 75, baseWidth: 6 },
    { field: 'shipmentQty', name: 'Shipment Qty', width: 75, baseWidth: 6 },
    { field: 'UOM', name: 'UOM', width: 75, baseWidth: 4 },
    { field: 'shippedQty', name: 'Shipped Qty', width: 75, baseWidth: 6 },
    { field: 'soShipmentPlannedDate', name: 'Planned Shipped Date', width: 75, baseWidth: 8.5 },
    { field: 'status', name: 'Status', width: 75, baseWidth: 4.5 },
    { field: 'netWeight', name: 'Net Weight', width: 75, baseWidth: 5 },
    { field: 'grossWeight', name: 'Gross Weight', width: 75, baseWidth: 6 },
    { field: 'weightUom', name: 'Weight UOM', width: 75, baseWidth: 5.5 },
    { field: 'volume', name: 'Volume', width: 75, baseWidth: 5 },
    { field: 'volumeUom', name: 'Volume UOM', width: 75, baseWidth: 6 },
    { field: 'allocatedQty', name: 'Allocated Qty', width: 75, baseWidth: 6 },
    { field: 'backorderQty', name: 'Back Order Qty', width: 75, baseWidth: 6.5 },
    { field: 'pickedQty', name: 'Picked Qty', width: 75, baseWidth: 5.5 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 6 },
  ]
  shipmentWeightUom: any  = '';
  shipmentVolumeUom: any  = '';
  

  parameterDataBatch: ParameterDataElementBatch[] = [];
  parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
  parameterDisplayedColumnsBatch: string[] = [
    'No',
    'lpnNum',
    'contentQty',
    'qtyUomCode',
    'paletNum',
    'batchCount',
    'serialCount'                                                                                            
  ];

  parameterDataSerial: ParameterDataElementSerial[] = [];
  parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
  parameterDisplayedColumnsSerial: string[] = [
    'No',
    'serialNumber'
  ];

  parameterDataBatchCount: ParameterDataElementBatchCount[] = [];
  parameterDataSourceBatchCount = new MatTableDataSource<ParameterDataElementBatchCount>(this.parameterDataBatchCount);
  parameterDisplayedColumnsBatchCount: string[] = [
    'No',
    'batchNumber',
    'batchMfgDate',
    'batchExpDate',
    'txnBatchQuantity',
    'serialList'
  ];

  ngOnInit() {
    this.getInventoryUnitLOV();
    this.shipmentFeedForm('');
    this.route.params.subscribe(params => {

      if (params.id) {
        this.formTitle = 'Shipment';
        this.isEdit = true;
        this.shipmentId = params.id;
        this.shipmentService
          .getShipmentDetailsById(params.id)
          .subscribe((data: any) => {
            this.shipmentStatus = data.result[0].shipmentStatus;
            this.updateShipmentFeedForm(data.result[0]);
          });
      } else {

      }
    });

  }

  // Get Inventory Unit LOV
  getInventoryUnitLOV() {
    this.iuCodeList = [];
    this.commonService
      .getIULOV()
      .subscribe((data: any) => {
        for (const iuData of data.result) {
          this.iuCodeList.push({
            value: iuData.iuId,
            label: iuData.iuCode,
            name: iuData.iuName
          });
        }
      });
  }

  fetchNewSearchListForCustomer(event: any, index: any, searchFlag: any) {
    const value = this.EligibleShipmentForm.value.customerSearchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.showCustomerLov === 'hide') {
      this.inlineCustomerSearchLoader = 'show';
      this.getItemLovByScreenForCustomer(this.EligibleShipmentForm.value.customerSearchValue, index, event)
    } else {
      this.showCustomerLov = 'hide';
      this.EligibleShipmentForm.patchValue({ customerSearchValue: '' });
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
        this.inlineCustomerSearchLoader = 'hide';
        this.showCustomerLov = 'show';
        this.EligibleShipmentForm.patchValue({ customerSearchValue: '' });

        // Set the first element of the search
        this.EligibleShipmentForm.patchValue({ shipmentCustomerId: data[0].tpId });
      } else {
        this.inlineCustomerSearchLoader = 'hide';
        this.EligibleShipmentForm.patchValue({ customerSearchValue: '' });
        this.openSnackBar('No match found', '', 'default-snackbar');
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

  fetchNewSearchListForSO(event: any, index: any, searchFlag: any) {
    const value = this.EligibleShipmentForm.value.SOSearchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }

    if (!searchFlag && charCode !== 13) {
      return;
    }

    if (this.showSOLov === 'hide') {
      // if(this.EligibleShipmentForm.value.SOSearchValue.length > 0 && this.EligibleShipmentForm.value.SOSearchValue.length < this.commonService.searchInitTextLenght){
      //   this.openSnackBar('Please Enter minimum 3 Charecters', '','default-snackbar');
      //   return;
      // }
      this.inlineSOSearchLoader = 'show';
      this.getSOLOV(this.EligibleShipmentForm.value.SOSearchValue, index, event)


    } else {
      this.showSOLov = 'hide';
      this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });
    }

  }
  getSOLOV(itemName, index, event) {

    this.commonService.getItemLovByScreen('so', 'wave-criteria', '', itemName).subscribe((data: any) => {
      this.soList = [{
        value: '',
        label: ' Please Select'
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.soList = [];

        for (let i = 0; i < data.length; i++) {
          this.soList.push({
            value: data[i].soId,
            label: data[i].soNumber
          })
        }
        console.log(this.customerList);
        this.inlineSOSearchLoader = 'hide';
        this.showSOLov = 'show';
        this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });

        // Set the first element of the search
        console.log(this.EligibleShipmentForm.value);
        this.EligibleShipmentForm.patchValue({ shipmentSoId: data[0].soId });
        console.log(this.EligibleShipmentForm.value);

      } else {
        this.inlineSOSearchLoader = 'hide';
        this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });
        this.openSnackBar('No match found', '', 'default-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }
  shipmentFeedForm(data) {
    this.EligibleShipmentForm = this.fb.group({
      shipmentId: [{value:'', disabled: true}],
      shipmentNumber: [{value:'', disabled: true}],
      shipmentIuId: [{value:'', disabled: true}],
      shipmentStatus: [{value:'', disabled: true}],
      shipmentStatusValue: [{value:'', disabled: true}],
      customerSearchValue: [{value:'', disabled: true}],
      SOSearchValue: [{value:'', disabled: true}],
      shipmentSoId: [null],
      actualShipDate: [null],
      actualDeliveryDate: [null],
      shipmentCustomerId: [''],
      shipmentCustomerSiteId: [{value:'', disabled: true}],
      customerSiteName: [{value:'', disabled: true}],
      shipmentCarrier: [''],
      shipmentWaybill: [''],
      shipmentBol: [''],
      netWeight: [''],
      grossWeight: [''],
      volume: [''],
      shipmentVolumeUom: [''],
      shipmentWeightUom: [''],
      locCode: [{value:'', disabled: true}],
      locatorId: ['']

    });

  }

  onStartDateChanged(){
    this.setEndDate = new Date(this.EligibleShipmentForm.value.actualShipDate);
    this.isEndDateDisabled = false;
  }

  updateShipmentFeedForm(data) {
    this.editData = data;
    for (let i = 0; i < this.editData.shippingReports.length; i++) {
      this.editData.shippingReports[i].enableFlag = false;
    }
    this.EligibleShipmentForm.patchValue({ shipmentId             : data.shipmentId });
    this.EligibleShipmentForm.patchValue({ shipmentNumber         : data.shipmentNumber });
    this.EligibleShipmentForm.patchValue({ shipmentIuId           : data.iuId });
    this.EligibleShipmentForm.patchValue({ SOSearchValue          : data.soNumber });
    this.EligibleShipmentForm.patchValue({ shipmentSoId           : data.soId });
    this.EligibleShipmentForm.patchValue({ shipmentSoNumber       : data.soId });
    
    this.EligibleShipmentForm.patchValue({ shipmentStatus         : data.shipmentStatus });
    this.EligibleShipmentForm.patchValue({ shipmentStatusValue    : data.shipmentStatusValue });
    this.EligibleShipmentForm.patchValue({ locCode                : data.locCode });
    this.EligibleShipmentForm.patchValue({ locatorId              : data.locatorId });
        
    this.EligibleShipmentForm.patchValue({ customerSearchValue    : data.customerName });
    this.EligibleShipmentForm.patchValue({ shipmentCustomerId     : data.customerId });
    this.EligibleShipmentForm.patchValue({ actualShipDate         : data.shipmentDate });
    this.EligibleShipmentForm.patchValue({ actualDeliveryDate     : data.shipmentDeliveryDate });
    this.EligibleShipmentForm.patchValue({ shipmentCustomerSiteId : data.customerSiteId });
    this.EligibleShipmentForm.patchValue({ customerSiteName       : data.customerSiteName });
    this.EligibleShipmentForm.patchValue({ shipmentCarrier        : data.shipmentCarrier });
    this.EligibleShipmentForm.patchValue({ shipmentCarrier        : data.shipmentWaybill });
    this.EligibleShipmentForm.patchValue({ shipmentWaybill        : data.shipmentWaybill });
    this.EligibleShipmentForm.patchValue({ shipmentBol            : data.shipmentBol });
    this.EligibleShipmentForm.patchValue({ netWeight              : data.shipmentNetWeight });
    this.EligibleShipmentForm.patchValue({ netWeight              : data.shipmentGrossWeight });
    this.EligibleShipmentForm.patchValue({ grossWeight            : data.shipmentNetWeight });
    this.EligibleShipmentForm.patchValue({ volume                 : data.shipmentVolume });
    this.shipmentWeightUom = data.shipmentWeightUom;
    this.shipmentVolumeUom = data.shipmentVolumeUom;
    this.customerSelectionChanged({source: {selected: true},isUserInput:true},data.customerId)
    for (const rData of data.shipmentLines) {
      rData.action = '';
      this.parameterData.push(rData);
    }
    this.shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.shipmentLineDataSource.paginator = this.paginator;
    this.shipmentLineDataSource.sort = this.sort;
    // this.shipmentLineDataSource.connect().subscribe(d => {
    //   this.shipmentLineDataSource.sortData(this.shipmentLineDataSource.filteredData,
    //     this.shipmentLineDataSource.sort);
    // });
    this.onStartDateChanged();

}

addRow() {
  this.paginator.pageIndex = 0;
  if(this.matTableRef.nativeElement.clientHeight > 240 ){
      const elem = document.getElementById('customTable');
      elem.scrollTop = 0;
  }

  this.isAdd = true;

  this.parameterData.unshift({
    soId: null,
    soNumber: '',
    soList: [],
    soLineId: null,
    searchValue: '',
    showLov                     : 'hide',
    inlineSearchLoader          : 'hide',
    soLineList : [],
    solineNumber: '',
    shipmentLineId: null,
    itemName: '',
    itemRevisionNumber: '',
    itemRevisionId: null,
    shipmentQty: null,
    qtyUomCode: '',
    shippedQty: '',
    soShipmentPlannedDate: '',
    shipmentLineStatus: '',
    netWeight: null,
    grossWeight: null,
    weightUom: null,
    volume: null,
    volumeUom: null,
    addNewRecord : true,
    action:''
  });

  this.shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  this.shipmentLineDataSource.paginator = this.paginator;
}

fetchNewSearchList(event: any, index: any, searchFlag: any, value: any){
  let charCode = event.which ? event.which : event.keyCode;
  if(charCode === 9){
     event.preventDefault();
     charCode = 13;
  }

  if ( !searchFlag && charCode !== 13 ){
    return;
  }

  if(this.parameterData[index].showLov === 'hide'){

    this.parameterData[index].inlineSearchLoader = 'show';
    this.getSoLovByText(this.parameterData[index].searchValue, index, event)
  }else{
      this.parameterData[index].showLov = 'hide';
      this.parameterData[index].searchValue = ''
  }

}

getSoLovByText(itemName, index, event){
  const itemNameEncoded = encodeURIComponent(itemName);
  this.shipmentService.getSoLovByText( itemNameEncoded).subscribe((data: any) => {

      if( data.result && data.result.length){
        data =  data.result;
        this.parameterData[index].soList = [];
          for(let i=0; i<data.length; i++){
            this.parameterData[index].soList.push({
                value   : data[i].soId,
                label   : data[i].soNumber,
            })
          }
          this.parameterData[index].inlineSearchLoader = 'hide';
          this.parameterData[index].showLov = 'show';
          this.parameterData[index].searchValue = '';

          // Set the first element of the search
          this.parameterData[index].soId    = data[0].soId;

      }else{
        this.parameterData[index].inlineSearchLoader = 'hide';
        this.parameterData[index].searchValue = '';
        this.openSnackBar('No match found', '','default-snackbar');
      }
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  soSelectionChanged(event: any,  index:any, soData:any){
    if (event.source.selected && event.isUserInput === true) {
      this.getSoLineList(soData.value, index);
    }
  }

  soLineSelectionChanged(event: any,  index:any, soLineData:any){

    soLineData = soLineData.data;
    if (event.source.selected && event.isUserInput === true) {
      this.parameterData[index].itemName                 = soLineData.data.itemName;
      this.parameterData[index].itemRevisionNumber       = soLineData.revsnNumber;
      this.parameterData[index].qtyUomCode               = soLineData.soQuantityUomCode;
      this.parameterData[index].shippedQty               = soLineData.soShippedQuantity;
      this.parameterData[index].soShipmentPlannedDate    = soLineData.soShipmentPlannedDate;
      this.parameterData[index].shipmentLineStatus       = soLineData.shipmentLineStatus;
      this.parameterData[index].netWeight                = soLineData.soNetWeight;
      this.parameterData[index].grossWeight              = soLineData.soGrossWeight;
      this.parameterData[index].weightUom                = soLineData.soWeightUomCode;
      this.parameterData[index].volume                   = soLineData.soVolume;
      this.parameterData[index].volumeUom                = soLineData.soVolumeUomCode;

    }
  }

  getSoLineList(soId, index) {
    this.parameterData[index].soLineList = [];
    this.parameterData[index].itemName = '';
    this.shipmentService
      .getSoLineList(soId)
      .subscribe((data: any) => {
        // console.log(data.result);
        for (const rowData of data.result) {
          this.parameterData[index].soLineList.push({
            value: rowData.soLineId,
            label: rowData.soLineNumber,
            data: rowData
          });
        }


        if( this.parameterData[index].soLineList.length){
          this.parameterData[index].soLineId    = data.result[0].soLineId;
          this.parameterData[index].itemName    = data.result[0].itemName;
        }


      });
  }

  deletePolicyRouting(){
    const rowIndex = this.currentDeletedShipment.rowIndex;

    const id : any = this.parameterData[rowIndex].shipmentLineId;
    this.shipmentService.deletePolicyRounting(id).subscribe((data: any) => {

        if ( data && data.status === 200) {
            this.parameterData.splice(rowIndex, 1);
            this.shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(
                this.parameterData
            );
            this.shipmentLineDataSource.paginator = this.paginator;
            this.dialog.closeAll();
            this.openSnackBar(data.message, '','success-snackbar');
        }else{
          this.openSnackBar(data.message, '','error-snackbar');
        }

      },
          (error: any) => {
              this.openSnackBar(error.error.message, '', 'error-snackbar');
          })

}

deleteRow(rowData: any, rowIndex: number) {
  this.parameterData.splice(rowIndex, 1);
  this.shipmentLineDataSource = new MatTableDataSource<
      ParameterDataElement
  >(this.parameterData);
  this.shipmentLineDataSource.paginator = this.paginator;
  this.checkIsAddRow();

}

checkIsAddRow(){
  let cnt = 0;
  const pLength = this.parameterData.length;
  for(const pdata of this.parameterData){
      if(pdata.addNewRecord === true){
          return;
      } else{
          cnt ++;
      }
  }
  if(cnt === pLength){
      this.isAdd = false;
  }
}


onSubmit(event: any, formId: any) {
  if(event){
    event.stopImmediatePropagation();
     
    // if (this.EligibleShipmentForm.valid) {
       
        const data = {
        shipmentBol          : this.EligibleShipmentForm.value.shipmentBol,
        shipmentCarrier      : this.EligibleShipmentForm.value.shipmentCarrier,
        shipmentDate         : this.EligibleShipmentForm.value.actualShipDate ? this.shipmentService.dateFormat(this.EligibleShipmentForm.value.actualShipDate) : null,
        shipmentDeliveryDate : this.EligibleShipmentForm.value.actualDeliveryDate ? this.shipmentService.dateFormat(this.EligibleShipmentForm.value.actualDeliveryDate): null,
        shipmentGrossWeight  : Number(this.EligibleShipmentForm.value.grossWeight),
        shipmentId           : this.editData.shipmentId,
        shipmentIuId         : this.editData.shipmentIuId,
        shipmentNetWeight    : Number(this.EligibleShipmentForm.value.netWeight),
        shipmentNumber       : this.editData.shipmentNumber,
        shipmentStatus       : this.editData.shipmentStatus,
        shipmentStatusValue  : this.editData.shipmentStatusValue,
        shipmentVolume       : Number(this.EligibleShipmentForm.value.volume),
        shipmentVolumeUom    : this.EligibleShipmentForm.value.shipmentVolumeUom,
        shipmentWaybill      : this.EligibleShipmentForm.value.shipmentWaybill,
        shipmentWeightUom    : this.EligibleShipmentForm.value.shipmentWeightUom,
        updatedBy            : JSON.parse(localStorage.getItem('userDetails')).userId,
        shipmentLines        : []
      }
       
      for (const rowData of this.parameterData) {
        if(rowData.addNewRecord === true){
          data.shipmentLines.push({
            createdBy           : JSON.parse(localStorage.getItem('userDetails')).userId,
            grossWeight         : rowData.grossWeight ? rowData.grossWeight : null,
            netWeight           : rowData.netWeight ? rowData.netWeight : null,
            qtyUomCode          : rowData.qtyUomCode ? rowData.qtyUomCode : null,
            shipmentId          : this.editData.shipmentId ? this.editData.shipmentId : null,
            shipmentLineId      : rowData.shipmentLineId ? Number(rowData.shipmentLineId) : null,
            shipmentLineStatus  : rowData.shipmentLineStatus ? rowData.shipmentLineStatus : null,   
            shipmentQty         : rowData.shipmentQty ? Number(rowData.shipmentQty) : null,
            shippedQty          : rowData.shippedQty ? Number(rowData.shippedQty) : null,
            soId                : rowData.soId ? Number(rowData.soId) : null,
            soLineId            : rowData.soLineId ? Number(rowData.soLineId) : null,
            volume              : rowData.volume ? Number(rowData.volume) : null,
            volumeUom           : rowData.volumeUom ? rowData.volumeUom : null,
            weightUom           : rowData.weightUom ? rowData.weightUom : null
          })
        }
      }
      this.saveInprogress = true;
      this.shipmentService
          .updateShipment(data, this.shipmentId )
          .subscribe(
            (resultData:any) => {
              if (resultData.status === 200) {
                this.saveInprogress = false;
                // this.openDialog('Success', resultData.message);
                this.openSnackBar(resultData.message, '', 'success-snackbar');
                this.router.navigate(['shipment']);
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

    // } else {
    //   this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');

    // }
  }
}

POcancel(){
  this.router.navigate(['purchaseorder']);
}

openContentDialog(templateRef: TemplateRef<any>, element: any){
  this.disableAllBtn = true;
  setTimeout(() => { this.disableAllBtn = false; }, 1000);
  if(element.batchList === 0){
      return
  }
   
   
  this.listProgressPopup = true;
  const data = {
    shipmentId        : element.shipmentId,
    shipmentLineId    : element.shipmentLineId
  }
  this.shipmentDataJson = data;
  this.shipmentService.shipmentContent(data)
  .subscribe(
      (data: any) => {
          this.listProgressPopup = false;
          this.parameterDataBatch = [];
          if (data.status === 200) {
              if (!data.message) {
                  this.dialog.open(templateRef, {
                    autoFocus: false,
                    width: '50vw'
                  });
                  for (const rowData of data.result) {
                      this.parameterDataBatch.push(rowData);
                  }
                  this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                  this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                  setTimeout(() => {
                    this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                     this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                }, 100);
                  
              } else {
                  this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                  this.contentTableMessage = data.message;
                  this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                  setTimeout(() => {
                     this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                     this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                }, 100);
                  this.dialog.open(templateRef, {
                      autoFocus: false,
                      width: '50vw'
                  });
              }
          } else {
              this.openSnackBar(data.message,'','error-snackbar');
          }
      },
      (error: any) => {
          this.listProgress = false;
          this.openSnackBar(error.error.message,'','error-snackbar');
      }
  );
  
}

openBatchPopup(templateRef: TemplateRef<any>, element: any) {
  if (element.batchCount === 0) {
    return
  }
  this.listProgressPopup = true;
  this.batchSerialDialogProcess = true;

  this.shipmentService.shipmentContentBatch(this.shipmentDataJson)
    .subscribe(
      (data: any) => {
        this.listProgressPopup = false;
        this.parameterDataBatchCount = [];
        if (data.status === 200) {

          if (!data.message) {
            this.isBatch = true;
            this.dialog.open(templateRef, {
              autoFocus: false,
              minWidth: 360
            });
            for (const rowData of data.result) {
              this.parameterDataBatchCount.push(rowData);
            }
            this.parameterDataSourceBatchCount = new MatTableDataSource<any>(this.parameterDataBatchCount);
            console.log(this.parameterDataSourceBatchCount)
            setTimeout(() => {
              this.batchSerialDialogProcess = false;
              this.parameterDataSourceBatchCount.paginator = this.paginatorBatch;
              this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);

          } else {
            this.parameterDataSourceBatchCount = new MatTableDataSource<any>(this.parameterDataBatchCount);
            setTimeout(() => {
              this.batchSerialDialogProcess = false;
              this.parameterDataSourceBatchCount.paginator = this.paginatorBatch;
              this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);
            this.batchTableMessage = data.message;
            this.isBatch = true;
            this.dialog.open(templateRef, {
              autoFocus: false,
              minWidth: 260,
              minHeight: 200
            });
          }
        } else {
          this.openSnackBar(data.message, '', 'error-snackbar');
          this.batchSerialDialogProcess = false;
        }
      },
      (error: any) => {
        this.listProgress = false;
        this.openSnackBar(error.error.message, '', 'error-snackbar');
        this.batchSerialDialogProcess = false;
      }
    );

}

closeDialog(){
  this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );             
  this.dialog.closeAll();
}

backToBatchList() {
  this.isBatch = true;
  this.isBackBtnEnable = false;
}

openSerialPopup(templateRef: TemplateRef<any>, element: any) {
  this.isBackBtnEnable = false;
  if (element.serialCount === 0) {
    return
  }
  this.listProgressPopup = true;
  this.batchSerialDialogProcess = true;
  // const data = {
  //   serial: this.txnSearchParameters
  //   transactionNumber : element.txnId
  // }

  this.shipmentService.shipmentContentSerial(this.shipmentDataJson)
    .subscribe(
      (data: any) => {
        this.listProgressPopup = false;
        this.parameterDataSerial = [];
        if (data.status === 200) {

          if (!data.message) {
            this.isBatch = false;
            this.dialog.open(templateRef, {
              autoFocus: false,
              minWidth: 260
            });
            for (const rowData of data.result) {
              this.parameterDataSerial.push(rowData);
            }
            this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
            setTimeout(() => {
              this.batchSerialDialogProcess = false;
              this.parameterDataSourceSerial.paginator = this.paginatorSerial;
              this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);

          } else {
            this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
            setTimeout(() => {
              this.batchSerialDialogProcess = false;
              this.parameterDataSourceSerial.paginator = this.paginatorSerial;
              this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);
            this.serialTableMessage = data.message;
            this.isBatch = false;
            this.dialog.open(templateRef, {
              autoFocus: false,
              minWidth: 260,
              minHeight: 200
            });
          }
        } else {
          this.openSnackBar(data.message, '', 'error-snackbar');
          this.batchSerialDialogProcess = false;
        }
      },
      (error: any) => {
        this.listProgress = false;
        this.openSnackBar(error.error.message, '', 'error-snackbar');
        this.batchSerialDialogProcess = false;
      }
    );

}

openBatchSerialPopup(templateRef: TemplateRef<any>, element: any) {
  if (element.serialList === 0) {
    return
  }
  this.isBatch = false;
  this.isBackBtnEnable = true
  this.listProgressPopup = true;
  // const data = {
  //   batchid : ""
  //   batchnumber : this.txnSearchParameters,
  //   serial: this.txnSearchParameters
  //   transactionNumber : element.txnId
  // }

  this.shipmentService.shipmentContentSerial(this.shipmentDataJson)
    .subscribe(
      (data: any) => {
        this.listProgressPopup = false;
        this.parameterDataSerial = [];
        if (data.status === 200) {

          if (!data.message) {
            for (const rowData of data.result) {
              this.parameterDataSerial.push(rowData);
            }
            this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
            setTimeout(() => {
              this.parameterDataSourceSerial.paginator = this.paginatorSerial;
              this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);

          } else {
            this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
            setTimeout(() => {
              this.parameterDataSourceSerial.paginator = this.paginatorSerial;
              this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
              this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
            }, 100);
            this.serialTableMessage = data.message;

          }
        } else {
          this.openSnackBar(data.message, '', 'error-snackbar');
        }
      },
      (error: any) => {
        this.listProgress = false;
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
    );

}


openShipShipmentPopup(event: any, templateRef:any, type){
  this.isReport = (type === 'report') ? true : false;
  this.dialog.open(templateRef, {
    autoFocus: false,
    width: '20vw',
  });
}

shipShipment(event: any){

  let temp = '';
  for (let i = 0; i < this.editData.shippingReports.length; i++) {
    if(this.editData.shippingReports[i].enableFlag === true){
      temp = (temp === '') ? this.editData.shippingReports[i].reportCode : temp + ',' + this.editData.shippingReports[i].reportCode;
    }
    
  }
 
  const data = {
    shipmentId: Number(this.shipmentId),
    reports: temp,
    userId: JSON.parse(localStorage.getItem('userDetails')).userId,
  };

  this.shipmentService.shipShipment(data).subscribe((data: any) => {
    if (data.status === 200) {
      this.closeDialog();
      this.router.navigate(['shipment']);
      this.openSnackBar(data.message,'','success-snackbar');
    }else {
      this.openSnackBar(data.message,'','error-snackbar');
    }
  },
    (error: any) => {
      this.openSnackBar(error.error.message,'','error-snackbar');
    })
}

openDeleteDialog(templateRef: TemplateRef<any>, element: any, event: any, rowIndex: any) {
  this.currentDeletedShipment.element  = element;
  this.currentDeletedShipment.rowIndex = rowIndex;
  this.dialog.open(templateRef);
}

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
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

  ngAfterViewInit() {
    this.shipmentLineDataSource.sort = this.sort;
    // this.shipmentLineDataSource.connect().subscribe(d => {
    //     this.shipmentLineDataSource.sortData(this.shipmentLineDataSource.filteredData,this.shipmentLineDataSource.sort);
    // });
    setTimeout(() => {
      this.commonService.setTableResize(
          this.matTableRef.nativeElement.clientWidth,
          this.columns
      );
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.commonService.getScreenSize(206);
  }


}
