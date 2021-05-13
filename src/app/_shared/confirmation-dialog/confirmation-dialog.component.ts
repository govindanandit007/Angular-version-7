import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';



@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, 
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>,   
  private router: Router
  ) { }
  messageHeader: string;
  messageBody: string;
  url: string;
  ngOnInit() {
    this.messageHeader = 'Confirmation';
    // this.messageBody = 'Are you sure you want to cancel this ' + this.data.pageName
    if(this.data.pageName === '3PLADD'){
      this.messageBody = `Do you want to create ${(this.data.url === 'locatorGroup') ? 'LG' : (this.data.url === 'stocklocators') ? 'locator' : 'Item' } without selecting customer name?`
    }else if(this.data.pageName === '3PLEDIT'){
      this.messageBody = `Do you want to update ${(this.data.url === 'locatorGroup') ? 'LG' : (this.data.url === 'stocklocators') ? 'locator' : 'Item' } without selecting customer name?`
    }else if(this.data.pageName === 'PSWCHNG'){
      this.messageBody = ' Do you want to update the password?'
    }    
    else{
      this.messageBody = 'Do you want to leave this page and discard your changes?'
    }
    this.url = this.data.url;
  }
  
  close() {
    this.dialogRef.close();
  }

  navigate() {
    if(this.data.url === 'company' || this.data.url === 'operatingUnit' || this.data.url === 'inventryUnit'
    || this.data.url === 'locatorGroup' || this.data.url === 'stocklocators' || this.data.url === 'item' || this.data.url === 'itemRevision' 
    || this.data.url === 'policy' || (this.data.url === 'users' && this.data.pageName === 'PSWCHNG')){
      if(this.data.pageName === '3PLADD' || this.data.pageName === '3PLEDIT'){
        this.data.customerAdd = 'N';
      }else{
        this.data.customerAdd = 'Y';
      }
      if(this.data.pageName === 'PSWCHNG'){
        this.data.passwordChange = 'Y';
      }      
      this.data.url = this.data.url+'Cancel';
      this.dialogRef.close(this.data);
      return;
    }
    // if(this.data.url === 'operatingUnit'){
    //     this.data.url = 'operatingUnitCancel'
    //     this.dialogRef.close(this.data);
    //     return;
    // }
    // if(this.data.url === 'inventryUnit'){
    //     this.data.url = 'inventryUnitCancel'
    //     this.dialogRef.close(this.data);
    //     return;
    // }
    // if(this.data.url === 'locatorGroup'){
    //   this.data.url = 'locatorGroupCancel'
    //   this.dialogRef.close(this.data);
    //   return;
    // }
    // if(this.data.url === 'item'){
    //   this.data.url = 'itemCancel'
    //   this.dialogRef.close(this.data);
    //   return;
    // }
    // if(this.data.url === 'itemRevision'){
    //   this.data.url = 'itemRevisionCancel'
    //   this.dialogRef.close(this.data);
    //   return;
    // }
    this.close();
    this.router.navigate([this.data.url]);
  }
  

}
