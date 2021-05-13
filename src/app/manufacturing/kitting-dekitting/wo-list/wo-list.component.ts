import {Component, OnInit, ViewChild, Renderer, Output, EventEmitter, TemplateRef,
  OnDestroy, Optional, Inject, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { Action } from 'rxjs/internal/scheduler/Action';
import { WorkOrderService } from 'src/app/_services/manufacturing/work-order.service';

export interface ParameterDataElement {
  woId                : number;
  woNumber            : string;
  statusName            : string;
  woStatus            : string;
  statusCode            : string;
  assemblyItem        : string;
  woDescription       : string;
  quantity            : string;
  startDate           : string;
  woCompletionDate    : string;
  woQuantity          : string;
  completedQty        : string;
  action              : string;
  woUom              : string;
  priorityName          : string;
   
}

@Component({
  selector: 'app-wo-list',
  templateUrl: './wo-list.component.html',
  styleUrls: ['./wo-list.component.css']
})
export class WoListComponent implements OnInit {
  searchEnable: boolean;
  isEdit = false;
  isAdd = false;
  dataResult = false;
  currentRoute: string;
  private searchInfoArrayunsubscribe: any;
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
  tooltipPosition: TooltipPosition[] = ['below'];
  listProgress = false;
  soTableMessage = '';
  parameterDisplayedColumns: string[] = [
    'woId',
    'woNumber',          
    'assemblyItem',       
    'quantity', 
    'woUom',         
    'woDescription',
    'typeName',      
    'statusName',
    'priorityName', 
    'completedQty',           
    'startDate',        
    'woCompletionDate',         
    'action'          
  ];

  columns: any =  [
      {field: 'woId', name: '#', width: 75, baseWidth: 3 },
      {field: 'woNumber', name: 'WO #', width: 75, baseWidth: 5.5 },
      {field: 'assemblyItem', name: 'Assembly Item', width: 75, baseWidth: 11 },
      {field: 'quantity', name: 'WO Qty', width: 75, baseWidth: 6 },
      
      {field: 'woDescription', name: 'Description', width: 75, baseWidth: 10 },
      {field: 'typeName', name: 'Type', width: 75, baseWidth: 7 },
      {field: 'statusName', name: 'Status', width: 75, baseWidth: 7 },
     
      {field: 'startDate', name: 'Start Date', width: 75, baseWidth: 10 },
      {field: 'woCompletionDate', name: 'Completion Date', width: 75, baseWidth: 11.5 },
      {field: 'completedQty', name: 'Completed Qty', width: 75, baseWidth: 10 },     
     
      {field: 'woUom', name: 'UOM', width: 75, baseWidth: 5 },
      {field: 'priorityName', name: 'Priority', width: 75, baseWidth: 6.5 },
      {field: 'action', name: 'Action', width: 75, baseWidth: 7 },
      
  ]

  showSearch = true;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );

  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
  path: string;
  title: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private WorkOrderService: WorkOrderService, 
    public dialog: MatDialog,
    private http: HttpClient
  ) { 
    this.searchEnable = true;
    this.getScreenSize();
    this.currentRoute = this.router.url.split('/')[1];   
     
    if (this.currentRoute === 'kitting') {
      this.path = 'createwo';     
      this.title = 'Kitting Work Orders';
       
    } else {
      this.title = 'Dekitting Work Orders';
      this.path = 'createdwo';    
    } 
  }

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/wo-search.json');
  screenMaxHeight:any;

  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.searchJson.subscribe((data: any) => {
        this.dataForSearch = data;
        this.searchworkOrder();
        this.searchForWorkOrder();
    });
  }

  searchworkOrder() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
        (searchInfo: any) => { 
            // This code is used for not loading the search result when module loads 
            if(searchInfo.fromSearchBtnClick === true){
              this.customTable.nativeElement.scrollLeft = 0;
              this.parameterData = [];
              this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
              this.parameterDataSource.paginator = this.paginator;
              if (searchInfo.searchType === 'workorderNo') {
                  this.listProgress = true;
                  this.WorkOrderService
                      .getWOSearch(searchInfo.searchArray)
                      .subscribe(data => {
                          if (data.status === 200) {
                              if (!data.message) {
                                  this.parameterData = [];
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
                                // Sorting Start
                                    const sortState: Sort = {active: '', direction: ''};
                                    this.sort.active = sortState.active;
                                    this.sort.direction = sortState.direction;
                                    this.sort.sortChange.emit(sortState);
                                // Sorting End
                                  this.parameterDataSource.sort = this.sort;
                                  // this.parameterDataSource.connect().subscribe(d => {
                                  //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                                  //         this.parameterDataSource.sort);
                                  // });
                              } else {
                                  this.listProgress = false;
                                  this.dataResult = false;
                                  this.soTableMessage = data.message;
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

  // search for Work order
  searchForWorkOrder() {
    this.commonService.searhForMasters(this.dataForSearch);
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

  // go for add, edit and view
  goFor(type:string, element?:any){
    if(type==='view'){
      const dialogData = [];
          dialogData.push(element);
          const dialogRef = this.dialog.open(WoViewDialogComponent, {
              width: '80vw',
              data: dialogData,
              autoFocus: false
          });

          dialogRef.afterClosed().subscribe(response => {
              if (response !== undefined) {
                  this.goFor('edit', response);
              }
          });
    } else if(type === 'add'){
      this.router.navigate([this.currentRoute+'/'+this.path]);
    } else{
      this.router.navigate([this.currentRoute+'/'+this.path+'/' + element]);
    }
  }
  openDialog(dialogType: string, dialogMessage: any) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
            type: dialogType,
            message: dialogMessage,
            autoFocus: false
        }
    });
}
  @HostListener('window:resize', [])
  onResize() : void{
      this.getScreenSize();
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  }
  getScreenSize(event?) {
      const screenHeight = window.innerHeight;
      this.screenMaxHeight = (screenHeight - 248) + 'px'; 
  }

  ngAfterViewInit() {
      this.parameterDataSource.sort = this.sort;
      setTimeout(() => {
          this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
  }
  // // Reserved Work Order
  reservedWo(action, id, index){
  
    const body = { actionName: action, woId: id, woLineId: null, userId: Number(JSON.parse(localStorage.getItem('userDetails')).userId) }
    this.WorkOrderService.reservedWO(body).subscribe(data => {
        //this.parameterData[index].statusName = 'fff';
        if(data.status === 200){
            if(data.result[0].statusName === 'Reserved'){
              
                this.openSnackBar(data.message,'','success-snackbar');
                this.searchworkOrder();
            } else{
               // this.parameterData[index].statusName = data.result[0].statusName;
                this.openSnackBar(data.message,'','error-snackbar');
            }
          //   if(data.result.length){
          //     this.parameterData[index].statusName = data.result[0].statusName;
          //     this.parameterData[index].statusCode = 'RELEASED';              
          // }
        } else {
          //this.parameterData[index].statusName = data.result[0].statusName;
            this.openSnackBar(data.message,'','error-snackbar');
        }
    },
    error => {
        
        this.openSnackBar(error.error.message, '', 'error-snackbar');  
    })
  }
}

@Component({
  selector: 'app-wo-view-dialog',
  templateUrl: './wo-view-dialog.html',
  styleUrls: ['./wo-list.component.css']
  })

export class WoViewDialogComponent {
  woViewdColumns: string[] = [
      'woLineId',
      'woLineIuId',
      'woLineNumber',
      'woCmpItemId',
      'woCmpUom',
      'woCmpQty',      
      'woLineStatus',      
      // 'woCmpConsumedQty',
      'woCmpReqDate',
      'woCmpCompDate',      
  ];
  resultData = [];
  parameterDataSource = new MatTableDataSource<any>(this.resultData);
  dataProgress = false;
  currentroute: any;
  uomDescription:string= '';
  
  constructor(
      private workOrderService: WorkOrderService,
      private router: Router,

      public dialogRef: MatDialogRef<WoViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   // this.getWoDetailsById(data[0].soId);
   this.currentroute = this.router.url.split('/')[1]; 
    this.getWoDetailsById(data[0].woId);
  }
  
  onCloseClick(): void {
      this.dialogRef.close();
  }
  
  getWoDetailsById(id) {
    this.dataProgress = true;
    this.workOrderService.getWoById(id).subscribe((data: any) => {
        if (data.status === 200) {              
            if (data.result[0].woLineDetails) {
              this.uomDescription= data.result[0].uomDescription;
              if (data.result[0].woLineDetails.length !== 0) {              
                for (const woLineData of data.result[0].woLineDetails) {                                        
                    this.resultData.push(woLineData);
                    this.parameterDataSource = new MatTableDataSource<any>(
                        this.resultData
                    );
                }
              }  
              this.dataProgress = false;
            }else{
              this.dataProgress = false;
              this.parameterDataSource = new MatTableDataSource<any>(
                this.resultData
            );
            }
           
        }
    });
  } 
  
  }
  
