import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatTable, TooltipPosition, MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WaveService } from 'src/app/_services/transactions/wave.service';

export interface ParameterDataElement {
  itemName: string,
  alctnItemRevisionId: string,
  lgCode: string,
  locCode: string,
  lpnNum: string,
  batchNumber: string,
  alctnAllocatedQty: number,
  alctnQtyUomCode: string,
  unitOfMeasure: string,
  soNumber: string,
  soLineNumber: number,
  destLgName: string,
  destLocCode: string,

  originalData?: any,
  createdBy?: any[];
  updatedBy?: any[];
}
@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.css']
})
export class AllocationsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
  tooltipPosition: TooltipPosition[] = ['below'];
  isEdit = false;
  isAdd = false;
  waveId = '';
  waveNumberInput = '';
  IuInput = '';
  waveAllocationMessage = '';
  parameterData: ParameterDataElement[] = [];
  allocationDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  waveLineDisplayedColumns: string[] = [
    'No',
    'item',
    'revision',
    'LG',
    'locator',
    'lpn',
    'batch',
    'allocatedQty',
    'UOM',
    'salesOrder',
    'soLine',
    'dropLg',
    'dropLocator'
  ];
  columns: any = [
    { field: 'No', name: '#', width: 75, baseWidth: 3 },
    { field: 'item', name: 'Item', width: 75, baseWidth: 9 },
    { field: 'revision', name: 'Revision', width: 75, baseWidth: 8 },
    { field: 'LG', name: 'LG', width: 75, baseWidth: 6 },
    { field: 'locator', name: 'Locator', width: 75, baseWidth: 8 },
    { field: 'lpn', name: 'LPN', width: 75, baseWidth: 8 },
    { field: 'batch', name: 'Batch', width: 75, baseWidth: 8 },
    { field: 'allocatedQty', name: 'Allocated Qty', width: 75, baseWidth: 10 },
    { field: 'UOM', name: 'UOM', width: 75, baseWidth: 6 },
    { field: 'salesOrder', name: 'Sales Order', width: 75, baseWidth: 9 },
    { field: 'soLine', name: 'SO Line', width: 75, baseWidth: 7 },
    { field: 'dropLg', name: 'Drop LG', width: 75, baseWidth: 8 },
    { field: 'dropLocator', name: 'Drop Locator', width: 75, baseWidth: 10 }
  ]
  constructor(
    public router: ActivatedRoute,
    private route: Router,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private waveService: WaveService
    ) {
      const lineId = +this.router.snapshot.paramMap.get('waveLineId');
     
      this.router.params.subscribe(params => {
        if (params.waveId && params.waveIuId) {
          this.waveId = params.waveId;
          let body = {};
          if(lineId === 0){
            body = { waveId: Number(params.waveId), alctnIuId: Number(params.waveIuId) };
          }
          else{
            body = { waveId: Number(params.waveId), alctnIuId: Number(params.waveIuId), waveLineId: Number(lineId) };
          }
          this.parameterData = [];
          this.waveService.getAllocations(body).subscribe((data:any) =>
          {
            if (data.status === 200) {
              if (!data.message) {
              this.waveNumberInput = data.result[0].waveNumber;
              this.IuInput = data.result[0].iuName;
              this.waveId = data.result[0].alctnWaveId;
              debugger
              this.parameterData = data.result;
              this.allocationDataSource = new MatTableDataSource<any>(this.parameterData);
              this.allocationDataSource.paginator = this.paginator;
              this.allocationDataSource.sort = this.sort;
              }else {
                this.waveAllocationMessage = data.message;
              }
            }
          });
        }
      });
    }
  
  ngOnInit() {
    this.allocationDataSource.paginator = this.paginator;
    // this.commonService.getScreenSize(156);
  }

  backToEdit(){
    this.route.navigate(['wave/editwave/'+ this.waveId]);
  }

  ngAfterViewInit() {
    this.allocationDataSource.sort = this.sort;
    // this.allocationDataSource.connect().subscribe(d => {
    //   this.allocationDataSource.sortData(this.allocationDataSource.filteredData, this.allocationDataSource.sort);
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
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    this.commonService.getScreenSize(156);
  }

}
