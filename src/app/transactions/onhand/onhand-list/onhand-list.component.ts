import { Component, OnInit, ViewChild, Renderer, EventEmitter, Output, OnDestroy, TemplateRef, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import { OnHandService } from 'src/app/_services/transactions/on-hand.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSort, Sort } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';

export interface ParameterDataElement {
    onhand_Sno: string;
    itemName: string;
    revsnNumber: string;
    iuCode: string;
    iuName: string;
    primarySum: number;
    onhandPrimaryUomCode: string;
    secondarySum: number;
    onhandSecondaryUomCode: string;
    lgCode:string;
    batchList:string;
    serialList:string;
    onhandItemId: any;
    onhandItemRevision: any;
    onhandIuId: any;
    onhandLgId: any;
    availableQty: any;
    action: string;
}

export interface ParameterDataElementBatch {
    batchNumber            : string;
    batchOriginationDate   : string;
    batchExpirationDate    : string;
    primarySum             : string;
    secondarySum           : string;
    onhandPrimaryUomCode   : string;
    onhandSecondaryUomCode : string;
    serialList             : string;
    onhandItemId           : any;
    onhandIuId             : any;
    onhandLgId             : any;
    onhandItemRevision     : any;
    onhandBatchId          : any;
    availableQty           : any;
  }

  export interface ParameterDataElementSerial {
    batchNumber                : string;
    serialNumber               : string;
  }


@Component({
  selector: 'app-onhand-list',
  templateUrl: './onhand-list.component.html',
  styleUrls: ['./onhand-list.component.css']
})
export class OnhandListComponent implements OnInit, AfterViewInit, OnDestroy {

    listProgress = false;
    listProgressPopup = false;
    currentElement : any = ''
    type : any = '';
    onhandSearchData : any = '';
    OnhandDetail : any = 'Available Qty 20';
    allAvailableQty: any = '';
    searchParameters: any = {
        searchArray: {},
        searchType: 'onhand'
    };
    serialProcess: boolean = false;
    batchProcess: boolean = false;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'onhand_Sno',
        'itemName',
        'revsnNumber',
        'iuCode',        
        'onhandPrimaryUomCode',
        'onhandSecondaryUomCode',
        'primarySum',
        'availableQty',
        'secondarySum',
        'lgCode',
        'batchList',
        'serialList',
        'action'
    ];

    columns: any =  [
        {field: 'onhand_Sno', name: '#', width: 75, baseWidth: 3 },
        {field: 'itemName', name: 'Item', width: 75, baseWidth: 10 },
        {field: 'revsnNumber', name: 'Item Rev', width: 75, baseWidth: 7 },
        {field: 'iuCode', name: 'IU Code', width: 75, baseWidth: 8 },
        {field: 'onhandPrimaryUomCode', name: 'Primary UOM', width: 75, baseWidth:8.5 },
        {field: 'onhandSecondaryUomCode', name: 'Secondary UOM', width: 75, baseWidth: 9.5 },
        {field: 'primarySum', name: 'Primary/Onhand Qty', width: 75, baseWidth:11 },
        {field: 'availableQty', name: 'Available Qty', width: 75, baseWidth: 9 },
        {field: 'secondarySum', name: 'Secondary Qty', width: 75, baseWidth: 9 },
        {field: 'lgCode', name: 'LG', width: 75, baseWidth: 6 },
        {field: 'batchList', name: 'Batch', width: 75, baseWidth: 6 },
        {field: 'serialList', name: 'Serial', width: 75, baseWidth: 6 },
        {field: 'action', name: 'Action', width: 75, baseWidth: 9 }
    ]

    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;


    parameterDataBatch: ParameterDataElementBatch[] = [];
    parameterDataSourceBatch = new MatTableDataSource<ParameterDataElementBatch>(this.parameterDataBatch);
    parameterDisplayedColumnsBatch: string[] = [
        'batchNumber',            
        'batchOriginationDate',   
        'batchExpirationDate',    
        'primarySum',
        'availableQty',
        'secondarySum' ,          
        'onhandPrimaryUomCode',   
        'onhandSecondaryUomCode', 
        'serialList'                                                                                                   
    ];

    parameterDataSerial: ParameterDataElementSerial[] = [];
    parameterDataSourceSerial = new MatTableDataSource<ParameterDataElementSerial>(this.parameterDataSerial);
    parameterDisplayedColumnsSerial: string[] = [
        'serialNo',         
        'batchNo'                                                                
    ];
   

    onhandTableMessage = '';
    batchTableMessage = '';
    serialTableMessage = '';

    isBatch : any = true;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    private searchInfoArrayunsubscribe: any;
    showSearch = true;
    

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   // @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
    @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;
    pageSize = 10;
    
    tooltipPosition: TooltipPosition[] = ['below'];

    constructor(
        private snackBar: MatSnackBar,
        private render: Renderer,
        public commonService: CommonService,
        private onHandService: OnHandService,
        private http: HttpClient,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.searchEnable = true;
    }

    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/onhand-search.json');

    ngOnInit() {
        this.showSearch = true;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForOnhand();
            this.searchOnhand();
            
           
        });
        this.commonService.getScreenSize();

        const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
        if(graphSearchData !== null){
            this.search(graphSearchData);
            localStorage.removeItem('graphSearchData');
        }
     
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

    // search for Onhand
    searchForOnhand() {
         
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchOnhand() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((onHandSearchInfo: any) => {
            // This code is used for not loading the search result when module loads 
            if(onHandSearchInfo.fromSearchBtnClick === true){
                // this.customTable.nativeElement.scrollLeft = 0;

                // onHandSearchInfo.fromSearchBtnClick = false;
                // this.commonService.getsearhForMasters(onHandSearchInfo);
                this.parameterDataSource = new MatTableDataSource([]);
                if (onHandSearchInfo.searchType === 'onhand') {
                    this.searchParameters = onHandSearchInfo
                    this.search(onHandSearchInfo);
                }
            }else{
                
                return;
            }
         
        });
    }

    search(onHandSearchInfo){
        this.listProgress = true;
        if(onHandSearchInfo.searchArray.stockLocation === undefined || onHandSearchInfo.searchArray.stockLocation === '' ){
            //this.openSnackBar('Please select the stock location', '', 'error-snackbar');
            this.listProgress = false;
            return;
        }
        
        this.onhandSearchData = onHandSearchInfo.searchArray
        this.onHandService
            .getOnhandSearch(onHandSearchInfo.searchArray)
            .subscribe(
                (data: any) => {
                  

                    this.listProgress = false;
                    if (data.status === 200) {
                        if (!data.message) {
                            this.parameterData = [];
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
                            //     this.parameterDataSource.connect().subscribe(d => {
                            //         this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                            //     });
                            this.getAllAvailableQty();
                        } else {
                            this.onhandTableMessage = data.message;
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

    refreshOnhand(){
        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
        this.parameterDataSource.paginator = this.paginator;
        this.search(this.searchParameters);
    }

    getAllAvailableQty(){
        
        let temp = this.searchParameters.searchArray;
        const data = {
            onhandItemId       : null,
            onhandLpnId        : null,
            onhandLgId         : null,
            onhandLocatorId    : null,
            onhandBatchId      : null,
            onhandSerialId     : null,
            onhandIuId         : temp.iuId ? Number(temp.iuId) : null,
            onhandItemRevision : null,
            lgCode             : temp.lgCode ? temp.lgCode  : null,
            itemName           : temp.itemName ? temp.itemName : null,
            screen             : 'SUMMARY'  
        }
        this.onHandService.getAllAvailableQty(data)
        .subscribe(
            (data: any) => {
                this.allAvailableQty = [];
                if (data.status === 200 && !data.message) {
                   this.setAvailableQty(data.result);                   
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
    }

    getAllAvailableQtyForBatch(element){
        
        const data = {
            onhandItemId       : element.onhandItemId ? Number(element.onhandItemId) : null,
            onhandLpnId        : null,
            onhandLgId         : element.onhandLgId ? Number(element.onhandLgId) : null,
            onhandLocatorId    : null,
            onhandBatchId      : null,
            onhandSerialId     : null,
            onhandIuId         : element.onhandIuId ? Number(element.onhandIuId) : null,
            onhandItemRevision : element.onhandItemRevision ? Number(element.onhandItemRevision) : null,
            lgCode             : null,
            itemName           : null,
            screen             : 'SUMMARY_BATCH'  
        }
        this.onHandService.getAllAvailableQty(data)
        .subscribe(
            (data: any) => {
                this.allAvailableQty = [];
                if (data.status === 200 && !data.message) {
                   this.setAvailableQtyForBatch(data.result);                   
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
    }

    setAvailableQty(availableQtyList){
        for (const rowData of availableQtyList) {
            for (const [i,rowData1] of this.parameterData.entries()) {
                if( rowData1.onhandItemId       === rowData.itemId   &&
                    rowData1.onhandIuId         === rowData.iuId     &&
                    rowData1.onhandLgId         === rowData.lgId     &&
                    rowData1.onhandItemRevision === rowData.revsnId
                ){
                    this.parameterData[i].availableQty = rowData.availableQty;
                }
            }
       }
    }


    setAvailableQtyForBatch(availableQtyList){
        for (const rowData of availableQtyList) {
            for (const [i,rowData1] of this.parameterDataBatch.entries()) {
                if( rowData1.onhandItemId       === rowData.itemId   &&
                    rowData1.onhandIuId         === rowData.iuId     &&
                    rowData1.onhandLgId         === rowData.lgId     &&
                    rowData1.onhandItemRevision === rowData.revsnId  &&
                    rowData1.onhandBatchId      === rowData.batchId
                    
                ){
                    this.parameterDataBatch[i].availableQty = rowData.availableQty;
                }
            }
       }
    }

    openBatchPopup(templateRef: TemplateRef<any>, element: any){          
        if(element.batchList === 0){
            return
        }
        this.currentElement = element;
        this.listProgressPopup = true;
        this.batchProcess = true;
        const data = {
            itemId:         element.onhandItemId,
            itemRevId:      element.onhandItemRevision,
            iuId:           element.onhandIuId,
            lgId:           element.onhandLgId,
            batchNumber:    this.onhandSearchData.batchNumber   ?  this.onhandSearchData.batchNumber   : null,
            serialNumber:   this.onhandSearchData.serialNumber  ?  this.onhandSearchData.serialNumber  : null,
            stockLocation:  this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null
          
        }
        this.onHandService.getBatchList(data)
        .subscribe(
            (data: any) => {
                this.listProgressPopup = false;
                this.parameterDataBatch = [];
                if (data.status === 200) {
                     
                    if (!data.message) {
                        this.isBatch = true;
                        this.dialog.open(templateRef, {
                          autoFocus: false,
                          width: this.isBatch === false ? '40vw' : '60vw'
                        });
                        for (const rowData of data.result) {
                            this.parameterDataBatch.push(rowData);
                        }
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                        setTimeout(() => {
                            this.batchProcess = false;
                            this.parameterDataSourceBatch.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                        },100);
                        this.getAllAvailableQtyForBatch(element)
                       
                    } else {
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                        setTimeout(() => {
                            this.batchProcess = false;
                            this.parameterDataSourceBatch.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                        },100);                  
                        this.batchTableMessage = data.message;
                        this.isBatch = true;
                        this.dialog.open(templateRef, {
                            autoFocus: false,
                            width: this.isBatch === false ? '40vw' : '50vw'
                        });
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.batchProcess = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
        
    }

    closeDialog(){
        this.pageSize = Number(window.localStorage.getItem('paginationSize'));
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );             
        this.dialog.closeAll();
    }

    backToBatchList(){
        this.isBatch = true;
        this.pageSize = Number(window.localStorage.getItem('paginationSize'));
    }

    
    openSerialPopup(templateRef: TemplateRef<any>, element: any, type: any){
        if(element.serialList === 0){
            return
        }
        this.type = type;
         
        
        this.listProgressPopup = true;
        this.serialProcess = true;
        const data1 = {
            itemId:     element.onhandItemId,
            itemRevId:  element.onhandItemRevision,
            iuId:       element.onhandIuId,
            lgId:       element.onhandLgId,
            batchNumber:    this.onhandSearchData.batchNumber  ?  this.onhandSearchData.batchNumber : null,
            serialNumber:   this.onhandSearchData.serialNumber ?  this.onhandSearchData.serialNumber : null,
            stockLocation:  this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null

        }
        const data2 = {
            batchId :   element.onhandBatchId,
            itemId:     element.onhandItemId,
            itemRevId:  element.onhandItemRevision,
            iuId:       element.onhandIuId,
            lgId:       element.onhandLgId,
            locId:      element.locId,
            serialNumber:   this.onhandSearchData.serialNumber ?  this.onhandSearchData.serialNumber : '',
            stockLocation:  this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null

        }

        const data = (type === 'mainScreen') ? data1 : data2;
        if(type === 'mainScreen'){
            this.currentElement = element;
        }
        this.onHandService.getSerialList(data)
        .subscribe(
            (data: any) => {
                 
                this.listProgressPopup = false;
                this.parameterDataSerial = [];
                if (data.status === 200) {                    
                    if (!data.message) {
                        for (const rowData of data.result) {
                            this.parameterDataSerial.push(rowData);
                        }
                        this.isBatch = false;
                        if(type === 'mainScreen'){
                            this.dialog.open(templateRef, {
                              autoFocus: false,
                              width: this.isBatch === false ? '40vw' : '50vw',
                              
                            });
                        }                         
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                                              
                        setTimeout(() => {
                            this.serialProcess = false;
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                         
                        },100);
                       
                    } else {
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.serialProcess = false;
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                           this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                      
                        },100);
                        this.serialTableMessage = data.message;
                        this.isBatch = false;
                        if(type === 'mainScreen'){
                            this.dialog.open(templateRef, {
                              autoFocus: false,
                              width: this.isBatch === false ? '40vw' : '50vw'
                            });
                        }
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.listProgress = false;
                this.serialProcess = false;
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
       
      }
    setPaginationSize(event?: any){
          let  pageSize='10';
          if(event){
             pageSize = event && event.pageSize ? String(event.pageSize) : '10'
          }else{
             pageSize = window.localStorage.getItem('paginationSize');
          }   
          this.pageSize = Number(pageSize);       
        window.localStorage.setItem('paginationSize', pageSize );        
    }
    gotoDetial(event: any, element: any){
        const data = {
            iuCode: element.iuCode,
            iuName: element.iuName,
            onhandIuId: element.onhandIuId,
            lgCode:element.lgCode,
            onhandLgId:element.onhandLgId,
            revsnNumber:element.revsnNumber,
            onhandItemRevision:element.onhandItemRevision,
            itemName:element.itemName,
            onhandItemId:element.onhandItemId,
            onhandSearchData: JSON.stringify(this.onhandSearchData)
        }
        let navigationExtras: NavigationExtras = {
            queryParams: data
        };
        this.router.navigate(['onhand/onhandDetail/'], navigationExtras);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            
            this.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
            this.paginator.pageSize = this.pageSize;
        }, 100);
                // this.customTable.nativeElement.scrollRight = 0;

    }    
      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize();
      }

}
