import {
  Component, OnInit, ViewChild, EventEmitter, TemplateRef,
  Output, Renderer, OnDestroy, HostListener, AfterViewInit, Optional, Inject
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { PutawayPolicyService } from 'src/app/_services/warehouse/putaway-policy.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';
import { WorkOrderIssueService } from 'src/app/_services/manufacturing/work-order-issue.service';
import { dataLoader, NUMBER } from '@amcharts/amcharts4/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { TransactionInquiriesService } from 'src/app/_services/transactions/transaction-inquiries.service';

export interface ParameterDataElementSerial {
  No: string;
  serialNo: string;
}

export interface ParameterDataElementBatch {
  No: string;
  batchNo: string;
  qty: any;
  serialList: any;
}

export interface ParameterDataElement1 {
  sourceLpnId?: any;
  alctnAllocatedQty?: any,
  woLineStatusDescription: string,
  isAssemblyItem?: boolean;
  isAssemblyItemTransact?: boolean;
  lpnDetails?: any[];
  woUom?: any;
  itemName: string,

  destLgCode?: string,
  destLocCode?: string,
  destinationLgId?: number,
  destinationLocatorId: number,

  sourceLgCode?: string,
  sourceLocatorCode: string,
  sourceLocatorId?: number,
  sourceLg: number,

  itemDescription?: any;
  woCmpItemRevisionId?: any;
  lpnDetailsSelected: string;
  LPNDetails?: any;
  serialList?: any[];
  batchList?: any[];
  lpnId?: number,
  lpnNum?: string,
  batchId?: number
  batchNumber?: string,
  lpnList?: any[];
  availableQty?: any;
  allocatedQty?: any;
  batchEnabled?: any;
  serialEnabled?: any;
  woLineStatus?: any;
  stockLocatorList?: any[];
  locCode?: string;
  locatorGroupList?: any[];
  locIuId?: any;
  woLineId: string;
  woLineIuId: string;
  woLineNumber: string;
  perAssmebly: any;


  woLinePriority?: string;
  woCmpItemId: any;
  woCmpItemName: string;
  woCmpUom?: string;
  woCmpQty?: string;
  woIssuedQty?: any;
  openQty?: any;
  onhandQty?: any;
  woCmpConsumedQty?: string;


  sourceLocId?: any;

  destinationLocId?: any;
  destLocatorCode?: string;
  destinationLgCode?: string;

  dropLpnId?: any;
  createdBy?: number;
  creationDate?: string;
  updatedBy?: number;
  updatedDate?: string;
  action?: string;
  editing?: boolean;
  addNewRecord?: boolean;
  operatorLov?: any;
  dataType?: any;
  showHint?: boolean;
  isRoutingValue?: any;
  originalData?: any;
  rowSelect?: boolean;
  referenceWoLineId?: number;
  referenceWoId?: number;
  woAssmItemId?: number;
}
export interface ParameterDataElementBatch {
  sno: string;
  item: string;
  onhandBatchId: any;
  batchNumber: any;
  lgCode: any;
  include: any;

}
export interface ParameterDataElementLBS {
  tLpnNum? :any;
  lgLpnControlledFlag?: any;
  batchMFGDate?: any;
  batchEXPDate?: any;
  txnId?: number,
  serialCount?:number,
  batchCount?:number,
  serialNumSelectedListGG?: any[];
  serialNumberG?: string;
  serialNumSelectedListG?: any[];
  lpnval?: any;
  batchval?: any;
  serialval?: any;
  locSearchValue?: string;
  inlineLocSearchLoader?: string;
  showLocLov?: string;
  lpnSearchValue?: string;
  inlineLpnSearchLoader?: string;
  showLpnLov?: string;
  batSearchValue?: string;
  inlineBatSearchLoader?: string;
  showBatLov?: string;
  serSearchValue?: string;
  inlineSerSearchLoader?: string;
  showSerLov?: string;
  lbsid?: any,
  lpnId?: string;
  lpnNum?: string;
  batchId?: any;
  batchNumber?: any;
  serialId?: any;
  serialNumber?: any;
  iuId?: any;
  itemId?: any;
  itemName?: string;
  itemRevId?: any;
  lgId?: any;
  lgCode: any;
  locId?: any;
  locCode?: any;
  lgList?: any[],
  locList?: any[],
  woLineStatus?: string,
  locReservedQty?: any,
  locUnresQty?: any,
  componentLineQty?: any,
  addNewRecord?: boolean;
  editing?: boolean;
  action?: string;
  lpnList?: any[],
  batchList?: any[],
  serialList?: any[],
  originalData?: any,
  processFlag?: any,
  lpnSelectedList?: any[],
  lpnNumSelectedList?: any[],
  batchSelectedList?: any[],
  batchNumSelectedList?: any[],
  serialSelectedList?: any[],
  serialNumSelectedList?: any[],
  isBatchEnabled?: boolean,
  isSerialEnabled?: boolean,
}
@Component({
  selector: 'app-crate-wo-issue',
  templateUrl: './crate-wo-issue.component.html',
  styleUrls: ['./crate-wo-issue.component.css']
})
export class CrateWoIssueComponent implements OnInit, OnDestroy {

  isEditable = false;
  isEdit = false;
  isAdd = false;
  listProgress = false;
  showSelectAll = false;
  isDestinationSelected = false;
  saveInprogress = false;
  lgLable = 'LG';
  locLable = 'Locator';
  lpnLabel = 'LPN #';
  minDate = new Date();
  listProgressBatch = false;
  parameterData1: ParameterDataElement1[] = [];

  allLocatorGroupList: any[];
  locatorGroupList: any[];
  parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
  workOrderRefreshOnTransact: boolean = false;
  // lpnDataFC = new FormControl();
  batchFC = new FormControl();
  serialFC = new FormControl();
  parameterDataSerial: ParameterDataElementSerial[] = [];
  parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
  parameterDisplayedColumnsSerial: string[] = [
    'No',
    'serialNumber'
  ];

  parameterDataBatch: ParameterDataElementBatch[] = [];
  parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
  parameterDisplayedColumnsBatch: string[] = [
    'No',
    'batchNumber',
    'batchMfgDate',
    'batchExpDate',
    'txnBatchQuantity',
    'serialList'
  ];
  parameterDisplayedColumns1: string[] = [
    // 'rowSelect',
    'componentItemId',
    'itemType',
    'woLineStatus',
    'perAssembly',
    'requireQty',
    'issueQty',
    'openQty',
    //'onhandQty',
    // 'qty',  
    // 'lg',
    // 'stockLocator',
    'action'

  ];

  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  messageDialogRef2: MatDialogRef<MessageDialogComponent>;
  parameterDisplayedColumnsCLassItems: string[] = ['sno', 'Number', 'include'];
   

  parameterDisplayedColumnsLBSItems: string[] = ['sno', 'lpnLG', 'lpnLOC', 'reservedQty','unresQty', 'LPN','TLPN', 'Batch', 'Serial', 'lineQty', 'action'];
  parameterDisplayedColumnsForDekitComponents: string[] = ['sno', 'lpnLG', 'lpnLOC', 	'LPN','TLPN','Batch', 'Serial', 'lineQty', 'action'];
  parameterDataLBS: ParameterDataElementLBS[] = [];
  parameterDataSourceLBS = new MatTableDataSource<ParameterDataElementLBS>(this.parameterDataLBS);


  routingTableMessage = '';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild('myBatchDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  @ViewChild('myBatchDialogDekit', { static: true }) confirmationDialogDekit: TemplateRef<any>;
  @ViewChild('messageDialog', { static: true }) messageDialog: TemplateRef<any>;
  @ViewChild('messageDialog2', { static: true }) messageDialog2: TemplateRef<any>;
  @ViewChild('myBSDialog', { static: true }) myBSDialog: TemplateRef<any>;
  @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
  @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  iuId = '';
  iuLov = [{ label: ' Please Select', value: '' }];
  logicLov: any = [{ label: ' Please Select', value: '' }];
  logicLovOrig: any = [];
  operatorLov: any = [{ label: ' Please Select', value: '' }];
  operatorLovOrig: any = [];
  routingValueLov: any = [{ label: ' Please Select', value: '' }];
  routingGoToLov: any = [{ label: ' Please Select', value: '' }];
  selectedRoutingLogicValue = [];
  isNumeric = false;
  screenMaxHeight: any;   
  selectedRowIndex = null;
  itemList: any[] = [];
  List: any[] = [];
  woAssemblyItemId: any = null;
  woAssemblyItemname: any = '';
  woQty: any = '';
  woId: any;
  woNumber: any;
  woList: {
    woNumber: string; woId: any; itemName: string; itemId: any; woAssemblyItemRevId:number,woReqQty: any;
    workOrderType: string, completionQty: any, avlTocompleteQty: any,
    destLgCode: string, destLocCode: string, destLgId: number, destLocId: number, dropLpnId: number
    sourceLgId: number, sourceLocatorId: number, woStatus: string
    assmBatchEnabled: string,
    assmSerialEnabled: string,
    woIsManual: string,
  }[];
  
  showCompleteBtn: boolean = false;
  workOrderType: any;
  woCurrentIndex: any;
  completionQty: number;
  avlTocompleteQty: any;
  destLocCode: any;
  destLgCode: any;
  completeSuccess: boolean = false;
  currentLineIndex: any;
  currentLpnList: any;
  isADDLBS: boolean;
  isEditLBS: boolean;
  currentItemName: any;
  currentLG: any;
  currentLOC: any;
  lpnSelected: boolean;
  batchEnabled: boolean = false;
  serialEnabled: boolean = false;
  currentBatchList: any[];
  currentSerialList: any[];
  currentCmpQty: number;
  currentlpnobj: any;
  currentBatchObj: any;
  currentSerialObj: any;
  lpnNumArr: any[];
  batchNumArr: any[];
  serialNumArr: any[];
  currentRequiredQty: number;
  currentPerAssemblyQty: number;
  currentItemDescription: any;
  selectedLPNRowIndex: any;
  lpnList: any[] = [];
  batchList: any = [];
  serialList: any = [];
  finalLg: string = '';
  finalLoc: string = '';
  totalQty: number = 0;
  currentWOLineId: string;
  currentRequiredQty1: number;
  isManual: boolean = false;

  inlineWOSearchLoader: string = 'hide';
  showWOLov: string = 'hide';
  WOSearchValue: string = '';
  destinationLgId: any = null;
  destinationLocatorId: any = null;
  stagingLocactorList: { value: number; label: string; lgId: null }[];
  inlineDlocSearchLoader: string = 'hide';
  showDlocLov: string = 'hide';
  searchDlocValue: string = '';
  screenType: string = '';
  destinationLgList: any[];
  dropLpnId: any;
  sourceLgList: any[];
  sourceLocactorList: any[];
  // sourceLocatorId: any;
  sourceLocId: any = null;
  sourceLgId: any = null;
  isAssemblyItem: boolean = false;
  destinatinAssItemLocactorList: any[];
  sourceLocCode: any;
  sourceLgCode: any;
  destLocatorCode: any;
  destinationLgCode: any;
  onhandQty: any;
  issourceLgCode: boolean = true;
  issourceLocCode: boolean = true;
  dropLpnIdFound: string = 'N';
  assmBatchEnabled: any;
  assmSerialEnabled: any;
  newBatchNumber: any;
  newBatchQty: any;
  batchMFGDate: any;
  batchEXPDate: any;
  batchNumberPlaceholder: string;
  dialogType: string;
  dialogMessage: any;
  message2: any;
  message3: any;
  lpnMessage: string;
  isDestinationFound: string;
  woStatus: any;
  isSoruceFound: string = 'N';
  destinatinAssItemLGList: any[];
  destinaionLocCode: any;
  lpnObj = { lpnId: null, lpnNum: '' };
  issuedNoOfComponents: number = 0;
  dialogType2: string;
  message22: any;
  message33: any;
  cmpdropLpnId: any;
  currentIssuedQty: any;
  currentOpenQty: any;
  listProgressHeader = false;
  assemblyItemIndex: number = 0;
  batchSerialDialogProcess: any = false;
  listProgressPopup: boolean;   
  isBatch: boolean;   
  serialTableMessage: any;
  isBackBtnEnable: boolean;
  batchTableMessage: any;
  isAsseblyItemManual: boolean = false;
  existedBatchList: any[];
  showBatchLov: boolean;
  batchTitle: string;
  dialogRefBatchLov: any;
  selectedBatch: any;
  newBatchId: any;
  woAssemblyItemRevId: any;
  dialogRefBatchLovForDekit: any;
  dialogRefBatchForDekit: any;
  currentLBSIndex: any;
  secondlpnLabel: string;
  woIsManual: any;
  lgLpnControlledFlag: any;
  constructor(
    private render: Renderer,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public woService: WorkOrderService,
    public woIssueService: WorkOrderIssueService,
    public router: Router,
    public putawayPolicyService: PutawayPolicyService,
    public dialog: MatDialog,
    private transactionService: TransactionInquiriesService,

  ) { }


  ngOnInit() {
    this.defaultIUSelectionChange(this.iuId)
    this.woService.defaultIuDataObservable.subscribe((data: any) => { 
      this.defaultIUSelectionChange(data);
    });
    this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
    this.workOrderType = 'ISSUE';
    this.screenType = 'ASM';
    // this.workOrderType = 'RETURN';
    // this.screenType = 'DIS';
    this.destinationLgList = [];
    this.stagingLocactorList = [];
    this.iuChanged({ source: { selected: true, isUserInput: true } }, this.iuId);
    this.getScreenSize();
    setTimeout(() => {
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    }, 100);
  }
  defaultIUSelectionChange(iuId) {
    this.iuId = iuId;
    this.iuChanged({ source: { selected: true, isUserInput: true } }, this.iuId);
  }
  checkForCompletion(message?: string) { 
    this.showCompleteBtn = false;
    let availableLines = 0;
    let partial_availableLines = 0;
    //this.calculateAvailableToComplete();
    for (const [index, pData] of this.parameterData1.entries()) {
      this.selectedRowIndex = null;
      if (pData.woLineStatus === 'COMPLETED' || pData.woLineStatus === 'PARTIAL_COMPLETED') {        
        availableLines++;
        if (this.screenType === 'DIS' && !pData.isAssemblyItem) {
          this.dropLpnId = pData.sourceLpnId;
        } else if (this.screenType === 'ASM' || pData.isAssemblyItem) {
          this.dropLpnId = pData.dropLpnId;
        }
      }
      if (pData.woLineStatus === 'PARTIAL_COMPLETED') {
        partial_availableLines++;
      }
       
    }
    if (availableLines === this.parameterData1.length && this.avlTocompleteQty > 0 && (this.woQty !== this.completionQty)) {
      if (this.screenType === 'ASM' || this.isAssemblyItem) {
        this.showCompleteBtn = true;
      }
    }
    if (message !== "") {
      this.message2 = "";
      this.message3 = "";
      this.lpnMessage = "";
      let messageArr = message.split(',');
      message = messageArr[0];
      this.lpnMessage = messageArr[1];
      if (messageArr.length > 2) {
        this.message2 = messageArr[2];
        this.message3 = messageArr[3];
      } else if (messageArr.length > 1) {
        this.message2 = messageArr[2];
      }
      this.openDialog('Success', message, 'hi');
      this.parameterData1 = [];
      if(partial_availableLines !== 0 && this.screenType === 'ASM') {
        this.workOrderRefreshOnTransact = true;
        this.getWOList(this.iuId, this.woNumber,'DIS');
      } else if(this.screenType === 'ASM') {
        this.workOrderRefreshOnTransact = true;
        this.getWOList(this.iuId, "");
      }else if(this.screenType === 'DIS') {
        this.workOrderRefreshOnTransact = true;
        this.getWOList(this.iuId, this.woNumber,'DIS');
      }
    }
  }
  onExistedBatchSelect(event,ele){
    if (event && event.source.selected === true && (event.isUserInput === true)){     
       
    this.batchMFGDate = ele.batchOriginationDate;
    this.newBatchQty = this.avlTocompleteQty;
    this.batchEXPDate = ele.batchExpirationDate;
    this.newBatchNumber = ele.batchNumber;
    this.newBatchId = ele.onhandBatchId;
    }else if(ele){
      this.batchMFGDate = ele.batchOriginationDate;
      this.newBatchQty = this.avlTocompleteQty;
      this.batchEXPDate = ele.batchExpirationDate;
      this.newBatchNumber = ele.batchNumber;
      this.newBatchId = ele.onhandBatchId;
    }
  }
  onExistedBatchSelect2(event,ele){
    if (event && event.source.selected === true && (event.isUserInput === true)){     
    
    this.batchMFGDate = ele.batchOriginationDate;
    this.newBatchQty = this.parameterDataLBS[this.currentLBSIndex].componentLineQty;
    this.batchEXPDate = ele.batchExpirationDate;
    this.newBatchNumber = ele.batchNumber;
    this.newBatchId = ele.onhandBatchId;
    }else if(ele){
      this.batchMFGDate = ele.batchOriginationDate;
      this.newBatchQty = this.parameterDataLBS[this.currentLBSIndex].componentLineQty;
      this.batchEXPDate = ele.batchExpirationDate;
      this.newBatchNumber = ele.batchNumber;
      this.newBatchId = ele.onhandBatchId;
    }
  }
  showDailogForBatchDetailsDekit(index,from?) {
    this.batchTitle ="Enter Batch Details";
      this.dialogRefBatchLovForDekit = null;
      this.dialogRefBatchForDekit = null;
      let lbsObj = this.parameterDataLBS[index];
      this.currentLBSIndex = index;
      this.batchMFGDate = "";
      this.newBatchQty = lbsObj.componentLineQty;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
    if(from){
      this.selectedBatch = null;
      
      let obj = {
       // "itemId": lbsObj.itemId, "itemRevId": lbsObj.itemRevId, "iuId": lbsObj.iuId,"lgId": this.destinationLgId, "locId": this.destinationLocatorId
        "itemId": lbsObj.itemId, "itemRevId": lbsObj.itemRevId, "iuId": lbsObj.iuId,"lgId": null, "locId": null
      };
      this.getExistedBatchList(obj,'dekit');
      this.showBatchLov = true;
      this.batchTitle ="Select Batch Details";
      this.dialogRefBatchLovForDekit = this.dialog.open(this.confirmationDialogDekit, {
        width: '400px',
        disableClose: true,
      });
      this.dialogRefBatchLovForDekit.afterClosed().subscribe(result => {
        this.parameterDataLBS[this.currentLBSIndex].batchNumber= this.newBatchNumber;  
        this.parameterDataLBS[this.currentLBSIndex].batchId= this.newBatchId;  
        this.parameterDataLBS[this.currentLBSIndex].batchEXPDate= this.commonService.dateFormat(this.batchEXPDate);  
        this.parameterDataLBS[this.currentLBSIndex].batchMFGDate= this.commonService.dateFormat(this.batchMFGDate); 
         this.batchTitle ="Enter Batch Details";
         this.showBatchLov = false;
         this.batchMFGDate = this.minDate;
         this.newBatchQty = lbsObj.componentLineQty;
         this.batchEXPDate = '';         
         this.newBatchNumber = '';
         this.newBatchId = null;
        
      });
       
    }else{
      this.showBatchLov = false;
      this.batchMFGDate = this.minDate;    
      this.batchNumberPlaceholder = "Press Enter to Generate a new Batch";    
      this.dialogRefBatchForDekit = this.dialog.open(this.confirmationDialogDekit, {
        width: '400px',
        disableClose: true,
      });
      //this.generateBatch(null);
      document.getElementById('batnum').focus();
      this.dialogRefBatchForDekit.afterClosed().subscribe(result => { 
      this.batchMFGDate = '';
      this.newBatchQty = lbsObj.componentLineQty;;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
      this.newBatchId = null;
      this.showBatchLov = false;
      this.parameterDataLBS[this.currentLBSIndex].batchNumber= this.newBatchNumber;  
    this.parameterDataLBS[this.currentLBSIndex].batchId= this.newBatchId;  
    this.parameterDataLBS[this.currentLBSIndex].batchEXPDate= this.commonService.dateFormat(this.batchEXPDate);  
    this.parameterDataLBS[this.currentLBSIndex].batchMFGDate= this.commonService.dateFormat(this.batchMFGDate); 
    });
  }
  }
  addBatchDetails() {
    if (this.newBatchNumber === '' || this.batchMFGDate === '' || this.batchEXPDate === '') {
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
        if (this.newBatchNumber === '')
          document.getElementById('batnum').focus();
        if (this.batchMFGDate === '')
          document.getElementById('mfdate').focus();
        if (this.batchEXPDate === '')
          document.getElementById('exdate').focus();
         return;
    }  
    this.parameterDataLBS[this.currentLBSIndex].batchNumber= this.newBatchNumber;  
    this.parameterDataLBS[this.currentLBSIndex].batchId= this.newBatchId;  
    this.parameterDataLBS[this.currentLBSIndex].batchEXPDate= this.commonService.dateFormat(this.batchEXPDate);  
    this.parameterDataLBS[this.currentLBSIndex].batchMFGDate= this.commonService.dateFormat(this.batchMFGDate); 
    let dialogref = null;
     dialogref = this.dialog.openDialogs.pop();
     dialogref.close();
  }
  addBatchDetails2() {
    if (this.newBatchNumber === '' || this.batchMFGDate === '' || this.batchEXPDate === '') {
      document.getElementById('batnumlov').focus();
      this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
      return;
    }
    this.parameterDataLBS[this.currentLBSIndex].batchNumber= this.newBatchNumber;  
    this.parameterDataLBS[this.currentLBSIndex].batchId= this.newBatchId;  
    this.parameterDataLBS[this.currentLBSIndex].batchEXPDate= this.batchEXPDate;  
    this.parameterDataLBS[this.currentLBSIndex].batchMFGDate= this.batchMFGDate; 
    let dialogref = null;      
     dialogref = this.dialog.openDialogs.pop();
     dialogref.close(); 
     dialogref = this.dialog.openDialogs.pop();
     dialogref.close();      
             
  }
  closeBatchLOVDekit(){
    this.showBatchLov = false;
    let lbsObj = this.parameterDataLBS[this.currentLBSIndex];
    this.batchTitle ="Enter Batch Details";
    this.batchMFGDate = this.minDate;
    this.newBatchQty = lbsObj.componentLineQty;
    this.batchEXPDate = '';
    this.newBatchNumber = '';
    this.newBatchId = null;
    let dialogref = null;      
     dialogref = this.dialog.openDialogs.pop();
     dialogref.close();
}
closeDialogDekit() {
    this.showBatchLov = false; 
    this.batchMFGDate = '';
    this.newBatchQty = null;
    this.batchEXPDate = '';
    this.newBatchNumber = '';
    this.newBatchId = null;
    let dialogref = null;      
     dialogref = this.dialog.openDialogs.pop();
     dialogref.close(); 
}
  showDailogForBatchDetails(from?) {
    this.batchTitle ="Enter Batch Details";
      this.dialogRefBatchLov = null;
    if(from){
      this.selectedBatch = null;
      let obj = {
        "itemId": this.woAssemblyItemId, "itemRevId": this.woAssemblyItemRevId, "iuId": this.iuId,"lgId": null, "locId": null
      };
      this.getExistedBatchList(obj);
      this.showBatchLov = true;
      this.batchTitle ="Select Batch Details";
      this.batchMFGDate = '';
      this.batchEXPDate = '';
      this.dialogRefBatchLov = this.dialog.open(this.confirmationDialog, {
        width: '400px',
        disableClose: true,
      });
      this.dialogRefBatchLov.afterClosed().subscribe(result => {
         this.batchTitle ="Enter Batch Details";
         this.showBatchLov = false;
         this.batchMFGDate = this.minDate;
         this.newBatchQty = this.avlTocompleteQty;
         this.batchEXPDate = '';
         this.newBatchNumber = '';
         this.newBatchId = null;
      });
       
    }else{
      this.showBatchLov = false;    
      this.batchMFGDate = this.minDate;
      this.newBatchQty = this.avlTocompleteQty;
      this.batchEXPDate = '';
      this.batchNumberPlaceholder = "Press Enter to Generate a new Batch";    
      const dialogRef = this.dialog.open(this.confirmationDialog, {
        width: '400px',
        disableClose: true,
      });
      //this.generateBatch(null);
      document.getElementById('batnum1').focus();
      dialogRef.afterClosed().subscribe(result => { 
      this.batchMFGDate = '';
      this.newBatchQty = null;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
      this.newBatchId = null;
      this.showBatchLov = false;
    });
  }
  }
  closeBatchLOV(){
      this.dialogRefBatchLov.close();
      this.batchTitle ="Enter Batch Details";
      this.batchMFGDate = this.minDate;
      this.newBatchQty = this.avlTocompleteQty;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
      this.newBatchId = null;
  }
  closeDialog() {
      this.showBatchLov = false; 
      this.batchMFGDate = '';
      this.newBatchQty = null;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
      this.newBatchId = null;
      this.dialog.closeAll();
  }
  completeWithBatch() {
    if (this.newBatchNumber === '' || this.batchMFGDate === '' || this.batchEXPDate === '') {
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
        if (this.newBatchNumber === '')
          document.getElementById('batnum1').focus();
        if (this.batchMFGDate === '')
          document.getElementById('mfdate').focus();
        if (this.batchEXPDate === '')
          document.getElementById('exdate').focus();
         return;
    }    
      this.completeWOIssue(); 
  }
  completeWithBatch2() {
    if (this.newBatchNumber === '' || this.batchMFGDate === '' || this.batchEXPDate === '') {
        this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
        if (this.selectedBatch === '')
          document.getElementById('batnumlov1').focus();
        if (this.batchMFGDate === '')
          document.getElementById('mfdate').focus();
        if (this.batchEXPDate === '')
          document.getElementById('exdate').focus();
         return;
    }    
      this.completeWOIssue("fromsecond"); 
  }
  completeWOIssue(from?:any) {

    if (this.parameterData1.length) {

    }
    if (this.assmBatchEnabled === 'N' || this.screenType === 'DIS') {
      this.batchMFGDate = '';
      this.newBatchQty = null;
      this.batchEXPDate = '';
      this.newBatchNumber = '';
      this.newBatchId = null;
    }
    if(!from && this.assmBatchEnabled === 'Y' && this.screenType === 'ASM'){
      this.batchEXPDate = this.batchEXPDate !== '' ? this.commonService.dateFormat(this.batchEXPDate) : this.batchEXPDate;
      this.batchMFGDate = this.batchMFGDate !== '' ? this.commonService.dateFormat(this.batchMFGDate) : this.batchMFGDate;
    }
    if (this.screenType === 'ASM') {
      //this.avlTocompleteQty = this.avlTocompleteQty - this.completionQty;
    }
    const obj = {
      woId: Number(this.woId),
      woAssmItemId: this.woAssemblyItemId,
      availableToCompleteQty: this.avlTocompleteQty,
      woCompletionQty: this.completionQty,
      woReqQty: this.woQty,
      workOrderType: this.screenType,
      dropLpnId: this.dropLpnId,
      batchEnabled: this.assmBatchEnabled,
      serialEnabled: this.assmSerialEnabled,
      updatedBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId),
      batchExpirationDate: this.batchEXPDate,
      batchOriginationDate: this.batchMFGDate,
      batchQuantity: this.newBatchQty,
      batchNumber: this.newBatchNumber,
      batchId: this.newBatchId,
      txnFrom: 'UI'
    } 
    /**** */
    this.woService.completeWoIsue(obj).subscribe(
      result => {
        if (result.status === 200) {
          //this.openSnackBar(result.message, '', 'success-snackbar');  

          this.avlTocompleteQty = Number(result.AvailableToCompleteQty);
          this.completionQty = Number(result.CompletedQty);
          this.completeSuccess = true;
          this.closeDialog();
          this.checkForCompletion(result.message);
        } else {
          this.openSnackBar(result.message, '', 'error-snackbar');
          this.completeSuccess = false;
          this.closeDialog();
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
        this.completeSuccess = false;
      }
    );

    // */
  }


  // get work order list based IU
  iuChanged(event: any, value: any) {   
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true) && value !== '') {
      this.completeSuccess = false;
      this.getWOList(this.iuId, "");
    }
  }

  fetchNewSearchListForWO(event: any, index: any, searchFlag: any) {

    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if((!searchFlag && charCode !== 13)  || this.listProgressHeader) {
      return;
    }
    if (this.showWOLov === 'hide' ) {
      this.inlineWOSearchLoader = 'show';
      this.getWOList(this.iuId, this.WOSearchValue);

    } else {
      this.showWOLov = 'hide';
      this.WOSearchValue = '';
    }

  }
  transactTypeChanged(event) {
    
    this.workOrderType = event.value;
    if (this.workOrderType === 'ISSUE') {
      this.screenType = 'ASM';
    } else {
      this.screenType = 'DIS';
    }
    this.woList = [];
    this.parameterData1 = [];
    this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
    this.getWOList(this.iuId, "");

  }
  //get Work order list
  getWOList(iuid, woNumber, from?) {
    
    this.woList = [];
    this.woList = [{
      woNumber: 'Please Select', woId: null, itemName: '', itemId: null,woAssemblyItemRevId:null, woReqQty: null, workOrderType: null, completionQty: null, avlTocompleteQty: null,
      destLgCode: '', destLocCode: '', destLgId: null, destLocId: null, dropLpnId: null, sourceLgId: null, sourceLocatorId: null, woStatus: null, assmBatchEnabled: "",
      assmSerialEnabled: '',woIsManual:'Y'
    }];
    this.listProgressHeader = true;
    this.parameterData1 = [];
    this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
    this.woService.getWOLOV(iuid, woNumber, this.workOrderType)
      .subscribe((data: any) => {
        if (data.status === 200 && !data.message) {
          this.listProgressHeader = false;
          for (const rowData of data.result) {
            this.woList.push({
              itemName: rowData.itemName,
              itemId: rowData.itemId,
              woAssemblyItemRevId: rowData.woAssemblyItemRevId,
              woId: rowData.woId,
              woNumber: rowData.woNumber,
              woReqQty: rowData.woReqQty,
              workOrderType: rowData.workOrderType,
              completionQty: rowData.completionQty,
              avlTocompleteQty: rowData.availableToCompleteQty ? rowData.availableToCompleteQty : 0,
              destLgCode: rowData.destLgCode,
              destLocCode: rowData.destLocCode,
              destLgId: rowData.destLgId,
              destLocId: rowData.destLocId,
              dropLpnId: rowData.dropLpnId,
              sourceLgId: rowData.sourceLg,
              sourceLocatorId: rowData.sourceLocatorId,
              woStatus: rowData.woStatus,
              assmBatchEnabled: rowData.batchEnabled,
              assmSerialEnabled: rowData.serialEnabled,
              woIsManual: rowData.woIsManual,
            });
          }
          if (woNumber !== "") {
            let currentobjIndex = this.woList.findIndex(d => d.woNumber === woNumber);
            if (currentobjIndex !== -1) {
              this.inlineWOSearchLoader = 'hide';
              this.showWOLov = 'show';
              this.woNumber = this.woList[currentobjIndex].woNumber;
              this.woId = this.woList[currentobjIndex].woId;
              // this.workOrderChanged({source : { selected: true, isUserInput :true}},this.woList[currentobjIndex],currentobjIndex);
            } else {
              this.inlineWOSearchLoader = 'hide';
              this.showWOLov = 'show';
              this.woNumber = this.woList[1].woNumber;
              this.woId = this.woList[1].woId;
            }

          }
          else if (woNumber === "" && this.woList.length > 1) {
            this.woNumber = this.woList[0].woNumber;
            this.woId = this.woList[0].woId;
            this.inlineWOSearchLoader = 'hide';
            this.showWOLov = 'show';
            //this.workOrderChanged({source : { selected: true, isUserInput :true}},this.woList[0],0);
          } else {
            this.woNumber = this.woList[0].woNumber;
            this.inlineWOSearchLoader = 'hide';
            this.showWOLov = 'show';
            // this.workOrderChanged({source : { selected: true, isUserInput :true}},this.woList[0],0); 
          }
        }
        else {
          this.listProgressHeader = false;
          if (woNumber === "") {
            this.openSnackBar(data.message, '', 'error-snackbar');             
          } else if (woNumber !== '' && from === 'DIS') {
            this.getWOList(this.iuId, '');
          }else{
            this.openSnackBar(data.message, '', 'error-snackbar');      
          }
          this.inlineWOSearchLoader = 'hide';
          this.showWOLov = 'show';
          this.woNumber = this.woList[0].woNumber;
          this.woId = this.woList[0].woId;
        }
      });

  }
  workOrderChanged(event, element, index) { 
    if (this.workOrderRefreshOnTransact || (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true))) {
      this.selectedRowIndex = null;
      this.woCurrentIndex = index;
      this.woId = element.woId;
      this.workOrderRefreshOnTransact = false;
      this.parameterData1 = [];
      this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
      if (this.woId !== null) {
        this.listProgress = true;
        if(element.woIsManual === 'Y'){         
          this.parameterDisplayedColumnsLBSItems = ['sno','lpnLG','lpnLOC','unresQty','LPN','TLPN','Batch','Serial','lineQty','action'];
          this.woIsManual = true;          
        }else{
          this.parameterDisplayedColumnsLBSItems = ['sno','lpnLG','lpnLOC','reservedQty','LPN','TLPN','Batch','Serial','lineQty','action'];
          this.woIsManual = false;
        }    
       
        this.woAssemblyItemname = element.itemName;
        this.woAssemblyItemId = element.itemId;
        this.woAssemblyItemRevId = element.woAssemblyItemRevId;
        this.assmBatchEnabled = element.assmBatchEnabled;
        this.assmSerialEnabled = element.assmSerialEnabled;
        this.woQty = element.woReqQty;
        this.woStatus = element.woStatus;
        this.onhandQty = null;
        this.completionQty = element.completionQty;
        this.avlTocompleteQty = element.avlTocompleteQty;
        this.isDestinationFound = 'N';
        this.dropLpnIdFound = 'N';
        this.isSoruceFound = 'N';        
        this.avlTocompleteQty = element.avlTocompleteQty ? element.avlTocompleteQty : 0;
        this.completionQty = element.completionQty;
        if (element.workOrderType) {
          this.screenType = element.workOrderType;
          this.workOrderType = (element.workOrderType === 'ASM') ? 'ISSUE' : 'RETURN';           
          this.locLable = (element.workOrderType === 'ASM') ? 'Locator' : 'Dest Locator';
          this.lgLable = (element.workOrderType === 'ASM') ? 'LG' : 'Dest LG';          
          this.secondlpnLabel = (element.workOrderType === 'ASM') ? 'TXN LPN #' : 'Transfer LPN #';          
          this.lpnLabel = (element.workOrderType === 'ASM') ? 'LPN #' : 'New LPN #';          
        }
        if (this.screenType === 'DIS' && this.woId) {
          {
            this.isAssemblyItem = false;
            this.onhandQty = null;
            {
              const data = { woIuId: String(this.iuId), woNumber: element.woNumber };
              this.woService.woIssueShowLines(data).subscribe(
                (data: any) => {
                  if (data.result) {
                    this.listProgress = false;
                    this.parameterData1 = [];
                    let i = 0;
                    for (const rowData of data.result) {
                      if (rowData.itemcategory === "Assembly Item") {
                        this.assemblyItemIndex = i;
                        rowData.isAssemblyItem = true;
                        if (element.avlTocompleteQty !== 0) {
                          this.showCompleteBtn = true;
                          this.dropLpnId = rowData.dropLpnId;
                        } else {
                          if (rowData.dropLpnId) {
                            this.dropLpnId = rowData.dropLpnId;
                          }
                          this.showCompleteBtn = false;
                        }
                        if (rowData.itemcategory === "Assembly Item" && rowData.woLineStatus !== 'UNRELEASED') {
                          this.isManual = false;
                          this.sourceLgId = rowData.sourceLg;
                          this.sourceLgCode = rowData.sourceLgCode;
                          this.sourceLocId = rowData.sourceLocatorId;
                          this.sourceLocCode = rowData.sourceLocatorCode;
                          this.destinationLgId = rowData.destinationLgId;
                          this.destinationLocatorId = rowData.destinationLocatorId;
                          this.destinationLgCode = rowData.destLgCode;
                          this.destinaionLocCode = rowData.destLocCode;
                          this.onhandQty = null;
                          this.issourceLgCode = true;
                          this.issourceLocCode = true;
                          this.isSoruceFound = 'Y';
                          if(this.woIsManual){
                          this.getSourceLgList();
                          this.getSourceLovForLocator();
                          }else{
                            this.getSourceLgList();
                          }

                        }
                        if (rowData.itemcategory === "Assembly Item" && rowData.woLineStatus === 'UNRELEASED' && element.avlTocompleteQty === 0) {
                          this.isManual = true;
                          if (!rowData.sourceLg) {
                            this.issourceLgCode = false;
                            this.issourceLocCode = false;
                            this.isSoruceFound = 'N';
                            this.getSourceLgList();
                            this.getAssemDestinationLGList();
                          }
                        } else if (rowData.itemcategory === "Assembly Item" && rowData.woLineStatus === 'UNRELEASED' && (element.avlTocompleteQty !== 0)) {
                          this.isManual = false;
                          this.sourceLgId = rowData.sourceLg;
                          this.sourceLgCode = rowData.sourceLgCode;
                          this.sourceLocId = rowData.sourceLocatorId;
                          this.sourceLocCode = rowData.sourceLocatorCode;
                          this.destinationLgId = rowData.destinationLgId;
                          this.destinationLocatorId = rowData.destinationLocatorId;
                          this.destinationLgCode = rowData.destLgCode;
                          this.destinaionLocCode = rowData.destLocCode;
                          this.issourceLgCode = true;
                          this.issourceLocCode = true;
                          this.isSoruceFound = 'Y';
                          this.getSourceLgList();
                          this.getSourceLovForLocator();
                        }
                      }
                      if (rowData.itemcategory === "Component Item") {
                        rowData.isAssemblyItem = false;
                      }
                      if (rowData.woLineStatus === 'COMPLETED') {
                        rowData.lpnDetailsSelected = 'Y';
                      } else {
                        rowData.lpnDetailsSelected = 'N';
                        rowData.woCmpConsumedQty = null;
                      }
                      rowData['originalData'] = Object.assign({}, rowData);
                      this.parameterData1.push(rowData);
                      i++;
                    }
                    this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
                    this.parameterDataSource1.paginator = this.paginator;
                  } else {
                    this.routingTableMessage = data.message;
                    this.listProgress = false;
                    this.parameterData1 = [];
                    this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
                    this.parameterDataSource1.paginator = this.paginator;
                  }
                },
                (error: any) => {
                  this.listProgress = false; 
                });
            }
          }
        }
        else if (this.screenType === 'ASM' && this.woId) {
          this.isAssemblyItem = false;
          this.isDestinationSelected = false;
          if (element.woStatus === 'RELEASED') {
            this.isManual = false;
          } else {
            this.isManual = true;
          }
          this.parameterData1 = [];
          const data = { woIuId: String(this.iuId), woNumber: element.woNumber };
          this.woService.woIssueShowLines(data).subscribe(
            (data: any) => { 
              if (data.result) {
                this.listProgress = false;
                this.parameterData1 = [];
                let i = 0;
                for (const rowData of data.result) {
                  if (rowData.dropLpnId && this.dropLpnIdFound === 'N') {
                    this.dropLpnId = rowData.dropLpnId;
                    this.dropLpnIdFound = 'Y';
                  }
                  if (rowData.destLgId && this.isDestinationFound === 'N') {
                    if (element.woStatus === 'UNRELEASED') {
                      this.isDestinationFound = 'Y';
                      this.isDestinationSelected = true;
                      this.destLocatorCode = rowData.destLocatorCode;
                      this.destinationLgCode = rowData.destLgCode;
                      this.destinationLgId = rowData.destLgId;
                      this.destinationLocatorId = rowData.destLocatorId;

                    }
                    if (element.woStatus === 'RELEASED' || element.woStatus === 'PARTIAL_COMPLETED') {
                      this.isDestinationFound = 'Y';
                      this.isDestinationSelected = true;
                      this.destLocatorCode = rowData.destLocatorCode;
                      this.destinationLgCode = rowData.destLgCode;
                      this.destinationLgId = rowData.destLgId;
                      this.destinationLocatorId = rowData.destLocatorId;
                      //this.getDestinationLgList();
                    }

                  }
                }

                if (element.woStatus === 'UNRELEASED' && this.isDestinationFound === 'N') {
                  this.isDestinationSelected = false;
                  this.destLocatorCode = null;
                  this.destinationLgCode = null;
                  this.destinationLgId = null;
                  this.destinationLocatorId = null;
                  this.getDestinationLgList();
                  //this.getLovForLocator("");                                                      
                }

                for (const rowData of data.result) {
                  rowData.isAssemblyItem = false;
                  rowData.alctnAllocatedQty = rowData.allocatedQty;

                  if (rowData.woLineStatus === 'COMPLETED') {
                    rowData.lpnDetailsSelected = 'Y';
                  } else {
                    rowData.lpnDetailsSelected = 'N';
                    rowData.woCmpConsumedQty = null;
                  }
                  rowData['originalData'] = Object.assign({}, rowData);

                  this.parameterData1.push(rowData);
                  //this.getLPNList(rowData,i);

                }
                this.checkForCompletion("");


                this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
                this.parameterDataSource1.paginator = this.paginator;

              } else {
                this.routingTableMessage = data.message;
                this.listProgress = false;
                this.parameterData1 = [];
                this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
                this.parameterDataSource1.paginator = this.paginator;
              }

            },
            (error: any) => {
              this.listProgress = false;
            });
        }
      }
      else {
        this.refreshThePage();
        this.parameterDataSource1 = new MatTableDataSource<ParameterDataElement1>(this.parameterData1);
        this.parameterDataSource1.paginator = this.paginator;
      }
    }
  }
  refreshThePage() {
    this.woAssemblyItemname = '';
    this.woAssemblyItemId = null;
    // this.showCompleteBtn = false;
    this.assmBatchEnabled = 'N';
    this.woQty = 0;
    this.onhandQty = null;
    this.avlTocompleteQty = 0;
    this.completionQty = 0;
    this.currentLineIndex = null;
    this.routingTableMessage = 'No record found';
    this.listProgress = false;
    this.destLocatorCode = '';
    this.destinationLgCode = '';
    this.sourceLgCode = '';
    this.sourceLocCode = '';
    this.sourceLgId = null;
    this.sourceLocId = null;
    this.sourceLgId = null;
    this.parameterData1 = [];
    this.isManual = false;
    this.isDestinationSelected = true;
    this.destinationLgId = null;
    this.destLocatorCode = "";
    this.destinationLgCode = "";
    this.dropLpnIdFound = 'N';
    this.isDestinationFound = 'N';
    this.isSoruceFound = 'N';
    this.dropLpnId = null;
    this.assmBatchEnabled = '';
    this.assmSerialEnabled = '';
    this.destinationLocatorId = null;
    this.completeSuccess = false;
    this.isAssemblyItem = false;
    this.workOrderRefreshOnTransact = false;

  }
  getIssuedItemsQty(element) {
    const data = { woIuId: String(this.iuId), woNumber: element.woNumber };
    this.woService.woIssueShowLines(data).subscribe(
      (data: any) => {
        if (data.result) {

          this.issuedNoOfComponents = 0;
          //this for loop finds source lg,loc information from lines(maual wo)
          for (const rowData of data.result) {
            if (rowData.woIssuedQty === this.completionQty) {
              this.issuedNoOfComponents++;
              if (this.issuedNoOfComponents === this.completionQty) {
                //return;
              }
            }
          }

        } else {
        }
      },
      (error: any) => {
        this.listProgress = false;
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      });
  }
  getWaveDetailsForKitting(currentWOLineId) {
    const obj = {
      woLineId: Number(currentWOLineId),
    }

    this.woIssueService.getWOIssueLineDetails(obj).subscribe(
      data => {
        if (data.status === 200 && !data.message) {
          this.isManual = false;
          let i = 0;
          for (const dataElement of data.result) {
            if (i === 0) {
              this.destLocatorCode = dataElement.destLocatorCode;
              this.destinationLgCode = dataElement.destinationLgCode;
              this.destinationLgId = dataElement.destinationLgId;
              this.destinationLocatorId = dataElement.destinationLocatorId;
            }
            i++;
          }
        }
      });
  }
  // Get the Locator Groups List
  getAllLoctorGroupsLov(index, lpnIndex) {
    this.allLocatorGroupList = [];
    this.clearLBSArrays(lpnIndex);
    const itemName = this.parameterData1[index].woCmpItemName;    
    let tempLgList = [];
    const data = { onhandIuId: Number(this.iuId), itemName: itemName, screen: 'WOSUMMARY' };
    this.woService.getLGList(data).subscribe(
      (data: any) => {
        if (data.result.length > 0) {

          for (const rowData of data.result) {
            tempLgList.push({
              itemId: rowData.itemId,
              iuId: rowData.iuId,
              lgCode: rowData.lgCode,
              lgId: rowData.lgId,
              lgName: rowData.lgName,
              lgLpnControlledFlag: rowData.lgLpnControlledFlag,
            });
          }
        } else {
          tempLgList.push({
            itemId: '',
            iuId: '',
            lgCode: '', lgId: null, lgName: 'No Data',
            lgLpnControlledFlag:''
          });
        }
        this.parameterDataLBS[lpnIndex].lgList = tempLgList;
        this.parameterDataLBS[lpnIndex].locList = [];
        if (!this.parameterDataLBS[lpnIndex].lgId) {
          this.parameterDataLBS[lpnIndex].lgId = tempLgList[0].lgId;
          this.parameterDataLBS[lpnIndex].lgLpnControlledFlag = tempLgList[0].lgLpnControlledFlag;
          //this.lgCodeSelectionChanged({source : { selected: true, isUserInput :true}},tempLgList[0],lpnIndex);
        }
        else {
          
          let currentobj = this.parameterDataLBS[lpnIndex].lgList.find(d => d.lgId === this.parameterDataLBS[lpnIndex].lgId);
          if (currentobj) {
            this.lgCodeSelectionChanged({ source: { selected: true, isUserInput: true } }, currentobj, lpnIndex);
          } else {
            this.parameterDataLBS[lpnIndex].lgId = tempLgList[0].lgId;
            this.lgCodeSelectionChanged({ source: { selected: true, isUserInput: true } }, tempLgList[0], lpnIndex);
          }
        }
      },
      (error: any) => {
      });
  }
  clearLBSArrays(lpnIndex) {
    if (this.parameterDataLBS[lpnIndex]) {
      this.parameterDataLBS[lpnIndex].lpnList = [];
      this.parameterDataLBS[lpnIndex].batchList = [];
      this.parameterDataLBS[lpnIndex].serialList = [];
      this.parameterDataLBS[lpnIndex].lpnSelectedList = [];
      this.parameterDataLBS[lpnIndex].batchSelectedList = [];
      this.parameterDataLBS[lpnIndex].serialSelectedList = [];
      this.parameterDataLBS[lpnIndex].lpnNumSelectedList = [];
      this.parameterDataLBS[lpnIndex].batchNumSelectedList = [];
      this.parameterDataLBS[lpnIndex].serialNumSelectedList = [];
    }
  }
  lgCodeSelectionChanged(event, ele, lpnIndex) {
   
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      if (ele) {
        this.parameterDataLBS[lpnIndex].lgLpnControlledFlag = ele.lgLpnControlledFlag;
        this.getStockLoctorGroupLov(ele.lgId, lpnIndex, ele.itemId, "");
       
        //this.parameterDataLBS[lpnIndex].showLocLov === 'hide';
        // this.fetchNewSearchListForItem({which: 13,source : { selected: true, isUserInput :true}},lpnIndex,"")


      }
    }
  }
  stockLocatorSelectionChanged(event, lpnIndex, element) {
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      if (element.locatorId !== this.parameterDataLBS[lpnIndex].locId) {
        this.parameterDataLBS[lpnIndex].locReservedQty = null;
      }
      this.parameterDataLBS[lpnIndex].locId = element.locatorId;
      this.parameterDataLBS[lpnIndex].locUnresQty = element.unReservedQty;

      //this.getUnReservedQty(lpnIndex);
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && this.parameterDataLBS[lpnIndex].lgLpnControlledFlag === 'Y') {
        this.getLPNList(this.parameterDataLBS[lpnIndex], lpnIndex);
       
      }else if(this.screenType === 'ASM' || this.isAssemblyItem){
        if (this.batchEnabled) {
          this.getBatchList(lpnIndex);
        }
        if (!this.batchEnabled && this.serialEnabled) {
          // this.getSerialList(this.parameterDataLBS[lpnIndex],lpnIndex,null,"locchange");
        }
      }
    }
  }
  //fetch lpn list    

  fetchNewSearchListForLpn(event: any, index: any, searchFlag: any) {
   let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.parameterDataLBS[index].showLpnLov === 'hide') {
      this.parameterDataLBS[index].inlineLpnSearchLoader = 'show';
      this.getLPNList(this.parameterDataLBS[index], index)
    } else {
      this.parameterDataLBS[index].showLpnLov = 'hide';
      this.parameterDataLBS[index].lpnSearchValue = '';
      this.parameterDataLBS[index].lpnId = null;
    }
  }
  //fetch batch list    

  fetchNewSearchListForBat(event: any, index: any, searchFlag: any) { 
      let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.parameterDataLBS[index].showBatLov === 'hide') {
      this.parameterDataLBS[index].inlineBatSearchLoader = 'show';
      this.getBatchList(index)
    } else {
      this.parameterDataLBS[index].showBatLov = 'hide';
      this.parameterDataLBS[index].batSearchValue = '';
      //  this.parameterDataLBS[index].batchSelectedList =  [] ;
      //  this.parameterDataLBS[index].batchNumSelectedList =  [] ;
    }
  }
  //fetch serial list    

  fetchNewSearchListForSer(event: any, index: any, searchFlag: any) {
   let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.parameterDataLBS[index].showSerLov === 'hide') {
      this.parameterDataLBS[index].inlineSerSearchLoader = 'show';
      this.getSerialList(this.parameterDataLBS[index], index, null, "fetch");
    } else {
      this.parameterDataLBS[index].showSerLov = 'hide';
      this.parameterDataLBS[index].serSearchValue = '';
      //  this.parameterDataLBS[index].serialSelectedList =  [] ;
      //  this.parameterDataLBS[index].serialNumSelectedList =  [] ;
    }
  }
  //fetch loc list    

  fetchNewSearchListForItem(event: any, index: any, searchFlag: any) {
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.parameterDataLBS[index].showLocLov === 'hide') {
      this.parameterDataLBS[index].inlineLocSearchLoader = 'show';
      this.getStockLoctorGroupLov(null, index, null, this.parameterDataLBS[index].locSearchValue)
    } else {
      this.parameterDataLBS[index].showLocLov = 'hide';
      this.parameterDataLBS[index].locSearchValue = '';
      this.parameterDataLBS[index].locId = null;
    }
  }
  // Get the Stock locator List
  getStockLoctorGroupLov(lgId, lpnIndex, itemId, searchText) {
    let locId = null;
    this.allLocatorGroupList = [];
    this.clearLBSArrays(lpnIndex);
    if (!lgId && !itemId) {
      lgId = this.parameterDataLBS[lpnIndex].lgId;
      itemId = this.parameterDataLBS[lpnIndex].itemId;
    }
    locId = this.parameterDataLBS[lpnIndex].locId;
    if (!searchText) {
      searchText = '';
    }
    let tempStockLocatorList = [];
    const data = { onhandIuId: Number(this.iuId), onhandLgId: lgId, onhandItemId: itemId, lgCode: searchText, screen: "Locator_List" };
    this.woIssueService.getLgOrLocList(data).subscribe(
      (data: any) => { 
        if (data.result && data.result.length > 0) {
          for (const rowData of data.result) {
           // if (rowData.unReservedQty > 0 || rowData.locatorId === locId) { // commented because to show the locator that has ureserve qty 0
            
              if (rowData.unReservedQty < 0) {
                rowData.unReservedQty = 0;
              }
              tempStockLocatorList.push({
                locCode: rowData.locCode,
                locatorId: rowData.locatorId,
                unReservedQty: rowData.unReservedQty,
              });
           
          }
          if (tempStockLocatorList.length !== 0) {
            tempStockLocatorList.sort((a, b) =>
              (a.unReservedQty > b.unReservedQty ? -1 : 1));
            this.parameterDataLBS[lpnIndex].locList = tempStockLocatorList;
            this.parameterDataLBS[lpnIndex].inlineLocSearchLoader = 'hide';
            this.parameterDataLBS[lpnIndex].showLocLov = 'show';
             if (!this.parameterDataLBS[lpnIndex].locId) 
              {
              this.parameterDataLBS[lpnIndex].locId = tempStockLocatorList[0].locatorId;
              this.parameterDataLBS[lpnIndex].locSearchValue = tempStockLocatorList[0].locCode;
              this.parameterDataLBS[lpnIndex].locReservedQty = null;
              this.stockLocatorSelectionChanged({source : { selected: true, isUserInput :true}},lpnIndex,this.parameterDataLBS[lpnIndex].locList[0]);
            }
             else {
              let currentobj = this.parameterDataLBS[lpnIndex].locList.find(d => d.locatorId === this.parameterDataLBS[lpnIndex].locId);
              if (currentobj) {
                this.parameterDataLBS[lpnIndex].locSearchValue = currentobj.locCode;
                this.parameterDataLBS[lpnIndex].locId = currentobj.locatorId;
                this.parameterDataLBS[lpnIndex].locReservedQty  = null;    
                this.stockLocatorSelectionChanged({source : { selected: true, isUserInput :true}},lpnIndex,currentobj);
              } else {
                this.parameterDataLBS[lpnIndex].locId = tempStockLocatorList[0].locatorId;
                this.parameterDataLBS[lpnIndex].locSearchValue = tempStockLocatorList[0].locCode;
                this.parameterDataLBS[lpnIndex].locReservedQty = null;
                 this.stockLocatorSelectionChanged({source : { selected: true, isUserInput :true}},lpnIndex,this.parameterDataLBS[lpnIndex].locList[0]);
              }
            }
          } else {
            if (this.parameterDataLBS.length !== 0) {
              this.parameterDataLBS[lpnIndex].locList = tempStockLocatorList;
              this.parameterDataLBS[lpnIndex].locId = null;
              this.parameterDataLBS[lpnIndex].inlineLocSearchLoader = 'hide';
              this.parameterDataLBS[lpnIndex].showLocLov = 'show';
              this.parameterDataLBS[lpnIndex].locSearchValue = '';
              this.parameterDataLBS[lpnIndex].locUnresQty = 0;
              this.parameterDataLBS[lpnIndex].locReservedQty = null;
              this.openSnackBar('No Locator found', '', 'error-snackbar');
            }
          }
        } else {
          if (this.parameterDataLBS.length !== 0) {
            this.parameterDataLBS[lpnIndex].locId = null;
            this.parameterDataLBS[lpnIndex].locList = tempStockLocatorList;
            this.parameterDataLBS[lpnIndex].inlineLocSearchLoader = 'hide';
            this.parameterDataLBS[lpnIndex].showLocLov = 'show';
            this.parameterDataLBS[lpnIndex].locSearchValue = '';
            this.parameterDataLBS[lpnIndex].locUnresQty = 0;
            this.openSnackBar('No match found', '', 'error-snackbar');
          }
        }
      },
      (error: any) => {
      });

  }
  // Get the Locator Groups List
  getUnReservedQty(lpnIndex) {
    const currentLpnDetailObj = this.parameterDataLBS[lpnIndex];
    const data = {
      onhandIuId: Number(this.iuId),
      onhandItemId: currentLpnDetailObj.itemId,
      onhandLgId: currentLpnDetailObj.lgId,
      onhandLocatorId: currentLpnDetailObj.locId,
      screen: 'WOONHAND'
    };
    this.woIssueService.getUnReservedQty(data).subscribe(
      (data: any) => { 
        if (data.result.length > 0) {
          for (const rowData of data.result) {
            this.parameterDataLBS[lpnIndex].locUnresQty = rowData.unReservedQty;
          }
        }
      },
      (error: any) => {
      });
  }
  selectSerialsBasedOnCount(event: any, index: any, value: number) {
     
    value = Number(value);
    this.selectedLPNRowIndex = null;
    if (!value || value === 0) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.selectedLPNRowIndex = index;
      this.openSnackBar('Component Quantity should be a non zero value', '', 'error-snackbar');
      return;
    }
    if (value && value > Number(this.parameterData1[this.currentLineIndex].openQty)) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.openSnackBar('Component Quantity should be less than or equal to Open Quantity', '', 'error-snackbar');
      this.selectedLPNRowIndex = index;
      return;
    }
    if (this.serialEnabled) {
      this.selectedLPNRowIndex = null;
      this.parameterDataLBS[index].serialNumSelectedListG = [];
      for (let i = 0; i < value; i++) {
        let element = this.parameterDataLBS[index].serialNumSelectedListGG[i];
        this.parameterDataLBS[index].serialNumSelectedListG.push(element);
      }
    }

  }
  calculateQtyForDekit(event: any, index: any, value: any) {
    this.selectedLPNRowIndex = null;
    value = Number(value);

    if (!value || value === 0) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.selectedLPNRowIndex = index;
      this.currentRequiredQty = Number(this.parameterData1[this.currentLineIndex].openQty);
      this.openSnackBar('Component Quantity should be a non zero value', '', 'error-snackbar');
      return;
    }
    if (value && value > Number(this.parameterData1[this.currentLineIndex].openQty)) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.openSnackBar('Component Quantity should be less than or equal to Open Quantity', '', 'error-snackbar');
      this.selectedLPNRowIndex = index;
      return;
    }
    this.selectedLPNRowIndex = null;
    this.generateSerialPerCount(index, Number(value));
  }
  calculateQty(event: any, index: any, value: any) {
    value = Number(value);
    this.selectedLPNRowIndex = null;

    if (!value || value === 0) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.selectedLPNRowIndex = index;
      this.openSnackBar('Component Quantity should be a non zero value', '', 'error-snackbar');
      return;
    }
    if (((Number(this.parameterDataLBS[index].locReservedQty) !== 0) && value > Number(this.parameterDataLBS[index].locReservedQty))) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.selectedLPNRowIndex = index;
      this.openSnackBar('Component Quantity should be less than or equal to Reserved Quantity', '', 'error-snackbar');
      return;
    }
    if ((!value || (value > Number(this.parameterDataLBS[index].locUnresQty) && Number(this.parameterDataLBS[index].locReservedQty) === 0))) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.selectedLPNRowIndex = index;
      this.openSnackBar('Component Quantity should be less than or equal to Unreserved Quantity', '', 'error-snackbar');
      return;
    }
    debugger
    if (value && value > Number(this.parameterData1[this.currentLineIndex].openQty)) {
      this.parameterDataLBS[index].componentLineQty = '';
      this.openSnackBar('Component Quantity should be less than or equal to Open Quantity', '', 'error-snackbar');
      this.selectedLPNRowIndex = index;

      return;
    }
    this.selectedLPNRowIndex = null;
    if (this.serialEnabled) {
      if (this.parameterDataLBS[index].serialList.length >= value && this.parameterDataLBS[index].serialList[0].serialId) {
        this.parameterDataLBS[index].serialSelectedList = [];
        this.parameterDataLBS[index].serialNumSelectedList = [];
        for (let i = 0; i < value; i++) {
          this.parameterDataLBS[index].serialSelectedList.push(this.parameterDataLBS[index].serialList[i].serialId);
          this.parameterDataLBS[index].serialNumSelectedList.push(this.parameterDataLBS[index].serialList[i].serialNumber);
        }
      }
    }


  }

  woLineQuantityCheck(index, from, totalQty?: number) {

    const value = this.parameterData1[index].perAssmebly;
    const assemblyItemQty = Number(value);
    let componentQty = Number(this.parameterData1[this.currentLineIndex].woCmpConsumedQty);
    if (totalQty) {
      componentQty = totalQty;
    }
    if (assemblyItemQty !== 0) {
      let rem = componentQty % assemblyItemQty;
      if (from && rem !== 0) {

        return '0';
      }
      if (rem !== 0) {
        // document.getElementById('row'+index).focus();
        this.openSnackBar('Component Quantity should be in multiples of PerAssembly Quantity', '', 'error-snackbar');
        return '0';
      }
    }
    if (totalQty) {
      let issueQty = Number(this.parameterData1[this.currentLineIndex]['originalData'].woIssuedQty) + componentQty;
      let remainqty = Number(this.parameterData1[this.currentLineIndex].woCmpQty) - issueQty;
      if (remainqty >= 0) {
        this.currentRequiredQty = remainqty;
        this.parameterData1[this.currentLineIndex].woCmpConsumedQty = componentQty + '';
      } else {
        this.parameterData1[this.currentLineIndex].woCmpConsumedQty = '';
        this.currentRequiredQty = Number(this.parameterData1[this.currentLineIndex].woCmpQty);
        this.openSnackBar('Component Quantity should be less or equal to Open Quantity', '', 'error-snackbar');
        return '0';
      }
    }
    return '1';

  }

  // get enabled IU
  getIuLovEnabled() {
    this.iuLov = [{ label: ' Please Select', value: '' }];
    this.woService.getIuLovAll().subscribe(
      (data: any) => {
        if (data.result) {
          for (const rowData of data.result) {
            if (rowData.enabledFlag === 'Y') {
              this.iuLov.push({
                label: rowData.code,
                value: rowData.id
              });
            }

          }


        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
    );
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
      panelClass: [typeClass]
    });
  }

  ngOnDestroy() {
    this.selectedRoutingLogicValue = [];
    window.localStorage.removeItem('taskDtailPage');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getScreenSize();
  }
  getScreenSize(event?) {
    const screenHeight = window.innerHeight;
    this.screenMaxHeight = (screenHeight - 298) + 'px';
  }
  getLPNList(element, index) {
    this.parameterDataLBS[index].lpnList = [];
    let lpnsearchval = this.parameterDataLBS[index].lpnSearchValue;
    let parameterDataLPN = [];
    let lpninputjson: any;
    if (this.isAssemblyItem) {
      lpninputjson = { "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId, "lgId": this.sourceLgId, "locId": this.sourceLocId, lpnId: lpnsearchval, "batchNumber": null, "serialNumber": null, "stockLocation": "INVENTORY" };
    }
    else if (element.lgId !== null) {
      lpninputjson = { "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId, "lgId": element.lgId, "locId": element.locId, lpnId: lpnsearchval, "batchNumber": null, "serialNumber": null, "stockLocation": "INVENTORY" };
    } else {
      lpninputjson = { "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId, "lgId": element.lgId, "locId": element.locId, lpnId: lpnsearchval, "batchNumber": null, "serialNumber": null, "stockLocation": "INVENTORY" };
    }
    this.woIssueService.getLPNList(lpninputjson).subscribe(
      (data: any) => {

        if (data.result && data.result.length) {
          for (const rowData of data.result) {
            if (rowData.lpnAvlQty) {
              parameterDataLPN.push({
                lpnNum: rowData.lpnNum,
                onhandItemId: rowData.onhandItemId,
                onhandItemRevision: rowData.onhandItemRevision,
                onhandIuId: rowData.onhandIuId,
                onhandLpnId: rowData.onhandLpnId,
                onhandLgId: rowData.onhandLgId,
                onhandLocatorId: rowData.onhandLocatorId,
                lpnAvlQty: rowData.lpnAvlQty,
                primarySum: rowData.primarySum,

              });
            } else {
              //this.openSnackBar( 'LPN is Null', '','default-snackbar'); 
            }
          }

          parameterDataLPN.sort((a, b) =>
            (a.lpnAvlQty > b.lpnAvlQty ? -1 : 1));

          this.parameterDataLBS[index].lpnList = parameterDataLPN;
          this.parameterDataLBS[index].inlineLpnSearchLoader = 'hide';
          this.parameterDataLBS[index].showLpnLov = 'show';
          this.parameterDataLBS[index].lpnNumSelectedList = [];
          this.parameterDataLBS[index].lpnSelectedList = [];
          if (parameterDataLPN.length !== 0 && parameterDataLPN[0].onhandLpnId) {
            this.parameterDataLBS[index].lpnSelectedList.push(parameterDataLPN[0].onhandLpnId);
            this.parameterDataLBS[index].lpnNumSelectedList.push(parameterDataLPN[0].lpnNum);

            this.lpnChanged({ source: { selected: true, isUserInput: true } }, index);
          } else {
           // this.openSnackBar('No LPN found', '', 'default-snackbar');
            this.parameterDataLBS[index].lpnList = parameterDataLPN;
            this.parameterDataLBS[index].inlineLpnSearchLoader = 'hide';
            this.parameterDataLBS[index].showLpnLov = 'show';
            this.parameterDataLBS[index].lpnNumSelectedList = [];
            this.parameterDataLBS[index].lpnSelectedList = [];

            if (!this.batchEnabled && this.serialEnabled) {
              this.getSerialList(this.parameterDataLBS[index], index, null, "locchange");
            }
          }
        } else if (data.message) {
          this.parameterDataLBS[index].lpnList = parameterDataLPN;
          this.parameterDataLBS[index].inlineLpnSearchLoader = 'hide';
          this.parameterDataLBS[index].showLpnLov = 'show';
          this.parameterDataLBS[index].lpnNumSelectedList = [];
          this.parameterDataLBS[index].lpnSelectedList = [];
          if (!this.batchEnabled && this.serialEnabled) {
            this.getSerialList(this.parameterDataLBS[index], index, null, "locchange");
          }
        }
      });
  }
  getExistedBatchList(element,from?:any){
    let parameterDataBatch = [];
    let firstBatchObj = [{item: '',
      lgCode: '',
      onhandBatchId: -1,
      batchNumber: "Please Select",
      primarySum: 0,
      batchExpirationDate: '',
      batchOriginationDate: '',
      include: true,}];
   let inputjson = {"batchItemId": element.itemId,"batchIuId": element.iuId};
    this.woIssueService.getExistingBatchList(inputjson).subscribe(
      (data: any) => {
        if (data.result) {
          for (const rowData of data.result) {
            if(rowData.batchId){
            parameterDataBatch.push({
              item: rowData.itemName,
              lgCode: rowData.lgCode,
              onhandBatchId: rowData.batchId,
              batchNumber: rowData.batchNumber,
              primarySum: rowData.batchQuantity,
              batchExpirationDate: rowData.batchExpirationDate,
              batchOriginationDate: rowData.batchOriginationDate,
              include: true,
            });
          }
          } 
          this.existedBatchList = parameterDataBatch;   
          this.selectedBatch = this.existedBatchList[0].onhandBatchId; 
          if(from){
            this.onExistedBatchSelect2(null,this.existedBatchList[0]);
          }  else{
            this.onExistedBatchSelect(null,this.existedBatchList[0]);
          }    
          
        }
        //
      });
  }
  getBatchList(index) {
    let element = this.parameterDataLBS[index];

    let parameterDataBatch = [];
    let inputjson;
    const lpnList = element.lpnSelectedList.join();

    inputjson = {
      "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId,
      "lgId": element.lgId, "locId": element.locId, "lpnIdList": lpnList,
      "batchNumber": element.batSearchValue, "serialNumber": null, "stockLocation": "INVENTORY"
    };
    if (this.isAssemblyItem) {
      inputjson = {
        "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId,
        "lgId": this.sourceLgId, "locId": this.sourceLocId, "lpnIdList": lpnList,
        "batchNumber": element.batSearchValue, "serialNumber": null, "stockLocation": "INVENTORY"
      };

    }
    //const lpninputjson = {"itemId":element.woCmpItemId,"itemRevId":null,"iuId":element.woLineIuId,"lgId":element.sourceLg,"locId": element.sourceLocatorId,"batchNumber":null,"serialNumber":null,"stockLocation":"INVENTORY"};
    this.woIssueService.getBatchList(inputjson).subscribe(
      (data: any) => {

        if (data.result) {

          for (const rowData of data.result) {
            parameterDataBatch.push({
              sno: '',
              item: rowData.itemName,
              lgCode: rowData.lgCode,
              onhandBatchId: rowData.onhandBatchId,
              batchNumber: rowData.batchNumber,
              primarySum: rowData.batchAvailblQty,
              include: true,
            });
          }
          parameterDataBatch.sort((a, b) =>
            (a.primarySum > b.primarySum ? -1 : 1));
          this.parameterDataLBS[index].batchList = parameterDataBatch;
          this.parameterDataLBS[index].inlineBatSearchLoader = 'hide';
          this.parameterDataLBS[index].showBatLov = 'show';
          this.parameterDataLBS[index].batchNumSelectedList = [];
          this.parameterDataLBS[index].batchSelectedList = [];
          this.currentBatchList = parameterDataBatch;
          if (parameterDataBatch.length !== 0 && parameterDataBatch[0].onhandBatchId && !this.parameterData1[this.currentLineIndex].batchId) {
            this.parameterDataLBS[index].batchSelectedList.push(parameterDataBatch[0].onhandBatchId);
            this.parameterDataLBS[index].batchNumSelectedList.push(parameterDataBatch[0].batchNumber);
            this.batchChanged({ source: { selected: true, isUserInput: true } }, index, this.parameterDataLBS[index].batchList[0]);
          } else if (parameterDataBatch.length !== 0 && parameterDataBatch[0].onhandBatchId && this.parameterData1[this.currentLineIndex].batchId) {
            this.parameterDataLBS[index].batchSelectedList.push(this.parameterData1[this.currentLineIndex].batchId);
            this.parameterDataLBS[index].batchNumSelectedList.push(this.parameterData1[this.currentLineIndex].batchNumber);
            let currentobj = parameterDataBatch.find(d => d.onhandBatchId === this.parameterData1[this.currentLineIndex].batchId);

            this.batchChanged({ source: { selected: true, isUserInput: true } }, index, currentobj);
          }
          else {
            // this.getSerialList(this.parameterData1[index],index); 
            this.currentBatchList = [];
          }
        } else if (data.message) {
          this.openSnackBar('No Batch Number found', '', 'error-snackbar');
          this.parameterDataLBS[index].batchSelectedList = [];
          this.parameterDataLBS[index].batchNumSelectedList = [];
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
    )
  }
  getSerialList(element, index, currentObj, from) {
    let inputjson: any;
    let batchId = null;
    let lpnId = null;
    let batchNumber = null;
    let lpnList = null;
    let batchIdList = null;
    if (this.isAssemblyItem) {
      if (from === 'lpn') {
        lpnId = currentObj.onhandLpnId;
        lpnList = element.lpnSelectedList.join();
      } else if (from === 'batch') {
        batchId = currentObj.onhandBatchId;
        batchNumber = currentObj.batchNumber;
        batchIdList = element.batchSelectedList.join();
      }
      inputjson = {
        "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId,
        "batchId": batchId, "lpnId": lpnId, "batchNumber": batchNumber, "lpnIdList": lpnList, "batchIdList": batchIdList,
        "lgId": this.sourceLgId, "locId": this.sourceLocId,
        "serialNumber": element.serSearchValue, "stockLocation": "INVENTORY"
      };
    } else {
      if (from === 'lpn') {
        lpnId = currentObj.onhandLpnId;
        lpnList = element.lpnSelectedList.join();
      } else if (from === 'batch') {
        batchId = currentObj.onhandBatchId;
        batchNumber = currentObj.batchNumber;
        batchIdList = element.batchSelectedList.join();
      } else if (from === 'fetch') {

      }
      inputjson = {
        "itemId": element.itemId, "itemRevId": element.itemRevId, "iuId": element.iuId,
        "batchId": batchId, "lpnId": lpnId, "batchNumber": batchNumber, "lpnIdList": lpnList, "batchIdList": batchIdList,
        "lgId": element.lgId, "locId": element.locId,
        "serialNumber": element.serSearchValue, "stockLocation": "INVENTORY"
      };
    }

    //  inputjson = {"itemId":element.itemId,"itemRevId":element.itemRevId,"iuId":element.iuId,
    //                     "lgId":element.lgId,"locId": element.locId,"lpnId":element.lpnId,"batchId":element.batchId,
    //                     "batchNumber":null,"serialNumber":null,"stockLocation":"INVENTORY"};
    let parameterDataSerial = [];
    this.woIssueService.getSerialList(inputjson).subscribe(
      (data: any) => {

        if (data.result) {


          for (const rowData of data.result) {
            parameterDataSerial.push({
              sno: '',
              serialNumber: rowData.serialNumber,
              serialId: rowData.serialId,
            });
          }

          this.parameterDataLBS[index].serialList = parameterDataSerial;

          this.currentSerialList = parameterDataSerial;
          this.parameterDataLBS[index].inlineSerSearchLoader = 'hide';
          this.parameterDataLBS[index].showSerLov = 'show';
          this.parameterDataLBS[index].serialSelectedList = [];
          this.parameterDataLBS[index].serialNumSelectedList = [];


        } else {
          // parameterDataSerial.push({
          //   sno               : '',
          //   serialNumber      : 'empty list', 
          //   serialId          : null, 
          // });
          this.openSnackBar('No Serial Number found', '', 'error-snackbar');
          this.parameterDataLBS[index].serialList = parameterDataSerial;
          this.parameterDataLBS[index].inlineSerSearchLoader = 'hide';
          this.parameterDataLBS[index].showSerLov = 'show';
          this.parameterDataLBS[index].serialSelectedList = [];
          this.parameterDataLBS[index].serialNumSelectedList = [];

        }
        let temp = [];
        this.parameterDataLBS[index].serialNumSelectedList = [];

        // if(parameterDataSerial.length !==0 && parameterDataSerial[0].serialId){
        //   this.parameterDataLBS[index].serialSelectedList.push(parameterDataSerial[0].serialId);                              
        //   this.parameterDataLBS[index].serialNumSelectedList.push(parameterDataSerial[0].serialNumber);   
        //   //this.serialChanged({source : { selected: true, isUserInput :true}},index,this.parameterDataLBS[index].serialList[0]);
        //   }

        if (parameterDataSerial.length !== 0 && parameterDataSerial[0].serialId) {
          let lineqty = Number(this.parameterDataLBS[index].componentLineQty);
          for (let i = 0; i < lineqty; i++) {
            this.parameterDataLBS[index].serialSelectedList.push(parameterDataSerial[i].serialId);
            this.parameterDataLBS[index].serialNumSelectedList.push(parameterDataSerial[i].serialNumber);
          }
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
    )
  }

  showLpnList(lpnIndex) {
    if (this.parameterDataLBS[lpnIndex].lpnSelectedList) {
      this.lpnSelected = true;
    } else {
      this.lpnSelected = false;
    }
  }
  lpnChanged(event: any, index: any) {
    if (event.source.selected) {
      this.parameterDataLBS[index].lpnNumSelectedList = [];
       if (this.parameterDataLBS[index].lpnSelectedList.length !== 0) {
        this.parameterDataLBS[index].lpnSelectedList.forEach(element => {
          let currentobj = this.parameterDataLBS[index].lpnList.find(d => d.onhandLpnId === element);
          this.parameterDataLBS[index].lpnNumSelectedList.push(currentobj.lpnNum);
        });
      } else {
        if ((this.batchEnabled && this.serialEnabled) || (this.batchEnabled && !this.serialEnabled)) {
          this.parameterDataLBS[index].batchList = [];
        }
        if (!this.batchEnabled && this.serialEnabled) {
          this.parameterDataLBS[index].serialList = [];
        }
      }
      if (this.parameterDataLBS[index].lpnSelectedList.length !== 0) {
        this.currentlpnobj = this.parameterDataLBS[index].lpnList.find(d => (d.onhandLpnId === this.parameterDataLBS[index].lpnSelectedList[0]));

        if ((this.batchEnabled && this.serialEnabled) || (this.batchEnabled && !this.serialEnabled)) {
          this.parameterDataLBS[index].batchList = [];
          this.parameterDataLBS[index].batchSelectedList = [];
          this.getBatchList(index);
        }
        if (!this.batchEnabled && this.serialEnabled) {
          this.parameterDataLBS[index].serialList = [];
          this.parameterDataLBS[index].serialSelectedList = [];
          this.getSerialList(this.parameterDataLBS[index], index, this.currentlpnobj, 'lpn');

        }
      } else {
        this.parameterDataLBS[index].batchList = [];
        this.parameterDataLBS[index].batchSelectedList = [];
        this.parameterDataLBS[index].serialList = [];
        this.parameterDataLBS[index].serialSelectedList = [];
      }
    }
  }
  batchChanged(event: any, index: any, batchObj) {
    if (event.source.selected) {
      this.parameterDataLBS[index].batchNumSelectedList = [];
      // if(batchObj){
      //   //console.log(' obj batchval- '+batchObj.onhandBatchId);
      //   this.currentBatchObj =  this.parameterDataLBS[index].batchList.find(d => (d.onhandBatchId === batchObj.onhandBatchId));
      //   if(!this.currentBatchObj){
      //   this.parameterDataLBS[index].batchSelectedList.push(batchObj.onhandBatchId);  
      //   }     

      // }else
      if (this.parameterDataLBS[index].batchSelectedList.length !== 0) {
        this.currentBatchObj = this.parameterDataLBS[index].batchList.find(d => (d.onhandBatchId === this.parameterDataLBS[index].batchSelectedList[0]));
      } else {
        this.parameterDataLBS[index].batchNumSelectedList = [];
        if (this.batchEnabled && this.serialEnabled) {
          this.parameterDataLBS[index].serialList = [];
          this.parameterDataLBS[index].serialSelectedList = [];
          this.parameterDataLBS[index].serialNumSelectedList = [];

        }
      }
      if (this.parameterDataLBS[index].batchSelectedList.length !== 0) {
        this.parameterDataLBS[index].batchNumSelectedList = [];
        this.parameterDataLBS[index].batchSelectedList.forEach(element => {
          let currentobj = this.parameterDataLBS[index].batchList.find(d => d.onhandBatchId === element);
          this.parameterDataLBS[index].batchNumSelectedList.push(currentobj.batchNumber);
        });

        if (this.serialEnabled) {
          this.parameterDataLBS[index].serialList = [];
          this.getSerialList(this.parameterDataLBS[index], index, this.currentBatchObj, 'batch');
        }
      } else {
        this.parameterDataLBS[index].serialList = [];
        this.parameterDataLBS[index].serialSelectedList = [];
        this.parameterDataLBS[index].batchNumSelectedList = [];
      }
    }
  }
  serialChanged(event: any, index: any, serialObj) {
    if (event.source.selected) {
      this.parameterDataLBS[index].serialNumSelectedList = [];
      if (serialObj) {
        this.parameterDataLBS[index].serialNumSelectedList.push(serialObj.serialNumber);
      } else {
        this.currentSerialObj = this.parameterDataLBS[index].serialList.find(d => (d.serialId === this.parameterDataLBS[index].serialSelectedList[0]));
      }
      if (this.parameterDataLBS[index].serialSelectedList.length !== 0) {
        this.parameterDataLBS[index].serialNumSelectedList = [];
        this.parameterDataLBS[index].serialSelectedList.forEach(element => {
          let currentobj = this.parameterDataLBS[index].serialList.find(d => d.serialId === element);
          this.parameterDataLBS[index].serialNumSelectedList.push(currentobj.serialNumber);
        });
      }
    }
  }
  serialGChanged(event: any, index: any) {
    if (event.source.selected) {
      //this.parameterDataLBS[index].serialNumSelectedListGG = [];

      if (event.value.length !== 0) {

        this.parameterDataLBS[index].serialNumSelectedListG = [];
        event.value.forEach(element => {
          this.parameterDataLBS[index].serialNumSelectedListG.push(element);
        });
      }
    } else {
      //this.parameterDataLBS[index].serialNumSelectedListGG.splice()
    }
  }

  openConfirmationDialog() {
    this.commonService.openConfirmationDialog('Work order Issue', "workorderissue");
  }
  showDetails(element, templateRef: TemplateRef<any>, index) {
    this.currentLineIndex = index;
    this.batchEnabled = false;
    this.serialEnabled = false;
    this.parameterDataLBS = [];
    this.currentItemName = this.parameterData1[index].woCmpItemName;
    this.currentRequiredQty1 = Number(this.parameterData1[index].woCmpQty);
    this.currentPerAssemblyQty = Number(this.parameterData1[index].perAssmebly);
    this.currentItemDescription = this.parameterData1[index].itemDescription;
    this.currentIssuedQty = this.parameterData1[index].woIssuedQty ? this.parameterData1[index].woIssuedQty : 0;
    this.currentOpenQty = this.parameterData1[index].openQty ? this.parameterData1[index].openQty : 0;

    if (this.currentOpenQty === 0 && this.screenType === 'DIS') {
      this.openSnackBar('There is No Open Quantity to transact', '', 'error-snackbar');
      return;
    }

    if (this.screenType === 'DIS' && this.parameterData1[index].isAssemblyItem) {
      this.isAssemblyItem = true;


      if (this.screenType === 'DIS' && (!this.sourceLgId || !this.sourceLocId)) {
        this.openSnackBar('Plese Select Source LG and Location', '', 'error-snackbar');
        return;
        //this.openConfirmationDialog();
      }
      //if(this.isManual && this.screenType === 'DIS' && this.sourceLgId && this.sourceLocId && (this.onhandQty < this.currentRequiredQty1)){
     // if (this.isManual && this.screenType === 'DIS' && this.sourceLgId && this.sourceLocId && ((this.onhandQty <= 0) || (this.onhandQty < this.currentOpenQty))) {
      if (this.isManual && this.screenType === 'DIS' && this.sourceLgId && this.sourceLocId && ((this.onhandQty <= 0))) {

        this.openSnackBar('Plese Select Source LG and Location that has sufficient Onhand Quntity ', '', 'error-snackbar');
        return;
        //this.openConfirmationDialog();
      }
      else {
        this.parameterData1[index].sourceLg = this.sourceLgId;
        this.parameterData1[index].sourceLocatorId = this.sourceLocId;
        this.lpnLabel = 'Source LPN #';
        this.secondlpnLabel = 'TXN LPN #';
      }
      if (this.parameterData1[this.assemblyItemIndex].woLineStatus !== 'COMPLETED' || this.currentOpenQty !== 0) {

        if ((this.parameterData1[index].serialEnabled) === 'Y') {
          this.serialEnabled = true;
        }
        if ((this.parameterData1[index].batchEnabled) === 'Y') {
          this.batchEnabled = true;
        }
        //this.getDestinationLOCList(this.parameterDekitTaskArray[0].destinationLgId);
        this.addLBSRow(this.parameterData1[index], 'assemblyItem');
      } else {
        this.openSnackBar('This Assembly item is transacted', '', 'error-snackbar');
        return;
      }

    }
    else {
      //this.lpnLabel = (this.screenType === 'ASM') ? 'LPN #/TXN LPN #' : 'New LPN #/Transfer LPN #';
      this.isAssemblyItem = false;
      if (this.parameterData1[index].woLineStatus === 'COMPLETED') {
        this.openSnackBar('This component item is transacted', '', 'error-snackbar');
        return;
      }
      
      if (this.screenType === 'ASM' && (!this.destinationLgId || !this.destinationLocatorId)) {
        this.openSnackBar('Plese Select the Destination LG and Location', '', 'error-snackbar');
        return;
      }
      if (this.screenType === 'DIS' && !this.sourceLgId && !this.sourceLocId) {
        this.openSnackBar('Plese Select Source LG and Location', '', 'error-snackbar');
        return;
       
      }

      this.currentWOLineId = this.parameterData1[index].woLineId;
      this.currentLG = this.parameterData1[index].sourceLgCode;
      this.currentLOC = this.parameterData1[index].sourceLocatorCode;
      this.currentCmpQty = Number(this.parameterData1[index].woCmpConsumedQty);

      if ((this.parameterData1[index].serialEnabled) === 'Y') {
        this.serialEnabled = true;
      }
      if ((this.parameterData1[index].batchEnabled) === 'Y') {
        this.batchEnabled = true;
      }
      this.parameterDataLBS = [];
      if (this.screenType === 'ASM' && this.parameterData1[index].sourceLg && this.parameterData1[index].sourceLocatorId && this.currentOpenQty > 0) {
        this.isManual = false;
        this.parameterDisplayedColumnsLBSItems = ['sno','lpnLG','lpnLOC','reservedQty','LPN','TLPN','Batch','Serial','lineQty','action'];
        
        if (this.woStatus === 'RELEASED' && this.parameterData1[index].referenceWoLineId && this.currentOpenQty > 0) {
          this.getWOLineDetails(this.parameterData1[index].referenceWoLineId, 'withRefId');
        } else if ((this.woStatus === 'RELEASED' || this.woStatus === 'PARTIAL_COMPLETED') && this.currentOpenQty > 0) {
          this.getWOLineDetails(this.currentWOLineId, null);
        }
      } else if(this.screenType === 'ASM' && !this.parameterData1[index].sourceLg && !this.parameterData1[index].sourceLocatorId && this.currentOpenQty > 0)
      {
        this.isManual = true;
        this.parameterDisplayedColumnsLBSItems = ['sno','lpnLG','lpnLOC','unresQty','LPN','TLPN','Batch','Serial','lineQty','action'];
         
        
        this.addLBSRow();
      }

      if (this.screenType === 'DIS' && this.currentOpenQty > 0) {
        this.addLBSRow();
      }
    }
    if (templateRef != null && this.currentOpenQty > 0) {
      this.parameterDataSourceLBS = new MatTableDataSource<ParameterDataElementLBS>(this.parameterDataLBS);
      let cmpQty = Number(this.parameterData1[index].woCmpQty);
      let dialogRef = this.dialog.open(templateRef, {
        autoFocus: false,
        width: '100vw',
        maxWidth: '90vw',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        this.updateCloseDialogData();
      });
    } else if (this.currentOpenQty === 0 && this.screenType === 'ASM') {
      this.openSnackBar('This component item is transacted', '', 'error-snackbar');
    }
    else if (this.currentOpenQty === 0 && this.screenType === 'DIS') {
      this.openSnackBar('There is No Open Quantity to transact', '', 'error-snackbar');
    }
  }
  updateCloseDialogData() {
    if (this.screenType === 'DIS' && !this.isAssemblyItem) {
      this.isManual = false;
    }

  }
  getWOLineDetails(currentWOLineId: any, withRefId: string) {
    const obj = {
      woLineId: Number(currentWOLineId),
    }
    this.woIssueService.getWOIssueLineDetails(obj).subscribe(
      data => {
        if (data.status === 200 && !data.message) {
          if (withRefId) {
            //this.isManual = false;
            for (const rowData of data.result) {
              // this.addLBSRow(rowData, 'lpnDetails');
              this.addLBSRow(rowData);
            }
          } else {
            this.isManual = false;
            for (const rowData of data.result) {
              this.addLBSRow(rowData);
            }
          }

        } else {
         
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');

      }
    );
  }
  getOldTransactionDetails(index: number) {
    
    const obj = {       
      iuId : this.parameterData1[index].woLineIuId ,
      itemId : this.parameterData1[index].woCmpItemId,
      woId: this.woId,
      woLineId: this.parameterData1[index].woLineId,
      transactionType: this.screenType === 'ASM' ? "KIT_TRANSFER" : "DE_KIT_TRANSFER"
    };
    
    this.woIssueService.getOldTransactionsByWOLineID(obj).subscribe(
      data => {
        if (data.status === 200 && !data.message) {           
            for (const rowData of data.result) {
              let curLg = "";
              let curLoc = "";
              let lpn = "";
              let tLpn = ""; // transaction or transfer lpn(dekit component)
              if(this.screenType === 'ASM'){
                curLg = rowData.txnFromLgCode;
                curLoc = rowData.txnFromLocatorCode;
                if(rowData.transferLpnNumber){
                  lpn = rowData.transferLpnNumber;
                  tLpn = rowData.txnLpnNumber;
                }else{
                  lpn = '-';                   
                  tLpn = rowData.txnLpnNumber;
                }
              }else{
                curLg = rowData.txnToLgCode;
                curLoc = rowData.txnToLocatorCode;
                if(this.isAssemblyItem){
                  if(rowData.transferLpnNumber){
                    lpn = rowData.transferLpnNumber;
                    tLpn = rowData.txnLpnNumber;
                    }else{
                      lpn = '-';                   
                      tLpn = rowData.txnLpnNumber;
                    }
                }else{
                  lpn = rowData.txnLpnNumber;
                  tLpn = rowData.transferLpnNumber;
                }
                
              }
              let lineObj = {
                txnId: rowData.txnId,
                lpnNum : lpn,
                tLpnNum : tLpn,      
                lgCode : curLg,
                locCode :curLoc,
                componentLineQty : rowData.txnQuantity,
                batchCount : rowData.batchCount,
                serialCount : rowData.serialCount,
                addNewRecord : false,
                editing:false
              }
              this.parameterDataLBS.push(lineObj);
              
            }  
            this.parameterDataSourceLBS = new MatTableDataSource<any>(this.parameterDataLBS);   
          } else {  
            //no record found       
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');

      }
    );
  }
  saveLPNDetails() {
    this.parameterData1[this.currentLineIndex].lpnDetailsSelected = 'N';

    let totalLpnQty = 0;
    let totalbatchQty = 0;
    let finallpnList = [];
    let finalBatchList = [];
    let finalSerialList = [];
    this.lpnList = [];
    this.batchList = [];
    this.serialList = [];
    this.finalLg = '';
    this.finalLoc = '';
    this.selectedLPNRowIndex = null;
    let totalLinesQty = 0;
    let value = 0;
    let lpnDetails = [];
    // if(!this.parameterData1[this.currentLineIndex].isAssemblyItem) {     
    for (const [i, rowData] of this.parameterDataLBS.entries()) {
      if(rowData.addNewRecord)
      {
      totalLinesQty += Number(rowData.componentLineQty);
      value = Number(rowData.componentLineQty);
      if (totalLinesQty === 0) {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Please Enter Quantity at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && ((Number(rowData.locReservedQty) !== 0) && value > Number(rowData.locReservedQty))) {
        rowData.componentLineQty = '';
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Component Quantity should be less than or equal to Reserved Quantity', '', 'error-snackbar');
        return;
      }
      if (((this.screenType === 'ASM' || this.isAssemblyItem) && (!value || (value > Number(rowData.locUnresQty) && Number(rowData.locReservedQty) === 0)))) {
        rowData.componentLineQty = '';
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Component Quantity should be less than or equal to Unreserved Quantity', '', 'error-snackbar');
        return;
      }
      // if(this.serialEnabled && Number(rowData.componentLineQty) > 1){
      //   this.selectedLPNRowIndex = i;
      //   this.openSnackBar('Component Quantity should be equal to 1 for Serial Controlled Item at Row- '+(i+1), '','error-snackbar');
      //   return;
      // }
      if ((this.screenType === 'DIS' && !this.isAssemblyItem) && this.batchEnabled && rowData.batchNumber === '') {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Please select batch details for a Batch Controlled Item at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      if ((this.screenType === 'DIS' && !this.isAssemblyItem) && this.serialEnabled && rowData.serialNumber === '') {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Please enter value for Serial Controlled Item at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      //LPN Validation
      // if ((this.screenType === 'ASM' || this.isAssemblyItem) && rowData.lpnSelectedList.length === 0) {
      //   this.selectedLPNRowIndex = i;
      //   this.openSnackBar('Please select LPN  at Row- ' + (i + 1), '', 'error-snackbar');
      //   return;
      // }
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && this.checkLPNQuantity(i) === '0') {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Selected LPN List\'s available quantity is not sufficient at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      //  if(!this.batchEnabled && !this.serialEnabled){
      //  finallpnList = finallpnList.concat(rowData.lpnSelectedList);        
      //  const val = new Set(finallpnList).size !== finallpnList.length;    
      //  if(val) {
      //    this.selectedLPNRowIndex = i;
      //   this.openSnackBar('Duplicate LPN found at Row- '+(i+1), '','default-snackbar');  
      //    return;
      //   }
      // }
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && rowData.isBatchEnabled && !rowData.isSerialEnabled && rowData.batchSelectedList.length === 0) {
        this.openSnackBar('Please Select  Batch Number at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && this.batchEnabled && this.checkLPNQuantity(i, "batch") === '0') {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Selected Batch List\'s available quantity is not sufficient at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }

      if ((this.screenType === 'ASM' || this.isAssemblyItem) && rowData.isBatchEnabled && !rowData.isSerialEnabled) {
        finalBatchList = finalBatchList.concat(rowData.batchSelectedList);
        const valB = new Set(finalBatchList).size !== finalBatchList.length;
        if (valB) {
          this.selectedLPNRowIndex = i;
          this.openSnackBar('Duplicate Batch found at Row- ' + (i + 1), '', 'error-snackbar');
          return;
        }
      }
      if (rowData.isSerialEnabled && (this.screenType === 'ASM' || this.isAssemblyItem)) {
        finalSerialList = finalSerialList.concat(rowData.serialSelectedList);
        const valS = new Set(finalSerialList).size !== finalSerialList.length;
        if (valS) {
          this.selectedLPNRowIndex = i;
          this.openSnackBar('Duplicate Serial found at Row- ' + (i + 1), '', 'error-snackbar');
          return;
        }
      }
      if ((rowData.isSerialEnabled && this.screenType === 'DIS' && !this.isAssemblyItem) && (rowData.componentLineQty && rowData.serialNumSelectedListG.length !== Number(rowData.componentLineQty))) {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Selected Serial numbers should be equal to quantity  at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      if ((this.screenType === 'ASM' || this.isAssemblyItem) && rowData.isSerialEnabled && (rowData.componentLineQty && rowData.serialSelectedList.length !== Number(rowData.componentLineQty))) {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Selected Serial numbers should be equal to quantity  at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }
      // if(this.screenType === 'ASM' && rowData.isSerialEnabled && (rowData.componentLineQty  && rowData.serialSelectedList.length !== Number(rowData.componentLineQty)) ) {
      //   this.selectedLPNRowIndex = i;
      //   this.openSnackBar('Select Serial Number equal to Quantity  at Row- '+(i+1), '','default-snackbar');  
      //   return;
      // }
      if (totalLinesQty > this.currentOpenQty) {
        this.selectedLPNRowIndex = i;
        this.openSnackBar('Total Quantity should be equal to or less than Open Quantity  at Row- ' + (i + 1), '', 'error-snackbar');
        return;
      }

    }
  }
    if (totalLinesQty === 0 || this.woLineQuantityCheck(this.currentLineIndex, null, totalLinesQty) === '0') {
      this.openSnackBar('Total Quantity should be in multiples of PerAssembly Quantity', '', 'error-snackbar');
      return;
    }
    if (this.screenType === 'ASM') {
      for (const [i, rowData] of this.parameterDataLBS.entries()) {
        if(rowData.addNewRecord){
        this.lpnList = this.lpnList.concat(rowData.lpnNumSelectedList);
        this.batchList = this.batchList.concat(rowData.batchNumSelectedList);
        this.serialList = this.serialList.concat(rowData.serialNumSelectedList);
        this.finalLg = this.finalLg.concat(rowData.lgId).concat('|');
        this.finalLoc = this.finalLoc.concat(rowData.locId).concat('|');
        this.totalQty = totalLinesQty;
        let lpnObj: any = this.addLpnDetailsAtRow(this.currentLineIndex, i);
        lpnDetails.push(lpnObj);
        }
      }
      this.parameterData1[this.currentLineIndex].lpnDetails = lpnDetails;
      this.transactWoLine(this.parameterData1[this.currentLineIndex]);    ;
    }

    if (this.screenType === 'DIS' && !this.parameterData1[this.currentLineIndex].isAssemblyItem) {
      for (const [i, rowData] of this.parameterDataLBS.entries()) {
        if(rowData.addNewRecord){

        let batchData = { batchDetails: [] };
        let serialdata = { serialDetails: [] };
        this.totalQty = totalLinesQty;

        if (this.batchEnabled && this.serialEnabled) {
          this.parameterDataLBS[i].serialNumSelectedListG.forEach(selement => {
            serialdata.serialDetails.push({ "serialNumber": selement });
          });
          batchData.batchDetails.push({ batchNumber: rowData.batchNumber,
                                        batchId:rowData.batchId,
                                        batchOriginationDate:rowData.batchMFGDate,
                                        batchExpirationDate:rowData.batchEXPDate,
                                        serialDetails: serialdata.serialDetails });

        } else if (this.batchEnabled && !this.serialEnabled) {
          batchData.batchDetails.push({ batchNumber: rowData.batchNumber,
                                        batchId:rowData.batchId,
                                        batchOriginationDate:rowData.batchMFGDate,
                                        batchExpirationDate:rowData.batchEXPDate, });
        } else if (this.serialEnabled && !this.batchEnabled) {
          this.parameterDataLBS[i].serialNumSelectedListG.forEach(selement => {
            serialdata.serialDetails.push({ "serialNumber": selement });
          });
        }
        let finalObj = {
          "lpnId": this.dropLpnId,
          "dropLpnId": rowData.lpnId,
          "batchDetails": batchData.batchDetails,
          "serialDetails": serialdata.serialDetails,
          "lgId": this.destinationLgId,
          "locId": this.destinationLocatorId,
          "lineQty": Number(rowData.componentLineQty),
          "woId": this.woId,
          "iuId": this.iuId,
          "sourceType": "WO",
          "destinationTypeCode": "MANIFACTURING",
          "uomCode": this.parameterData1[this.currentLineIndex].woCmpUom,
        };
        
        lpnDetails.push(finalObj);
      }
    }
      this.parameterData1[this.currentLineIndex].lpnDetails = lpnDetails;
      this.transactWoLine(this.parameterData1[this.currentLineIndex]);
    }

    if (this.parameterData1[this.currentLineIndex].isAssemblyItem) {
      this.parameterData1[this.currentLineIndex].lpnDetailsSelected = 'Y';
      totalLinesQty = 0;
      for (const [i, rowData] of this.parameterDataLBS.entries()) {
        if(rowData.addNewRecord)
        { 
        totalLinesQty += Number(rowData.componentLineQty);
        if (rowData.componentLineQty <= 0) {
          this.openSnackBar('Assembly Item Quantity should be more than 0 ', '', 'error-snackbar');
          return;
        }
        this.totalQty = totalLinesQty;
        lpnDetails.push(this.addLpnDetailsAtRow(this.currentLineIndex, i));
      }
    }
      this.parameterData1[this.currentLineIndex].lpnDetails = lpnDetails;       
      this.transactWoLine(this.parameterData1[this.currentLineIndex]);
    }
  }
  transactWoLine(dataElement) {
    this.dialog.closeAll();
    let obj = null;
    this.saveInprogress = true;
    this.parameterData1[this.currentLineIndex].lpnDetailsSelected = 'Y';
    const body = [];
    //Component Item transact payload
    if (!dataElement.isAssemblyItem) {
      if (this.screenType === 'ASM') {
        obj = {
          woId: this.woId,
          woLineId: Number(dataElement.woLineId),
          woCmpItemId: Number(dataElement.woCmpItemId),
          woCmpQty: Number(dataElement.woCmpQty),
          transactionType: this.workOrderType,
          woCmpConsumedQty: Number(dataElement.woCmpConsumedQty),
          perAssmebly: Number(dataElement.perAssmebly),
          lpnDetails: dataElement.lpnDetails,
          batchEnabled: dataElement.batchEnabled,
          serialEnabled: dataElement.serialEnabled,
          availableToCompleteQty: null,
          destinationLgId: this.destinationLgId,
          destinationLocatorId: this.destinationLocatorId,
          updatedBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId)
        }
      }
      if (this.screenType === 'DIS') {
        obj = {
          woId: this.woId,
          woLineId: Number(dataElement.woLineId),
          woCmpItemId: Number(dataElement.woCmpItemId),
          woCmpQty: Number(dataElement.woCmpQty),
          transactionType: this.workOrderType,
          woCmpConsumedQty: Number(dataElement.woCmpConsumedQty),
          perAssmebly: Number(dataElement.perAssmebly),
          lpnDetails: dataElement.lpnDetails,
          batchEnabled: dataElement.batchEnabled,
          serialEnabled: dataElement.serialEnabled,
          availableToCompleteQty: null,

          sourceLgId: this.destinationLgId,
          sourceLocId: this.destinationLocatorId,
          destinationLgId: null,
          destinationLocatorId: null,

          updatedBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId)
        }
      }
    } else { /// for assembly item transact

      if (this.screenType === 'DIS' && !this.isManual) {

        obj = {
          woId: this.woId,
          woLineId: null,
          woCmpItemId: Number(dataElement.woCmpItemId),
          woCmpQty: Number(dataElement.woCmpQty),
          transactionType: this.workOrderType,
          woCmpConsumedQty: Number(dataElement.woCmpConsumedQty),
          perAssmebly: null,
          lpnDetails: dataElement.lpnDetails,
          batchEnabled: dataElement.batchEnabled,
          serialEnabled: dataElement.serialEnabled,
          availableToCompleteQty: null,
          destinationLgId: dataElement.destinationLgId,
          sourceLgId: dataElement.sourceLg,
          destinationLocatorId: dataElement.destinationLocatorId,
          sourceLocId: dataElement.sourceLocatorId,
          updatedBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId)
        }
      } else if (this.screenType === 'DIS' && this.isManual) {
        obj = {
          woId: this.woId,
          woLineId: null,
          woCmpItemId: Number(dataElement.woCmpItemId),
          woCmpQty: Number(dataElement.woCmpQty),
          transactionType: this.workOrderType,
          woCmpConsumedQty: Number(dataElement.woCmpConsumedQty),
          perAssmebly: null,
          lpnDetails: dataElement.lpnDetails,
          batchEnabled: dataElement.batchEnabled,
          serialEnabled: dataElement.serialEnabled,
          availableToCompleteQty: null,
          destinationLgId: dataElement.destinationLgId,
          sourceLgId: dataElement.sourceLg,
          destinationLocatorId: dataElement.destinationLocatorId,
          sourceLocId: dataElement.sourceLocatorId,
          updatedBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId)
        }
      }
    }
    body.push(obj);
    const transactObj = { transaction: body };
    this.woService.transactWoIsue(transactObj).subscribe(
      result => {
        if (result.status === 200) {
          this.saveInprogress = false;
          this.workOrderRefreshOnTransact = true;
          if (result.AvailableToCompleteQty) {         
            if (this.screenType === 'ASM') {
              this.dropLpnId = result.DropLpnId;
              this.openSnackBar(result.message, '', 'success-snackbar');
              this.getWOList(this.iuId, this.woNumber, 'DIS');  
            }
          }
          if (this.screenType === 'DIS' && dataElement.isAssemblyItem) {
            this.openSnackBar(result.message, '', 'success-snackbar');
            this.getWOList(this.iuId, this.woNumber, 'DIS');
          } else if (this.screenType === 'DIS' && !dataElement.isAssemblyItem) {
            this.message33 = result.SubInventoryMsg;
            this.openDialog2('Success', result.message);
            this.getWOList(this.iuId, this.woNumber, 'DIS');
          }                
        } else {
          this.openSnackBar(result.message, '', 'error-snackbar');
          this.saveInprogress = false;
        }
      },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
        this.saveInprogress = false;
      }
    );
  }
  //this is used to validate both batch and lpn qunatity
  checkLPNQuantity(lpnIndex, from?: string) {
    let currentlpnobj = null;
    let currentBatchobj = null;
    let lpnAvlQty = 0;
    let batchAvlQty = 0;
    let sufficientBatchList=[];     
    let isSufficient = false;
    //batch quantity validation
    if (from && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0) {
      this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(element => {
        currentBatchobj = this.parameterDataLBS[lpnIndex].batchList.find(d => d.onhandBatchId === element);
        batchAvlQty = Number(batchAvlQty) + Number(currentBatchobj.primarySum);        
        if (batchAvlQty < Number(this.parameterDataLBS[lpnIndex].componentLineQty)) {
          sufficientBatchList.push(currentBatchobj.onhandBatchId);                     
        }else if(!isSufficient){
          sufficientBatchList.push(currentBatchobj.onhandBatchId);          
          isSufficient = true;           
        }               
      });
      this.parameterDataLBS[lpnIndex].batchSelectedList = sufficientBatchList;      
      if (this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0 && batchAvlQty < Number(this.parameterDataLBS[lpnIndex].componentLineQty)) {
        return '0';
      }
    } else {
      this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(element => {
        currentlpnobj = this.parameterDataLBS[lpnIndex].lpnList.find(d => d.onhandLpnId === element);
        lpnAvlQty = Number(lpnAvlQty) + Number(currentlpnobj.lpnAvlQty);
        // i++;
        // if(lpnAvlQty > Number(this.parameterDataLBS[lpnIndex].componentLineQty) ){
        //    return 'more,'+i;
        // }
      });

      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && lpnAvlQty < Number(this.parameterDataLBS[lpnIndex].componentLineQty)) {
        return '0';
      }
    }
    return '1';
  }

  addLpnDetailsAtRow(currentLineIndex: any, lpnIndex) {
    let lpnData = { lpnListDetails: [] };
    let batchData = { batchDetails: [] };
    let serialdata = { serialDetails: [] };
    this.parameterData1[currentLineIndex].lpnDetails = [];
    if (this.batchEnabled && this.serialEnabled) {
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(element => {
          batchData.batchDetails = [];
          this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(belement => {
            serialdata.serialDetails = [];
            this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(selement => {
              serialdata.serialDetails.push({ "serialId": selement });
            });
            batchData.batchDetails.push({ "batchId": belement, "serialDetails": serialdata.serialDetails });
          });
          lpnData.lpnListDetails.push({ "lpnId": element, "batchDetails": batchData.batchDetails });
        });        
      }
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(belement => {
          serialdata.serialDetails = [];
          this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(selement => {
            serialdata.serialDetails.push({ "serialId": selement });
          });
          batchData.batchDetails.push({ "batchId": belement, "serialDetails": serialdata.serialDetails });
        });
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": batchData.batchDetails });
      }
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        serialdata.serialDetails = [];
        this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(selement => {
          serialdata.serialDetails.push({ "serialId": selement });
        });
        batchData.batchDetails.push({ "batchId": null, "serialDetails": serialdata.serialDetails });
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": batchData.batchDetails });
      }
      if(this.parameterDataLBS[lpnIndex].lpnSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length === 0) {
        this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(belement => {
          batchData.batchDetails.push({ "batchId": belement, "serialDetails": [] });
        });
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": batchData.batchDetails });
      }
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length === 0) {
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(element => {
          batchData.batchDetails = [];
          this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(belement => {

            batchData.batchDetails.push({ "batchId": belement, "serialDetails": [] });
          });
          lpnData.lpnListDetails.push({ "lpnId": element, "batchDetails": batchData.batchDetails });
        });
      }
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(element => {
          serialdata.serialDetails = [];
          this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(selement => {
            serialdata.serialDetails.push({ "serialId": selement });
          });
          batchData.batchDetails.push({ "batchId": null, "serialDetails": serialdata.serialDetails });
          lpnData.lpnListDetails.push({ "lpnId": element, "batchDetails": batchData.batchDetails });
        });
      }
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length === 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length === 0) {
        serialdata.serialDetails.push({ "serialId": null });
        batchData.batchDetails.push({ "batchId": null, "serialDetails": serialdata.serialDetails });
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": batchData.batchDetails });
      }
    }
    if (this.batchEnabled && !this.serialEnabled) {
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0) {
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(elementl => {
          batchData.batchDetails = [];
          this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(element => {
            batchData.batchDetails.push({ "batchId": element });
          });          
          lpnData.lpnListDetails.push({ lpnId: elementl, batchDetails: batchData.batchDetails, "serialDetails": [] });
        });        
      } else if (this.parameterDataLBS[lpnIndex].batchSelectedList.length !== 0) {
        batchData.batchDetails = [];
        this.parameterDataLBS[lpnIndex].batchSelectedList.forEach(element => {
          batchData.batchDetails.push({ "batchId": element });
        });
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": batchData.batchDetails });
      } else {
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": [], "serialDetails": [] });
      }
    }
    if (!this.batchEnabled && this.serialEnabled) {
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0 && this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(elementl => {
          serialdata.serialDetails = [];
          this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(element => {
            serialdata.serialDetails.push({ "serialId": element });
          });
          lpnData.lpnListDetails.push({ "lpnId": elementl, "serialDetails": serialdata.serialDetails });
        });
       
      } else if (this.parameterDataLBS[lpnIndex].serialSelectedList.length !== 0) {
        serialdata.serialDetails = [];
        this.parameterDataLBS[lpnIndex].serialSelectedList.forEach(element => {
          serialdata.serialDetails.push({ "serialId": element });
        });
        lpnData.lpnListDetails.push({ "lpnId": null, "serialDetails": serialdata.serialDetails });
      } else {
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": [], "serialDetails": [] });
      }
    }
    if (!this.batchEnabled && !this.serialEnabled) {
      if (this.parameterDataLBS[lpnIndex].lpnSelectedList.length !== 0) {
        let lpnonlydetails = [];
        this.parameterDataLBS[lpnIndex].lpnSelectedList.forEach(element => {
          lpnData.lpnListDetails.push({ "lpnId": element, "batchDetails": [], "serialDetails": [] });
        });
        // lpnData.lpnListDetails.push({ lpnonlydetails ,"batchDetails": null, "serialDetails":null});
      } else {
        lpnData.lpnListDetails.push({ "lpnId": null, "batchDetails": [], "serialDetails": [] });
      }
    }
    const lpnObj = lpnData.lpnListDetails[0];
    let lpnId = null;
    let batchDetails = [];
    let serialDetails = [];
    let finalObj;
    if (lpnObj) {
      lpnId = lpnObj.lpnId;
      batchDetails = lpnObj.batchDetails;
      serialDetails = lpnObj.serialDetails;
    } else {
      // this.openSnackBar('Please Select LPN Details of the Item', '','default-snackbar');  

    }
    finalObj = {
      lpnId, batchDetails, serialDetails,
      "lgId": this.parameterDataLBS[lpnIndex].lgId,
      "locId": this.parameterDataLBS[lpnIndex].locId,
      "lineQty": Number(this.parameterDataLBS[lpnIndex].componentLineQty),
      "woId": this.woId,
      "iuId": this.iuId,
      "sourceType": "WO",
      "destinationTypeCode": "MANIFACTURING",
      "uomCode": this.parameterData1[this.currentLineIndex].woCmpUom,
    };

    if (this.isAssemblyItem) {
      finalObj = {
        lpnId, batchDetails, serialDetails,
        "lgId": this.sourceLgId,
        "locId": this.sourceLocId,
        "lineQty": Number(this.parameterDataLBS[lpnIndex].componentLineQty),
        "woId": this.woId,
        "iuId": this.iuId,
        "sourceType": "WO",
        "destinationTypeCode": "MANIFACTURING",
        "uomCode": this.parameterData1[this.currentLineIndex].woCmpUom,
      };
    }
    return finalObj;
  }
  applyFilterforItem(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parameterDataSourceBatch.filter = filterValue.trim().toLowerCase();
  }

  addLBSRow(dataElement?: any, lpnDetails?: string, from?: string) {
    this.selectedLPNRowIndex = null;
    let lpnarrlength = 0;
    this.isADDLBS = true;
    this.isEditLBS = false;
    let totalLinesQty = 0;
    let lgCode = '';
    let locCode = '';
    let lgId = null;
    let locId = null;
    let lpnObj = { lpnId: null, lpnNum: '' };
    let index = this.currentLineIndex;
    let currentIndex = 0;
    let oldTransactionLBSData = [];
    let prevLBSData = [];
    let sourceLgLpnControlledFlag = 'Y';

    for (const [i, rowData] of this.parameterDataLBS.entries()) {
      if(rowData.addNewRecord){
      totalLinesQty += Number(rowData.componentLineQty);
      if(this.screenType === 'ASM' && rowData.lgLpnControlledFlag && !this.isManual){
      sourceLgLpnControlledFlag = rowData.lgLpnControlledFlag;
      }
      if (totalLinesQty >= this.currentOpenQty) {
        if (from) {
          this.openSnackBar('Open Quantity  is already allocated', '', 'error-snackbar');
        }
        return;
      }
      prevLBSData.push(rowData);
      currentIndex++;
    }else{
      oldTransactionLBSData.push(rowData);
    }     
    }
    this.parameterDataLBS = prevLBSData;
    if (this.parameterData1[index].isAssemblyItem || lpnDetails === 'assemblyItem') {
      //dataElement = this.parameterDekitTaskArray[0];
      this.isAssemblyItem = true;
      dataElement = this.parameterData1[index];
      if(dataElement.alctnAllocatedQty === 0){
        this.isAsseblyItemManual = true;
      }else{
        this.isAsseblyItemManual = false;
      }
      lpnarrlength = this.parameterDataLBS.push(
        {
          lbsid: currentIndex + 1,
          lpnId: null,
          lpnNum: null,
          lgLpnControlledFlag: this.lgLpnControlledFlag,
          tLpnNum: null,
          lgId: dataElement.destinationLgId,
          lgCode: dataElement.destLgCode,
          woLineStatus: dataElement.woStatus,
          lgList: this.destinatinAssItemLGList,
          locId: dataElement.destinationLocatorId,
          locCode: dataElement.destLocCode,
          locList: this.destinatinAssItemLocactorList,
          locReservedQty: dataElement.alctnAllocatedQty,
          locUnresQty: this.onhandQty ? this.onhandQty : null,
          componentLineQty: this.currentOpenQty-totalLinesQty,
          itemId: this.parameterData1[index].woCmpItemId,
          itemName: this.parameterData1[index].woCmpItemName,
          itemRevId: this.parameterData1[index].woCmpItemRevisionId,
          iuId: this.iuId,
          batchNumber: null,
          batchId: dataElement.batchDetails ? dataElement.batchDetails[0].batchId : null,
          serialId: dataElement.serialDetails ? dataElement.serialDetails[0].serialId : null,
          serialNumber: null,
          editing: false,
          action: '',
          addNewRecord: true,
          lpnList: [],
          batchList: [],
          serialList: [],
          lpnSelectedList: [],
          lpnNumSelectedList: [],
          batchSelectedList: [],
          batchNumSelectedList: [],
          serialSelectedList: [],
          serialNumSelectedList: [],
          serialNumSelectedListG: [],
          originalData: null,
          processFlag: true,
          showLocLov: 'hide',
          inlineLocSearchLoader: 'hide',
          locSearchValue: '',
          showLpnLov: 'hide',
          inlineLpnSearchLoader: 'hide',
          lpnSearchValue: '',
          showBatLov: 'hide',
          inlineBatSearchLoader: 'hide',
          batSearchValue: '',
          showSerLov: 'hide',
          inlineSerSearchLoader: 'hide',
          serSearchValue: '',
          isBatchEnabled: this.batchEnabled,
          isSerialEnabled: this.serialEnabled,
          lpnval: "",
          batchval: "",
          serialval: ""
        });
      this.parameterDataSourceLBS = new MatTableDataSource<any>(this.parameterDataLBS);
      let lpnIndex = lpnarrlength - 1;       

      setTimeout(() => {
        if (this.lgLpnControlledFlag === 'Y') {
          this.getLPNList(this.parameterDataLBS[lpnIndex], lpnIndex);
        }else{
          if (this.batchEnabled) {
            this.getBatchList(lpnIndex);
          }
          else if (!this.batchEnabled && this.serialEnabled) {
            this.getSerialList(this.parameterDataLBS[lpnIndex],lpnIndex,null,'direct');
          }
        }
      }, 100);
    }
   
    if (!lpnDetails && !this.isAssemblyItem) {
      //this.isAssemblyItem = false;
      
      if (dataElement && this.screenType === 'ASM') {
        locCode = dataElement.sourceLocatorCode;
        lgCode = dataElement.sourceLgCode;
        lgId = dataElement.sourceLgId;
        locId = dataElement.sourceLocatorId;
        sourceLgLpnControlledFlag = dataElement.sourceLgLpnControlledFlag;
        this.parameterData1[index].sourceLg = lgId;
        this.parameterData1[index].sourceLocatorId = locId;
        this.parameterData1[index].sourceLgCode = lgCode;
        this.parameterData1[index].sourceLocatorCode = locCode;
      } else if (this.screenType === 'ASM') {
        lgId = this.parameterData1[index].sourceLg;
        locId = this.parameterData1[index].sourceLocatorId;
        lgCode = this.parameterData1[index].sourceLgCode;
        locCode = this.parameterData1[index].sourceLocatorCode;
      }
      if (dataElement && this.screenType === 'DIS') {
        lgId = dataElement.destinationLgId;
        locId = dataElement.destinationLocatorId;
        lgCode = dataElement.destinationLgCode;
        locCode = dataElement.destLocatorCode;

        this.parameterData1[index].destinationLgId = lgId;
        this.parameterData1[index].destinationLocatorId = locId;
        this.parameterData1[index].destLgCode = lgCode;
        this.parameterData1[index].destLocCode = locCode;
      } else if (this.screenType === 'DIS') {
        lgId = this.parameterData1[index].destinationLgId;
        locId = this.parameterData1[index].destinationLocatorId;
        lgCode = this.parameterData1[index].destLgCode;
        locCode = this.parameterData1[index].destLocCode;
      }

      lpnarrlength = this.parameterDataLBS.push(
        {
          lbsid: currentIndex + 1,
          lpnId: lpnObj.lpnId,
          lpnNum: lpnObj.lpnNum,
          lgLpnControlledFlag: sourceLgLpnControlledFlag,
          tLpnNum: null,
          lgId: lgId,
          lgCode: lgCode,
          woLineStatus: this.parameterData1[index].woLineStatus,
          lgList: [],
          locId: locId,
          locCode: locCode,
          locList: [],
          locReservedQty: this.parameterData1[index].alctnAllocatedQty,
          locUnresQty: null,
          componentLineQty: this.currentOpenQty-totalLinesQty,
          itemId: this.parameterData1[index].woCmpItemId,
          itemName: this.parameterData1[index].woCmpItemName,
          itemRevId: this.parameterData1[index].woCmpItemRevisionId,
          iuId: this.parameterData1[index].woLineIuId,
          batchNumber: '',
          batchId: null,
          serialId: null,
          serialNumber: null,
          editing: true,
          action: '',
          addNewRecord: true,
          lpnList: [],
          batchList: [],
          serialList: [],
          lpnSelectedList: [],
          lpnNumSelectedList: [],
          batchSelectedList: [],
          batchNumSelectedList: [],
          serialSelectedList: [],
          serialNumSelectedList: [],
          serialNumSelectedListG: [],
          originalData: null,
          processFlag: null,
          showLocLov: 'hide',
          inlineLocSearchLoader: 'hide',
          locSearchValue: '',
          showLpnLov: 'hide',
          inlineLpnSearchLoader: 'hide',
          lpnSearchValue: '',
          showBatLov: 'hide',
          inlineBatSearchLoader: 'hide',
          batSearchValue: '',
          showSerLov: 'hide',
          inlineSerSearchLoader: 'hide',
          serSearchValue: '',
          isBatchEnabled: this.batchEnabled,
          isSerialEnabled: this.serialEnabled,
          lpnval: "",
          batchval: "",
          serialval: ""
        });
      this.parameterDataSourceLBS = new MatTableDataSource<any>(this.parameterDataLBS);
      let lpnIndex = lpnarrlength - 1;
      setTimeout(() => {
        if ((dataElement && this.screenType === 'ASM') || (lgId && locId && this.screenType === 'ASM')) {
          this.getLPNList(this.parameterDataLBS[lpnIndex], lpnIndex);
        } else if (this.screenType === 'ASM') {
          this.getAllLoctorGroupsLov(index, lpnIndex);
        }
        if (this.screenType === 'DIS') {
          this.generateLpn(lpnIndex);
          if (this.batchEnabled) {
            //this.generateBatch(lpnIndex);
          }
          if (this.serialEnabled) {
            this.generateSerial(lpnIndex);
          }
        }
      }, 100);
    }
    if (!from) {
    this.getOldTransactionDetails(this.currentLineIndex);
    }else if(from === 'fromui'){
      for (const [i, rowData] of oldTransactionLBSData.entries()) {
        this.parameterDataLBS.push(rowData);
      }
    }
  }
   
  deleteRow(rowData: any, rowIndex: number) {    
    this.selectedLPNRowIndex = null;
    this.parameterDataLBS.splice(rowIndex, 1);
    this.parameterDataSourceLBS = new MatTableDataSource<ParameterDataElementLBS>(this.parameterDataLBS);
    this.checkIsAddRow();
  }

  checkIsAddRow() {
    let cnt = 0;
    const pLength = this.parameterDataLBS.length;
    for (const pdata of this.parameterDataLBS) {
      if (pdata.addNewRecord === true) {
        return;
      } else {
        cnt++;
      }
    }
    if (cnt === pLength) {
      this.isADDLBS = false;
    }
  } 
  checkDuplicateLPNRow() {
    let finallpnList = [];
    for (const [i, rowData] of this.parameterDataLBS.entries()) {
      finallpnList = finallpnList.concat(rowData.lpnSelectedList);
    };
    const val = new Set(finallpnList).size !== finallpnList.length;
    return val;
  }
  checkIfDuplicateExists(w) {
    return new Set(w).size !== w.length;
  }
  getUniqueList(w: any) {
    return new Set<any>(w);
  }
  getDestinationLgList() {
      this.woService.getDetailsByIuId(Number(this.iuId), this.screenType).subscribe((result: any) => {
          if (result.status === 200) {
            if (result.result && result.result.length) {
              const data = result.result;
              this.destinationLgList = [];
              for (let i = 0; i < data.length; i++) {
                this.destinationLgList.push({
                  value: data[i].lgId,
                  label: data[i].lgCode
                })
              }
              if (!this.destinationLgId) {
                this.lgDestinationSelectionChanged({ source: { selected: true, isUserInput: true } }, this.destinationLgList[0]);
              } else {
                let currentobj = this.destinationLgList.find(d => d.value === this.destinationLgId);
                if (currentobj) {
                  this.lgDestinationSelectionChanged({ source: { selected: true, isUserInput: true } }, currentobj);
                }
              }
            }
          }
      });
  }

  getSourceLgList() {    
    const data = { onhandIuId: Number(this.iuId), onhandItemId: this.woAssemblyItemId, lgCode: '', screen: "INVENTORY_LG_LIST" };
    this.woIssueService.getLgOrLocList(data).subscribe((result: any) => {
      if (result.status === 200) {
        if (result.result && result.result.length) {
          const data = result.result;
          this.sourceLgList = [];
          for (let i = 0; i < data.length; i++) {
            this.sourceLgList.push({
              value: data[i].onhandLgId,
              label: data[i].lgCode,
              lgLpnControlledFlag: data[i].lgLpnControlledFlag,
            });
          }
          if (this.sourceLgList.length !== 0) {
            this.sourceLgList.sort((a, b) =>
              (a.label > b.label ? 1 : -1));
          }
          if (!this.sourceLgId) {
            // this.lgSourceSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLgList[0]); 
            this.sourceLgId = this.sourceLgList[0].value;
            if (this.isManual) {
              this.parameterData1[this.assemblyItemIndex].sourceLg = this.sourceLgId;
              this.lgLpnControlledFlag = this.sourceLgList[0].lgLpnControlledFlag;
            }
          }else{
            
            let curObj = this.sourceLgList.find(ele => ele.value === this.sourceLgId);
              if(curObj){
                this.sourceLgId = this.sourceLgId;
                this.lgLpnControlledFlag = curObj.lgLpnControlledFlag;
              }
              //this.openSnackBar( 'this.lgLpnControlledFlag'+this.lgLpnControlledFlag + ' for this Item', '', 'error-snackbar');
            }
        } else if (result.message) {
          this.openSnackBar(result.message + ' for this Item', '', 'error-snackbar');
          this.sourceLgId = this.sourceLgList[0].value;
          if (this.isManual) {
            this.parameterData1[this.assemblyItemIndex].sourceLg = this.sourceLgId;
          }
        } else {
          this.openSnackBar('Empty LG List', '', 'error-snackbar');
          this.sourceLgId = null;
          if (this.isManual) {
            this.parameterData1[this.assemblyItemIndex].sourceLg = this.sourceLgId;
          }
        }
      }
    });
  }
  getSourceLovForLocator() {
   
    let tempStockLocatorList = [];
    this.sourceLocactorList = [];
    const data = { onhandIuId: this.iuId, onhandLgId: this.sourceLgId, onhandItemId: this.woAssemblyItemId, lgCode: "", screen: "Locator_List" };
    this.woService.getLGList(data).subscribe(
      (data: any) => {
        if (data.result && data.result.length > 0) {
          for (const rowData of data.result) {
            if (rowData.unReservedQty > 0) {
              tempStockLocatorList.push({
                label: rowData.locCode,
                value: rowData.locatorId,
                unReservedQty: rowData.unReservedQty,
              });
            }
          }
          if (tempStockLocatorList.length !== 0) {
            tempStockLocatorList.sort((a, b) =>
              (a.unReservedQty > b.unReservedQty ? -1 : 1));
            this.sourceLocactorList = tempStockLocatorList;
            //this.slocatorSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLocactorList[0]); 
            if(this.woIsManual && !this.sourceLocId ){
            this.sourceLocId = this.sourceLocactorList[0].value;
            this.onhandQty = this.sourceLocactorList[0].unReservedQty;
            }else if(this.woIsManual){
             
              let curObj = this.sourceLocactorList.find(ele => ele.value === this.sourceLocId);
              if(curObj){
                this.onhandQty = curObj.unReservedQty;
              }else{
                let curObj = this.sourceLocactorList[0];
                if(curObj){
                  this.onhandQty = curObj.unReservedQty;
                  this.sourceLocId = curObj.value;
                }
              
            }
            }
            if (this.screenType === 'DIS' && this.isManual) {              
              this.parameterData1[this.assemblyItemIndex].sourceLocatorId = this.sourceLocId;
            }
            if (this.screenType === 'ASM' && this.isManual) {
              this.parameterData1[this.currentLineIndex].sourceLocatorId = this.sourceLocId;
            }
          } else {
            this.sourceLocId = null;
            this.sourceLocactorList = [{
              label: 'No Data',
              value: 1,
              unReservedQty: 0,
            }];
            this.sourceLocId = this.sourceLocactorList[0].value;
            this.onhandQty = null;            
          }
        } else {
          this.sourceLocId = null;
          //this.openSnackBar('No locator found', '', 'default-snackbar');
        }
      });

  }
  slocatorSelectionChanged(event: any, ele: any) {
    if (event.source.selected === true ) {
      this.sourceLocId = ele.value;
      this.onhandQty = ele.unReservedQty;
      if (this.isManual) {
        this.parameterData1[this.assemblyItemIndex].sourceLocatorId = this.sourceLocId;
      }
    }
  }
  lgSourceSelectionChanged(event: any, ele: any) {
    if (event.source.selected === true  ) {

      this.sourceLgId = ele.value;
      if (this.isManual) {
        this.parameterData1[this.assemblyItemIndex].sourceLg = this.sourceLgId;
        this.lgLpnControlledFlag = ele.lgLpnControlledFlag;
      }
      this.getSourceLovForLocator();
    }
  }
  getLovForLocator(searchValue) {
    this.woService.getLocatorLov('iu', searchValue, 'wolocator', this.iuId).subscribe((data: any) => {      
      this.stagingLocactorList = [];
      if (data.result && data.result.length) {
        data = data.result;
        this.stagingLocactorList = [];
        for (let i = 0; i < data.length; i++) {
          if (this.destinationLgId && data[i].locLgId === this.destinationLgId) {
            this.stagingLocactorList.push({
              value: data[i].locatorId,
              label: data[i].locCode,
              lgId: data[i].locLgId,
            });
          }
        }
        this.inlineDlocSearchLoader = 'hide';
        this.showDlocLov = 'show';
        this.searchDlocValue = '';
        if (!this.destinationLocatorId && this.stagingLocactorList.length > 0) {
          this.locatorSelectionChanged({ source: { selected: true, isUserInput: true } }, this.stagingLocactorList[0]);
        } else if (this.stagingLocactorList.length > 0) {
          let currentobj = this.stagingLocactorList.find(d => d.value === this.destinationLocatorId);
          if (currentobj) {
            this.locatorSelectionChanged({ source: { selected: true, isUserInput: true } }, currentobj);
          }
        }
      } else {
        this.inlineDlocSearchLoader = 'hide';
        this.searchDlocValue = '';
        this.openSnackBar('No locator found', '', 'error-snackbar');
      }
    },
      (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      })
  }
  fetchNewSearchListForLocator(event: any, index: any, searchFlag: any) {
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode === 9) {
      event.preventDefault();
      charCode = 13;
    }
    if (!searchFlag && charCode !== 13) {
      return;
    }
    if (this.showDlocLov === 'hide') {
      this.inlineDlocSearchLoader = 'show';
      this.getLovForLocator(this.searchDlocValue);

    } else {
      this.showDlocLov = 'hide';
      this.searchDlocValue = '';
    }

  }
  locatorSelectionChanged(event: any, ele: any) {
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      this.destinationLocatorId = ele.value;
      this.destLocCode = ele.label;
      this.destLocatorCode = ele.label;

      //this.parameterData1[this.woCurrentIndex].sourceLgId = ele.value;

    }
  }
  lgDestinationSelectionChanged(event: any, ele: any) {
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      this.destinationLgId = ele.value;
      this.destLgCode = ele.label;
      this.destinationLgCode = ele.label;
      if (this.isManual && this.isDestinationFound === 'N') {
        this.destinationLocatorId = null;
      }
      //
      this.getLovForLocator("");
      //this.getDestinationLOCList(this.destinationLgId);
      //this.parameterData1[this.woCurrentIndex].sourceLocatorId = ele.value;
    }
  }
  generateLpn(index) {
    let data = { iuId: this.parameterData1[this.currentLineIndex].woLineIuId, createdBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId) };
    this.woIssueService.getLpnGenerate(data).subscribe((result: any) => {
      if (result.status === 200) {
        this.parameterDataLBS[index].lpnId = result.LPNId;
        this.parameterDataLBS[index].lpnNum = result.message;
      }
    });
  }
  generateBatch(index?) {
    let data = {};
    if (index === null) {
      this.listProgressBatch = true;
      data = { itemId: this.woAssemblyItemId, iuId: this.iuId, createdBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId) };
    } else {
      data = { itemId: this.parameterData1[this.currentLineIndex].woCmpItemId, iuId: this.parameterData1[this.currentLineIndex].woLineIuId, createdBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId) };
    }
    this.woIssueService.getBatchGenerate(data).subscribe((result: any) => {
      if (result.status === 200) {
        let message = result.message;
        this.newBatchId = null;
        if (result.duplicate_validate_batch === 'Y') {
          message = '';
          if (index !== null) {
            document.getElementById('batnum' + index).focus();
            document.getElementById('batnum' + index).setAttribute('placeholder', "Press Enter to Generate a new Batch");
          }
        }
        if (index === null) {
          this.listProgressBatch = false;
          this.newBatchNumber = message;
          document.getElementById('batnum').focus();
          this.batchNumberPlaceholder = "Press Enter to Generate a new Batch";
        }
        if (index !== null) {
          this.newBatchNumber = message;
          this.parameterDataLBS[index].batchId = null;
          this.parameterDataLBS[index].batchNumber = message;
        }
      }
      this.listProgressBatch = false;
    });
  }
  generateSerial(index) {
    let cmpQty = Number(this.parameterData1[this.currentLineIndex].woCmpQty);
    let cmpLineQty = Number(this.parameterDataLBS[index].componentLineQty);
    this.parameterDataLBS[index].serialNumSelectedListG = [];
    this.parameterDataLBS[index].serialNumSelectedListGG = [];
    this.generateSerialPerCount(index, cmpLineQty);
  }

  generateSerialPerCount(index, cmpLineQty) {
    this.parameterDataLBS[index].serialNumSelectedListG = [];
    this.parameterDataLBS[index].serialNumSelectedListGG = [];
    let cmpQty = Number(this.parameterData1[this.currentLineIndex].woCmpQty);
    let data = { itemId: this.parameterData1[this.currentLineIndex].woCmpItemId, iuId: this.parameterData1[this.currentLineIndex].woLineIuId, serialCount: cmpLineQty, createdBy: Number(JSON.parse(localStorage.getItem('userDetails')).userId) };
    this.woIssueService.getSerialGenerateByCount(data).subscribe((result: any) => {
      if (result.status === 200) {
        let message = result.message;
        let serialCount = result.serialCount;
        let serialArray = result.serialArray;
        this.parameterDataLBS[index].serialId = null;
        // this.parameterDataLBS[index].serialNumSelectedListG = serialArray;
        serialArray.forEach(element => {
          this.parameterDataLBS[index].serialNumSelectedListGG.push(element);
          this.parameterDataLBS[index].serialNumSelectedListG.push(element);
        });
        if (this.parameterDataLBS[index].serialNumSelectedListG.length > 1) {
          this.parameterDataLBS[index].serialNumberG = this.parameterDataLBS[index].serialNumSelectedListG[0] + ' - ' + this.parameterDataLBS[index].serialNumSelectedListG[cmpLineQty - 1];
        } else {
          this.parameterDataLBS[index].serialNumberG = this.parameterDataLBS[index].serialNumSelectedListG[0];
        }

      }
    });
  }
  getAssemDestinationLGList() {
    this.destinatinAssItemLGList = [];
    this.woIssueService
      .getDestLGList()
      .subscribe((data: any) => {
        for (const rowData of data.result) {
          this.destinatinAssItemLGList.push({
            value: rowData.lgId,
            label: rowData.lgCode
          });
        }
        //if (!this.destinationLgId) {
          this.destinationLgId = this.destinatinAssItemLGList[0].value;
          this.destAssmLGSelectionChanged({ source: { selected: true, isUserInput: true } }, this.destinatinAssItemLGList[0], null);
        // } else {
        //   this.destAssmLGSelectionChanged({ source: { selected: true, isUserInput: true } }, this.destinatinAssItemLGList[0], null);
        // }
        this.parameterData1[this.assemblyItemIndex].destinationLgId = this.destinatinAssItemLGList[0].value;         
      });

  }
  destAssmLGSelectionChanged(event: any, ele: any, lpnIndex?) {
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      this.destinationLgId = ele.value;
      this.destLgCode = ele.label;
      this.parameterData1[this.assemblyItemIndex].destinationLgId = ele.value;
      if(lpnIndex){
      this.parameterDataLBS[lpnIndex].lgId = ele.value;
      }
      this.getDestinationLOCList(this.destinationLgId,lpnIndex);
    }
  }
  getDestinationLOCList(lgId,lpnIndex?) {
    this.woIssueService.getDestLOCList(lgId).subscribe(
      (data: any) => {
        if (data.status === 200 && data.result && data.result.length !== 0) {
          const result = data.result;
          this.destinatinAssItemLocactorList = [];
          for (let i = 0; i < result.length; i++) {
            this.destinatinAssItemLocactorList.push({
              value: result[i].locatorId,
              label: result[i].locCode
            })
          }
          this.destinationLocatorId = this.destinatinAssItemLocactorList[0].value;
          this.parameterData1[this.assemblyItemIndex].destinationLocatorId = this.destinatinAssItemLocactorList[0].value;
          if(lpnIndex){
          this.parameterDataLBS[lpnIndex].locId = this.destinatinAssItemLocactorList[0].value;
          }
        }else{
          this.destinatinAssItemLocactorList = [];
          this.destinationLocatorId =null;
          this.parameterData1[this.assemblyItemIndex].destinationLocatorId = null;
          if(lpnIndex){
          this.parameterDataLBS[lpnIndex].locId = null;
          }
        }
      });
  }
  destLocatorSelectionChanged(event: any, ele: any, lpnIndex?) {
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true)) {
      this.destinationLocatorId = ele.value;
      this.destLocCode = ele.label;
      this.parameterData1[this.assemblyItemIndex].destinationLocatorId = ele.value;
      if(lpnIndex){
      this.parameterDataLBS[lpnIndex].locId = ele.value; 
      }      
    }
  }
  // open dialog
  openDialog(dialogType: string, dialogMessage: any, newmessage) {
    this.dialogType = dialogType;
    this.dialogMessage = dialogMessage;
    const dialogRef = this.dialog.open(this.messageDialog, {
      width: '46vw',
    });
    dialogRef.afterClosed().subscribe(result => {     
      this.dialogType = '';
      this.dialogMessage = '';
      this.message2 = "";
      this.message3 = "";
      this.lpnMessage = "";
    });
  }
  openDialog2(dialogType: string, dialogMessage: any) {
    this.dialogType2 = dialogType;
    this.message22 = dialogMessage;
    const dialogRef2 = this.dialog.open(this.messageDialog2, {
      width: '46vw',
    });
    dialogRef2.afterClosed().subscribe(result => {
      this.dialogType2 = '';
      this.message22 = '';
    });
  }  
  close() {
    this.dialog.closeAll();
  }
  openBatchPopup(templateRef: TemplateRef<any>, element: any) {
    this.isBackBtnEnable = false;
    if (element.batchCount === 0) {
      return
    }
    this.listProgressPopup = true;
    this.batchSerialDialogProcess = true;
    const data = {
      txnId: element.txnId,
      batchNumber: null,
      serialNumber:  null
    }
    this.transactionService.getAllBatch(data)
      .subscribe(
        (data: any) => {
          this.listProgressPopup = false;
          this.parameterDataBatch = [];
          if (data.status === 200) {

            if (!data.message) {
              this.isBatch = true;
              this.dialog.open(templateRef, {
                autoFocus: false,
                minWidth: 360
              });
              for (const rowData of data.result) {
                this.parameterDataBatch.push(rowData);
              }
              this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
              setTimeout(() => {
                this.batchSerialDialogProcess = false;
                this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
              }, 100);

            } else {
              this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
              setTimeout(() => {
                this.batchSerialDialogProcess = false;
                this.parameterDataSourceBatch.paginator = this.paginatorBatch;
                this.paginatorBatch.pageSizeOptions = this.commonService.paginationArray;
                this.paginatorBatch.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
              }, 100);
              this.batchTableMessage = data.message;
              this.isBatch = true;
              this.dialog.open(templateRef, {
                autoFocus: false,
                minWidth: 280,
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
  closeBSDialog() {
    this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
    //this.dialog.closeAll();
    let dialogref = this.dialog.openDialogs.pop();
    dialogref.close();
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

    const data = {
      txnId: element.txnId,
      batchNumber: null,
      erialNumber:  null
    }

    this.transactionService.getAllSerial(data)
      .subscribe(
        (data: any) => {
          this.listProgressPopup = false;
          this.parameterDataSerial = [];
          if (data.status === 200) {

            if (!data.message) {
              this.isBatch = false;
              this.dialog.open(templateRef, {
                autoFocus: false,
                minWidth: 260,
          
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
                minWidth: 300,
                minHeight: 220
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
    const data = {
      txnBatchId: element.txnBatchId,
      txnId: element.txnId,
      batchNumber:  null,
      serialNumber: null
    }


    this.transactionService.getAllSerial(data)
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
  backToBatchList() {
    this.isBatch = true;
    this.isBackBtnEnable = false;   
     
  }
  
}


