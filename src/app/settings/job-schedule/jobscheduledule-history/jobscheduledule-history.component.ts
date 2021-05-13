import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, TooltipPosition, MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { JobScheduleService } from 'src/app/_services/settings/job-schedule.service';
import { ActivatedRoute } from '@angular/router';


export interface ParameterDataElement {
  sno: any,
  endDate: any,
  endTime: any,
  jobName: any,
  log: any,
  startDate: any,
  startTime: any,
  status: any,  
}

@Component({
  selector: 'app-jobscheduledule-history',
  templateUrl: './jobscheduledule-history.component.html',
  styleUrls: ['./jobscheduledule-history.component.css']
})
export class JobscheduleduleHistoryComponent implements OnInit {

 
    listProgress = false;
    listProgressPopup = false;
    paramId : any = null;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    parameterDisplayedColumns: string[] = [
      'sno',
      'jobName',
      'status' ,
      'startDate',
      'endDate',
      'log'
    ];

      columns: any =  [
        {field: 'sno', name: '#', width: 75, baseWidth: 5 },
        {field: 'jobName', name: 'Job Name', width: 75, baseWidth: 15 },
        {field: 'status', name: 'Status', width: 75, baseWidth: 15 },
        {field: 'startDate', name: 'Start Date and Time', width: 75, baseWidth: 25 },
        {field: 'endDate', name: 'Finish Date and Time', width: 75, baseWidth: 25 },
        {field: 'log', name: 'View Log', width: 75, baseWidth: 15 }
      ]



    transactionTableMessage = '';
    txnSearchParameters : any = null;

 
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch = true;

  @ViewChild(MatPaginator,  { static: false }) paginator: MatPaginator;
  @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
  @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  
  tooltipPosition: TooltipPosition[] = ['below'];

   constructor( 
      private http: HttpClient,
      private snackBar: MatSnackBar,
      public commonService: CommonService,
      public jobScheduleService: JobScheduleService,
      private route: ActivatedRoute,
      ) {
      this.searchEnable = true;
   }

   

   dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/jobhistory.json');

  ngOnInit() {
        this.showSearch = true;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForjobHistory();
            this.searchjobHistory();
        });

        this.route.params.subscribe(params => {
          if (params.id) {
            this.paramId = params.id
              this.search({
                jobId: Number(params.id),
                startTime:null,
                finishTime:null
              });
          }
        });

        this.commonService.getScreenSize(-84);

  }

   searchForjobHistory(){
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
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

   searchjobHistory(){
      this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((jobHistorySearchInfo: any) => {
        this.txnSearchParameters = jobHistorySearchInfo;
        this.parameterDataSource = new MatTableDataSource([]);
        if (jobHistorySearchInfo.searchType === 'job-history') {
          this.customTable.nativeElement.scrollLeft = 0;

          // This code is used for not loading the search result when module loads 
          if(jobHistorySearchInfo.fromSearchBtnClick === true){
            if(!Object.keys(jobHistorySearchInfo.searchArray).length){
              jobHistorySearchInfo.searchArray = {
                jobId: Number(this.paramId),
                startTime:null,
                finishTime:null
              };
            }else{
              jobHistorySearchInfo.searchArray.jobId = Number(this.paramId)
            }
            this.search(jobHistorySearchInfo.searchArray)
          }else{
              return;
          }
         
     
        }
    });

  }


  search(searchArray){
    this.listProgress = true;
    this.jobScheduleService
        .getTransactionSearch(searchArray)
        .subscribe(
            (data: any) => {
              
                this.listProgress = false;
                if (data.status === 200) {
                    if (!data.message) {
                        this.parameterDataSource = new MatTableDataSource<
                            any
                        >(data.result);
                        this.parameterDataSource.paginator = this.paginator;
                        this.parameterDataSource.sort = this.sort;
                        // this.parameterDataSource.connect().subscribe(d => {
                        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                        // });
                    } else {
                        this.transactionTableMessage = data.message;
                    }
                } else {
                    // alert(data.message);
                    this.openSnackBar(data.message, '', 'error-snackbar');

                }
            },
            (error: any) => {
                this.listProgress = false;
                // alert(error.error.message);
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
  }

  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
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
      this.parameterDataSource.connect().subscribe(d => {
          this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
      });
      setTimeout(() => {
          this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? 
          window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.commonService.getScreenSize(-84);
  }



}
