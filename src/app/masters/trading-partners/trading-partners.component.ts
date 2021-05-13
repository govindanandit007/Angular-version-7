import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatStepper, MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-trading-partners',
  templateUrl: './trading-partners.component.html',
  styleUrls: ['./trading-partners.component.css']
})
export class TradingPartnersComponent implements OnInit {

  steps = ['', 'tradingpartnersites'];

  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  constructor(
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  selectionChanged(event: any) {
    const step = this.steps[event.selectedIndex];
    this.router.navigate(['tradingpartners/' + step]);
  }

  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
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
