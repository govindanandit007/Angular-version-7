import {
  Component,
  OnInit,
  ViewChild,
  Renderer,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { SerialNoService } from 'src/app/_services/transactions/serial-no.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { MatSort, Sort } from '@angular/material';
import { DataSourceService } from 'src/app/_services/labelSetup/data-source.service';
export interface SerialLovInterface {
    value: number;
    label: string;
}

export interface ParameterDataElement {
    Id: number;
    Name : string;
    Type : string;
    Server : string;
    Port : number;
    Database : string;
    UserName: string;
    Password: string;
    ValidationQuery: string;
    AppUserName: string;
    IsActive: boolean;
    name? : string;
    type? : string;
    server? : string;
    port? : number;
    database? : string;
    userName? : string;
    password? : string;
    validationQuery? : string;
    editing?: boolean;
    addNewRecord?: boolean;
    originalData?: any;
    createdBy?: number;
    updatedBy?: number;
    action?: string;
}

@Component({
  selector: 'app-data-source-list',
  templateUrl: './data-source-list.component.html',
  styleUrls: ['./data-source-list.component.css']
})
export class DataSourceListComponent implements OnInit, AfterViewInit, OnDestroy {

  listProgress = false;
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
    this.parameterData
  );
  parameterDisplayedColumns: string[] = [
    'no',
    'name',
    'type',
    'server',
    'port',
    'database',
    'userName',
    'password',
    'validationQuery',
    'IsActive',
    'action'
  ];

  columns: any = [
    { field: 'no', name: '#', width: 75, baseWidth: 5 },
    { field: 'name', name: 'Name', width: 75, baseWidth: 8 },
    { field: 'type', name: 'Type', width: 75, baseWidth: 8 },
    { field: 'server', name: 'Server', width: 75, baseWidth: 9 },
    { field: 'port', name: 'Port', width: 75, baseWidth: 6 },
    { field: 'database', name: 'Database', width: 75, baseWidth: 9 },
    { field: 'userName', name: 'Username', width: 75, baseWidth: 18 },
    { field: 'password', name: 'Password', width: 75, baseWidth: 9 },
    { field: 'validationQuery', name: 'Validation Query', width: 75, baseWidth: 13 },
    // { field: 'AppUserName', name: 'Enabled', width: 75, baseWidth: 10 },
    { field: 'IsActive', name: 'Enabled', width: 75, baseWidth: 8 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 7 }
  ];

  serialTableMessage = '';
  @Output() searchComponentToggle = new EventEmitter<boolean>();
  searchEnable: boolean;
  private searchInfoArrayunsubscribe: any;
  showSearch = true;
  isDisable = true;
  isEditable = false;
  isEdit = false;
  isAdd = false;
  dataResult = false;
  selectedRowIndex = null;

  @ViewChild(MatTable, { read: ElementRef, static: false })
  matTableRef: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  screenMaxHeight: any;

  enabledInventoryCodeList: any;
  allLocatorGroupList: any[];
  serialStatusList: any[];
  refreshSearchLov: any = '';
  enabledSerialItemList: any[];
  sourceTypeList = [];

  constructor(
    private snackBar: MatSnackBar,
    private render: Renderer,
    public commonService: CommonService,
    private serialNoService: SerialNoService,
    private http: HttpClient,
    private subInventorys: SubInventoryService,
    private dataSourceService: DataSourceService
  ) {
    this.searchEnable = true;
  }

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/sno-search.json');

  ngOnInit() {
    this.parameterDataSource.paginator = this.paginator;
    this.showSearch = true;
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.getDataSourceList();
      this.searchForSerialNo();
    });
    this.commonService.getScreenSize();
    this.getLookUpLOV('Data Source Type');
        this.parameterDataSource.sort = this.sort;

  }

  // show / hide search section
  getSearchToggle(searchToggle: boolean) { 
    if (searchToggle === true) {
      this.searchEnable = searchToggle;
    } else {
      this.searchEnable = searchToggle;
    }
  }

  // search for Onhand
  searchForSerialNo() {
    this.commonService.searhForMasters(this.dataForSearch);
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

  searchComponentOpen() {
    this.searchComponentToggle.emit(this.showSearch);
    this.searchEnable = true;
  }

 getDataSourceList(){
     this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource();
                    this.parameterDataSource.sort = this.sort;
                    setTimeout(() => {
                        this.parameterDataSource.paginator = this.paginator;
                    }, 1000);
    this.dataSourceService
      .getDataSourceSearch()
      .subscribe(data => {
        // if (data.status === 200) {
        //   if (!data.message) {
            this.listProgress = false;
            this.dataResult = true;
            for (const rData of data) {
              rData.action = '';
              rData.editing = false;
              if (rData.isActive === 0) {
                rData.isActive = false;
              } else {
                rData.isActive = true;
              }
              this.parameterData.push(rData);
            }
            this.parameterDataSource = new MatTableDataSource<
              ParameterDataElement
            >(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            // // Sorting Start
            //        const sortState: Sort = {active: '', direction: ''};
            //        this.sort.active = sortState.active;
            //        this.sort.direction = sortState.direction;
            //        this.sort.sortChange.emit(sortState);
            // // Sorting End
            this.parameterDataSource.sort = this.sort;
            this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];

            // this.parameterDataSource.connect().subscribe(d => {
            //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
            //     this.parameterDataSource.sort);
            // });
    
      });
  }
  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

  // addRow() {
  //   this.paginator.pageIndex = 0;
  //   if (
  //     this.matTableRef.nativeElement.clientHeight >
  //     this.commonService.getTableHeight()
  //   ) {
  //     const elem = document.getElementById('customTable');
  //     elem.scrollTop = 0;
  //   }
  //   for (const pData of this.parameterData) {
  //     if (pData.editing === true && pData.addNewRecord === undefined) {
  //       this.openSnackBar(
  //         'Please update your records first.',
  //         '',
  //         'default-snackbar'
  //       );
  //       return;
  //     }
  //   }
  //   this.isAdd = true;
  //   this.isDisable = false;
  //   this.isEdit = false;
  //   this.parameterData.unshift({
  //     Id: null,
  //     Name:'',
  //     Type:'',
  //     Server:'',
  //     Port: null,
  //     Database:'',
  //     UserName:'',
  //     Password:'',
  //     ValidationQuery:'',
  //     AppUserName:'',
  //     IsActive: false,
  //     createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
  //     updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
  //     action: '',
  //     editing: true,
  //     addNewRecord: true
  //   });

  //   this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
  //     this.parameterData
  //   );
  //   this.parameterDataSource.paginator = this.paginator;
  // }
    addRow() {
        // this.selectedRowIndex = null;
        this.paginator.pageIndex = 0;
        // Sorting will work in ascending order when page add new row function call
        this.sort.sort({id: '', start: 'asc', disableClear: false});
        if (
            this.matTableRef.nativeElement.clientHeight >
            this.commonService.getTableHeight()
        ) {
            const elem = document.getElementById('customTable');
            if(elem)
            elem.scrollTop = 0;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === undefined) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        // for (const [i] of this.parameterData.entries()) {
        //     this.parameterData[i].editing = false;
        // }
        // this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
       
        this.isAdd = true;
        // this.isDisable = false;
        this.isEdit = false;
        this.parameterData.unshift({
              Id: null,
              Name:'',
              name:'',
              Type:'',
              type:'',
              Server:'',
              server:'',
              Port: null, 
              port:null,            
              Database:'',
              database:'',
              UserName:'',
              userName:'',
              password:'',
              Password:'',
              ValidationQuery:'',
              validationQuery:'',
              AppUserName:'',
              IsActive: false,
              createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
              updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
              action: '',
              editing: true,
              addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];

    }
  beginEdit(rowData: any, $event: any) {
    for (const pData of this.parameterData) {
      if (pData.addNewRecord === true) {
        this.openSnackBar(
          'Please add your records first.',
          '',
          'error-snackbar'
        );
        return;
      }
    }
    if (rowData.editing === false) {
      rowData.editing = true;
      this.isAdd = false;
      this.isEdit = true;
      this.isDisable = false;
      // this.render.setElementClass($event.target, 'editIconEnable', true);
    } else {
      // rowData.editing = false;
      // this.isAdd = true;
      // this.isEdit = false;
      // this.isDisable = true;
      // this.render.setElementClass($event.target, 'editIconEnable', false);
    }
  }

  disableEdit(rowData: any, index: any) {
    if (rowData.editing === true) {
      rowData.editing = false;
    }
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
    this.isDisable = true;
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

  onSubmit(type: string) {
    this.selectedRowIndex = null;
    const data = this.validateDataSource();
    
    if(data === 'validateError'){
      return;
    }

    if (type === 'save') {
      this.addDataSource(data);
    } else {
      this.updateDataSource(data);
    } 
  }
    addDataSource(data) {
        const body = [];

        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj.Name = dataElement.name;
            tempObj.Type = dataElement.type;
            tempObj.Server = dataElement.server;
            tempObj.Port = Number(dataElement.port);
            tempObj.Database = dataElement.database;
            tempObj.UserName = dataElement.userName;
            tempObj.Password = dataElement.password;
            tempObj.isActive = dataElement.isActive == true ? 1 : 0;
            tempObj.ValidationQuery = dataElement.validationQuery;
            tempObj.AppUserName = 'admin@visioncorp.com';
            delete tempObj.Id;
            delete tempObj.IsActive;
            delete tempObj.action;
            // delete tempObj.addNewRecord;
            delete tempObj.createdBy;
            // delete tempObj.editing;
            delete tempObj.updatedBy;
            body.push(tempObj);

        });
        let dataObj ={dataSources: [], AppUserName :''};
        dataObj = {dataSources: body, AppUserName: 'admin@visioncorp.com' };
        this.dataSourceService.createDataSource(dataObj).subscribe(
            result => {
                    this.isAdd = false;
                    this.openSnackBar(data.error.text, '', 'success-snackbar');
            },
            (response: any) => {
                if(response.status === 200){
                    this.isAdd = false
                    this.openSnackBar(response.error.text, '', 'success-snackbar');
                for (const obj of data) {
                    obj.editing = false;
                    obj.addNewRecord = false;
                }
                }else{
                this.openSnackBar(response.error, '', 'error-snackbar');
                }
            }
        );
    }

    updateDataSource(data) {
        const body = [];
        data.forEach(dataElement => {
          if (dataElement.editing === true) {
            let tempObj: any = {};
            // tempObj = Object.assign({}, dataElement);
            tempObj.Name = dataElement.name;
            tempObj.Type = dataElement.type;
            tempObj.Server = dataElement.server;
            tempObj.Port = Number(dataElement.port);
            tempObj.Database = dataElement.database;
            tempObj.UserName = dataElement.userName;
            tempObj.Password = dataElement.password;
            tempObj.ValidationQuery = dataElement.validationQuery;
            tempObj.isActive = dataElement.isActive == true? 1 : 0;
            tempObj.AppUserName = 'admin@visioncorp.com';
            tempObj.id = dataElement.id;
            delete tempObj.Id;
            delete tempObj.IsActive;
            delete tempObj.action;
            delete tempObj.createdBy;
            delete tempObj.updatedBy;
            body.push(tempObj);
          }
        });
        let dataObj ={dataSources: [], AppUserName :''};
        dataObj = {dataSources: body, AppUserName: 'admin@visioncorp.com' };
        this.dataSourceService.createDataSource(dataObj).subscribe(
             result => {
                    this.isAdd = false;
                    this.isEdit = false;
                    this.openSnackBar(data.error.text, '', 'success-snackbar');
            },
            (response: any) => {
                if(response.status === 200){
                    this.isAdd = false;
                    this.isEdit = false;
                    this.openSnackBar(response.error.text, '', 'success-snackbar');
                for (const obj of data) {
                    obj.editing = false;
                    obj.addNewRecord = false;
                }
                }else{
                this.openSnackBar(response.error.text, '', 'error-snackbar');
                this.isAdd = false;
                this.isEdit = false;
                }
            }
        );
    }
  validateDataSource(){
    const dataArray = [];
    for(const [index, sData] of this.parameterData.entries()){
      sData.port = Number(sData.port) !== 0 ? Number(sData.port) : null;
      if(sData.name ==='' || sData.type ==='' || sData.server==='' || sData.port=== null
      || sData.database==='' || sData.userName==='' || sData.password==='' || sData.validationQuery===''){
        this.openSnackBar('Please enter all required fields in row '+ (index+1), '', 'error-snackbar');
        this.selectedRowIndex = index;
        return 'validateError';
      }
      dataArray.push(sData);
    }
    return dataArray;
  }
 
  // Get Lookup LOV's
  getLookUpLOV(lookupName:string) {
    if (lookupName === 'Data Source Type'){
      this.sourceTypeList = [];
      this.commonService
        .getLookupLOV(lookupName)
        .subscribe((data: any) => {
          for (const rowData of data.result) {
            this.sourceTypeList.push({
              value: rowData.lookupValue,
              label: rowData.lookupValueDesc
            });
          }
        });
    }
  }

   ngOnDestroy() {
    this.searchInfoArrayunsubscribe
      ? this.searchInfoArrayunsubscribe.unsubscribe()
      : '';
    this.commonService.getsearhForMasters([]);
  }

    @HostListener('window:resize', [])
  onResize(): void {
    this.commonService.getScreenSize();
    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
  }
  getScreenSize(event?) {
    const screenHeight = window.innerHeight;
    this.screenMaxHeight = (screenHeight - 248) + 'px';
    //   this.scrWidth = window.innerWidth; 
  }
  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
    this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];

    setTimeout(() => {
      this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
      this.paginator.pageSizeOptions = this.commonService.paginationArray;
      this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
  }, 100);
  }
  sortChanged($event){
    // Added for pagination inilitization
    this.paginator.pageIndex = 0;             
    this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
}
}
