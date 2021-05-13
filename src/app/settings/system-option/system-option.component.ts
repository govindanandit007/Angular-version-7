import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
  HostListener,
  AfterViewInit,
  TemplateRef,
  Renderer2
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatSort, Sort, MatDialog } from '@angular/material';
import { SystemOptionService } from 'src/app/_services/settings/system-option.service';
import { Observable } from 'rxjs';

export interface ParameterDataElement {
 sno?: any;
 sysOptionName: any;
 sysOptionId: any;
 sysOptionList?: any;
 isLov: any;
 sysOptionValueId: any;
 sysOptionDescription: string;
 sysOptionValue: any;
 valueList?: any;
 editing: boolean;
 action: string;
 addNewRecord?: boolean;
 originalData?: any;
}

@Component({
  selector: 'app-system-option',
  templateUrl: './system-option.component.html',
  styleUrls: ['./system-option.component.css']
})
export class SystemOptionComponent implements OnInit, AfterViewInit, OnDestroy {
    currentTab: any = 'OU';
    inventoryUnit: any = '';
    inventoryUnitList: any = [];
    operatingUnit: any = '';
    operatingUnitList: any = [];
    sysOptionList: any = [];
    isSearchFromCode = false;
    timer: any = '';

    listProgress = false;
    saveInprogress = false;
    systemOptTableMessage = '';
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
      'sno',
      'sysOptionName',
      'sysOptionDescription',
      'sysoptionvaluelabel',
      'action'
    ];

    columns: any = [
      { field: 'sno', name: '#', width: 75, baseWidth: 6 },
      { field: 'sysOptionName', name: 'System Option Name', width: 75, baseWidth: 25 },
      { field: 'sysOptionDescription', name: 'Description', width: 75, baseWidth: 40 },
      { field: 'sysoptionvaluelabel', name: 'Value', width: 75, baseWidth: 15 },
      { field: 'action', name: 'Action', width: 75, baseWidth: 15 },
    ];

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    isIU = false;
    searchEnable: boolean;
    private searchInfoArrayunsubscribe: any;
    showSearch = true;
    isEdit = false;
    isAdd = false;
    currentDeletedSysOpt : any = {};

    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    tooltipPosition: TooltipPosition[] = ['below'];


  constructor(
    private snackBar: MatSnackBar,
    private render: Renderer2,
    public commonService: CommonService,
    public systemOptionService: SystemOptionService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
      this.searchEnable = true;
  }

  dataForSearch: any = '';
  searchJson: any = this.http.get('./assets/search-jsons/system-option.json');
  selectedRowIndex = null;

  ngOnInit() {
      // timer used for set iu value on change header value
    this.timer = Observable.interval(500)
    .subscribe((val) => { 
      if( String((JSON.parse(localStorage.getItem('defaultIU'))).id) !== this.inventoryUnit){
        this.inventoryUnit = (JSON.parse(localStorage.getItem('defaultIU'))).id;
      }

    });
    this.isIU = false;
    this.getOperatingUnitLOV();
    this.getInventoryUnitLOV();
    this.getSystemOptionLOV();
    this.searchJson.subscribe((data: any) => {
      this.dataForSearch = data;
      this.searchSystemOpt();
      this.searchForSystemOpt();
    });
    this.commonService.getScreenSize(0);

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
    searchForSystemOpt() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    searchSystemOpt() {
      this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
          (serialSearchInfo: any) => {
              this.isEdit = false;
              // This code is used for not loading the search result when module loads
              if (serialSearchInfo.fromSearchBtnClick === true) {
                  this.parameterData = [];
                  this.parameterDataSource = new MatTableDataSource([]);
                  this.parameterDataSource.paginator = this.paginator;
                  this.parameterDataSource.sort = this.sort;
                  this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                  this.isAdd = false;
                  this.isEdit = false;

                  if(serialSearchInfo.searchArray.sysOptionId){
                    if(this.currentTab === 'OU' &&  !serialSearchInfo.searchArray.ouId){
                      this.openSnackBar('Please select the OU','','default-snackbar');
                      this.operatingUnit = '';
                      return;
                    }else if(this.currentTab === 'IU' && !serialSearchInfo.searchArray.iuId){
                      this.openSnackBar('Please select the IU','','default-snackbar');
                      this.inventoryUnit = '';
                      return;
                    }
                  }


                  if(Object.keys(serialSearchInfo.searchArray).length === 0){
                    if(this.currentTab === 'OU'){
                      this.openSnackBar('Please select the OU','','default-snackbar');
                      return;
                    }else{
                      this.openSnackBar('Please select the IU','','default-snackbar');
                      return;
                    }
                  }

                  this.setLov(serialSearchInfo.searchArray);

                  if (serialSearchInfo.searchType === 'systemoption') {
                    this.isSearchFromCode = true;
                      this.search(serialSearchInfo.searchArray);
                  }
              } else {
                  return;
              }
          }
      );
    }

    setLov(dataArray){
      if(this.currentTab === 'OU'){
        this.operatingUnit = Number(dataArray.ouId);
      }else{
        this.inventoryUnit = Number(dataArray.iuId);

      }
    }

    switchTab(tabType){
      this.inventoryUnit = '';
      if(tabType === 'OU'){
        this.currentTab = 'OU';
        this.isIU = false;
      }else{
        this.currentTab = 'IU';
        this.isIU = true;
        this.inventoryUnit = (JSON.parse(localStorage.getItem('defaultIU'))).id;
      }
      this.parameterData = [];
      this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
      this.parameterDataSource.paginator = this.paginator;
      this.operatingUnit = '';
    }

    // Get Operating Unit LOV
    getOperatingUnitLOV() {
      this.operatingUnitList = [{
        value: '',
        label: 'Please Select'
      }];
      this.commonService
        .getOULOV()
        .subscribe((data: any) => {
          if(data.result){
            for (const ouData of data.result) {
              this.operatingUnitList.push({
                value: ouData.ouId,
                label: ouData.ouCode
              });
            }

          }
        });
    }

    // Get Inventory Unit LOV
    getInventoryUnitLOV() {
      this.inventoryUnitList = [{
        value: '',
        label: 'Please Select'
      }];
      this.commonService
        .getIULOV()
        .subscribe((data: any) => {
          if(data.result){
            for (const iuData of data.result) {
              this.inventoryUnitList.push({
                value: iuData.iuId,
                label: iuData.iuCode,
                name: iuData.iuName
              });
            }

          }
        });
    }

    getSystemOptionLOV(){
      this.sysOptionList = [{
        value: '',
        label: 'Please Select'
      }];

      let data = {};
      if(this.isIU ===  false){
        data = { sysOptionOuId : this.operatingUnit};
      }else{
        data = { sysOptionIuId : this.inventoryUnit};
      }

      this.systemOptionService
        .getSystemOptionNameLOV(data)
        .subscribe((data: any) => {

          if(data.result){
            for (const temp of data.result) {
              this.sysOptionList.push({
                value: temp.sysOptionId,
                label: temp.sysOptionName,
                data:  temp
              });
            }

          }
        });
    }

    search(serialSearchInfo){
      this.listProgress = true;
      this.parameterData = [];
      this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
      this.parameterDataSource.paginator = this.paginator;
                      this.systemOptionService
                          .getSystemOptionSearch(serialSearchInfo)
                          .subscribe(
                              (data: any) => {
                                  this.listProgress = false;
                                  if (data.status === 200) {
                                      if (!data.message) {
                                        this.parameterData = [];
                                          for (const rowData of data.result) {
                                              rowData.action = '';
                                              rowData.editing = false;
                                              // rowData.sysOptionValueLabel = rowData.sysOptionValue === 'Y' ? 'Yes' :
                                              // ( rowData.sysOptionValue === 'N' ? 'No' : rowData.sysOptionValue )
                                              rowData.originalData = Object.assign({}, rowData);
                                              this.parameterData.push(
                                                  rowData
                                              );
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
                                          this.isSearchFromCode = false;
                                      } else {
                                          this.systemOptTableMessage =
                                              data.message;
                                              this.isSearchFromCode = false;
                                      }
                                  } else {
                                      // alert(data.message);
                                      this.openSnackBar(
                                          data.message,
                                          '',
                                          'error-snackbar'
                                      );
                                      this.isSearchFromCode = false;
                                  }
                              },
                              (error: any) => {
                                  this.listProgress = false; 
                                  this.isSearchFromCode = false;                                  
                                  this.openSnackBar(
                                      error.error.message,
                                      '',
                                      'error-snackbar'
                                  );
                              }
                          );
    }



    inventoryUnitChanged(event: any, iuId:any){
      if (event.source.selected && event.isUserInput === true && iuId && this.isSearchFromCode === false) {
        this.search({iuId : String(iuId)});
      }
    }

    operatingUnitChanged(event: any, ouId){
      if (event.source.selected && event.isUserInput === true && ouId && this.isSearchFromCode === false) {
        this.search({ouId : String(ouId)});
      }
    }

    systemOptionNameChanged(event: any, index, data){
      if (event.source.selected && event.isUserInput === true && data.value !== '') {
        this.parameterData[index].sysOptionDescription = data.data.sysOptionDescription;
        if( data.data.sysOptionValueType === 'L' || data.data.sysOptionValueType === 'B'){
          this.parameterData[index].isLov = true;
          this.getValueLov(data.value, index);
        }else{
          this.parameterData[index].isLov = false;
        }
      }
    }

    getValueLov(value, index){
      this.parameterData[index].valueList = [{
        value: '',
        label: 'Please Select'
      }];
      this.systemOptionService
        .getValueLOV({ sysOptionId : value})
        .subscribe((data: any) => {

          if(data.result){
            for (const temp of data.result) {
              this.parameterData[index].valueList.push({
                value: temp.code,
                label: temp.value,
                data:  temp
              });
            }

          }
        });
    }

    searchComponentOpen() {
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
    }

    addRow() {
      this.selectedRowIndex = null;
      this.paginator.pageIndex = 0;
      
      if(this.currentTab === 'OU'){
        if(this.operatingUnit === ''){
          this.openSnackBar('Please select the operating unit','','default-snackbar');
          return;
        }
      }else{
        if(this.inventoryUnit === ''){
          this.openSnackBar('Please select the inventory unit','','default-snackbar');
          return;
        }
      }      
      // if (
      //     this.matTableRef.nativeElement.clientHeight >
      //     this.commonService.getTableHeight()
      // ) {
      //     const elem = document.getElementById('customTable');
      //     elem.scrollTop = 0;
      // }
      for (const pData of this.parameterData) {
          if (pData.editing === true && pData.addNewRecord === undefined) {
              this.openSnackBar(
                  'Please update your records first.',
                  '',
                  'default-snackbar'
              );
              return;
          }
      }
      // Sorting will work in ascending order when page add new row function call
      this.sort.sort({id: '', start: 'asc', disableClear: false});
      this.isAdd = true;
      this.isEdit = false;
      this.parameterData.unshift({
        sysOptionName: '',
        sysOptionId: '',
        sysOptionValueId: null,
        sysOptionList: [],
        isLov: false,
        sysOptionDescription: '',
        sysOptionValue: '',
        valueList: [],
        action: '',
        editing: true,
        addNewRecord: true
      });

      // createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
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
                  'default-snackbar'
              );
              return;
          }
      }
      if (rowData.editing === false) {
          rowData.editing = true;
          this.isAdd = false;
          this.isEdit = true;
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
    this.selectedRowIndex = null;
      if (rowData.editing === true) {
          this.parameterData[index].sysOptionId = this.parameterData[index].originalData.sysOptionId;
          this.parameterData[index].sysOptionValue = this.parameterData[index].originalData.sysOptionValue;
          this.parameterData[index].editing = false;
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
    if(this.currentTab === 'OU'){
      if(this.operatingUnit === ''){
        this.openSnackBar('Please select the operating unit','','default-snackbar');
        return;
      }
    }else{
      if(this.inventoryUnit === ''){
        this.openSnackBar('Please select the inventory unit','','default-snackbar');
        return;
      }
    }
    this.saveInprogress = true;
    const dataArray: any[] = [];
    for (const [i, pData] of this.parameterData.entries()) {
        if (type === 'save') {
          this.selectedRowIndex = null;
            if (pData.addNewRecord === true) {
                if (
                    pData.sysOptionId &&
                    pData.sysOptionValue
                    ) {
                    dataArray.push(pData);
                    this.parameterData[i].addNewRecord = false;
                    this.parameterData[i].editing = true;
                    this.parameterData[i].originalData = Object.assign(
                        {},
                        pData
                    );
                } else {
                  this.selectedRowIndex = i;
                    this.openSnackBar('Please fill required fields in row '+ (i+1),'','default-snackbar' );
                    this.saveInprogress = false;
                    return;
                }
            }
        } else {
            if (pData.editing === true) {
              this.selectedRowIndex = null;
                if (
                   pData.sysOptionId &&
                   pData.sysOptionValue
                ) {
                    dataArray.push(pData);
                    this.parameterData[i].editing = true;
                    this.parameterData[i].originalData = {};
                    delete pData.originalData;
                    this.parameterData[i].originalData = Object.assign(
                        {},
                        pData
                    );
                } else {
                  this.selectedRowIndex = i;
                    this.openSnackBar(
                        'Please fill required fields in row ' + (i + 1),
                        '',
                        'default-snackbar'
                    );
                    this.saveInprogress = false;
                    return;
                }
            }
        }
    }

    if (type === 'save') {
        this.addSysOpt(dataArray);
    } else {
        this.updateSysOpt(dataArray);
    }
    for (const [i] of this.parameterData.entries()) {
      this.parameterData[i].editing = false;
  }
    console.log(dataArray);
}

addSysOpt(data) {
  const body = [];

  data.forEach(dataElement => {
      const tempObj: any = {};
      // tempObj = Object.assign({}, dataElement);
      tempObj.sysOptionId      = Number(dataElement.sysOptionId);
      tempObj.sysOptionIuId    = this.inventoryUnit ? this.inventoryUnit : null
      tempObj.sysOptionName    = dataElement.sysOptionName
      tempObj.sysOptionOuId    = this.operatingUnit ? this.operatingUnit : null;
      tempObj.sysOptionValue   = dataElement.sysOptionValue
      tempObj.sysOptionValueId = dataElement.sysOptionValueId ? dataElement.sysOptionValueId : null
      tempObj.createdBy        = JSON.parse(localStorage.getItem('userDetails')).userId,
      body.push(tempObj);
  });

  this.systemOptionService.createSystemOption(body).subscribe(
      result => {
          if (result.status === 200) {
              this.isAdd = false;

              if(this.currentTab === 'OU'){
                this.search({ouId : String(this.operatingUnit)});
              }else{
                this.search({iuId : String(this.inventoryUnit)});
              }
              this.openSnackBar(result.message, '', 'success-snackbar');
          } else {
              this.isAdd = true;
              this.openSnackBar(result.message, '', 'error-snackbar');
          }
          this.saveInprogress = false;
          this.isAdd = false;
      },
      (error: any) => {
          for (const Serial of data) {
              Serial.editing = true;
              Serial.addNewRecord = true;
          }
          this.openSnackBar(error.error.message, '', 'error-snackbar');
          this.saveInprogress = false;
          this.isAdd = true;
      }
  );
  
}

updateSysOpt(data) {
  const body = [];

  data.forEach(dataElement => {
      const tempObj: any = {};
      // tempObj = Object.assign({}, dataElement);
      tempObj.sysOptionId      = Number(dataElement.sysOptionId);
      tempObj.sysOptionIuId    = this.inventoryUnit ? this.inventoryUnit : null
      tempObj.sysOptionName    = dataElement.sysOptionName
      tempObj.sysOptionOuId    = this.operatingUnit ? this.operatingUnit : null;
      tempObj.sysOptionValue   = dataElement.sysOptionValue
      tempObj.sysOptionValueId = dataElement.sysOptionValueId ? dataElement.sysOptionValueId : null
      tempObj.updatedBy        = JSON.parse(localStorage.getItem('userDetails')).userId,
      body.push(tempObj);
  });

  this.systemOptionService.updateSystemOption(body).subscribe(
      result => {
          if (result.status === 200) {
              this.isAdd = false;

              if(this.currentTab === 'OU'){
                this.search({ouId : String(this.operatingUnit)});
              }else{
                this.search({iuId : String(this.inventoryUnit)});
              }
              this.openSnackBar(result.message, '', 'success-snackbar');
          } else {
              this.isAdd = true;
              this.openSnackBar(result.message, '', 'error-snackbar');
          }
          this.saveInprogress = false;
          this.isEdit = false;
      },
      (error: any) => {
          for (const Serial of data) {
              Serial.editing = true;
              Serial.addNewRecord = true;
          }
          this.openSnackBar(error.error.message, '', 'error-snackbar');
          this.saveInprogress = false;
          this.isEdit = false;
      }
  );
}



deleteSystemLine(){
  const rowIndex = this.currentDeletedSysOpt.rowIndex;

  const id : any = this.parameterData[rowIndex].sysOptionValueId;
  this.systemOptionService.deleteSysOptLine(id).subscribe((data: any) => {

      if ( data && data.status === 200) {
          this.parameterData.splice(rowIndex, 1);
          this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
              this.parameterData
          );
          this.parameterDataSource.paginator = this.paginator;
          this.dialog.closeAll();
          this.openSnackBar(data.message, '','success-snackbar');
      }else{
        this.openSnackBar(data.message, '','error-snackbar');
      }

    },
        (error: any) => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
        })

}

openDeleteDialog(templateRef: TemplateRef<any>, element: any, event: any, rowIndex: any) {
  this.currentDeletedSysOpt.element  = element;
  this.currentDeletedSysOpt.rowIndex = rowIndex;
  this.dialog.open(templateRef);
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
      //     this.parameterDataSource.sortData(
      //         this.parameterDataSource.filteredData,
      //         this.parameterDataSource.sort
      //     );
      // });
      setTimeout(() => {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
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
        this.commonService.getScreenSize(0);
    }
    sortChanged($event){
      // Added for pagination inilitization
      this.paginator.pageIndex = 0;             
      this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
  }

}
