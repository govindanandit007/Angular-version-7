import {
  Component,
  OnInit,
  ViewChild,
  Renderer,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy,
  Optional,
  Inject,
  ElementRef,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AsnService } from 'src/app/_services/transactions/asn.service';
import { MatSort , Sort } from '@angular/material';
export interface ParameterDataElement {
  asnId: number;
  asnNumber: string;
  asnDescription: string;
  ouCode: string;
    supplier: string;
  supplierSite: string;
  action: string;
}

@Component({
  selector: 'app-asn-list',
  templateUrl: './asn-list.component.html',
  styleUrls: ['./asn-list.component.css']
})
export class AsnListComponent implements OnInit, AfterViewInit, OnDestroy {

  searchEnable: boolean;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    private searchInfoArrayunsubscribe: any;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    asnTableMessage = '';
    parameterDisplayedColumns: string[] = [
        'asnId',
        'asnNumber',
        'ouCode',
        'supplier',
        'supplierSite',
        'action'
    ];
    columns: any = [
        { field: 'asnId', name: '#', width: 100, baseWidth: 7 },
        { field: 'asnNumber', name: 'ASN #', width: 150, baseWidth: 17 },
        { field: 'asnDescription', name: 'Description', width: 150, baseWidth: 17 },
        { field: 'ouCode', name: 'OU', width: 100, baseWidth: 17},
        { field: 'supplier', name: 'Supplier', width: 100, baseWidth: 17 },
        { field: 'supplierSite', name: 'Supplier Site', width: 75, baseWidth: 17 },
        { field: 'action', name: 'Action', width: 80, baseWidth: 8 },
    ]
    showSearch = true;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private asnService: AsnService,
        private http: HttpClient
    ) {
        this.searchEnable = true;
        this.commonService.getScreenSize(-75);
    }
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/asn-search.json');
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
    
    ngOnInit() {
        // this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.paginator = this.paginator;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchAsn();
            this.searchForAsn();
        });
    }

    searchAsn() {
        // this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
        //     (searchInfo: any) => {
        //         this.parameterData = [];
        //         this.parameterDataSource = new MatTableDataSource<
        //             ParameterDataElement
        //         >(this.parameterData);
        //         // this.parameterDataSource.sort = this.sort;
        //         this.parameterDataSource.paginator = this.paginator;
        //     //     if(searchInfo.fromSearchBtnClick === true){
    
        //     // }
        //         if (searchInfo.searchType === 'asn') {
        //             this.listProgress = true;
        //             this.asnService
        //                 .getASNSearch(searchInfo.searchArray)
        //                 .subscribe(data => {

        //                      // This code is used for not loading the search result when module loads 
        //                      if(searchInfo.fromSearchBtnClick === true){
        //                         searchInfo.fromSearchBtnClick = false;
        //                         this.commonService.getsearhForMasters(searchInfo);
        //                     }else{
        //                         this.listProgress = false;
        //                         return;
        //                     }
        //                     if (data.status === 200) {
        //                         if (!data.message) {
        //                             // this.parameterData = [];
        //                             this.listProgress = false;
        //                             this.dataResult = true;
        //                             for (const rData of data.result) {
        //                                 rData.action = '';
        //                                 this.parameterData.push(rData);
        //                             }
        //                             this.parameterDataSource = new MatTableDataSource<
        //                                 ParameterDataElement
        //                             >(this.parameterData);
        //                             this.parameterDataSource.paginator = this.paginator;
        //                             // Sorting Start
        //                                const sortState: Sort = {active: '', direction: ''};
        //                                this.sort.active = sortState.active;
        //                                this.sort.direction = sortState.direction;
        //                                this.sort.sortChange.emit(sortState);
        //                             // Sorting End
        //                             this.parameterDataSource.sort = this.sort;
        //                             // this.parameterDataSource.connect().subscribe(d => {
        //                             //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
        //                             //         this.parameterDataSource.sort);
        //                             // });
        //                         } else {
        //                             this.listProgress = false;
        //                             this.dataResult = false;
        //                             this.asnTableMessage = data.message;
        //                         }
        //                     } else {
        //                         this.listProgress = false;
        //                         this.openSnackBar(
        //                             data.message,
        //                             '',
        //                             'error-snackbar'
        //                         );
        //                     }
        //                 });
        //           }else{
        //             this.listProgress = false;
        //             return;
        //         }
        //     }
        // );


        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {

                // This code is used for not loading the search result when module loads 
                if(searchInfo.fromSearchBtnClick === true){
              
                    // this.customTable.nativeElement.scrollLeft = 0;
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.parameterData = [];
                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
                if (searchInfo.searchType === 'asn') {
                    this.listProgress = true;
                     this.asnService
                        .getASNSearch(searchInfo.searchArray)
                        .subscribe(data => {
                            if (data.status === 200) {
                                if (!data.message) {
                                    this.parameterData = [];                             
                                    this.listProgress = false;
                                    this.dataResult = true;
                                    for (const rData of data.result) {
                                        rData.asnNumber = String(rData.asnNumber).trim();
                                        rData.action = '';
                                        this.parameterData.push(rData);
                                    }
                                    this.parameterDataSource = new MatTableDataSource<
                                        ParameterDataElement
                                    >(this.parameterData);
                                    this.parameterDataSource.paginator = this.paginator;
                                    // Sorting Start
                                       const sortState: Sort = {active: '', direction: ''};
                                       this.sort.active = sortState.active;
                                       this.sort.direction = sortState.direction;
                                       this.sort.sortChange.emit(sortState);
                                    // Sorting End
                                    this.parameterDataSource.sort = this.sort;
                                    this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];

                                } else {
                                    this.listProgress = false;
                                    this.dataResult = false;
                                    this.asnTableMessage = data.message;
                                }
                            } else {
                                this.listProgress = false;
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                        });
                }
                }else{
                    this.listProgress = false;
                    return;
                }
                
            }
        );
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.commonService.getsearhForMasters([]);

    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }

    // search for purchase order
    searchForAsn() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }
    // Open Search component
    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
    // go for add, edit and view
    goFor(type:string, element?:any){
      if(type==='view'){
        const dialogData = [];
            dialogData.push(element);
            const dialogRef = this.dialog.open(AsnViewDialogComponent, {
                width: '80vw',
                data: dialogData
            });

            dialogRef.afterClosed().subscribe(response => {
                if (response !== undefined) {
                    this.goFor('edit', response);
                }
            });
      } else if(type === 'add'){
        this.router.navigate(['asn/addasn']);
      } else{
        this.router.navigate(['asn/editasn/' + element]);
      }
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

     @HostListener('window:resize', [])
  onResize() : void{
      this.commonService.getScreenSize(-75);
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  } 
  ngAfterViewInit() {
      this.parameterDataSource.sort = this.sort;
     this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
    //   this.parameterDataSource.connect().subscribe(d => {
    //       this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
    //   });
      setTimeout(() => {
          this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
  }
}


export interface ParameterDataElementItemAsnLine {
    sno?           : string,
    asnLpnNumber   : string,
    asnBatchNumber : string,
    asnFromSerial  : string,
    asnToSerial    : string,
    asnQuantity    : string,
    action?        : string,                  
  }
@Component({
  selector: 'app-asn-view-dialog',
  templateUrl: './asn-view-dialog.html',
  styleUrls: ['./asn-list.component.css']
})
export class AsnViewDialogComponent {
  asnViewdColumns: string[] = [
      'asnLineId',
      'asnPoId',
      'asnPoLineId',
      'asnIuId',
      'asnLineNumber',
      'asnItemId',
      'asnItemRevision',
      'asnUomCode',
      'asnQuantity',
      'asnReceiptRouting',
      'poRemQuantity',
      'poQuantity',
      'poPlannedReceiptDate',
      'asnPlannedReceiptDate',
      'poLineReceiptQty',
      'action'
  ];
  resultData = [];
  parameterDataSource = new MatTableDataSource<any>(this.resultData);

  isAsnContent : any = false;
  tooltipPosition: TooltipPosition[] = ['below'];
//   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  parameterData: ParameterDataElementItemAsnLine [] = [];
  parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
  parameterDisplayedColumnsItemAsnLine: string[] = [
    'sno',           
    'asnLpnNumber',         
    'asnBatchNumber',       
    'asnFromSerial',    
    'asnToSerial',      
    'asnQuantity'
  ];
  
 
  
  listProgress = false;

  constructor(
      private asnService: AsnService,
      public dialogRef: MatDialogRef<AsnViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getAsnDetailsById(data[0].asnId);
  }

  onCloseClick(): void {
      this.dialogRef.close();
  }

  getAsnDetailsById(id) {
    this.asnService.getAsnById(id).subscribe((data: any) => {
        if (data.status === 200) {
            console.log(data.result[0].asnLines[0]);
            if (data.result[0].asnLines.length) {
                for (const asnLineData of data.result[0].asnLines) {
                    this.resultData.push(asnLineData);
                    this.parameterDataSource = new MatTableDataSource<any>(
                        this.resultData
                    );
                }
            }
        }
    });
  }

  openContentLines(element: any, index: any){
    this.isAsnContent = true;
    this.parameterData = element.linesContent
    this.parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
    // this.parameterDataSourceItemAsnLine.paginator = this.paginator;
  }

  gotoAsnLines(){
    this.isAsnContent = false;
  }

}
