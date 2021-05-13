import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CommonService } from './../../../_services/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar,  MatSort, MatDialog, Sort } from '@angular/material';
import { CycleCountService } from './../../../_services/warehouse/cycle-count.service';
import { HttpClient } from '@angular/common/http';

export interface ParameterDataElement {
  ccTaskId: number;
  cycleCountId: number;
  iuId: number;
  iuCode: string;
  taskSequenceId: number;
  itemName: string;
  lgCode: string;
  locCode: string;
  revsnNumber: string;
  lpnNum: string;
  batchNumber: string;
  serialNumber: string;
  taskStatusCode: string;
  taskStatus?: any;
  countDate: string;
  userName: string;
  primaryCountQuantity: number;
  primaryUom: string;
  secondaryCountQuantity: number;
  secondaryUom: string;
  systemQuantity: number;
  secondarySystemQty: number;
  adjustmentQuantity: number;
  secondaryAdjustmentQuantity: number;
  approvalDate: string;
  reviewerName: string;
  approverEmployeeId: string;
  deviationPer: string;
  transactionReason: string;
  updateDate: string;
  updatedBy: number;
  approvalType: string;
  rowSelected?: boolean;
  isDisable?: boolean;
}

@Component({
  selector: 'app-cycle-count-review',
  templateUrl: './cycle-count-review.component.html',
  styleUrls: ['./cycle-count-review.component.css']
})
export class CycleCountReviewComponent implements OnInit, AfterViewInit, OnDestroy {
  searchEnable: boolean;
  dataResult = false;
  showSearch = true;
  private searchInfoArrayunsubscribe: any;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
    'cycleCountId',
    'ccTaskId',
    // 'iuId',
    'iuCode',
    'taskSequenceId',
    'itemName',
    'lgCode',
    'locCode',
    'revsnNumber',
    'lpnNum',
    'batchNumber',
    'serialNumber',
    'taskStatusCode',
    'countDate',
    'userName',
    'primaryCountQuantity',
    'primaryUom',
    'secondaryCountQuantity',
    'secondaryUom',
    'systemQuantity',
    'secondarySystemQty',
    'adjustmentQuantity',
    'secondaryAdjustmentQuantity',
    'approvalDate',
    'reviewerName',
    'deviationPer',
    'transactionReason',
    'approvalType',
  ];
  columns: any =  [
    {field: 'cycleCountId', name: '', width:75, baseWidth: 2 },
    {field: 'ccTaskId', name: '#', width:75, baseWidth: 1 },
    {field: 'iuCode', name: 'IU', width:75, baseWidth: 3 },
    {field: 'taskSequenceId', name: 'Count Seq.', width:75, baseWidth: 3 },
    {field: 'itemName', name: 'Item', width:75, baseWidth: 3.5 },
    {field: 'lgCode', name: 'LG', width:75, baseWidth: 2.5 },
    {field: 'locCode', name: 'Locator', width:75, baseWidth: 3 },
    {field: 'revsnNumber', name: 'Revision', width:75, baseWidth: 3 },
    {field: 'lpnNum', name: 'LPN Number', width:75, baseWidth: 4 },
    {field: 'batchNumber', name: 'Batch Number', width:75, baseWidth: 4 },
    {field: 'serialNumber', name: 'Serial Number', width:75, baseWidth: 4 },
    {field: 'taskStatusCode', name: 'Task Status', width:75, baseWidth: 4 },
    {field: 'countDate', name: 'Count Date', width:75, baseWidth: 3.5 },
    {field: 'userName', name: 'Counted By', width:75, baseWidth: 3.5 },
    {field: 'primaryCountQuantity', name: 'Primary Count Qty', width:75, baseWidth: 5 },
    {field: 'primaryUom', name: 'Primary UOM', width:75, baseWidth: 4 },
    {field: 'secondaryCountQuantity', name: 'Secondary Count Qty', width:75, baseWidth: 5 },
    {field: 'secondaryUom', name: 'Secondary UOM', width:75, baseWidth: 4 },
    {field: 'systemQuantity', name: 'System Qty', width: 75, baseWidth: 3.5 },
    {field: 'secondarySystemQty', name: 'Secondary System Qty', width:100, baseWidth: 5.5 },
    {field: 'adjustmentQuantity', name: 'Adjustment Qty', width:75, baseWidth: 4 },
    {field: 'secondaryAdjustmentQuantity', name: 'Secondary Adjustment Qty', width: 100, baseWidth: 6.5 },
    {field: 'approvalDate', name: 'Reviewed Date', width:75, baseWidth: 4 },
    {field: 'reviewerName', name: 'Reviewed By', width:75, baseWidth: 4 },
    {field: 'deviationPer', name: 'Deviation %', width:75, baseWidth: 4 },
    {field: 'transactionReason', name: 'Reason', width:75, baseWidth: 3 },
    {field: 'approvalType', name: 'Approval Type', width:75, baseWidth: 3.5 }
  ];
  cycleCountTableMessage = '';
  cycleCountId:number = null;
  ccName = '';
  actionList = [];
  reasonList = [];
  statusList = [];
  transactionReason = '';
  approvalType = '';
  isDataSelected: any = false;
  selectAllRow = false;
  @ViewChild(MatPaginator,  { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  listProgress = false;

  constructor(
    public commonService: CommonService,
    private cycleCountService: CycleCountService,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.searchEnable = true;
  }
  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/cc-review-search.json');

  ngOnInit() {
    this.getLookUpLOV('REVIEW_ACTION');
    this.getLookUpLOV('TRANSACTION_REASON');
    this.getLookUpLOV('CC_TASK_STATUS');
    this.commonService.getScreenSize(35);
    this.route.params.subscribe(params => {
      this.cycleCountId = params.id;
      this.ccName = params.name;
      if (this.cycleCountId) {
        this.renderReviewData(this.cycleCountId);
      }
    });
  }

  /* search reviews by cycle count id  */
  renderReviewData(ccId){
    this.listProgress = true;
    this.parameterData = [];
    this.parameterDataSource = new MatTableDataSource([]);
    this.parameterDataSource.sort = this.sort;
    const body = {cycleCountId: ccId }
    this.cycleCountService.searchCycleCountReview(body).subscribe(
      (data:any) => {
        this.listProgress = false;
        if (data.status === 200) {
          if (!data.message) {
            for (const rowData of data.result) {
              // rowData.deviationPercentage = (rowData.systemQuantity - rowData.primaryCountQuantity) / 100;
              rowData.isDisable = (rowData.taskStatusCode ==='COUNTED' && rowData.approvalType === 'APPROVAL_REQUIRED') ? false : true;
              rowData.deviationPer = rowData.deviationPer !== '0' ? Number(rowData.deviationPer).toFixed(2) : '0';
              this.parameterData.push(rowData);
            }
            this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            this.parameterDataSource.sort = this.sort;
            this.onCheckBoxChanged()
            this.searchJson.subscribe((data: any) => {
              this.dataForSearch = data;
              this.dataForSearch.searchArray[0].value = this.cycleCountId;
              this.searchCCReview();
              this.searchForCCReview();
            });

        } else {
            this.cycleCountTableMessage = data.message;
        }
        } else{
          this.openSnackBar(data.message, '', 'error-snackbar');
        }
      },
      (error: any) => {
        this.listProgress = false;
        this.openSnackBar(error.error.message, '', 'error-snackbar');
      }
    );
  }

  searchCCReview() {
      this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
          (searchInfo: any) => {

              // This code is used for not loading the search result when module loads
              if(searchInfo.fromSearchBtnClick === true){
                  this.parameterData = [];
              this.parameterDataSource = new MatTableDataSource<
                  ParameterDataElement
              >(this.parameterData);
              this.parameterDataSource.paginator = this.paginator;
              if (searchInfo.searchType === 'cycleCountReview') {
                  this.customTable.nativeElement.scrollLeft = 0;
                  this.listProgress = true;
                  searchInfo.searchArray.cycleCountId = this.cycleCountId;
                  this.cycleCountService.searchCycleCountReview(searchInfo.searchArray)
                      .subscribe(data => {
                          if (data.status === 200) {
                              if (!data.message) {
                                  this.listProgress = false;
                                  this.dataResult = true;
                                  for (const rData of data.result) {
                                    // rData.deviationPercentage = (rData.systemQuantity - rData.primaryCountQuantity) / 100;
                                    rData.isDisable = (rData.taskStatusCode ==='COUNTED' && rData.approvalType === 'APPROVAL_REQUIRED') ? false : true;
                                    rData.deviationPer = rData.deviationPer !== '0' ? Number(rData.deviationPer).toFixed(2) : '0';
                                    this.parameterData.push(rData);
                                  }
                                  this.parameterDataSource = new MatTableDataSource<ParameterDataElement>
                                  (this.parameterData);
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
                                  this.cycleCountTableMessage = data.message;
                              }
                          } else {
                              this.listProgress = false;
                              this.openSnackBar(data.message,'','error-snackbar');
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
 // select / unselect all wave line checkbox
  selectAll(){
    let selectRowCount = 0;
    for(const pData of this.parameterData){
      if(this.selectAllRow && !pData.isDisable){
        selectRowCount ++;
        pData.rowSelected = true;
        this.isDataSelected = selectRowCount > 0 ? true : false;
      } else{
        pData.rowSelected = false;
        this.isDataSelected = selectRowCount > 0 ? true : false;
      }

    }
  }
  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

  refresh(){
    const finalArray = {
      searchType: 'cycleCountReview',
      searchArray: {cycleCountId: this.cycleCountId},
      fromSearchBtnClick : true
    };
    this.commonService.getsearhForMasters(finalArray);
  }

  ngOnDestroy() {
    this.searchInfoArrayunsubscribe
        ? this.searchInfoArrayunsubscribe.unsubscribe()
        : '';
    this.commonService.getsearhForMasters([]);
}

onCheckBoxChanged(){
  let temp = false
  for (const [i, rowData] of this.parameterData.entries()) {
    if(rowData.rowSelected === true){
      temp = true;
    }
  }
  this.isDataSelected = temp;
}

// search for cycle count review
searchForCCReview() {
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

  openActionDialog(templateRef: TemplateRef<any>){
    const filteredData = this.parameterData.filter(x => x.rowSelected === true);

    if(filteredData.length){
      this.transactionReason = '';
      this.approvalType = '';
      this.dialog.open(templateRef, {
        autoFocus: false,
        minWidth: 600
      });
    } else{
      this.openSnackBar('Please select a review.', '', 'error-snackbar');
    }

  }

  /* save Reviews */
  saveReview(event:any){

    const body = [];
    const tempArray = []
    for (const [i, rowData] of this.parameterData.entries()) {
      if(rowData.rowSelected === true){
        const tempObj = Object.assign({}, rowData);
        tempArray.push(i);
        // tempObj.approvalType = this.approvalType;
        tempObj.taskStatusCode = this.approvalType;
        tempObj.transactionReason = this.transactionReason;
        tempObj.approverEmployeeId = JSON.parse(localStorage.getItem('userDetails')).userId;
        tempObj.updatedBy = JSON.parse(localStorage.getItem('userDetails')).userId;
        body.push(tempObj);
      }
    };
    // this.updateTable(tempArray); 
    // this.dataForSearch['lovSearchFromAdd_update'] = true;
    // this.searchCCReview();
    this.cycleCountService.updateCycleCountReview(body).subscribe( result => {
      if (result.status === 200) {
        this.updateTable(tempArray);
        this.openSnackBar(result.message, '', 'success-snackbar');
      } else {
          this.openSnackBar(result.message, '', 'error-snackbar');
      }
    })
  }

  updateTable(tempArray){
    let aprvltype = '';
    let reason = '';
    for (const [i, rowData] of  this.actionList.entries()) {
      if(rowData.value === this.approvalType){
        aprvltype = rowData.label
      }
    }

    for (const [i, rowData] of  this.reasonList.entries()) {
      if(rowData.value === this.transactionReason){
        reason = rowData.value
      }
    }

    for (const [i, rowData] of tempArray.entries()) {
      this.parameterData[rowData].taskStatusCode      = this.approvalType;
      this.parameterData[rowData].taskStatus          = aprvltype;
      this.parameterData[rowData].transactionReason   = reason;
      this.parameterData[rowData].rowSelected         = false;
      this.parameterData[rowData].isDisable           = true;
    }
    this.approvalType = '';
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    this.parameterDataSource.paginator = this.paginator;
  }

  getLabelFromLov(type, lovName){
    if(lovName ==='actionList'){
      const lovLabel = this.actionList.find(x => x.value === type).label;
      return lovLabel;
    }
    if(lovName ==='reasonList'){
      const lovLabel = this.reasonList.find(x => x.value === type).label;
      return lovLabel;
    }
    if(lovName ==='statusList'){
      const lovLabel = this.statusList.find(x => x.value === type).label;
      return lovLabel;
    }
  }

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
}

  getLookUpLOV(lookupName:string) {
    if (lookupName === 'REVIEW_ACTION'){
      this.actionList = [{label: 'Please Select', value:''}];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          if(data.result){
            for (const rowData of data.result) {
              this.actionList.push({
                value: rowData.lookupValue,
                label: rowData.lookupValueDesc
              });
            }
          }

        });
    }
    if (lookupName === 'TRANSACTION_REASON'){
      this.reasonList = [{label: 'Please Select', value:''}];
      this.commonService
      .getLookupLOV(lookupName)
      .subscribe((data: any) => {
        if(data.result){
          for (const rowData of data.result) {
            this.reasonList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        }
      });
    }
    if (lookupName === 'CC_TASK_STATUS'){
      this.statusList = [{label: 'Please Select', value:''}];
      this.commonService
      .getLookupLOV(lookupName)
      .subscribe((data: any) => {
        if(data.result){
          for (const rowData of data.result) {
            this.statusList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(35);
  }

}
