import { Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Optional,
  Inject,
  OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { ReceiptsService } from 'src/app/_services/transactions/receipts.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface ParameterDataElement {
    s_no: string;
    receipt_no : string;
    int_shipment_no : string;
    ou : string;
    tradingPartner : string;
    tradingPartnerSite : string;
    userName : string;
    sourceCode : string;
    billOfLanding : string;
    way_air_bill : string;
    packingSlip : string;
    grossWeight : string;
    netWeight : string;
    tarWeight : string;
    sourceDoc : string;
    action: string;
}

@Component({
    selector: 'app-receipt-list',
    templateUrl: './receipt-list.component.html',
    styleUrls: ['./receipt-list.component.css'],
    providers: [ReceiptsService]
})
export class ReceiptListComponent implements OnInit {

  listProgress = false;
  private searchInfoArrayunsubscribe: any;
  parameterData: ParameterDataElement[] = [{
    s_no : '',
    receipt_no: 'asdas dsa dasda',
    int_shipment_no: 'asdas dasdasd asdasd',
    ou: '',
    tradingPartner: '',
    tradingPartnerSite: '',
    userName: '',
    sourceCode: '',
    billOfLanding: '',
    way_air_bill: '',
    packingSlip: '',
    grossWeight: '',
    netWeight: '',
    tarWeight: '',
    sourceDoc: '',
    action: ''
   }];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
    's_no',
    'receipt_no',
    'int_shipment_no',
    'ou',
    'tradingPartner',
    'tradingPartnerSite',
    'userName',
    'sourceCode',
    'sourceDoc',
    'billOfLanding',
    'way_air_bill',
    'packingSlip',
    'grossWeight',
    'netWeight',
    'tarWeight',
    'action'
  ];
  receiptTableMessage = '';
//   receiptTableMessage = 'No receipt defined.';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  showSearch = true;

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/receipt-search.json');
  dataResult = false;

  constructor( 
    private snackBar: MatSnackBar,
    private receiptService: ReceiptsService,
    public commonService: CommonService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router
    ){
       this.searchEnable = true;
    }

    ngOnInit() {
      this.searchJson.subscribe((data: any) => {
          this.dataForSearch = data;
          this.searchReceipts();
          this.searchForReceipts();
      });
      setTimeout(() => {
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
    }, 100);
    }

    searchReceipts() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {
                this.parameterData = [];
                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
                if (searchInfo.searchType === 'receipt') {
                    this.listProgress = true;
                    this.receiptService
                        .getReceiptSearch(searchInfo.searchArray)
                        .subscribe(data => {
                            if (data.status === 200) {
                                if (!data.message) {
                                    this.listProgress = false;
                                    this.dataResult = true;
                                    for (const rData of data.result) {
                                        rData.action = '';
                                        this.parameterData.push(rData);
                                    }
                                    this.parameterDataSource = new MatTableDataSource<
                                        ParameterDataElement
                                    >(this.parameterData);
                                    this.parameterDataSource.paginator = this.paginator;
                                } else {
                                    this.listProgress = false;
                                    this.dataResult = false;
                                    this.receiptTableMessage = data.message;
                                }
                            } else {
                                this.listProgress = false;
                                this.openSnackBar(data.message, '', 'error-snackbar');
                            }
                        });
                }
            }
        );
    }

    // search for receipt
    searchForReceipts() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

     // show / hide search section
     getSearchToggle(searchToggle: boolean) {
        // console.log('searchToggle');
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    goFor(type: string, element?:any) {
       
      if (type === 'view') {
          const dialogData = [];
          dialogData.push(element);
          const dialogRef = this.dialog.open(ReceiptViewDialogComponent, {
              width: '100vw',
              data: dialogData
          });
        //   console.log(dialogData);
          dialogRef.afterClosed().subscribe(response => {
              if (response !== undefined) {
                this.goFor('edit', response);
              }
          });
      } else if(type === 'add'){
        this.router.navigate(['receipts/addReceipt']);
      } else {
          this.router.navigate(['receipts/editReceipt/' + element]);
      }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }

  
  



}




@Component({
  selector: 'app-receipt-view-dialog',
  templateUrl: './receipt-view-dialog.html',
  styleUrls: ['./receipt-list.component.css']
})
export class ReceiptViewDialogComponent {
  receiptViewdColumns: string[] = [
      'rcptLineNum',
      'rcptQuantity',
      'itemName',
      'rcptItemRevision',
      'unitOfMeasure',
      'sourceDocName',
      'sourceNum',
      'sourceLineNum',
      'fromIuCode',
      'toIuCode',
      'lpnNum',
      'toLgCode',
      'toLocCode'
  ];
  resultData = [];
  parameterDataSource = new MatTableDataSource<any>(this.resultData);
 
  constructor(
      private receiptsService: ReceiptsService,
      public dialogRef: MatDialogRef<ReceiptViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getReceiptDetailsById(data[0].receiptId);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

   getReceiptDetailsById(id) {
    this.receiptsService.getReceiptDetailById(id).subscribe((data: any) => {
       
        if (data.status === 200) {
            console.log(data.result[0].receiptLines[0]);
            if (data.result[0].receiptLines.length) {
                for (const receiptLineData of data.result[0].receiptLines) {
                    this.resultData.push(receiptLineData);
                    this.parameterDataSource = new MatTableDataSource<any>(
                        this.resultData
                    );
                }
            }
        }
    });

    
   }
}