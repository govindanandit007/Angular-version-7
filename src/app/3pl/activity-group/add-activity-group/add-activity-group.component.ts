import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, TooltipPosition } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityGroupService } from 'src/app/_services/3pl/activity-group.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';
import { CommonService } from 'src/app/_services/common/common.service';


export interface ParameterDataElement {
  sno? : any;
  activityCode : any;
  chargeCodeDesc?: any;
  activityName : any;
  activityId?  : any;
  transactionTypeDesc : any;
  subactivityDesc: any;
  description : any;
  activityGrpDtlId?: any;
  // enableFlag : any; 
  action?: string;
  editing: boolean;
  addNewRecord?: boolean;
  originalData?: any;
  createdBy?: any;
  updatedBy?: any;
}

@Component({
  selector: 'app-add-activity-group',
  templateUrl: './add-activity-group.component.html',
  styleUrls: ['./add-activity-group.component.css']
})
export class AddActivityGroupComponent implements OnInit {

  formTitle: string = '';
  isEdit = false;
  isAdd = false;
  fromEdit: any = false;


  selectedRowIndex: any = null;
  systemDate : any = new Date();
  minEndDate : any = new Date();

  activityGroupForm: FormGroup;
  activityGroupId: any = null;

  activityList: any = [];
  saveInprogress = false;
  isEditRoles = false;


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
    'transactiontype',
    'subactivities',
    'description',
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 7 },
      { field: 'activityCode', name: 'Activity Code', width: 75, baseWidth:  12},
      { field: 'activityName', name: 'Activity Name', width: 75, baseWidth: 18 },
      { field: 'transactiontype', name: 'Transaction Type', width: 75, baseWidth: 18 },
      { field: 'subactivities', name: 'Sub Activity', width: 75, baseWidth: 18 },
      { field: 'description', name: 'Description', width: 75, baseWidth: 19 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 8 }
  ];

  activityTableMessage = '';

  constructor(
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private fb: FormBuilder,
    private activityService: ActivityMasterService,
    private activityGroupService: ActivityGroupService,
    public router: Router,
    private route: ActivatedRoute

  ) { }

  validationMessages = {
    activityGroupName: {
      required: 'Group Name is required.'
    }
    // },
    // startDate: {
    //   required: 'Start Date is required.'
    // },
    // endDate: {
    //   required: 'End Date is required.'
    // }
  };

  activityGroupFormErrors = {
    activityGroupName : ''
    // ,
    // startDate : '',
    // endDate : '',
  };
  
  ngOnInit() {
    this.activityGroupFormGroup();
    this.getAllActivities();
   
    this.route.params.subscribe(params => {
        if (params.id) {
           
          this.isEdit = true;
          this.activityGroupFormGroup();
          this.formTitle = 'Edit Activity Group :';
          this.activityGroupId = params.id;
          this.activityGroupService
          .getGroupDetails(params.id)
          .subscribe((data: any) => {
              this.activityGroupForm.get('startDate').clearValidators();
              this.activityGroupForm.get('startDate').updateValueAndValidity();
              this.activityGroupForm.get('endDate').clearValidators();
              this.activityGroupForm.get('endDate').updateValueAndValidity();
              this.activityGroupForm.patchValue(data.result[0]);
              this.renderEditRoles(data.result[0].activityDetailLines);
            });
        } else {
          this.formTitle = 'Create Activity Group :';
          setTimeout(() => {this.addRow();},100);
        }
      });
  }

  activityGroupFormGroup() {
      if(!this.isEdit) {
        this.activityGroupForm = this.fb.group({
          activityGroupId   : [null],
          activityGroupName : ['', Validators.required],
          activityGroupCode : [{value: null, disabled: true}],
          startDate         : [ this.systemDate],
          endDate           : [''],
          enableFlag        : [true, Validators.required]
        });
      }
  }

  activityGroupLogValidationErrors(group: FormGroup = this.activityGroupForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.activityGroupLogValidationErrors(abstractControl);
      } else {
        this.activityGroupFormErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.activityGroupFormErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  getAllActivities(){
    this.activityList = [{label: ' Please Select', value:''}];
    this.activityService
    .searchActivity({})
    .subscribe(data => {
        if (data.status === 200) {
            if (!data.message) {
                 
                for (const rowData of data.result) {
                  this.activityList.push({
                    value        : rowData.activityId,
                    label        : rowData.activityName,
                    activityData : rowData
                  });
                }
                
            }
        } else {
            this.openSnackBar(data.message,'','error-snackbar');
        }
    });
  }

  activityChanged(event:any, index, data, value ){
    if (event.source.selected && event.isUserInput === true && value!=='') {
      for (const rowData of this.parameterData) {
        if( !this.fromEdit && value !== '' && rowData.activityId === value && this.parameterData[index].activityId !== value){
          setTimeout(() => {
            this.parameterData[index].activityId          = '';
            this.parameterData[index].activityCode        = '';
            this.parameterData[index].description         = '';
            this.parameterData[index].subactivityDesc     = '';
            this.parameterData[index].transactionTypeDesc = '';
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            this.parameterDataSource.sort = this.sort;
          }, 1000);
          this.openSnackBar('Activity is already added in this group.', '','default-snackbar');
          return;
        }
      }
      this.fromEdit = false;
      this.parameterData[index].activityCode        = data.activityCode;
      this.parameterData[index].description         = data.description;
      this.parameterData[index].subactivityDesc     = data.subactivityDesc;
      this.parameterData[index].transactionTypeDesc = data.transactionTypeDesc;
    }
  }

  startDateChanged(event: any){
    if(!this.isEdit){
      this.activityGroupForm.patchValue({endDate: this.activityGroupForm.value.startDate});
      this.minEndDate = this.activityGroupForm.value.startDate
    }else{
      this.minEndDate = this.activityGroupForm.value.startDate
    }
  }

  renderEditRoles(data) {
    let array: any = [];
    for (const [index, pData] of data.entries()) {
       
      array.push({
        activityId          : pData.activityId ,
        activityGrpDtlId    : pData.activityGrpDtlId,
        activityCode        : pData.activityCode,
        activityName        : pData.activityName,
        transactionTypeDesc : pData.transactionTypeDesc,
        subactivityDesc     : pData.subactivityDesc,
        description         : pData.description,
        originalData        : pData,
        editing             : false,
        addNewRecord        : false
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
        
        activityCode        : '',
        activityName        : '',
        activityId          : '',
        transactionTypeDesc : '',
        subactivityDesc     : '',
        description         : '',
        activityGrpDtlId    : null,
        // enableFlag       : false, 
        action              : '',
        editing             : true,
        addNewRecord        : true
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
       this.parameterData[index].activityId  = this.parameterData[index].originalData.activityId;
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
      if (this.activityGroupForm.valid) {
        if (this.isEdit) {
          this.activityGroupForm.value.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          const data = this.getActivities(this.activityGroupForm.value);

          data.startDate = (this.activityGroupForm.value.startDate ) ? 
          this.activityGroupService.dateFormat(new Date(this.activityGroupForm.value.startDate)) : null;

          data.endDate = (this.activityGroupForm.value.endDate ) ? 
          this.activityGroupService.dateFormat(new Date(this.activityGroupForm.value.endDate)) : null;
       
          data.enableFlag = data.enableFlag === false ? 'N' : 'Y';
 
          data.activityGroupCode = null
          if (data === 'validateError'){
            return
          }
           if(!this.parameterData.length){
          this.openSnackBar('Please add minimum one activity group', '', 'default-snackbar');
            return
        }
          this.saveInprogress = true;
          this.activityGroupService
            .updateGroup(data,this.activityGroupId)
            .subscribe(
              (resultData:any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                   
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['activitygroup']);
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                this.saveInprogress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
         
        } else {
          this.activityGroupForm.value.createdBy = JSON.parse(localStorage.getItem('userDetails')).userId;
          const data = this.getActivities(this.activityGroupForm.value);

          data.startDate = (this.activityGroupForm.value.startDate ) ? 
          this.activityGroupService.dateFormat(new Date(this.activityGroupForm.value.startDate)) : null;

          data.endDate = (this.activityGroupForm.value.endDate ) ? 
          this.activityGroupService.dateFormat(new Date(this.activityGroupForm.value.endDate)) : null;
       
          data.enableFlag = data.enableFlag === false ? 'N' : 'Y';

          data.activityGroupCode = null;
                 
          if (data === 'validateError'){
            return
          }
              if(!this.parameterData.length){
          this.openSnackBar('Please add minimum one activity group', '', 'default-snackbar');
            return
        }
          this.saveInprogress = true;
          this.activityGroupService
            .createGroup(data)
            .subscribe(
              (resultData:any) => {
                this.saveInprogress = false;
                if (resultData.status === 200) {
                   
                  this.openSnackBar(resultData.message, '', 'success-snackbar');
                  this.router.navigate(['activitygroup']);
                } else {
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
              this.selectedRowIndex = null;
               
              for (const [i, pData] of this.parameterData.entries()) {
                  if (
                      pData.activityId === '' ||
                      pData.activityId === null 
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
    const addActivityGroupArray = [];
    const updateActivityGroupArray = [];
    if (this.parameterData.length) {
      this.selectedRowIndex = null;
      for (const [i, pData] of this.parameterData.entries()) {
        if (pData.activityId === '' || pData.activityId === null ) {
          this.selectedRowIndex = i ;
          this.openSnackBar('Please enter all required fields in row ' + (i+1) , '', 'default-snackbar');
          return 'validateError';
        }
      }

      for (const [i, pData] of this.parameterData.entries()) {
        if(!pData.activityGrpDtlId){
          addActivityGroupArray.push(pData);
        }
        if(pData.activityGrpDtlId){
          updateActivityGroupArray.push(pData);
        }
      }
      data.addActivityGroupDetail = addActivityGroupArray;
      data.updateActivityGroupDetail = updateActivityGroupArray;
      return data;
    }else{
      data.addActivityGroupDetail = addActivityGroupArray;
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





