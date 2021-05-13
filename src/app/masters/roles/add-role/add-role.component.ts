import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { RolesService } from 'src/app/_services/roles.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  formTitle: string;
  isEdit = false;
  isAdd = false;
  roleId = '';
  roleName = '';
  roleEnabledFlag = true;
  roleDefault = false;
  enableFlagArray:any = [];
  tooltipPosition: TooltipPosition[] = ['below'];
  webScreens:any = [];
  mobileScreens:any = [];
  screenCategoryArray:any = [];
  screenCategoryArray1:any = [];
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  finalArray:any = [];
  saveInprogress = false;
  isExpressEnabled = false;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private rolesService: RolesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isExpressEnabled = JSON.parse(localStorage.getItem('userDetails')).expressLabelFlag === 'Y' ? true : false;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Edit Role :';
        this.isEdit = true;
        this.rolesService.getRoleById(params.id).subscribe(data => {
          if (data.status === 200) {
            this.roleId = data.result[0].roleId;
            this.roleName = data.result[0].roleName;
            this.roleEnabledFlag = data.result[0].roleEnableFlag === 'Y' ? true : false;
            this.roleDefault = data.result[0].roleDefaultFlag === 'Y' ? true : false;
            this.getAllScreenById(this.roleId);
          }
        });
      } else {
        this.formTitle = 'Add Role :';
        this.isAdd = true;
        this.getAllScreen();
      }
    })
    this.commonService.getScreenSize(121);
  }

  // function for getting all role screens
  getAllScreen() {
    this.rolesService.getAllScreens().subscribe(screens => {
      if (screens.status === 200) {
        if (screens.result.length > 0) {
          screens.result = screens.result.sort((a, b) =>  a.screenName ? a.screenName.localeCompare(b.screenName) :  a.screenName);
          for (const screen of screens.result) {
            screen.screenEnabledFlag = false;
            if (screen.screenTypes === 'Web') {
              if (!this.screenCategoryArray.includes(screen.screenCategory)) {
                this.screenCategoryArray.push(screen.screenCategory);
                this.webScreens[screen.screenCategory] = [screen];
              } else {
                this.webScreens[screen.screenCategory].push(screen);
              }
            }
            if (screen.screenTypes === 'Mobile') {
              if (!this.screenCategoryArray1.includes(screen.screenCategory)) {
                this.screenCategoryArray1.push(screen.screenCategory);
                this.mobileScreens[screen.screenCategory] = [screen];
              } else {
                this.mobileScreens[screen.screenCategory].push(screen);
              }
            }
          }
          // const tempArray = this.webScreens;
          // console.log(tempArray);
        }
         
      }
    });
  }

  // function for getting all role screens by id
  getAllScreenById(id) {
    this.rolesService.getAllScreensById(id).subscribe(screens => {
      if (screens.status === 200) {
        if (screens.result.length > 0) {
          // console.log(screens.result);
          screens.result = screens.result.sort((a, b) =>  a.screenName ? a.screenName.localeCompare(b.screenName) :  a.screenName);
          for (const screen of screens.result) {
            if (screen.screenEnabledFlag === 'Y') {
              screen.screenEnabledFlag = true;
            } else {
              screen.screenEnabledFlag = false;
            }
            if (screen.screenTypes === 'Web') {
              if (!this.screenCategoryArray.includes(screen.screenCategory)) {
                this.screenCategoryArray.push(screen.screenCategory);
                this.webScreens[screen.screenCategory] = [screen];
              } else {
                this.webScreens[screen.screenCategory].push(screen);
              }
            }
            if (screen.screenTypes === 'Mobile') {
              if (!this.screenCategoryArray1.includes(screen.screenCategory)) {
                this.screenCategoryArray1.push(screen.screenCategory);
                this.mobileScreens[screen.screenCategory] = [screen];
              } else {
                this.mobileScreens[screen.screenCategory].push(screen);
              }
            }
          }
           
          const tempArray = this.webScreens;
          console.log(tempArray);
        }
      }
    });
  }
  //on checkbox change
  onChange(element){
    let count= 0;
    let itemScreenIdArray = [90,100,120,330];  
    if(element.screenEnabledFlag && (itemScreenIdArray.includes(element.screenId))){
      this.updateItemCheckBox();
    }
    if(!element.screenEnabledFlag && element.screenId === 60){
        this.webScreens['Master'].forEach(item => {
          if(itemScreenIdArray.includes(item.screenId)){
            if(item.screenEnabledFlag){
              count++;
            }
          }         
        });
        if(count > 0){
          this.updateItemCheckBox();
        }
    }
  }
   //on item checkbox default update
  updateItemCheckBox(){    
    setTimeout(() => {
      let itemobj = this.webScreens['Master'].find(d => d.screenId === 60);
      if(!itemobj.screenEnabledFlag){
      itemobj.screenEnabledFlag = true;
      this.openSnackBar('Item screen is mandatory', '', 'default-snackbar');
      }
    }, 100);    
  }

  // on submit role
  onSubmit(submitType) {
    if (!this.roleName) {
      this.openSnackBar('Please enter the role name', '', 'default-snackbar');
      return;
    }
    let tempArrayWab = [];
    let tempArrayMobile = [];
    for (let i = 0; i < this.screenCategoryArray.length; i++) {
      tempArrayWab = tempArrayWab.concat(this.webScreens[this.screenCategoryArray[i]])
    }

    for (let i = 0; i < this.screenCategoryArray1.length; i++) {
      tempArrayMobile = tempArrayMobile.concat(this.mobileScreens[this.screenCategoryArray1[i]])
    }
    this.finalArray = tempArrayWab.concat(tempArrayMobile);
    console.log('final array: ', this.finalArray);
    
    this.finalArray.forEach(screenItem => {
      if (screenItem.screenEnabledFlag){
        this.enableFlagArray.push(screenItem.screenName);
      }
    });

    if (this.enableFlagArray.length){
      if (submitType === 'save') {
        const obj = {
          roleCompanyId: JSON.parse(localStorage.getItem('userDetails')).companyId,
          roleName: this.roleName,
          roleEnableFlag: this.roleEnabledFlag === true ? 'Y' : 'N',
          roleDefaultFlag: this.roleDefault === true ? 'Y' : 'N',
          createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          creationDate: this.rolesService.dateFormat(new Date())
        }
        this.saveInprogress = true;
        this.rolesService.addRole(obj).subscribe(data => {
          if (data.status === 200) {
            this.saveInprogress = false;
            if (data.roleId) {
              // console.log(data.roleId);
              this.addRoleScreen(data.roleId);
            }
          } else {
            this.saveInprogress = false;
            this.openSnackBar(data.message, '', 'error-snackbar');
          }
        },
        error => {
          this.saveInprogress = false;
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        })
  
      } else {
        const obj = {
          roleId: this.roleId,
          roleCompanyId: JSON.parse(localStorage.getItem('userDetails')).companyId,
          roleName: this.roleName,
          roleEnableFlag: this.roleEnabledFlag === true ? 'Y' : 'N',
          roleDefaultFlag: this.roleDefault === true ? 'Y' : 'N',
          updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
          updatedDate: this.rolesService.dateFormat(new Date())
        }
        this.rolesService.updateRole(obj).subscribe(responseData => {
          console.log(responseData);
          if (responseData.status === 200) {
            this.updateRoleScreen(this.roleId);
          } else {
            // this.openDialog('error', data.message);
            this.openSnackBar(responseData.message, '', 'error-snackbar');
          }
        })
      }
    }else{
      this.openSnackBar('Please add atleast one screen', '', 'default-snackbar');
      return;
    }

  }

  // function for adding role screens
  addRoleScreen(roleId) {
    const bodyAdd = [];
    this.finalArray.forEach(element => {
      bodyAdd.push({
        roleId: roleId,
        roleScreenId: element.screenId,
        screenEnabledFlag: element.screenEnabledFlag === true ? 'Y' : 'N',
        createdBy: JSON.parse(localStorage.getItem('userDetails')).userId
      });
    })

    this.rolesService.addRoleScreens(bodyAdd).subscribe(data => {
      if (data.status === 200) {
        // this.openDialog('success', data.message);
        this.openSnackBar(data.message, '', 'success-snackbar');
        this.backToRoleList();
      } else {
        // this.openDialog('error', data.message);
        this.openSnackBar(data.message, '', 'error-snackbar');
      }
    })
  }

  // function for update role screens
  updateRoleScreen(roleId) {
    const bodyEdit = [];
    this.finalArray.forEach(element => {
      bodyEdit.push({
        roleId: roleId,
        roleScreenAsgId: element.roleScreenAsgId,
        roleScreenId: element.roleScreenId,
        screenEnabledFlag: element.screenEnabledFlag === true ? 'Y' : 'N',
        updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId
      });
    })

    this.rolesService.updateRoleScreens(bodyEdit).subscribe(data => {
      if (data.status === 200) {
        // this.openDialog('success', data.message);
        this.openSnackBar(data.message, '', 'success-snackbar');
        this.backToRoleList();
      } else {
        // this.openDialog('error', data.message);
        this.openSnackBar(data.message, '', 'error-snackbar');
      }
    })
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

  // go to role list
  backToRoleList() {
    this.router.navigate(['roles']);
  }
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [typeClass]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.getScreenSize(121);
  }
}
