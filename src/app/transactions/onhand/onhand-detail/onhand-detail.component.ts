import { Component, OnInit, ViewChild, Renderer, EventEmitter, Output,
    OnDestroy, TemplateRef, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import { OnHandService } from 'src/app/_services/transactions/on-hand.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSort, Sort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

export interface ParameterDataElement {
    onhand_Sno: string;
    itemName: string;
    revsnNumber: string;
    iuCode: string;
    primarySum: number;
    onhandPrimaryUomCode: string;
    secondarySum: number;
    onhandSecondaryUomCode: string;
    lgCode:string;
    batchList:string;
    serialList:string;
    action: string;
    onhandItemId: any;
    onhandItemRevision: any;
    onhandIuId: any;
    onhandLgId: any;
    onhandLocatorId: any;
    onhandLpnId: any;
    availableQty: any;
    lpnAvlQty: any;
    lpnStatus: any;

}

export interface ParameterDataElementBatch {
    batchNumber: string;
    batchOriginationDate: string;
    batchExpirationDate: string;
    primarySum: string;
    secondarySum: string;
    onhandPrimaryUomCode: string;
    onhandSecondaryUomCode: string;
    onhandItemId: any;
    onhandIuId: any;
    onhandLgId: any;
    onhandItemRevision: any;
    onhandLocatorId: any;
    onhandLpnId: any;
    onhandBatchId: any;
    availableQty: any;
    serialList: string;
    locatorId?: any;
}

  export interface ParameterDataElementSerial {
    batchNumber                : string;
    serialNumber               : string;
  }


  @Component({
    selector: 'app-onhand-detail',
    templateUrl: './onhand-detail.component.html',
    styleUrls: ['./onhand-detail.component.css']
  })
export class OnhandDetailComponent implements OnInit, AfterViewInit, OnDestroy {

    listProgress = false;
    listProgressPopup = false;
    headeriuCode : any = '';
    headeritemName : any = '';
    headerrevsnNumber : any = '';
    headerlgCode : any = '';
    currentElement : any = '';
    type : any = '';
    searchData : any = '';
    onhandSearchData : any = '';
    serialPopInBatchIds : any = '';
    searchParameters: any = {
        searchType  :  'ONHAND-DETAIL',
        searchArray : {}
    };
    allAvailableQty: any = null;
    lgId : any = null;
    iuId : any = null;

    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'onhand_Sno',
        'locCode',
        'availableQty',
        'lpnNum',
        'lpnAvlQty',
        'lpnStatus',
        'primarySum',
        'secondarySum',
        'onhandPrimaryUomCode',
        'onhandSecondaryUomCode',
        'batchList',
        'serialList'
    ];

    columns: any =  [
        {field: 'onhand_Sno', name: '#', width: 75, baseWidth: 6 },
        {field: 'locCode', name: 'Stock Locator', width: 75, baseWidth: 8 },
        {field: 'availableQty', name: 'Available Qty', width: 75, baseWidth:7 },
        {field: 'lpnNum', name: 'LPN', width: 75, baseWidth: 8 },
        {field: 'lpnAvlQty', name: 'LPN Available Qty', width: 75, baseWidth: 10 },
        {field: 'lpnStatus', name: 'LPN Status', width: 75, baseWidth: 8 },
        {field: 'primarySum', name: 'Primary Qty', width: 75, baseWidth:8 },
        {field: 'secondarySum', name: 'Secondary Qty', width: 75, baseWidth: 10 },
        {field: 'onhandPrimaryUomCode', name: 'Primary UOM', width: 75, baseWidth: 10 },
        {field: 'onhandSecondaryUomCode', name: 'Secondary UOM', width: 75, baseWidth: 10 },
        {field: 'batchList', name: 'Batch', width: 75, baseWidth: 7 },
        {field: 'serialList', name: 'Serial', width: 75, baseWidth: 7 }
    ]

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
    @ViewChild('paginatorBatch', { static: false }) paginatorBatch: MatPaginator;
    @ViewChild('paginatorSerial', { static: false }) paginatorSerial: MatPaginator;

    tooltipPosition: TooltipPosition[] = ['below'];
      headeriuName: any = '';
      pageSize: number;

    constructor(
        private snackBar: MatSnackBar,
        private render: Renderer,
        public commonService: CommonService,
        private onHandService: OnHandService,
        private http: HttpClient,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.searchEnable = true;
    }

    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;


    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/onhand-detail-search.json');

    ngOnInit() {
        this.showSearch = true;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForOnhand();
            this.searchOnhand();
           
        });

        this.route.queryParams.subscribe(params => {
          this.headeritemName = params.itemName;
          this.headeriuCode = params.iuCode;
          this.headeriuName = params.iuName;
          this.headerrevsnNumber = params.revsnNumber;
          this.headerlgCode = params.lgCode
          this.lgId = params.onhandLgId;
          this.iuId = params.onhandIuId;
          this.getOnhandDetail(params);
        })
        this.commonService.getScreenSize(61);
    }

    getOnhandDetail(params){
         
      this.onhandSearchData = params.onhandSearchData ? JSON.parse(params.onhandSearchData) : null;
      const data = {
        itemId          : params.onhandItemId ? Number(params.onhandItemId) : null,
        itemRevId       : params.onhandItemRevision ? Number(params.onhandItemRevision) : null,
        iuId            : params.onhandIuId ? Number(params.onhandIuId) : null,
        lgId            : params.onhandLgId ? Number(params.onhandLgId) : null,
        batchNumber     : params.onhandSearchData ? JSON.parse(params.onhandSearchData).batchNumber    : null,
        serialNumber    : params.onhandSearchData ? JSON.parse(params.onhandSearchData).serialNumber   : null,
        stockLocation   : params.onhandSearchData ? JSON.parse(params.onhandSearchData).stockLocation  : null
      }
      this.listProgressPopup = true;
      this.searchData = data;
      this.onHandService.getOnhandDetails(data).subscribe((data: any) => {
           
              this.listProgressPopup = false;
              this.parameterDataSerial = [];
              if (data.status === 200) {
                if (!data.message) {
                  this.searchParameters.searchArray = {};
                  this.parameterData = [];
                  for (const rData of data.result) {
                      rData.action = '';
                      this.parameterData.push(rData);
                  }
                      this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                      this.parameterDataSource.paginator = this.paginator;
                      this.parameterDataSource.sort = this.sort;
                    //   this.parameterDataSource.connect().subscribe(d => {
                    //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                    //         this.parameterDataSource.sort);
                    // });
                    if(this.parameterData.length){
                        this.getAllAvailableQty();
                    }
                  } else {
                      this.onhandTableMessage = data.message;
                  }
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
        this.dataForSearch.stockLocatorParameter = {lgId: this.lgId, iuId: this.iuId}
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    getData(){
      return this.searchData;
    }

    searchOnhand() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((onHandSearchInfo: any) => {

            if(onHandSearchInfo.fromSearchBtnClick === true){
                // onHandSearchInfo.fromSearchBtnClick = false;
                // this.commonService.getsearhForMasters(onHandSearchInfo);
                this.customTable.nativeElement.scrollLeft = 0;
                this.parameterDataSource = new MatTableDataSource([]);
            if (onHandSearchInfo.searchType === 'ONHAND-DETAIL') {
                this.listProgress = true;
                // This code is used for not loading the search result when module loads 
                this.searchParameters = onHandSearchInfo
                this.search(onHandSearchInfo)
                
            }
              }else{
                  return;
              }
            
        });
    }

    search(onHandSearchInfo){
        const data: any = this.getData();
                delete data.locId;
                delete data.lpnId;
                if(onHandSearchInfo.searchArray.locatorId){
                  data.locId = Number(onHandSearchInfo.searchArray.locatorId);
                }
                if(onHandSearchInfo.searchArray.lpnId){
                  data.lpnId = onHandSearchInfo.searchArray.lpnId;
                }
               
              
                this.onHandService
                    .getOnhandDetails(data).subscribe( (data: any) => {
                             
                            this.listProgress = false;
                            if (data.status === 200) {
                                if (!data.message) {
                                    this.parameterData = [];
                                    for (const rData of data.result) {
                                        rData.action = '';
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
                                    // this.parameterDataSource.connect().subscribe(d => {
                                    //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                                    //         this.parameterDataSource.sort);
                                    // });
                                    if(this.parameterData.length){
                                        this.getAllAvailableQty();
                                    }
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

    refreshDetail(){
        this.listProgress = true;
        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
        this.parameterDataSource.paginator = this.paginator;
        this.search(this.searchParameters);
    }

    getAllAvailableQty(){
        
        // let temp  = this.searchParameters.searchArray;
        let temp1 = this.parameterData[0];
        const data = {
            onhandItemId       : temp1.onhandItemId ? Number(temp1.onhandItemId) : null,
            // onhandLpnId        : temp1.onhandLpnId ? Number(temp1.onhandLpnId) : null,
            onhandLgId         : temp1.onhandLgId ? Number(temp1.onhandLgId) : null,
            // onhandLocatorId    : temp1.onhandLocatorId ? Number(temp1.onhandLocatorId) : null,
            onhandBatchId      : null,
            onhandSerialId     : null,
            onhandIuId         : temp1.onhandIuId ? Number(temp1.onhandIuId) : null,
            onhandItemRevision : temp1.onhandItemRevision ? Number(temp1.onhandItemRevision) : null,
            lgCode             : null,
            itemName           : null,
            screen             : 'DETAIL'  
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
        let temp1 = element;
        const data = {
            onhandItemId       : temp1.onhandItemId ? Number(temp1.onhandItemId) : null,
            onhandLpnId        : temp1.onhandLpnId ? Number(temp1.onhandLpnId) : null,
            onhandLgId         : temp1.onhandLgId ? Number(temp1.onhandLgId) : null,
            onhandLocatorId    : temp1.onhandLocatorId ? Number(temp1.onhandLocatorId) : null,
            onhandBatchId      : null,
            onhandSerialId     : null,
            onhandIuId         : temp1.onhandIuId ? Number(temp1.onhandIuId) : null,
            onhandItemRevision : temp1.onhandItemRevision ? Number(temp1.onhandItemRevision) : null,
            lgCode             : null,
            itemName           : null,
            screen             : 'DETAIL_BATCH'  
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
                if( 
                    // rowData1.onhandItemId       === rowData.itemId          &&
                    // rowData1.onhandIuId         === rowData.iuId            &&
                    // rowData1.onhandLgId         === rowData.lgId            &&
                    // rowData1.onhandItemRevision === rowData.revsnId         &&  
                    // rowData1.onhandLpnId        === rowData.lpnId           &&
                    rowData1.onhandLocatorId    === rowData.locatorId     
                ){
                    this.parameterData[i].availableQty = rowData.availableQty;
                }
            }
       }
    }


    setAvailableQtyForBatch(availableQtyList){
        for (const rowData of availableQtyList) {
            for (const [i,rowData1] of this.parameterDataBatch.entries()) {
                if (
                    rowData1.onhandItemId === rowData.itemId &&
                    rowData1.onhandIuId === rowData.iuId &&
                    rowData1.onhandLgId === rowData.lgId &&
                    rowData1.onhandItemRevision === rowData.revsnId &&
                    rowData1.onhandLpnId === rowData.lpnId &&
                    // rowData1.locatorId === rowData.locatorId &&
                    rowData1.onhandBatchId === rowData.batchId
                ) {
                    this.parameterDataBatch[i].availableQty =
                        rowData.availableQty;
                }
            }
       }
    }

    openBatchPopup(templateRef: TemplateRef<any>, element: any){
        console.log('on batch file detail' + window.localStorage.getItem('paginationSize'));
        if(element.batchList === 0){
            return
        }
        this.currentElement = {
            itemName    : this.headeritemName,
            iuCode      : this.headeriuCode,
            iuName      : this.headeriuName,
            lgCode      : this.headerlgCode,
            locCode     : element.locCode,
            lpnNum      : element.lpnNum
          
        };
 
        this.serialPopInBatchIds = {
            locId     : element.locId,
            lpnId      : element.onhandLpnId
        }

        this.listProgressPopup = true;
        const data = {
            itemId:     this.searchData.itemId,
            itemRevId:  this.searchData.itemRevId,
            iuId:       this.searchData.iuId,
            lgId:       this.searchData.lgId,
            locId:      element.onhandLocatorId,
            lpnId:      element.onhandLpnId,
            batchNumber     :    this.onhandSearchData.batchNumber   ?  this.onhandSearchData.batchNumber   : null,
            serialNumber    :    this.onhandSearchData.serialNumber  ?  this.onhandSearchData.serialNumber  : null,
            stockLocation   :    this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null
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
                          width: this.isBatch === false ? '50vw' : '60vw'
                        });
                        for (const rowData of data.result) {
                            this.parameterDataBatch.push(rowData);
                        }
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                        setTimeout(() => {
                            this.parameterDataSourceBatch.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            }, 100);
                            
                        if(this.parameterDataBatch.length){
                            this.getAllAvailableQtyForBatch(element);
                        }
                    } else {
                        this.parameterDataSourceBatch = new MatTableDataSource<any>(this.parameterDataBatch);
                        setTimeout(() => {
                            this.parameterDataSourceBatch.paginator = this.paginatorSerial;                             
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                              }, 100);
                             this.batchTableMessage = data.message;
                        this.isBatch = true;
                        this.dialog.open(templateRef, {
                            autoFocus: false,
                            width: this.isBatch === false ? '50vw' : '50vw'
                        });
                    }
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

    closeDialog(){ 
        this.pageSize = Number(window.localStorage.getItem('paginationSize'));
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );             
        this.dialog.closeAll();
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
    backToBatchList(){
        this.isBatch = true;
        this.pageSize = Number(window.localStorage.getItem('paginationSize'));
    }    
    openSerialPopup(templateRef: TemplateRef<any>, element: any, type: any){
        if(element.serialList === 0){
            return
        }
         
        this.type = type;
         
        if(type === 'mainScreen'){
            this.currentElement = {
                itemName    : this.headeritemName,
                iuCode      : this.headeriuCode,
                iuName      : this.headeriuName,
                lgCode      : this.headerlgCode,
                locCode     : element.locCode,
                lpnNum      : element.lpnNum
            };
        }
        
 
        this.listProgressPopup = true;
        const data1 = {
            itemId:     this.searchData.itemId,
            itemRevId:  this.searchData.itemRevId,
            iuId:       this.searchData.iuId,
            lgId:       this.searchData.lgId,
            locId:      element.locId,
            lpnId:      element.onhandLpnId,
            batchNumber     :    this.onhandSearchData.batchNumber   ?  this.onhandSearchData.batchNumber   : null,
            serialNumber    :    this.onhandSearchData.serialNumber  ?  this.onhandSearchData.serialNumber  : null,
            stockLocation   :    this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null
        }
        const data2 = {
            batchId :   element.onhandBatchId,
            itemId:     this.searchData.itemId,
            itemRevId:  this.searchData.itemRevId,
            iuId:       this.searchData.iuId,
            lgId:       this.searchData.lgId,
            locId:      this.serialPopInBatchIds.locId,
            lpnId:      this.serialPopInBatchIds.lpnId,
            batchNumber     :    this.onhandSearchData.batchNumber   ?  this.onhandSearchData.batchNumber   : null,
            serialNumber    :    this.onhandSearchData.serialNumber  ?  this.onhandSearchData.serialNumber  : null,
            stockLocation   :    this.onhandSearchData.stockLocation ?  this.onhandSearchData.stockLocation : null
        }

        const data = (type === 'mainScreen') ? data1 : data2;

        this.onHandService.getSerialList(data)
        .subscribe(
            (data: any) => {
                
                this.listProgressPopup = false;
                this.parameterDataSerial = [];
                if (data.status === 200) {
                    
                    if (!data.message) {
                        this.isBatch = false;
                         
                        if(type === 'mainScreen'){
                            this.dialog.open(templateRef, {
                              autoFocus: false,
                              width: this.isBatch === false ? '50vw' : '50vw'
                            });
                        }
                        for (const rowData of data.result) {
                            this.parameterDataSerial.push(rowData);
                        }
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100); 
                       
                    } else {
                        this.parameterDataSourceSerial = new MatTableDataSource<any>(this.parameterDataSerial);
                        setTimeout(() => {
                            this.parameterDataSourceSerial.paginator = this.paginatorSerial;
                            this.paginatorSerial.pageSizeOptions = this.commonService.paginationArray;
                            this.paginatorSerial.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
                            },100);
                        this.serialTableMessage = data.message;
                        this.isBatch = false;
                        if(type === 'mainScreen'){
                            this.dialog.open(templateRef, {
                              autoFocus: false,
                              width: this.isBatch === false ? '50vw' : '50vw'
                            });
                        }
                    }
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

    gotoDetial(event: any, element: any){
         
        this.router.navigate(['onhand/onhandDetail/' + element.onhandItemId +'/'+
        element.onhandItemRevision +'/'+ element.onhandIuId +'/'+element.onhandLgId]);
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
            this.pageSize = Number(window.localStorage.getItem('paginationSize'));
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   
    
      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(61);
      }

}
