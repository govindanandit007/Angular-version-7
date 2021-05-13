import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-confirmation-iu-dialog',
  templateUrl: './confirmation-iu-dialog.component.html',
  styleUrls: ['./confirmation-iu-dialog.component.css']
})
export class ConfirmationIuDialogComponent implements OnInit {

constructor(@Inject(MAT_DIALOG_DATA) private data: any, 
  private dialogRef: MatDialogRef<ConfirmationIuDialogComponent>,   
  private router: Router,
  public commonService: CommonService
  ) { }
  messageHeader: string;
  messageBody: string;
  iuData: any;
  ngOnInit() {
    this.messageHeader = 'Confirmation';
    this.messageBody = 'Do you want to Change the IU?'
    this.iuData = this.data.data;
  }
  
  close() {
     this.commonService.setDefaultIU((JSON.parse(localStorage.getItem('defaultIU'))).id);
    this.dialogRef.close();
  }

  navigate() {
    // if(this.data.url === 'company' || this.data.url === 'operatingUnit' || this.data.url === 'inventryUnit'
    // || this.data.url === 'locatorGroup' || this.data.url === 'item' || this.data.url === 'itemRevision'){
    //   this.data.url = this.data.url+'Cancel';
    //   this.dialogRef.close(this.data);
    //   return;
    // }
            window.localStorage.setItem('defaultIU',JSON.stringify(this.iuData));
            this.commonService.setDefaultIU(this.iuData.id);
            //  this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id;
            //  this.iuCode = (JSON.parse(localStorage.getItem('defaultIU'))).code;
    this.close();
            return this.iuData
  }
  


}
