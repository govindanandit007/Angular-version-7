import { Component, OnInit, ViewChild, Renderer2, ElementRef,QueryList, HostListener, OnChanges, DoCheck, ViewChildren, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog, MatTable, MatSort, MatSelect, Sort } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { Observable } from 'rxjs';
import { element } from 'protractor';

export interface ParameterDataElement {
  poIuId: number,
  poLineNumber: number,
  poItemId: number,
  itemName?: string,
  searchValue? : string,
  itemList?: any,
  shipmentCreated:any,
  inlineSearchLoader? : string,
  poItemRevision: any,
  poItemRevisionList?: any;
  poUomCode: string,
  poQuantity: number,
  poPrice: number,
  poCurrencyCode: string,
  poPlannedReceiptDate: string,
  poLineReceiptQty: number,
  poReceiptRouting: string,
  poLineAmount: number,
  action: string;
  editing: boolean;
  poLineId?: number;
  crossDockHeader: number;
  crossDockLine: number;
  addNewRecord?: boolean;
  isDefault?: boolean;
  originalData?: any;
  UOMList?: any[];
  addCrossDock?: any;
  updateCrossDock?: any;
  createdBy?: any;
  updatedBy?: any;
}

export interface ParameterDataElementItemSearch {
  itemName         : string;
  itemId           : any;
  itemDescription  : string;
}

export interface ParameterDataElementCrossDock {
  crossDockId? : any,
  soId          : string;
  soLineId      : any;
  poIuId?       : any;
  soLineQty     : any;
  remainingQty  : any;
  sourceType    : string;
  soNumber      : any;
  soLineNumber  : any;
  editing       : boolean;
  action        : string;
  addNewRecord? : boolean;
  soList?       : any[] , 
  soLineList?   : any[] ,
  originalData? : any,
  processFlag? : any
}
@Component({
  selector: 'app-add-po',
  templateUrl: './add-po.component.html',
  styleUrls: ['./add-po.component.css']
})
export class AddPoComponent implements OnInit,OnDestroy {
  ouCodeList: any[] = [];
  iuCodeList: any[] = [];
  supplierList: any[] = [];
  supplierSiteList: any[] = [];
  itemList: any[] = [];
  UOMList: any[] = [];
  poStatusList: any[] = [];
  poTypesList: any[] = [];
  currencyList: any[] = [];
  receiptRoutingList: any[] = [];
  PurchaseOrderForm: FormGroup;
  parameterData: ParameterDataElement[] = [];
  poLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  listProgressPopup: any = false;
  itemTableMessage: any = '';
  parameterDataItemSearch: ParameterDataElementItemSearch[] = [];
  parameterDataSourceItemSearch = new MatTableDataSource<ParameterDataElementItemSearch>(this.parameterDataItemSearch);

  
  listProgressPopupCrossDock: any = false;
  crossDockTableMessage: any = 'No Data Found';
  parameterDataCrossDock: ParameterDataElementCrossDock[] = [];
  crossDockArray: any[] = [];
  parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);

  isEditRoles = false;
  isAdd = false;
  isEdit = false;
  formTitle: string;
  poId : number;
  isStatus = false;
  currencyCode = '';
  showLov = 'hide';
  inlineSearchLoader = 'hide';
  saveInprogress = false;
  currentDate =  new Date;
  currentIndex: any = null;
  currentSelectedData: any = null;
  selectedRowIndex: any = null;
  searchItemName: any = '';
  searchDescription: any = '';
  isDailogOpen: any = false;
  disableCrossIcon: any = false;

    
  currentDialog: any = '';
  currentCrossIndex: any = null;

  tooltipPosition: TooltipPosition[] = ['below'];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  
  @ViewChildren('iufield') iuFields: QueryList<HTMLElement>;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginatorSearchItem', { static: false }) paginatorSearchItem: MatPaginator;

  @ViewChild('crossDockTable', {read: ElementRef, static: false} ) matCrossDockTableRef: ElementRef;
  @ViewChild('paginatorCrossDock', { static: false }) paginatorCrossDock: MatPaginator;


  
  parameterDisplayedColumnsItemSearch: string[] = [
    'No',
    'itemName',
    'itemDescription'
  ];

  itemDialogColumns: any =  [
    {field: 'No', name: '#', width: 75, baseWidth: 10 },
    {field: 'itemName', name: 'Item Name', width: 75, baseWidth: 20 },
    {field: 'itemDescription', name: 'Item Description', width: 75, baseWidth: 70 }
  ]

 parameterDisplayedColumnsCrossDock: string[] = [
    'No',
    'soNumber',
    'soLineNumber',
    'soLineQty',
    'remainingQty',
    'action'
  ];
  crossDockDialogColumns: any =  [
    {field: 'No', name: '#', width: 20, baseWidth: 7 },
    {field: 'soNumber', name: 'SO Number', width: 50, baseWidth: 15 },
    {field: 'soLineNumber', name: 'Line Number + Item Name', width: 50, baseWidth: 35 },
    {field: 'soLineQty', name: 'SO Line Qty', width: 50, baseWidth: 15 },
    {field: 'remainingQty', name: 'Remaining Qty', width: 50, baseWidth: 19 },
    {field: 'action', name: 'Action', width: 50, baseWidth: 9 },
  ]

  poLineDisplayedColumns: string[] = [
    // 'No',
    'poLineNumber',
    'poIuId',
    'poItemId',
    'poItemRevision',
    'poUomCode',
    'poQuantity',
    'poPrice',
    'poReceiptRouting',
    'poCurrencyCode',
    'poPlannedReceiptDate',
    'poLineReceiptQty',
    'poLineAmount',
    'action'
  ];

  columns: any =  [
    {field: 'poLineNumber', name: 'Line #', width: 75, baseWidth: 5 },
    {field: 'poIuId', name: 'IU', width: 75, baseWidth: 9 },
    {field: 'poItemId', name: 'Item', width: 75, baseWidth: 9.5 },
    {field: 'poItemRevision', name: 'Item Revision', width: 75, baseWidth: 8 },
    {field: 'poUomCode', name: 'UOM', width: 75, baseWidth: 7 },
    {field: 'poQuantity', name: 'Quantity', width: 75, baseWidth: 7 },
    {field: 'poPrice', name: 'Price', width: 75, baseWidth: 5 },
    {field: 'poReceiptRouting', name: 'Receipt Routing', width: 75, baseWidth: 9.5 },
    {field: 'poCurrencyCode', name: 'Currency', width: 75, baseWidth: 6 },
    {field: 'poPlannedReceiptDate', name: 'Planned Receipt Date', width: 75, baseWidth: 11 },
    {field: 'poLineReceiptQty', name: 'Receipt Qty', width: 75, baseWidth: 8 },
    {field: 'poLineAmount', name: 'Line Amount', width: 75, baseWidth: 8 },
    {field: 'action', name: 'Action', width: 75, baseWidth: 9 }
  ]
  soLineListJson = {
    soId:'',
    itemId:''
}
soListJson = {
  poItemId:'',
  poIuId:''
}
isAddCrossDock: boolean;
isEditCrossDock: boolean;
  

  validationMessages = {
    poNumber: {
      required: 'PO Number is required.'
    },
    poType: {
      required: 'PO Type is required.'
    },
    poStatus: {
      required: 'PO Status is required.'
    },
    poOuId: {
      required: 'OU is required.'
    },
    poSupplierId: {
      required: 'Supplier is required.'
    },
    poSupplierSiteId: {
      required: 'Supplier Site is required.'
    },
    poCurrencyCode: {
      required: 'Currency is required.'
    },
    poAmount: {
      required: 'Amount is required.'
    }
  };

  poFormErrors = {
    poNumber: '',
    poType: '',
    poStatus: '',
    poOuId: '',
    poSupplierId: '',
    poSupplierSiteId: '',
    poCurrencyCode: '',
    poAmount: ''
  };
  soList: any[];
  currentpoIuId: string;
  currentLineNumber: any;
  currentItemId: any;
  iuId: any;
  timer: any ='';
  iuList: any[];


  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    public dialog: MatDialog ) { }

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
    this.getItemLOV();
    this.getLookUpLOV('PO Status');
    this.getLookUpLOV('PO Types');
    this.getLookUpLOV('Currency Details');
    this.getLookUpLOV('Receipt Routing');
    this.purchaseOrderFeedForm();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit Purchase Order';
        this.isEdit = true;
        this.poId = params.id;
        this.purchaseOrderService
          .getPoById(params.id)
          .subscribe((data: any) => {
            this.PurchaseOrderForm.patchValue(data.result[0]);
            this.PurchaseOrderForm.patchValue({searchValue : data.result[0].supplierName});
            this.supplierSelectionChanged({source : {selected : true}, isUserInput : true} , this.PurchaseOrderForm.value.poSupplierId)
            this.formTitle = 'Edit Purchase Order : ' + data.result[0].poNumber;
            this.renderEditRoles(data.result[0].poLines);
          });
      } else {
        this.formTitle = 'Create Purchase Order :';
        this.PurchaseOrderForm.patchValue({poType: 'SPO'});
        setTimeout(() => {
          this.addRow();
        },100)
      }
    });
    this.commonService.getScreenSize(140);
  }
   
  // Form Group
  purchaseOrderFeedForm() {
    this.PurchaseOrderForm = this.fb.group({
      poNumber: [{ value: '', disabled: true }],
      poType: ['', Validators.required],
      poDescription: [''],
      poStatus: ['', Validators.required],
      poOuId: ['', Validators.required],
      poSupplierId: ['', Validators.required],
      searchValue: [''],
      poSupplierSiteId: ['', Validators.required],
      poNoteToSupplier: [''],
      poCurrencyCode: ['', Validators.required],
      poAmount: [{ value: '0', disabled: true }],
    });
  }
  
 // Get OU and Inventory Unit LOV
 getIUOULOV() {
  this.iuList = [];
  this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id; 
  this.commonService.getInventoryOrgById(this.iuId).subscribe(
    (data: any) => {
        if (data.status === 200) {
          for (const ouData of data.result) {
            this.iuList.push({
              value: ouData.iuOuId,            
              iuId: ouData.iuId,
              iuCode: ouData.iuCode,            
            });
          }            
          let currentobj = this.iuList.find(obj => obj.iuId === this.iuId);
          if (currentobj && !this.isEdit) {
           this.PurchaseOrderForm.controls["poOuId"].setValue(currentobj.value);
          }else if(!this.isEdit){
            this.PurchaseOrderForm.controls["poOuId"].setValue(null);
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
            label: ouData.ouCode,
            currency: ouData.currency
          });
        }
      });
  }

  // IU LOV on OU Selection Changed
  ouSelectionChanged(event: any, Id: number, currency: string) {
    if (event.source.selected) {
      this.PurchaseOrderForm.patchValue({ poCurrencyCode: currency });
      this.commonService.getIUBasedOnOULOV(Id).subscribe((data: any) => {
        this.iuCodeList = [];
        for (const IUData of data.result) {
          this.iuCodeList.push({
            value: IUData.iuId,
            label: IUData.iuCode,
            name: IUData.iuName,
          });
        }
   if(!this.isEdit){
    let currentobj = this.iuCodeList.find(obj => obj.value === this.iuId);            
    if (data.result.length) {
      for (const pData of this.parameterData) {
        if (currentobj) {
          pData.poIuId = currentobj.value;
         }else{
          pData.poIuId = this.iuCodeList[0].value;
         }
      }
    } else {
      for (const pData of this.parameterData) {
        pData.poIuId = null;
      }
    }
  }


      });
      for (const item of this.parameterData) {
        item.addCrossDock = [];
      }
    }
  }

  onIUChanged(event: any, element, index){
    if (event.source.selected) {
      this.parameterData[index].addCrossDock = [];
    }
  }


  fetchNewSearchListForSupplier(event: any, index: any, searchFlag: any){
    const value = this.PurchaseOrderForm.value.searchValue;
    let charCode = event.which ? event.which : event.keyCode;
    if(charCode === 9){
       event.preventDefault();
       charCode = 13;
    }

    if ( !searchFlag && charCode !== 13 ){
      return;
    }
     if(this.showLov === 'hide'){
      this.PurchaseOrderForm.patchValue({ poSupplierId: null });
     
      this.inlineSearchLoader = 'show';
      this.getItemLovByScreenForSupplier(this.PurchaseOrderForm.value.searchValue, index, event)


    }else{
        this.showLov = 'hide';
        this.PurchaseOrderForm.patchValue({ searchValue: '' });
        this.PurchaseOrderForm.patchValue({ poSupplierId: null });
    }

  }

  getItemLovByScreenForSupplier(itemName, index, event){

    this.commonService.getItemLovByScreen( 'tp-name', 'trading-partner', 'SUPP' , itemName).subscribe((data: any) => {
        this.supplierList = [{
          value   : '',
          label : ' Please Select'
        }];

        if( data.result && data.result.length){
          data =  data.result;
          this.supplierList = [];

            for(let i=0; i<data.length; i++){
                this.supplierList.push({
                  value   : data[i].tpId,
                  label : data[i].tpName
              })
            }
            console.log(this.supplierList);
            this.inlineSearchLoader = 'hide';
            this.showLov = 'show';
            this.PurchaseOrderForm.patchValue({ searchValue: ' ' });

            // Set the first element of the search
            console.log(this.PurchaseOrderForm.value);
            this.PurchaseOrderForm.patchValue({ poSupplierId: data[0].tpId });
            console.log(this.PurchaseOrderForm.value);

        }else{
          this.inlineSearchLoader = 'hide';
          this.openSnackBar('No match found', '','error-snackbar');
        }
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  // Get Supplier LOV
  getSupplierLOV() {
    this.iuCodeList = [];
    this.commonService
      .getSupplierLOV()
      .subscribe((data: any) => {
        for (const iuData of data.result) {
          this.supplierList.push({
            value: iuData.tpId,
            label: iuData.tpName
          });
        }
      });
  }

  // Supplier Site LOV on change supplier
  supplierSelectionChanged(event: any, Id: number) {
    if (event.source.selected && event.isUserInput === true) {
      this.supplierSiteList = [];
      this.commonService.getSupplierSiteLOV(Id).subscribe((data: any) => {
        if(data.result){
          if(data.result.length === 1){
            this.PurchaseOrderForm.patchValue({poSupplierSiteId : data.result[0].tpSiteId})
          }
          for (const supplierSiteData of data.result) {
            
            this.supplierSiteList.push({
              value: supplierSiteData.tpSiteId,
              label: supplierSiteData.tpSiteName
            });
          }
        }

      });
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



  searchItem(event: any, index: any, value: string, templateRef: TemplateRef<any>){
    if (this.isDailogOpen === true) {
      return;
    }
    this.searchItemName = value
    this.parameterData[index].inlineSearchLoader = 'show';
    this.currentIndex = index;
    this.getItemLov(index, templateRef);
  }

  getItemLov(index?,templateRef?){
    let itemNameEncoded = '';
    itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
    itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded ;

    this.commonService.getItemLovByItemAndDesc( 'item', 'po', null , itemNameEncoded).subscribe((data: any) => {
        this.listProgressPopup = true;
        this.parameterData[index].itemList = [{
          key   : '',
          viewValue : ' Please Select',
          itemDescription : ''
        }];
    
        if( data.result && data.result.length){
          data =  data.result;
          this.parameterData[index].itemList = [];
            for(let i=0; i<data.length; i++){
              this.parameterData[index].itemList.push({
                  value   : data[i].itemId,
                  label : data[i].itemName,
                  data : data[i]

              })
            }
            this.parameterData[index].inlineSearchLoader = 'hide';
            // Set the first element of the search
            if(this.parameterData[index].itemList.length === 1 ){
                this.parameterData[index].poItemId = data[0].itemId;
                this.parameterData[index].searchValue = data[0].itemName;
                this.getUOMList( data[0].itemId, index);
                this.getRevisionlist( data[0].itemId, index);
                this.disableCrossIcon = false;
            }else{
              this.openItemListDialog( this.parameterData[index].itemList, templateRef);
            }
        }else{
          this.parameterData[index].inlineSearchLoader = 'hide';
          this.openItemListDialog( [], templateRef);
        }
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  updateDialogDatasourse(){
      this.parameterDataItemSearch = [];
      this.parameterDataSourceItemSearch = new MatTableDataSource<any>([]);
      this.listProgressPopup = true;
      this.selectedRowIndex = null;
      let itemNameEncoded = '';
      itemNameEncoded = this.searchItemName !== undefined && this.searchItemName !== '' ? this.searchItemName : '';
      itemNameEncoded = this.searchDescription !== undefined && this.searchDescription !== '' ? itemNameEncoded + '--' + this.searchDescription : itemNameEncoded ;

      this.commonService.getItemLovByItemAndDesc( 'item', 'po', null , itemNameEncoded).subscribe((data: any) => {
        let itemList: any = [];
    
        if( data.result && data.result.length){
          data =  data.result;
            itemList = [];
            for(let i=0; i<data.length; i++){
              itemList.push({
                  value   : data[i].itemId,
                  label : data[i].itemName,
                  data : data[i]

              })
            }
            this.openItemListDialog(itemList);
        }else{
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


  openItemListDialog( itemList, templateRef?: TemplateRef<any>){
    this.disableCrossIcon = false

    this.parameterDataItemSearch = [];
    this.parameterDataSourceItemSearch = new MatTableDataSource<any>([]);
    this.currentDialog = 'item';
    this.isDailogOpen = true;
    if (itemList.length) {
      if(templateRef){
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
         window.localStorage.getItem('paginationSize') : 10 );
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
          window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
        this.listProgressPopup = false;
        if(templateRef){
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
  validateCrossDataEntries(index){  
    let tempArray =[];  
    if(this.parameterDataCrossDock){
    for(const rowData of this.parameterDataCrossDock){
      if(rowData.soId !== '' || rowData.soLineId !== ''){
        tempArray.push(rowData);
      }
      console.log('loop runs');
    }  
    this.parameterData[index].addCrossDock = tempArray;
  }
  }
  
  closeDialog(){
    this.dialog.closeAll();
    if( document.getElementById('row'+this.currentIndex)){
    document.getElementById('row'+this.currentIndex).focus();
    }
    if(this.parameterData[this.currentIndex]){
    this.parameterData[this.currentIndex].searchValue = this.parameterData[this.currentIndex].itemName;
    }
    this.currentSelectedData = null;
    this.currentIndex = null;
    this.searchItemName = '';
    this.searchDescription = '';
    this.selectedRowIndex = null;
    this.isDailogOpen = false;
    
  }

  getSelectedItemRecord(data, index){
    this.selectedRowIndex = index;
    this.currentSelectedData = data;
  }

  saveSelectedItem(){
    if(this.currentIndex !== null && this.currentSelectedData !== null){
      if(this.parameterData[this.currentIndex].poItemId !== this.currentSelectedData.itemId ){
        if(this.isEdit === true && !this.parameterData[this.currentIndex].addNewRecord){
          this.deleteCrossDockList(this.currentIndex);
        }
        if( (this.isEdit === true && !this.parameterData[this.currentIndex].addNewRecord) || 
             this.parameterData[this.currentIndex].addNewRecord){
          this.parameterData[this.currentIndex].addCrossDock = [];
        }
      }
      this.parameterData[this.currentIndex].poItemId = this.currentSelectedData.itemId;
      this.parameterData[this.currentIndex].itemName = this.currentSelectedData.itemName;
      this.parameterData[this.currentIndex].searchValue = this.currentSelectedData.itemName;
      this.getUOMList(this.currentSelectedData.itemId, this.currentIndex);
      this.getRevisionlist(this.currentSelectedData.itemId, this.currentIndex);
    }
    this.closeDialog();
  }

  deleteCrossDockList(index){
    if(this.parameterData[index].addCrossDock.length === 0 ){
      return;
    }
    const crossDockArray = [];
    for (const itemData of this.parameterData[index].addCrossDock) {
      crossDockArray.push({crossDockId : itemData.crossDockId})
    }
    const data = {
      addCrossDock : crossDockArray
    }
    this.purchaseOrderService.deleteCrossDockList(data).subscribe(
      (data: any) => {
          if (data && data.status === 200) {
              if(data.message === 'deleted'){
                this.parameterData[index].addCrossDock = [];
              }else{
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

  clearSearchFields(){
    this.searchItemName    = '';
    this.searchDescription = '';
  }
  // Get UOM LOV
  getUOMLOV() {
    this.UOMList = [];
    this.commonService
      .getUOMLOV()
      .subscribe((data: any) => {
        for (const uomData of data.result) {
          this.UOMList.push({
            value: uomData.uomCode,
            label: uomData.unitOfMeasure
          });
        }
      });
  }
  // Get UOM List
  getUOMList(itemId, index) {
    this.parameterData[index].UOMList = [];
    this.purchaseOrderService
      .getUomByItem(itemId)
      .subscribe((data: any) => {
        // console.log(data.result);
        this.parameterData[index].UOMList.push({
          value: data.result[0].primaryUomCode,
          label: data.result[0].psUnitOfMeasure
        });

        if(this.parameterData[index].poUomCode === ''){
          this.parameterData[index].poUomCode = data.result[0].primaryUomCode;
        }
        if(data.result[0].secondaryUomCode !== null){
          this.parameterData[index].UOMList.push({
            value: data.result[0].secondaryUomCode,
            label: data.result[0].suUnitOfMeasure
          });
        }

      });
  }
  // Get PO Status
  getLookUpLOV(lookupName:string) {
    if (lookupName === 'PO Status'){
      this.poStatusList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.poStatusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    if (lookupName === 'PO Types'){
      this.poTypesList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.poTypesList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    if (lookupName === 'Currency Details'){
      this.currencyList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.currencyList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    if (lookupName === 'Receipt Routing'){
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
  poLineAmount(index) {
    this.parameterData[index].poLineAmount = Number(this.parameterData[index].poPrice) * Number(this.parameterData[index].poQuantity);
    this.calculatePoAmount();
  };
  poLogValidationErrors(group: FormGroup = this.PurchaseOrderForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.poLogValidationErrors(abstractControl);
      } else {
        this.poFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.poFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  beginEdit(rowData: any, $event: any, index: any) {
      for (const pData of this.parameterData) {
          if (pData.addNewRecord === true) {
              this.openSnackBar('Please add your records first.', '','error-snackbar');
              return;
          }
      }
      if (rowData.editing === false) {
          rowData.editing = true;
          this.isAdd = false;
          this.isEditRoles = true;
          rowData.showLov                    = 'hide';
          rowData.inlineSearchLoader         = 'hide';
          rowData.searchValue = rowData.itemName;
          this.getUOMList( rowData.poItemId, index);
          this.getRevisionlist( rowData.poItemId, index);
          this.getCrossDockDetails(rowData.poLineId, index);
      } else {
         
      }
  }

  disableEdit(rowData: any, index: any) {
    if (rowData.editing === true) { 
       this.parameterData[index].isDefault            = this.parameterData[index].originalData.isDefault;
       this.parameterData[index].poCurrencyCode       = this.parameterData[index].originalData.poCurrencyCode;
       this.parameterData[index].poItemId             = this.parameterData[index].originalData.poItemId;
       this.parameterData[index].itemName             = this.parameterData[index].originalData.itemName;
       this.parameterData[index].poItemRevision       = this.parameterData[index].originalData.poItemRevision;
       this.parameterData[index].poIuId               = this.parameterData[index].originalData.poIuId;
       this.parameterData[index].poLineAmount         = this.parameterData[index].originalData.poLineAmount;
       this.parameterData[index].poLineId             = this.parameterData[index].originalData.poLineId;
       this.parameterData[index].poLineNumber         = this.parameterData[index].originalData.poLineNumber;
       this.parameterData[index].poLineReceiptQty     = this.parameterData[index].originalData.poLineReceiptQty;
       this.parameterData[index].poPlannedReceiptDate = this.parameterData[index].originalData.poPlannedReceiptDate;
       this.parameterData[index].poPrice              = this.parameterData[index].originalData.poPrice;
       this.parameterData[index].poQuantity           = this.parameterData[index].originalData.poQuantity;
       this.parameterData[index].poReceiptRouting     = this.parameterData[index].originalData.poReceiptRouting;
       this.parameterData[index].poUomCode            = this.parameterData[index].originalData.poUomCode;
       this.parameterData[index].crossDockHeader      = this.parameterData[index].originalData.crossDockHeader;
       this.parameterData[index].crossDockLine        = this.parameterData[index].originalData.crossDockLine;
       this.parameterData[index].editing = false;
       this.isEditRoles = false;

    };
    this.calculatePoAmount();
}

  deleteRow(rowData: any, rowIndex: number) {
    this.selectedRowIndex = null;
      this.parameterData.splice(rowIndex, 1);
      this.poLineDataSource = new MatTableDataSource<
          ParameterDataElement
      >(this.parameterData);
     
      this.checkIsAddRow();
       let count = 0;
    for (const pData of this.parameterData) {
      if(count <= this.parameterData.length){
        pData.poLineNumber = ++count;         
      }     
    }
    this.poLineDataSource.paginator = this.paginator;
    this.poLineDataSource.sort = this.sort;
      this.calculatePoAmount();
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

  addRow() {
    this.selectedRowIndex = null;
    //Sorting will work in ascending order when page add new row function call   
    if(this.sort.direction === 'desc'){
      const sortState: Sort = {active: 'woLineNumber', direction: 'asc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      this.poLineDataSource.sort = this.sort;
      }
      
    if(this.matTableRef.nativeElement.clientHeight > 240 ){
        const elem = document.getElementById('customTable');
        elem.scrollTop = 0;
    }
    for (const pData of this.parameterData) {
        if (pData.editing === true && pData.addNewRecord === false) {
            this.openSnackBar('Please update your records first.', '','error-snackbar');
            return;
        }
    }
    let MaxLineNumber = 0;
    if(this.parameterData.length){
      MaxLineNumber = Math.max.apply(Math, this.parameterData.map(function (key) { return key.poLineNumber; }))
    }
   this.isAdd = true;
    this.isEditRoles = false;
    if(this.PurchaseOrderForm.value.poCurrencyCode){
      this.currencyCode = this.PurchaseOrderForm.value.poCurrencyCode;
    }
    let currentobj = this.iuCodeList.find(obj => obj.value === this.iuId);
    let poIuId = null;
    if(currentobj){
      poIuId = currentobj.value;
    } 
    this.parameterData.push({
      poIuId: poIuId,
      poLineNumber: this.isEdit ? MaxLineNumber + 1 :this.parameterData.length + 1,
      poItemId: null,
      shipmentCreated: 'N',
      inlineSearchLoader          : 'hide',
      poItemRevision: '',
      poItemRevisionList: [],
      poUomCode: '',
      poQuantity: null,
      poPrice: 1,
      poCurrencyCode: this.currencyCode,
      poPlannedReceiptDate: this.purchaseOrderService.dateFormat(new Date()),
      poLineReceiptQty: null,
      poReceiptRouting: '',
      poLineAmount: 0,
      crossDockHeader: null,
      crossDockLine: null,
      addCrossDock: [],
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false
    });
    this.poLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.paginator.pageIndex = Math.floor(this.parameterData.length / this.paginator.pageSize);
    this.poLineDataSource.paginator = this.paginator;     
    setTimeout(() => {
      this.iuFields.last.focus();
  },100);
      

  }

 

  renderEditRoles(data) {
    for (const [index, pData] of data.entries()) {
      const obj = {
        poIuId: pData.poIuId,
        poLineNumber: pData.poLineNumber,
        poItemId: pData.poItemId,
        itemName: pData.itemName,
        shipmentCreated: pData.shipmentCreated,
        searchValue: pData.itemName,
        poItemRevision: pData.poItemRevision,
        poUomCode: pData.poUomCode,
        poQuantity: pData.poQuantity,
        poPrice: pData.poPrice,
        poCurrencyCode: pData.poCurrencyCode,
        poPlannedReceiptDate: pData.poPlannedReceiptDate,
        poLineReceiptQty: pData.poLineReceiptQty,
        poReceiptRouting: pData.poReceiptRouting,
        poLineAmount: pData.poLineAmount,
        poLineId:pData.poLineId,
        crossDockHeader:pData.crossDockHeader,
        crossDockLine:pData.crossDockLine,
        addCrossDock: [],
        action: '',
        editing: false,
        addNewRecord: false,
        isDefault: true,


      }
      
      const temp: any = Object.assign({}, obj);
      temp.originalData = Object.assign({}, obj);

      this.parameterData.push(temp);
      this.getUOMList(pData.poItemId, index);
    }
      this.poLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      
      // Sorting Start
      const sortState: Sort = {active: '', direction: ''};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      // Sorting End
      this.poLineDataSource.sort = this.sort;
      this.poLineDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
      this.poLineDataSource.paginator = this.paginator;

  }
  getPOLinesForAdd(data) {
    let tempObject = {};
    const poLineArray = [];
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.poIuId === null || pData.poItemId === null ||  pData.poUomCode === ''
          || pData.poQuantity === null || pData.poPrice === null
          || pData.poReceiptRouting === '') {
            this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row '+  (i+1), '', 'error-snackbar');
          return 'validateError';
        }
        

        const numberPoQuantity = Number(pData.poQuantity);
        if (!(numberPoQuantity > 0)) {
          this.selectedRowIndex = i;
          this.openSnackBar(
            'PO quantity should be greater then 0 in PO line ' + (i+1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.poQuantity && pData.poLineReceiptQty && pData.poQuantity < pData.poLineReceiptQty) {
          this.selectedRowIndex = i;
          this.openSnackBar(
            'PO quantity should be equal or greater then PO receipt quantity in PO line ' + (i+1), '', 'error-snackbar');
          return 'validateError';
        }
      }
      for (const [i,pData] of this.parameterData.entries()) {
        pData.poLineNumber = pData.poLineNumber!==null?Number(pData.poLineNumber):null;
        pData.poQuantity = pData.poQuantity !== null ? Number(pData.poQuantity) : 0;
        pData.poPrice = pData.poPrice !== null ? Number(pData.poPrice) : null;
        pData.poLineReceiptQty = pData.poLineReceiptQty !== null ? Number(pData.poLineReceiptQty) : null;
        pData.poLineAmount = pData.poLineAmount !== null ? Number(pData.poLineAmount) : null;
        pData.poPlannedReceiptDate = this.purchaseOrderService.dateFormat(pData.poPlannedReceiptDate);
        pData.crossDockLine = pData.crossDockLine !== null ? Number(pData.crossDockLine) : null;
        pData.crossDockHeader = pData.crossDockHeader !== null ? Number(pData.crossDockHeader) : null;
        pData.createdBy =    JSON.parse(localStorage.getItem('userDetails')).userId;
        
        poLineArray.push(pData)
        tempObject = {};
      }
      data.addPoLines = poLineArray;
      return data;
    }else{
      data.addPoLines = poLineArray;
      return data;

    }
  }

  
  getPOLinesForEdit(data) {
    const poLineArray = [];
    const updatePoLineArray = [];
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i,pData] of this.parameterData.entries()) {
        if (pData.poIuId === null || pData.poItemId === null ||  pData.poUomCode === ''
          || pData.poQuantity === null || pData.poPrice === null
          || pData.poReceiptRouting === '') {
            this.selectedRowIndex = i;
          this.openSnackBar('Please enter all required fields in row ' + (i+1), '', 'error-snackbar');
          return 'validateError';
        }
        const numberPoQuantity = Number(pData.poQuantity);
        if (!(numberPoQuantity > 0)) {
          this.openSnackBar(
            'PO quantity should be greater then 0 in PO line ' + (i+1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.poQuantity && pData.poLineReceiptQty && pData.poQuantity < pData.poLineReceiptQty) {
          this.openSnackBar(
            'PO quantity should be equal or greater then PO receipt quantity in PO line ' + (i+1), '', 'error-snackbar');
          return 'validateError';
        }
        if (pData.poLineId) {
          if (pData.editing || this.isEdit){
            // delete pData.action;
            // delete pData.editing;
            // delete pData.addNewRecord;
            pData.poLineNumber = pData.poLineNumber !== null ? Number(pData.poLineNumber) : null;
            pData.poQuantity = pData.poQuantity !== null ? Number(pData.poQuantity) : 0;
            pData.poPrice = pData.poPrice !== null ? Number(pData.poPrice) : null;
            pData.poLineReceiptQty = pData.poLineReceiptQty !== null ? Number(pData.poLineReceiptQty) : null;
            pData.poLineAmount = pData.poLineAmount !== null ? Number(pData.poLineAmount) : null;
            pData.poPlannedReceiptDate = this.purchaseOrderService.dateFormat(pData.poPlannedReceiptDate);
            pData.crossDockLine = pData.crossDockLine !== null ? Number(pData.crossDockLine) : null;
            pData.crossDockHeader = pData.crossDockHeader !== null ? Number(pData.crossDockHeader) : null;
            pData.updatedBy =    JSON.parse(localStorage.getItem('userDetails')).userId;
            updatePoLineArray.push(pData)
          }
        } else {
          delete pData.action;
          delete pData.editing;
          delete pData.addNewRecord;
          pData.poLineNumber = pData.poLineNumber !== null ? Number(pData.poLineNumber) : null;
          pData.poQuantity = pData.poQuantity !== null ? Number(pData.poQuantity) : null;
          pData.poPrice = pData.poPrice !== null ? Number(pData.poPrice) : null;
          pData.poLineReceiptQty = pData.poLineReceiptQty !== null ? Number(pData.poLineReceiptQty) : null;
          pData.poLineAmount = pData.poLineAmount !== null ? Number(pData.poLineAmount) : null;
          pData.poPlannedReceiptDate = this.purchaseOrderService.dateFormat(pData.poPlannedReceiptDate);
          pData.createdBy =    JSON.parse(localStorage.getItem('userDetails')).userId;
        
          poLineArray.push(pData)
        }

      }
      data.addPoLines = poLineArray;
      data.updatePoLines = updatePoLineArray;
      return data;
    }
  }
  onSubmit(event: any, formId: any) {
    if(event){
      event.stopImmediatePropagation();
      this.selectedRowIndex = null;
      if (this.PurchaseOrderForm.valid) {
        this.PurchaseOrderForm.patchValue({ poAmount: Number(this.PurchaseOrderForm.controls.poAmount.value)})

        if (this.isEdit) {
          const data = this.getPOLinesForEdit(this.PurchaseOrderForm.value);

          if (data === 'validateError'){
            return
          }
          data.poAmount = Number(this.PurchaseOrderForm.controls.poAmount.value);
          this.saveInprogress = true;
          this.purchaseOrderService
            .updatePO(data,this.poId)
            .subscribe(
              (resultData:any) => {
                if (resultData.status === 200) {
                  this.saveInprogress = false;
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['purchaseorder']);
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
        } else {
        this.PurchaseOrderForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId
        const data = this.getPOLinesForAdd(this.PurchaseOrderForm.value);
        if (data === 'validateError'){
          return
        }
        if(!this.parameterData.length){
          this.openSnackBar('Please enter purchase order line', '', 'error-snackbar');
            return
        }
        this.saveInprogress = true;
        this.purchaseOrderService
            .createPO(data)
            .subscribe(
              (resultData:any) => {
                if (resultData.status === 200) {
                  this.saveInprogress = false;
                  this.openDialog('Success', resultData.message);
                  this.router.navigate(['purchaseorder']);
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
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
        for (const [i,pData] of this.parameterData.entries()) {
          if (pData.poIuId === null || pData.poItemId === null ||  pData.poUomCode === ''
            || pData.poQuantity === null || pData.poPrice === null
            || pData.poReceiptRouting === '') {
              this.selectedRowIndex = i;
              break;
          }
        }

      }
    }
  }
  POcancel(){
    this.router.navigate(['purchaseorder']);
  }

  poTypeSelectionChanged(event:any, value:string){
    if (event.source.selected && event.isUserInput === true) {
        if(value === 'SPO'){
          this.PurchaseOrderForm.patchValue({poStatus: 'APRVD'});
          this.isStatus = true;
        } else{
          this.PurchaseOrderForm.patchValue({poStatus: ''});
          this.isStatus = false;
        }
    }
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
        },
        disableClose: true
    });
}

  // currency selection change function
  currencySelectionChanged(event: any,  element:any){
     
    if (event.source.selected && event.isUserInput === true) {
      if(this.parameterData.length){
        for (let i = 0; i < this.parameterData.length; i++) {
          if(this.parameterData[i].editing){
            this.parameterData[i].poCurrencyCode = element.value;
            this.currencyCode = element.value;
          }
        }
      }
    }
  }

  // calculate po amount
  calculatePoAmount(){
    let amount = 0;
    for (let i = 0; i < this.parameterData.length; i++) {
      this.PurchaseOrderForm.controls.poAmount.patchValue(amount += this.parameterData[i].poLineAmount)
    }
  }

 

  getRevisionlist(itemId, index){
    this.commonService.getRevisionLovByItem(itemId)
    .subscribe(
        (data: any) => {
            if (data.status === 200) {
              if(data.result && data.result.length){
                this.parameterData[index].poItemRevisionList = [];
                this.parameterData[index].poItemRevision = data.result[0].revsnNumber

                for (const rowData of data.result) {
                  this.parameterData[index].poItemRevisionList.push({
                    value: rowData.revsnNumber,
                    label: rowData.revsnNumber
                  });
                }
              }else{
                this.parameterData[index].poItemRevisionList = [{
                  value: '0',
                  label: '0'
                }];
                this.parameterData[index].poItemRevision = '0';
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


  ngAfterViewInit() {
    this.poLineDataSource.sort = this.sort;
    this.poLineDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
    }, 500);
}

ngOnDestroy(){
  this.timer ? this.timer.unsubscribe() : '';
}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.commonService.getScreenSize(140);
  }

  // Cross Dock popup code 
  openCrossDockPopup(event: any, index: any, element: any, templateRef: TemplateRef<any>){
    if(element.poItemId && element.poIuId){
        this.currentpoIuId = element.poIuId;
        this.currentItemId = element.poItemId
        this.currentCrossIndex = index;
        this.currentDialog = 'crossDock';        
        this.getSoList(element.poItemId, element.poIuId);
        this.parameterDataCrossDock = [];
       
        for (const rowData of this.parameterData[index].addCrossDock) {
          rowData.processFlag = rowData.processFlag === 'Y' ? true : false;
        }
        
        this.parameterDataCrossDock = this.parameterData[index].addCrossDock;
        this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
        setTimeout(() => {
           this.paginatorCrossDock.pageSizeOptions = this.commonService.paginationArray;
           this.paginatorCrossDock.pageSize = Number(window.localStorage.getItem('paginationSize') ? 
           window.localStorage.getItem('paginationSize') : 10 );
           this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
           this.commonService.setTableResize(this.matCrossDockTableRef.nativeElement.clientWidth, this.crossDockDialogColumns);
        }, 100);
        const dialogRef: any = this.dialog.open(templateRef, {
          autoFocus: false,
          width: '65vw',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
           
          this.updateCloseDialogData();
        });
      }else{
        this.openSnackBar('Please select the Item and IU','', 'error-snackbar');
      }
    }

    updateCloseDialogData(){
          if(this.currentDialog === 'item'){
            this.isDailogOpen = false;
          }
      
          if(this.currentDialog === 'crossDock'){
            this.parameterData[this.currentCrossIndex].addCrossDock = this.parameterDataCrossDock;
            for(const rowData of this.parameterData[this.currentCrossIndex].addCrossDock){
              rowData.processFlag = rowData.processFlag === true ? 'Y' : 'N';
            }
            this.validateCrossDataEntries(this.currentCrossIndex);
          }
      
          this.currentDialog = '';
          
        }
  
    getSoList(itemId, iuId){
      this.soList = [];   
      this.soListJson = { poItemId: itemId, poIuId: iuId};  
      this.purchaseOrderService.getSoList(this.soListJson)
      .subscribe((data: any) => {
        if(data.result && data.result.length){
          for (const rowData of data.result) {           
              this.soList.push({
                value: rowData.soId,
                label: rowData.soNumber
              });        
          }
        }  
      });
    }
  
    getCrossDockDetails(polineid , index){ 
       
        let obj: any = {};
        let tempArray: any = []; 
        this.purchaseOrderService.getCrossDockDetails(polineid)
        .subscribe((data: any) => {
          if(data.result && data.result.length){
             for (const crossDockObj of data.result) {  
              obj = {
                crossDockId: crossDockObj.crossDockId,
                soId : crossDockObj.xsoId,
                soNumber : crossDockObj.soNumber,
                soLineId : crossDockObj.xsoLineId,
                soLineNumber: crossDockObj.soLineNumber,
                soLineQty: crossDockObj.soLineQty,
                remainingQty: crossDockObj.remainingQty,
                sourceType: 'PO',
                action: '',
                soList: this.soList,
                soLineList: [],
                processFlag: crossDockObj.processFlag, 
                editing: false,
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

    setParameterData(tempArray, index){
      this.parameterData[index].addCrossDock = tempArray;
    }

    soLineChanged(event: any, index: any , element, item){
      if (event.source.selected ) {
        let count = 0;
        this.selectedRowIndex = null;
      for(const [i, rowData] of this.parameterDataCrossDock.entries()){
        if(rowData.soId !== '' && rowData.soLineId !== ''){
          if(rowData.soId === element.soId && rowData.soLineId === element.soLineId){
            count++;
            if(count === 2){
              this.selectedRowIndex = index;
              this.parameterDataCrossDock[index].soLineId = '';
              this.parameterDataCrossDock[index].soLineNumber = ''
              this.parameterDataCrossDock[index].soId = '';
              this.parameterDataCrossDock[index].soLineList = [];
              this.openSnackBar('PO and PO line combination already exist in line ' + (index + 1),'','error-snackbar');
              return;
            }
          }
        }
      }
      this.parameterDataCrossDock[index].soLineNumber = item.label; 
      this.parameterDataCrossDock[index].soLineQty    = item.data.soLineQty; 
      this.parameterDataCrossDock[index].remainingQty = item.data.remainingQty; 
    }
   }
    soChanged(event: any, index: any){    
      if (event.source.selected) {
          this.parameterDataCrossDock[index].soNumber = event.source.selected.viewValue;   
          this.parameterDataCrossDock[index].soList = this.soList;   
          this.getSoLineList(this.parameterDataCrossDock[index].soId,  index);
      }
    }
  
    getSoLineList(soID,  index){
      this.parameterDataCrossDock[index].soLineList =[];
      this.soLineListJson.soId = soID;
      this.soLineListJson.itemId = this.currentItemId;
     this.purchaseOrderService.getSoLineList(this.soLineListJson)
      .subscribe((data: any) => {
        if(data.result && data.result.length){
          for (const rowData of data.result) {
            this.parameterDataCrossDock[index].soLineList.push({
              value: rowData.soLineId,
              label: rowData.soLineNumber,
              data: rowData
            });
          }
          if(data.result.length){
            this.parameterDataCrossDock[index].soLineId = data.result[0].soLineId;
          }
        }else if(data.message){
          this.openSnackBar( 'No SO Line found', '','error-snackbar');             
        }
      });
    }
    beginCrossDockEdit(rowData: any, $event: any, index: any) {
  
      for (const pData of this.parameterDataCrossDock) {
          if (pData.addNewRecord === true) {
              this.openSnackBar('Please add your records first.', '','error-snackbar');
              return;
          }
      }
      if (!rowData.processFlag && rowData.editing === false) {
          rowData.editing = true;
          this.isAddCrossDock = false;
          this.isEditCrossDock = true;
          this.getSoLineList(rowData.soId,index);         
      }else if (rowData.processFlag) {
        this.openSnackBar('Can\'t edit this Line', '','error-snackbar');
        return;
      }  
    }
    disableCrossDockEdit(rowData: any, index: any) {
      if (this.parameterDataCrossDock[index].editing === true) {
         this.parameterDataCrossDock[index].soId                 = this.parameterDataCrossDock[index].originalData.soId;
         this.parameterDataCrossDock[index].soLineId             = this.parameterDataCrossDock[index].originalData.soLineId;
         this.parameterDataCrossDock[index].soNumber             = this.parameterDataCrossDock[index].originalData.soNumber;
         this.parameterDataCrossDock[index].soLineNumber         = this.parameterDataCrossDock[index].originalData.soLineNumber;
         this.parameterDataCrossDock[index].soLineQty            = this.parameterDataCrossDock[index].originalData.soLineQty;
         this.parameterDataCrossDock[index].remainingQty         = this.parameterDataCrossDock[index].originalData.remainingQty;
         
         
         this.parameterDataCrossDock[index].editing              = false;
         this.parameterDataCrossDock[index].addNewRecord         = false;
         this.isEditCrossDock                                    = false;
      };
  }
  
  deleteCrossDockRow(rowData: any, rowIndex: number) {
      this.parameterDataCrossDock.splice(rowIndex, 1);
      this.parameterDataSourceCrossDock = new MatTableDataSource<ParameterDataElementCrossDock>(this.parameterDataCrossDock);
      this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
      this.checkIsCrossDockAddRow();
      this.selectedRowIndex = null;
       
    }
    checkIsCrossDockAddRow(){
      let cnt = 0;
      const pLength = this.parameterDataCrossDock.length;
      for(const pdata of this.parameterDataCrossDock){
          if(pdata.addNewRecord === true){
              return;
          } else{
              cnt ++;
          }
      }
      if(cnt === pLength){
          this.isAddCrossDock = false;
      }
    }
    addSoRow() {
      this.isAddCrossDock = true;
      this.isEditCrossDock = false;
      this.parameterDataCrossDock.unshift({
          crossDockId: null,
          soId: '',
          soNumber : '',
          soLineId : '',
          soLineQty: null,
          remainingQty: null,
          soLineNumber: '',
          sourceType: 'PO',
          action: '',
          soList: this.soList,
          soLineList: [],
          editing: true,
          addNewRecord: true
      });
    this.parameterDataSourceCrossDock = new MatTableDataSource<any>(this.parameterDataCrossDock);
    this.parameterDataSourceCrossDock.paginator = this.paginatorCrossDock;
  }
   
  addSOList(type: string){
      let tempArray = [];     
      this.parameterData[this.currentCrossIndex].addCrossDock = [];
      for(const [i, rowData]of this.parameterDataCrossDock.entries()){       
        if( rowData.soId !== '' && rowData.soLineId !== ''){
          rowData.editing = false;
          rowData.addNewRecord = false;
          const temp: any = Object.assign({}, rowData);
          rowData.originalData = temp;
          tempArray.push(rowData); 
         }else{
            this.selectedRowIndex = i;
            this.openSnackBar('please fill the records' + (i + 1),'','error-snackbar');
            return;
         }              
      } 

      for(const rowData of tempArray){
        rowData.processFlag = rowData.processFlag === true ? 'Y' : 'N';
      }

      this.parameterData[this.currentCrossIndex].addCrossDock = tempArray;
      this.dialog.closeAll();
    }

    sortChanged($event){
      // Added for pagination inilitization
      this.paginator.pageIndex = 0;             
      this.parameterData = this.poLineDataSource.sortData(this.poLineDataSource.filteredData, this.poLineDataSource.sort);      
     
  }
}
