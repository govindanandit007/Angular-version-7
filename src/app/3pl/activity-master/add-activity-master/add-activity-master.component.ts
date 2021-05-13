import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, TooltipPosition } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';


export interface ParameterDataElement {
  sno? : any;
  activityCode : any;
  activityName : any;
  activityId?: any;
  description : any;
  chargeCode : any;
  uom : any;
  unitOfMeasure? : any;
  startDate : any;
  endDate : any;
  enableFlag : any; 
  action?: string;
  editing: boolean;
  addNewRecord?: boolean;
  originalData?: any;
  createdBy?: any;
  updatedBy?: any;
}


@Component({
  selector: 'app-add-activity-master',
  templateUrl: './add-activity-master.component.html',
  styleUrls: ['./add-activity-master.component.css']
})



export class AddActivityMasterComponent implements OnInit {

  formTitle: string = '';
  transactionTypes: any[] = [];
  subActivities: any[] = [];
  isEdit = false;
  isAdd = false;
  fromEdit: any = false;
  isEditRoles = false;

  activityMasterForm: FormGroup;

  transactionTypeList: any[] = [];
  subActivitiesList: any[] = [];
  uomList: any[] = [];

  selectedRowIndex: any = null;
  systemDate : any = new Date();

  activityHeaderId: any = null;

  saveInprogress = false;

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  tooltipPosition: TooltipPosition[] = ['below'];

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  parameterDisplayedColumns: string[] = [
    'sno',
    'activityCode',
    'activityName',
    'description',
    'chargeCode',
    'uom',
    'startDate',
    'endDate',
    'enableFlag', 
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 4 },
      { field: 'activityCode', name: 'Activity Code', width: 75, baseWidth: 10 },
      { field: 'activityName', name: 'Activity Name', width: 75, baseWidth: 12 },
      { field: 'description', name: 'Description', width: 75, baseWidth: 16 },
      { field: 'chargeCode', name: 'Charge Code', width: 75, baseWidth: 10 },
      { field: 'uom', name: 'UOM', width: 75, baseWidth: 12 },
      { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 10 },
      { field: 'endDate', name: 'End Date', width: 75, baseWidth: 10 },
      { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 9 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];

  activityTableMessage = '';

  constructor(
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private fb: FormBuilder,
    private activityService: ActivityMasterService,
    public router: Router,
    private route: ActivatedRoute,
    private workOrderService: WorkOrderService

  ) { }

  validationMessages = {
    transactionType: {
      required: 'Transaction Type is required.'
    },
    subactivity: {
      required: 'Sub Activity is required.'
    }
  };

  activityMasterFormErrors = {
    transactionType: '',
    subactivity: ''
  };
  

  ngOnInit() {
    this.activityMasterFormGroup();
    this.getTransactionType();
    this.getUomLov();
    this.route.params.subscribe(params => {
        if (params.id) {
          this.isEdit = true;
          this.activityMasterFormGroup();
          this.formTitle = 'Edit Activity :';
          this.activityHeaderId = params.id;
          this.activityService
          .getActivityDetails(params.id)
          .subscribe((data: any) => {
              this.activityMasterForm.patchValue(data.result[0]);
              this.renderEditRoles(data.result[0].Activity);
            });
        } else {
          this.formTitle = 'Create Activity :';
          setTimeout(() => {this.addRow();},100);
        }
      });
  }

  activityMasterFormGroup() {
      if(!this.isEdit) {
        this.activityMasterForm = this.fb.group({
          transactionType: ['', Validators.required],
          subactivity: ['', Validators.required]
        });
      }
  }

  activityMasterLogValidationErrors(group: FormGroup = this.activityMasterForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.activityMasterLogValidationErrors(abstractControl);
      } else {
        this.activityMasterFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.activityMasterFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }


  getTransactionType() {
    this.transactionTypeList = [];
    this.commonService.getLookupLOV('3PL_TRANSACTION_TYPE').subscribe(
      (data: any) => {
        this.transactionTypeList = [{
          label: ' Please Select',
          value: ''
        }];
        if (data.status === 200) {
          if (data.result && data.result.length) {
            for (const lovItem of data.result) {
                if(lovItem.lookupValueEnabledFlag === 'Y'){
                    this.transactionTypeList.push({
                        label: lovItem.lookupValueDesc,
                        value: lovItem.lookupValue,
                        data : lovItem
                    });
                }
            }
          }
        }
      },
      error => {
        this.openSnackBar(error, '','default-snackbar');
      })
  }

  transactionTypeListChanged(event: any, value){
    if (event.source.selected && event.isUserInput === true) {
      this.getSubActivities(value)
    }
  }
  

  getSubActivities(value) {
    if(value === ''){
      return
    }
    this.subActivitiesList = [];
    this.commonService.getLookupByLookupName('3PL_SUBACTIVITY', value).subscribe(
      (data: any) => {
        this.subActivitiesList = [{
          label: ' Please Select',
          value: ''
        }];
        if (data.status === 200) {
           
          if (data.result  && data.result.length) {
            for (const lovItem of data.result) {
                if(lovItem.lookupValueEnabledFlag === 'Y'){
                    this.subActivitiesList.push({
                        label: lovItem.lookupValueDesc,
                        value: lovItem.lookupValue,
                        data: lovItem
                    });
                }
            }
          }
        }
      },
      error => {
        this.openSnackBar(error, '','default-snackbar');
      })
  }

  startDateChanged(event: any, index){
    this.parameterData[index].endDate = null;
  }

  getUomLov(){
        this.uomList = [{label: ' Please Select', value:''}];
        this.commonService.getSearchLOV('UOM').subscribe((data: any) => {
            if(data.result){
               
                for (const rowData of data.result) {
                    this.uomList.push({
                    value: rowData.code,
                    label: rowData.name
                    });
                }
            }
        });
  }

  uomChanged(event: any, value, index){
    if (event.source.selected && event.isUserInput === true) {
      for (const rowData of this.parameterData) {
        if( !this.fromEdit && value !== '' && rowData.uom === value){
          setTimeout(() => {
            this.parameterData[index].uom = '';
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            this.parameterDataSource.sort = this.sort;
          }, 1000);
          this.openSnackBar('This UOM is already added in activity.', '','default-snackbar');
          return;
        }
        this.fromEdit = false;
      }
    }
  }

  checkDuplicateActivityName(activityName: any, index: any){
    let count  = 0
    for (const rowData of this.parameterData) {
      if( rowData.activityName === activityName && rowData.activityName !==''){
        count++
        setTimeout(() => {
          if(count === 2){
            this.openSnackBar( activityName + ' activity already exists.', '','default-snackbar');
            this.parameterData[index].activityName = '';
            return;
          }
        },100)
      }
    }
  }

  renderEditRoles(data) {
    let array: any = [];
    for (const [index, pData] of data.entries()) {
       
      array.push({
        activityCode  : pData.activityCode ,
        activityName  : pData.activityName ,
        activityId    : pData.activityId ,
        description   : pData.description ,
        chargeCode    : pData.chargeCode ,
        uom           : pData.uom,
        unitOfMeasure : pData.unitOfMeasure,
        startDate     : pData.startDate ,
        endDate       : pData.endDate ,
        enableFlag    : pData.enableFlag === 'Y' ? true : false,
        originalData  : pData,
        editing       : false,
        addNewRecord  : false
      });
    }

     
    this.parameterData = array;
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
    );
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;
  
  }


  addRow() {
      this.selectedRowIndex = null;
      this.paginator.pageIndex = 0;
      if(this.matTableRef.nativeElement.clientHeight > 240 ){
          const elem = document.getElementById('customTable');
          elem.scrollTop = 0;
      }
      for (const pData of this.parameterData) {
          if (pData.editing === true && pData.addNewRecord === false) {
              this.openSnackBar('Please update your records first.', '','default-snackbar');
              return;
          }
      }
   
      this.isAdd = true;
      this.isEditRoles = false;
      this.parameterData.unshift({
        activityCode : null,
        activityName : '',
        description : '',
        chargeCode : '',
        uom : '',
        startDate : this.systemDate,
        endDate : '',
        enableFlag : false, 
        action: '',
        editing: true,
        addNewRecord: true
      });
    
      this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      this.parameterDataSource.paginator = this.paginator;
      this.parameterDataSource.sort = this.sort;
    
  
  }

  beginEdit(rowData: any, $event: any, index: any) {

    for (const pData of this.parameterData) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','default-snackbar');
            return;
        }
    }
    
    if (rowData.editing === false) {
        rowData.editing = true;
        this.isAdd = false;
        this.isEditRoles = true;
        this.fromEdit = true;
    } 
  }

  disableEdit(rowData: any, index: any) {
    if (this.parameterData[index].editing === true) {
       this.parameterData[index].activityName  = this.parameterData[index].originalData.activityName;
       this.parameterData[index].description   = this.parameterData[index].originalData.description;
       this.parameterData[index].chargeCode    = this.parameterData[index].originalData.chargeCode;
       this.parameterData[index].uom           = this.parameterData[index].originalData.uom;
       this.parameterData[index].unitOfMeasure = this.parameterData[index].originalData.unitOfMeasure;
       this.parameterData[index].startDate     = this.parameterData[index].originalData.startDate;
       this.parameterData[index].endDate       = this.parameterData[index].originalData.endDate;
       this.parameterData[index].enableFlag    = this.parameterData[index].originalData.enableFlag;
       this.parameterData[index].editing       = false;
       this.isEditRoles = false;
    };
  }


  deleteRow(rowData: any, rowIndex: number) {
    this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
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

  onSubmit(event: any, form: any){
    if(event){
      event.stopImmediatePropagation();
      if (this.activityMasterForm.valid) {
        if (this.isEdit) {
          this.activityMasterForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          const data = this.getActivities(this.activityMasterForm.value);
          if (data === 'validateError'){
            return
          }
          this.saveInprogress = true;
          this.activityService
            .updateActivtiy(data,this.activityHeaderId)
            .subscribe(
              (resultData:any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                   
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['activitymaster']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
         
        } else {
          this.activityMasterForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          const data = this.getActivities(this.activityMasterForm.value);
          if (data === 'validateError'){
            return
          }
          this.saveInprogress = true;
          this.activityService
            .createActivity(data)
            .subscribe(
              (resultData:any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                   
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['activitymaster']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
         
        }
      } else {
              this.selectedRowIndex = null;
              for (const [i, pData] of this.parameterData.entries()) {
                  if (
                      pData.activityName === '' ||
                      pData.chargeCode === '' ||
                      pData.description === ''
                    ) {
                      this.selectedRowIndex = i;
                      break;
                  }
              }
              this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
              this.saveInprogress = false;
      }
    }
  }

  getActivities(data) {
    const addActivityArray = [];
    const updateActivityArray = [];
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.activityName === '' || pData.chargeCode === '' ||  pData.description === '') {
          this.selectedRowIndex = i ;
          this.openSnackBar('Please enter all required fields in row ' + (i+1) , '', 'default-snackbar');
          return 'validateError';
        }
        
      }
      for (const [i, pData] of this.parameterData.entries()) {
        pData.startDate = this.activityService.dateFormat(pData.startDate);
        pData.endDate = pData.endDate ? this.activityService.dateFormat(pData.endDate) : pData.endDate;
        pData.enableFlag = pData.enableFlag === true ? 'Y' : 'N';
        if(!pData.activityId){
          addActivityArray.push(pData);
        }
        if(pData.activityId){
          updateActivityArray.push(pData);
        }
      }
      data.addActivities = addActivityArray;
      data.updateActivities = updateActivityArray;
      return data;
    }else{
      data.addActivities = addActivityArray;
      return data;
    }
  }


  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: [typeClass]
    });
  }

  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    setTimeout(() => {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number( window.localStorage.getItem('paginationSize') ? 
        window.localStorage.getItem('paginationSize') : 10 );
    }, 100);
}

@HostListener('window:resize', ['$event'])
onResize(event) {
    this.commonService.setTableResize(
        this.matTableRef.nativeElement.clientWidth,
        this.columns
    );
    this.commonService.getScreenSize();
}


}
