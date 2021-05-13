import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, 
  HostListener, AfterViewInit, Inject, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, Sort, MatTable, MatTableDataSource,
   MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { ActivityGroupService } from 'src/app/_services/3pl/activity-group.service';
import { ActivityMasterService } from 'src/app/_services/3pl/activity-master.service';
import { CommonService } from 'src/app/_services/common/common.service';


export interface ParameterDataElement {
  sno? : any;
  activityGroupName: any;
  activityGroupId?: any;
  activityGroupCode: any;
  startDate : any;
  endDate : any;
  enableFlag : any; 
  action?: string;
}


@Component({
  selector: 'app-activity-group-list',
  templateUrl: './activity-group-list.component.html',
  styleUrls: ['./activity-group-list.component.css']
})
export class ActivityGroupListComponent implements OnInit, AfterViewInit, OnDestroy {

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
    'activityGroupName',
    'activityGroupCode',
    'startDate',
    'endDate',
    'enableFlag', 
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 5 },
      { field: 'activityGroupName', name: 'Group Name', width: 75, baseWidth: 27 },
      { field: 'activityGroupCode', name: 'Group Code', width: 75, baseWidth: 15 },
      { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 15 },
      { field: 'endDate', name: 'End Date', width: 75, baseWidth: 15 },
      { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 14 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
  ];

  activityTableMessage = '';
  screenMaxHeight:any;


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public dialog: MatDialog,
    private activityService: ActivityMasterService,
    private activityGroupService: ActivityGroupService,
    private http: HttpClient){
    this.searchEnable = true;
    this.getScreenSize();
  }

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/activity-group.json');

  ngOnInit() {

    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
        this.searchActivityGroup();
        this.searchForActivityGroup();
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

  searchForActivityGroup() {
      this.commonService.searhForMasters(this.dataForSearch);
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }

  searchComponentOpen() {
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }

  searchActivityGroup() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
      (searchInfo: any) => {
 
          // This code is used for not loading the search result when module loads 
          if(searchInfo.fromSearchBtnClick === true){
            this.customTable.nativeElement.scrollLeft = 0;
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            if (searchInfo.searchType === 'activitygroup') {
                this.listProgress = true;
                this.activityGroupService
                    .searchGroup(searchInfo.searchArray)
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
  goFor(type:string, element?:any){
    if(type==='view'){
      const dialogData = [];
      dialogData.push(element);
      const dialogRef = this.dialog.open(ActivityGroupViewDialogComponent, {
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
      this.router.navigate(['activitygroup/addactivitygroup']);
    } else{
      this.router.navigate(['activitygroup/editactivitygroup/' + element]);
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
    selector: 'app-activity-group-dialog',
    templateUrl: './activity-group-view-dialog.html',
    styleUrls: ['./activity-group-list.component.css']
  })
  export class ActivityGroupViewDialogComponent {
    activityGroupHeaderId: any = null;
    dataProgress = false;
    activityMsg = '';
    resultData = [];
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
      'sno',
      'activityCode',
      'activityName',
      'transactiontype',
      'subactivities',
      'description'
    ];

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
  constructor(
      public dialogRef: MatDialogRef<ActivityGroupViewDialogComponent>,
      private activityGroupService: ActivityGroupService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public commonService: CommonService

  ) {
     
    this.getActivityGroupDetailsById(data[0].activityGroupId);
    this.activityGroupHeaderId = data[0].activityGroupId;
  }
  
  onCloseClick(): void {
      this.dialogRef.close();
  }

  getActivityGroupDetailsById(id) {
    this.dataProgress = true;
    this.activityGroupService.getGroupDetails(id).subscribe((data: any) => {
        if (data.status === 200) {
          if (data.result[0].activityDetailLines.length) {
             
                for (const activityData of data.result[0].activityDetailLines) {
                  if (activityData.enableFlag === 'Y') {
                    activityData.enableFlag = true;
                  }
                  this.resultData.push(activityData);
                  this.parameterDataSource = new MatTableDataSource<any>(
                      this.resultData
                  );
                  this.parameterDataSource.paginator = this.paginator;
                }
                this.dataProgress = false;
            }else{
              this.activityMsg = 'No Activities Defined';
            }
        }
    });
  }
  
 
}
  


