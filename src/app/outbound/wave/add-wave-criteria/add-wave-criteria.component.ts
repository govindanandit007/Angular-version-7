import { Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, Inject, Optional, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatExpansionPanel,MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog, MatTable, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { WaveService } from 'src/app/_services/transactions/wave.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
  rowSelect: boolean,
  poNumber?: string,
  waveNumber?: string,
  soIuId: number,
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
  soWaveEligibleQty: number;
  considerReservedQty: string;
  reservedQty: number;
  uomname: string;
}

@Component({
  selector: 'app-add-wave-criteria',
  templateUrl: './add-wave-criteria.component.html',
  styleUrls: ['./add-wave-criteria.component.css']
})

export class AddWaveCriteriaComponent implements OnInit, AfterViewInit, OnDestroy {
  iuCodeList: any[] = [];
  soPriorityList: any[] = [];
  itemList: any[] = [];
  itemCategoryList: any[] = [];
  customerList: any[] = [];
  soList: any[] = [];
  shipmentList: any[] = [];
  supplierSiteList: any[] = [];
  receiptRoutingList: any[] = [];
  WaveCriteriaForm: FormGroup;
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle = 'Wave Management :';
  waveId: number;
  showCustomerLov = 'hide';
  showSOLov = 'hide';
  showShipmentLov = 'hide';
  inlineCustomerSearchLoader = 'hide';
  inlineSOSearchLoader = 'hide';
  inlineShipmentSearchLoader = 'hide';
  showItemLov = 'hide';
  inlineItemSearchLoader = 'hide';
  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  supplierCodeId: any;
  customerSearchPlaceholder = 'Search Customer';
  soSearchPlaceholder = 'Search SO';
  isInput = false;
  showWaveCriteriaLov = 'show';
  customerLOV = false;
  SOLOV = false;
  shipmentLOV = false;
  showLinesFlag = false;
  waveCriteriaList = [];
  shipmentNumberSearchPlaceholder = 'Search Shipment Number';
  itemSearchPlaceholder = 'Search Item';
  parameterData: ParameterDataElement[] = [];
  waveNumberInput = '';
  WaveNumberEdit = null;
  considerReservedQty = false;
  listProgress = false;
  saveInprogress = false;
  lineTableMessage = '';
  itemRevisionList = [];
  showCreateWaveBtn = false;
  showEditWaveBtn = false;
  selectAllRow = false;
  showSelectAll = false;
  waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('matExpansionPanel', { static: false }) MatExpansionPanel: any;
  expanded = true;
  selected = false;
  waveLineDisplayedColumns: string[] = [
    'rowSelect',
    'No',
    'soNumber',
    'soLineNumber',
    'itemName',
    'revsnNumber',
    'soShipmentNumber',
    'reservedQty',
    'soWaveEligibleQty',
    'soQuantityUomCode'
  ];
  columns: any = [
    { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
    { field: 'No', name: '#', width: 75, baseWidth: 3 },
    { field: 'soNumber', name: 'Sales Order', width: 75, baseWidth: 12 },
    { field: 'soLineNumber', name: 'SO Line', width: 75, baseWidth: 8 },
    { field: 'itemName', name: 'Item', width: 75, baseWidth: 15 },
    { field: 'revsnNumber', name: 'Item Rev', width: 75, baseWidth: 13 },
    { field: 'soShipmentNumber', name: 'Shipment', width: 75, baseWidth: 10 },
    { field: 'reservedQty', name: 'Reserved Qty', width: 75, baseWidth: 11 },
    { field: 'soWaveEligibleQty', name: 'Wave Eligible Qty', width: 75, baseWidth: 14 },
    { field: 'soQuantityUomCode', name: 'UOM', width: 75, baseWidth: 10 }
  ]
  validationMessages = {
    criteriaIuId: {
      required: 'IU is required.'
    },
  };

  asnFormErrors = {
    criteriaIuId: ''
  };
  setEndDate : any = new Date();
  systemDate : any = new Date();
  iuId: any;
  timer: any;
  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    public waveService: WaveService,
    public subInventorys: SubInventoryService,
    public dialog: MatDialog) { }

    ngOnDestroy(){
      this.timer ? this.timer.unsubscribe() : '';
    }
  ngOnInit() {
    this.asnFeedForm();       
        this.timer = Observable.interval(500)
        .subscribe((val) => { 
          this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id;           
            if( !this.isEdit && this.iuId!== ''){             
            this.WaveCriteriaForm.patchValue({criteriaIuId:  this.iuId});             
            }          
        });
        this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
    this.getInventoryUnitLOV();
    this.getSOPriorityLOV();
    this.getWaveCriteriaLOV();
    // this.getItemLOV();
    this.getItemCategoryLOV();
    this.getLookUpLOV('Receipt Routing');
    this.commonService.getScreenSize(200);
  }

  togglePanel($event) {
    this.expanded = !this.expanded;
    // event.stopPropagation();
    if (this.expanded) {
      this.commonService.getScreenSize(200);
    } else {
      this.commonService.getScreenSize(133);
    }
  }

  expandPanel(event): void {
    event.stopPropagation(); // Preventing event bubbling

    if (this.expanded) {
      this.MatExpansionPanel.open(); // Here's the magic
    } else {
      this.MatExpansionPanel.close()
    }
  }
  getLookUpLOV(lookupName: string) {
    if (lookupName === 'Receipt Routing') {
      this.receiptRoutingList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.receiptRoutingList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
  }
  // Form Group
  asnFeedForm() {
    this.WaveCriteriaForm = this.fb.group({
      criteriaId: [null],
      criteriaName: [''],
      criteriaIuId: [(JSON.parse(localStorage.getItem('defaultIU'))).id, Validators.required],
      customerSearchValue: [''],
      SOSearchValue: [''],
      shipmentSearchValue: [''],
      criteriaOrderPriority : [''],
      criteriaTpId: [null],
      criteriaSoId: [null],
      criteriaShipmentId: [null],
      criteriaFromShipDate: [null],
      criteriaToShipDate: [null],
      criteriaItemId: [null],
      itemSearchValue: [''],
      criteriaItemCategoryId: [null],
      criteriaSoLinePriority: [''],
      criteriaItemRevId: [null]
    });
  }

  // Get Inventory Unit LOV
  getInventoryUnitLOV() {
    this.iuCodeList = [{ label: ' None', value: '' }];
    this.commonService.getUserAssignIULOV().subscribe((data: any) => {
        for (const iuData of data.result) {
          this.iuCodeList.push({
            value: iuData.iuId,
            label: iuData.iuCode,
            name: iuData.iuName
          });
        }
      });
  }

  // Get wave Criteria LOV
  getWaveCriteriaLOV() {
    this.waveCriteriaList = [{ label: ' Please Select', value: '' }, { label: '+ Add Wave Criteria', value: 'newValue' }];
    this.waveService
      .getWaveCriteriaLOV()
      .subscribe((data: any) => {
        for (const waveCriteriaData of data.result) {
          this.waveCriteriaList.push({
            value: waveCriteriaData.criteriaId,
            label: waveCriteriaData.criteriaName
          });
        }
      });
  }

  waveCriteriaChanged(event: any, value: any) {
    if (event.source.selected && event.isUserInput === true) {
      if (value === 'newValue' && this.showWaveCriteriaLov ==='show') {
        this.showWaveCriteriaLov = 'hide';
        this.clearCriteria();
      } else if(value === '' && this.showWaveCriteriaLov ==='show'){
        this.isEdit = false;
        this.clearCriteria();
      } else {
        this.showLinesFlag = false;
        this.showWaveCriteriaLov = 'show';
        this.getWaveCriteriaById(value);
      }
    } 
  }

  // clear criteria
  clearCriteria(){
    this.isEdit = false;
    this.showLinesFlag = false;
    this.WaveCriteriaForm.patchValue({ criteriaId: '' });
    this.WaveCriteriaForm.patchValue({ criteriaName: '' });
    this.WaveCriteriaForm.patchValue({ criteriaIuId: this.iuId });
    this.WaveCriteriaForm.patchValue({ customerSearchValue: '' });
    this.WaveCriteriaForm.patchValue({ criteriaTpId: null });
    this.WaveCriteriaForm.patchValue({ criteriaOrderPriority: '' });
    this.WaveCriteriaForm.patchValue({ criteriaSoLinePriority: '' });
    this.WaveCriteriaForm.patchValue({ SOSearchValue: '' });
    this.WaveCriteriaForm.patchValue({ shipmentSearchValue: '' });
    this.WaveCriteriaForm.patchValue({ criteriaFromShipDate: null });
    this.WaveCriteriaForm.patchValue({ criteriaToShipDate: null });
    this.WaveCriteriaForm.patchValue({ criteriaItemId: null });
    this.WaveCriteriaForm.patchValue({ criteriaSoId: null });
    this.WaveCriteriaForm.patchValue({ criteriaShipmentId: null });
    this.WaveCriteriaForm.patchValue({ criteriaItemCategoryId: null });
  }

  getWaveCriteriaById(id) {
    // this.dataProgress = true;
    this.systemDate = '';
    this.waveId = id;
    this.waveService.getWaveCriteriaById(id).subscribe((data: any) => {
      if (data.status === 200) {
        console.log(data.result[0]);
        this.WaveCriteriaForm.patchValue(data.result[0]);
        this.isEdit = true;
        this.WaveCriteriaForm.patchValue(
          { criteriaItemCategoryId: data.result[0].criteriaItemCategoryId !== null ? data.result[0].criteriaItemCategoryId : '' }
        );
        this.WaveCriteriaForm.patchValue({ customerSearchValue: data.result[0].customerName!== null && data.result[0].customerName!== undefined? data.result[0].customerName : ''  });
        this.WaveCriteriaForm.patchValue({ SOSearchValue: data.result[0].soNumber!== null && data.result[0].soNumber!== undefined? data.result[0].soNumber : '' });
        this.WaveCriteriaForm.patchValue({ shipmentSearchValue: data.result[0].shipmentNumber!== null && data.result[0].shipmentNumber!== undefined? data.result[0].shipmentNumber : '' });
        this.getSOLOV("", '', '','from');        
        this.getItemLOV("", null, null,"from");
        this.getShipmentLOV("","","","from");
           
      }
    });
  }

  waveCriteriaCancel(){
    this.WaveCriteriaForm.patchValue({criteriaId : ''});
    this.WaveCriteriaForm.patchValue({criteriaName : ''});
    this.showWaveCriteriaLov = 'show';
  }

  fetchNewSearchListForItem(event: any, index: any, searchFlag: any) {
    const value = this.WaveCriteriaForm.value.itemSearchValue;
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
      this.getItemLOV(this.WaveCriteriaForm.value.itemSearchValue, index, event)
    } else {
      this.showItemLov = 'hide';
      this.WaveCriteriaForm.patchValue({ criteriaItemId: null });
      this.WaveCriteriaForm.patchValue({ itemSearchValue: '' });
      this.WaveCriteriaForm.patchValue({ itemId: null });
    }

  }

  // Get Item LOV
  getItemLOV(itemName, index, event,from?) {
    const itemNameEncoded = encodeURIComponent(itemName);
    this.commonService.getItemLovByScreen('item', 'so', null, itemName).subscribe((data: any) => {
      this.itemList = [{
        value: '',
        label: ' Please Select',
      }];

      if (data.result && data.result.length > 0) {
        data = data.result;
        this.itemList = [{
          value: '',
          label: ' Please Select',
        }];
       // this.WaveCriteriaForm.patchValue({ criteriaItemId: data[0].itemId });
        for (let i = 0; i < data.length; i++) {
          this.itemList.push({
            value: data[i].itemId,
            label: data[i].itemName
          })
        }
        this.inlineItemSearchLoader = 'hide';
        this.showItemLov = 'show';
        this.WaveCriteriaForm.patchValue({ itemSearchValue: '' });

        // Set the first element of the search
        
        if(!from){
          this.WaveCriteriaForm.patchValue({ criteriaItemId: data[0].itemId });
          }

      } else {
        this.inlineItemSearchLoader = 'hide';
        this.WaveCriteriaForm.patchValue({ itemSearchValue: '' });
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  itemSelectionChanged(event: any, item:any){
    if (event.source.selected && event.isUserInput === true) {
      const itemId = item.value;
      this.commonService.getRevisionLovByItem(itemId).subscribe(
        (data: any) => {
            if (data.status === 200) {
              this.itemRevisionList = [{ value   : '', label : ' Please Select' }];
              if(data.result){
                this.WaveCriteriaForm.patchValue({ criteriaItemRevId: this.itemRevisionList[0].value });
                for (const rowData of data.result) {
                  this.itemRevisionList.push({
                    value: rowData.revsnId,
                    label: rowData.revsnNumber
                  });
                }
  
              } else{
                this.WaveCriteriaForm.patchValue({ criteriaItemRevId: '' });
              }
             
            } else {
                this.openSnackBar(data.message,'','error-snackbar');
            }
        },
        (error: any) => {
            this.openSnackBar(error.error.message,'','error-snackbar');
        }
    );
    }
  }

  // Get Item category LOV
  getItemCategoryLOV() {
    this.itemCategoryList = [{ label: ' None', value: '' }];
    this.commonService
      .getCategoryLOV()
      .subscribe((data: any) => {
        for (const itemCategoryData of data.result) {
          this.itemCategoryList.push({
            value: itemCategoryData.categoryId,
            label: itemCategoryData.categoryName1
          });
        }
      });
  }
  // Get SO Priority LOV
  getSOPriorityLOV() {
    this.soPriorityList = [{ label: ' None', value: '' }];
    this.waveService
      .getSOPriorityLOV()
      .subscribe((data: any) => {
        for (const soData of data.result) {
          this.soPriorityList.push({
            value: soData.lookupValue,
            label: soData.lookupValueDesc
          });
        }
      });
  }
  fetchNewSearchListForCustomer(event: any, index: any, searchFlag: any) {
    const value = this.WaveCriteriaForm.value.customerSearchValue;
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
      this.getCustomerLOV(this.WaveCriteriaForm.value.customerSearchValue, index, event)
    } else {
      this.showCustomerLov = 'hide';
      this.WaveCriteriaForm.patchValue({ criteriaTpId: null });
      this.WaveCriteriaForm.patchValue({ customerSearchValue: '' });
      this.WaveCriteriaForm.patchValue({ tpId:null });
    }

  }

  fetchNewListForWaveCriteria(event: any, index: any, searchFlag: any) {
    // const value = this.WaveCriteriaForm.value.searchValue;
    // let charCode = event.which ? event.which : event.keyCode;
    // if (charCode === 9) {
    //   event.preventDefault();
    //   charCode = 13;
    // }

    // if (!searchFlag && charCode !== 13) {
    //   return;
    // }

    // if (this.showWaveCriteriaLov === 'hide') {
    //   this.inlineCustomerSearchLoader = 'show';
    //   this.getCustomerLOV(this.WaveCriteriaForm.value.searchValue, index, event)


    // } else {
    //   this.showWaveCriteriaLov = 'hide';
    //   this.WaveCriteriaForm.patchValue({ searchValue: '' });
    // }

  }
  getCustomerLOV(itemName, index, event) {

    this.commonService.getItemLovByScreen('tp-name', 'trading-partner', 'CUST', itemName).subscribe((data: any) => {
      this.customerList = [{
        value: '',
        label: ' Please Select'
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.customerList = [];

        for (let i = 0; i < data.length; i++) {
          this.customerList.push({
            value: data[i].tpId,
            label: data[i].tpName
          })
        }
        console.log(this.customerList);
        this.inlineCustomerSearchLoader = 'hide';
        this.showCustomerLov = 'show';
        this.WaveCriteriaForm.patchValue({ customerSearchValue: '' });

        // Set the first element of the search
        console.log(this.WaveCriteriaForm.value);
        this.WaveCriteriaForm.patchValue({ tpId: data[0].tpId });
        console.log(this.WaveCriteriaForm.value);

      } else {
        this.inlineCustomerSearchLoader = 'hide';
        this.WaveCriteriaForm.patchValue({ customerSearchValue: '' });
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  fetchNewSearchListForSO(event: any, index: any, searchFlag: any) {
    const value = this.WaveCriteriaForm.value.SOSearchValue;
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
      this.getSOLOV(this.WaveCriteriaForm.value.SOSearchValue, index, event)


    } else {
      this.showSOLov = 'hide';
      this.WaveCriteriaForm.patchValue({ criteriaSoId: null });
      this.WaveCriteriaForm.patchValue({ SOSearchValue: '' });
    }

  }
  getSOLOV(itemName, index, event,from?) {

    this.commonService.getItemLovByScreen('so', 'wave-criteria', '', itemName).subscribe((data: any) => {
      this.soList = [{
        value: '',
        label: ' Please Select'
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.soList = [{
          value: '',
          label: ' Please Select'
        }];
  

        for (let i = 0; i < data.length; i++) {
          this.soList.push({
            value: data[i].soId,
            label: data[i].soNumber
          })
        }
        console.log(this.customerList);
        this.inlineSOSearchLoader = 'hide';
        this.showSOLov = 'show';
        this.WaveCriteriaForm.patchValue({ SOSearchValue: '' });

        // Set the first element of the search
        console.log(this.WaveCriteriaForm.value);
      //  this.WaveCriteriaForm.patchValue({ criteriaSoId: data[0].soId });
        if(!from){
          this.WaveCriteriaForm.patchValue({ criteriaSoId: this.soList[1].value });
          }else{
            //this.WaveCriteriaForm.patchValue({ criteriaWoId: this.woList[0].woId });
          }
        console.log(this.WaveCriteriaForm.value);

      } else {
        this.inlineSOSearchLoader = 'hide';
        this.WaveCriteriaForm.patchValue({ SOSearchValue: '' });
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  fetchNewSearchListForShipment(event: any, index: any, searchFlag: any) {
    const value = this.WaveCriteriaForm.value.shipmentSearchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }

    if (!searchFlag && charCode !== 13) {
      return;
    }

    if (this.showShipmentLov === 'hide') {
      this.inlineShipmentSearchLoader = 'show';
      this.getShipmentLOV(this.WaveCriteriaForm.value.shipmentSearchValue, index, event)


    } else {
      this.showShipmentLov = 'hide';
      this.WaveCriteriaForm.patchValue({ criteriaShipmentId: null });
      this.WaveCriteriaForm.patchValue({ shipmentSearchValue: '' });
    }

  }
  getShipmentLOV(itemName, index, event,from?) {

    this.commonService.getItemLovByScreen('shipment', 'wave-criteria', '', itemName).subscribe((data: any) => {
      this.shipmentList = [{
        value: '',
        label: ' Please Select'
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.shipmentList = [{
          value: '',
          label: ' Please Select'
        }];

        for (let i = 0; i < data.length; i++) {
          this.shipmentList.push({
            value: data[i].shipmentId,
            label: data[i].shipmentNumber
          })
        }
        console.log(this.customerList);
        this.inlineShipmentSearchLoader = 'hide';
        this.showShipmentLov = 'show';
        this.WaveCriteriaForm.patchValue({ shipmentSearchValue: '' });

        // Set the first element of the search
         
        console.log(this.WaveCriteriaForm.value);
         
        if(!from){
          this.WaveCriteriaForm.patchValue({ criteriaShipmentId: this.shipmentList[1].value});
          }
        console.log(this.WaveCriteriaForm.value);

      } else {
        this.inlineShipmentSearchLoader = 'hide';
        this.WaveCriteriaForm.patchValue({ shipmentSearchValue: '' });
        this.openSnackBar('No match found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }

  waveCriteriaLogValidationErrors(group: FormGroup = this.WaveCriteriaForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.waveCriteriaLogValidationErrors(abstractControl);
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
  onSubmit(event: any, formId: any) {
    if (event) {
      event.stopImmediatePropagation();
      if (this.WaveCriteriaForm.valid) {
        if (this.isEdit) {
          const data = this.WaveCriteriaForm.value;
          this.WaveCriteriaForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;      
          data.criteriaItemCategoryId = data.criteriaItemCategoryId !== null && 
          data.criteriaItemCategoryId !== '' ? data.criteriaItemCategoryId : null;
          data.criteriaItemRevId = data.criteriaItemRevId !== '' && data.criteriaItemRevId !== null ? data.criteriaItemRevId : null;
          this.WaveCriteriaForm.value.criteriaItemId =this.WaveCriteriaForm.value.criteriaItemId !== null && this.WaveCriteriaForm.value.criteriaItemId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemId) : null;
          
          data.criteriaFromShipDate = (data.criteriaFromShipDate === '' || data.criteriaFromShipDate === null)
          ? null : this.commonService.dateFormat(data.criteriaFromShipDate);
          data.criteriaToShipDate = (data.criteriaToShipDate === '' || data.criteriaToShipDate === null)
          ? null : this.commonService.dateFormat(data.criteriaToShipDate); 
          this.waveService
            .updateWaveCriteria(data, this.waveId)
            .subscribe(
              (resultData: any) => {
                if (resultData.status === 200) {
                  // this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.openDialog('Success', resultData.message);
                  this.clearCriteria();
                  this.waveCriteriaCancel();
                  this.getWaveCriteriaLOV();
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        } else {
          const data = this.WaveCriteriaForm.value;
          this.WaveCriteriaForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;      
          
          this.WaveCriteriaForm.value.criteriaItemRevId =this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemRevId) : null;
          this.WaveCriteriaForm.value.criteriaItemId =this.WaveCriteriaForm.value.criteriaItemId !== null && this.WaveCriteriaForm.value.criteriaItemId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemId) : null;
          
          data.criteriaFromShipDate = (data.criteriaFromShipDate === '' || data.criteriaFromShipDate === null)
          ? null : this.commonService.dateFormat(data.criteriaFromShipDate);
          data.criteriaToShipDate = (data.criteriaToShipDate === '' || data.criteriaToShipDate === null)
          ? null : this.commonService.dateFormat(data.criteriaToShipDate); 
          this.waveService.createWaveCriteria(data).subscribe(
              (resultData: any) => {
                if (resultData.status === 200) {
                  this.openDialog('Success', resultData.message);
                  this.clearCriteria();
                  this.waveCriteriaCancel();
                  this.getWaveCriteriaLOV();
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        }
      } else{
        this.waveCriteriaLogValidationErrors();
      }
    }
  }

  // iuId changed
  iuIdChanged(){
    // this.parameterData = [];
    // this.waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    // this.waveLineDataSource.paginator = this.paginator;
    // if(this.lineTableMessage !==''){
    //   this.lineTableMessage = '';
    // }
    // this.waveNumberInput = '';
    // this.showEditWaveBtn = false;
  }

  onStartDateChanged(event: any){
    const fromDate = new Date(this.WaveCriteriaForm.controls.criteriaFromShipDate.value);     
    this.setEndDate = new Date(new Date(fromDate).setDate(fromDate.getDate()));
    //this.setEndDate = new Date(new Date(endDate).setDate(fromDate.getDate() + 1));
   // commented the above line(735) to allow 'enddate' equal to the from date      
   if(this.WaveCriteriaForm.controls.criteriaToShipDate.value){
    let toDate = new Date(this.WaveCriteriaForm.controls.criteriaToShipDate.value); 
    toDate < fromDate ? this.WaveCriteriaForm.patchValue({ criteriaToShipDate: this.WaveCriteriaForm.controls.criteriaFromShipDate.value }) : '';
  }
  }
   
  showLinesClick(){
     
    if(this.WaveCriteriaForm.value.customerSearchValue !== '' && this.WaveCriteriaForm.value.criteriaTpId === null){
      this.openSnackBar('Please enter the proper value in customer field', '', 'error-snackbar');
      return;
    }
    if(this.WaveCriteriaForm.value.SOSearchValue !== '' && this.WaveCriteriaForm.value.criteriaSoId === null){
      this.openSnackBar('Please enter the proper value in sales order field', '', 'error-snackbar');
      return;
    }
    if(this.WaveCriteriaForm.value.shipmentSearchValue !== '' && this.WaveCriteriaForm.value.criteriaShipmentId === null){
      this.openSnackBar('Please enter the proper value in shipment field', '', 'error-snackbar');
      return;
    }
    if(this.WaveCriteriaForm.value.itemSearchValue !== '' && this.WaveCriteriaForm.value.criteriaItemId === null){
      this.openSnackBar('Please enter the proper value in item field', '', 'error-snackbar');
      return;
    }
   
    if (this.WaveCriteriaForm.value.criteriaIuId !== '') {
      this.showLinesFlag = true;
      this.parameterData = [];
      this.waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      this.waveLineDataSource.paginator = this.paginator;
      this.waveNumberInput = '';
      this.showEditWaveBtn = false;       
      const obj = {
        criteriaId: (this.WaveCriteriaForm.value.criteriaId !== null && this.WaveCriteriaForm.value.criteriaId !== '') ?
        String(this.WaveCriteriaForm.value.criteriaId): null,
        criteriaIuId: this.WaveCriteriaForm.value.criteriaIuId !== '' ? String(this.WaveCriteriaForm.value.criteriaIuId) : null,
        criteriaOrderPriority: this.WaveCriteriaForm.value.criteriaOrderPriority !== '' ?
        String(this.WaveCriteriaForm.value.criteriaOrderPriority) : null,
        criteriaFromShipDate: this.WaveCriteriaForm.value.criteriaFromShipDate !== null ?
        this.commonService.dateFormat(this.WaveCriteriaForm.value.criteriaFromShipDate) : null,
        criteriaToShipDate: this.WaveCriteriaForm.value.criteriaToShipDate !== null ?
        this.commonService.dateFormat(this.WaveCriteriaForm.value.criteriaToShipDate) : null,
        criteriaItemId: this.WaveCriteriaForm.value.criteriaItemId !== null ?
        String(this.WaveCriteriaForm.value.criteriaItemId) : null,
        criteriaItemCategoryId: this.WaveCriteriaForm.value.criteriaItemCategoryId !== '' && 
        this.WaveCriteriaForm.value.criteriaItemCategoryId !== null?
        String(this.WaveCriteriaForm.value.criteriaItemCategoryId) : null,
        criteriaTpId: this.WaveCriteriaForm.value.criteriaTpId !== null && 
        this.WaveCriteriaForm.value.criteriaTpId !== '' ? String(this.WaveCriteriaForm.value.criteriaTpId) : null,
        criteriaSoId: this.WaveCriteriaForm.value.criteriaSoId !== null && 
        this.WaveCriteriaForm.value.criteriaSoId !== '' ? String(this.WaveCriteriaForm.value.criteriaSoId) : null,
        criteriaSoLinePriority: this.WaveCriteriaForm.value.criteriaSoLinePriority !== '' ?
        String(this.WaveCriteriaForm.value.criteriaSoLinePriority) : null,
        criteriaItemRevId: this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
        String(this.WaveCriteriaForm.value.criteriaItemRevId) : null,
        criteriaShipmentId: this.WaveCriteriaForm.value.criteriaShipmentId !== null && 
        this.WaveCriteriaForm.value.criteriaShipmentId !== '' ?
        String(this.WaveCriteriaForm.value.criteriaShipmentId) : null,
      }
      this.listProgress = true;
      
      this.waveService.waveCriteriaShowLines(obj).subscribe(
        (resultData: any) => {
          if (resultData.status === 200) {
            if(!resultData.message){
              this.parameterData = [];
              this.listProgress = false;
              this.showSelectAll = false;
              setTimeout(() => {
                this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
              }, 500);
              for (const rData of resultData.result) {
                rData.rowSelect = false;
                this.parameterData.push(rData);
              }
              this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
              this.waveLineDataSource.paginator = this.paginator;
              this.waveLineDataSource.sort = this.sort;
            } else{
              this.waveNumberInput = '';
              this.showEditWaveBtn = false;
              this.listProgress = false;
              this.lineTableMessage = resultData.message;
              this.showSelectAll = true;
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
    } else{
      this.openSnackBar('Please select IU first.', '', 'error-snackbar');
      this.WaveCriteriaForm.controls.criteriaIuId.markAsTouched();
      this.asnFormErrors.criteriaIuId = 'IU is required.';
    }
  }
  getWaveLinesForAdd(data) {

    const waveLineArray = [];
    let tempObject = {};
    for (const [i, pData] of this.parameterData.entries()) {
      if (pData.rowSelect === true) {
        tempObject = {
          createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          waveIuId: pData.soIuId,
          waveLineId: pData.soLineId,
          waveQuantity: pData.soWaveEligibleQty,
          waveQuantityUomCode: pData.soQuantityUomCode,
          waveSoId: pData.soId,
          waveSoLineId: pData.soLineId,
          waveStatusCode: 'PNDNG',
          considerReservedQty: this.considerReservedQty === true ? 'Y' : 'N',
          waveElgRservedQty: pData.reservedQty
        }
        waveLineArray.push(tempObject)
      }
    }
    data.waveLines = waveLineArray;
    return data;
  }

  // row selection change
  rowSelectionChange(){
    let selectRowCount = 0;
    for(const data of this.parameterData){
        if(data.rowSelect){
            selectRowCount ++;
        }
    }
    this.showCreateWaveBtn = selectRowCount > 0 ? true : false;
    this.showEditWaveBtn =  false;
  }

  // select / unselect all wave line checkbox
  selectAll(){
    for(const pData of this.parameterData){
      if(this.selectAllRow){
        pData.rowSelect = true;
        this.showCreateWaveBtn = true;
      } else{
        pData.rowSelect = false;
        this.showCreateWaveBtn = false;
      }

    }
    this.showEditWaveBtn = false;
  }

// create wave
createWave(event){

  const waveObj={
    createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
    waveCreateShipment : null,
    waveNumber: '',
    wavePickSlipGroup: null,
    wavePolicyId: null,
    waveStagingLocatorId: null,
    waveTaskType: null,
    waveIuId: this.WaveCriteriaForm.value.criteriaIuId,
    waveStatus :'PNDNG'
  }
  const data = this.getWaveLinesForAdd(waveObj);
  if (event) {
    event.stopImmediatePropagation();
    this.saveInprogress = true;
    this.waveService.createWave(data).subscribe(
      (resultData: any) => {
        if (resultData.status === 200) {
          this.openDialog('Success', resultData.message);
          this.clearWaveLinesAfterCreate();
          this.waveNumberInput = resultData.waveNumber;
          this.WaveNumberEdit = Number(this.waveNumberInput.slice(1));
          this.showEditWaveBtn = true;
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
//added by Geetha
goForEdit() {  
    if(this.WaveNumberEdit){
    this.router.navigate(['wave/editwave/' + this.WaveNumberEdit]);
    this.WaveNumberEdit = null;
    }
  }
// clear unchecked lines after wave create
clearWaveLinesAfterCreate(){
  const tempArray = [];
  this.showCreateWaveBtn = false;
  this.showSelectAll = true;
  this.waveNumberInput = ''; 
   
  this.considerReservedQty = false;
  for(const pData of this.parameterData){
    if(pData.rowSelect === true){
      pData.rowSelect = false;
      pData.isDefault = true;
      tempArray.push(pData);
    }
  }
  this.parameterData = [];
  this.parameterData = tempArray;
  this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
  this.waveLineDataSource.paginator = this.paginator;
  this.waveLineDataSource.sort = this.sort;
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

  // Scheduling Dialog Open
  schedulingClick(){
    const dialogData = [];
    // dialogData.push(element);
    const dialogRef = this.dialog.open(SchedulingDialogComponent, {
      width: '40vw',
      // height:'50vh',
      data: dialogData,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response !== undefined) {
        // this.goFor('edit', response);
      }
    });
  }

  ngAfterViewInit() {
    this.waveLineDataSource.sort = this.sort;
    // setTimeout(() => {
    //     this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    // }, 500);
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(200);
    }
}
@Component({
  selector: 'app-scheduling-dialog',
  templateUrl: './scheduling-dialog.html',
  styleUrls: ['./add-wave-criteria.component.css']
})
export class SchedulingDialogComponent {
  waveViewdColumns: string[] = [
    'serialNumber',
    'soNumber',
    'soLineNumber',
    'itemName',
    'revsnNumber',
    'soShipmentNumber',
    'waveQuantity',
    'waveQuantityUomCode',
    'waveStatus',
    // 'asnReceiptRouting'
  ];
  resultData = [];
  recur: any = '';
  recurrencePattern = 'W';
  weekdays: any = {
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
  }
  waveParameterDataSource = new MatTableDataSource<any>(this.resultData);
  dataProgress = false;
  rangeofRecurrence = 'NED';
  recurEndDate: any = ''
  onDate: any = '';
  onMonthName: any = '';
  startDate: any = '';
  endByDate: any = '';
  dayList: any = [];
  monthList: any = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' }
  ];
  constructor(
    private dialog: MatDialog,
    private waveService: WaveService,
    public commonService: CommonService,
    public dialogRef: MatDialogRef<SchedulingDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    // this.getWaveDetailsById(data[0].waveId);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  optionchanged() {
    this.recur = '';
  }
  // getWaveDetailsById(id) {
  //   this.dataProgress = true;
  //   this.waveService.getWaveById(id).subscribe((data: any) => {
  //     if (data.status === 200) {
  //       console.log(data.result.waveLines[0]);
  //       if (data.result.waveLines.length) {
  //         for (const waveLineData of data.result.waveLines) {
  //           this.resultData.push(waveLineData);
  //           this.waveParameterDataSource = new MatTableDataSource<any>(
  //             this.resultData
  //           );
  //         }
  //       }
  //       this.dataProgress = false;
  //     }
  //   });
  // }
  getDayList(event: any, value: any) {
    if (event.source.selected === true && event.isUserInput === true) {
      let dateLength = 31
      this.dayList = []
      if (value === 2) {
        dateLength = 29
      }
      if (value === 4 || value === 6 || value === 9 || value === 11) {
        dateLength = 30
      }
      for (let i = 1; i <= dateLength; i++) {
        this.dayList.push({ label: i, value: i })
      }
    }
  }
}
