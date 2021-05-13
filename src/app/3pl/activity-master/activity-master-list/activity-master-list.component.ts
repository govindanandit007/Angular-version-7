import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, 
  HostListener, AfterViewInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, Sort, MatTable, MatTableDataSource, 
  MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';


export interface ParameterDataElement {
  sno? : any;
  transactionTypeDesc: any;
  subactivityDesc: any;
  activityCode : any;
  activityName : any;
  description : any;
  chargeCode : any;
  unitOfMeasure : any;
  startDate : any;
  endDate : any;
  enableFlag : any; 
  action?: string;
}


@Component({
  selector: 'app-activity-master-list',
  templateUrl: './activity-master-list.component.html',
  styleUrls: ['./activity-master-list.component.css']
})
export class ActivityMasterListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch = true;
  

  

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  tooltipPosition: TooltipPosition[] = ['below'];

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  parameterDisplayedColumns: string[] = [
    'sno',
    'transactionTypeDesc',
    'subactivityDesc',
    'activityCode',
    'activityName',
    'description',
    'chargeCode',
    'unitOfMeasure',
    'startDate',
    'endDate',
    'enableFlag', 
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 3 },
      { field: 'transactionTypeDesc', name: 'Transaction Type', width: 75, baseWidth: 9 },
      { field: 'subactivityDesc', name: 'Sub Activity', width: 75, baseWidth: 9 },
      { field: 'activityCode', name: 'Activity Code', width: 75, baseWidth: 9 },
      { field: 'activityName', name: 'Activity Name', width: 75, baseWidth: 9 },
      { field: 'description', name: 'Description', width: 75, baseWidth: 9 },
      { field: 'chargeCode', name: 'Charge Code', width: 75, baseWidth: 9 },
      { field: 'unitOfMeasure', name: 'UOM', width: 75, baseWidth: 9 },
      { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 9 },
      { field: 'endDate', name: 'End Date', width: 75, baseWidth: 9 },
      { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 9 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];

  activityTableMessage = '';
  screenMaxHeight:any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private http: HttpClient,
    private activityService: ActivityMasterService,
    public dialog: MatDialog){
    this.searchEnable = true;
    this.getScreenSize();
  }

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/activity-master.json');

  ngOnInit() {

    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
        this.searchActivityMaster();
        this.searchForActivityMaster();
    });

  }


   // show / hide search section
  getSearchToggle(searchToggle: boolean) {
      if (searchToggle === true) {
          this.searchEnable = searchToggle;
      } else {
          this.searchEnable = searchToggle;
      }
  }

  searchForActivityMaster() {
      this.commonService.searhForMasters(this.dataForSearch);
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }

  searchComponentOpen() {
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }

  searchActivityMaster() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {
 
          // This code is used for not loading the search result when module loads 
          if(searchInfo.fromSearchBtnClick === true){
            // if(searchInfo.searchArray.transactionTypeId === '' || searchInfo.searchArray.transactionTypeId === undefined ){
            //   this.openSnackBar('Please select the Transaction Type', '','default-snackbar');
            //   return;
            // }
            this.customTable.nativeElement.scrollLeft = 0;
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            if (searchInfo.searchType === 'activitymaster') {
                this.listProgress = true;
                this.activityService
                    .searchActivity(searchInfo.searchArray)
                    .subscribe(data => {
                        if (data.status === 200) {
                            if (!data.message) {
                                this.parameterData = [];
                                this.listProgress = false;
                                for (const rData of data.result) {
                                    rData.action = '';
                                    rData.enableFlag = rData.enableFlag === 'Y' ? true : false;
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
                                
                            } else {
                                this.listProgress = false;
                                this.activityTableMessage = data.message;
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

  // go for add, edit and view
  goFor(type:string, data?:any){
    if(type==='view'){
        const dialogData = [];
        dialogData.push(data);
        const dialogRef = this.dialog.open(ActivityMasterViewDialogComponent, {
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
      this.router.navigate(['activitymaster/addactivity']);
    } else{
      this.router.navigate(['activitymaster/editactivity/' + data.activityHeaderId]);
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: [typeClass]
    });
  }

  ngOnDestroy() {
    this.searchInfoArrayunsubscribe
        ? this.searchInfoArrayunsubscribe.unsubscribe()
        : '';
    this.commonService.getsearhForMasters([]);
  }

  ngAfterViewInit() {
      this.parameterDataSource.sort = this.sort;
      setTimeout(() => {
          this.commonService.setTableResize(
              this.matTableRef.nativeElement.clientWidth,
              this.columns
          );
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(
              window.localStorage.getItem('paginationSize')
                  ? window.localStorage.getItem('paginationSize')
                  : 10
          );
      }, 100);
  }

  @HostListener('window:resize', [])
  onResize() : void{
      this.getScreenSize();
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  }
  getScreenSize(event?) {
      const screenHeight = window.innerHeight;
        this.screenMaxHeight = (screenHeight - 248) + 'px';
      //   this.scrWidth = window.innerWidth;
  }

}


@Component({
  selector: 'app-activity-master-dialog',
  templateUrl: './activity-master-view-dialog.html',
  styleUrls: ['./activity-master-list.component.css']
})
export class ActivityMasterViewDialogComponent {
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  dataProgress = false;
  resultData = [];
  activityHeaderId = null;
  message = '';

  parameterDisplayedColumns: string[] = [
    'sno',
    'activityCode',
    'activityName',
    'description',
    'chargeCode',
    'unitOfMeasure',
    'startDate',
    'endDate',
    'enableFlag', 
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
      public dialogRef: MatDialogRef<ActivityMasterViewDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private activityService: ActivityMasterService,
      public commonService: CommonService,
      private dialog: MatDialog
  ) {
     
    this.getActivityDetailsById(data[0].activityHeaderId);
    this.activityHeaderId = data[0].activityHeaderId;
  }

  onCloseClick(): void {
     
      this.dialogRef.close({activityHeaderId : this.activityHeaderId});
  }

  onCloseDialog(): void {
    this.dialog.closeAll();  
  }

  getActivityDetailsById(id) {
    this.dataProgress = true;
    this.activityService.getActivityDetails(id).subscribe((data: any) => {
        if (data.status === 200) {
          if (data.result[0].Activity.length) {
             
                for (const activityData of data.result[0].Activity) {
                  if (activityData.enableFlag === 'Y') {
                    activityData.enableFlag = true;
                  }else{
                    activityData.enableFlag = false;
                  }
                  this.resultData.push(activityData);
                  this.parameterDataSource = new MatTableDataSource<any>(
                      this.resultData
                  );
                  this.parameterDataSource.paginator = this.paginator;
                }
                this.dataProgress = false;
            }else{
              this.message = 'No Activities Defined';
            }
        }
    });
  }
}

