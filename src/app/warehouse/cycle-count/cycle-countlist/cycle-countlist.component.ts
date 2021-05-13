import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, EventEmitter, Output, AfterViewInit, HostListener, ElementRef, OnDestroy, Optional, Inject } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CommonService } from './../../../_services/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatSort, Sort } from '@angular/material';
import { CycleCountService } from './../../../_services/warehouse/cycle-count.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';

export interface ParameterDataElement {
  cycleCountId: number,
  serialNumber?: number,
  iuId: number,
  cycleCountName: string,
  description: string,
  newCountAllowed: string,
  serialCountAllowed: string,
  approvalRequired: string,
  taskGenAllowed: string,
  creationDate: string,
  createdBy: number,
  updateDate: string,
  updatedBy: number,
  iuCode: string,
  action: string;
}

@Component({
  selector: 'app-cycle-countlist',
  templateUrl: './cycle-countlist.component.html',
  styleUrls: ['./cycle-countlist.component.css']
})
export class CycleCountlistComponent implements OnInit, AfterViewInit, OnDestroy {
  searchEnable: boolean;
  showSearch = true;
  @ViewChild(MatPaginator,  { static: false }) paginator: MatPaginator;
  @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
  @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  messageDialogRef: MatDialogRef<MessageDialogComponent>;

  listProgress = false;
  listProgressPopup = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
    'cycleCountId',
    'cycleCountName',
    'description',
    'newCountAllowed',
    'serialCountAllowed',
    'action'
  ];

  columns: any =  [
    {field: 'cycleCountId', name: '#', width: 50, baseWidth: 7 },
    {field: 'cycleCountName', name: 'Cycle Count Name', width: 75, baseWidth: 20 },
    {field: 'description', name: 'Description', width: 100, baseWidth: 25 },
    {field: 'newCountAllowed', name: 'Mannual Count Allowed', width: 50, baseWidth: 20 },
    {field: 'serialCountAllowed', name: 'Serial Allowed', width: 50, baseWidth: 16 },
    {field: 'action', name: 'Action', width: 100, baseWidth: 12 }
  ];

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  tooltipPosition: TooltipPosition[] = ['below'];

  cycleCountTableMessage = '';

  private searchInfoArrayunsubscribe: any;

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/cycle-count-search.json');
  

  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private cycleCountService: CycleCountService,
    private dialog: MatDialog,
    public router: Router,
  ) {
    this.showSearch = true;
  }

  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchCycleCount();
            this.searchForCycleCount();
        });
        this.commonService.getScreenSize(35);
         
  }

  //
  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

  // show/hide search section
  getSearchToggle(searchToggle: boolean) { 
    if (searchToggle === true) {
        this.searchEnable = searchToggle;
    } else {
        this.searchEnable = searchToggle;
    }
  }

  // Fetch Search JSON
  searchForCycleCount() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

  // GET Result
  searchCycleCount() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (itemSearchInfo: any) => {
          // This code is used for not loading the search result when module loads
          if(itemSearchInfo.fromSearchBtnClick === true){
              this.customTable.nativeElement.scrollLeft = 0;
              // itemSearchInfo.fromSearchBtnClick = false;
              // this.commonService.getsearhForMasters(itemSearchInfo);
              this.parameterData = [];
              this.parameterDataSource = new MatTableDataSource([]);
              this.parameterDataSource.sort = this.sort;
              // this.showItemList = true;
              if (itemSearchInfo.searchType === 'cycleCount') {
                  this.listProgress = true;
                  this.cycleCountService
                      .getCycleCountSearch(itemSearchInfo.searchArray)
                      .subscribe(
                          (data: any) => {
                              this.listProgress = false;
                               
                              if (data.status === 200) {
                                  if (!data.message) {
                                    this.parameterData = [];
                                      let count = 1;
                                      for (const rowData of data.result) {
                                          rowData.serialNumber = count++;
                                          rowData.action = '';
                                          this.parameterData.push(rowData);
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
                                      this.cycleCountTableMessage = data.message;
                                  }
                              } else {
                                  this.openSnackBar(data.message, '', 'error-snackbar');
                              }
                          },
                          (error: any) => {
                              this.listProgress = false;
                              this.openSnackBar(error.error.message, '', 'error-snackbar');
                          },
                          
                      );
              }
          }else{
              return;
          }


      }
    );
  }

  performAction(type: string, element: any, index: any) {
    if (type === 'view') {
      this.cycleCountService.getDetails(element.cycleCountId).subscribe((apiResponse:any) => {
        if(apiResponse.result) {
          const dialogData = [];
          const arrClass = [];
          for(let m = 0; m < apiResponse.result[0].ccItemDetails.length; m++) {
              if(arrClass.some(obj => obj.abcClassCode === apiResponse.result[0].ccItemDetails[m].abcClassCode)) {
                continue;
              } else {
                  arrClass.push({abcClassCode: apiResponse.result[0].ccItemDetails[m].abcClassCode,
                    abcClassCodeDesc: apiResponse.result[0].ccItemDetails[m].abcClassCodeDesc});
              }
          }
          apiResponse.result[0].ccClasses = arrClass;
          apiResponse.result[0].taskGenAllowed = element.taskGenAllowed;
          dialogData.push(apiResponse.result[0]);
          const dialogRef = this.dialog.open(CycleCountViewDialogComponent, {
              width: '70vw',
              data: dialogData,
              autoFocus: false
          });

          dialogRef.afterClosed().subscribe(response => {
            if (response !== undefined) {
                const tempObj: any = { cycleCountId: response.cycleCountId }
                this.performAction('edit', tempObj, index);
            }
          });
        }
      });
    } else if (type === 'edit') {
      this.router.navigate(['cyclecount/editcc/' + element.cycleCountId]);
    } else if(type === 'add') {
      this.router.navigate(['cyclecount/addcyclecount']);
    } else if(type === 'review') {
      this.router.navigate(['cyclecount/cyclecountreview/' + element.cycleCountId+'/'+ element.cycleCountName]);
    } else if(type === 'generate') {
        const data = {
          iuId          : element.iuId,
          cycleCountId  : element.cycleCountId,
          createdBy     : JSON.parse(localStorage.getItem('userDetails')).userId
        }
        this.cycleCountService.generarteCycleCount(data).subscribe(
          (data: any) => {
              if (data.status === 200) {

                this.openDialog('Success', data.message);
                this.parameterData[index].taskGenAllowed = 'N';
              }else{
                this.openDialog('Success', data.message);
              }
          },
          error => {
            this.openDialog('Alert', error.error.message);
          }
        );
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
            type: dialogType,
            message: dialogMessage
        }
    });
  }

  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    this.parameterDataSource.sortingDataAccessor = (data, header) => data[header];
    setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
    }, 500);
        
    } 
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(35);
  }

  ngOnDestroy() {
    this.searchInfoArrayunsubscribe
        ? this.searchInfoArrayunsubscribe.unsubscribe()
        : '';

    this.commonService.getsearhForMasters([]);
  }

}

// Cycle Count View Dialog
@Component({
  selector: 'app-cycle-count-view-dialog',
  templateUrl: './cycle-count-view-dialog.html',
  styleUrls: ['./cycle-countlist.component.css']
})

export class CycleCountViewDialogComponent {
  showItemDetails = false;
  parameterDisplayedColumnsCLassItems: string[] = ['sno','item','description'];
  parameterDataClassItem: ParameterDataElementClassItem[] = [];
  parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
  constructor(
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<CycleCountViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  onCloseClick(): void {
      this.dialogRef.close();
  }

  showItems(classCode:string, items: any) {
    this.showItemDetails = true;
    const itemsArr = [];

    for(const item of items) {
      if(item.abcClassCode === classCode) {
        itemsArr.push({
          sno: itemsArr.length + 1,
          item: item.itemName,
          description: item.itemDescription
        })
      }
    }
    this.parameterDataClassItem = itemsArr;
    this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
    // this.dialog.open(CycleCountViewItemsDialogComponent, {
    //     width: '40vw',
    //     data: itemsArr
    // });
  }

  hideItems(){
    this.showItemDetails = false;
  }
}


// Cycle Count View Items Dialog
export interface ParameterDataElementClassItem {
  sno : number;
  item: string;
  description: any;
}

@Component({
  selector: 'app-cycle-count-view-items-dialog',
  templateUrl: './cycle-count-view-items-dialog.html',
  styleUrls: ['./cycle-countlist.component.css']
})

export class CycleCountViewItemsDialogComponent {
  parameterDisplayedColumnsCLassItems: string[] = ['sno','item','description'];
  parameterDataClassItem: ParameterDataElementClassItem[] = [];
  parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);

  constructor(
      public dialogRef: MatDialogRef<CycleCountViewItemsDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.parameterDataClassItem = data;
    this.parameterDataSourceClassItem = new MatTableDataSource<ParameterDataElementClassItem>(this.parameterDataClassItem);
  }

  onItemCloseClick(): void {
      this.dialogRef.close();
  }
}
