import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatTable, MatSort } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { WaveService } from 'src/app/_services/transactions/wave.service';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';
import { dataLoader, string } from '@amcharts/amcharts4/core';
import { WorkOrderIssueService } from 'src/app/_services/manufacturing/work-order-issue.service';

export interface ParameterDataElement {
 
  rowSelect: boolean,
  soNumber: string,
  woNumber: string,
  woSubType: string,
  soLineNumber: number,
  itemName: string,
  revsnNumber: any,
  soShipmentNumber: string,
  waveQuantity: number,
  waveQuantityUomCode: string,
  waveLineStatusName: string,
  waveId: number,
  waveLineId: number,
  allocatedQty: number,
  action: string,
  createdBy?: number;
  updatedBy?: number;
  waveStatusCode: string;
  isChecked : boolean;
  woAssmItemId? : number;
  taskNumber?: number;
}
@Component({
  selector: 'app-edit-waveplan',
  templateUrl: './edit-waveplan.component.html',
  styleUrls: ['./edit-waveplan.component.css']
})
export class EditWaveplanComponent implements OnInit, AfterViewInit {
  flexval:number = 15;
  flexvalforpolicy = 20;
  flexvalforAssembly = 20;
  iuCodeList: any[] = [];
  waveStatusList: any[] = [];
  WaveCriteriaForm: FormGroup;
  isEdit = false;
  waveId: number;
  waveIuId: number;
  woAssmItemId: number;
  itemName: string = '';
  tooltipPosition: TooltipPosition[] = ['below'];
  wavePolicyList = [];
  pickSlipList = [];
  parameterData: ParameterDataElement[] = [];
  isChecked = false;
  selectAllRow = false;
  inlineSearchLoader = 'hide';
  showLov = 'hide';
  stagingLocactorList: any = [];
  saveInprogress = false;
  woSubType = '';
  waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  waveLineDisplayedColumns: string[] = [
    // 'rowSelect',
    // 'No',
    'woNumber',
    'woSubType',
    'woLineNumber',
    'itemName',
    'revsnNumber',
    'allocatedQty',
    'waveQuantity',
    'waveQuantityUomCode',
    'taskNumber',
    'waveLineStatusName',
    'action'
  ];
  columns: any = [
   // { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
    // { field: 'No', name: '#', width: 75, baseWidth: 5 },   
    { field: 'woNumber', name: 'Work Order', width: 75, baseWidth: 12 },
    { field: 'woSubType', name: 'WO Type', width: 75, baseWidth: 9 },
    { field: 'woLineNumber', name: 'WO Line', width: 75, baseWidth: 8 },
    { field: 'itemName', name: 'Item', width: 75, baseWidth: 14},
    { field: 'revsnNumber', name: 'Item Rev', width: 75, baseWidth: 10 },
    { field: 'allocatedQty', name: 'Allocated Qty', width: 75, baseWidth: 11 },
    { field: 'waveQuantity', name: 'Qty', width: 75, baseWidth: 8 },
    { field: 'waveQuantityUomCode', name: 'UOM', width: 75, baseWidth: 7 },
    { field: 'taskNumber', name: 'Task #', width: 75, baseWidth: 8 },
    { field: 'waveLineStatusName', name: 'Status', width: 75, baseWidth: 8 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
  ]
  sourceLgList: any[];
  sourceLgId: any;
  sourceLgCode: any;
  sourceLocatorId: any;
  sourceLocCode: any;
  sourceLocactorList: any[];
  waveQuantity: any;
  policyId: any;

  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public woService: WorkOrderService,
    public woIssueService: WorkOrderIssueService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getInventoryUnitLOV();
   
    this.waveForm(null);
    this.getLookUpLOV('WAVE_HEADER_STATUS');
    this.getLookUpLOV('PICK_SLIP_GENERATE_WO');
    this.route.params.subscribe(params => {
      if (params.id) {
        this.isEdit = true;
        this.waveId = params.id;
        this.parameterData = [];
        this.woService
          .getWaveById(params.id)
          .subscribe((data: any) => {
            this.waveIuId = data.result.waveIuId;
            this.itemName = data.result.assembleitem;
            this.woAssmItemId = data.result.woAssmItemId;
            data.result.waveCreateShipment = data.result.waveCreateShipment === 'Y' ? true : false;
            data.result.pullReplenishmentFlag = data.result.pullReplenishmentFlag === 'Y' ? true : false;
            data.result.defaultDropLpn = data.result.defaultDropLpn === 'Y' ? true : false;
            data.result.wavePolicy =  data.result.wavePolicyId;
            if(!data.result.wavePolicy){
              this.WaveCriteriaForm.patchValue({ wavepolicyval : 'NONE' }); 
            }
            this.policyId = data.result.wavePolicyId;
            data.result.wavePickSlipGroup  = data.result.wavePickSlipGroup;
            data.result.searchValue = data.result.waveStagingLocatorCode;
            data.result.iuId = data.result.waveIuId;
            data.result.waveStatusCode = data.result.waveStatusCode;
            if( data.result.waveStatusCode === 'RLSD' ||  data.result.waveStatusCode === 'PARTIAL'){
              this.isChecked = true;
            } else{
              this.isChecked = false;
            }
            this.showLov = 'hide';            
            this.getWaveLineData(data.result.waveLines, data.result).then((val) => {
              if(this.woSubType  === 'DIS'){
                this.flexval = 10;
                this.flexvalforpolicy = 20;
                this.flexvalforAssembly = 12;
              this.waveForm(this.woSubType);
              this.getSourceLgList();
              }else{
                this.getLovForLocator('',null,null);
              }
              this.WaveCriteriaForm.patchValue( data.result);
              this.WaveCriteriaForm.controls["itemName"].setValue(this.itemName); 
            });
                       
          });
          setTimeout(() => {
            this.WaveCriteriaForm.patchValue({ wavePickSlipGroup : this.pickSlipList[0].value }); 
            this.getWavePolicyLOV(this.policyId);                            
          },1000);
      } else { }
    });
    this.commonService.getScreenSize(82);
  }
  checkDefaultDropLpn(event: any, value:any){    
    if (event.source.selected === true && event.isUserInput === true) {      
      if(this.WaveCriteriaForm.value.waveStatusCode === 'PNDNG' && value ==='BULK_PICK_SHIPMENT'){
        this.WaveCriteriaForm.patchValue({ defaultDropLpn : false });
      }
    }
  }
  onPolicyChange(event: any, value:any){    
    if (event.source.selected === true && event.isUserInput === true) {      
      if(value !== -1 ){
        if(this.woSubType === 'DIS'){
          this.clearValidators(this.WaveCriteriaForm,'sourceLgId',null);      
          this.clearValidators(this.WaveCriteriaForm,'sourceLocatorId',null);
          this.WaveCriteriaForm.get("onhandQty").setValue('');        
          this.WaveCriteriaForm.get("availableQty").setValue('');        
        }
        //this.WaveCriteriaForm.patchValue({ wavePolicy : -1 });
      }else{
        if(this.woSubType === 'DIS'){
          if(this.sourceLgList){        
            this.addValidators(this.WaveCriteriaForm,'sourceLgId', this.sourceLgList[0].value);      
            //this.addValidators(this.WaveCriteriaForm,'sourceLocatorId', this.sourceLocactorList[0].value);      
             this.WaveCriteriaForm.get('sourceLocatorId').setValidators([Validators.required]);
           
            this.lgSourceSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLgList[0]);
             this.WaveCriteriaForm.get('sourceLocatorId').updateValueAndValidity();
          }
        }
      }
    }
  }
  iuSelectionChanged(event: any, value: any){
    if (event.source.selected === true && event.isUserInput === true) {
      this.WaveCriteriaForm.patchValue({ iuCode : value });
      this.getWavePolicyLOV();

    }
  }
 clearValidators(formGroup: FormGroup,formControlName,value){
  formGroup.get(formControlName).clearValidators();
  formGroup.get(formControlName).setValue(value); 
  formGroup.get(formControlName).updateValueAndValidity();
 }
 addValidators(formGroup: FormGroup,formControlName,value){
  formGroup.get(formControlName).setValidators([Validators.required]);
  formGroup.get(formControlName).setValue(value); 
  formGroup.get(formControlName).updateValueAndValidity();
  
 }

  async  getWaveLineData(lineData, formData){
    lineData.forEach(data => {
      if(data.waveStatusCode === 'RLSD' || data.waveStatusCode === 'PARTIAL'){
        data.isChecked= true;
      } else{
        data.isChecked = false;
      }
      this.woSubType = data.woSubType;
      this.waveQuantity = data.waveQuantity;
      //this.woAssmItemId = data.woAssmItemId;     
      if(this.woSubType === 'DIS'){
        data.woLineNumber = 1;
      }
      this.parameterData.push(data);
    });
    
    this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
    this.waveLineDataSource.paginator = this.paginator;
    this.waveLineDataSource.sort = this.sort; 
    return await 'added';
  }

  getLookUpLOV(lookupName: string) {
    if (lookupName === 'WAVE_HEADER_STATUS') {
      this.waveStatusList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.waveStatusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
    if (lookupName === 'PICK_SLIP_GENERATE_WO') {
      this.pickSlipList = [];
       
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.pickSlipList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
          
        });
    }
  }

  // Form Group
  waveForm(subType) {
    if(!subType){
    this.WaveCriteriaForm = this.fb.group({
      waveNumber: [ { value: '', disabled: true } ],
      waveStatusCode: [''],
      iuCode: [''],
      iuId: [''],
      itemName: [{ value: '', disabled: true }],
      onhandQty: [{ value: '', disabled: true }],
      availableQty: [{ value: '', disabled: true }],
      wavePolicy: [null],
      wavePickSlipGroup: [null, Validators.required],
      waveCreateShipment: [''],
      pullReplenishmentFlag: [''],
      defaultDropLpn: [''],
      waveStagingLocatorId:[null,Validators.required],
      waveStagingLocatorCode:[''],
      searchValue:[''],
      sourceLgId:[''],
      sourceLocatorId:[''],
      wavepolicyval:[{ value: '', disabled: true }],
    });
  }
  else{
    this.WaveCriteriaForm = this.fb.group({
      waveNumber: [ { value: '', disabled: true } ],
      waveStatusCode: [''],
      iuCode: [''],
      iuId: [''],
      itemName: [{ value: '', disabled: true }],
      onhandQty: [{ value: '', disabled: true }],
      availableQty: [{ value: '', disabled: true }],
      wavePolicy: [null],
      wavePickSlipGroup: [null,  ],
      waveCreateShipment: [''],
      pullReplenishmentFlag: [''],
      defaultDropLpn: [''],
      waveStagingLocatorId:[null],
      waveStagingLocatorCode:[''],
      searchValue:[''],
      sourceLgId:[null, Validators.required],
      sourceLocatorId:[null, Validators.required],
      wavepolicyval:[''],
    });
  }
  }
  
  fetchNewSearchListForLocator(event: any, index: any, searchFlag: any){
    const value = this.WaveCriteriaForm.value.searchValue;
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
      this.getLovForLocator(this.WaveCriteriaForm.value.searchValue, index, event)


    }else{
        this.showLov = 'hide';
        this.WaveCriteriaForm.patchValue({ searchValue: '' });
        this.WaveCriteriaForm.patchValue({ waveStagingLocatorId : null });
    }

  }


  locatorSelectionChanged(event: any, ele: any){
     
    if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true ) ){   
    this.WaveCriteriaForm.patchValue({ waveStagingLocatorId : ele.value });
    //this.getOnhandDetails(ele.locLgId,ele.value);
  }
}
  getLovForLocator(searchValue, index, event){

    this.woService.getLocatorLov( 'iu', searchValue,'wolocator', this.waveIuId ).subscribe((data: any) => {
        this.stagingLocactorList = [{
          value   : '',
          label : ' Please Select',
          locLgId: null,
        }];

        if( data.result && data.result.length){
          data =  data.result;
          this.stagingLocactorList = [];

            for(let i=0; i<data.length; i++){
                this.stagingLocactorList.push({
                  value   : data[i].locatorId,
                  label : data[i].locCode,
                  locLgId: data[i].locLgId,

              })
            }
            this.inlineSearchLoader = 'hide';
            this.showLov = 'show';
            this.WaveCriteriaForm.patchValue({ searchValue: '' });
            if(!this.isChecked){
               // Set the first element of the search
            this.WaveCriteriaForm.patchValue({ waveStagingLocatorId : this.stagingLocactorList[0].value });
            }      
        }else{
          this.inlineSearchLoader = 'hide';
           this.WaveCriteriaForm.patchValue({ searchValue: '' });
          this.openSnackBar('No match found', '','error-snackbar');
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

  // Get wave Policy LOV
  getWavePolicyLOV(from?) {
    this.wavePolicyList = [{
      value   : -1,
      label : ' Pre-Defined'
    }];
   
    if( this.woSubType !== 'DIS'){
      this.wavePolicyList = [{
        value   : -1,
        label : ' Please Select'
      }];
    }
    this.woService
      .getWavePolicyLOV(this.WaveCriteriaForm.value.iuCode)
      .subscribe((data: any) => {
        for (const wavePolicyData of data.result) {
          this.wavePolicyList.push({
            value: wavePolicyData.policyId,
            label: wavePolicyData.policyName
          });
        }
        if(!from){
        this.WaveCriteriaForm.patchValue({ wavePolicy : this.wavePolicyList[0].value }); 
        }else{
          this.WaveCriteriaForm.patchValue({ wavePolicy : Number(from) }); 
        }
        
      });
  }

  onSubmit(event, form){
    if (event) {
      event.stopImmediatePropagation();
      if (this.WaveCriteriaForm.valid) {

      }
    }
  }

  viewAllAllocations(event:any, lineId?:number){
    if(lineId){
      this.router.navigate(['wavemfg/allocations/' + Number(this.waveId) + '/' + this.waveIuId, {waveLineId: lineId}]);
    } else{
      this.router.navigate(['wavemfg/allocations/' + Number(this.waveId) + '/' + this.waveIuId]);
    }
  }

  // check if isChecked is true
  rowSelectionChange(){
    let selectRowCount = 0;
    for(const data of this.parameterData){
        if(data.rowSelect){
            selectRowCount ++;
        }
    }
    this.isChecked = selectRowCount > 0 ? true : false;
  }

  // select / unselect all wave line checkbox
  selectAll(){
    for(const pData of this.parameterData){
      if((pData.waveStatusCode === 'RLSD' || pData.waveStatusCode === 'PARTIAL')){
        pData.rowSelect = true;
        this.isChecked = true;
      } else{
        pData.rowSelect = false;
        this.isChecked = false;
      }

    }
  }

  releaseWave(event: any){
      if(event){
      event.stopImmediatePropagation();
      this.saveInprogress = true;
      if(this.woSubType === 'DIS'){
        if(this.WaveCriteriaForm.get('wavePolicy').value === -1 && this.WaveCriteriaForm.get('availableQty').value  < this.waveQuantity ){
          document.getElementById('sourcelocator').focus();
          this.saveInprogress = false;
          this.openSnackBar('Please Select Source LG and Location that have sufficient Available Quntity ', '','error-snackbar');  
              return;
        }
      }else{
        this.WaveCriteriaForm.patchValue({ sourceLgId : null });
        this.WaveCriteriaForm.patchValue({ sourceLocatorId : null });
      }
      if (this.WaveCriteriaForm.valid) {
        const obj = {
          createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          shipmentNumber: null,
          soNumber: null,
          waveCreateShipment:  this.WaveCriteriaForm.value.waveCreateShipment === true ? 'Y' : 'N',
          waveGenerateDropLpn: this.WaveCriteriaForm.value.defaultDropLpn === true ? 'Y' : 'N',
          waveHostId: null,
          waveId: Number(this.waveId),
          waveIuId:  this.waveIuId,
          waveLines: null,
          waveNumber: this.WaveCriteriaForm.value.waveNumber,
          wavePickSlipGroup: this.WaveCriteriaForm.value.wavePickSlipGroup,
          wavePolicyId: this.WaveCriteriaForm.value.wavePolicy === -1 ? null : this.WaveCriteriaForm.value.wavePolicy,
          wavePullReplenishment: this.WaveCriteriaForm.value.pullReplenishmentFlag  === true ? 'Y' : 'N',
          waveStagingLocatorId:  this.WaveCriteriaForm.value.waveStagingLocatorId,
          waveStatus: this.WaveCriteriaForm.value.waveStatusCode,
          sourceLgId:this.WaveCriteriaForm.value.sourceLgId,
          sourceLocatorId:this.WaveCriteriaForm.value.sourceLocatorId,
        } 
        this.woService
        .releaseWave(obj)
        .subscribe(
          (resultData:any) => {
            if (resultData.status === 200) {
              this.openSnackBar(resultData.message, '', 'success-snackbar');
              this.router.navigate(['wavemfg']);
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

      }else {
        if(this.woSubType === 'DIS'){
        document.getElementById('sourcelocator').focus();
        }
          this.openSnackBar('Please check mandatory fields', '', 'error-snackbar');
          this.saveInprogress = false;
      }
    }
  }

  undoWave(event: any){
    if(event){
      event.stopImmediatePropagation();
      const obj: any = {
        createdBy: JSON.parse(localStorage.getItem('userDetails')).userId
      }

      const tempArray = [];
      if (this.parameterData.length) {
        for (const [i, pData] of this.parameterData.entries()) {
          if(pData.isChecked === true){
            tempArray.push(pData.waveLineId)
          }
        }
      }

      if(tempArray.length){
        obj.waveIds = tempArray
        this.woService
        .undoWave(obj)
        .subscribe(
          (resultData:any) => {
            if (resultData.status === 200) {
              this.openSnackBar(resultData.message, '', 'success-snackbar');
              this.router.navigate(['wavemfg']);
            } else {
              this.openSnackBar(resultData.message, '', 'error-snackbar');

            }
          },
          error => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
          }
        );
      }

    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

  ngAfterViewInit() {
    this.waveLineDataSource.sort = this.sort;
    // this.waveLineDataSource.connect().subscribe(d => {
    //     this.waveLineDataSource.sortData(this.waveLineDataSource.filteredData,this.waveLineDataSource.sort);
    // });
    setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    }, 500);
}

@HostListener('window:resize', ['$event'])
onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(82);
}

getSourceLgList(){ 
  const data = { onhandIuId: Number(this.waveIuId),  onhandItemId:this.woAssmItemId, lgCode: '', screen:"INVENTORY_LG_LIST"};
  this.woIssueService.getLgOrLocList(data).subscribe((result: any) => {
    if (result.status === 200) {
      if (result.result && result.result.length) {       
        const data = result.result;
        this.sourceLgList = [];

        for(let i=0; i<data.length; i++){
            this.sourceLgList.push({
              value   : data[i].onhandLgId,
              label : data[i].lgCode
          }); 
        }
        if(this.sourceLgList.length !== 0) {
          this.sourceLgList.sort((a,b) =>  
          (a.label > b.label ? 1 : -1));
        }
        if(!this.WaveCriteriaForm.value.sourceLgId || this.WaveCriteriaForm.value.sourceLgId !== "" ){
      // this.lgSourceSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLgList[0]);  
        } 
      }else if(result.message){
        this.openSnackBar(result.message + ' for this Item', '', 'error-snackbar');
      }else{
        this.openSnackBar('Empty LG List', '', 'error-snackbar');
      }
    }
  });
}

getSourceLovForLocator2(){ 
 // this.woService.getLocatorLov( 'iu', '','woDekitLocator', this.waveIuId ).subscribe((data: any) => {
  let data = {"itemId":this.woAssmItemId,"itemRevId":null,"iuId":this.waveIuId,"lgId":this.WaveCriteriaForm.value.sourceLgId,"stockLocation":"INVENTORY"}
  this.woService.getObhandLOCList(data).subscribe((data: any) => {       
      this.sourceLocactorList = [];
      if( data.result && data.result.length){
        data =  data.result;
        this.sourceLocactorList = [];
          for(let i=0; i<data.length; i++){
            if(data[i].primarySum > 0){
              this.sourceLocactorList.push({
                value   : data[i].locId,
                label : data[i].locCode,
                lgId : data[i].locLgId,
                primarySum : data[i].primarySum,
                lpnAvlQty : data[i].lpnAvlQty,
            });
          } 
          }

           
          //if(!this.WaveCriteriaForm.value.sourceLocatorId || this.WaveCriteriaForm.value.sourceLocatorId === "" ) {
          this.slocatorSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLocactorList[0]); 
         // this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(this.sourceLocactorList[0].value); 
         // }
               

      }else{
        this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(null);
        this.WaveCriteriaForm.controls["availableQty"].setValue('');
        this.WaveCriteriaForm.controls["onhandQty"].setValue('');
        this.openSnackBar('No locator found', '','error-snackbar');
      }
  },
  (error: any) => {
    this.openSnackBar(error.error.message, '', 'error-snackbar');
  })
} 
getOnhandDetails(lgId,onhandLocatorId){
   
  let tempStockLocatorList = [];  
  const data = { onhandIuId: this.waveIuId, onhandLgId: lgId,onhandLocatorId:onhandLocatorId, onhandItemId:this.woAssmItemId, lgCode: "", screen:"Locator_List"};
  this.woService.getLGList(data).subscribe(          
    (data: any) => { 
        if (data.result && data.result.length > 0) {
          for (const rowData of data.result) { 
            this.WaveCriteriaForm.controls["availableQty"].setValue(rowData.unReservedQty);
          this.WaveCriteriaForm.controls["onhandQty"].setValue(rowData.onhandPrimaryQuantity);
          }
        }else{
          this.WaveCriteriaForm.controls["availableQty"].setValue('0');
          this.WaveCriteriaForm.controls["onhandQty"].setValue('0');
        }
      });
}
getSourceLovForLocator(){ 
  let tempStockLocatorList = [];   
  this.sourceLocactorList = [];    
const data = { onhandIuId: this.waveIuId, onhandLgId: this.WaveCriteriaForm.value.sourceLgId, onhandItemId:this.woAssmItemId, lgCode: "", screen:"Locator_List"};
this.woService.getLGList(data).subscribe(          
  (data: any) => { 
      if (data.result && data.result.length > 0) {
        
          for (const rowData of data.result) {  
              if( rowData.unReservedQty > 0){          
                  tempStockLocatorList.push( {  label: rowData.locCode,
                                                value: rowData.locatorId,
                                                unReservedQty: rowData.unReservedQty,          
                                                onhandPrimaryQuantity: rowData.onhandPrimaryQuantity,          
                                            });
              }
          }
          if(tempStockLocatorList.length !== 0) {
          tempStockLocatorList.sort((a,b) =>  
          (a.unReservedQty > b.unReservedQty ? -1 : 1));
          this.sourceLocactorList= tempStockLocatorList;
          this.slocatorSelectionChanged({source : { selected: true, isUserInput :true}},this.sourceLocactorList[0]); 
          // this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(this.sourceLocactorList[0].value); 
          // this.WaveCriteriaForm.controls["availableQty"].setValue(this.sourceLocactorList[0].unReservedQty); 
          // this.WaveCriteriaForm.controls["onhandQty"].setValue(this.sourceLocactorList[0].onhandPrimaryQuantity); 
          }else{
            this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(null);
            this.WaveCriteriaForm.controls["availableQty"].setValue('');
            this.WaveCriteriaForm.controls["onhandQty"].setValue('');
          }
          
         // }
               

      }else{
        this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(null);
        this.WaveCriteriaForm.controls["availableQty"].setValue('');
        this.WaveCriteriaForm.controls["onhandQty"].setValue('');
        this.openSnackBar('No locator found', '','error-snackbar');
      }
      });

}
slocatorSelectionChanged(event: any, ele: any){ 
  if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true ) ){    
    this.WaveCriteriaForm.controls["sourceLocatorId"].setValue(ele.value);
    this.WaveCriteriaForm.controls["onhandQty"].setValue(ele.onhandPrimaryQuantity);
    this.WaveCriteriaForm.controls["availableQty"].setValue(ele.unReservedQty);     
     
  }
}
lgSourceSelectionChanged(event: any, ele: any){
  
  if (event.source.selected === true && (event.source.isUserInput === true || event.isUserInput === true ) ){    
    this.WaveCriteriaForm.controls["sourceLgId"].setValue(ele.value);
    this.getSourceLovForLocator();
  }
}
}
