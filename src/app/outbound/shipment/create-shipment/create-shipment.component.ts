import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, TooltipPosition, MatTableDataSource, MatTable, MatPaginator, 
  MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ShipmentService } from 'src/app/_services/outbound/shipment.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';

export interface ParameterDataElement {
  rowSelect: boolean,
  poNumber?: string,
  waveNumber?: string,
  soShipmentPlannedDate: any,
  soLineQuantity: number,
  soQuantityUomCode: number,
  soId: number,
  soLineId: number,
  uomCodeValue?: string,
  receiptRoutingValue?: string,
  poSearchValue?: string,
  poNameList?: any,
  criteriaId: number,
  action: string,
  editing: boolean,
  asnLineId?: number,
  addNewRecord?: boolean,
  isDefault?: boolean,
  originalData?: any,
  showPoLov?: string,
  inlineSearchLoader?: string,
  poIuList?: any[];
  poLineItemList?: any[];
  poLineItemRevisionList?: any[];
  poLineUOMList?: any[];
  poLineNumberList?: any[];
  createdBy?: any[];
  updatedBy?: any[];
  soNetWeight?: string;
  UOM?: string;
  shipmentLineId?: string;
  shipmentLineStatus?: string;
  shippedQty?: string;
  shipmentId?: string;
  soGrossWeight?: string;
  soVolume?: string;
  soVolumeUomCode?: string;
  soWeightUomCode?: string;
  soLinePriority ?: string;
  shipmentQty?: any;
}

@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
export class CreateShipmentComponent implements OnInit, AfterViewInit {
  iuCodeList: any[] = [];
  EligibleShipmentForm: FormGroup;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  shipmentId: number;
  inlineSOSearchLoader = 'hide';
  showSOLov = 'hide';
  customerList: any[] = [];
  soList: any[] = [];
  soSearchPlaceholder = 'Search SO';
  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  inlineCustomerSearchLoader = 'hide';
  customerSiteList: any[] = [];
  showCustomerLov = 'hide';
  listProgress = false;
  saveInprogress = false;
  lineTableMessage = '';
  showLinesFlag = false;
  selectAllRow = false;
  showGenerateShipmentBtn = false;
  isCustomerDisabled = false;
  isCustomerSiteDisabled = false;
  systemDate : any = new Date();
  isEndDateDisabled: any = true;
  varPlannedFromShipDate = new Date(); 
  parameterData: ParameterDataElement[] = [];
  shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  shipmentLineDisplayedColumns: string[] = [
    'rowSelect',
    'No',
    'salesOrder',
    'soLine',
    'item',
    'itemRevision',
    'soLinePriority',
    'Qty',
    'UOM',
    'soShipmentPlannedDate'
  ];
  columns: any = [
    { field: 'rowSelect', name: '', width: 75, baseWidth: 3 },
    { field: 'No', name: '#', width: 75, baseWidth: 3 },
    { field: 'salesOrder', name: 'Sales Order', width: 75, baseWidth: 12 },
    { field: 'soLine', name: 'SO Line', width: 75, baseWidth: 10 },
    { field: 'item', name: 'Item', width: 75, baseWidth: 16 },
    { field: 'itemRevision', name: 'Item Revision', width: 75, baseWidth: 11.5 },
    { field: 'soLinePriority', name: 'Line Proirity', width: 75, baseWidth: 10 },
    { field: 'Qty', name: 'Qty', width: 75, baseWidth: 6 },
    { field: 'UOM', name: 'UOM', width: 75, baseWidth: 8 },
    { field: 'soShipmentPlannedDate', name: 'Shipment Planned Date', width: 75, baseWidth: 22.5 }
  ]
  validationMessages = {
    shipmentIuId: {
      required: 'IU is required.'
    },
  };

  asnFormErrors = {
    shipmentIuId: ''
  };

  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    private route: ActivatedRoute,
    public commonService: CommonService,
    public shipmentService: ShipmentService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.shipmentFeedForm();
        // this.shipmentService.defaultIuDataObservable.subscribe((data: any) => {
        //   if(data !==''){
        //     console.log(data);
        //     if( !this.isEdit){
        //     this.EligibleShipmentForm.patchValue({shipmentIuId:  data});
        //     }
        //   }
        // });
    this.getInventoryUnitLOV();
    this.shipmentLineDataSource.paginator = this.paginator;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit Wave Criteria :';
        this.isEdit = true;
        this.shipmentId = params.id;
      } else {
        this.formTitle = 'Eligible Shipment Lines :';
      }
    }); 
    this.commonService.getScreenSize(-49);
  }
  fetchNewSearchListForSO(event: any, index: any, searchFlag: any) {
    const value = this.EligibleShipmentForm.value.SOSearchValue;
    console.log(this.EligibleShipmentForm.value.SOSearchValue);
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }

    if (!searchFlag && charCode !== 13) {
      return;
    }

    if (this.showSOLov === 'hide') {
 
      this.inlineSOSearchLoader = 'show';
      this.getSOLOV(this.EligibleShipmentForm.value.SOSearchValue, index, event)


    } else {
      this.showSOLov = 'hide';
      this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });
      this.EligibleShipmentForm.patchValue({ shipmentSoId: null });
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
            // value: data[i].soId,
            value: data[i].soNumber,
            label: data[i].soNumber,
            data : data[i]
          })
        }
        console.log(this.customerList);
        this.inlineSOSearchLoader = 'hide';
        this.showSOLov = 'show';
        this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });

        // Set the first element of the search
        this.EligibleShipmentForm.patchValue({ shipmentSoId: data[0].soNumber });

      } else {
        this.inlineSOSearchLoader = 'hide';
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
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
            label: iuData.iuCode
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
      this.EligibleShipmentForm.patchValue({ shipmentCustomerId: null });
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
        this.openSnackBar('No match found', '', 'error-snackbar');
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
        data.result.length === 1 ? this.EligibleShipmentForm.patchValue({ shipmentCustomerSiteId: data.result[0].tpSiteId }) : '';

      });
    }
  }

  onSubmit(event, form){

  }

  // iuId changed
  iuIdChanged() {
    this.parameterData = [];
    this.shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.shipmentLineDataSource.paginator = this.paginator;
    if (this.lineTableMessage !== '') {
      this.lineTableMessage = '';
    }
    // this.waveNumberInput = '';
  }

  soChanged(event: any, element){
    if (event.source.selected && event.isUserInput === true) {
      if(element.value){
 
        this.EligibleShipmentForm.patchValue({ customerSearchValue: element.data.tpName });
        this.EligibleShipmentForm.patchValue({ SOSearchValue: element.data.soNumber });
        this.EligibleShipmentForm.patchValue({ shipmentSoId: element.data.soNumber });
        this.EligibleShipmentForm.patchValue({ shipmentCustomerId: element.data.tpId });
        this.EligibleShipmentForm.patchValue({ shipmentCustomerSiteId: element.data.tpSiteId });
        this.EligibleShipmentForm.patchValue({ plannedFromShipDate: element.data.soShipmentPlannedDate });
        this.customerSiteList = [{value: element.data.tpSiteId, label: element.data.tpSiteName } ]
        this.isCustomerDisabled = true;
        this.isCustomerSiteDisabled = true;
        this.showCustomerLov = 'hide';
        this.EligibleShipmentForm.controls.customerSearchValue.disable()

      }
    }
  }

  // Form Group
  shipmentFeedForm() {
    this.EligibleShipmentForm = this.fb.group({
      shipmentIuId: [(JSON.parse(localStorage.getItem('defaultIU'))).id, Validators.required],
      customerSearchValue: [''],
      SOSearchValue: [''],
      shipmentSoId: [null],
      plannedFromShipDate: [null],
      plannedToShipDate: [null],
      shipmentCustomerId: [''],
      shipmentCustomerSiteId: ['']

    });
  }

  onStartDateChanged(event: any){
    this.varPlannedFromShipDate = this.EligibleShipmentForm.value.plannedFromShipDate
    this.isEndDateDisabled = false;
  }


    showLinesClick(){
      if(this.EligibleShipmentForm.value.shipmentCustomerId === null){
        this.openSnackBar('Please select the customer', '', 'error-snackbar');
        return;
      }
      if(this.EligibleShipmentForm.value.SOSearchValue !== '' && this.EligibleShipmentForm.value.shipmentSoId === null){
        this.openSnackBar('Please enter the proper value in sales order field', '', 'error-snackbar');
        return;
      }


      if (this.EligibleShipmentForm.value.shipmentIuId !== null &&
        this.EligibleShipmentForm.value.shipmentCustomerId !== '' &&
        this.EligibleShipmentForm.value.shipmentCustomerSiteId !== '' ) {
          this.EligibleShipmentForm.patchValue({shipmentIuId:  (JSON.parse(localStorage.getItem('defaultIU'))).id});
      this.showLinesFlag = true;
      this.parameterData = [];
      this.listProgress = true;
      this.shipmentLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      this.shipmentLineDataSource.paginator = this.paginator;
        const obj = {
            soNumber: (this.EligibleShipmentForm.value.shipmentSoId !== null
              && this.EligibleShipmentForm.value.shipmentSoId !== '') ?
            String(this.EligibleShipmentForm.value.shipmentSoId): null,

            iuId: this.EligibleShipmentForm.value.shipmentIuId !== null ? String(this.EligibleShipmentForm.value.shipmentIuId) : null,

          customer: (this.EligibleShipmentForm.value.shipmentCustomerId !== null
            && this.EligibleShipmentForm.value.shipmentCustomerId !== '') ?
            String(this.EligibleShipmentForm.value.shipmentCustomerId) : null,

          customerSite: (this.EligibleShipmentForm.value.shipmentCustomerSiteId !== null &&
            this.EligibleShipmentForm.value.shipmentCustomerSiteId !== '')?
            String(this.EligibleShipmentForm.value.shipmentCustomerSiteId) : null,

          delPlannedDateFrom: this.EligibleShipmentForm.value.plannedFromShipDate !== null ?
            String(this.commonService.dateFormat( this.EligibleShipmentForm.value.plannedFromShipDate) ) : null,

          delPlannedDateTo: this.EligibleShipmentForm.value.plannedToShipDate !== null ?
            String(this.commonService.dateFormat( this.EligibleShipmentForm.value.plannedToShipDate) ) : null

        }
        this.shipmentService.eligibleShipmentShowLines(obj).subscribe(
        (resultData: any) => {
          if (resultData.status === 200) {
            if(!resultData.message){
              // this.waveNumberInput = resultData.result[0].waveNumber;
              // console.log(resultData);
              setTimeout(() => {
                this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
              }, 500);
              for (const rData of resultData.result) {
                rData.rowSelect = false;
             //   rData.shippedQty = rData.order qty;
                this.parameterData.push(rData);
              }
              this.shipmentLineDataSource = new MatTableDataSource<any>(this.parameterData);
              this.shipmentLineDataSource.paginator = this.paginator;
              this.shipmentLineDataSource.sort = this.sort;
              // this.shipmentLineDataSource.connect().subscribe(d => {
              //     this.shipmentLineDataSource.sortData(this.shipmentLineDataSource.filteredData,this.shipmentLineDataSource.sort);
              // });
              this.listProgress = false;

            } else{
              // this.waveNumberInput = '';
              this.listProgress = false;
              this.lineTableMessage = resultData.message;
            }

          } else {
            // this.openSnackBar(resultData.message, '', 'error-snackbar');
          }
        },
        error => {
          this.listProgress = false;
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
      );
      }else{
        if(this.EligibleShipmentForm.value.shipmentIuId === null){
          this.openSnackBar('Please select the IU', '', 'error-snackbar');
          this.asnFormErrors.shipmentIuId = 'IU is required.';
        }else if(this.EligibleShipmentForm.value.shipmentCustomerId === ''){
          this.openSnackBar('Please select the customer', '', 'error-snackbar');
        }else if(this.EligibleShipmentForm.value.shipmentCustomerSiteId === ''){
          this.openSnackBar('Please select the customer site', '', 'error-snackbar');
        }
      }


  }

  clearFields(){
    this.showSOLov = 'hide';
    this.showCustomerLov = 'hide';
    this.isCustomerDisabled = false;
    this.isCustomerSiteDisabled = false;
    this.soList = [];
    this.customerList = [];
    this.customerSiteList = [];
    // this.EligibleShipmentForm.patchValue({ shipmentIuId: null });
    this.EligibleShipmentForm.patchValue({ customerSearchValue: '' });
    this.EligibleShipmentForm.patchValue({ SOSearchValue: '' });
    this.EligibleShipmentForm.patchValue({ shipmentSoId: null });
    this.EligibleShipmentForm.patchValue({ plannedFromShipDate: null });
    this.EligibleShipmentForm.patchValue({ plannedToShipDate: null });
    this.EligibleShipmentForm.patchValue({ shipmentCustomerId: '' });
    this.EligibleShipmentForm.patchValue({ shipmentCustomerSiteId: '' });
    this.EligibleShipmentForm.controls.customerSearchValue.enable()


  }
 
  // row selection change
  rowSelectionChange() {
    let selectRowCount = 0;
    for (const data of this.parameterData) {
      if (data.rowSelect) {
        selectRowCount++;
      }
    }
    this.showGenerateShipmentBtn = selectRowCount > 0 ? true : false;
  }
  // select / unselect all Shipment line checkbox
  selectAll() {
    for (const pData of this.parameterData) {
      if (this.selectAllRow) {
        pData.rowSelect = true;
        this.showGenerateShipmentBtn = true;
      } else {
        pData.rowSelect = false;
        this.showGenerateShipmentBtn = false;
      }

    }
  }

// get Shipment Lines for Add
  getShipmentLinesForAdd(data) {

    const shipmentLineArray = [];
    let tempObject = {};
    for (const [i, pData] of this.parameterData.entries()) {
      if (pData.rowSelect === true) {
        tempObject = {
          createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          grossWeight: pData.soGrossWeight,
          netWeight: pData.soNetWeight,
          qtyUomCode: pData.UOM,
          shipmentId: null,
          shipmentLineId: null,
          shipmentLineStatus: null,
          shipmentQty: Number(pData.shipmentQty),
          shippedQty: null,
          soId: pData.soId,
          soLineId: pData.soLineId,
          volume: pData.soVolume,
          volumeUom: pData.soVolumeUomCode,
          weightUom: pData.soWeightUomCode
        }

          shipmentLineArray.push(tempObject)
      }
    }
    data.shipmentLines = shipmentLineArray;
    return data;
  }
  // create shipment
  createShipment(event) {
    this.saveInprogress = true;
    const shipmentObj = {
      createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
      shipmentBol:null,
      shipmentCarrier:null,
      shipmentDate: null,
      shipmentDeliveryDate: null,
      shipmentIuId: this.EligibleShipmentForm.value.shipmentIuId,
      shipmentStatus: 'NEW',
      shipmentWaybill: null,
    }
    const data = this.getShipmentLinesForAdd(shipmentObj);
    if (event) {
      event.stopImmediatePropagation();
      this.shipmentService.createShipment(data).subscribe(
        (resultData: any) => {
          if (resultData.status === 200) {
            // console.log(Number(resultData.message.split('-')[1]));
            const shipmenntNumber = resultData.message.split('-')[1];
            this.clearShipmentLinesAfterCreate();
            // this.router.navigate(['shipment']);
            this.openSnackBar(resultData.message, '', 'success-snackbar');
            this.router.navigate(['shipment/editshipment/' + shipmenntNumber]);
          } else {
            this.openSnackBar(resultData.message, '', 'error-snackbar');
          }
          this.saveInprogress = false;
        },
        error => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
          this.saveInprogress = false;
        }
      );
    }
  }

  // clear unchecked lines after wave create
  clearShipmentLinesAfterCreate() {
    const tempArray = [];
    this.showGenerateShipmentBtn = false;
    // this.waveNumberInput = '';
    for (const pData of this.parameterData) {
      if (pData.rowSelect === true) {
        pData.rowSelect = false;
        pData.isDefault = true;
        tempArray.push(pData);
      }
    }
    this.parameterData = [];
    this.parameterData = tempArray;
    this.shipmentLineDataSource = new MatTableDataSource<any>(this.parameterData);
    this.shipmentLineDataSource.paginator = this.paginator;
    this.shipmentLineDataSource.sort = this.sort;

  }

  eligibleShipmentLogValidationErrors(group: FormGroup = this.EligibleShipmentForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.eligibleShipmentLogValidationErrors(abstractControl);
      } else {
        this.asnFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.asnFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
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
    // setTimeout(() => {
    //     this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    // }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.commonService.getScreenSize(-49); 
  }



}
