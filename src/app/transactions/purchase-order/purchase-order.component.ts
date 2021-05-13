import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  messageDialogRef: MatDialogRef<MessageDialogComponent>;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }


  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        type: dialogType,
        message: dialogMessage
      }
    });
  }

}
