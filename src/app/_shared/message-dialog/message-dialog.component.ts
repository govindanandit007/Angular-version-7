import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<MessageDialogComponent>) { }
  messageHeader: string;
  messageBody: string;
  ngOnInit() {
    this.messageHeader = this.data.type ? this.data.type : ''
    this.messageBody = this.data.message ? this.data.message : ''
  }
  // close() {
  //   this.dialogRef.close();
  // }
  close() {
    this.dialogRef.close('Thanks for using me!');
  }
  //   openDialog(type, message) {
  //     this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
  //         data: {
  //             type: type,
  //             message: message
  //         }
  //     })
  // }
}
