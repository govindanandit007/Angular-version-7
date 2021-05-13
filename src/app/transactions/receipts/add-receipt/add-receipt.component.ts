import { Component, OnInit, ViewChild, Renderer, EventEmitter, OnDestroy, Output, Optional,
  Inject,  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { ReceiptsService } from 'src/app/_services/transactions/receipts.service';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';


export interface ParameterDataElement {
  recptLines_LineNum        : string,
  recptLines_QTY            : string,
  recptLines_item           : string,
  recptLines_itemID         : string,
  recptLines_itemRevision   : string,
  recptLines_itemRevisionID : string,
  recptLines_uomCode        : string,
  recptLines_sourceDoc      : string,
  recptLines_sourceValue    : string,
  recptLines_sourceLine     : string,
  recptLines_source         : string,
  recptLines_toLG           : string,
  recptLines_toLocator      : string,
  recptLines_LPN            : string,
  recptLines_LPN_Name?      : string,
  recptLines_New_LPN        : string,
  recptLines_LPN_disable?   : boolean,
  recptLines_fromIU         : string,
  recptLines_toIU           : string,
  isLocatorRequired         : string,
  recptLines_sourceList     : any,
  recptLines_sourceLineList : any,
  recptLines_toLgList       : any,
  recptLines_toLocatorList  : any,
  LPNList?                  : any,
  batchQuantity?            : any,
  batchControlled?          : any,
  batchGenerate?            : any,
  serialControlled?         : any,
  showLPN?                  : any,  
  batchArray?               : any,  
  serialArray?              : any, 
  serialMode?               : boolean,  
  action                    : string,
  editing                   : boolean,
  addNewRecord?             : boolean
}

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.css'],
  providers: [ReceiptsService]
})
export class AddReceiptComponent implements OnInit {

  receiptForm: FormGroup;
  isEditable = false;
  isEdit = false;
  isAdd = false;
  listProgress = false;
  formTitle: string;
  headeriuList = [];
  iuList = [];
  tradingPartnerList = [];
  tradingPartnerSiteList = [];
  usernameList = [];
  uomCodeList = [];
  fromIUList = [];
  toIUList = [];
  sourceDocList = [];
  sourceCodeList = [];
  sourceList = [];
  sourceLineList = [];
  toLgList = [];
  toLocatorList = [];
  receiptId : any = '';
  isReceiptFlag : any = false;
  receiptLinesNumber : any = 0;
  sourceDocLabel : any;
  sourceDocCode : any;
  headerIUcode : any;
  receiptLineSourceList : any = [];
  LPNList: any = [];

  

  

  receiptLineTableMessage = 'No Receipt Lines defined.';

  parameterData: ParameterDataElement [] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
      
      'recptLines_LineNum',     
      'recptLines_QTY',         
      'recptLines_item',        
      'recptLines_itemRevision',
      'recptLines_uomCode',     
      'recptLines_sourceDoc',   
      'recptLines_source',
      'recptLines_sourceLine',    
      //'recptLines_fromIU',
      'recptLines_toIU',
      'recptLines_LPN',
      'recptLines_toLG',        
      'recptLines_toLocator',   
      'action',                 
    ];

  validationMessages = {
    receiptNum: {
      required: 'Receipt number is required.'
    },
    intShipmentNo: {
      required: 'Receipt shipment number is required.'
    },
    receiptIU: {
      required: 'IU number is required.'
    },
    tradingPartner: {
      required: 'Trading Partner is required.'
    },
    tradingPartnerSite: {
      required: 'Trading Partner site is required.'
    },
    username: {
      required: 'User Name is required.'
    },
    wayAirBillNo: {
      required: 'Way and Air bill number is required.'
    },
    sourceCode: {
      required: 'Source Code is required.'
    },
    sourceDoc:  {
      required: 'Source Doc is required.'
    },
    billOfLanding: {
      required: 'Bill of landing is required.'
    },
    packingSlip: {
      required: 'Packing Slip is required.'
    },
    gross: {
      required: 'Gross weight is required.'
    },
    net: {
      required: 'Net weight is required.'
    },
    tar: {
      required: 'Tar is required.'
    },
    uomCode: {
      required: 'UOM Code is required.'
    },
  };

  receiptFormErrors = {
    receiptNum: '',
    intShipmentNo: '',
    receiptIU: '',
    tradingPartner: '',
    tradingPartnerSite: '',
    username: '',
    wayAirBillNo: '',
    sourceCode: '',
    sourceDoc: '',
    billOfLanding: '',
    packingSlip: '',
    gross: '',
    net: '',
    tar: '',
    uomCode: '',

  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private render: Renderer,
    public commonService: CommonService,
    private receiptService: ReceiptsService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];

  ngOnInit() {
    this.receiptsFeedForm();
    
   
    

    this.route.params.subscribe(params => {
       
      this.get_headeriuList();
      this.get_tradingPartnerList();
      this.get_uomCodeList();
      this.get_sourceCodeList();
      this.get_sourceDocList();
   
      if (params.id) {
          
        this.receiptId = params.id;
        this.formTitle = 'Edit Receipt:'
        this.isEdit = true;
        this.isReceiptFlag = true;
        this.receiptService
          .getReceiptDetailById(params.id)
          .subscribe((data: any) => {
            
            let tempObj = {
              receiptNum        : data.result[0].receiptNum,
              intShipmentNo     : data.result[0].intShipmentNum,
              receiptIU         : data.result[0].iuId,
              tradingPartner    : data.result[0].tpId, 
              tradingPartnerSite: data.result[0].tpSiteId, 
              username          : data.result[0].employeeName, 
              wayAirBillNo      : data.result[0].wayAirBillNum,
              billOfLanding     : data.result[0].billOfLading, 
              sourceCode        : data.result[0].receiptSourceCode,
              sourceDoc         : data.result[0].receiptSourceType,  
              packingSlip       : data.result[0].packingSlip, 
              gross             : data.result[0].grossWeight, 
              net               : data.result[0].netWeight, 
              tar               : data.result[0].tarWeight, 
              uomCode           : data.result[0].weightUomCode 
            }
            this.receiptForm.setValue(tempObj);
            this.receiptForm.get('sourceDoc').disable();
            this.receiptForm.get('receiptIU').disable();
             
            this.get_receiptLineSource(data.result[0].receiptSourceType,data.result[0].iuId)
            this.renderEditReceiptLines(data.result[0].receiptLines);

          });
      } else {
          this.isEdit = false;
          this.formTitle = 'Create Receipt:';
      }
    });

    
  }

  

  receiptsFeedForm() {
    this.receiptForm = this.fb.group({
      receiptNum: [{ value: '', disabled: 'true' }],
      intShipmentNo: ['', Validators.required],
      receiptIU: ['', Validators.required],
      tradingPartner: ['', Validators.required],
      tradingPartnerSite: ['', Validators.required],
      username: [{ value: JSON.parse(localStorage.getItem('userDetails')).userName, disabled: 'true' }],
      wayAirBillNo: ['', Validators.required],
      billOfLanding: ['', Validators.required],
      sourceCode: ['', Validators.required],
      sourceDoc: ['', Validators.required],
      packingSlip: ['', Validators.required],
      gross: ['', Validators.required],
      net: ['', Validators.required],
      tar: ['', Validators.required],
      uomCode: ['', Validators.required],
    });
  }

  receiptLogValidationErrors(group: FormGroup = this.receiptForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.receiptLogValidationErrors(abstractControl);
      } else {
        this.receiptFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.receiptFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  beginEdit(rowData: any, $event: any) {
    
    for (const pData of this.parameterData) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','default-snackbar');
            return;
        }
    }
    if (rowData.editing === false) {
        rowData.editing = true;
        this.isAdd = false;
        this.isEdit = true;
        this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
        rowData.editing = false;
        this.isEdit = (this.isReceiptFlag == false) ? false : true;
        this.render.setElementClass($event.target, 'editIconEnable', false);
    }
  }

  deleteRow(rowData: any, rowIndex: number) {
      this.parameterData.splice(rowIndex, 1);
      this.parameterDataSource = new MatTableDataSource<
          ParameterDataElement
      >(this.parameterData);
      this.parameterDataSource.paginator = this.paginator;
      this.checkIsAddRow();

      
      let count = this.parameterData.length + 1;
      for (const pData of this.parameterData) {
        pData.recptLines_LineNum = String(--count); 
      }
    
      if(this.parameterData.length === 0) {
        this.receiptForm.get('sourceDoc').enable();
        this.receiptForm.get('receiptIU').enable();
      }

    
      
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

  addRow() {
      if(  this.headerIUcode === undefined
         || this.sourceDocCode === undefined
         || this.sourceDocCode === '' 
         || this.headerIUcode === '' ){
        this.openSnackBar(' Please Select the IU and source doc value first', '','default-snackbar');
        return;
      }else{
        this.get_receiptLineSource(this.sourceDocCode, this.headerIUcode)
      }

      // for (const pData of this.parameterData) {
      //   if (pData.editing === true && pData.addNewRecord === false) {
      //       this.openSnackBar('Please update your records first.', '','default-snackbar');
      //       return;
      //   }
      // }

    this.isAdd = true;
    this.isEdit = (this.isReceiptFlag === false) ? false : true;
    
    let MaxLineNumber : any = 0;

    if(this.parameterData.length){
      MaxLineNumber = Math.max.apply(Math, this.parameterData.map( key => { return key.recptLines_LineNum; }))
    }

    
    this.parameterData.unshift({
        recptLines_LineNum        : this.isEdit ? MaxLineNumber + 1 :this.parameterData.length + 1,
        recptLines_QTY            : '',
        recptLines_item           : '',
        recptLines_itemID         : '',
        recptLines_itemRevision   : '',
        recptLines_itemRevisionID : '',
        recptLines_uomCode        : '',
        recptLines_sourceDoc      : this.sourceDocLabel,
        recptLines_sourceValue    : this.sourceDocCode,
        recptLines_sourceLine     : '',
        recptLines_source         : '',
        recptLines_fromIU         : this.headerIUcode,
        recptLines_toIU           : this.headerIUcode,
        recptLines_LPN            : '',
        recptLines_New_LPN        : '',
        recptLines_LPN_disable    : false,
        recptLines_toLG           : '',
        recptLines_toLocator      : '',
        isLocatorRequired         : '',
        action                    : '',
        showLPN                   : 'hide',
        recptLines_sourceList     : [],
        recptLines_sourceLineList : [],
        recptLines_toLgList       : [],
        recptLines_toLocatorList  : [],
        editing                   : true,
        addNewRecord              : true
    });

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
  }, 100);

    if(this.parameterData.length !== 0) {
      this.receiptForm.get('sourceDoc').disable();
      this.receiptForm.get('receiptIU').disable();
    }

  }

 
  focusOut(index){
    
      let data = {};
    
      if( this.parameterData[index].recptLines_New_LPN !== '' ){
        data = {
          "lpnIuId"   : this.headerIUcode,
          "lpnNum"    : this.parameterData[0].recptLines_New_LPN,
          "createdBy" :JSON.parse(localStorage.getItem('userDetails')).userId
        }
        this.receiptService.generateLPN(data).subscribe( data => {
            if (data.status === 200) {
              this.addLPNID(data.id, index);
            } else {
                this.openSnackBar('LPN not added successfully', '','default-snackbar');
            }
          },
          error => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
            return null;
          }
        );
      }
      // else{
      //   if(this.parameterData[index].recptLines_LPN === 'newValue' ||
      //   this.parameterData[index].recptLines_LPN === ''){
      //     this.openSnackBar(' Please Select the LPN from list or create new LPN', '','default-snackbar');
      //   }
      // }
      
  }

  addLPNID(lpnID, index){
     
     
      this.parameterData[index].recptLines_New_LPN = '';
      this.parameterData[index].recptLines_LPN = lpnID;
      this.get_LPNList( this.headerIUcode);
  }

  openSnackBar(message: string, action: string, typeClass:string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }

  get_headeriuList(){
    this.commonService.getIULOV().subscribe((data: any) => {
      
      if (data.status === 200) {
        data = data.result;
        if( data && data.length){
            for(var i=0; i<data.length; i++){
                this.headeriuList.push({
                    value   : data[i].iuId,
                    label : data[i].iuCode
                })
                this.toIUList.push({
                  value   : data[i].iuId,
                  label : data[i].iuCode
                })
                this.fromIUList.push({
                  value   : data[i].iuId,
                  label : data[i].iuCode
                })
              
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  headerIUchanged(event: any, value: any){
    if (event.source.selected && event.isUserInput === true) {
      this.headerIUcode = value;
      this.get_LPNList( this.headerIUcode);
    }
  }

  get_tradingPartnerList(){
    this.commonService.getSupplierLOV().subscribe((data: any) => {
        if (data.status === 200) {
          data = data.result;
          this.tradingPartnerList = [];
          if( data && data.length){
              for(var i=0; i<data.length; i++){
                  this.tradingPartnerList.push({
                      value   : data[i].tpId,
                      label   : data[i].tpCode
                  })
              }
          }
        }else{
          this.openSnackBar(data.message, '','error-snackbar');
        }
        
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
    
  }

  supplierSelectionChanged(event: any, Id: number){
    if (event.source.selected && event.isUserInput === true) {
      this.tradingPartnerSiteList = [];
      this.commonService.getSupplierSiteLOV(Id).subscribe((data: any) => {
        if ( data && data.status === 200) {
          data = data.result;
          if(data.length){
              for(var i=0; i<data.length; i++){
                  this.tradingPartnerSiteList.push({
                      value   : data[i].tpSiteId,
                      label   : data[i].tpSiteCode
                  })
              }
          }
        }else{
          this.openSnackBar(data.message, '','error-snackbar');
        }
        
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }
  }

  get_uomCodeList(){
    this.commonService.getUOMLOV().subscribe((data: any) => {
      if ( data && data.status === 200) {
        data = data.result;
        this.uomCodeList = [];
        if(data.length){
            for(var i=0; i<data.length; i++){
                this.uomCodeList.push({
                    value   : data[i].uomCode,
                    label   : data[i].unitOfMeasure
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  
  get_sourceDocList(){
    this.commonService.getLookupLOV('SOURCE_DOC_TYPE').subscribe((data: any) => {
      if ( data && data.status === 200) {
        data = data.result;
        this.sourceDocList = [];
        if(data.length){
            for(var i=0; i<data.length; i++){
                this.sourceDocList.push({
                    value   : data[i].lookupValue,
                    label   : data[i].lookupValueDesc
                })
            }
        }
        
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  sourceDocChanged(event: any, value: any){
    
    if (event.source.selected && event.isUserInput === true) {
      this.sourceDocLabel = event.source.viewValue;
      this.sourceDocCode  = value;
    }
    
  }



  get_receiptLineSource(sourceDocCode, headerIUcode){
    this.receiptService.getReceiptById(sourceDocCode, headerIUcode).subscribe((data: any) => {
      if ( data && data.status === 200) {
        data = data.result;
        this.receiptLineSourceList = [];
        if(data && data.length){
            for(var i=0; i<data.length; i++){
              this.receiptLineSourceList.push({
                    value   : data[i].sourceId,
                    label   : data[i].sourceNumber
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  sourceChanged(event: any, sourceId: number, index){
    if (event.source.selected && event.isUserInput === true) {
        
      this.receiptService.getSourceLineLOV(sourceId, this.sourceDocCode).subscribe((data: any) => {
      if ( data && data.status === 200) {
        data = data.result;
        this.parameterData[index].recptLines_sourceLineList = [{
          value:'',
          label:' Please Select',
          item    : '', 
          quantity: ''
          
        },
        {
          value:'',
          label:'Line No',
          item    : 'Item', 
          quantity: 'Quantity'
          
        }];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
                
                this.parameterData[index].recptLines_sourceLineList.push({
                    value   : data[i].sourceLineId,
                    label   : data[i].sourceLineNumber,  
                    item    : data[i].sourceItemName, 
                    quantity: data[i].sourceItemQty ,
                    sourceLinedata : data[i]
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
    }
  }

  get_LPNList(iuID){
    this.receiptService.getLPNLOV(iuID).subscribe((data: any) => {
      if (data.status === 200) {
        data = data.result;
         
        this.LPNList = [{ label: ' Please Select', value: '' },{ label: 'New', value: 'newValue' }];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
                this.LPNList.push({
                    value   : data[i].lpnId,
                    label   : data[i].lpnNum
                   
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  lpnChanged(event: any, value: any, index){
    if ( event.isUserInput === true) {
      if(value === 'newValue'){
        this.parameterData[index].showLPN  = 'show';
      }else{
        this.parameterData[index].showLPN  = 'hide';
      }
    }
 
    this.parameterData[index].recptLines_LPN_Name = event.value;
    
  }

  resetLPNLov(index){
    
    this.parameterData[index].recptLines_LPN = '';
    this.parameterData[index].recptLines_New_LPN = '';
    this.parameterData[index].showLPN  = 'hide';
  }

  sourceLineChanged(event: any, data: any, index ){
     
    if (event.source.selected && data && event.isUserInput === true) {
      this.parameterData[index].recptLines_QTY =  
      this.parameterData[index].recptLines_QTY && this.parameterData[index].recptLines_QTY.length === 0 ?
      data.sourceItemQty : this.parameterData[index].recptLines_QTY ;
      this.parameterData[index].recptLines_item              =  data.sourceItemName;
      this.parameterData[index].recptLines_itemID            =  data.sourceItemId;
      this.parameterData[index].recptLines_itemRevision      =  data.sourceItemRevsnNum;
      this.parameterData[index].recptLines_itemRevisionID    =  data.sourceItemRevsnId;
      this.parameterData[index].batchControlled              =  data.batchCntrldFlag;
      this.parameterData[index].batchGenerate                =  data.batchGenerateFlag;
      this.parameterData[index].serialControlled             =  data.serialCntrldFlag;
    
      this.getLGLOV(event.source.value, this.sourceDocCode, index);
        
    }
    
  }

  get_sourceCodeList(){
    this.commonService.getLookupLOV('RECEIPT_SOURCE_CODE').subscribe((data: any) => {
      if (data.status === 200) {
        data = data.result;
        this.sourceCodeList = [];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
                this.sourceCodeList.push({
                    value   : data[i].lookupValue,
                    label   : data[i].lookupValueDesc
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  sourceCodeChanged(event: any, sourceCodeValue: any){
    // if (event.source.selected && event.isUserInput === true) {
    //   this.receiptService.getfromIULOV(sourceCodeValue).subscribe((data: any) => {
    //   if ( data && data.status === 200) {
    //     data = data.result;
    //     this.fromIUList = [];
    //     if(data.length){
    //         for(var i=0; i<data.length; i++){
    //             this.fromIUList.push({
    //                 value   : data[i].iuId,
    //                 label   : data[i].iuCode
                    
    //             })
    //         }
    //     }
    //   }else{
    //     this.openSnackBar(data.message, '','error-snackbar');
    //   }
      
    // },
    // (error: any) => {
    //   this.openSnackBar(error.error.message, '', 'error-snackbar');
    // })
    // }
  }


  
  getLGLOV(sourceLineId, sourceDoc, index){
    this.receiptService.getLGLOV(sourceLineId, sourceDoc ).subscribe((data: any) => {
      if (data.status === 200) {
        data = data.result;
        this.parameterData[index].recptLines_toLgList = [];
        if( data && data.length){
            for(let i=0; i<data.length; i++){
                this.parameterData[index].recptLines_toLgList.push({
                    value   : data[i].lgId,
                    label   : data[i].lgCode,
                    data    : data[i]
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  toLGChanged(event: any, toLgId: number, index, data){
    if (event.source.selected && event.isUserInput === true) {
      this.parameterData[index].isLocatorRequired = data.locRequired 
      this.receiptService.getToLocator(toLgId).subscribe((data: any) => {
      if (data.status === 200) {
        data = data.result;
        this.parameterData[index].recptLines_toLocatorList = [];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
                this.parameterData[index].recptLines_toLocatorList.push({
                    value   : data[i].locatorId,
                    label   : data[i].locCode,
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
    }
  }
  

  onSubmit() {
    if (this.receiptForm.valid) {
         
      if (this.isEdit) {
        if (this.receiptForm.value.userPassword === '') {
          this.receiptForm.value.userPassword = null;
        }
        const data = this.getReceiptLinesDataForEdit();
        if(data === 'validateError'){
          return
        }
        
        this.receiptService
          .updateReceipt(this.receiptId , data)
          .subscribe(
            data => {
              if (data.status === 200) {
               this.openSnackBar(data.message, '', 'success-snackbar');
                this.router.navigate(['receipts/']);
              } else {
                this.openSnackBar(data.message, '', 'error-snackbar');
                this.receiptForm.get('sourceDoc').disable();
                this.receiptForm.get('receiptIU').disable();
              }
            },
            error => {
              this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
          );
      } else {
        
        let data : any = this.getReceiptLinesDataForAdd();
              
        if(data == "validateError")
        return
        this.receiptService
          .createReceipt(data)
          .subscribe(
            data => {
              if (data.status === 200) {
                this.openSnackBar(data.message, '', 'success-snackbar');
                this.router.navigate(['receipts/']);
              } else {
                this.openSnackBar(data.message, '', 'error-snackbar');
                this.receiptForm.get('sourceDoc').disable();
                this.receiptForm.get('receiptIU').disable();
              }
            },
            error => {
              this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
          );
      }
    } else {
      this.openSnackBar("Please check mandatory fields", '', 'default-snackbar');
    }
  }

  getReceiptLinesDataForEdit(){
       
    let receiptLineObject = {};
    let receiptLineArray  = [];
   

    if(this.parameterData.length){
      let count = this.parameterData.length - this.receiptLinesNumber;
      for(let i=0; i<count; i++){
        if( (this.parameterData[i].batchQuantity && this.parameterData[i].recptLines_QTY) &&
          this.parameterData[i].recptLines_QTY !== this.parameterData[i].batchQuantity){
          this.openSnackBar("Receiptline "+ this.parameterData[i].recptLines_LineNum  +" quantity doesn't match with batchlines quantity  ","",'default-snackbar');
          return "validateError";
        }
 
        if( this.parameterData[i].recptLines_LineNum === '' ||
        this.parameterData[i].recptLines_QTY === '' ||
        this.parameterData[i].recptLines_itemID === '' ||
        this.parameterData[i].recptLines_sourceDoc === '' ||
        this.parameterData[i].recptLines_source === '' ||
        this.parameterData[i].recptLines_sourceLine === '' ||
        this.parameterData[i].recptLines_fromIU === '' ||
        this.parameterData[i].recptLines_LPN === '' ||
        this.parameterData[i].recptLines_toLG === '' ||
        this.parameterData[i].recptLines_uomCode === ''
       
        ){
          this.openSnackBar("Enter value in all required fields","",'default-snackbar');
          return "validateError";
        }

        if( this.parameterData[i].isLocatorRequired === 'Y' && this.parameterData[i].recptLines_toLocator === '' ){
          this.openSnackBar('Enter "To Locator" value for receipt line ' + this.parameterData[i].recptLines_LineNum ,'','default-snackbar');
          return 'validateError';
        }
                
        receiptLineObject['createdBy']                 = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
        receiptLineObject['rcptItemId']                = this.parameterData[i].recptLines_itemID;
        receiptLineObject['rcptItemRevision']          = this.parameterData[i].recptLines_itemRevision;
        receiptLineObject['rcptLineNum']               = this.parameterData[i].recptLines_LineNum;
        receiptLineObject['rcptQuantity']              = Number(this.parameterData[i].recptLines_QTY);
        receiptLineObject['rcptSourceDocCode']         = this.sourceDocCode;
        receiptLineObject['rcptSourceId']              = this.parameterData[i].recptLines_source;
        receiptLineObject['rcptSourceLineId']          = this.parameterData[i].recptLines_sourceLine;
        receiptLineObject['rcptFromIuId']              = this.parameterData[i].recptLines_fromIU;
        receiptLineObject['rcptToIuId']                = this.parameterData[i].recptLines_toIU;
        receiptLineObject['rcptToLgId']                = this.parameterData[i].recptLines_toLG;
        receiptLineObject['rcptToLocatorId']           = this.parameterData[i].recptLines_toLocator;
        receiptLineObject['rcptUomCode']               = this.parameterData[i].recptLines_uomCode;
        receiptLineObject['lpnId']                     = this.parameterData[i].recptLines_LPN;
        receiptLineObject['addReceiptLineBatches']     = this.parameterData[i].batchArray;
        receiptLineObject['addReceiptLineSerial']      = this.parameterData[i].serialArray;
      

               
        receiptLineArray.push(receiptLineObject)
        receiptLineObject = {};
   
      }
    }

    this.receiptForm.get('sourceDoc').enable();
    this.receiptForm.get('receiptIU').enable();
    let finalData : any = {
      "billOfLading": this.receiptForm.value.billOfLanding,
      "updatedBy": JSON.parse(localStorage.getItem('userDetails')).userId,
      "employeeId": JSON.parse(localStorage.getItem('userDetails')).userId,
      "grossWeight":  Number(this.receiptForm.value.gross),
      "intShipmentNum": this.receiptForm.value.intShipmentNo,
      "netWeight": Number(this.receiptForm.value.net),
      "iuId": this.receiptForm.value.receiptIU,
      "packingSlip": this.receiptForm.value.packingSlip,
      "tarWeight":  Number(this.receiptForm.value.tar),
      "tpId": this.receiptForm.value.tradingPartner,
      "tpSiteId": this.receiptForm.value.tradingPartnerSite,
      "wayAirBillNum": this.receiptForm.value.wayAirBillNo,
      "receiptSourceCode": this.receiptForm.value.sourceCode,
      "weightUomCode": this.receiptForm.value.uomCode,
      "receiptSourceType" : this.receiptForm.value.sourceDoc
    }
   
    finalData['addReceiptLines'] = receiptLineArray;
    return finalData;
   
  }

  getReceiptLinesDataForAdd(){
        
    let receiptLineObject = {};
    let receiptLineArray  = [];
    if(this.parameterData.length){
      for(let i=0; i<this.parameterData.length; i++){

        if( (this.parameterData[i].batchQuantity && this.parameterData[i].recptLines_QTY) &&
           this.parameterData[i].recptLines_QTY !== this.parameterData[i].batchQuantity){
          this.openSnackBar("Receiptline "+ this.parameterData[i].recptLines_LineNum  +" quantity doesn't match with batchlines quantity  ","",'default-snackbar');
          return "validateError";
        }
         
        if( this.parameterData[i].recptLines_LineNum === '' ||
        this.parameterData[i].recptLines_QTY === '' ||
        this.parameterData[i].recptLines_itemID === '' ||
        this.parameterData[i].recptLines_sourceDoc === '' ||
        this.parameterData[i].recptLines_source === '' ||
        this.parameterData[i].recptLines_sourceLine === '' ||
        this.parameterData[i].recptLines_fromIU === '' ||
        this.parameterData[i].recptLines_LPN === '' ||
        this.parameterData[i].recptLines_toLG === '' ||
        this.parameterData[i].recptLines_uomCode === ''
       
        ){
          this.openSnackBar("Enter value in all required fields","",'default-snackbar');
          return "validateError";
        }

        if( this.parameterData[i].isLocatorRequired === 'Y' && this.parameterData[i].recptLines_toLocator === '' ){
          this.openSnackBar('Enter "To Locator" Value for receipt line ' + this.parameterData[i].recptLines_LineNum ,'','default-snackbar');
          return 'validateError';
        }
                  
        receiptLineObject['createdBy']                 = Number(JSON.parse(localStorage.getItem('userDetails')).userId);
        receiptLineObject['rcptItemId']                = this.parameterData[i].recptLines_itemID;
        receiptLineObject['rcptItemRevision']          = this.parameterData[i].recptLines_itemRevision;
        receiptLineObject['rcptLineNum']               = this.parameterData[i].recptLines_LineNum;
        receiptLineObject['rcptQuantity']              = this.parameterData[i].recptLines_QTY;
        receiptLineObject['rcptSourceDocCode']         = this.sourceDocCode;
        receiptLineObject['rcptSourceId']              = this.parameterData[i].recptLines_source;
        receiptLineObject['rcptSourceLineId']          = this.parameterData[i].recptLines_sourceLine;
        receiptLineObject['rcptFromIuId']              = this.parameterData[i].recptLines_fromIU;
        receiptLineObject['rcptToIuId']                = this.parameterData[i].recptLines_toIU;
        receiptLineObject['rcptToLgId']                = this.parameterData[i].recptLines_toLG;
        receiptLineObject['rcptToLocatorId']           = this.parameterData[i].recptLines_toLocator;
        receiptLineObject['rcptUomCode']               = this.parameterData[i].recptLines_uomCode;
        receiptLineObject['lpnId']                     = this.parameterData[i].recptLines_LPN;
        receiptLineObject['addReceiptLineBatches']     = this.parameterData[i].batchArray;
        receiptLineObject['addReceiptLineSerial']      = this.parameterData[i].serialArray;
        
               
        receiptLineArray.push(receiptLineObject)
        receiptLineObject = {};
   
      }
    }

    this.receiptForm.get('sourceDoc').enable();
    this.receiptForm.get('receiptIU').enable();

    let finalData : any = {
      "billOfLading": this.receiptForm.value.billOfLanding,
      "createdBy": JSON.parse(localStorage.getItem('userDetails')).userId,
      "employeeId": JSON.parse(localStorage.getItem('userDetails')).userId,
      "grossWeight":  Number(this.receiptForm.value.gross),
      "intShipmentNum": this.receiptForm.value.intShipmentNo,
      "netWeight": Number(this.receiptForm.value.net),
      "iuId": this.receiptForm.value.receiptIU,
      "packingSlip": this.receiptForm.value.packingSlip,
      "tarWeight":  Number(this.receiptForm.value.tar),
      "tpId": this.receiptForm.value.tradingPartner,
      "tpSiteId": this.receiptForm.value.tradingPartnerSite,
      "wayAirBillNum": this.receiptForm.value.wayAirBillNo,
      "receiptSourceCode": this.receiptForm.value.sourceCode,
      "weightUomCode": this.receiptForm.value.uomCode,
      "receiptSourceType" : this.receiptForm.value.sourceDoc
    }
     
     
    finalData['addReceiptLines'] = receiptLineArray;
    return finalData;
    
  }

  gotoReceiptList(){
    this.router.navigate(['receipts/']);
  }

  renderEditReceiptLines(data){
    this.receiptLinesNumber = data ? data.length : 0;
    for(var i=0; i<data.length; i++){
      this.parameterData.push({
        recptLines_LineNum        : data[i].rcptLineNum,
        recptLines_QTY            : data[i].rcptQuantity,
        recptLines_item           : data[i].itemName,
        recptLines_itemID         : data[i].rcptItemId,
        recptLines_itemRevision   : data[i].rcptItemRevision,
        recptLines_itemRevisionID : '',
        recptLines_uomCode        : data[i].unitOfMeasure,
        recptLines_sourceDoc      : data[i].rcptSourceDocCode,
        recptLines_sourceValue    : data[i].sourceNum,
        recptLines_sourceLine     : data[i].sourceLineNum,
        recptLines_source         : data[i].rcptSourceId,
        recptLines_LPN            : data[i].lpnId,
        recptLines_LPN_Name       : data[i].lpnNum,
        recptLines_New_LPN        : '',
        recptLines_toLG           : data[i].toLgCode,
        recptLines_toLocator      : data[i].toLocCode,
        recptLines_fromIU         : data[i].rcptFromIuId,
        recptLines_toIU           : data[i].toIuCode,
        isLocatorRequired         : '',
        recptLines_sourceList     : [],
        recptLines_sourceLineList : [],
        recptLines_toLgList       : [],
        recptLines_toLocatorList  : [],
        action                    : '',
        editing                   : false,
        addNewRecord              : false
       
      });   
    }
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator; 
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
  }, 100);  
      
}

openDialog(type : any, index : number, element : any  ){
  if(element.recptLines_QTY === '' || Number(element.recptLines_QTY) === NaN){
    this.openSnackBar('Receiptline quantity is blank', '','default-snackbar');
    return;
  }
  const dialogData : any = { 
   'itemId'           : element.recptLines_itemID,
   'type'             : type,
   'iuId'             : element.recptLines_toIU, 
   'batchArray'       : this.parameterData[index].batchArray, 
   'index'            : index, 
   'isBatchGenerated' : element.batchGenerate,
   'quantity'         : element.recptLines_QTY,
   'serialArray'      : this.parameterData[index].serialArray,
   'serialMode'       : element.serialMode
  
  }
  const dialogRef = this.dialog.open(batchSerialDialogComponent, {
      width: dialogData.type === 'batch' ? '60vw' : '35vw',
      data: dialogData
  });

  dialogRef.afterClosed().subscribe(response => {
    if(response){
      this.parameterData[index].batchArray    = response.batchArray;
      this.parameterData[index].batchQuantity = response.quantity;
      this.parameterData[index].serialArray   = response.serialArray;
      this.parameterData[index].serialMode    = response.serialMode;
    }
   
  });
}



}




// Receipt Add Batch Component

export interface User {
  name: string;
  value?: number;
}

export interface ParameterDataElementBatch {
    batch_id         : string,
    batch_Name?      : string,
    batch_NEW_id     : string,
    batch_QTY        : string,
    batch_ExpDate    : Date,
    batch_OrgDate    : Date,
    filteredOptions? : any,
    showBatch?         : any,   
    action           : string,                  
    editing          : boolean,                 
    addNewRecord     : boolean     
  }

  export interface ParameterDataElementSerial {
    serial_id     : string,
    serial_Name?  : string,
    serial_NEW_id?: string,
    serial_QTY    : string,
    action        : string,  
    showSerial?   : string                
    editing       : boolean,                 
    addNewRecord  : boolean     
  }

  @Component({
    selector: 'app-batch-serial-dialog',
    templateUrl: './batch-serial-dialog.html',
    styleUrls: ['./add-receipt.component.css']
  })
  export class batchSerialDialogComponent {
    isEditable = false;
    isEdit = false;
    isAdd = false;
    listProgress = false;
    formTitle: string;
    isBatch : boolean;
    batchTableMessage = 'No Batch defined.';
    serialTableMessage = 'No Serial defined.';
    batchList : any = [];
    isBatchGenerated : any = '';
    focusedBatch : any = '';

    serialList : any = [];
    isSerialGenerated : any = '';
    focusedSerial : any = '';
    serialGenerationValue: string = 'Individual';
    serialGenerationOptions: string[] = ['Individual', 'Range'];
    mode : any = 'individual';
    fromSerial : any = '';
    toSerial : any = '';
    rangeQuantity : any = 0;
    individualQuantity : any = 0;  
    totalQuantity : any = 0;
   

    parameterDataBatch: ParameterDataElementBatch [] = [];
    parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
    parameterDisplayedColumnsBatch: string[] = [
        'batch_id',
        'batch_QTY',
        'batch_OrgDate',
        'batch_ExpDate',
        'action'         
    ];


    parameterDataSerial: ParameterDataElementSerial [] = [];
    parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
    parameterDisplayedColumnsSerial: string[] = [
        'serial_id',    
        'serial_QTY', 
        'action'          
    ];
 
 
  constructor(
      private receiptsService: ReceiptsService,
      private snackBar: MatSnackBar,
      private render: Renderer,
      public commonService: CommonService,
      private receiptService: ReceiptsService,
      public dialogRef: MatDialogRef<batchSerialDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.serialGenerationValue = 'Individual'
    this.totalQuantity = this.data.quantity;
    if(data.type === 'batch'){
      this.isBatch = true;
      this.formTitle = 'Add Batch';
      this.getBatchNumber();
      this.isBatchGenerated = this.data.isBatchGenerated;
      if(this.data.batchArray){
        this.populateBatchList();
      }
    }else{
      
      this.isBatch = false;
      this.formTitle = 'Add Serial';
      this.getSerialNumber();
      if( this.data.serialMode  === 'range'){
        this.fromSerial = this.data.serialArray[0].serialFrom;
        this.toSerial   = this.data.serialArray[0].serialTo;
        this.mode = 'range'
        this.serialGenerationValue = 'Range'
      }else{
        this.mode = 'individual';
        this.serialGenerationValue = 'Individual'
        if(this.data.serialArray){
          this.populateSerialList();
        }
      }
    }
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];

  ngOnInit() {
     
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  populateBatchList(){
    this.isAdd = true;
    this.isEdit = false;
    const data = this.data.batchArray;
     
    for(let i=0; i<data.length; i++){
      this.parameterDataBatch.push({
          batch_id        : '',
          batch_QTY       : data[i].batchQuantity,
          batch_Name      : data[i].batchNumber,
          batch_NEW_id    :  data[i].batchNumber,
          batch_ExpDate   : data[i].batchExpirationDate,
          batch_OrgDate   : data[i].batchOriginationDate,
          showBatch       : 'show',
          action          : '',
          editing         : true,
          addNewRecord    : true
      });   
    }
    this.parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
 
  }

  getBatchNumber(){
    
    this.receiptService.getBatchLOV(this.data.itemId).subscribe((data: any) => {
      if (data.status === 200) {
        
        data = data.result;
        this.batchList = [{ label: ' Please Select', value: '' },{ label: 'New', value: 'newValue' }];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
              
                this.batchList.push({
                    value   : data[i].batchId,
                    label   : data[i].batchNumber
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  
  }

  focusOut(event: any, index){
     if(index === undefined){
       return;
     } 
    const value = this.parameterDataBatch[index].batch_NEW_id
    if(value.trim() === ''){
      this.openSnackBar('PLease enter the batch ID', '','default-snackbar');
      this.parameterDataBatch[index].batch_NEW_id = '';
      this.parameterDataBatch[index].batch_Name = '';
      return;
    } 
    for (const pData of this.batchList) {
      if (pData.label === value) {
          this.openSnackBar('This batch already exist.', '','default-snackbar');
          this.parameterDataBatch[index].batch_NEW_id = '';
          this.parameterDataBatch[index].batch_Name = '';
          return;
      }
    }

    let count = 0
    for (const pData of this.parameterDataBatch) {
      
      if (pData.batch_NEW_id === value ) {
         count++;
         if(count === 2){
           this.openSnackBar('This batch already exist.', '','default-snackbar');
           this.parameterDataBatch[index].batch_NEW_id = '';
           this.parameterDataBatch[index].batch_Name = '';
           return;
         }
      }
    }

    this.parameterDataBatch[index].batch_Name =  this.parameterDataBatch[index].batch_NEW_id;
    
  }

  generateBatchID(){
   if(this.focusedBatch !== ''){
     this.receiptService.generateBatchID(this.data.itemId).subscribe((data: any) => {
        if (data.status === 200) {
          this.parameterDataBatch[this.focusedBatch].batch_NEW_id = data.latestNumber;
          this.parameterDataBatch[this.focusedBatch].batch_Name   = data.latestNumber;
        }else{
          this.openSnackBar(data.message, '','error-snackbar');
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
   }
  
  }

  onbatchFocusIn(event: any, index){
    this.focusedBatch = index
  }

  batchChanged(event: any, value: any, index){
    if ( event.isUserInput === true) {
      if(value === 'newValue'){
        this.parameterDataBatch[index].showBatch  = 'show';
      }else{
        this.parameterDataBatch[index].showBatch  = 'hide';
      }
      this.parameterDataBatch[index].batch_Name = event.source.viewValue;
    }
  
    
    
  }

  resetbatchLov(index){
    
    this.parameterDataBatch[index].batch_id = '';
    this.parameterDataBatch[index].batch_NEW_id = '';
    this.parameterDataBatch[index].showBatch  = 'hide';
  }

  beginEdit(rowData: any, $event: any) {
    
    for (const pData of this.parameterDataBatch) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','default-snackbar');
            return;
        }
    }
    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEdit = true;
      this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
        rowData.editing = false;
        this.isEdit = false;
        this.render.setElementClass($event.target, 'editIconEnable', false);
    }
  }

  deleteRow(rowData: any, rowIndex: number) {
      this.parameterDataBatch.splice(rowIndex, 1);
      this.parameterDataSourceBatch = new MatTableDataSource<
          ParameterDataElementBatch
      >(this.parameterDataBatch);
      this.parameterDataSourceBatch.paginator = this.paginator;
      setTimeout(() => {
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
    }, 100);
      this.checkIsAddRowBatch();
  }

  checkIsAddRowBatch() {
      let cnt = 0;
      const pLength = this.parameterDataBatch.length;
      for (const pdata of this.parameterDataBatch) {
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

  addRow() {
        
      for (const pData of this.parameterDataBatch) {
          if (pData.editing === true && pData.addNewRecord === false) {
              this.openSnackBar('Please update your records first.', '','default-snackbar');
              return;
          }
      }
      this.isAdd = true;
      this.isEdit = false;
        

      this.parameterDataBatch.unshift({
          batch_id        : '',
          batch_QTY       : '',
          batch_Name      : '',
          batch_NEW_id    : '',
          batch_ExpDate   : new Date,
          batch_OrgDate   : new Date,
          showBatch         : 'hide',
          action          : '',
          editing         : true,
          addNewRecord    : true
      });

      this.parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
      this.parameterDataSourceBatch.paginator = this.paginator;
  }

  unique(array) {
      let unique_arr = [];
      let temp = 0;
      array.forEach(function(i, e) {
          if (unique_arr.indexOf(i)===-1){
            unique_arr.push(i)
          }else{
            temp = 1;
          } 
      });
      return (temp === 1 ) ?  false :  true;
  }

  onBatchSubmit(){
    let batchNameArray = []
    for (const pData of this.parameterDataBatch) {
      if( !pData.batch_QTY || pData.batch_QTY === '' || Number(pData.batch_QTY) === 0 )
      {
        Number(pData.batch_QTY) === 0 ?  this.openSnackBar('Batch quantity should be greater than zero.', '','default-snackbar') :
        this.openSnackBar('Please enter the batch quantity.', '','default-snackbar');
        return;
      }
      if (pData.batch_Name && (pData.batch_Name.trim() === '' || pData.batch_Name === undefined )) {
          this.openSnackBar('PLease enter the batch.', '','default-snackbar');
          return;
      }
      batchNameArray.push(pData.batch_Name);
    }

    if(!this.unique(batchNameArray)){
      this.openSnackBar('Batch numbers are duplicate', '','default-snackbar');
      return;
    }


    let totalQuantity = 0;
    for (const pData of this.parameterDataBatch) {
      totalQuantity = totalQuantity + Number(pData.batch_QTY)
    }
    if(totalQuantity !== this.data.quantity){
      this.openSnackBar('Sum of batch quantities are not equal to receiptline quantity '+ this.data.quantity +'', '','default-snackbar');
      return;
    }
     
    
    let tempObj   = {};
    let tempArray = [];
    if(this.parameterDataBatch.length){
      for (const pData of this.parameterDataBatch) {
        if( pData.batch_Name === ' Please Select' || pData.batch_Name === 'New' || pData.batch_Name === ''){
          this.openSnackBar('Please enter batch id of all lines', '','default-snackbar');
          return
        }
        tempObj['batchItemId']          = Number(this.data.itemId);
        tempObj['batchIuId']            = Number(this.data.iuId);
        tempObj['batchNumber']          = pData.batch_NEW_id ? pData.batch_NEW_id : pData.batch_Name;
        tempObj['batchExpirationDate']  = this.receiptsService.dateFormat( pData.batch_ExpDate );
        tempObj['batchOriginationDate'] = this.receiptsService.dateFormat( pData.batch_OrgDate );
        tempObj['batchQuantity']        = Number(pData.batch_QTY);
                
        tempArray.push(tempObj);
        tempObj = {}
      }
    }
    
    this.data.batchArray  = tempArray;
    this.data.serialArray = [];
    this.dialogRef.close(this.data)
  }

  openSnackBar(message: string, action: string, typeClass:string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }



  // Functions for serial ----------------------------------
  getSerialNumber(){
    
    this.receiptService.getSerialLOV(this.data.itemId, this.data.iuId ).subscribe((data: any) => {
      if (data.status === 200) {
        
        data = data.result;
        this.serialList = [
          { label: ' Please Select', value: '' },
          { label: 'New', value: 'newValue' }];
        if( data && data.length){
            for(var i=0; i<data.length; i++){
              
                this.serialList.push({
                    value   : data[i].serialId,
                    label   : data[i].serialNumber
                })
            }
        }
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }
      
    },
    (error: any) => {
      this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  
  }

  beginEditSerial(rowData: any, $event: any) {
    
    for (const pData of this.parameterDataSerial) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','default-snackbar');
            return;
        }
    }
    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEdit = true;
      this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
        rowData.editing = false;
        this.isEdit = false;
        this.render.setElementClass($event.target, 'editIconEnable', false);
    }
  }

  deleteRowSerial(rowData: any, rowIndex: number) {
      this.parameterDataSerial.splice(rowIndex, 1);
      this.parameterDataSourceSerial = new MatTableDataSource<
          ParameterDataElementSerial
      >(this.parameterDataSerial);
      this.parameterDataSourceSerial.paginator = this.paginator;
      this.checkIsAddRowSerial();
      this.individualQuantity = this.parameterDataSerial.length;
  }

  checkIsAddRowSerial() {
      let cnt = 0;
      const pLength = this.parameterDataSerial.length;
      for (const pdata of this.parameterDataSerial) {
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

  addRowSerial() {
     
    
      for (const pData of this.parameterDataSerial) {
          if (pData.editing === true && pData.addNewRecord === false) {
              this.openSnackBar('Please update your records first.', '','default-snackbar');
              return;
          }
      }
      this.isAdd = true;
      this.isEdit = false;
        

      this.parameterDataSerial.unshift({
          serial_id       : '',
          serial_QTY      : '1',
          showSerial      : 'hide',
          action          : '',
          editing         : true,
          addNewRecord    : true
      });

      this.parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
      this.parameterDataSourceSerial.paginator = this.paginator;
      this.individualQuantity = this.parameterDataSerial.length;
  }

  serialFocusOut(event: any, index){
    if(index === undefined){
      return;
    } 
   const value = this.parameterDataSerial[index].serial_NEW_id
   if(value.trim() === ''){
     this.openSnackBar('PLease enter the serial id', '','default-snackbar');
     this.parameterDataSerial[index].serial_NEW_id = '';
     this.parameterDataSerial[index].serial_Name = '';
     return;
   } 
   for (const pData of this.serialList) {
     if (pData.label === value) {
         this.openSnackBar('This serial already exist.', '','default-snackbar');
         this.parameterDataSerial[index].serial_NEW_id = '';
         this.parameterDataSerial[index].serial_Name = '';
         return;
     }
   }

   let count = 0
   for (const pData of this.parameterDataSerial) {
     
     if (pData.serial_NEW_id === value ) {
        count++;
        if(count === 2){
          this.openSnackBar('This serial already exist.', '','default-snackbar');
          this.parameterDataSerial[index].serial_NEW_id = '';
          this.parameterDataSerial[index].serial_Name = '';
          return;
        }
     }
   }

   this.parameterDataSerial[index].serial_Name =  this.parameterDataSerial[index].serial_NEW_id;
   
 }

 generateSerialID(){
    this.individualQuantity === '' ? 0 : this.individualQuantity;
    this.rangeQuantity === '' ? 0 : this.rangeQuantity;
    let quantity = this.totalQuantity - this.individualQuantity;
    if( this.rangeQuantity > quantity){
      this.openSnackBar('Sum of individual and range quantity exceeds receipt line quantity', '','default-snackbar');
      return;
    }
    if( this.rangeQuantity === 0){
      this.openSnackBar('Please enter the quantity greater than zero', '','default-snackbar');
      return;
    }
  
    this.receiptService.generateSerialID(this.data.itemId, this.rangeQuantity).subscribe((data: any) => {
       if (data.status === 200) {
         
        this.fromSerial  = data.latestNumberFrom;
        this.toSerial    = data.latestNumberTo;
       }else{
         this.openSnackBar(data.message, '','error-snackbar');
       }
     },
     (error: any) => {
       this.openSnackBar(error.error.message, '', 'error-snackbar');
     })
  
 
 }

 onSerialFocusIn(event: any, index){
   this.focusedSerial = index
 }

 serialChanged(event: any, value: any, index){
   if ( event.isUserInput === true) {
     if(value === 'newValue'){
       this.parameterDataSerial[index].showSerial  = 'show';
     }else{
       this.parameterDataSerial[index].showSerial  = 'hide';
     }
     this.parameterDataSerial[index].serial_Name = event.source.viewValue;
   }
 
   
   
 }

 resetSerialLov(index){
   
   this.parameterDataSerial[index].serial_id = '';
   this.parameterDataSerial[index].serial_NEW_id = '';
   this.parameterDataSerial[index].showSerial  = 'hide';
 }

 onSerialSubmit(){
    this.individualQuantity === '' ? 0 : this.individualQuantity;
    this.rangeQuantity === '' ? 0 : this.rangeQuantity;
    let quantity = this.totalQuantity - this.rangeQuantity;
    if( this.individualQuantity > quantity){
      this.openSnackBar('Sum of individual and range quantity exceeds receipt line quantity', '','default-snackbar');
      return;
    }

    if( this.totalQuantity !== ( this.rangeQuantity + this.individualQuantity ) ){
    this.openSnackBar('Receiptline quantity is not equal to serial quantity', '','default-snackbar');
    return;
    }
  
   this.submitIndividualSerial();


 }

 submitIndividualSerial(){
  let serialNameArray = []
  for (const pData of this.parameterDataSerial) {
    if (pData.serial_Name && (pData.serial_Name.trim() === '' || pData.serial_Name === undefined )) {
        this.openSnackBar('PLease enter the serial.', '','default-snackbar');
        return;
    }
    serialNameArray.push(pData.serial_Name);
  }

  if(!this.unique(serialNameArray)){
    this.openSnackBar('Serial numbers are duplicate', '','default-snackbar');
    return;
  }

  let tempObj   = {};
  let tempArray = [];
  if(this.parameterDataSerial.length){
    for (const pData of this.parameterDataSerial) {
      if( pData.serial_NEW_id === ' Please Select' || pData.serial_Name === 'New' || pData.serial_Name === '' || pData.serial_Name === ' Please Select'){
        this.openSnackBar('Please enter serial id of all lines', '','default-snackbar');
        return
      }
      tempObj['serialGenerateFlag']  = 'N'
      tempObj['serialNumber']        = pData.serial_NEW_id ? pData.serial_NEW_id : pData.serial_Name;
      tempObj['serialFrom']          = '';
      tempObj['serialTo']            = '';
      
              
      tempArray.push(tempObj);
      tempObj = {}
    }
  }
  
  this.data.serialArray = tempArray;
  this.data.batchArray  = [];
  this.submitRangeSerial();
  //this.data.serialMode = this.mode;
  //this.dialogRef.close(this.data)
 }

 submitRangeSerial(){
    if(this.fromSerial){
      let tempObj   = {};
      tempObj['serialGenerateFlag']  = 'Y'
      tempObj['serialNumber']        = ''
      tempObj['serialFrom']          = this.fromSerial;
      tempObj['serialTo']            = this.toSerial;
      this.data.serialArray.push(tempObj);
     
    }

    this.dialogRef.close(this.data);
   
 }

 radioChange(event: any){
    if( event && event.value){
      this.mode = event.value === 'Range' ? 'range' : 'individual';
    }
 }

 populateSerialList(){
  this.isAdd = true;
  this.isEdit = false;
  const data = this.data.serialArray;
   
  for(let i=0; i<data.length; i++){
    this.parameterDataSerial.push({
        serial_id       : data[i].serialNumber,
        serial_NEW_id   : data[i].serialNumber,
        serial_Name     : data[i].serialNumber,
        serial_QTY      : '1',
        showSerial      : 'show',
        action          : '',
        editing         : true,
        addNewRecord    : true
    });   
  }
  this.parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);

}


}
