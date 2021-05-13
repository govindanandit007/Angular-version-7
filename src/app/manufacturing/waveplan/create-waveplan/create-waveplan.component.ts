import { Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, Inject, Optional, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatExpansionPanel,MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog, MatTable, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
 
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
  [x: string]: any;
 
  rowSelect: boolean,
  poNumber?: string,
  waveNumber?: string,
  woIuId: number,
  soLineQuantity: number,
  soQuantityUomCode: number,
  woId: number,
  woNumber?: any,
  woCmpQty?: any,
  woLineNumebr?: number,
  woLineId?: number,
  uomCodeValue?: string,
  criteriaId: number,
  action: string,
  editing: boolean,
  asnLineId?: number,
  addNewRecord?: boolean,
  isDefault?: boolean,
  originalData?: any,
  createdBy?: any;
  updatedBy?: any;
  woWaveEligibleQty: number;
  considerReservedQty: string;
  reservedQty: number;
  woUom?: number;
  woReqQty?: number;
  woReservedQuantity?: number;
  uomDescription?: string;
  woCmpUom? : string;
}

@Component({
  selector: 'app-create-waveplan',
  templateUrl: './create-waveplan.component.html',
  styleUrls: ['./create-waveplan.component.css']
})
export class CreateWaveplanComponent implements OnInit , AfterViewInit,OnDestroy {
  iuCodeList: any[] = [];
  soPriorityList: any[] = [];
  itemList: any[] =  [{
    value: '',
    label: ' Please Select',
  }];
  itemCategoryList: any[] = [];
  customerList: any[] = [];
  woList: any[] = [];
  shipmentList: any[] = [];
  supplierSiteList: any[] = [];
  receiptRoutingList: any[] = [];
  selectedRowsArr: any[] =[];
  WaveCriteriaForm: FormGroup;
  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle = 'Wave Management :';
  waveId: number;
 
  showSOLov = 'hide';
  showShipmentLov = 'hide';
  
  inlineSOSearchLoader = 'hide';
  
  showItemLov = 'hide';
  inlineItemSearchLoader = 'hide';
  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  supplierCodeId: any;
  customerSearchPlaceholder = 'Search Customer';
  woSearchPlaceholder = 'Search WO';
  isInput = false;
  showWaveCriteriaLov = 'show';
  
  SOLOV = false;
  
  showLinesFlag = false;
  waveCriteriaList = [];
  
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
  showSelectAll = true;
  waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  @ViewChild('mattab', { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('matExpansionPanel', { static: false }) MatExpansionPanel: any;
  expanded = true;
  selected = false;
  waveLineDisplayedColumns: string[] = [
    'rowSelect',
    'No',
    'woNumber',
    'woSubType',
    'woLineNumber',
    'itemName',
    'revsnNumber',   
    'woReqQty',
    'woWaveEligibleQty',
    'woUom'
  ];
  columns: any = [
    { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
    { field: 'No', name: '#', width: 75, baseWidth: 3 },
    { field: 'woNumber', name: 'Work Order', width: 75, baseWidth: 10 },
    { field: 'woSubType', name: 'WO Type', width: 75, baseWidth: 9 },
    { field: 'woLineNumber', name: 'WO Line', width: 75, baseWidth: 9 },
    { field: 'itemName', name: 'Item', width: 75, baseWidth: 14 },
    { field: 'revsnNumber', name: 'Item Rev', width: 75, baseWidth: 10 },
    { field: 'woReqQty', name: 'Reserved Qty', width: 75, baseWidth: 11 },
    { field: 'woWaveEligibleQty', name: 'Wave Eligible Qty', width: 75, baseWidth: 14 },
    { field: 'woUom', name: 'UOM', width: 75, baseWidth: 6 }
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
  timer: any ='';
  iuId: any;
  woTypeList: any;
  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    public woService: WorkOrderService,
    public subInventorys: SubInventoryService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.asnFeedForm();       
      this.timer = Observable.interval(500)
    .subscribe((val) => { 
      this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id;      
        if( !this.isEdit && this.iuId!== ''){             
        this.WaveCriteriaForm.patchValue({criteriaIuId:  this.iuId});        
        }      
    });        
    this.getInventoryUnitLOV();
    this.getSOPriorityLOV();
    this.getWoTypeList();
    this.getWaveCriteriaLOV();
    this.getItemCategoryLOV();
    this.getLookUpLOV('Receipt Routing');
    this.commonService.getScreenSize(200);
  }

  togglePanel($event) {
    this.expanded = !this.expanded;
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
      WOSearchValue: [''],     
      criteriaOrderPriority : [''],
      criteriaWoType : [''],      
      criteriaWoId: [null],
      
      criteriaFromShipDate: [null],
      criteriaToShipDate: [null],
      criteriaItemId: [null],
      itemSearchValue: [''],
       
      criteriaItemRevId: [null]
    });
  }

  // Get Inventory Unit LOV
  getInventoryUnitLOV() {
    this.iuCodeList = [{ label: 'None', value: '' }];
    this.commonService
      .getUserAssignIULOV()
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

  // Get wave Criteria LOV
  getWaveCriteriaLOV() {
    this.waveCriteriaList = [{ label: ' Please Select', value: '' }, { label: '+ Add Wave Criteria', value: 'newValue' }];
    this.woService
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
        this.showItemLov = 'hide';
        this.clearCriteria();
      } else if(value === '' && this.showWaveCriteriaLov ==='show'){
        this.isEdit = false;
        this.clearCriteria();
      } else {         
        this.showLinesFlag = false;
        this.showWaveCriteriaLov = 'show';
        this.WaveCriteriaForm.patchValue({ criteriaWoType: '' });
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
    this.WaveCriteriaForm.patchValue({ criteriaOrderPriority: '' });
    this.WaveCriteriaForm.patchValue({ criteriaWoType: '' });
    
    this.WaveCriteriaForm.patchValue({ WOSearchValue: '' });
    this.WaveCriteriaForm.patchValue({ criteriaWoId: "" });
    this.WaveCriteriaForm.patchValue({ criteriaItemId: "" });
    
    this.WaveCriteriaForm.patchValue({ criteriaFromShipDate: null });
    this.WaveCriteriaForm.patchValue({ criteriaToShipDate: null });   
    
    
  }

  getWaveCriteriaById(id) {
    // this.dataProgress = true;
    this.systemDate = '';
    this.waveId = id;
    this.woService.getWaveCriteriaById(id).subscribe((data: any) => {
      if (data.status === 200) { 
        this.WaveCriteriaForm.patchValue(data.result[0]);
        this.isEdit = true;
          this.getWOLOV("", '', '','from');
          if(this.itemList.length === 1){
          this.getItemLOV("", null, null,"from");
          }
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
  getItemLOV(itemName, index, event, from?) {
    //const itemNameEncoded = encodeURIComponent(itemName);
    this.commonService.getItemLovByScreen('item', 'wo', null, itemName).subscribe((data: any) => {
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
       // this.WaveCriteriaForm.patchValue({ itemId: data[0].itemId });
        if(!from){
          this.WaveCriteriaForm.patchValue({ criteriaItemId: data[0].itemId });
          }else{
            //this.WaveCriteriaForm.patchValue({ criteriaWoId: this.woList[0].woId });
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
    // && event.isUserInput === true
    if (event.source.selected && item) {
      const itemId = item.value;
      this.commonService.getRevisionLovByItem(itemId).subscribe(
        (data: any) => {
            if (data.status === 200) {
              this.itemRevisionList = [{ value   : '', label : ' Please Select' }];
              if(data.result){
                for (const rowData of data.result) {
                  this.itemRevisionList.push({
                    value: rowData.revsnId,
                    label: rowData.revsnNumber
                  });
                }
                // this.WaveCriteriaForm.patchValue({ criteriaItemRevId: this.itemRevisionList[0].revsnId });                 
              } else{
                this.WaveCriteriaForm.patchValue({ criteriaItemRevId: null });
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
    this.soPriorityList = [{ label: 'None', value: '' }];
    this.woService
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
  getWoTypeList(){
    this.woTypeList= [
    {label: 'None', value: ''},
    {value: 'ASM',label: 'Kitting'},
    {value: 'DIS',label: 'De-Kitting'}];
  }
     
  fetchNewSearchListForWO(event: any, index: any, searchFlag: any) {
    const value = this.WaveCriteriaForm.value.WOSearchValue;
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
      this.getWOLOV(this.WaveCriteriaForm.value.WOSearchValue, index, event)


    } else {
      this.showSOLov = 'hide';
      this.WaveCriteriaForm.patchValue({ criteriaWoId: null });
      this.WaveCriteriaForm.patchValue({ WOSearchValue: '' });
    }

  }
  getWOLOV(itemName, index, event,from?) {

    this.commonService.getItemLovByScreen('wo', 'wowave', '', itemName).subscribe((data: any) => {
      this.woList = [{
        value: '',
        label: ' Please Select',
        woSubType: ''
      }];

      if (data.result && data.result.length) {
        data = data.result;
        this.woList = [{
          value: '',
          label: ' Please Select',
          woSubType: ''
        }];

        for (let i = 0; i < data.length; i++) {
          this.woList.push({
            value: data[i].woId,
            label: data[i].woNumber,
            woSubType: data[i].woSubType
          })
        } 
        this.inlineSOSearchLoader = 'hide';
        this.showSOLov = 'show';
        this.WaveCriteriaForm.patchValue({ WOSearchValue: '' });

        // Set the first element of the search
        
        if(!from){
        this.WaveCriteriaForm.patchValue({ criteriaWoId: this.woList[1].value });
        }else{
          //this.WaveCriteriaForm.patchValue({ criteriaWoId: this.woList[0].woId });
        }
        

      } else {
        this.inlineSOSearchLoader = 'hide';
        this.WaveCriteriaForm.patchValue({ WOSearchValue: '' });
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
          data.criteriaFromShipDate = (data.criteriaFromShipDate === '' || data.criteriaFromShipDate === null)
          ? null : this.woService.dateFormat(data.criteriaFromShipDate);
          data.criteriaToShipDate = (data.criteriaToShipDate === '' || data.criteriaToShipDate === null)
          ? null : this.woService.dateFormat(data.criteriaToShipDate);
          this.WaveCriteriaForm.value.criteriaItemRevId =this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemRevId) : null;
          this.WaveCriteriaForm.value.criteriaItemId =this.WaveCriteriaForm.value.criteriaItemId !== null && this.WaveCriteriaForm.value.criteriaItemId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemId) : null;
          this.WaveCriteriaForm.value.criteriaWoId =this.WaveCriteriaForm.value.criteriaWoId !== null && this.WaveCriteriaForm.value.criteriaWoId !== '' ?
          (this.WaveCriteriaForm.value.criteriaWoId) : null;
           this.woService
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
          this.WaveCriteriaForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          this.WaveCriteriaForm.value.criteriaItemRevId =this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemRevId) : null;
          this.WaveCriteriaForm.value.criteriaItemId =this.WaveCriteriaForm.value.criteriaItemId !== null && this.WaveCriteriaForm.value.criteriaItemId !== '' ?
          (this.WaveCriteriaForm.value.criteriaItemId) : null;
          const data = this.WaveCriteriaForm.value;
          data.criteriaFromShipDate = (data.criteriaFromShipDate === '' || data.criteriaFromShipDate === null)
          ? null : this.woService.dateFormat(data.criteriaFromShipDate);
          data.criteriaToShipDate = (data.criteriaToShipDate === '' || data.criteriaToShipDate === null)
          ? null : this.woService.dateFormat(data.criteriaToShipDate); 
          this.woService.createWaveCriteria(data).subscribe(
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
  //  this.waveNumberInput = '';
    //this.showEditWaveBtn = false;
  }

  onStartDateChanged(event: any){
         //this.setEndDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1));
     // commented the above line to allow 'enddate' equal to the from date
     let fromDate = new Date(this.WaveCriteriaForm.controls.criteriaFromShipDate.value);
     this.setEndDate = new Date(new Date(fromDate).setDate(fromDate.getDate()));
    if(this.WaveCriteriaForm.controls.criteriaToShipDate.value){
      let toDate = new Date(this.WaveCriteriaForm.controls.criteriaToShipDate.value);
   
    toDate < fromDate ? this.WaveCriteriaForm.patchValue({ criteriaToShipDate: this.WaveCriteriaForm.controls.criteriaFromShipDate.value }) : '';
    }
    
  }

  showLinesClick(){
    if(this.WaveCriteriaForm.value.WOSearchValue !== '' && this.WaveCriteriaForm.value.criteriaWoId === null){
      this.openSnackBar('Please enter the proper value in work order field', '', 'error-snackbar');
      return;
    }
    if(this.WaveCriteriaForm.value.itemSearchValue !== '' && this.WaveCriteriaForm.value.criteriaItemId === null){
      this.openSnackBar('Please enter the proper value in item field', '', 'error-snackbar');
      return;
    }
    if (this.WaveCriteriaForm.value.criteriaIuId !== '') {
      this.showLinesFlag = true;
      //this.parameterData = [];
      this.waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      this.waveLineDataSource.paginator = this.paginator;
      this.waveNumberInput = '';
      this.showEditWaveBtn = false;
      this.considerReservedQty = false;
       
      const obj = {
        itemRevId: this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
        String(this.WaveCriteriaForm.value.criteriaItemRevId) : null,

        criteriaId: (this.WaveCriteriaForm.value.criteriaId !== null && this.WaveCriteriaForm.value.criteriaId !== '') ?
        String(this.WaveCriteriaForm.value.criteriaId): null,
        
        woIuId: this.WaveCriteriaForm.value.criteriaIuId !== '' ? String(this.WaveCriteriaForm.value.criteriaIuId) : null,

        woPriority: this.WaveCriteriaForm.value.criteriaOrderPriority !== '' ?
        String(this.WaveCriteriaForm.value.criteriaOrderPriority) : null,
        woType: this.WaveCriteriaForm.value.criteriaWoType,
        startDate: this.WaveCriteriaForm.value.criteriaFromShipDate !== null ?
        this.commonService.dateFormat(String(this.WaveCriteriaForm.value.criteriaFromShipDate)) : null,

        completionDate: this.WaveCriteriaForm.value.criteriaToShipDate !== null ?
        this.commonService.dateFormat(String(this.WaveCriteriaForm.value.criteriaToShipDate)) : null,
         
        woAssmItemId: this.WaveCriteriaForm.value.criteriaItemId !== null &&  this.WaveCriteriaForm.value.criteriaItemId !== '' ?
        String(this.WaveCriteriaForm.value.criteriaItemId) : null,
        // woCmpItemId: this.WaveCriteriaForm.value.criteriaItemId !== null ?
        // String(this.WaveCriteriaForm.value.criteriaItemId) : null,

                
        woId: this.WaveCriteriaForm.value.criteriaWoId !== null && 
        this.WaveCriteriaForm.value.criteriaWoId !== '' ? String(this.WaveCriteriaForm.value.criteriaWoId) : null,
         
        // criteriaItemRevId: this.WaveCriteriaForm.value.criteriaItemRevId !== null && this.WaveCriteriaForm.value.criteriaItemRevId !== '' ?
        // String(this.WaveCriteriaForm.value.criteriaItemRevId) : null,
       
      }
      this.listProgress = true;
      //let currentlpnobj =   this.woList.find(d => d.value === this.WaveCriteriaForm.value.criteriaWoId);
   
      // if(currentlpnobj && currentlpnobj.woSubType === 'DIS'){
      //   this.getWaveDetailsForDKT();
      // }else
      {
      
      this.woService.waveCriteriaShowLines(obj).subscribe(
        (resultData: any) => {
          if (resultData.status === 200) {
            if(!resultData.message){
              this.parameterData = [];
              this.selectedRowsArr= [];
              this.showCreateWaveBtn = false;
              this.showEditWaveBtn =  false;
              this.listProgress = false;
             // this.showSelectAll = false;  //// disabled the select all for workorder wave
              setTimeout(() => {
                this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
              }, 500);
              for (const rData of resultData.result) {
                rData.rowSelect = false;
                if(rData.woSubType === 'DIS'){
                  rData.woLineId = null;
                  rData.woLineNumber = 1;
                }
                this.parameterData.push(rData);
              }
              this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
              this.waveLineDataSource.paginator = this.paginator;
              this.waveLineDataSource.sort = this.sort;
            } else{
              this.parameterData = [];
              this.selectedRowsArr= [];
              this.waveNumberInput = '';
              this.showEditWaveBtn = false;
              this.listProgress = false;
              this.lineTableMessage = resultData.message;
              this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
              this.waveLineDataSource.paginator = this.paginator;
              this.waveLineDataSource.sort = this.sort;
               
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
    }
    } else{
      this.openSnackBar('Please select IU first.', '', 'error-snackbar');
      this.WaveCriteriaForm.controls.criteriaIuId.markAsTouched();
      this.asnFormErrors.criteriaIuId = 'IU is required.';
    }
  }
  //http://150.136.110.79:8080/wmsapi-master/service/lov-based/search/?show=WO_SHOLINES&basedOn=DEKIT&text=6918
  //
  getWaveDetailsForDKT(){
    let currentlpnobj =   this.woList.find(d => d.value === this.WaveCriteriaForm.value.criteriaWoId);
   
    if(currentlpnobj.woSubType === 'DIS'){
      // this.parameterData = [];
      // this.waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      // this.waveLineDataSource.paginator = this.paginator;
      this.waveNumberInput = '';
      this.showEditWaveBtn = false;
      
      this.woService.waveCriteriaDekitShowLines(currentlpnobj.value).subscribe(
        (resultData: any) => {
          if (resultData.status === 200) {
            if(!resultData.message){
               
              this.parameterData = [];
              this.selectedRowsArr= [];
              this.showCreateWaveBtn = false;
              this.showEditWaveBtn =  false;
              this.listProgress = false;
             // this.showSelectAll = false;  //// disabled the select all for workorder wave
              setTimeout(() => {
                this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
              }, 500);
              for (const rData of resultData.result) {
                rData.rowSelect = false;
                rData.woLineId = null;
                rData.woLineNumber = 1;
                 
                this.parameterData.push(rData);
              }
              this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
              this.waveLineDataSource.paginator = this.paginator;
              this.waveLineDataSource.sort = this.sort;
            } else{
              this.parameterData = [];
              this.waveNumberInput = '';
              this.showEditWaveBtn = false;
              this.listProgress = false;
              this.lineTableMessage = resultData.message;
              this.showSelectAll = true;
            }
          }
        }
      );
    }
    
  }
  getWaveLinesForAdd(data) { 
    
    const waveLineArray = [];
    let tempObject = {};
    for (const [i, pData] of this.parameterData.entries()) {
      if (pData.rowSelect === true) {
        tempObject = {
          createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          waveIuId: this.WaveCriteriaForm.value.criteriaIuId,         
          waveQuantity: pData.woCmpQty,
          waveQuantityUomCode: pData.woCmpUom,
          waveWoId: pData.woId,
          waveWoLineId: pData.woLineId,
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
  rowSelectionChange(ele,index){ 
    let selectRowCount = 0;
    let isDup=false;
    let uniq_values=[];
    if(this.parameterData[index].rowSelect){
      for(const [i,data] of this.parameterData.entries()){
        if(data.rowSelect){     
          if(this.selectedRowsArr.length === 0 || this.selectedRowsArr.indexOf(data.woNumber) !== -1)
          {
            isDup=true;
            uniq_values.push(data.woNumber);
            selectRowCount ++;           
            this.selectedRowsArr = uniq_values;         
          }else if(this.selectedRowsArr.length > 0 ){
            setTimeout(()=>{
              this.parameterData[index].rowSelect = false;
            },100);
           
            this.openSnackBar('Can\'t select multiple work orders', '', 'error-snackbar');
          // isDup = false;
           // this.showCreateWaveBtn = false;
            this.showEditWaveBtn =  false;
            return;
          }        
        }else {
          
        }
      }
    }
    if(this.parameterData[index].rowSelect){
      this.selectedRowsArr= [];
    for(const [i,data] of this.parameterData.entries()){      
        if(data.woNumber === this.parameterData[index].woNumber){ 
          this.parameterData[i].rowSelect = true; 
          
          this.selectedRowsArr.push(data.woNumber);
        }       
    }
  }
    if(!this.parameterData[index].rowSelect){
      if(this.selectedRowsArr.indexOf(this.parameterData[index].woNumber) !== -1)
          {         
          for(const [i,data] of this.parameterData.entries()){
            if(data.woNumber === this.parameterData[index].woNumber){ 
              this.parameterData[i].rowSelect = false; 
              //isDup=false;
              //this.selectedRowsArr = [];
            }
          }
          this.selectedRowsArr = [];
        }else {
          this.parameterData[index].rowSelect = false;
        }
    if(this.selectedRowsArr.length > 0) {  
      isDup = true;
      selectRowCount = this.selectedRowsArr.length;
    }
  }  
    this.showCreateWaveBtn = (isDup && selectRowCount > 0 ) ? true : false;
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
    this.woService.createWave(data).subscribe(
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
//added to navigate to the editwave functionality
goForEdit() {  
    if(this.WaveNumberEdit){
    this.router.navigate(['wavemfg/editwave/' + this.WaveNumberEdit]);
    this.WaveNumberEdit = null;
    }
  }
// clear unchecked lines after wave create
clearWaveLinesAfterCreate(){
  const tempArray = [];
  this.showCreateWaveBtn = false;
  this.showSelectAll = true;
  this.waveNumberInput = ''; 
   
  // this.considerReservedQty = false;
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

    ngOnDestroy(){
      this.timer ? this.timer.unsubscribe() : '';
    }
}
@Component({
  selector: 'app-scheduling-dialog',
  templateUrl: './scheduling-dialog.html',
  styleUrls: ['./create-waveplan.component.css']
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
