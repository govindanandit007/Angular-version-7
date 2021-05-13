import { Component, OnInit, ViewChild, EventEmitter,
  Output, Renderer,  OnDestroy, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BatchService } from 'src/app/_services/transactions/batch.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { MatSort, Sort } from '@angular/material';
import { isBoolean } from 'util';
import { string } from '@amcharts/amcharts4/core';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
  batchId: string;
  batchItemId : number;
  showLov?                   : string,
  searchValue?               : string,
  inlineSearchLoader?        : string,
  batchIuId : any;
  iuCode? : string;
  itemName?: string;
  itemLov?: any;
  batchNumber : string;
  batchExpirationDate : string;
  batchDescription : string;
  batchQuantity : number;
  batchParentNumber : string;
  batchGradeCode : string;
  batchOriginationDate : Date;
  batchStatus : string;
  batchItemSize : number;
  batchColor : string;
  batchVolume : number;
  batchVolumeUom : string;
  batchOriginPlace : string;
  batchLength : number;
  batchLengthUom : string;
  batchThickness : number;
  batchThicknessUom : string;
  batchWidth : number;
  batchWidthUom : string;
  materialStatusId : number;
  batchSupplierNumber : string;
  showLov1?                   : string,
  searchValue1?               : string,
  inlineSearchLoader1?        : string,
  batchSupplierName : string;
  supplierNumberCode? : string;
  batchHoldDate : Date;
  batchEnabledFlag : boolean;
  createdBy: number;
  creationDate: string;
  updatedBy: number;
  updatedDate: string;
  action: string;
  editing: boolean;
  addNewRecord?: boolean;
  batchStatusName?:any;
  supplierName?: any;
  supplierList?:[];
  batchSupplierList?:any;
  batchList?:any;
  originalData?: any;
}

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.css']
})
export class BatchListComponent implements OnInit, AfterViewInit, OnDestroy {
  isEditable = false;
  isEdit = false;
  isAdd = false;
  listProgress = false;
  saveInprogress = false;
  private searchInfoArrayunsubscribe: any;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
  parameterDisplayedColumns: string[] = [
    'batchId',
    // 'iuCode',
    'itemName',
    'batchNumber',
    'batchQuantity',
    'batchSupplierNumber',
    'batchSupplierName',
    'batchStatus',
    'batchOriginationDate',
    'batchExpirationDate',
    'batchDescription',
    'batchParentNumber',
    'batchGradeCode',
    'batchColor',
    'batchVolume',
    'batchVolumeUom',
    'batchOriginPlace',
    'batchLengthUom',
    'batchLength',
    'batchThickness',
    'batchWidth',
    'batchMaterialStatus',
    // 'batchHoldDate',
    'batchEnabledFlag',
    'action',
  ];
 
  columns: any =  [
  {field: 'batchId', name: '#', width: 75, baseWidth: 2 },
//   {field: 'iuCode', name: 'IU', width: 75, baseWidth: 3.5 },
  {field: 'itemName', name: 'Item', width: 75, baseWidth: 6 },
  {field: 'batchNumber', name: 'Batch #', width: 75, baseWidth: 4 },
  {field: 'batchQuantity', name: 'Batch Qty', width: 75, baseWidth: 4 },
  {field: 'batchSupplierNumber', name: 'Supplier Code', width: 75, baseWidth: 5 },
  {field: 'batchSupplierName', name: 'Supplier Name', width: 75, baseWidth: 5 },
  {field: 'batchStatus', name: 'Status', width: 75, baseWidth: 4 },
  {field: 'batchOriginationDate', name: 'Org Date', width: 75, baseWidth: 4 },
  {field: 'batchExpirationDate', name: 'Expiration Date', width: 75, baseWidth: 5 },
  {field: 'batchDescription', name: 'Description', width: 75, baseWidth: 6 },
  {field: 'batchParentNumber', name: 'Parent #', width: 75, baseWidth: 4 },
  {field: 'batchGradeCode', name: 'Grade Code', width: 75, baseWidth: 5 },
  {field: 'batchColor', name: 'Color', width: 75, baseWidth: 3 },
  {field: 'batchVolume', name: 'Volume', width: 75, baseWidth: 4 },
  {field: 'batchVolumeUom', name: 'Volume UOM', width: 75, baseWidth: 5 },
  {field: 'batchOriginPlace', name: 'Original Place', width: 75, baseWidth: 5 },
  {field: 'batchLengthUom', name: 'UOM', width: 75, baseWidth: 3 },
  {field: 'batchLength', name: 'Length', width: 75, baseWidth: 3 },
  {field: 'batchThickness', name: 'Thickness', width: 75, baseWidth: 4 },
  {field: 'batchWidth', name: 'Width', width: 75, baseWidth: 3 },
  {field: 'batchMaterialStatus', name: 'Material Status', width: 75, baseWidth: 5 },
//   {field: 'batchHoldDate', name: 'Hold Date', width: 75, baseWidth: 4 },
  {field: 'batchEnabledFlag', name: 'Enable Flag', width: 75, baseWidth: 5 },
  {field: 'action', name: 'Action', width: 75, baseWidth: 4 },
  ]


  batchTableMessage = '';
  @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

  tooltipPosition: TooltipPosition[] = ['below'];
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  showSearch = true;
  refreshSearchLov : any = '';
  iuId: any = '';
  timer: any = '';

  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/batch-search.json');
  dataResult = false;
  itemLov = [];
  batchLov = [];
  itemLovAll = [];
  iuLov : any = [];
  statusLov = [];
  gradeCodeLov = [];
  colorLov = [];
  supplierList = [];
  volumeList = [{label: ' Please Select', value:''}];
  lengthList = [{label: ' Please Select', value:''}];
  thicknessList = [{label: ' Please Select', value:''}];
  widthList = [{label: ' Please Select', value:''}];
  selectedRowIndex = null;
  materialStatusLovList: any = [];

  constructor(
    private render: Renderer,
    private snackBar: MatSnackBar,
    private batchService: BatchService,
    public commonService: CommonService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private subInventoryService: SubInventoryService
    ){
       this.searchEnable = true;
    }

    ngOnInit() {
           //timer used for set iu value on change header value
        this.timer = Observable.interval(500)
        .subscribe((val) => { 
            if( (JSON.parse(localStorage.getItem('defaultIU'))).id !== this.iuId){
                this.iuId = (JSON.parse(localStorage.getItem('defaultIU'))).id
            this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id);
            }
        });
        this.materialStatusLOV();

            this.commonService.paginationArray;
            this.searchJson.subscribe((data: any) => {
          this.dataForSearch = data;
          this.searchBatch();
          this.searchForBatch();
          //this.getItemLovEnabled();
          this.getItemLovAll();
          this.getInventoryOrgLov();
          this.getLookUpLOV('BATCH_COLOR');
          this.getLookUpLOV('BATCH_GRADE');
          this.getLookUpLOV('BATCH_STATUS');
          this.getSupplierList();
          this.getUomLov('Volume');
          this.getUomLov('Length');
          this.getUomLov('Width');
          this.commonService.getScreenSize();
      });
    }

    searchBatch(from?) {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {
                this.isEdit = false;
                // This code is used for not loading the search result when module loads

                if(searchInfo.fromSearchBtnClick === true || from){
                   if(from){
                       searchInfo = {searchType: 'batch',searchArray:{"batchIuId":String(this.iuId),"itemName":''}}
                   }
                    this.customTable.nativeElement.scrollLeft = 0;
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource<
                        ParameterDataElement
                    >(this.parameterData);
                    this.isAdd = false;
                    this.isEdit = false;
                    this.selectedRowIndex = null;
                    this.parameterDataSource.paginator = this.paginator;
                    if (searchInfo.searchType === 'batch') {
                        this.listProgress = true;
                        this.batchService
                            .getBatchSearch(searchInfo.searchArray)
                            .subscribe(data => {
                                if (data.status === 200) {
                                    if (!data.message) {
                                        this.parameterData = [];
                                        this.listProgress = false;
                                        this.dataResult = true;
                                        for (const rData of data.result) {
                                            rData.action = '';
                                            rData.editing = false;
                                            rData.addNewRecord = false;
                                            rData.batchEnabledFlag === 'Y' ? rData.batchEnabledFlag = true : rData.batchEnabledFlag = false;
                                            rData['originalData'] = Object.assign({}, rData);
                                            this.parameterData.push(rData);
                                        }
                                        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                                        this.parameterDataSource.paginator = this.paginator;
                                    // Sorting Start
                                       const sortState: Sort = {active: '', direction: ''};
                                       this.sort.active = sortState.active;
                                       this.sort.direction = sortState.direction;
                                       this.sort.sortChange.emit(sortState);
                                    // Sorting End
                                        this.parameterDataSource.sort = this.sort;
                                        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                        // this.parameterDataSource.connect().subscribe(d => {
                                        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                                        //         this.parameterDataSource.sort);
                                        // });
                                    } else {
                                        this.listProgress = false;
                                        this.dataResult = false;
                                        this.batchTableMessage = data.message;
                                    }
                                } else {
                                    this.listProgress = false;
                                    this.openSnackBar(data.message, '', 'error-snackbar');
                                }
                            });
                    }
                }else{
                    return;
                }

            }
        );
    }
    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    // search for receipt
    searchForBatch() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

  beginEdit(rowData: any, $event: any, index: any) {
    for (const pData of this.parameterData) {
        if (pData.addNewRecord === true) {
            this.openSnackBar('Please add your records first.', '','error-snackbar');
            return;
        }
    }
    if (rowData.editing === false) {

        rowData.editing = true;
        this.isAdd = false;
        this.isEdit = true;
        rowData.showLov1                    = 'hide';
        rowData.inlineSearchLoader1         = 'hide';

        rowData.searchValue1 = rowData.batchSupplierName;
        this.itemSelectionChanged({source : {selected : true, viewValue : rowData.itemName}, isUserInput : true } ,rowData.batchItemId, index )
            if((JSON.parse(localStorage.getItem('defaultIU'))).id !== rowData.batchIuId){
             this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id)
            }
        // this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
        // rowData.editing = false;
        // this.isAdd = true;
        // this.isEdit = false;
        // this.render.setElementClass($event.target, 'editIconEnable', false);
    }
  }

  disableEdit(rowData: any, index: any) {
    this.selectedRowIndex = null;
    if (rowData.editing === true) {

        this.parameterData[index].batchColor            = this.parameterData[index].originalData.batchColor;
        this.parameterData[index].batchDescription      = this.parameterData[index].originalData.batchDescription;
        this.parameterData[index].batchEnabledFlag      = this.parameterData[index].originalData.batchEnabledFlag;
        this.parameterData[index].batchExpirationDate   = this.parameterData[index].originalData.batchExpirationDate;
        this.parameterData[index].batchGradeCode        = this.parameterData[index].originalData.batchGradeCode;
        this.parameterData[index].batchHoldDate         = this.parameterData[index].originalData.batchHoldDate;
        this.parameterData[index].batchId               = this.parameterData[index].originalData.batchId;
        this.parameterData[index].batchItemId           = this.parameterData[index].originalData.batchItemId;
        this.parameterData[index].showLov               = this.parameterData[index].originalData.showLov;
        this.parameterData[index].showLov1              = this.parameterData[index].originalData.showLov1;
        this.parameterData[index].itemName              = this.parameterData[index].originalData.itemName,
        this.parameterData[index].batchItemSize         = this.parameterData[index].originalData.batchItemSize;
        this.parameterData[index].batchLength           = this.parameterData[index].originalData.batchLength;
        this.parameterData[index].batchLengthUom        = this.parameterData[index].originalData.batchLengthUom;
        this.parameterData[index].batchNumber           = this.parameterData[index].originalData.batchNumber;
        this.parameterData[index].batchOriginPlace      = this.parameterData[index].originalData.batchOriginPlace;
        this.parameterData[index].batchOriginationDate  = this.parameterData[index].originalData.batchOriginationDate;
        this.parameterData[index].batchParentNumber     = this.parameterData[index].originalData.batchParentNumber;
        this.parameterData[index].batchQuantity         = this.parameterData[index].originalData.batchQuantity;
        this.parameterData[index].batchStatus           = this.parameterData[index].originalData.batchStatus;
        this.parameterData[index].batchSupplierName     = this.parameterData[index].originalData.batchSupplierName;
        this.parameterData[index].batchSupplierNumber   = this.parameterData[index].originalData.batchSupplierNumber;
        this.parameterData[index].batchThickness        = this.parameterData[index].originalData.batchThickness;
        this.parameterData[index].batchThicknessUom     = this.parameterData[index].originalData.batchThicknessUom;
        this.parameterData[index].batchVolume           = this.parameterData[index].originalData.batchVolume;
        this.parameterData[index].batchVolumeUom        = this.parameterData[index].originalData.batchVolumeUom;
        this.parameterData[index].batchWidth            = this.parameterData[index].originalData.batchWidth;
        this.parameterData[index].batchWidthUom         = this.parameterData[index].originalData.batchWidthUom;
        this.parameterData[index].supplierName          = this.parameterData[index].originalData.supplierName;
        this.parameterData[index].materialStatusId          = this.parameterData[index].originalData.materialStatusId;
        this.parameterData[index].supplierNumberCode    = this.parameterData[index].originalData.supplierNumberCode;
        this.parameterData[index].batchStatusName       = this.parameterData[index].originalData.batchStatusName;
        this.parameterData[index].batchIuId             = this.parameterData[index].originalData.batchIuId;
        this.parameterData[index].iuCode                = this.parameterData[index].originalData.iuCode;

        this.parameterData[index].editing               = false;

    };
    if (
        this.parameterData.find(({ editing }) => editing === true) ===
        undefined
    ) {
        this.isEdit = false;
    }
}

  deleteRow(rowData: any, rowIndex: number) {
      this.selectedRowIndex = null;
    this.parameterData.splice(rowIndex, 1);
    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
     
    this.parameterDataSource.paginator = this.paginator;
    this.parameterDataSource.sort = this.sort;      
    this.checkIsAddRow();
  }

  checkIsAddRow() {
      let cnt = 0;
      const pLength = this.parameterData.length;
      for (const pdata of this.parameterData) {
          if (pdata.addNewRecord === true) {
              return;
          } else {
              cnt++;
          }
      }
      if (cnt === pLength) {
          this.isAdd = false;
      }
  }

  addBatches(data) {
    const body = [];
    
    data.forEach(data1 => {
        // delete dataElement.batchId;
        // delete dataElement.editing;
        // delete dataElement.action
        // delete dataElement.addNewRecord
        //delete dataElement.batchList;
        const dataElement = Object.assign({},data1);

        dataElement.batchItemId = Number(dataElement.batchItemId);
        dataElement.batchItemSize = dataElement.batchItemSize !== null ? Number(dataElement.batchItemSize) : null;
        dataElement.batchLength = dataElement.batchLength !== null ? Number(dataElement.batchLength) : null;
        dataElement.batchQuantity = dataElement.batchQuantity !== null ? Number(dataElement.batchQuantity) : null;
        dataElement.batchThickness = dataElement.batchThickness !== null ? Number(dataElement.batchThickness) : null;
        dataElement.batchVolume = dataElement.batchVolume !== null ? Number(dataElement.batchVolume) : null;
        dataElement.batchWidth = dataElement.batchWidth !== null ? Number(dataElement.batchWidth) : null;
        dataElement.batchIuId = Number( dataElement.batchIuId);
        dataElement.batchExpirationDate = dataElement.batchExpirationDate ? dataElement.batchExpirationDate : null;
        dataElement.batchSupplierNumber = String(dataElement.batchSupplierNumber);

        if(dataElement.batchEnabledFlag){
            dataElement.batchEnabledFlag = 'Y';
        } else{
            dataElement.batchEnabledFlag = 'N';
        }
        body.push(dataElement);
    });


    this.batchService.createBatch(body).subscribe(
        result => {
            if (result.status === 200) {
                this.isAdd = false;
                this.openSnackBar(result.message, '','success-snackbar');
                this.searchBatch('from');
            } else {
                this.isAdd = true;
                this.openSnackBar(result.message, '','error-snackbar');
            }
            this.saveInprogress = false;
        },
        (error: any) => {
            // for (let i = 0; i < error.error.index.length; i++) {
            //     this.parameterData[error.error.index[i] - 1].editing = true;
            //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
            // }

            // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
            for(const Batch of data) {
              Batch.editing = true;
              Batch.addNewRecord = true;
            }
            this.saveInprogress = false;
            this.openSnackBar(error.error.message, '','error-snackbar');
        }
    );
}

    updateBatches(data) {
       
        const body = [];
        data.forEach(dataElement => {
            dataElement.batchItemId = Number(dataElement.batchItemId);
            dataElement.batchItemSize = dataElement.batchItemSize !== null ? Number(dataElement.batchItemSize) : null;
            dataElement.batchLength = dataElement.batchLength !== null ? Number(dataElement.batchLength) : null;
            dataElement.batchQuantity = dataElement.batchQuantity !== null ? Number(dataElement.batchQuantity) : null;
            dataElement.batchThickness = dataElement.batchThickness !== null ? Number(dataElement.batchThickness) : null;
            dataElement.batchVolume = dataElement.batchVolume !== null ? Number(dataElement.batchVolume) : null;
            dataElement.batchWidth = dataElement.batchWidth !== null ? Number(dataElement.batchWidth) : null;
            dataElement.batchIuId = Number(dataElement.batchIuId);
            dataElement.batchSupplierNumber = String(dataElement.batchSupplierNumber);
            dataElement.batchExpirationDate = dataElement.batchExpirationDate ? dataElement.batchExpirationDate : null;

            if(dataElement.batchEnabledFlag){
                dataElement.batchEnabledFlag = 'Y';
            } else{
                dataElement.batchEnabledFlag = 'N';
            }
            body.push(dataElement);
        });
        this.batchService.updateBatch(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.saveInprogress = false;
                    this.openSnackBar(result.message, '','success-snackbar');
                    this.searchBatch("from");
                } else {
                    this.isEdit = true;
                    this.openSnackBar(result.message, '','error-snackbar');
                }
            },
            (error: any) => {
              // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
              this.isEdit = true;
              this.saveInprogress = false;
              for(const Bat of data) {
                if(this.parameterData.find(d => d.batchId = Bat.batchId)) {
                  const index = this.parameterData.indexOf(Bat);
                  this.parameterData[index].editing = true;
                  this.parameterData[index].addNewRecord = true;
                }
              }
              this.openSnackBar(error.error.message, '', 'error-snackbar');
                // this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    focusOut(event: any, index: any){
        const value = event.target.value;
        if(value === '' ||  (value && value.trim().length === 0) ){
            return;
        }else{
            if (this.parameterData[index].batchLengthUom === ''){
                this.parameterData[index].batchLength    = null;
                this.parameterData[index].batchWidth     = null;
                this.parameterData[index].batchThickness = null;
                this.openSnackBar(' Please Select the UOM first', '','error-snackbar');
            }else{

            }
        }
    }

onSubmit(type: string) {
    const dataArray: any[] = [];
    this.saveInprogress = true;
    for (const [i, pData] of this.parameterData.entries()) {
        if (type === 'save') {
             
            if (pData.addNewRecord === true) {
                this.selectedRowIndex = null;
                if (
                    pData.batchItemId &&
                    pData.batchStatus &&
                    pData.batchIuId   &&
                    pData.batchSupplierNumber != '' &&
                    pData.batchQuantity
                ) {
                    dataArray.push(pData);
                    this.parameterData[i].addNewRecord = false;
                    this.parameterData[i].editing = true;
                    this.parameterData[i].batchIuId = String((JSON.parse(localStorage.getItem('defaultIU'))).id);
                    this.parameterData[i]['originalData'] = Object.assign({},pData);
                } else {
                     this.selectedRowIndex = i;
                     this.saveInprogress = false;
                     this.openSnackBar(
                         'Please fill required fields in row ' + (i + 1),
                         '',
                         'error-snackbar'
                     );
                    return;
                }
            }
        } else {
             
            if (pData.editing === true) {
                this.selectedRowIndex = null;
                if (
                    pData.batchItemId &&
                    pData.batchStatus &&
                    pData.batchIuId &&
                    pData.batchSupplierNumber != null
                ) {
                    dataArray.push(pData);
                    this.parameterData[i].batchStatusName = pData.batchStatusName;
                    this.parameterData[i].editing = true;
                    this.parameterData[i].originalData = {};
                    delete pData.originalData;
                    this.parameterData[i]['originalData'] = Object.assign({},pData);
                } else {
                     this.selectedRowIndex = i;
                     this.saveInprogress = false;
                     this.openSnackBar(
                         'Please fill required fields in row ' + (i + 1),
                         '',
                         'error-snackbar'
                     );
                    return;
                }
            }
        }
    }
    if (type === 'save') {
        this.addBatches(dataArray);
    } else {
        this.updateBatches(dataArray);
    }
    for (const [i] of this.parameterData.entries()) {
        this.parameterData[i].editing = false;
        if(!isBoolean(this.parameterData[i].batchEnabledFlag)){
        const val: any = this.parameterData[i].batchEnabledFlag;
        val === 'Y' ? this.parameterData[i].batchEnabledFlag = true : this.parameterData[i].batchEnabledFlag = false;
        }   
    }
}
  materialStatusLOV(){
             this.commonService.getMaterialStatusLOV().subscribe(
                    (result: any) => {
                        this.materialStatusLovList = [{
                            label: ' Please Select',
                            value: ''
                        }];
                        if (result.status === 200) {
                            if (result.result) {
                                const data = result.result;
                                for (const rowData of data) {
                                this.materialStatusLovList.push({
                                     value: rowData.materialStatusId,
                                    label: rowData.materialStatusName
                                });
                            }
                            }
                        }
                })
    }
  addRow(event) {
    this.selectedRowIndex = null;
    this.paginator.pageIndex = 0;
       // Sorting will work in ascending order when page add new row function call
       this.sort.sort({id: '', start: 'asc', disableClear: false});
    if(this.matTableRef.nativeElement.clientHeight > this.commonService.getTableHeight()){
        const elem = document.getElementById('customTable');
        if(elem){
        elem.scrollTop = 0;
        }
    }
    for (const pData of this.parameterData) {
        if (pData.editing === true && pData.addNewRecord === false) {
            this.openSnackBar('Please update your records first.', '','error-snackbar');
            return;
        }
    }
    this.isAdd = true;
    this.isEdit = false;
    this.parameterData.unshift({
      batchId: null,
      batchIuId: String((JSON.parse(localStorage.getItem('defaultIU'))).id),
      batchItemId : null,
      showLov             : 'hide',
      inlineSearchLoader  : 'hide',
      batchNumber : '',
      batchExpirationDate : '',
      batchDescription : '',
      batchQuantity : null,
      batchParentNumber : '',
      batchGradeCode : '',
      batchOriginationDate : new Date(),
      batchStatus : '',
      batchItemSize : null,
      batchColor : '',
      batchVolume : null,
      batchVolumeUom : '',
      batchOriginPlace : '',
      batchLength : null,
      batchLengthUom : '',
      batchThickness : null,
      batchThicknessUom : '',
      batchWidth : null,
      batchWidthUom : '',
      batchSupplierNumber : '',
      materialStatusId : null,
      batchList : [{label: ' Please Select', value:''}],
      showLov1             : 'hide',
      inlineSearchLoader1  : 'hide',
      batchSupplierName : '',
      batchHoldDate : new Date(),
      batchEnabledFlag : true,
      createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
      creationDate: this.batchService.dateFormat(new Date()),
      updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
      updatedDate: this.batchService.dateFormat(new Date()),
      action: '',
      editing: true,
      addNewRecord: true
    });

    this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    this.parameterDataSource.paginator = this.paginator;
    this.commonService.setPaginationSize(event)
  }

  getBatchLov(id, index) {
       
    this.parameterData[index].batchList = [{label: ' Please Select', value:''}];
    this.batchService.getBatchLovById(id).subscribe(
        (data: any) => {
            if(data.status === 200){
                if (data.result) {
                    for (var i = 0; i < data.result.length; i++) {
                        this.parameterData[index].batchList.push({
                            label: data.result[i].batchNumber,
                            value: data.result[i].batchNumber
                        });
                    }
                }
            }
        },
        (error: any) => {
            // this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
    );
  }

  fetchNewSearchList(event: any, index: any, searchFlag: any, value: any){
    let charCode = event.which ? event.which : event.keyCode;
    if(charCode === 9){
       event.preventDefault();
       charCode = 13;
    }

    if ( !searchFlag && charCode !== 13 ){
      return;
    }

    // if( this.parameterData[index].showLov === 'hide' &&
    // (value === undefined || value === '' || ( value && value.trim() ==='' ) )){
    //   this.openSnackBar('Please enter the search value', '','error-snackbar');
    //   return;
    // }

     if(this.parameterData[index].showLov === 'hide'){
        this.parameterData[index].batchItemId = null;
      
      this.parameterData[index].inlineSearchLoader = 'show';
      this.getItemLovByScreen(this.parameterData[index].searchValue, index, event)


    }else{
        this.parameterData[index].showLov = 'hide';
        this.parameterData[index].searchValue = '';
        this.parameterData[index].batchItemId = null;
    }

  }


  getItemLovByScreen(itemName, index, event){
    this.commonService.getItemLovByScreen( 'item', 'batch', '' , itemName).subscribe((data: any) => {

        this.parameterData[index].itemLov = [{
            key   : '',
            viewValue : ' Please Select',
            itemDescription : ''
        }];

        if( data.result && data.result.length){
            data =  data.result;
            this.parameterData[index].itemLov = [];
            for(let i=0; i<data.length; i++){
                this.parameterData[index].itemLov.push({
                    key   : data[i].itemId,
                    viewValue : data[i].itemName,
                    data : data[i]

                })
            }
            this.parameterData[index].inlineSearchLoader = 'hide';
            this.parameterData[index].showLov = 'show';
            this.parameterData[index].searchValue = '';

            // Set the first element of the search

            this.parameterData[index].batchItemId    = data[0].itemId;



        }else{
            this.parameterData[index].inlineSearchLoader = 'hide';
            this.openSnackBar('No match found', '','error-snackbar');
        }
    },
    (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
    })
  }

  getItemLovEnabled() {
    this.itemLov = [{viewValue: ' Please Select', key:''}];
    this.batchService.getItemLov().subscribe(
        (data: any) => {
            data = data.result;
            if (data.length) {
                for (var i = 0; i < data.length; i++) {
                    this.itemLov.push({
                        key: Number(data[i].itemId),
                        viewValue: data[i].itemName,
                        itemDescription: data[i].itemDescription
                    });
                }
            }
        },
        (error: any) => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
        }
    );
  }

    getItemLovAll() {
        this.itemLovAll = [];
        this.batchService.getItemLovAll().subscribe(
            (data: any) => {
                data = data.result;
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.itemLovAll.push({
                            key: data[i].id,
                            viewValue: data[i].name
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }


    fetchNewSearchList1(event: any, index: any, searchFlag: any, value: any){
        let charCode = event.which ? event.which : event.keyCode;
        if(charCode === 9){
           event.preventDefault();
           charCode = 13;
        }

        if ( !searchFlag && charCode !== 13 ){
          return;
        }

        // if( this.parameterData[index].showLov1 === 'hide' &&
        // (value === undefined || value === '' || ( value && value.trim() ==='' ) )){
        //   this.openSnackBar('Please enter the search value', '','error-snackbar');
        //   return;
        // }

         if(this.parameterData[index].showLov1 === 'hide'){
            this.parameterData[index].batchSupplierNumber = '';
           
          this.parameterData[index].inlineSearchLoader1 = 'show';
          this.getItemLovByScreen1(this.parameterData[index].searchValue1, index, event)


        }else{
            this.parameterData[index].showLov1 = 'hide';
            this.parameterData[index].searchValue1 = '';
            this.parameterData[index].batchSupplierNumber = '';
            this.parameterData[index].batchSupplierName = '';
            this.parameterData[index].supplierNumberCode = '';
            this.parameterData[index].supplierName = '';
        }

      }


      getItemLovByScreen1(itemName, index, event){
        this.commonService.getItemLovByScreen( 'tp-name', 'trading-partner', 'SUPP' , itemName).subscribe((data: any) => {


            if( data.result && data.result.length){
              data =  data.result;
              this.parameterData[index].batchSupplierList  = [{label: ' Please Select', value:''}];
                for(let i=0; i<data.length; i++){
                    this.parameterData[index].batchSupplierList.push({
                        value   : data[i].tpId,
                        label   : data[i].tpCode,
                        name    : data[i].tpName

                  })
                }
                this.parameterData[index].inlineSearchLoader1 = 'hide';
                this.parameterData[index].showLov1 = 'show';
                this.parameterData[index].searchValue1 = '';

                // Set the first element of the search

                console.log(this.parameterData[index].batchSupplierNumber)
                this.parameterData[index].batchSupplierNumber    = data[0].tpId;
                console.log(this.parameterData[index].batchSupplierNumber)

            }else{
              this.parameterData[index].inlineSearchLoader1 = 'hide';
              this.openSnackBar('No match found', '','error-snackbar');
            }
        },
        (error: any) => {
          this.openSnackBar(error.error.message, '', 'error-snackbar');
        })
      }

    getSupplierList(){
        this.commonService.getSupplierLOV().subscribe((data: any) => {
        if (data.status === 200) {
            data = data.result;

            this.supplierList = [{label: ' Please Select', value:''}];
            if(data.length){
                for(var i=0; i<data.length; i++){
                    this.supplierList.push({
                        value   : String(data[i].tpId),
                        label   : data[i].tpCode,
                        name    : data[i].tpName
                    })
                }
            }
        }else{
            this.openSnackBar(data.message, '','error-snackbar');
        }

        },
        (error: any) => {
        this.openSnackBar(error.error.message, '', 'error-snackbar');
        })

    }

    getLookUpLOV(lookupName:string) {
        if (lookupName === 'BATCH_COLOR'){
        this.colorLov = [{label: ' Please Select', value:''}];
        this.commonService
            .getLookupLOV(lookupName)
            .subscribe((data: any) => {
            for (const rowData of data.result) {
                this.colorLov.push({
                value: rowData.lookupValue,
                label: rowData.lookupValueDesc
                });
            }
            });
        }
        if (lookupName === 'BATCH_GRADE'){
        this.gradeCodeLov = [{label: ' Please Select', value:''}];
        this.commonService
            .getLookupLOV(lookupName)
            .subscribe((data: any) => {
            for (const rowData of data.result) {
                this.gradeCodeLov.push({
                value: rowData.lookupValue,
                label: rowData.lookupValueDesc
                });
            }
            });
        }
        if (lookupName === 'BATCH_STATUS'){
        this.statusLov = [{label: ' Please Select', value:''}];
        this.commonService
            .getLookupLOV(lookupName)
            .subscribe((data: any) => {
            for (const rowData of data.result) {
                this.statusLov.push({
                value: rowData.lookupValue,
                label: rowData.lookupValueDesc
                });
            }
            });
        }
    }

  // get UOM LOV
  getUomLov(uomName:string){
    if (uomName === 'Volume'){
        this.volumeList = [{label: ' Please Select', value:''}];
        this.batchService.getUomLOV(uomName).subscribe((data: any) => {
            if(data.result){
                for (const rowData of data.result) {
                    this.volumeList.push({
                    value: rowData.uomCode,
                    label: rowData.unitOfMeasure
                    });
                }
            }
        });
    }
    if (uomName === 'Length'){
        this.lengthList = [{label: ' Please Select', value:''}];
        this.thicknessList = [{label: ' Please Select', value:''}];

        this.commonService.getUOMLOV().subscribe((data: any) => {
            if(data.result){
                for (const rowData of data.result) {
                    this.lengthList.push({
                        value: rowData.uomCode,
                        label: rowData.unitOfMeasure
                    });
                    this.thicknessList.push({
                        value: rowData.uomCode,
                        label: rowData.unitOfMeasure
                    });
                }
            }
        });
    }
    if (uomName === 'Width'){
        this.widthList = [{label: ' Please Select', value:''}];
        this.batchService.getUomLOV(uomName).subscribe((data: any) => {
            if(data.result){
                for (const rowData of data.result) {
                    this.widthList.push({
                    value: rowData.uomCode,
                    label: rowData.unitOfMeasure
                    });
                }
            }
        });
    }
  }

  // supplier selection change
  supplierSelectionChanged(event: any, name: string, index:any, data: any){

    if (event.source.selected && event.isUserInput === true && name !== ' Please Select') {
        this.parameterData[index].supplierName = data.name;
        this.parameterData[index].batchSupplierName = name;
        this.parameterData[index].supplierNumberCode = name;
    }else if(event.isUserInput === true && name === ' Please Select'){
        this.parameterData[index].supplierName = '';
        this.parameterData[index].batchSupplierName = '';
        this.parameterData[index].supplierNumberCode = '';
    }
  }

  statusChanged(event: any, name: string, index:any){
    if (event.source.selected && event.isUserInput === true && name !== ' Please Select') {

        this.parameterData[index].batchStatusName = name;
    }
  }

  // item selection change function
  
  itemSelectionChanged(event: any, id: string, index:any){
       
    if (event.source.selected && event.isUserInput === true) {
        this.getBatchLov(id, index);
        this.parameterData[index].itemName = event.source.viewValue;
        // this.parameterData[index].batchList = name;
    }
  }
          

  // iu selection change function
//   iuSelectionChanged(event: any, id: string, index:any){
//     if (event.source.selected && event.isUserInput === true) {

//         this.parameterData[index].iuCode = event.source.viewValue;
//         // this.parameterData[index].batchList = name;
//     }
//   }

defaultIUSelectionChange(iuId){
       for (const pData of this.parameterData) {
           if(pData.editing){
                for (const iuData of this.iuLov) {
                    if(iuData.key === String(iuId)){
                        pData.iuCode = iuData.viewValue;
                        pData.batchIuId = iuData.key;
                    }
                }
           }
            if(pData.addNewRecord){
                for (const iuData of this.iuLov) {
                    if(iuData.key === String(iuId)){
                        pData.iuCode = iuData.viewValue;
                        pData.batchIuId = iuData.key;
                    }
                }
           }
       }
}

  // item selection change function
    uomSelectionChanged(event: any, id: string, index:any){
    if (event.source.selected && event.isUserInput === true) {
        if(id === ''){
            this.parameterData[index].batchLength = null;
            this.parameterData[index].batchWidth = null;
            this.parameterData[index].batchThickness = null;
        }
        // this.parameterData[index].batchList = name;
    }
  }

   // Get the lov for Inventory Orgarnization
   getInventoryOrgLov() {
    this.iuLov = [{ viewValue: ' Please Select', key: '' }];
    this.subInventoryService.getInventoryOrgList().subscribe(
        (data: any) => {
            const inventoryCodelov = data.result;
            for (const rowData of inventoryCodelov) {
                if (rowData.iuEnabledFlag === 'Y') {
                    this.iuLov.push({
                        key: String(rowData.iuId),
                        viewValue: rowData.iuCode
                    });
                }
            }
        },
        error => {
            this.openSnackBar(error, '', 'error-snackbar');
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
    this.timer ? this.timer.unsubscribe() : '';
    this.searchInfoArrayunsubscribe
      ? this.searchInfoArrayunsubscribe.unsubscribe()
      : '';
    this.commonService.getsearhForMasters([]);
  }

  ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize();
    }
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}
