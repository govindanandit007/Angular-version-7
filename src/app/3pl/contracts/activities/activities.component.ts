import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, TooltipPosition } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityGroupService } from 'src/app/_services/3pl/activity-group.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ContractsService } from 'src/app/_services/3pl/contracts.service';

export interface ParameterDataElement {
  sno? : any;
  transactionTypeDesc: any;
  subactivityDesc: any;
  activityCode : any;
  activityName : any;
  description : any;
  chargeCodeDesc : any;
  uom : any;
  unitOfMeasure? : any;
  startDate : any;
  endDate : any;
  enableFlag : any; 
  action?: string;
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  formTitle : string = '';
 
  groupList      : any = [];
  groupId        : any = null;
  contractId     : any = null;
  contractLineId : any = null;
  groupCode      : any = '';
  dateStart      : any = '';
  dateEnd        : any = '';
  enableFlag     : any = '';
  contractNumber : any = '';
  customerName   : any = '';


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
    'transactionType',
    'subactivities',
    'activityCode',
    'activityName',
    'description',
    'chargeCode',
    'uom',
    'startDate',
    'endDate',
    'enableFlag', 
    'action'
  ];

  columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 5 },
      { field: 'transactionType', name: 'Transaction Type', width: 75, baseWidth: 10 },
      { field: 'subactivities', name: 'Sub Activity', width: 75, baseWidth: 7 },
      { field: 'activityCode', name: 'Activity Code', width: 75, baseWidth: 9 },
      { field: 'activityName', name: 'Activity Name', width: 75, baseWidth: 9 },
      { field: 'description', name: 'Description', width: 75, baseWidth: 7 },
      { field: 'chargeCode', name: 'Charge Code', width: 75, baseWidth: 10 },
      { field: 'uom', name: 'UOM', width: 75, baseWidth: 8 },
      { field: 'startDate', name: 'Start Date', width: 75, baseWidth: 9 },
      { field: 'endDate', name: 'End Date', width: 75, baseWidth: 9 },
      { field: 'enableFlag', name: 'Enable Flag', width: 75, baseWidth: 10 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];

  activityTableMessage = '';



  constructor( private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private activityGroupService: ActivityGroupService,
    private route: ActivatedRoute,
    private contractsService: ContractsService,
    private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.contractId     = Number(params.id.split('-')[0]);
        this.contractLineId = Number(params.id.split('-')[1]);
        this.groupId        = Number(params.id.split('-')[2]);
        this.getContractDetails(this.contractId)

      }
    });
   
  }

  getContractDetails(contractId) {
    this.contractsService
                .getContractDetails(this.contractId)
                .subscribe((data: any) => {
                      this.getActivityGroupLOV(data.result[0].contractLine);
                      this.contractNumber = data.result[0].contractCode;
                      this.customerName   = data.result[0].customerName;
                });
  }

  gotoItem(element){
    this.router.navigate(['contracts/activityitems/'+ this.contractId + '-' + this.contractLineId + '-' + this.groupId + '-' + element.activityId]);
  }

  getActivityGroupLOV(data){
    
  this.groupList = [];
        for (const rowData of data) {
          this.groupList.push({
            value        : rowData.activityGroupId,
            label        : rowData.activityGroupName,
            GroupData    : rowData
          });
        }
 }

  
 groupChanged(event:any, data: any ){
  if (event.source.selected && event.isUserInput === true && this.groupId!=='') {
    this.groupCode  = data.activityGroupCode ;
    this.dateStart  = data.startDate ;
    this.dateEnd    = data.endDate ;
    this.enableFlag = data.enableFlag === 'Y' ? true : false ;
    this.getActivityList();
  }
}

getActivityList(){
  this.activityGroupService
          .getGroupDetails(this.groupId)
          .subscribe((data: any) => {
          const activities = data.result[0].activityDetailLines
           
          let array: any = [];
          for (const [index, pData] of activities.entries()) {
             
            array.push({
              activityId          : pData.activityId ,
              activityCode        : pData.activityCode,
              activityName        : pData.activityName,
              transactionTypeDesc : pData.transactionTypeDesc,
              subactivityDesc     : pData.subactivityDesc,
              chargeCodeDesc      : pData.chargeCodeDesc,
              description         : pData.description,
              uom                 : pData.uom,
              unitOfMeasure       : pData.unitOfMeasure,   
              startDate           : pData.startDate,
              endDate	            : pData.endDate,
              enableFlag	        : pData.enableFlag === 'Y' ? true : false,
              originalData        : pData,
              editing             : false,
              addNewRecord        : false
            });
          }

           
          this.parameterData = array;
          this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
          );
          this.parameterDataSource.paginator = this.paginator;
          this.parameterDataSource.sort = this.sort;
                  });
}


  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: [typeClass]
    });
  }

  ngOnDestroy() {
    
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.commonService.setTableResize(
          this.matTableRef.nativeElement.clientWidth,
          this.columns
      );
      this.commonService.getScreenSize();
  }


}
