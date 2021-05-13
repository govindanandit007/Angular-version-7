import {
    Component,
    OnInit,
    ViewChild,
    Renderer,
    EventEmitter,
    Output,
    OnDestroy,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { UnitOfMeasureService } from 'src/app/_services/uom/unit-of-measure.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { HttpClient } from '@angular/common/http';
import { MatSort, Sort } from '@angular/material';

export interface ParameterDataElement {
    uom_Sno: string;
    uom_code: string;
    unit_of_measure: string;
    uom_description: string;
    enabled_baseFlag: boolean;
    conversion: string;
    baseUom?: string;
    class: string;
    enabled_flag: boolean;
    uomId: number;
    action: string;
    editing: boolean;
    addNewRecord?: boolean;
    originalData?: any;
}

@Component({
    selector: 'app-unit-of-measure',
    templateUrl: './unit-of-measure.component.html',
    styleUrls: ['./unit-of-measure.component.css'],
    providers: [UnitOfMeasureService]
})
export class UnitOfMeasureComponent implements OnInit, AfterViewInit, OnDestroy {
    isEditable = false;
    isEdit = false;
    isAdd = false;
    listProgress = false;
    classLov = [];
    tempData: any;
    saveInprogress = false;
    private searchInfoArrayunsubscribe: any;
    // private searchArrayunsubscribe: any;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'uom_Sno',
        'uom_code',
        'unit_of_measure',
        'uom_description',
        'class',
        'conversion',
        'baseUom',
        'enabled_baseFlag',
        'enabled_flag',
        'action'
    ];
    columns: any =  [
        {field: 'uom_Sno', name: '#', width: 75, baseWidth: 5 },
        {field: 'uom_code', name: 'UOM Code', width: 150, baseWidth: 10 },
        {field: 'unit_of_measure', name: 'Unit of Measure', width: 150, baseWidth: 13 },
        {field: 'uom_description', name: 'Description', width: 100, baseWidth: 15 },
        {field: 'class', name: 'Class', width: 75, baseWidth: 10 },
        {field: 'conversion', name: 'Conversion', width: 150, baseWidth: 12 },
        {field: 'baseUom', name: 'Base UOM', width: 150, baseWidth: 10 },
        {field: 'enabled_baseFlag', name: 'Base UOM Flag', width: 100, baseWidth: 10 },
        {field: 'enabled_flag', name: 'Enable Flag', width: 100, baseWidth: 8 },
        {field: 'action', name: 'Action', width: 75, baseWidth: 9 }
    ]
    // uomTableMessage = 'No Unit Of Measure defined.';
    uomTableMessage = '';
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    showSearch = true;
    dataForSearch: any = '';
    searchJson: any = this.http.get('./assets/search-jsons/uom-search.json');
    refreshSearchLov : any = '';
    selectedRowIndex = null;
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

    constructor(
        private snackBar: MatSnackBar,
        private uomService: UnitOfMeasureService,
        private render: Renderer,
        private router: Router,
        private http: HttpClient,
        public commonService: CommonService
    ) {
        this.searchEnable = true;
    }

    ngOnInit() {
        this.getClassLov();
        // this.getAllUom();
        this.commonService.getScreenSize(-84); 
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchUOM();
            this.searchForUOM();
        });
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    tooltipPosition: TooltipPosition[] = ['below'];

    checkSearch(){
        let returnType : any = '';
        if(this.refreshSearchLov === 'refresh' ){
            returnType = true;
            this.refreshSearchLov = '';
        }else{
            returnType = false;
        }
        return returnType;
    }

    searchUOM() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {

                 // This code is used for updating the search module lovs when we update or add data
                 const checksearchSource = this.checkSearch();
                 if(checksearchSource === true){
                    return;
                 }
                 // This code is used for not loading the search result when module loads
                 if(searchInfo.fromSearchBtnClick === true){
                    this.selectedRowIndex = null;
                    this.customTable.nativeElement.scrollLeft = 0;
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.isEdit = false;
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    this.uomTableMessage = '';
                    if (searchInfo.searchType === 'uom') {
                        this.listProgress = true;
                        this.uomService
                            .getUOMSearch(searchInfo.searchArray)
                            .subscribe(
                                data => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];
                                            for (const rData of data.result) {
                                                const obj = {
                                                    uom_Sno: '',
                                                    uom_code: rData.uomCode,
                                                    unit_of_measure:
                                                        rData.unitOfMeasure,
                                                    uom_description:
                                                        rData.uomDescription,
                                                    enabled_flag:
                                                        rData.uomEnabledFlag == 'Y'
                                                            ? true
                                                            : false,
                                                    uomId: rData.uomId,
                                                    class: rData.uomClass,
                                                    enabled_baseFlag:
                                                        rData.uomBaseFlag == 'Y'
                                                            ? true
                                                            : false,
                                                    conversion:
                                                        rData.uomConversionRate,
                                                    action: '',
                                                    editing: false,
                                                    addNewRecord: false
                                                };
                                                obj['originalData'] = Object.assign({}, obj);
                                                this.parameterData.push(obj);
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
                                            //      
                                            //     // this.parameterData = d
                                            //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                                            // });
                                        } else {
                                            this.uomTableMessage = data.message;
                                        }
                                    } else {
                                        this.openSnackBar(data.message, '', 'error-snackbar');
                                    }
                                },
                                (error: any) => {
                                    this.listProgress = false;
                                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                                }
                            );
                    }
                 }else{
                     return;
                 }
                // this.uomTableMessage = 'No Unit Of Measure defined.';

            }
        );
    }
    searchForUOM() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;

    }
    searchComponentOpen() {
        // this.commonService.searhForMasters(this.dataForSearch);
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

    beginEdit(rowData: any, $event: any, index: any) {
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
            //   this.render.setElementClass($event.target, 'editIconEnable', true);
            this.tempData = rowData;
        } else {
            // rowData = this.tempData;
            // this.parameterData[index] = rowData;
            // rowData.editing = false;
            // this.isEdit = false;
            // this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (rowData.editing === true) {

            //this.parameterData[index] = rowData;
            this.parameterData[index].conversion        = this.parameterData[index].originalData.conversion;
            this.parameterData[index].unit_of_measure   = this.parameterData[index].originalData.unit_of_measure;
            this.parameterData[index].class             = this.parameterData[index].originalData.class;
            this.parameterData[index].enabled_baseFlag  = this.parameterData[index].originalData.enabled_baseFlag;
            this.parameterData[index].enabled_flag      = this.parameterData[index].originalData.enabled_flag;
            this.parameterData[index].enabled_baseFlag  = this.parameterData[index].originalData.enabled_baseFlag;
            this.parameterData[index].uom_code          = this.parameterData[index].originalData.uom_code;
            this.parameterData[index].uom_description   = this.parameterData[index].originalData.uom_description;
            this.parameterData[index].editing           = false;
            rowData.editing = false;
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
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
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

    addRow(event) {
        this.selectedRowIndex = null;
        this.paginator.pageIndex = 0;      
        this.commonService.setPaginationSize(event)
        if(this.matTableRef.nativeElement.clientHeight > this.commonService.getTableHeight()){
            const elem = document.getElementById('customTable');
            if(elem)
            elem.scrollTop = 0;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === false) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'default-snackbar'
                );
                return
            }
        }
          // Sorting will work in ascending order when page add new row function call
          this.sort.sort({id: '', start: 'asc', disableClear: false});
        this.isAdd = true;
        this.isEdit = false;

        this.parameterData.unshift({
            uom_Sno: '',
            uom_code: '',
            unit_of_measure: '',
            uom_description: '',
            class: '',
            enabled_flag: true,
            uomId: null,
            enabled_baseFlag: false,
            conversion: '',
            baseUom: '',
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }

    onSubmit(type: string) {
        const dataArray: any[] = [];
        this.saveInprogress = true;
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.uom_code !== '' &&
                        pData.unit_of_measure !== '' &&
                        pData.class !== '' &&
                        pData.conversion !==''
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i]['originalData'] = Object.assign({},pData);
                         
                        console.log(pData);
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
            } else {
                if (pData.editing === true) {
                    this.selectedRowIndex = null;
                    if (
                        pData.uom_code !== '' &&
                        pData.unit_of_measure !== '' &&
                        pData.class !== '' &&
                        pData.conversion !==''
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].editing = true;
                        this.parameterData[i].originalData = {};
                        delete pData.originalData;
                        this.parameterData[i]['originalData'] = Object.assign({},pData);
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
            this.addUOM(dataArray);
        } else {
            this.updateUOM(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        }
    }

    addUOM(data) {
        let tempObect = {};
        let uomArray = [];

        if (this.parameterData.length) {
            for (var i = 0; i < data.length; i++) {
                // delete data[i].action;
                // delete data[i].editing;
                // delete data[i].addNewRecord;
                tempObect['createdBy'] = Number(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );
                tempObect['unitOfMeasure'] = data[i].unit_of_measure;
                tempObect['uomClass'] = data[i].class;
                tempObect['uomCode'] = data[i].uom_code;
                tempObect['uomDescription'] = data[i].uom_description;
                tempObect['uomEnabledFlag'] =
                    data[i].enabled_flag == true ? 'Y' : 'N';
                tempObect['uomBaseFlag'] =
                    data[i].enabled_baseFlag == true ? 'Y' : 'N';
                tempObect['uomConversionRate'] = Number(data[i].conversion);
                (tempObect['uomDisableDate'] = null),
                    (tempObect['updatedBy'] = Number(
                        JSON.parse(localStorage.getItem('userDetails')).userId
                    ));

                uomArray.push(tempObect);
                tempObect = {};
            }
        }

        this.uomService.createUom(uomArray).subscribe(
            result => {
                if (result.status === 200) {
                    this.saveInprogress = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.isAdd = false;
                    this.refreshSearchLov = 'refresh';
                    this.dataForSearch['lovSearchFromAdd_update'] = true;
                    this.searchForUOM()
                    // this.getAllUom();
                    // this.searchStockLocator();
                } else {
                    this.saveInprogress = false;
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
              this.isAdd = true;
              this.saveInprogress = false;
                // this.openSnackBar(error.error.message, '', 'error-snackbar');
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
                // }

              // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
              for(const uom of data) {
                uom.editing = true;
                uom.addNewRecord = true;
              }
              this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    updateUOM(data) {
        let tempObect = {};
        let uomArray = [];

        if (this.parameterData.length) {
            for (var i = 0; i < data.length; i++) {
                tempObect['uomId'] = data[i].uomId;
                tempObect['unitOfMeasure'] = data[i].unit_of_measure;
                tempObect['uomClass'] = data[i].class;
                tempObect['uomCode'] = data[i].uom_code;
                tempObect['uomDescription'] = data[i].uom_description;
                tempObect['uomEnabledFlag'] =
                    data[i].enabled_flag == true ? 'Y' : 'N';
                tempObect['uomBaseFlag'] =
                    data[i].enabled_baseFlag == true ? 'Y' : 'N';
                tempObect['uomConversionRate'] = Number(data[i].conversion);
                (tempObect['uomDisableDate'] = null),
                    (tempObect['updatedBy'] = Number(
                        JSON.parse(localStorage.getItem('userDetails')).userId
                    ));

                uomArray.push(tempObect);
                tempObect = {};
            }
        }

        this.uomService.updateUom(uomArray).subscribe(
            result => {
                if (result.status === 200) {
                    this.saveInprogress = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.isEdit = false;
                    this.refreshSearchLov = 'refresh';
                    this.dataForSearch['lovSearchFromAdd_update'] = true;
                    this.searchForUOM();
                    // this.getAllUom();
                    // this.searchStockLocator();
                } else {
                    this.saveInprogress = false;
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
              this.isEdit = true;
              this.saveInprogress = false;
                // this.openSnackBar(error.error.message, '', 'error-snackbar');
                for(const m of data) {
                  if(this.parameterData.find(d => d.uomId = m.uomId)) {
                    const index = this.parameterData.indexOf(m);
                    this.parameterData[index].editing = true;
                    this.parameterData[index].addNewRecord = false;
                    this.parameterData[index].enabled_baseFlag = false;
                  }
                }

                // for (let i = 0; i < this.parameterData.length; i++) {
                //   this.parameterData[i].editing = true;
                //   this.parameterData[i].addNewRecord = true;
                // }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    gotoUomCoversion(data, index) {
        // this.notify.emit(data);
        this.router.navigate(['uom/uom-conversion/' + data.uomId]);
    }

    getClassLov() {
        this.uomService.getClassLov().subscribe(
            (data: any) => {
                data = data.result;
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.classLov.push({
                            key: data[i].lookupValue,
                            viewValue: data[i].lookupValue
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    getAllUom() {
        this.listProgress = true;
        this.uomService.getAllUom().subscribe(
            (data: any) => {
                this.listProgress = false;
                this.parameterData = [];
                data = data.result;
                if (data && data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.parameterData.push({
                            uom_Sno: '',
                            uom_code: data[i].uomCode,
                            unit_of_measure: data[i].unitOfMeasure,
                            uom_description: data[i].uomDescription,
                            enabled_flag:
                                data[i].uomEnabledFlag == 'Y' ? true : false,
                            uomId: data[i].uomId,
                            class: data[i].uomClass,
                            enabled_baseFlag:
                                data[i].uomBaseFlag == 'Y' ? true : false,
                            conversion: data[i].uomConversionRate,
                            action: '',
                            editing: false,
                            addNewRecord: false
                        });
                    }
                }

                this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
                this.parameterDataSource.sort = this.sort;

            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    classSelectionChanged(event:any, index:any, classValue:string){
        if (event.source.selected && event.isUserInput === true) {
            this.getBaseUomByClass(classValue, index);
        }
    }

    getBaseUomByClass(classValue, index){
        this.uomService.getBaseUomByClass(classValue).subscribe(
            (data:any) => {
                if(data.result && data.result.length){
                    this.parameterData[index].baseUom = data.result[0].baseUnitOfMeasure;
                } else{
                    this.parameterData[index].baseUom = '';
                }
            }
        )

    }

    baseFlagSelectionChanged(event:any, index:any){
        if(event.checked){
            this.parameterData[index].conversion = '1';
        }else{
            this.parameterData[index].conversion = '';
        }
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        // this.searchArrayunsubscribe
        //   ? this.searchArrayunsubscribe.unsubscribe()
        //   : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                       
        // this.parameterDataSource.connect().subscribe(d => {
        //     // this.parameterData = d
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
        this.commonService.getScreenSize(-84); 
      }
}
