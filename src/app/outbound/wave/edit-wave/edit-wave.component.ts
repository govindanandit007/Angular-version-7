import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatTable, MatSort } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { WaveService } from 'src/app/_services/transactions/wave.service';

export interface ParameterDataElement {
  rowSelect: boolean,
  soNumber: string,
  soLineNumber: number,
  itemName: string,
  revsnNumber: any,
  soShipmentNumber: string,
  waveQuantity: number,
  waveQuantityUomCode: string,
  uomname: string,
  waveLineStatusName: string,
  waveId: number,
  waveLineId: number,
  allocatedQty: number,
  action: string,
  createdBy?: number;
  updatedBy?: number;
  waveStatusCode: string;
  isChecked : boolean;
}

@Component({
  selector: 'app-edit-wave',
  templateUrl: './edit-wave.component.html',
  styleUrls: ['./edit-wave.component.css']
})

export class EditWaveComponent implements OnInit, AfterViewInit {
  iuCodeList: any[] = [];
  waveStatusList: any[] = [];
  WaveCriteriaForm: FormGroup;
  isEdit = false;
  waveId: number;
  waveIuId: number;
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
  waveLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  waveLineDisplayedColumns: string[] = [
    'rowSelect',
    'No',
    'soNumber',
    'soLineNumber',
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
    { field: 'rowSelect', name: '', width: 75, baseWidth: 4 },
    { field: 'No', name: '#', width: 75, baseWidth: 5 },
    { field: 'soNumber', name: 'SO #', width: 75, baseWidth: 10 },
    { field: 'soLineNumber', name: 'SO Line', width: 75, baseWidth: 9 },
    { field: 'itemName', name: 'Item', width: 75, baseWidth: 13 },
    { field: 'revsnNumber', name: 'Item Rev', width: 75, baseWidth: 9 },
    { field: 'allocatedQty', name: 'Allocated Qty', width: 75, baseWidth: 11 },
    { field: 'waveQuantity', name: 'Qty', width: 75, baseWidth: 10 },
    { field: 'waveQuantityUomCode', name: 'UOM', width: 75, baseWidth: 8 },
    { field: 'taskNumber', name: 'Task #', width: 75, baseWidth: 8 },
    { field: 'waveLineStatusName', name: 'Status', width: 75, baseWidth: 8 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
  ]
  enableReleaseBtn: boolean;

  constructor(private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public waveService: WaveService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getInventoryUnitLOV();
   
    this.waveForm();
    this.getLookUpLOV('WAVE_HEADER_STATUS');
    this.getLookUpLOV('PICK_SLIP_GENERATE');
    this.route.params.subscribe(params => {
      if (params.id) {
        this.isEdit = true;
        this.waveId = params.id;
        this.parameterData = [];
        this.waveService
          .getWaveById(params.id)
          .subscribe((data: any) => {
            this.waveIuId = data.result.waveIuId;
            data.result.waveCreateShipment = data.result.waveCreateShipment === 'Y' ? true : false;
            data.result.pullReplenishmentFlag = data.result.pullReplenishmentFlag === 'Y' ? true : false;            
            data.result.defaultDropLpn = data.result.waveGenerateDropLpn === 'Y' ? true : false;
            data.result.wavePolicy =  data.result.wavePolicyId;
            data.result.wavePickSlipGroup  = data.result.wavePickSlipGroup;
            data.result.searchValue = data.result.waveStagingLocatorCode;
            data.result.iuId = data.result.waveIuId;
            this.showLov = 'hide';
            this.WaveCriteriaForm.patchValue(data.result);
            this.getWaveLineData(data.result.waveLines);
            if(this.WaveCriteriaForm.value.waveStatusCode !== 'PNDNG'){
              this.WaveCriteriaForm.controls.searchValue.disable();
              this.enableReleaseBtn = false;
            }else if(this.WaveCriteriaForm.value.waveStatusCode === 'PNDNG'){
              this.enableReleaseBtn = true;
            }
          });
      } else { }
    });
    this.commonService.getScreenSize(30);
  }

  locatorSelectionChanged(event: any, value: any){
    if (event.source.selected === true && event.isUserInput === true) {
      this.WaveCriteriaForm.patchValue({ waveStagingLocatorId : value });
    }
  }

  checkDefaultDropLpn(event: any, value:any){
    if (event.source.selected === true && event.isUserInput === true) {
      if(this.WaveCriteriaForm.value.waveStatusCode === 'PNDNG' && value ==='BULK_PICK_SHIPMENT'){
        this.WaveCriteriaForm.patchValue({ defaultDropLpn : false });
      }
    }
  }

  iuSelectionChanged(event: any, value: any){
    if (event.source.selected === true && event.isUserInput === true) {
      this.WaveCriteriaForm.patchValue({ iuCode : value });
      this.getWavePolicyLOV();

    }
  }


  getWaveLineData(lineData){
    lineData.forEach(data => {
      if(data.waveStatusCode === 'RLSD' || data.waveStatusCode === 'PARTIAL'){
        data.isChecked= true;
      } else{
        data.isChecked = false;
      }
      
      if(data.waveLineStatusName === 'Pending'){
        //data.isChecked = false;
      }
      this.parameterData.push(data);
    });
    this.waveLineDataSource = new MatTableDataSource<any>(this.parameterData);
    this.waveLineDataSource.paginator = this.paginator;
    this.waveLineDataSource.sort = this.sort;
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
    if (lookupName === 'PICK_SLIP_GENERATE') {
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
  waveForm() {
    this.WaveCriteriaForm = this.fb.group({
      waveNumber: [ { value: '', disabled: true } ],
      waveStatusCode: [''],
      iuCode: [''],
      iuId: [''],
      wavePolicy: [null],
      wavePickSlipGroup: [''],
      waveCreateShipment: [''],
      pullReplenishmentFlag: [''],
      defaultDropLpn: [''],
      waveStagingLocatorId:[''],
      waveStagingLocatorCode:[''],
      searchValue:['']
    });
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

  getLovForLocator(searchValue, index, event){

    this.waveService.getLocatorLov( 'iu', searchValue,'locator', this.waveIuId ).subscribe((data: any) => {
        this.stagingLocactorList = [{
          value   : '',
          label : ' Please Select'
        }];

        if( data.result && data.result.length){
          data =  data.result;
          this.stagingLocactorList = [];

            for(let i=0; i<data.length; i++){
                this.stagingLocactorList.push({
                  value   : data[i].locatorId,
                  label : data[i].locCode,
                  name : data[i].slAliasName,
              })
            }

            this.inlineSearchLoader = 'hide';
            this.showLov = 'show';
            this.WaveCriteriaForm.patchValue({ searchValue: '' });

            // Set the first element of the search
            this.WaveCriteriaForm.patchValue({ waveStagingLocatorId : data[0].locatorId });
            console.log(this.WaveCriteriaForm.value);

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
            label: iuData.iuCode,
            name: iuData.iuName
          });
        }
      });
  }

  // Get wave Policy LOV
  getWavePolicyLOV() {
    this.waveService
      .getWavePolicyLOV(this.WaveCriteriaForm.value.iuCode)
      .subscribe((data: any) => {
        for (const wavePolicyData of data.result) {
          this.wavePolicyList.push({
            value: wavePolicyData.policyId,
            label: wavePolicyData.policyName
          });
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
      this.router.navigate(['wave/allocations/' + Number(this.waveId) + '/' + this.waveIuId, {waveLineId: lineId}]);
    } else{
      this.router.navigate(['wave/allocations/' + Number(this.waveId) + '/' + this.waveIuId]);
    }
  }

  // check if isChecked is true
  rowSelectionChange(element){

    let selectRowCount = 0;
    let pendingLineCount = 0;    
    for(const data of this.parameterData){
        if(data.rowSelect){
            selectRowCount ++;
        }
        if(data.rowSelect && data.waveLineStatusName === 'Pending'){
          pendingLineCount++;
      }
      if(!data.rowSelect){
        this.selectAllRow = false;
      }
    }
    this.isChecked = (selectRowCount > 0 && pendingLineCount === 0 ) ? true : false;
    this.enableReleaseBtn = (selectRowCount > 0  && pendingLineCount === selectRowCount)  ? true : false;
  }

  // select / unselect all wave line checkbox
  selectAll(){
    this.isChecked = false;
    this.enableReleaseBtn = false;
    for(const pData of this.parameterData){
      if(this.selectAllRow && (pData.waveStatusCode === 'RLSD' || pData.waveStatusCode === 'PARTIAL')){
        pData.rowSelect = true;
        this.isChecked = true;        
      } else{
        pData.rowSelect = false;
      }
      if(pData.waveLineStatusName === 'Pending'){
        pData.rowSelect = false;
      }

    }
  }

  releaseWave(event: any){
    if(event){
      event.stopImmediatePropagation();
      this.saveInprogress = true;
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
          wavePolicyId: this.WaveCriteriaForm.value.wavePolicy,
          wavePullReplenishment: this.WaveCriteriaForm.value.pullReplenishmentFlag  === true ? 'Y' : 'N',
          waveStagingLocatorId:  this.WaveCriteriaForm.value.waveStagingLocatorId ? this.WaveCriteriaForm.value.waveStagingLocatorId : null,
          waveStatus: this.WaveCriteriaForm.value.waveStatusCode
        }

        this.waveService
        .releaseWave(obj)
        .subscribe(
          (resultData:any) => {
            if (resultData.status === 200) {
              this.openSnackBar(resultData.message, '', 'success-snackbar');
              this.router.navigate(['wave']);
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

          if(pData.rowSelect === true){
            tempArray.push(pData.waveLineId)
          }
        }
      }

      if(tempArray.length){
        obj.waveIds = tempArray
        this.waveService
        .undoWave(obj)
        .subscribe(
          (resultData:any) => {
            if (resultData.status === 200) {
              this.openSnackBar(resultData.message, '', 'success-snackbar');
              this.router.navigate(['wave']);
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
    this.commonService.getScreenSize(30);
}
}
