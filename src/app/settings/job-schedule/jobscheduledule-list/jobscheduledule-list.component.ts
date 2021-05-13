import { Component, OnInit, Output, ElementRef, ViewChild, EventEmitter, HostListener, 
  AfterViewInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { TooltipPosition, MatPaginator, MatSort, Sort, MatTable, MatSnackBar,  
  MatTableDataSource,  
  MatToolbar} from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { JobScheduleService } from 'src/app/_services/settings/job-schedule.service';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ParameterDataElement {
  sno?: any;
  jobId: any;
  jobName: any;
  jobType: any;
  schedule: any;
  statusName: any;
  isStarted?: any;
  action: string;
}

@Component({
  selector: 'app-jobscheduledule-list',
  templateUrl: './jobscheduledule-list.component.html',
  styleUrls: ['./jobscheduledule-list.component.css']
})
export class JobscheduleduleListComponent implements OnInit, AfterViewInit, OnDestroy {

  listProgress = false;
  jobScheduleTableMessage = '';
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  parameterDisplayedColumns: string[] = [
    'sno',
    'jobName',
    'jobType',
    'schedule',
    'status',
    'action'
  ];

  columns: any = [
    { field: 'sno', name: '#', width: 75, baseWidth: 7 },
    { field: 'jobName', name: 'Job Name', width: 75, baseWidth: 20 },
    { field: 'jobType', name: 'Job Type', width: 75, baseWidth: 20 },
    { field: 'schedule', name: 'Interval', width: 75, baseWidth: 18 },
    { field: 'status', name: 'Status', width: 75, baseWidth: 15 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 20 },
  ];

  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
    
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch: any = true;

  constructor( public router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public jobScheduleService: JobScheduleService,
    private http: HttpClient,
    public dialog: MatDialog) { 
      this.searchEnable = true;
    }

    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/job-search.json');

  ngOnInit() {
    this.commonService.getScreenSize(-84);
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.searchJobSchedule();
      this.searchForJobSchedule();
    });

    // this.search({});
  }

   // show / hide search section
   getSearchToggle(searchToggle: boolean) {
    console.log('searchToggle');
    if (searchToggle === true) {
        this.searchEnable = searchToggle;
    } else {
        this.searchEnable = searchToggle;
    }
}

// search for Job schedule
searchForJobSchedule() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
}

searchComponentOpen() {
  this.searchComponentToggle.emit(this.showSearch);
  this.searchEnable = true;
}

searchJobSchedule() {
  this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (serialSearchInfo: any) => {
          //This code is used for not loading the search result when module loads
          if (serialSearchInfo.fromSearchBtnClick === true) {
              this.parameterData = [];
              this.parameterDataSource = new MatTableDataSource(this.parameterData);
              this.parameterDataSource.paginator = this.paginator;
              this.parameterDataSource.sort = this.sort;
              if (serialSearchInfo.searchType === 'jobschedule') {
                  this.search(serialSearchInfo.searchArray);
              }
          } else {
              return;
          }
      }
  );
}

search(serialSearchInfo){
  this.listProgress = true;
  this.parameterData = [];
  this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
  this.parameterDataSource.paginator = this.paginator;
                  this.jobScheduleService
                      .searchJobSchedule(serialSearchInfo)
                      .subscribe(
                          (data: any) => {
                              this.listProgress = false;
                              this.parameterData = [];
                              if (data.status === 200) {
                                  if (!data.message) {
                                      for (const rowData of data.result) {
                                          rowData.action = '';
                                          rowData.isStarted = rowData.statusName === 'Not Started' ? false : true;
                                          this.parameterData.push(rowData);
                                      }
                                      this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                                      this.parameterDataSource.paginator = this.paginator;
                                    // Sorting Start
                                       const sortState: Sort = {active: '', direction: ''};
                                       this.sort.active = sortState.active;
                                       this.sort.direction = sortState.direction;
                                       this.sort.sortChange.emit(sortState);
                                    // Sorting End
                                      this.parameterDataSource.sort = this.sort;
                                      this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                      // this.parameterDataSource
                                      //     .connect()
                                      //     .subscribe(d => {
                                      //         this.parameterDataSource.sortData(
                                      //             this.parameterDataSource
                                      //                 .filteredData,
                                      //             this.parameterDataSource
                                      //                 .sort
                                      //         );
                                      //     });
                                  } else {
                                      this.jobScheduleTableMessage =
                                          data.message;
                                  }
                              } else {
                                  // alert(data.message);
                                  this.openSnackBar(
                                      data.message,
                                      '',
                                      'error-snackbar'
                                  );
                              }
                          },
                          (error: any) => {
                              this.listProgress = false;
                              this.openSnackBar(
                                  error.error.message,
                                  '',
                                  'error-snackbar'
                              );
                          }
                      );
}


  // go for add, edit and view
  goFor(type:string, element?:any){
    if(type==='view'){
      const dialogData = [];
          dialogData.push(element);
          const dialogRef = this.dialog.open(JsViewDialogComponent, {
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
      this.router.navigate(['jobschedule/addjobschedule']);
    } else if(type === 'history'){
      this.router.navigate(['jobschedule/editjobhistory/' + element]);
    }else{
      this.router.navigate(['jobschedule/editjobschedule/' + element]);
    }
  }

  buttonAction(event: any, element: any, index: any){
    if(!element.isStarted){
      this.scheduleJob(element, index);
    }else{
      this.stopJob(element, index);
    }
  }

  scheduleJob(element, index){
    this.jobScheduleService
    .scheduleJob(element.jobId)
    .subscribe(
        (data: any) => {
            if (data.status === 200) {
                this.openSnackBar( data.message,'','success-snackbar' );
                this.updateData(index, true, 'Started')
            } else {
                this.openSnackBar( data.message,'','error-snackbar' );
            }
        },
        (error: any) => {
            this.openSnackBar( error.error.message,'','error-snackbar' );
        }
    );
  }

  updateData(index, boolean, status){
    this.parameterData[index].isStarted = boolean;
    this.parameterData[index].statusName = status;
    this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
  }

  stopJob(element, index){
    this.jobScheduleService
    .stopJob(element.jobId)
    .subscribe(
        (data: any) => {
            if (data.status === 200) {
                this.openSnackBar( data.message,'','success-snackbar' );
                this.updateData(index, false, 'Not Started')
            } else {
                this.openSnackBar( data.message,'','error-snackbar' );
            }
        },
        (error: any) => {
            this.openSnackBar( error.error.message,'','error-snackbar' );
        }
    );
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
  this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
  // this.parameterDataSource.connect().subscribe(d => {
  //     this.parameterDataSource.sortData(
  //         this.parameterDataSource.filteredData,
  //         this.parameterDataSource.sort
  //     );
  // });
  setTimeout(() => {
    this.commonService.setTableResize(
        this.matTableRef.nativeElement.clientWidth,
        this.columns
    );
    this.paginator.pageSizeOptions = this.commonService.paginationArray;
    this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
}, 100);
}
@HostListener('window:resize', ['$event'])
onResize(event) {
    this.commonService.setTableResize(
        this.matTableRef.nativeElement.clientWidth,
        this.columns
    );
    this.commonService.getScreenSize(-84);
}

}



@Component({
  selector: 'app-job-schedule-view',
  templateUrl: './job-schedule-view.html',
  styleUrls: ['./jobscheduledule-list.component.css']
  })
  export class JsViewDialogComponent {
//     {createdBy: 2302, cron: "0 */5 * ? * *", endDate: null, endTime: null, jobId: 1074,…}
// createdBy: 2302
// cron: "0 */5 * ? * *"
// endDate: null
// endTime: null
// jobId: 1074
// jobName: "New Job 2"
// jobType: "CC Schedule"
// jobparameter: [{createdBy: 2302, jobParameterName: "IU", value: 1070},…]
// 0: {createdBy: 2302, jobParameterName: "IU", value: 1070}
// 1: {createdBy: 2302, jobParameterName: "Cycle_Count_name", value: 369}
// logName: ""
// programName: null
// programType: null
// schedule: "Minutely"
// startDate: "2020-08-11"
// startTime: "14:08:00"
   
  resultData =[];
  isLoading = true;
        constructor(
        public dialogRef: MatDialogRef<JsViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public jobScheduleService: JobScheduleService,
    )
      {console.log(data[0].jobId);
        debugger
      this.getJobDetailsById(data[0].jobId);
     }
  onCloseClick(): void {
      this.dialogRef.close();
  }
  getJobDetailsById(id: any) {
   // throw new Error("Method not implemented.");
   this.jobScheduleService.jobScheduleDetails(id).subscribe((data: any) => {
    if (data.status === 200) {
        console.log("scheduled job data-"+ data.result[0]);
         this.resultData.push(data.result[0]);
         this.isLoading = false;
        //this.resultData = data.result[0];
        console.log("scheduled job result  data-"+ this.resultData[0].jobName);
        for (const [index, jobparameterData] of this.resultData[0].jobparameter.entries()) {
          console.log(" result  data1-"+ jobparameterData.jobParameterName);
          console.log(" result  data1-"+ jobparameterData.value);
          
        }
        
    }
  });
 
}
  }