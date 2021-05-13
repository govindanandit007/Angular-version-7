import {
    Component,
    OnInit,
    ViewChild,
    Renderer,
    Output,
    OnDestroy,
    Input,
    EventEmitter,
    HostListener,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { StockLocatorService } from 'src/app/_services/stock-locator.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyComponent } from '../company.component';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    NgModel
} from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MatSort } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { CompanyService } from 'src/app/_services/company.service';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
// import moment = require('moment');
// tslint:disable-next-line:no-duplicate-imports
// import { default as _rollupMoment } from 'moment';

export interface LocatorGroupLovInterface {
    value: any;
    label: string;
    lgType: string;
    lgTypeName: string;
}
export interface ParameterDataElement {
    locCode: string;
    lgCode?: string;
    slAliasName: string;
    locDescription: string;
    locDisableDate: string;
    locEmptyFlag: string;
    locEnabledFlag: boolean;
    locEndDate: string;
    locItemId: number;
    locIuId: number;
    materialStatusId: number;
    locLgId: number;
    showLov? : string,
    searchValue? : string,
    inlineSearchLoader? : string,
    locMixedItemsFlag: string;
    locPickUomCode: string;
    locSegment1: string;
    locSegment2: string;
    locSegment3: string;
    locSegment4: string;
    locSiType: string;
    locStartDate: string;
    locStatus: string;
    locPickingOrder: number;
    locDroppingOrder: number;
    locMaxCubicArea: number;
    locMaxUnits: number;
    locMaxWeight: number;
    locSuggestedCubicArea: number;
    locSuggestedUnits: number;
    locSuggestedWeight: number;
    locVolumeUomCode: string;
    locWeightUomCode: string;
    locDimensionUomCode: string;
    locCurrentCubicArea: number;
    locCurrentUnits: number;
    locCurrentWeight: number;
    locAvailableCubicArea: number;
    locAvailableUnits: number;
    locAvailableWeight: number;
    locWidth: number;
    locLength: number;
    locHeight: number;
    locXCoordinate: number;
    locYCoordinate: number;
    locZCoordinate: number;
    locatorId: number;
    updatedBy: number;
    updatedDate: string;
    createdBy: number;
    creationDate: string;
    editing: boolean;
    action: string;
    addNewRecord?: boolean;
    customerEditing: boolean;
    customerAddNewRecord?: boolean;
    submitted?: boolean;
    locatorGroupList?: LocatorGroupLovInterface[];
    enabledLocatorGroupList?: LocatorGroupLovInterface[];
    orginalLocatorGroupList?: LocatorGroupLovInterface[];
    orginalEnabledLocatorGroupList?: LocatorGroupLovInterface[];
    originalData?: any;
    locCustomerId:any;
}

@Component({
    selector: 'app-stock-locators',
    templateUrl: './stock-locators.component.html',
    styleUrls: ['./stock-locators.component.css']
})
export class StockLocatorsComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    StockLocatorFormData: FormGroup;
    listProgress = false;
    saveInprogress = false;
    showSearch = true;
    isDisable = true;
    submitted = false;
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    refreshSearchLov : any = '';
    searchEnableFlag = false;
    searchIconValue : any = '';
    is3plCompany: any = [];
    _3plCustomerList :any[];
    customerFlag: boolean = false;
    customerPlaceHolder: any = 'Customer';
    customerLabel:any = '';
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;

    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/locator-search.json');
    locMessage = '';

    overlayNoRowsTemplate = '';
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;

    parameterData: ParameterDataElement[] = [];
    parameterDisplayedColumns: string[] = [
        // 'locIuId',
        'locCustomerId',
        'locLgId',
        'locCode',
        'slAliasName',
        'locSiType',
        'locDescription',
        'locPickingOrder',
        'locDroppingOrder',
        'locMaterialStatus',
        'locMaxUnits',
        'locCurrentUnits',
        'locSuggestedUnits',
        'locAvailableUnits',
        'locMaxCubicArea',
        'locCurrentCubicArea',
        'locSuggestedCubicArea',
        'locAvailableCubicArea',
        'locMaxWeight',
        'locCurrentWeight',
        'locSuggestedWeight',
        'locAvailableWeight',
        'locLength',
        'locWidth',
        'locHeight',
        'locXCoordinate',
        'locYCoordinate',
        'locZCoordinate',
        'locDisableDate',
        'locEnabledFlag',
        'action'
    ];
    columns: any =  [
        // {field: 'locIuId', name: 'IU Code', width: 75, baseWidth: 3 },
        {field: 'locCustomerId', name: 'Customer', width: 75, baseWidth: 3 },
        {field: 'locLgId', name: 'Locator Group Code', width: 150, baseWidth: 5 },
        {field: 'locCode', name: 'Stock Locator Name', width: 150, baseWidth: 5 },
        {field: 'slAliasName', name: 'Alias Name', width: 150, baseWidth: 3 },
        {field: 'locSiType', name: 'Locator Group Type', width: 150, baseWidth: 5 },
        {field: 'locDescription', name: 'Description', width: 150, baseWidth: 3.5 },
        {field: 'locPickingOrder', name: 'Picking Order', width: 150, baseWidth: 4 },
        {field: 'locDroppingOrder', name: 'Dropping Order', width: 150, baseWidth: 4 },
        {field: 'locMaterialStatus', name: 'Material Status', width: 150, baseWidth: 4 },
        {field: 'locMaxUnits', name: 'Maximum', width: 150, baseWidth: 3 },
        {field: 'locCurrentUnits', name: 'Current', width: 150, baseWidth: 3 },
        {field: 'locSuggestedUnits', name: 'Suggested', width: 150, baseWidth: 3.5 },
        {field: 'locAvailableUnits', name: 'Available', width: 150, baseWidth: 3 },
        {field: 'locMaxCubicArea', name: 'Maximum', width: 150, baseWidth: 3 },
        {field: 'locCurrentCubicArea', name: 'Current', width: 150, baseWidth: 2.5 },
        {field: 'locSuggestedCubicArea', name: 'Suggested', width: 150, baseWidth: 3 },
        {field: 'locAvailableCubicArea', name: 'Available', width: 150, baseWidth: 3 },
        {field: 'locMaxWeight', name: 'Maximum', width: 150, baseWidth: 3 },
        {field: 'locCurrentWeight', name: 'Current', width: 150, baseWidth: 3 },
        {field: 'locSuggestedWeight', name: 'Suggested', width: 150, baseWidth: 3 },
        {field: 'locAvailableWeight', name: 'Available', width: 150, baseWidth: 3 },
        {field: 'locLength', name: 'Length', width: 150, baseWidth: 2.5 },
        {field: 'locWidth', name: 'Width', width: 150, baseWidth: 2.5 },
        {field: 'locHeight', name: 'Height', width: 150, baseWidth: 2.5 },
        {field: 'locXCoordinate', name: 'X Coordinate', width: 150, baseWidth: 4 },
        {field: 'locYCoordinate', name: 'Y Coordinate', width: 150, baseWidth: 4 },
        {field: 'locZCoordinate', name: 'Z Coordinate', width: 150, baseWidth: 4 },
        {field: 'locDisableDate', name: 'Disabled Date', width: 100, baseWidth: 4 },
        {field: 'locEnabledFlag', name: 'Enable Flag', width: 100, baseWidth: 3 },
        {field: 'action', name: 'Action', width: 75, baseWidth: 2 }
    ]
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);

    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    isEditable = false;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    inventoryCodeList: any[];
    materialStatusLovList: any[];
    enabledInventoryCodeList: any[];
    allLocatorGroupList: any[];
    locatorGroupList: any[];
    subInventoryTypeLov: any[];
    selectedRowIndex = null;

    constructor(
        // tslint:disable-next-line: deprecation
        private render: Renderer,
        private fb: FormBuilder,
        private stockLocatorService: StockLocatorService,
        private snackBar: MatSnackBar,
        private companycomponent: CompanyComponent,
        public commonService: CommonService,
        public dialog: MatDialog,
        private subInventorys: SubInventoryService,
        private companyService: CompanyService,
        private http: HttpClient
    ) {}

    ngOnInit() {

        this.subInventorys.defaultIuDataObservable.subscribe((data: any) => {
            console.log(data);
            this.defaultIUSelectionChange(data);
        });

        this.showSearch = true;
        this.getInventoryOrgLov();
        this.getMaterialStatusLov();
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchStockLocator();
            this.searhForLOC();
        });
        this.getAllLoctorGroupsLov();
        this.getSubInvertoryTypeLOV();
        this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
        if(this.is3plCompany){
            this.get3PLCustomerList();
        }
        this.commonService.getScreenSize(-30);
        this.searchIconValue = this.companyService.searchIconValue.subscribe((searchEnableFlag: any) => {
            this.searchEnableFlag = searchEnableFlag;
        });
    }

    defaultIUSelectionChange(iuId){
        for (const pData of this.parameterData) {
            if(pData.editing){
                    pData.locIuId = iuId;
                    pData.locSiType = '';
                    pData.showLov = 'hide';
                    pData.searchValue = '';
                    pData.locLgId = null;
            }
            if(pData.addNewRecord && pData.editing){
                pData.locCode = '';
            }
            if(!pData.editing){
            pData.originalData.locatorGroupList = pData.locatorGroupList
            }
                if(pData.locIuId == iuId){
                pData.locatorGroupList = [];
                }
                pData.enabledLocatorGroupList = [];
                pData.orginalEnabledLocatorGroupList = [];
                pData.orginalLocatorGroupList = [];
                for (const rowData of this.allLocatorGroupList) {

                    if (rowData.lgIuId === iuId) {
                        
                        if (rowData.lgEnabledFlag ==='Y'){
                            
                            pData.enabledLocatorGroupList.push({
                                value: rowData.value,
                                label: rowData.label,
                                lgType: rowData.lgType,
                                lgTypeName: rowData.lgTypeName
                            });
                            pData.orginalEnabledLocatorGroupList.push({
                                value: rowData.value,
                                label: rowData.label,
                                lgType: rowData.lgType,
                                lgTypeName: rowData.lgTypeName
                            });
                        }
                        pData.locatorGroupList.push({
                            value: rowData.value,
                            label: rowData.label,
                            lgType: rowData.lgType,
                            lgTypeName: rowData.lgTypeName
                        });
                        // pData['originalData'] = Object.assign({}, rowData);
                        pData.orginalLocatorGroupList.push({
                            value: rowData.value,
                            label: rowData.label,
                            lgType: rowData.lgType,
                            lgTypeName: rowData.lgTypeName
                        });
                    }
                }
            //    }
            //    if(pData.locatorId &&)
        }
    }
    // Get the lov for Inventory Orgarnization
    getInventoryOrgLov() {
     
        this.inventoryCodeList = [];
        this.enabledInventoryCodeList = [];
        this.subInventorys.getInventoryOrgList().subscribe(
            (data: any) => {
                const inventoryCodelov = data.result;
                for (const rowData of inventoryCodelov) {
                    if(rowData.iuEnabledFlag === 'Y'){
                        this.enabledInventoryCodeList.push({
                            value: rowData.iuId,
                            label: rowData.iuCode
                        });
                    }
                            this.inventoryCodeList.push({
                                value: rowData.iuId,
                                label: rowData.iuCode
                            });
                }
            },
            error => {
                this.openSnackBar(error , '', 'error-snackbar');
            }
        );
    }

// Get the lov for Material Status
    getMaterialStatusLov() {
     
        // this.enabledInventoryCodeList = [];
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

    // Get the Locator Groups List
    getAllLoctorGroupsLov() {
        this.allLocatorGroupList = [];
        this.commonService.getLocatorGroupList().subscribe(
            (data: any) => {

                const locatorGroupLov = data.result;
                if(!data.message){
                    for (const rowData of locatorGroupLov) {
                        this.allLocatorGroupList.push({
                            value: rowData.lgId,
                            label: rowData.lgCode,
                            lgType: rowData.lgType,
                            lgTypeName: rowData.lgTypeName,
                            lgIuId: rowData.lgIuId,
                            lgEnabledFlag: rowData.lgEnabledFlag
                        });
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    stockLocatorCodeSelectionChanged(event, index, lgType, lgCode) {
        if (event.source.selected === true && event.isUserInput === true) {
            this.parameterData[index].locSiType = lgType;
             this.parameterData[index].searchValue = lgCode;
             this.parameterData[index].lgCode = lgCode;            
        }
    }

    get3PLCustomerList() {
        // this._3plCustomerList = [];
        this.commonService.getSearchLOV('3PLCUSTOMER').subscribe(
          (result: any) => {
            this._3plCustomerList = [{
              label: ' Please Select',
              value: ''
            }];
            if (result.status === 200) {
              if (result.result) {
                const data = result.result;
                for (const lovItem of data) {
                    if(lovItem.enabledFlag === 'Y'){
                        this._3plCustomerList.push({
                            label: lovItem.code,
                            value: lovItem.id,
                            data: lovItem
                        });
                    }
                }
              }
            }
          },
          error => {
            this.openSnackBar(error, '','default-snackbar');
          })
    }

    // setCUstomerLabel(event:any,index, customerLabel){
    //     if (event.source.selected && event.isUserInput === true) {  
    //         this.customerLabel = customerLabel;
    //     }
    //     if (event.source.selected === true && event.isUserInput === true) {
    //         this.parameterData[index].locSiType = lgType;
    //          this.parameterData[index].searchValue = lgCode;
    //          this.parameterData[index].lgCode = lgCode;            
    //     }
    // }

    // IUSelectionChanged(event: any, index, iuId) {
    //     if (event.source.selected === true && event.isUserInput === true) {
    //         if( this.parameterData[index].locIuId !== iuId ){
    //             this.parameterData[index].locSiType = '';
    //             this.parameterData[index].showLov = 'hide';
    //             this.parameterData[index].searchValue = '';
    //             this.parameterData[index].locLgId = null;
    //         }

    //         this.parameterData[index].locatorGroupList = [];
    //         this.parameterData[index].enabledLocatorGroupList = [];
    //         this.parameterData[index].orginalEnabledLocatorGroupList = [];
    //         this.parameterData[index].orginalLocatorGroupList = [];
    //         for (const rowData of this.allLocatorGroupList) {

    //             if (rowData.lgIuId === iuId) {
    //                 if (rowData.lgEnabledFlag ==='Y'){
                        
    //                     this.parameterData[index].enabledLocatorGroupList.push({
    //                         value: rowData.value,
    //                         label: rowData.label,
    //                         lgType: rowData.lgType,
    //                         lgTypeName: rowData.lgTypeName
    //                     });
    //                     this.parameterData[index].orginalEnabledLocatorGroupList.push({
    //                         value: rowData.value,
    //                         label: rowData.label,
    //                         lgType: rowData.lgType,
    //                         lgTypeName: rowData.lgTypeName
    //                     });
    //                 }
    //                 this.parameterData[index].locatorGroupList.push({
    //                     value: rowData.value,
    //                     label: rowData.label,
    //                     lgType: rowData.lgType,
    //                     lgTypeName: rowData.lgTypeName
    //                 });
                    
    //                 this.parameterData[index].orginalLocatorGroupList.push({
    //                     value: rowData.value,
    //                     label: rowData.label,
    //                     lgType: rowData.lgType,
    //                     lgTypeName: rowData.lgTypeName
    //                 });
    //             }
    //         }
    //     }
    // }


    fetchNewSearchList(event: any, index: any, searchFlag: any, value: any){
        let charCode = event.which ? event.which : event.keyCode;
        if(charCode === 9){
           event.preventDefault();
           charCode = 13;
        }

        if ( !searchFlag && charCode !== 13 ){
          return;
        }

        if(!this.parameterData[index].locIuId){
            this.openSnackBar('Please select the IU ', '','default-snackbar');
            return;
        }

         if(this.parameterData[index].showLov === 'hide'){
          this.parameterData[index].inlineSearchLoader = 'show';
          this.getItemLovByScreen(this.parameterData[index].searchValue, index, event)


        }else{
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].searchValue = '';
            this.parameterData[index].locLgId = null;
            this.parameterData[index].lgCode = '';
            
            
             
        }

      }

    getItemLovByScreen(itemName, index, event){

        if(this.isAdd === true){
            const orginalArrayEnabled = this.parameterData[index].orginalEnabledLocatorGroupList;
            this.parameterData[index].enabledLocatorGroupList = []
            for ( const [i, rowData] of orginalArrayEnabled.entries() ){
                if( orginalArrayEnabled[i].label.toLocaleLowerCase().includes(itemName.toLocaleLowerCase())){
                    this.parameterData[index].enabledLocatorGroupList.push(orginalArrayEnabled[i]);
                }
            }
            if(this.parameterData[index].enabledLocatorGroupList.length){
                this.parameterData[index].inlineSearchLoader = 'hide';
                this.parameterData[index].showLov = 'show';
                this.parameterData[index].searchValue = '';

                // Set the first element of the search
                this.parameterData[index].locLgId = this.parameterData[index].enabledLocatorGroupList[0].value;
            }else{
                this.parameterData[index].inlineSearchLoader = 'hide';
                this.openSnackBar('No match found', '','default-snackbar');
            }
        }else{
            const orginalLocatorGroupList = this.parameterData[index].orginalLocatorGroupList;
            this.parameterData[index].locatorGroupList = []
            for ( const [i, rowData] of orginalLocatorGroupList.entries() ){
                if( orginalLocatorGroupList[i].label.toLocaleLowerCase().includes(itemName.toLocaleLowerCase())){
                    this.parameterData[index].locatorGroupList.push(orginalLocatorGroupList[i]);
                }
            }

            if(this.parameterData[index].locatorGroupList.length){
                this.parameterData[index].inlineSearchLoader = 'hide';
                this.parameterData[index].showLov = 'show';
                this.parameterData[index].searchValue = '';
                // Set the first element of the search
                this.parameterData[index].locLgId = this.parameterData[index].locatorGroupList[0].value;
            }else{
                this.parameterData[index].inlineSearchLoader = 'hide';
                this.openSnackBar('No match found', '','default-snackbar');
            }
        }

    }


    // Get the lov for subInventory type lov
    getSubInvertoryTypeLOV() {
        this.subInventoryTypeLov = [];
        this.searchArrayunsubscribe = this.subInventorys
            .getSubInvertoryTypeLOVList()
            .subscribe(
                (data: any) => {
                    const subInventoryTypes = data.result;
                    if (!data.message) {
                        for (const rowData of subInventoryTypes) {
                            this.subInventoryTypeLov.push({
                                value: rowData.lookupId,
                                label: rowData.lookupValueDesc
                            });
                        }
                    } else {
                        this.subInventoryTypeLov.push({
                            value: '',
                            label: data.message
                        });
                    }
                },
                error => {
                    this.openSnackBar(error, '', 'error-snackbar');
                }
            );
    }

    // searhForLOC() {
    //     this.companycomponent.showSearchFlag.subscribe((data: any) => {
    //         if (data === 'stocklocators') {
    //             this.commonService.searhForMasters(this.dataForSearch);
    //             // this.searchComponentToggle.emit(this.showSearch);
    //             this.companyService.displaySearchComponent(this.showSearch);
    //         }
    //     });
    // }
    searhForLOC() {
        this.searchArrayunsubscribe = this.companycomponent.showSearchFlag.subscribe((data: any) => {
            if (data === 'stocklocators') {
                this.commonService.searhForMasters(this.dataForSearch);
                // this.searchComponentToggle.emit(this.showSearch);
                this.companyService.displaySearchComponent(this.showSearch);
            }
        });
    }
    searchComponentOpen() {
        this.companyService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }

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
   
    searchStockLocator() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (locSearchInfo: any) => {
                this.isEdit = false;
                // This code is used for updating the search module lovs when we update or add data
                const checksearchSource = this.checkSearch();
                if(checksearchSource === true){
                   return;
                }


                // This code is used for not loading the search result when module loads
                if(locSearchInfo.fromSearchBtnClick === true){
                    this.selectedRowIndex = null;
                   this.customTable.nativeElement.scrollLeft = 0;	

                   this.parameterData = [];
                   this.parameterDataSource = new MatTableDataSource([]);
                   this.parameterDataSource.sort = this.sort;


                   if (locSearchInfo.searchType === 'stockLocator') {
                       this.listProgress = true;
                       this.stockLocatorService
                           .getStockLocatorSearch(locSearchInfo.searchArray)
                           .subscribe(
                               (data: any) => {
                                //    locSearchInfo.fromSearchBtnClick = false;
                                //    this.commonService.getsearhForMasters(locSearchInfo);
                                   this.listProgress = false;
                                   if (data.status === 200) {                                   
                                       if (!data.message) {
                                           this.parameterData = [];
                                           for (const rowData of data.result) {
                                               if (
                                                   rowData.locEnabledFlag === 'N'
                                               ) {
                                                   rowData.locEnabledFlag = false;
                                               } else {
                                                   rowData.locEnabledFlag = true;
                                               }
                                               rowData.action = '';
                                               rowData.editing = false;
                                               rowData.customerEditing = false;
                                               rowData['originalData'] = Object.assign({}, rowData);
                                               this.parameterData.push(rowData);
                                            this.defaultIUSelectionChange(rowData.locIuId)
                                           }
                                           this.parameterDataSource = new MatTableDataSource<any>(this.parameterData);
                                           this.parameterDataSource.paginator = this.paginator;
                                           this.sort.sort({id: '', start: null , disableClear: false});
                                           this.parameterDataSource.sort = this.sort;
                                       } else {
                                           this.locMessage = data.message;
                                       }
                                   } else {
                                       this.openSnackBar(
                                           data.message,
                                           '',
                                           'error-snackbar'
                                       );
                                   }
                               },
                               (error: any) => {
                                   this.listProgress = false;
                                   // alert(error.error.message);
                                   this.openSnackBar(
                                       error.error.message,
                                       '',
                                       'error-snackbar'
                                   );
                               }
                           );
                   }
                }else{
                    return;
                }


            }
        );
    }

    beginEdit(rowData: any, $event: any, index: any) {
        this.selectedRowIndex = null;
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
            rowData.customerEditing = true;
            this.isAdd = false;
            this.isEdit = true;
            this.isDisable = false;

            this.parameterData[index].searchValue = rowData.lgCode;
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].inlineSearchLoader = 'hide';
            if((JSON.parse(localStorage.getItem('defaultIU'))).id !== rowData.locIuId){
             this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id)
            }

            // this.render.setElementClass($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.isAdd = true;
            // this.isEdit = false;
            // this.isDisable = true;
            // this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
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

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (rowData.editing === true) {
            this.parameterData[index].locIuId                 = this.parameterData[index].originalData.locIuId;
            this.parameterData[index].locLgId                 = this.parameterData[index].originalData.locLgId;
            this.parameterData[index].locCode                 = this.parameterData[index].originalData.locCode;
            this.parameterData[index].slAliasName             = this.parameterData[index].originalData.slAliasName;
            this.parameterData[index].locSiType               = this.parameterData[index].originalData.locSiType;
            this.parameterData[index].locDescription          = this.parameterData[index].originalData.locDescription;
            this.parameterData[index].locPickingOrder         = this.parameterData[index].originalData.locPickingOrder;
            this.parameterData[index].locPickUomCode          = this.parameterData[index].originalData.locPickUomCode;
            this.parameterData[index].locStatus               = this.parameterData[index].originalData.locStatus;
            this.parameterData[index].locMaxUnits             = this.parameterData[index].originalData.locMaxUnits;
            this.parameterData[index].locCurrentUnits         = this.parameterData[index].originalData.locCurrentUnits;
            this.parameterData[index].locSuggestedUnits       = this.parameterData[index].originalData.locSuggestedUnits;
            this.parameterData[index].locAvailableUnits       = this.parameterData[index].originalData.locAvailableUnits;
            this.parameterData[index].locMaxCubicArea         = this.parameterData[index].originalData.locMaxCubicArea;
            this.parameterData[index].locCurrentCubicArea     = this.parameterData[index].originalData.locCurrentCubicArea;
            this.parameterData[index].locSuggestedCubicArea   = this.parameterData[index].originalData.locSuggestedCubicArea;
            this.parameterData[index].locAvailableCubicArea   = this.parameterData[index].originalData.locAvailableCubicArea;
            this.parameterData[index].locMaxWeight            = this.parameterData[index].originalData.locMaxWeight;
            this.parameterData[index].locCurrentWeight        = this.parameterData[index].originalData.locCurrentWeight;
            this.parameterData[index].locSuggestedWeight      = this.parameterData[index].originalData.locSuggestedWeight;
            this.parameterData[index].locAvailableWeight      = this.parameterData[index].originalData.locAvailableWeight;
            this.parameterData[index].locLength               = this.parameterData[index].originalData.locLength;
            this.parameterData[index].locWidth                = this.parameterData[index].originalData.locHeight;
            this.parameterData[index].locHeight               = this.parameterData[index].originalData.locHeight;
            this.parameterData[index].locXCoordinate          = this.parameterData[index].originalData.locXCoordinate;
            this.parameterData[index].locYCoordinate          = this.parameterData[index].originalData.locYCoordinate;
            this.parameterData[index].locZCoordinate          = this.parameterData[index].originalData.locZCoordinate;
            this.parameterData[index].locDisableDate          = this.parameterData[index].originalData.locDisableDate;
            this.parameterData[index].locEnabledFlag          = this.parameterData[index].originalData.locEnabledFlag;
            this.parameterData[index].locDimensionUomCode     = this.parameterData[index].originalData.locDimensionUomCode;
            this.parameterData[index].locDroppingOrder        = this.parameterData[index].originalData.locDroppingOrder;
            this.parameterData[index].locEmptyFlag            = this.parameterData[index].originalData.locEmptyFlag;
            this.parameterData[index].locEndDate              = this.parameterData[index].originalData.locEndDate;
            this.parameterData[index].locItemId               = this.parameterData[index].originalData.locItemId;
            this.parameterData[index].locMixedItemsFlag       = this.parameterData[index].originalData.locMixedItemsFlag;
            this.parameterData[index].locSegment1             = this.parameterData[index].originalData.locSegment1;
            this.parameterData[index].locSegment2             = this.parameterData[index].originalData.locSegment2;
            this.parameterData[index].locSegment3             = this.parameterData[index].originalData.locSegment3;
            this.parameterData[index].locSegment4             = this.parameterData[index].originalData.locSegment4;
            this.parameterData[index].locStartDate            = this.parameterData[index].originalData.locStartDate;
            this.parameterData[index].locVolumeUomCode        = this.parameterData[index].originalData.locVolumeUomCode;
            this.parameterData[index].locWeightUomCode        = this.parameterData[index].originalData.locWeightUomCode;
            this.parameterData[index].locatorId               = this.parameterData[index].originalData.locatorId;
            this.parameterData[index].materialStatusId        = this.parameterData[index].originalData.materialStatusId;
            this.parameterData[index].locatorGroupList        = this.parameterData[index].originalData.locatorGroupList;
            this.parameterData[index].editing                 = false;
            this.parameterData[index].customerEditing         = false;

        };
        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
    }


    addRow() {
        this.selectedRowIndex = null;
        this.paginator.pageIndex = 0;
        if(this.matTableRef.nativeElement.clientHeight > this.commonService.getTableHeight()){
            const elem = document.getElementById('customTable');
            if(elem !== null)
            elem.scrollTop = 0;
        }
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
        this.isAdd = true;
        this.isDisable = false;
        this.isEdit = false;
        this.parameterData.unshift({
            locCode: null,
            slAliasName: '',
            locDescription: null,
            locDisableDate: '',
            locEmptyFlag: null,
            locEnabledFlag: true,
            locEndDate: null,
            locItemId: null,
            locIuId: (JSON.parse(localStorage.getItem('defaultIU'))).id,
            showLov                     : 'hide',
            inlineSearchLoader          : 'hide',
            locLgId: null,
            materialStatusId: null,
            locMixedItemsFlag: null,
            locPickUomCode: null,
            locSegment1: null,
            locSegment2: null,
            locSegment3: null,
            locSegment4: null,
            locSiType: null,
            locStartDate: null,
            locStatus: null,
            locPickingOrder: null,
            locDroppingOrder: null,
            locMaxCubicArea: null,
            locMaxUnits: null,
            locMaxWeight: null,
            locSuggestedCubicArea: null,
            locSuggestedUnits: null,
            locSuggestedWeight: null,
            locVolumeUomCode: null,
            locWeightUomCode: null,
            locDimensionUomCode: null,
            locCurrentCubicArea: null,
            locCurrentUnits: null,
            locCurrentWeight: null,
            locAvailableCubicArea: null,
            locAvailableUnits: null,
            locAvailableWeight: null,
            locWidth: null,
            locLength: null,
            locHeight: null,
            locXCoordinate: null,
            locYCoordinate: null,
            locZCoordinate: null,
            locatorId: null,
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            creationDate: null,
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedDate: null,
            action: '',
            editing: true,
            addNewRecord: true,
            customerEditing:true,
            customerAddNewRecord:true,
            locCustomerId: null, 
        });
        this.defaultIUSelectionChange((JSON.parse(localStorage.getItem('defaultIU'))).id)
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

    // open dialog
    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage
            }
        });
    }

    regExpMatch(inputValue) {
        if (inputValue) {
            const rgxExp = inputValue.match(
                /[a-zA-Z0-9]{1,20}\.[a-zA-Z0-9]{1,20}\.[a-zA-Z0-9]{1,20}/g
            );
            if (rgxExp !== null) {
                return true;
            } else {
                return false;
            }
        }
    }

    onSubmit(type: string) {
        let dataArray: any[] = [];
        
        this.saveInprogress = true;
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null
                    if (
                        pData.locIuId &&
                        pData.locLgId &&
                        pData.locCode &&
                        this.regExpMatch(pData.locCode)
                    ) {
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i]['originalData'] = Object.assign({},pData);
                        dataArray.push(pData);
                    } else {

                        this.submitted = true;
                        this.selectedRowIndex = i;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i+1),
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
                        pData.locIuId &&
                        pData.locLgId &&
                        pData.locCode &&
                        this.regExpMatch(pData.locCode)
                    ) {
                        dataArray.push(pData);
                        this.parameterData[i].editing = true;
                        this.parameterData[i].locIuId = (JSON.parse(localStorage.getItem('defaultIU'))).id,
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
        this.customerFlag = false;
        if (type === 'save') {
            this.addStockLocators(dataArray);
        } else {
            this.updateStockLocator(dataArray);
        }
       
    }

    addStockLocators(data) {
        const body = [];
        let locCodeValue = '';
        data.forEach(dataElement => {
            
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            
            if(this.is3plCompany && (tempObj.locCustomerId === null || tempObj.locCustomerId === '') && !this.customerFlag){
                this.openConfirmationDialog('3PLADD','stocklocators');
                return;
            }
            tempObj.locEnabledFlag =
            tempObj.locEnabledFlag === true ? 'Y' : 'N';
            locCodeValue = tempObj.locCode.split('.');
            tempObj.locSegment1 = locCodeValue[0];
            tempObj.locSegment2 = locCodeValue[1];
            tempObj.locSegment3 = locCodeValue[2];
            tempObj.locMaxUnits = tempObj.locMaxUnits !== null ? Number(tempObj.locMaxUnits) : null;
            tempObj.locCurrentUnits = tempObj.locCurrentUnits !== null ? Number(tempObj.locCurrentUnits) : null;
            tempObj.locSuggestedUnits = tempObj.locSuggestedUnits !== null ? Number(tempObj.locSuggestedUnits) : null;
            tempObj.locAvailableUnits = tempObj.locAvailableUnits !== null ? Number(tempObj.locAvailableUnits) : null;
            tempObj.locMaxCubicArea = tempObj.locMaxCubicArea !== null ? Number(tempObj.locMaxCubicArea) : null;
            tempObj.locCurrentCubicArea = tempObj.locCurrentCubicArea !== null ? Number(tempObj.locCurrentCubicArea) : null;
            tempObj.locSuggestedCubicArea = tempObj.locSuggestedCubicArea !== null ? Number(tempObj.locSuggestedCubicArea) : null;
            tempObj.locAvailableCubicArea = tempObj.locAvailableCubicArea !== null ? Number(tempObj.locAvailableCubicArea) : null;
            tempObj.locMaxWeight = tempObj.locMaxWeight !== null ? Number(tempObj.locMaxWeight) : null;
            tempObj.locCurrentWeight = tempObj.locCurrentWeight !== null ? Number(tempObj.locCurrentWeight) : null;
            tempObj.locSuggestedWeight = tempObj.locSuggestedWeight !== null ? Number(tempObj.locSuggestedWeight) : null;
            tempObj.locAvailableWeight = tempObj.locAvailableWeight !== null ? Number(tempObj.locAvailableWeight) : null;
            tempObj.locLength = tempObj.locLength !== null ? Number(tempObj.locLength) : null;
            tempObj.locWidth = tempObj.locWidth !== null ? Number(tempObj.locWidth) : null;
            tempObj.locHeight = tempObj.locHeight !== null ? Number(tempObj.locHeight) : null;
            tempObj.locXCoordinate = tempObj.locXCoordinate !== null ? Number(tempObj.locXCoordinate) : null;
            tempObj.locYCoordinate = tempObj.locYCoordinate !== null ? Number(tempObj.locYCoordinate) : null;
            tempObj.locZCoordinate = tempObj.locZCoordinate !== null ? Number(tempObj.locZCoordinate) : null;
            const dp = new DatePipe(navigator.language);
            const p = 'y-MM-dd'; // YYYY-MM-DD
            const dtr = dp.transform(new Date(), p);
            tempObj.locDisableDate = tempObj.locDisableDate !== '' ? this.companycomponent.dateFormat(new Date(tempObj.locDisableDate)) : null;
            tempObj.createdBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;

            body.push(tempObj);
            // setTimeout(
            //     () =>
            //         (dataElement.locEnabledFlag =
            //             dataElement.locEnabledFlag === 'Y' ? true : false),
            //     200
            // );
        });
        if(body.length !== 0){
        this.stockLocatorService.createStockLocators(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isAdd = false;
                    this.isDisable = true;
                    this.refreshSearchLov = 'refresh';
                    this.dataForSearch['lovSearchFromAdd_update'] = true;
                    this.searhForLOC();
                    // this.openDialog('success', result.message);
                    this.openSnackBar(result.message, '', 'success-snackbar');
                   this.searchStockLocator();
                } else {
                    this.isAdd = false;

                    // this.openDialog('error', result.message);
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
                
            },
            (error: any) => {
                this.isAdd = true;
                // for( let i = 0; i<error.error.index.length ; i++){
                //     this.parameterData[error.error.index[i] -1 ].editing = true;
                //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
                // }

                // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
                for(const stockLocator of data) {
                  stockLocator.editing = true;
                  stockLocator.addNewRecord = true;
                  stockLocator.customerEditing = true;
                  stockLocator.customerAddNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
        }else{
            this.saveInprogress = false;
            this.isAdd = false;
        }
    }

    updateStockLocator(data) {
        const body = [];
        let locCodeValue = '';
        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            console.log(this.customerFlag);
            if(this.is3plCompany && (tempObj.locCustomerId === null || tempObj.locCustomerId === '')  && !this.customerFlag){
                this.openConfirmationDialog('3PLEDIT','stocklocators');
                return;
            }
            tempObj.locEnabledFlag =
            tempObj.locEnabledFlag === true ? 'Y' : 'N';
            locCodeValue = tempObj.locCode.split('.');
            tempObj.locSegment1 = locCodeValue[0];
            tempObj.locSegment2 = locCodeValue[1];
            tempObj.locSegment3 = locCodeValue[2];
            tempObj.locMaxUnits = tempObj.locMaxUnits !== null ? Number(tempObj.locMaxUnits) : null;
            tempObj.locCurrentUnits = tempObj.locCurrentUnits !== null ? Number(tempObj.locCurrentUnits) : null;
            tempObj.locSuggestedUnits = tempObj.locSuggestedUnits !== null ? Number(tempObj.locSuggestedUnits) : null;
            tempObj.locAvailableUnits = tempObj.locAvailableUnits !== null ? Number(tempObj.locAvailableUnits) : null;
            tempObj.locMaxCubicArea = tempObj.locMaxCubicArea !== null ? Number(tempObj.locMaxCubicArea) : null;
            tempObj.locCurrentCubicArea = tempObj.locCurrentCubicArea !== null ? Number(tempObj.locCurrentCubicArea) : null;
            tempObj.locSuggestedCubicArea = tempObj.locSuggestedCubicArea !== null ? Number(tempObj.locSuggestedCubicArea) : null;
            tempObj.locAvailableCubicArea = tempObj.locAvailableCubicArea !== null ? Number(tempObj.locAvailableCubicArea) : null;
            tempObj.locMaxWeight = tempObj.locMaxWeight !== null ? Number(tempObj.locMaxWeight) : null;
            tempObj.locCurrentWeight = tempObj.locCurrentWeight !== null ? Number(tempObj.locCurrentWeight) : null;
            tempObj.locSuggestedWeight = tempObj.locSuggestedWeight !== null ? Number(tempObj.locSuggestedWeight) : null;
            tempObj.locAvailableWeight = tempObj.locAvailableWeight !== null ? Number(tempObj.locAvailableWeight) : null;
            tempObj.locLength = tempObj.locLength !== null ? Number(tempObj.locLength) : null;
            tempObj.locWidth = tempObj.locWidth !== null ? Number(tempObj.locWidth) : null;
            tempObj.locHeight = tempObj.locHeight !== null ? Number(tempObj.locHeight) : null;
            tempObj.locXCoordinate = tempObj.locXCoordinate !== null ? Number(tempObj.locXCoordinate) : null;
            tempObj.locYCoordinate = tempObj.locYCoordinate !== null ? Number(tempObj.locYCoordinate) : null;
            tempObj.locZCoordinate = tempObj.locZCoordinate !== null ? Number(tempObj.locZCoordinate) : null;
            const dp = new DatePipe(navigator.language);
            const p = 'y-MM-dd'; // YYYY-MM-DD
            const dtr = dp.transform(new Date(), p);
            tempObj.locDisableDate = tempObj.locDisableDate !== '' ? this.companycomponent.dateFormat(new Date(tempObj.locDisableDate)) : null;
            tempObj.updatedBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;

        body.push(tempObj);
        // setTimeout(() => {
        //     dataElement.locEnabledFlag =
        //         dataElement.locEnabledFlag === 'Y' ? true : false;
        // }, 200);
        });
        if(body.length !== 0){
            this.stockLocatorService.updateStockLocators(body).subscribe(
                result => {
                    if (result.status === 200) {
                        this.isDisable = true;
                        this.isEdit = false;
                        this.refreshSearchLov = 'refresh';
                        this.dataForSearch['lovSearchFromAdd_update'] = true;
                        this.searhForLOC();
                        // this.openDialog('success', result.message);
                        this.openSnackBar(result.message, '', 'success-snackbar');
                        // this.searchStockLocator();
                    } else {
                        this.isEdit = false;
                        // this.openDialog('error', result.message);
                        this.openSnackBar(result.message, '', 'error-snackbar');
                    }
                    this.saveInprogress = false;
                    for (const [i] of this.parameterData.entries()) {
                        this.parameterData[i].editing = false;
                    }
                },
                (error: any) => {
                    this.isEdit = true;
                    // for (let i = 0; i < error.error.index.length; i++) {
                    //     this.parameterData[error.error.index[i] - 1].editing = true;
                    //     this.parameterData[error.error.index[i] - 1].addNewRecord = false;
                    // }
                    for(const SL of data) {
                      if(this.parameterData.find(d => d.locatorId = SL.locatorId)) {
                        const index = this.parameterData.indexOf(SL);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = true;
                        this.parameterData[index].customerEditing = true;
                        this.parameterData[index].customerAddNewRecord = true;
                      }
                    }
                    // alert(error.error.message);
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                    this.saveInprogress = false;
                }
            );
        }else{
            this.saveInprogress = false;
            this.isEdit = false;
        }
    }

    openConfirmationDialog(pageName: string, url: any) {
        let customerAdd = 'Y'
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { pageName, url, customerAdd },
            width: '30vw'
        });
        confirmationDialogRef.afterClosed().subscribe(response => {
            this.saveInprogress = false;
            if (response !== undefined && response.url === 'stocklocatorsCancel') {                 
                if(response.customerAdd === 'N'){
                  this.customerFlag = true;
                  if(response.pageName === '3PLADD' ){
                    let dataArray: any[] = [];
                    for (const [i, pData] of this.parameterData.entries()) {
                        if (pData.customerAddNewRecord === true) {
                            this.selectedRowIndex = null;
                            if(pData.locCustomerId === ''){
                                pData.locCustomerId = null;
                            }
                            dataArray.push(pData);
                        }
                    }
                    this.addStockLocators(dataArray);
                  }else{
                    let dataArray: any[] = [];
                    for (const [i, pData] of this.parameterData.entries()) {
                        if (pData.customerEditing === true) {
                            this.selectedRowIndex = null;
                            if(pData.locCustomerId === ''){
                                pData.locCustomerId = null;
                            }
                            dataArray.push(pData);

                        }
                    }
                    this.updateStockLocator(dataArray);
                  }
                  
              }  
            }else{
                for (const [i, pData] of this.parameterData.entries()) {                                          
                        if(pData.locCustomerId === ''){
                            pData.locCustomerId = null;
                        }  
                }
                this.isEdit = true;
            }
        });
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
        this.searchArrayunsubscribe ? this.searchArrayunsubscribe.unsubscribe() : '';
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   


    @HostListener('window:resize', ['$event'])
        onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(-30);
    }

        sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}
