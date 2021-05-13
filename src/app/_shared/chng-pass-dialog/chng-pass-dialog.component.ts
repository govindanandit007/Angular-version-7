import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { AutheticationService } from 'src/app/_services/authetication.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-chng-pass-dialog',
  templateUrl: './chng-pass-dialog.component.html',
  styleUrls: ['./chng-pass-dialog.component.css']
})
export class ChngPassDialogComponent implements OnInit {

  oldPassword     : any = '';
  newPassword     : any = '';
  confirmPassword : any = '';

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public commonService: CommonService, 
    public authService : AutheticationService,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
  }

  changePassword(){
    if( this.newPassword !== this.confirmPassword ){
      this.openSnackBar("New password doesn't match confirm password",'','default-snackbar');
      return;
    }else if( this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '' ){
        this.openSnackBar("Please fill the all fields",'','default-snackbar');
        return;
    }

    this.commonService.changePassword(this.oldPassword, this.newPassword)
    .subscribe(
        (data: any) => {

            if (data.status === 200) {
              this.authService.logout()
              this.openSnackBar(data.message,'','success-snackbar');
            } else {
                this.openSnackBar(data.message,'','error-snackbar');
            }
        },
        (error: any) => {
            this.openSnackBar(error.error.message,'','error-snackbar');
        }
    );
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

}
