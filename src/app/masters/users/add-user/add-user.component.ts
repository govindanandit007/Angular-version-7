import { Component, OnInit, ViewChild, Renderer,TemplateRef, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/_services/users/users.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UsersComponent } from '../users.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from 'src/app/_services/roles.service';
import {  MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';

export interface ParameterDataElement {
  role_id : string,
  role_name : string,
  userRoleAssgnId : string,
  startDate: Date,
  endDate: any,
  roleEnabledFlag: any,
  action: string;
  editing: boolean;
  addNewRecord?: boolean;
  isDefault?: boolean;
  originalData?: any;
}
export interface IuParameterDataElement {
  iuId : string,
  role_name : string,
  userAssgId : string,
  startDate: Date,
  endDate: any,
  enableFlag: any,
  defaultFlag: any,
  action: string;
  editing: boolean;
  defaultIuSelected?: boolean;
  addNewRecord?: boolean;
  isDefault?: boolean;
  originalData?: any;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('userForm', { static: false }) userForm: FormGroupDirective;
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  addUserForm: FormGroup;
  formTitle: string;
  hide: boolean;
  formattedMessage: string;
  isEdit: boolean;
  isAdmin : boolean;
  systemDate : any = new Date();
  save: any = true;
  update: any = true;
  setEndDate: any = new Date(); 
  disabledRoles = [];
  disabledIU = [];
  isExpressEnabled: any = false;
  expressScreensList: any = ['Datasource','Print History','Manual Print','Rule','Label Designer','Print Manager'];
  editRolesArray: any = []
  isEditRolesHaveExpressScreen: any = false;
  isRoleContainExpressScreen: any = false;
  selectedRowIndex = null;
  iuSelectedRowIndex = null;
  confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;

  // cityList: any[] = [];
  public userImagePath;
  public messageUserLogo: string;
  userImgURL: any;
  validationMessages = {
    userName: { required: 'User Name is required.' },
    userStartDate: { required: 'Start Date is required.' },
    userEmail: { required: 'Email is required.', pattern: 'Please enter a valid email address' },
    userPassword: { required: 'Password is required.' },
    userPswdValidityDays: { min: 'Please Enter minimum value of 30' },
  }
  formErrors = {
    userName: '',
    userStartDate: '',
    userEmail: '',
    userPassword: '',
    userPswdValidityDays: '',
  }

  isEditRoles = false;
  isAdd = false;
  isImageSelected: boolean


  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('iuPaginator', { static: false }) iuPaginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  userRoles: any = [];
  userEnabledRoles: any[] = [];
  defaultUserRoles: any[] = [];
  inventoryUnitList: any[] = [];
  parameterData: ParameterDataElement [] = [];
  iuparameterData: IuParameterDataElement [] = [];

  parameterDisplayedColumns: string[] = [
      'role_id',
      'role_name',
      'startDate',
      'endDate',
      'roleEnabledFlag',
      'action'
  ];
  columns: any =  [
    {field: 'role_id', name: '#', width: 75, baseWidth: 6 },
    {field: 'role_name', name: 'Name', width: 75, baseWidth: 25 },
    {field: 'startDate', name: 'Start Date', width: 75, baseWidth: 22 },
    {field: 'endDate', name: 'End Date', width: 75, baseWidth: 23 },
    
    {field: 'userEnabledFlag', name: 'Enabled', width: 75, baseWidth: 12 },
    {field: 'action', name: 'Action', width: 75, baseWidth: 12 }
]

  iuParameterDisplayedColumns: string[] = [
      'sno',
      'iuCode',
      'startDate',
      'endDate',
      'iuEnabledFlag',
      'iuDefaultFlag',
      'action'
  ];

  iuColumns: any =  [
    {field: 'sno', name: '#', width: 75, baseWidth: 4 },
    {field: 'iuCode', name: 'Name', width: 75, baseWidth: 20 },
    {field: 'startDate', name: 'Start Date', width: 75, baseWidth: 20 },
    {field: 'endDate', name: 'End Date', width: 75, baseWidth: 20 },
    {field: 'iuEnabledFlag', name: 'Enabled', width: 75, baseWidth: 12 },
    {field: 'iuDefaultFlag', name: 'Default', width: 75, baseWidth: 12 },
    {field: 'action', name: 'Action', width: 75, baseWidth: 12 }
]
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  iuparameterDataSource = new MatTableDataSource<IuParameterDataElement>(this.iuparameterData);
  setPSWFlag: boolean = false;
  isAdminUser: boolean = false;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usersService: UsersService,
    public commonService: CommonService,
    private rolesService: RolesService,
    private usersComponent: UsersComponent,
    private snackBar: MatSnackBar,
    private render: Renderer,
    private dialog: MatDialog,
  ) {
    this.addUserFeedForm();
  }

  ngOnInit() {
    this.hide = true;
    this.isEdit = false;
    this.isImageSelected = false;
    this.isExpressEnabled = JSON.parse(localStorage.getItem('userDetails')).expressLabelFlag === 'Y' ? true : false;
     
    const endDate = new Date(this.addUserForm.controls.userStartDate.value);
    this.setEndDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1))

    this.addUserForm.patchValue({
      userCompanyId: Number(
        JSON.parse(localStorage.getItem('userDetails')).companyId
      )
    });

    this.getIuLov();
    this.getRoleLov();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit User';
        this.isEdit = true;
        this.systemDate = '';
        this.usersService
          .getUserById(params.id)
          .subscribe((data: any) => {
            console.log(data);

            this.isAdmin = data.result[0].userId === JSON.parse(localStorage.getItem('userDetails')).userId ? true : false;
            this.isAdminUser = JSON.parse(localStorage.getItem('userDetails')).userAdminFlag === 'Y'? true : false;
            data.result[0].userPassword = '';
            data.result[0].insertRoles = [];
            data.result[0].updateRoles = [];
            data.result[0].addInvUnitAsg = [];
            data.result[0].updateInvUnitAsg = [];
            data.result[0].userStartDate = new Date(data.result[0].userStartDate);
            data.result[0].userEndDate = data.result[0].userEndDate ? new Date(data.result[0].userEndDate): data.result[0].userEndDate ;
            this.addUserForm.setValue(data.result[0]);
            this.formTitle = 'Edit User : ' + data.result[0].userName;
            if (data.result[0].userImage !== null) {
              const userImgString =
                data.result[0].userImage.value;
              this.userImgURL = userImgString.slice(1, -1) === '' ? 'assets/images/default-user-profile.jpg' : userImgString.slice(1, -1);
              this.isImageSelected = true;
            }else if (
                      data.result[0].userImage === undefined ||
                      data.result[0].userImage === null
                  ) {
                      this.userImgURL = 'assets/images/default-user-profile.jpg';
            } 
            if (this.addUserForm.value.userEnabledFlag === 'Y') {
              this.addUserForm.patchValue({
                userEnabledFlag: true
              });
            }
            if (this.addUserForm.value.userEnabledFlag === 'N') {
              this.addUserForm.patchValue({
                userEnabledFlag: false
              });
            }
            if (this.addUserForm.value.userAdminFlag === 'Y') {
              this.addUserForm.patchValue({
                userAdminFlag: true
              });
            }
            if (this.addUserForm.value.userAdminFlag === 'N') {
              this.addUserForm.patchValue({
                userAdminFlag: false
              });
            }
            this.renderEditRoles(data.result[0].roles);
            this.renderEditIU(data.result[0].inv_unit_user_details);
          });
      } else {
        this.formTitle = 'Add User :';
        this.getDefaultRoles();
      }
    });
    this.commonService.getScreenSize(217);
    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
      // this.iuPaginator.pageSizeOptions = this.commonService.paginationArray;
      // this.iuPaginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
  }, 100);
}
  // process on raw input before submit
  processBeforeSubmit(data) {
    if (data.userEnabledFlag === true) {
      data.userEnabledFlag =  'Y' ;
    }
    if (
      data.userEnabledFlag === false ||
      data.userEnabledFlag === null
    ) {
      data.userEnabledFlag = 'N' ;
    }
    if (data.userAdminFlag === true) {
      data.userAdminFlag = 'Y';
    }
    if (
      data.userAdminFlag === false ||
      data.userAdminFlag === null
    ) {
      data.userAdminFlag= 'N';
    }

    data.userStartDate =  this.usersService.dateFormat(new Date(this.addUserForm.value.userStartDate));
    if (this.addUserForm.value.userEndDate ){
      data.userEndDate =  this.usersService.dateFormat(new Date(this.addUserForm.value.userEndDate));
    } else{
      data.userEndDate = null;
    }
    this.addUserForm.patchValue({
      updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId
    });
  }

  onStartDateChanged(event: any){
    let endDate = new Date(this.addUserForm.controls.userStartDate.value);
    this.setEndDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1))
  }

  logValidationErrors(group: FormGroup = this.addUserForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = ''
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          };
        }
      }
    })
  }
  openConfirmationDialog(pageName: string, url: any) {
    console.log("confirmatin call---"+ pageName);
    const confirmationDialogRef = this.dialog.open(
        ConfirmationDialogComponent,
        {
            data: { pageName: pageName, url: url },
            width: '30vw'
        }
    );
    confirmationDialogRef.afterClosed().subscribe(response => {
      console.log("user response---"+ JSON.stringify(response));
        if (
            response !== undefined &&
            response.url === 'usersCancel' && response.passwordChange === 'Y') {    
            console.log("user pass chage ok");  
            this.setPSWFlag = true;
                               
        }else{
          this.addUserForm.controls.userPassword.setValue(null);
          this.setPSWFlag = false;            
        }  
        this.isEdit = true;      
        this.onSubmit();
    });
   
}
  
  onSubmit(event?: any, formId?: any) {
    debugger
    if(event){
      event.stopImmediatePropagation();
    }else{
      this.addUserForm.patchValue({ userImage: this.userImgURL });
      if (this.addUserForm.valid) {
        
        this.selectedRowIndex = null;
        this.iuSelectedRowIndex = null;
        if (this.isEdit) {
           
          if(this.addUserForm.value.userPassword && !this.setPSWFlag){
            console.log("confirmatin from sub call---" + this.isEdit);
           this.openConfirmationDialog('PSWCHNG','users'); 
           return;          
          }
          
          if (this.addUserForm.value.userPassword === '') {
            this.addUserForm.value.userPassword = null;
          }
          
           const rolesdata = this.getRolesDataForEdit(this.addUserForm.value);
          const data = this.getIUDataForEdit(rolesdata);
          if(data === 'validateError'){
            return
          }
          this.processBeforeSubmit(data);
        
          this.update = false;
          const editData = data;
          this.usersService
            .updateUser(editData)
            .subscribe(
              data => {
                if (data.status === 200) {
                this.openSnackBar(data.message, '', 'success-snackbar');
                if(this.isExpressEnabled === true){
                  this.postUser(editData,'update');
                }else{
                  this.router.navigate(['users']);
                }
                 
                } else {
                  this.update = true;
                  this.openSnackBar(data.message, '', 'error-snackbar');
                }
              },
              error => {
                this.isEdit = true;
                this.update = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                // for(const UserRole of data) {
                //   if(this.parameterData.find(d => d.categoryId = UserRole.categoryId)) {
                //     const index = this.parameterData.indexOf(UserRole);
                //     this.parameterData[index].editing = true;
                //     this.parameterData[index].addNewRecord = true;
                //   }
                // }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
           
        } else {
          this.addUserForm.patchValue({
            createdBy: JSON.parse(localStorage.getItem('userDetails'))
              .userId
          });
          this.addUserForm.patchValue({
            updatedBy: JSON.parse(localStorage.getItem('userDetails'))
              .userId
          });
          const rolesdata = this.getRolesDataForAdd(this.addUserForm.value);
          const data = this.getIUDataForAdd(rolesdata);
          if(data === 'validateError'){
            return
          }

          this.processBeforeSubmit(data);
          this.save = false;
          const addData = data;
          this.usersService
            .createUser(addData)
            .subscribe(
              data => {
                this.save = true;
                if (data.status === 200) {
                  this.openSnackBar(data.message, '', 'success-snackbar');
                  if(this.isExpressEnabled === true){
                    this.postUser(addData,'add');
                  }else{
                    this.router.navigate(['users']);
                  }
                 
                } else {
                  this.openSnackBar(data.message, '', 'error-snackbar');
                }
              },
              error => {
                this.isAdd = true;
                this.save = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                // for(const Role of data) {
                //   Role.editing = true;
                //   Role.addNewRecord = true;
                // }
                for(const Roles of data.insertRoles) {
                  Roles.editing = true;
                  Roles.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
              }
            );
        }
      } else {
        this.addUserForm.value.userPswdValidityDays === 0 ?
        this.openSnackBar('Password validity days should be minimum 30 days', '','default-snackbar') :
        this.openSnackBar('Please check mandatory fields', '', 'default-snackbar');
      }
    }
  }



  postUser(roleDate,type){
    const rolesArray = type === 'update' ? roleDate.updateRoles : roleDate.insertRoles;
     
    for (const rowData of rolesArray) {
      for (const rowData1 of this.userRoles ) {
        if(rowData.userRoleId === rowData1.id){
          for (const rowData2 of rowData1.screens ) {
            for (const rowData3 of  this.expressScreensList ) {
              if(rowData2.screenName  === rowData3){
                    this.isRoleContainExpressScreen = true;
              }
            }
          }
        }
      }
    }

    if( type === 'add' && this.isRoleContainExpressScreen === false ){
      this.router.navigate(['users']);
      return
    }
    
    const userData = this.userForm.value;
    const data = {
        Name        : userData.userEmail,
        Email       : userData.userEmail,
        Password    : userData.userPassword,
        Company     : Number(userData.userCompanyId),
        Type        : userData.userAdminFlag === true ? 'Admin' : 'User',
        IsActive    : 1
    }
    if(type === 'update' && this.isEditRolesHaveExpressScreen === true && this.isRoleContainExpressScreen === false){
      data.IsActive = 0;
    }
    if(type === 'update' && this.isEditRolesHaveExpressScreen === false && this.isRoleContainExpressScreen === false){
      this.router.navigate(['users']);
      return
    }
  
    
  
    this.usersService
        .postUser(data)
        .subscribe(
          (resultData: any) => {
             
            if (resultData.id) {
                this.openSnackBar('', '', 'success-snackbar');
                this.router.navigate(['users']);
            } else {
              this.openSnackBar(resultData.message, '', 'error-snackbar');
            }
          },
          error => {
             
            if(error.status === 200){
              this.openSnackBar(error.error.text, '', 'success-snackbar');
              this.router.navigate(['users']);
            }else{
              this.openSnackBar(error.error, '', 'error-snackbar');
              this.update = true;
              this.disabledRoles = [];
            }
          }
        );
}

  addUserFeedForm() {
    this.addUserForm = this.fb.group({
      userCompanyId: ['', Validators.required],
      userDescription: [''],
      userEmail: ['', [Validators.required,
      // tslint:disable-next-line: max-line-length
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      userEnabledFlag: [true],
      userAdminFlag: [false],
      userEndDate: [null],
      roles: [null],
      inv_unit_user_details: [null],
      insertRoles: [null],
      updateRoles: [null],
      addInvUnitAsg: [null],
      updateInvUnitAsg: [null],
      userId: [''],
      userImage: [''],
      userName: ['', Validators.required],
      userPassword: [
        '',
        this.isEdit === false ? Validators.required : ''
      ],
      userPswdValidityDays: [30, Validators.min(30)],
      userStartDate: [
        this.usersService.dateFormat(new Date()),
        Validators.required
      ],
      createdBy: [''],
      creationDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
  }
  preview(files: any, fromId: string) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageUserLogo = 'Only images are supported.';
      return;
    }

    const fileSize = files[0].size / 1024; // in MB
    if (fileSize > 256) {
      this.messageUserLogo = 'user Image size exceeds 256 KB.';
      return;
    }
    this.messageUserLogo = '';
    const reader = new FileReader();
    this.userImagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = event => {
      this.isImageSelected = true;
      this.userImgURL = reader.result;
    };
  }

  // Resetting image file
  changeImage() {
    this.userImgURL = '';
    this.isImageSelected = false;
  }

  backToUserList() {
    this.router.navigate(['users']);
  }


  // Code for roles ------------------- Start ---------------------
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
          this.isEditRoles = true;
      } else {
      }
  }

  disableEdit(rowData: any, index: any) {
    this.selectedRowIndex = null;
    if (this.parameterData[index].editing === true) {

        this.parameterData[index].endDate          = this.parameterData[index].originalData.endDate;
        this.parameterData[index].isDefault        = this.parameterData[index].originalData.isDefault;
        this.parameterData[index].roleEnabledFlag  = this.parameterData[index].originalData.roleEnabledFlag;
        this.parameterData[index].role_id          = this.parameterData[index].originalData.role_id;
        this.parameterData[index].role_name        = this.parameterData[index].originalData.role_name;
        this.parameterData[index].startDate        = this.parameterData[index].originalData.startDate;
        this.parameterData[index].userRoleAssgnId  = this.parameterData[index].originalData.userRoleAssgnId;

        this.parameterData[index].editing = false;
        this.isEditRoles = false;

    };
}

// 
    addIuList(templateRef: TemplateRef<any>, call?: any){
      this.iuSelectedRowIndex = null;
         setTimeout(() => {
      // this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      // this.paginator.pageSizeOptions = this.commonService.paginationArray;
      // this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
      this.iuPaginator.pageSizeOptions = this.commonService.paginationArray;
      this.iuPaginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
  }, 2000);
      this.dialog.open(templateRef, {
          autoFocus: false,
          minWidth: 600
        });
   
    
  }
   saveIUData(data){

     if(data === 'Save'){
this.disabledIU = [];
  let haveDefaultFlag = false;
      // if(this.iuparameterData.includes(this.iuparameterData[i].defaultFlag)){
      //    this.openSnackBar('Please select atleast one default IU' + (i + 1),'','default-snackbar');
      //     return ;
      //   }
    for (const [i, pData] of this.iuparameterData.entries()) {
       if(!this.disabledIU.includes(pData.iuId)){
          this.disabledIU.push(pData.iuId);
        }
        else{
          this.iuSelectedRowIndex = i;
          this.openSnackBar('Duplicate IU Record ','','default-snackbar');
          // this.openSnackBar('Iu name can not be same in row ' + (i + 1),'','default-snackbar');
          return ;
        }
   if( this.iuparameterData[i].startDate == undefined || this.iuparameterData[i].iuId === '' ){
            this.iuSelectedRowIndex = i;
            this.openSnackBar('Please fill required fields in row ' + (i + 1) + ' for IU','','default-snackbar');
            //this.openSnackBar('Enter value in all fields','','default-snackbar');
            return 'validateError';
          }
   
  
    }

    for (const [i, pData] of this.iuparameterData.entries()) {
    if (pData.defaultFlag === true) {
        haveDefaultFlag = true;
        break;
      }
    }
    if(haveDefaultFlag == false){
          this.openSnackBar('Please select atleast one default IU' ,'','default-snackbar');
          return
    }
     }
  
    // if(noItemSelected){
    //   this.ClassList.find( x => {
    //      if(x.id === classid)
    //      {
    //        x.select = false;
    //      }    
    //   });
    //   if(this.itemSelectAll){
    //     this.itemSelectAll = false;
    //   }
    // }
     this.dialog.closeAll();
  }
  beginIuEdit(rowData: any, $event: any) {
      for (const pData of this.iuparameterData) {
          if (pData.addNewRecord === true) {
              this.openSnackBar('Please add your records first.', '','default-snackbar');
              return;
          }
      }
      if (rowData.editing === false) {
          rowData.editing = true;
          this.isAdd = false;
          // this.isEditRoles = true;
      } else {
      }
  }

  disableIuEdit(rowData: any, index: any) {
    this.iuSelectedRowIndex = null;
    if (this.iuparameterData[index].editing === true) {

        this.iuparameterData[index].endDate          = this.iuparameterData[index].originalData.endDate;
        this.iuparameterData[index].isDefault        = this.iuparameterData[index].originalData.isDefault;
        this.iuparameterData[index].enableFlag  = this.iuparameterData[index].originalData.enableFlag;
        this.iuparameterData[index].iuId          = this.iuparameterData[index].originalData.iuId;
        this.iuparameterData[index].role_name        = this.iuparameterData[index].originalData.role_name;
        this.iuparameterData[index].startDate        = this.iuparameterData[index].originalData.startDate;
        this.iuparameterData[index].userAssgId  = this.iuparameterData[index].originalData.userAssgId;

        this.iuparameterData[index].editing = false;
        // this.isEditRoles = false;

    };
}


  deleteIuRow(rowData: any, rowIndex: number) {
      this.iuSelectedRowIndex = null;
      this.iuparameterData.splice(rowIndex, 1);
      this.iuparameterDataSource = new MatTableDataSource<
          IuParameterDataElement
      >(this.iuparameterData);
      this.iuparameterDataSource.paginator = this.iuPaginator;
      this.checkIsIuAddRow();
  }
  checkIsIuAddRow(){
      let cnt = 0;
      const pLength = this.iuparameterData.length;
      for(const pdata of this.iuparameterData){
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
  deleteRow(rowData: any, rowIndex: number) {
      this.selectedRowIndex = null;
      this.parameterData.splice(rowIndex, 1);
      this.parameterDataSource = new MatTableDataSource<
          ParameterDataElement
      >(this.parameterData);
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

  addRow() {
    this.paginator.pageIndex = 0;
    for (const pData of this.parameterData) {
        if (pData.editing === true && pData.addNewRecord === false) {
            this.openSnackBar('Please update your records first.', '','default-snackbar');
            return;
        }
    }
    this.isAdd = true;
    this.isEditRoles = false;
    this.parameterData.unshift({
      role_id : '',
      role_name: '',
      userRoleAssgnId : '',
      startDate: new Date(),
      endDate: '',
      roleEnabledFlag: true,
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false
    });

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
  }
  iuAddRow() {
    this.iuSelectedRowIndex = null;
    this.iuPaginator.pageIndex = 0;
    for (const pData of this.iuparameterData) {
        if (pData.editing === true && pData.addNewRecord === false) {
            this.openSnackBar('Please update your records first.', '','default-snackbar');
            return;
        }
    }
    this.isAdd = true;
    // this.isEditRoles = false;
    this.iuparameterData.unshift({
      iuId : this.iuparameterData.length ? '' : (JSON.parse(localStorage.getItem('defaultIU'))).id,
      role_name: '',
      userAssgId : '',
      startDate: new Date(),
      endDate: '',
      enableFlag: true,
      defaultFlag: false,
      action: '',
      editing: true,
      addNewRecord: true,
      isDefault: false
    });
    // this.defaultIuSelectionChange()

    this.iuparameterDataSource = new MatTableDataSource<IuParameterDataElement>(this.iuparameterData);
    this.iuparameterDataSource.paginator = this.iuPaginator;
  }
  // Default IU selection change
  defaultIuSelectionChange(index){
    let selectRowCount = 0;
   for (const [i, pData] of this.iuparameterData.entries()) {
     if( i === index){
       pData.defaultFlag = this.iuparameterData[i].defaultFlag;
     }else{
       pData.defaultFlag = false;
     }
   }
  }
  
// Get IU LOV
  getIuLov(){
    this.commonService.getIULOV().subscribe( (data: any) => {
      this.inventoryUnitList = [{
        value: '',
        label: 'Please Select',
        name: 'Please Select'
      }];
      if (data.status === 200) {
          for (const iuData of data.result) {
              this.inventoryUnitList.push({
                value: iuData.iuId,
                label: iuData.iuCode,
                name: iuData.iuName
              });
            }
      } else {
         
        this.openSnackBar(data.error.message, '', 'error-snackbar');
      }
    },
    (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
    });
  }
  getRoleLov(){
    this.commonService.getSearchLOV('ROLE').subscribe( (data: any) => {
      this.userRoles = [];
      this.userEnabledRoles = [];
      this.defaultUserRoles = [];
      if (data.status === 200) {
        for(let i=0; i<data.result.length; i++){
          if (data.result[i].defaultFlag === 'N'){
            this.defaultUserRoles.push(data.result[i])
          }
          if(data.result[i].enabledFlag === 'Y' && data.result[i].defaultFlag === 'N'){
            this.userEnabledRoles.push(data.result[i]);
          }
          this.userRoles.push(data.result[i]);
        }
      } else {
        
        this.openSnackBar(data.error.message, '', 'error-snackbar');
      }
    },
    (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
    });
  }

  getDefaultRoles(){
    let body = {};
    body = {
      roleCompanyId: ''+JSON.parse(localStorage.getItem('userDetails')).companyId + '',
      roleDefaultFlag: 'Y',
      roleEnableFlag: 'Y'
    };

    this.usersService.getDefaultRoles(body).subscribe(data => {
        if(data.status === 200 && data.result.length){
             for(var i=0; i<data.result.length; i++){
                this.parameterData.push({
                  role_id : data.result[i].roleId,
                  role_name : data.result[i].roleName,
                  startDate: new Date(),
                  endDate: '',
                  roleEnabledFlag: data.result[i].roleEnableFlag,
                  userRoleAssgnId : '',
                  action: '',
                  editing: false,
                  addNewRecord: false,
                  isDefault: true
                });
             }

              this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
              this.parameterDataSource.paginator = this.paginator;
        } else {
           
          this.openSnackBar(data.message, '', 'error-snackbar');
        }
    },
    (error: any) => {
         
        this.openSnackBar(error.error.message, '', 'error-snackbar');
    }
    );
  }

  renderEditRoles(data){
    
      for(var i=0; i<data.length; i++){
        const obj = {
          role_id : data[i].userRoleId,
          role_name :'',
          startDate: new Date(data[i].userRoleStartDate),
          endDate: data[i].userRoleEndDate? new Date(data[i].userRoleEndDate): data[i].userRoleEndDate ,
          roleEnabledFlag: data[i].userRoleEnabledFlag === 'Y'? true : false,
          action: '',
          editing: false,
          userRoleAssgnId : data[i].userRoleAssgnId,
          addNewRecord: false,
          isDefault: data[i].roleDefaultFlag  === 'Y'? true : false

        }
        this.editRolesArray.push({
          userRoleId    : data[i].userRoleId,
          userRoleName  : data[i].userRoleName
        })
        obj['originalData'] = Object.assign({}, obj);
        this.parameterData.push(obj);
      }

      this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
      this.parameterDataSource.paginator = this.paginator;
      
      for (const rowData of this.editRolesArray) {
        for (const rowData1 of this.userRoles ) {
          if(rowData.userRoleId === rowData1.id){
            for (const rowData2 of rowData1.screens ) {
              for (const rowData3 of  this.expressScreensList ) {
                if(rowData2.screenName  === rowData3){
                      this.isEditRolesHaveExpressScreen = true;
                }
              }
            }
          }
        }
      }

  }
  renderEditIU(data){
    
      for(var i=0; i<data.length; i++){
        const obj = {
          iuId : data[i].iuId,
          role_name :'',
          startDate: new Date(data[i].startDate),
          endDate: data[i].endDate? new Date(data[i].endDate): data[i].endDate ,
          enableFlag: data[i].enableFlag === 'Y'? true : false,
          defaultFlag: data[i].defaultFlag === 'Y'? true : false,
          action: '',
          editing: false,
          userAssgId : data[i].userAssgId,
          addNewRecord: false,
          isDefault: data[i].roleDefaultFlag  === 'Y'? true : false

        }
        // this.editRolesArray.push({
        //   userRoleId    : data[i].userRoleId,
        //   userRoleName  : data[i].userRoleName
        // })
        obj['originalData'] = Object.assign({}, obj);
        this.iuparameterData.push(obj);
      }

      this.iuparameterDataSource = new MatTableDataSource<IuParameterDataElement>(this.iuparameterData);
      this.iuparameterDataSource.paginator = this.iuPaginator;
      
      // for (const rowData of this.editRolesArray) {
      //   for (const rowData1 of this.userRoles ) {
      //     if(rowData.userRoleId === rowData1.id){
      //       for (const rowData2 of rowData1.screens ) {
      //         for (const rowData3 of  this.expressScreensList ) {
      //           if(rowData2.screenName  === rowData3){
      //                 this.isEditRolesHaveExpressScreen = true;
      //           }
      //         }
      //       }
      //     }
      //   }
      // }

  }
 getIUDataForAdd(data){
    delete data['inv_unit_user_details'];
    let iuObject = {};
    const iuArray  = [];
    this.disabledIU = [];
  let haveDefaultFlag = false;
    if(this.iuparameterData.length){
        for (const [i, pData] of this.iuparameterData.entries()) {
    if (pData.defaultFlag === true) {
        haveDefaultFlag = true;
        break;
      }
    }
    if(haveDefaultFlag == false){
          this.openSnackBar('Please select atleast one default IU' ,'','default-snackbar');
          return
    }
      for(let i=0; i<this.iuparameterData.length; i++){
          if( this.iuparameterData[i].startDate == undefined || this.iuparameterData[i].iuId === '' ){
            this.iuSelectedRowIndex = i;
            this.openSnackBar('Please fill required fields in row ' + (i + 1) + 'for IU','','default-snackbar');
            //this.openSnackBar('Enter value in all fields','','default-snackbar');
            return 'validateError';
          }
            // for (const [i, pData] of this.iuparameterData.entries()) {
          if(!this.disabledIU.includes(this.iuparameterData[i].iuId)){
            this.disabledIU.push(this.iuparameterData[i].iuId);
          }
          else{
            this.iuSelectedRowIndex = i;
            // this.openSnackBar('IU name can not be same in row ' + (i + 1),'','default-snackbar');
            this.openSnackBar('Duplicate IU Record ','','default-snackbar');

            return 'validateError';
          }
            if (this.iuparameterData[i].defaultFlag === true){
              this.iuparameterData[i].defaultFlag = 'Y'
            }
            if (this.iuparameterData[i].defaultFlag === false){
              this.iuparameterData[i].defaultFlag = 'N'

            }
            if (this.iuparameterData[i].enableFlag === true){
              this.iuparameterData[i].enableFlag = 'Y'
            }
            if (this.iuparameterData[i].enableFlag === false){
              this.iuparameterData[i].enableFlag = 'N'

            }
            iuObject['iuId'] = Number(this.iuparameterData[i].iuId);
            iuObject['defaultFlag'] = this.iuparameterData[i].defaultFlag ;
            iuObject['enableFlag']      = this.iuparameterData[i].enableFlag;
            iuObject['startDate']   = this.usersService.dateFormat(this.iuparameterData[i].startDate);
            iuObject['endDate']   = this.iuparameterData[i].endDate ? this.usersService.dateFormat(this.iuparameterData[i].endDate) : null;
            iuObject['createdBy']   = JSON.parse(localStorage.getItem('userDetails')).userId;
            iuArray.push(iuObject)
            iuObject = {};
      }

      data['addInvUnitAsg'] = iuArray
      return data;
    } else{
      this.openSnackBar('Please assign a IU for this user', '', 'default-snackbar');
      return
    }

  }

 getIUDataForEdit(data){
    delete data['inv_unit_user_details'];
    let iuObject = {};
    const updateIUArray  = [];
    const insertiUArray  = [];
    this.disabledIU = [];
      let haveDefaultFlag = false;
    if(this.iuparameterData.length){
        for (const [i, pData] of this.iuparameterData.entries()) {
    if (pData.defaultFlag === true) {
        haveDefaultFlag = true;
        break;
      }
    }
    if(haveDefaultFlag == false){
          this.openSnackBar('Please select atleast one default IU' ,'','default-snackbar');
          return
    }
      for(var i=0; i<this.iuparameterData.length; i++){
        
        if( this.iuparameterData[i].startDate == undefined || this.iuparameterData[i].iuId == "" ){
         // this.openSnackBar('Enter value in all fields','','default-snackbar');
         this.iuSelectedRowIndex = i;
          this.openSnackBar('Please fill required fields in row ' + (i + 1),'','default-snackbar');
          return 'validateError';
        }
        if(!this.disabledIU.includes(this.iuparameterData[i].iuId)){
          this.disabledIU.push(this.iuparameterData[i].iuId);
        }
        else{
          this.iuSelectedRowIndex = i;
          // this.openSnackBar('IU name can not be same in row ' + (i + 1),'','default-snackbar');
          this.openSnackBar('Duplicate IU Record ','','default-snackbar');

          return 'validateError';
        }
        if(this.iuparameterData[i].userAssgId){
          // iuObject['userRoleEnabledFlag'] = this.iuparameterData[i].roleEnabledFlag == true ? "Y" : "N";
          // iuObject['userRoleEndDate']     = this.iuparameterData[i].endDate ? this.usersService.dateFormat(this.iuparameterData[i].endDate) : null ;
          // iuObject['userRoleId']          = this.iuparameterData[i].role_id;
          // iuObject['userRoleStartDate']   = this.iuparameterData[i].startDate ? this.usersService.dateFormat(this.iuparameterData[i].startDate) : null;
          
            iuObject['iuId'] = Number(this.iuparameterData[i].iuId);
            iuObject['defaultFlag'] = this.iuparameterData[i].defaultFlag == true ? "Y" : "N";
            iuObject['enableFlag']      = this.iuparameterData[i].enableFlag == true ? "Y" : "N";
            iuObject['startDate']   = this.iuparameterData[i].startDate ? this.usersService.dateFormat(this.iuparameterData[i].startDate) : null;
            iuObject['endDate']   = this.iuparameterData[i].endDate ? this.usersService.dateFormat(this.iuparameterData[i].endDate) : null;
            iuObject['userAssgId']     = this.iuparameterData[i].userAssgId;
            iuObject['updatedBy']   = JSON.parse(localStorage.getItem('userDetails')).userId;

          updateIUArray.push(iuObject)
          iuObject = {};
        }else{
          // iuObject['userRoleEnabledFlag'] = this.iuparameterData[i].roleEnabledFlag == true ? "Y" : "N";
          // iuObject['userRoleEndDate']     = this.iuparameterData[i].endDate ? this.usersService.dateFormat(this.iuparameterData[i].endDate) : null ;
          // iuObject['userRoleId']          = this.iuparameterData[i].role_id;
          // iuObject['userRoleStartDate']   = this.iuparameterData[i].startDate ? this.usersService.dateFormat(this.iuparameterData[i].startDate) : null;
            iuObject['iuId'] = Number(this.iuparameterData[i].iuId);
            iuObject['defaultFlag'] = this.iuparameterData[i].defaultFlag == true ? "Y" : "N";
            iuObject['enableFlag']      = this.iuparameterData[i].enableFlag == true ? "Y" : "N";
            iuObject['startDate']   = this.iuparameterData[i].startDate ? this.usersService.dateFormat(this.iuparameterData[i].startDate) : null;
            iuObject['endDate']   = this.iuparameterData[i].endDate ? this.usersService.dateFormat(this.iuparameterData[i].endDate) : null;
            iuObject['createdBy']   = JSON.parse(localStorage.getItem('userDetails')).userId;
          insertiUArray.push(iuObject)
          iuObject = {};
        }

      }
      data['updateInvUnitAsg'] = updateIUArray;
      data['addInvUnitAsg'] = insertiUArray;
      return data;
    }else{
      this.openSnackBar('Please assign a IU for this user', '', 'default-snackbar');
      return
    }

  }
  getRolesDataForAdd(data){
    delete data['roles'];
    let roleObject = {};
    const roleArray  = [];
    this.disabledRoles = [];
    if(this.parameterData.length){
      for(let i=0; i<this.parameterData.length; i++){
          if( this.parameterData[i].startDate == undefined || this.parameterData[i].role_id === '' ){
            this.selectedRowIndex = i;
            this.openSnackBar('Please fill required fields in row ' + (i + 1),'','default-snackbar');
            //this.openSnackBar('Enter value in all fields','','default-snackbar');
            return 'validateError';
          }
          
          if(!this.disabledRoles.includes(this.parameterData[i].role_id)){
            this.disabledRoles.push(this.parameterData[i].role_id);
          }
          else{
            this.selectedRowIndex = i;
            this.openSnackBar('Role name can not be same in row ' + (i + 1),'','default-snackbar');
            //this.openSnackBar('Role name can not be same','','default-snackbar');
            return 'validateError';
          }
            if (this.parameterData[i].roleEnabledFlag === true){
              this.parameterData[i].roleEnabledFlag = 'Y'
            }
            if (this.parameterData[i].roleEnabledFlag === false){
              this.parameterData[i].roleEnabledFlag = 'N'

            }
            roleObject['userRoleEnabledFlag'] = this.parameterData[i].roleEnabledFlag;
            roleObject['userRoleEndDate'] = this.parameterData[i].endDate ? this.usersService.dateFormat(this.parameterData[i].endDate) : null;
            roleObject['userRoleId']          = Number(this.parameterData[i].role_id);
            roleObject['userRoleStartDate']   = this.usersService.dateFormat(this.parameterData[i].startDate);
            roleArray.push(roleObject)
            roleObject = {};
      }

      data['insertRoles'] = roleArray
      return data;
    } else{
      this.openSnackBar('Please set a role for this user', '', 'default-snackbar');
      return
    }

  }

  
  getRolesDataForEdit(data){
    delete data['roles'];
    let roleObject = {};
    const updateRoleArray  = [];
    const insertRoleArray  = [];
    this.disabledRoles = [];

    if(this.parameterData.length){
      for(var i=0; i<this.parameterData.length; i++){
        
        if( this.parameterData[i].startDate == undefined || this.parameterData[i].role_id == "" ){
         // this.openSnackBar('Enter value in all fields','','default-snackbar');
         this.selectedRowIndex = i;
          this.openSnackBar('Please fill required fields in row ' + (i + 1),'','default-snackbar');
          return 'validateError';
        }
        if(!this.disabledRoles.includes(this.parameterData[i].role_id)){
          this.disabledRoles.push(this.parameterData[i].role_id);
        }
        else{
          this.selectedRowIndex = i;
          this.openSnackBar('Role name can not be same in row ' + (i + 1),'','default-snackbar');
          return 'validateError';
        }
        if(this.parameterData[i].userRoleAssgnId){
          roleObject['userRoleEnabledFlag'] = this.parameterData[i].roleEnabledFlag == true ? "Y" : "N";
          roleObject['userRoleEndDate']     = this.parameterData[i].endDate ? this.usersService.dateFormat(this.parameterData[i].endDate) : null ;
          roleObject['userRoleId']          = this.parameterData[i].role_id;
          roleObject['userRoleStartDate']   = this.parameterData[i].startDate ? this.usersService.dateFormat(this.parameterData[i].startDate) : null;
          roleObject['userRoleAssgnId']     = this.parameterData[i].userRoleAssgnId;
          updateRoleArray.push(roleObject)
          roleObject = {};
        }else{
          roleObject['userRoleEnabledFlag'] = this.parameterData[i].roleEnabledFlag == true ? "Y" : "N";
          roleObject['userRoleEndDate']     = this.parameterData[i].endDate ? this.usersService.dateFormat(this.parameterData[i].endDate) : null ;
          roleObject['userRoleId']          = this.parameterData[i].role_id;
          roleObject['userRoleStartDate']   = this.parameterData[i].startDate ? this.usersService.dateFormat(this.parameterData[i].startDate) : null;
          insertRoleArray.push(roleObject)
          roleObject = {};
        }

      }
      data['updateRoles'] = updateRoleArray;
      data['insertRoles'] = insertRoleArray;
      return data;
    }

  }

  blankEndDate(event: any, index: any){
    // this.parameterData[index].endDate =  this.parameterData[index].startDate;
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3000,
        panelClass: [typeClass]
    });
}

@HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.getScreenSize(217);
  }
}