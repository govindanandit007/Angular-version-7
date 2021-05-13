import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    ViewChild,
    OnDestroy,
    Optional,
    Inject,
    ElementRef,
    AfterViewInit,
    HostListener,
    TemplateRef
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { CompanyComponent } from '../company.component';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatSort,
    Sort,
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialog
} from '@angular/material';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from 'src/app/_services/company.service';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';

// Interface for subInventoryList
export interface NavItem {
    displayName: string;
    disabled?: boolean;
    itemCode?: string;
    children?: NavItem[];
    id?: number;
}

export interface ParameterDataElement {
    lgId?: number;
    lgCode: string;
    lgName: string;
    lgIuId: number;
    lgEnabledFlag: string;
    lgDescription: string;
    lgType: string;
    lgPickingOrder: string;
    lgDroppingOrder: string;
    lgLpnControlledFlag: string;
    lgCartonizationFlag: string;
    lgBulkPickFlag: string;
    lgDisableDate: string;
    lgCompanyId: number;
    lgPickUomCode: string;
    lgStatusCode: string;
    createdBy: number;
    creationDate: string;
    updatedBy: number;
    updatedDate: string;
}
export interface ItemAssignmentDataElement {
    lgItemAssignmentId?: number;
    lgId: number;
    lgCode?: string;
    lgName?: string;
    lgItemId: number;
    lgItemName: string;
    searchValue?: string;
    itemSearchLoader?: string;
    showLov?: string;
    itemList?: any;
    lgItemDescription: string;
    lgMinQty: number;
    lgMaxQty: number;
    lgItemUom: string;
    lgUnitOfMeasure: string;
    sourceLgId: number;
    sourceLgName: string;
    lgSearchValue?: string;
    lgSearchLoader?: string;
    showLgLov?: string;
    sourceLgList?: any;

    locatorId: number;
    locatorSearchValue?: string;
    locatorSearchLoader?: string;
    showLocatorLov?: string;
    sourceLocatorList?: any;
    locCode?: any;

    replenishmentCriteria: any;
    repCriteriaList: any;
    replenishmentCriteriaDesc?: any;

    createdBy?: number;
    creationDate?: string;
    updatedBy?: number;
    updatedDate?: string;
    originalData?: any;
    action?: string;
    editing?: boolean;
    addNewRecord?: boolean;
}

@Component({
    selector: 'app-sub-inventory',
    templateUrl: './sub-inventory.component.html',
    styleUrls: ['./sub-inventory.component.css']
})
export class SubInventoryComponent implements OnInit, AfterViewInit, OnDestroy {
    // All variable define below
    tooltipPosition: TooltipPosition[] = ['below'];
    subInventoryForm: FormGroup;
    subInventoryFormControl = new FormControl();
    public navItems: NavItem[];
    isEdit = false;
    isAdd = false;
    showLGName: string;
    childId: number;
    inventoryCodeList: any[] = [];
    enabledInventoryCodeList: any[] = [];
    subInventoryTypeLov: [];
    invertoryInputDisable: boolean;
    showInventoryList = true;
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    // lgMessage = 'No locator group defined.';
    lgMessage = '';
    searchEnableFlag = false;
    searchIconValue: any = '';
    refreshSearchLov: any = '';
    saveInprogress = false;
    is3plCompany: any = [];
    _3plCustomerList: any[];
    customerFlag: boolean = false;
    customerPlaceHolder: any = 'Customer';
    customerLabel: any = '';
    disableAllBtn: any = false;
    selectedRowIndex = null;

    public showSearch = true;
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    showItemAssignment = false;
    lgIdItemAssignment: number;
    lgCodeItemAssignment: string;
    lgNameItemAssignment: string;
    lgIuItemAssignment: string;
    lgItemAssignmentMessage: string;
    itemAssignmentData: ItemAssignmentDataElement[] = [];
    itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/lg-search.json');
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;
    displayedColumns: string[] = [
        'lgCode',
        'lgName',
        'iuCode',
        'lgType',
        'creationDate',
        'lgEnabledFlag',
        'action'
    ];
    columns: any = [
        { field: 'lgCode', name: 'Code', width: 75, baseWidth: 15 },
        { field: 'lgName', name: 'Name', width: 75, baseWidth: 22 },
        { field: 'iuCode', name: 'IU Name', width: 75, baseWidth: 15 },
        { field: 'lgType', name: 'Type', width: 75, baseWidth: 15 },
        { field: 'creationDate', name: 'Start Date', width: 75, baseWidth: 15 },
        { field: 'lgEnabledFlag', name: 'Enabled', width: 75, baseWidth: 10 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
    ]
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('paginatorItemAssignment', { static: false }) paginatorItemAssignment: MatPaginator;

    parameterData: ParameterDataElement[] = [];
    subInventoryDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;


    listProgress = false;
    itemAssignmentlistProgress = false;
    lgIuIdForItem: number;
    iuLgList: any[] = [];
    itemAssignmentElement: any = '';

    validationMessages = {
        lgCode: {
            required: 'Locator Group Code is required.'
        },
        lgName: {
            required: 'Locator Group Name is required.'
        },
        lgIuId: {
            required: 'Inventory Code is required.'
        },
        lgType: {
            required: 'Locator Group Type is required.'
        },
        lgPickingOrder: {
            min: 'Picking Order should be greater than 0'
        },
        lgDroppingOrder: {
            min: 'Droping Order should be greater than 0'
        },
        customerId: {
            required: 'Customer is required'
        }
    };

    formErrors = {
        lgCode: '',
        lgName: '',
        lgIuId: '',
        lgType: '',
        lgPickingOrder: '',
        lgDroppingOrder: '',
        customerId: null
    };

    itemAssignmentDisplayColumns: string[] = [
        'lgId',
        'lgItemName',
        'lgItemDescription',
        'lgLocatorName',
        'lgMinQty',
        'lgMaxQty',
        'lgItemUom',
        'sourceLgName',
        'replenishmentCriteriaName',
        'action'
    ];
    itemAssignmentColumns: any = [
        { field: 'lgId', name: '#', width: 75, baseWidth: 7 },
        { field: 'lgItemName', name: 'Item', width: 150, baseWidth: 12 },
        { field: 'lgItemDescription', name: 'Description', width: 150, baseWidth: 18 },
        { field: 'lgMinQty', name: 'Min Qty', width: 100, baseWidth: 7 },
        { field: 'lgMaxQty', name: 'Max Qty', width: 100, baseWidth: 7 },
        { field: 'lgItemUom', name: 'UOM', width: 100, baseWidth: 7 },
        { field: 'sourceLgName', name: 'Source LG', width: 100, baseWidth: 10 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 8 },
        { field: 'lgLocatorName', name: 'Locator', width: 75, baseWidth: 8 },
        { field: 'replenishmentCriteriaName', name: 'Replenishment Criteria', width: 75, baseWidth: 16 }
    ]
    materialStatusLovList: any[];
    // Constructor for SubInventoryComponent
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public commonService: CommonService,
        private subInventorys: SubInventoryService,
        private companycomponent: CompanyComponent,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private companyService: CompanyService,
        private http: HttpClient
    ) {
        this.subInventoryFeedForm();
    }

    ngOnInit() {
        // this.subInventorys.defaultIuDataObservable.subscribe((data: any) => {
        //     console.log(data);
        //     if (!this.isEdit) {
        //         this.subInventoryForm.patchValue({ lgIuId: data });
        //     }
        // });
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchSubInventory();
            this.searhForSI();
        });
        this.isEdit = false;
        this.invertoryInputDisable = false;
        this.saveInprogress = false;
        this.getMaterialStatusLov();
        
        this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
        if (this.is3plCompany) {
            this.get3PLCustomerList();
        }
        this.commonService.getScreenSize(-30);
        this.searchIconValue = this.companyService.searchIconValue.subscribe((searchEnableFlag: any) => {
            this.searchEnableFlag = searchEnableFlag;
        });
       this.saveInprogress = false;
    }


    // searhForSI() {
    //     this.companycomponent.showSearchFlag.subscribe((data: any) => {
    //         if (data === 'locatorgroups') {
    //             this.commonService.searhForMasters(this.dataForSearch);
    //             // this.searchComponentToggle.emit(this.showSearch);
    //             this.companyService.displaySearchComponent(this.showSearch);
    //         }
    //     });

    //     this.subInventoryForm.valueChanges.subscribe(data => {
    //         this.logValidationErrors(this.subInventoryForm);
    //     });
    // }

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
                            if (lovItem.enabledFlag === 'Y') {
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
                this.openSnackBar(error, '', 'error-snackbar');
            })
    }

    searhForSI() {
        this.searchArrayunsubscribe = this.companycomponent.showSearchFlag.subscribe((data: any) => {
            if (data === 'locatorgroups') {
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
    logValidationErrors(group: FormGroup = this.subInventoryForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            } else {
                this.formErrors[key] = '';
                if (
                    abstractControl &&
                    !abstractControl.valid &&
                    (abstractControl.touched || abstractControl.dirty)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }
    checkSearch() {
        let returnType: any = '';
        if (this.refreshSearchLov === 'refresh') {
            returnType = true;
            this.refreshSearchLov = '';
        } else {
            returnType = false;
        }
        return returnType;
    }
    searchSubInventory() {
        //
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((searchInfo: any) => {

            const checksearchSource = this.checkSearch();
            if (checksearchSource === true) {
                return;
            }
            // This code is used for not loading the search result when module loads
            if (searchInfo.fromSearchBtnClick === true) {

                this.subInventoryDataSource = new MatTableDataSource<ParameterDataElement>([]);
                this.subInventoryDataSource.sort = this.sort;
                this.showInventoryList = true;
                this.selectedRowIndex = null;
                this.cancelItemAssignment();
                if (searchInfo.searchType === 'subInventory') {
                    this.listProgress = true;
                    this.subInventorys
                        .getSubInventorySearch(searchInfo.searchArray)
                        .subscribe(
                            (data: any) => {
                                // searchInfo.fromSearchBtnClick = false;
                                // this.commonService.getsearhForMasters(searchInfo);
                                if (data.status === 200) {
                                    this.parameterData = data.result;
                                    this.listProgress = false;
                                    if (!data.message) {
                                        for (const rowData of data.result) {
                                            if (rowData.lgEnabledFlag === 'N') {
                                                rowData.lgEnabledFlag = false;
                                            } else {
                                                rowData.lgEnabledFlag = true;
                                            }
                                        }
                                        this.subInventoryDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                                        // Sorting Start
                                        const sortState: Sort = { active: '', direction: '' };
                                        this.sort.active = sortState.active;
                                        this.sort.direction = sortState.direction;
                                        this.sort.sortChange.emit(sortState);
                                        // Sorting End
                                        this.subInventoryDataSource.sort = this.sort;
                                        this.setPaginator();
                                    } else {
                                        this.lgMessage = data.message;
                                    }
                                } else {
                                    console.log(data.message);
                                }
                            },
                            (error: any) => {
                                this.listProgress = false;
                                console.log(error.error.message);
                            }
                        );
                }
            } else {
                return;
            }

        });
    }

    // SubInventory form fields define
    subInventoryFeedForm() {
        this.subInventoryForm = this.fb.group({
            lgCode: ['', Validators.required],
            lgName: ['', Validators.required],
            lgIuId: ['', Validators.required],
            lgEnabledFlag: [true],
            lgDescription: [''],
            materialStatusId: [null],
            lgType: ['', Validators.required],
            lgPickingOrder: [null, Validators.min(1)],
            lgDroppingOrder: [null, Validators.min(1)],
            lgLpnControlledFlag: [false, Validators.required],
            lgCartonizationFlag: [false, Validators.required],
            lgBulkPickFlag: [false, Validators.required],
            lgDisableDate: [null],
            customerId: [null],
            lgCompanyId: [
                Number(
                    JSON.parse(localStorage.getItem('userDetails')).companyId
                )
            ],
            lgPickUomCode: [null],
            lgStatusCode: ['Active'],
            createdBy: [
                Number(JSON.parse(localStorage.getItem('userDetails')).userId)
            ],
            creationDate: [this.companycomponent.dateFormat(new Date())],
            updatedBy: [
                Number(JSON.parse(localStorage.getItem('userDetails')).userId)
            ],
            updatedDate: [this.companycomponent.dateFormat(new Date())]
        });
    }
    // Get the lov for Material Status
    getMaterialStatusLov() {

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
    // Sidemenu for subInventory list
    getSideTreeChildId(event: any) {
        this.childId = event;
        if (this.childId) {
            this.getSubInventoryDetailById(this.childId);
        }
    }

    getRepCriteriaList(itemID, sourceLgId, index) {
        this.subInventorys.getRepCriteriaByLg(String(itemID) + '-' + String(sourceLgId)).subscribe((data: any) => {
            if (data.result && data.result.length) {
                const dataResult = data.result;
                this.itemAssignmentData[index].repCriteriaList = [];
                for (let i = 0; i < dataResult.length; i++) {
                    this.itemAssignmentData[index].repCriteriaList.push({
                        value: dataResult[i].lookupValue,
                        label: dataResult[i].lookupValueDesc,
                        //   lookupValue
                    })
                }
            } else {
                this.openSnackBar('No match found', '', 'error-snackbar');
            }
        });
    }

    // check type
    checkType() {
        if (this.subInventoryForm.controls.lgType.value === 'STORAGE') {
            this.subInventoryForm.patchValue({ lgLpnControlledFlag: false });
        }
    }


    // Get the lov for Inventory Orgarnization
    getInventoryOrgLov() {
        this.inventoryCodeList = [];
        this.enabledInventoryCodeList = [];
        this.subInventorys.getInventoryOrgList().subscribe(
            (data: any) => {
                const inventoryCodelov = data.result;
                for (let i = 0; i < data.result.length; i++) {
                    if (data.result[i].iuEnabledFlag === 'Y') {
                        this.enabledInventoryCodeList.push({
                            iuId: data.result[i].iuId,
                            iuCode: data.result[i].iuCode
                        });
                    }
                    this.inventoryCodeList.push({
                        iuId: data.result[i].iuId,
                        iuCode: data.result[i].iuCode
                    });
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    // Get the lov for subInventory type lov
    getSubInvertoryTypeLOV() {
        this.searchArrayunsubscribe = this.subInventorys.getSubInvertoryTypeLOVList().subscribe(
            (data: any) => {
                const subInventoryTypes = data.result;
                this.subInventoryTypeLov = subInventoryTypes;
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    // Get Subinventory details by id
    getSubInventoryDetailById(id: any) {
        this.subInventorys.getSubInventoryById(id).subscribe(
            (result: any) => {
                if (result.status === 200) {
                    if (result.result.length) {
                        this.isEdit = true;
                        this.invertoryInputDisable = true;
                        this.subInventoryForm.patchValue(result.result[0]);
                        this.subInventoryForm.patchValue({
                            lgIuId: result.result[0].lgIuId
                        })
                        this.subInventoryForm.patchValue({
                            lgStatusCode: result.result[0].lgStatusCode
                        });
                        this.subInventoryForm.patchValue({
                            createdBy: result.result[0].createdBy
                        });
                        this.subInventoryForm.patchValue({
                            creationDate: result.result[0].creationDate
                        });
                        this.subInventoryForm.patchValue({
                            updatedBy: result.result[0].updatedBy
                        });

                        if (result.result[0].lgBulkPickFlag === 'N') {
                            this.subInventoryForm.patchValue({
                                lgBulkPickFlag: false
                            });
                        } else {
                            this.subInventoryForm.patchValue({
                                lgBulkPickFlag: true
                            });
                        }

                        if (result.result[0].lgLpnControlledFlag === 'N') {
                            this.subInventoryForm.patchValue({
                                lgLpnControlledFlag: false
                            });
                        } else {
                            this.subInventoryForm.patchValue({
                                lgLpnControlledFlag: true
                            });
                        }

                        if (result.result[0].lgCartonizationFlag === 'N') {
                            this.subInventoryForm.patchValue({
                                lgCartonizationFlag: false
                            });
                        } else {
                            this.subInventoryForm.patchValue({
                                lgCartonizationFlag: true
                            });
                        }

                        if (result.result[0].lgEnabledFlag === 'N') {
                            this.subInventoryForm.patchValue({
                                lgEnabledFlag: false
                            });
                        } else {
                            this.subInventoryForm.patchValue({
                                lgEnabledFlag: true
                            });
                        }
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    addSubInventory(type) {
        if (type !== 'view') {
            this.showInventoryList = !this.showInventoryList;
            // this.searchComponentToggle.emit(false);
            this.companyService.displaySearchComponent(false);
        }
        this.subInventoryFeedForm();
        this.saveInprogress = false;
        this.isEdit = false;
        if (type === 'add') {
            this.getInventoryOrgLov();
            this.getSubInvertoryTypeLOV();
            this.subInventoryForm.patchValue({ lgIuId: (JSON.parse(localStorage.getItem('defaultIU'))).id });
            this.invertoryInputDisable = true;
        } else {
            if (type !== 'view') {
                this.searchSubInventory();
                this.searhForSI();
            }
        }
    }

    editSubInventory(id: number, name: string, type?: string) {
        this.disableAllBtn = true;
        setTimeout(() => { this.disableAllBtn = false; }, 1000);
        type === 'view'
            ? this.addSubInventory('view')
            : this.addSubInventory('add');
        this.isEdit = true;

        this.subInventorys.getSubInventoryById(id).subscribe(
            (data: any) => {
                if (data.status === 200) {
                    if (type === 'view') {
                        let dataResult;
                        
                        if (data.result) {
                            dataResult = data.result[0];
                            dataResult.lgEnabledFlag =
                                dataResult.lgEnabledFlag === 'Y' ? true : false;
                            dataResult.lgLpnControlledFlag =
                                dataResult.lgLpnControlledFlag === 'Y'
                                    ? true
                                    : false;
                            dataResult.lgCartonizationFlag =
                                dataResult.lgCartonizationFlag === 'Y'
                                    ? true
                                    : false;
                            dataResult.lgBulkPickFlag =
                                dataResult.lgBulkPickFlag === 'Y' ? true : false;
                            dataResult.companyCode = JSON.parse(
                                localStorage.getItem('userDetails')
                            ).companyCode;
                            const dialogRef = this.dialog.open(
                                // tslint:disable-next-line: no-use-before-declare
                                SubInventoryViewDialogComponent,
                                {
                                    width: '70vw',
                                    minHeight: '30vh',
                                    maxHeight: '80vh',
                                    data: dataResult
                                }
                            );
    
                            dialogRef.afterClosed().subscribe(response => {
                                if (response !== undefined) {
                                    this.editSubInventory(response, '');
                                }
                            });
                        }else{
                            this.openSnackBar(data.message, '', 'error-snackbar');
                        }
                        // tslint:disable-next-line: no-use-before-declare
                        
                    } else {
                        this.showLGName = 'Edit Locator Group : ' + name;
                        this.saveInprogress = false;
                        let result;
                        this.subInventoryForm.controls['lgCode'].disable();
                        if (data.result) {
                            result = data.result[0];
                            this.childId = result.lgId;
                            this.subInventoryForm.patchValue(result);
                            this.subInventoryForm.controls.lgEnabledFlag.patchValue(
                                result.lgEnabledFlag === 'Y' ? true : false
                            );
                            this.subInventoryForm.controls.lgLpnControlledFlag.patchValue(
                                result.lgLpnControlledFlag === 'Y' ? true : false
                            );
                            this.subInventoryForm.controls.lgCartonizationFlag.patchValue(
                                result.lgCartonizationFlag === 'Y' ? true : false
                            );
                            this.subInventoryForm.controls.lgBulkPickFlag.patchValue(
                                result.lgBulkPickFlag === 'Y' ? true : false
                            );
                        }else{
                            this.openSnackBar(data.message, '', 'error-snackbar');
                        }
                    }
                }
            },
            (error: any) => {
                console.log(error.error.message);
            }
        );
    }

    // Go to stock locator page page when click on add stock locator button
    addStockLocator() {
        this.subInventoryFeedForm();
        this.router.navigate(['company/stocklocators']);
    }

    setCUstomerLabel(event: any, customerLabel: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.customerLabel = customerLabel;
        }
    }

    // Submit the form when click on save button
    onSubmit(type: any) {

        if(this.subInventoryForm.value.customerId === ''){
            this.subInventoryForm.patchValue({ customerId: null });
        }

        if (this.subInventoryForm.valid) {
            if (this.is3plCompany && this.subInventoryForm.value.customerId === null && !this.customerFlag) {
                if (this.isEdit) {
                    this.openConfirmationDialog('3PLEDIT', 'locatorGroup');
                } else {
                    this.openConfirmationDialog('3PLADD', 'locatorGroup');
                }
                return;
            }


            this.saveInprogress = true;
            if(!this.isEdit){
                this.subInventoryForm.patchValue({ lgIuId: (JSON.parse(localStorage.getItem('defaultIU'))).id });
            }
            if (this.subInventoryForm.value.lgEnabledFlag === false) {
                this.subInventoryForm.value.lgEnabledFlag = 'N';
            } else {
                this.subInventoryForm.value.lgEnabledFlag = 'Y';
            }

            if (this.subInventoryForm.value.lgLpnControlledFlag === false) {
                this.subInventoryForm.value.lgLpnControlledFlag = 'N';
            } else {
                this.subInventoryForm.value.lgLpnControlledFlag = 'Y';
            }

            if (this.subInventoryForm.value.lgCartonizationFlag === false) {
                this.subInventoryForm.value.lgCartonizationFlag = 'N';
            } else {
                this.subInventoryForm.value.lgCartonizationFlag = 'Y';
            }

            if (this.subInventoryForm.value.lgBulkPickFlag === false) {
                this.subInventoryForm.value.lgBulkPickFlag = 'N';
            } else {
                this.subInventoryForm.value.lgBulkPickFlag = 'Y';
            }
            this.customerFlag = false;
            if (this.isEdit) {
                if (this.subInventoryForm.valid) {
                    this.subInventorys
                        .updateSubInvertory(
                            this.childId,
                            this.subInventoryForm.value
                        )
                        .subscribe(
                            (data: any) => {
                                if (data.status === 200) {
                                    this.saveInprogress = false;
                                    // this.companycomponent.openDialog(
                                    //     'Success',
                                    //     data.message
                                    // );
                                    this.openSnackBar(data.message, '', 'success-snackbar');
                                    this.showInventoryList = true;
                                    this.searchSubInventory();
                                    this.dataForSearch.lovSearchFromAdd_update = true;
                                    this.refreshSearchLov = 'refresh';
                                    this.searhForSI();
                                } else {
                                    
                                    this.openSnackBar(data.message, '', 'error-snackbar');
                                }
                                this.saveInprogress = false;
                            },
                            (error: any) => {
                               
                                this.openSnackBar(error.error.message, '', 'error-snackbar');
                                this.saveInprogress = false;
                            }
                        );
                }
            } else {
                if (this.subInventoryForm.valid) {
                   
                    this.subInventorys
                        .addSubInvertory(this.subInventoryForm.value)
                        .subscribe(
                            (data: any) => {
                                if (data.status === 200) {
                                    this.openSnackBar(data.message, '', 'success-snackbar');
                                    this.subInventoryFeedForm();
                                    this.showInventoryList = true;
                                    this.dataForSearch.lovSearchFromAdd_update = true;
                                    this.refreshSearchLov = 'refresh';
                                    this.searhForSI();
                                    this.subInventoryDataSource = new MatTableDataSource([]);
                                    this.subInventoryDataSource.sort = this.sort;
                                    this.setPaginator();
                                } else {
                                    this.openSnackBar(data.message, '', 'error-snackbar');
                                }
                                this.saveInprogress = false;
                            },
                            (error: any) => {
                                this.openSnackBar(error.error.message, '', 'error-snackbar');
                                this.saveInprogress = false;
                            }
                        );
                }
            }
        } else {
            this.openSnackBar('Please enter all required fields', '', 'error-snackbar');
        }
    }

    // handle item assignment
    handleItemAssignment(element) {
        this.commonService.getScreenSize(40);
        if (this.itemAssignmentElement === '') {
            this.itemAssignmentElement = element;
        }
        this.showItemAssignment = true;
        this.lgIdItemAssignment = element.lgId;
        this.lgCodeItemAssignment = element.lgCode;
        this.lgNameItemAssignment = element.lgName;
        this.lgIuItemAssignment = element.iuName;
        this.lgIuIdForItem = element.lgIuId;
        this.itemAssignmentData = [];
        this.itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
        this.itemAssignmentlistProgress = true;
       
        this.getLgLovByIu();
        this.subInventorys.getItemAssignmentByLg(element.lgId).subscribe((data: any) => {
            if (data.status === 200) {
                this.itemAssignmentlistProgress = false;
                if (data.result) {
                    // this.itemAssignmentData = data.result;
                    const dataResult = data.result;
                    for (const [index, assignmentData] of dataResult.entries()) {
                        const obj = {
                            lgCode: assignmentData.lgCode,
                            lgName: assignmentData.lgName,
                            lgId: assignmentData.lgId,
                            lgItemAssignmentId: assignmentData.lgItemAssignmentId,
                            lgItemId: assignmentData.lgItemId,
                            lgItemName: assignmentData.lgItemName,
                            searchValue: assignmentData.lgItemName,
                            itemSearchLoader: 'hide',
                            showLov: 'hide',
                            itemList: [],
                            lgItemDescription: assignmentData.lgItemDescription,
                            lgMinQty: assignmentData.lgMinQty,
                            lgMaxQty: assignmentData.lgMaxQty,
                            lgItemUom: assignmentData.lgItemUom,
                            lgUnitOfMeasure: assignmentData.lgUnitOfMeasure,
                            sourceLgId: assignmentData.sourceLgId,
                            sourceLgName: assignmentData.sourceLgName,
                            lgSearchValue: assignmentData.sourceLgName,
                            lgSearchLoader: 'hide',
                            showLgLov: 'hide',
                            sourceLgList: [],

                            locatorId: assignmentData.locatorId,
                            locCode: assignmentData.locCode,
                            locatorSearchValue: '',
                            locatorSearchLoader: 'hide',
                            showLocatorLov: 'hide',
                            sourceLocatorList: [],
                            replenishmentCriteria: assignmentData.replenishmentCriteria,
                            replenishmentCriteriaDesc: assignmentData.replenishmentCriteriaDesc,
                            repCriteriaList: [],

                            action: '',
                            editing: false,
                            addNewRecord: false,
                            originalData: {},
                        }
                        obj.originalData = Object.assign({}, obj);
                        this.itemAssignmentData.push(obj);
                    }

                    this.itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
                    setTimeout(() => {
                        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.itemAssignmentColumns);
                        this.itemAssignmentDataSource.paginator = this.paginatorItemAssignment;
                        this.paginatorItemAssignment.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorItemAssignment.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
                        this.itemAssignmentDataSource.sort = this.sort;
                        
                    }, 500);
                } else {
                    this.itemAssignmentlistProgress = false;
                    this.lgItemAssignmentMessage = data.message;
                    setTimeout(() => {
                        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.itemAssignmentColumns);
                        this.itemAssignmentDataSource.paginator = this.paginatorItemAssignment;
                        this.paginatorItemAssignment.pageSizeOptions = this.commonService.paginationArray;
                        this.paginatorItemAssignment.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
                        this.itemAssignmentDataSource.sort = this.sort;
                        
                    }, 500);
                }
            } else {
                this.openSnackBar(data.message, '', 'error-snackbar');
                this.itemAssignmentlistProgress = false;
            }
        },
            (error: any) => {
                this.itemAssignmentlistProgress = false;
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            });
    }

    // cancel item assignment screen
    cancelItemAssignment() {
        this.showItemAssignment = false;
        this.itemAssignmentElement = '';
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.itemAssignmentColumns);
            this.setPaginator();
        }, 500);

    }

    beginEdit(rowData: any, $event: any, index: any) {
        //
        for (const pData of this.itemAssignmentData) {
            if (pData.addNewRecord === true) {
                this.openSnackBar('Please add your records first.', '', 'error-snackbar');
                return;
            }
        }
        this.isEdit = true;
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            rowData.showLov = 'hide';
            rowData.itemSearchLoader = 'hide';
            rowData.searchValue = rowData.lgItemName;
            rowData.showLgLov = 'hide';
            rowData.lgSearchLoader = 'hide';
            rowData.lgSearchValue = rowData.sourceLgName;

            rowData.showLocatorLov = 'hide';
            rowData.locatorSearchLoader = 'hide';
            rowData.locatorSearchValue = rowData.locCode;
            this.getItemLovByScreen(this.itemAssignmentData[index].searchValue, index);
            this.getLgLovByScreen(this.itemAssignmentData[index].lgSearchValue, index);
            this.getLocatorByLg(this.itemAssignmentData[index].locatorSearchValue, index)
        } else {
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (this.itemAssignmentData[index].editing === true) {
            this.itemAssignmentData[index].lgItemName = this.itemAssignmentData[index].originalData.lgItemName;
            this.itemAssignmentData[index].lgItemDescription = this.itemAssignmentData[index].originalData.lgItemDescription;
            this.itemAssignmentData[index].lgMinQty = this.itemAssignmentData[index].originalData.lgMinQty;
            this.itemAssignmentData[index].lgMaxQty = this.itemAssignmentData[index].originalData.lgMaxQty;
            this.itemAssignmentData[index].lgItemUom = this.itemAssignmentData[index].originalData.lgItemUom;
            this.itemAssignmentData[index].sourceLgName = this.itemAssignmentData[index].originalData.sourceLgName;
            this.itemAssignmentData[index].editing = false;
        };

        if (
            this.itemAssignmentData.find(({ editing }) => editing === true) === undefined) {
            this.isEdit = false;
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.itemAssignmentData.splice(rowIndex, 1);
        this.itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
        this.itemAssignmentDataSource.paginator = this.paginatorItemAssignment;
        this.paginatorItemAssignment.pageSizeOptions = this.commonService.paginationArray;
        this.paginatorItemAssignment.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
        this.itemAssignmentDataSource.sort = this.sort;
        this.checkIsAddRow();
        this.isAdd = false;
        for (const pdata of this.itemAssignmentData) {
            if (pdata.addNewRecord === true) {
                this.isAdd = true;
            }
        }
    }

    checkIsAddRow() {
        let cnt = 0;
        const pLength = this.itemAssignmentData.length;
        for (const pdata of this.itemAssignmentData) {
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

    addRow() {
        for (const pData of this.itemAssignmentData) {
            if (pData.editing === true && pData.addNewRecord === false) {
                this.openSnackBar('Please update your records first.', '', 'error-snackbar');
                return;
            }
        }

        this.isAdd = true;
        this.isEdit = false;
        this.itemAssignmentData.unshift({
            lgId: this.lgIdItemAssignment,
            lgItemId: null,
            lgItemName: '',
            searchValue: '',
            itemSearchLoader: 'hide',
            showLov: 'hide',
            itemList: [],
            lgItemDescription: '',
            lgMinQty: null,
            lgMaxQty: null,
            lgItemUom: '',
            lgUnitOfMeasure: '',
            sourceLgId: null,
            sourceLgName: '',
            lgSearchValue: '',
            showLgLov: 'hide',
            lgSearchLoader: 'hide',
            sourceLgList: [],

            locatorId: null,
            locCode: '',
            locatorSearchValue: '',
            locatorSearchLoader: 'hide',
            showLocatorLov: 'hide',
            sourceLocatorList: [],
            replenishmentCriteria: null,
            replenishmentCriteriaDesc: '',
            repCriteriaList: [],

            editing: true,
            addNewRecord: true,
            action: ''
        });
        this.itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
    }

    // item selection change function
    itemSelectionChanged(event: any, index: any, item: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.getUOM(item.value, index, '');
            this.itemAssignmentData[index].lgItemDescription = item.data.itemDescription ? item.data.itemDescription : '-';
        }
    }

    // Get UOM List
    getUOM(itemId, index, onScreenLoad: string) {
        this.subInventorys
            .getUomByItem(itemId)
            .subscribe((data: any) => {
                this.itemAssignmentData[index].lgItemUom = data.result[0].primaryUomCode;
                this.itemAssignmentData[index].lgUnitOfMeasure = data.result[0].psUnitOfMeasure;
                if (onScreenLoad === 'default') {
                    this.itemAssignmentData[index].originalData.lgUnitOfMeasure = data.result[0].psUnitOfMeasure;
                }
            });
    }

    // fetch new item search list
    fetchNewSearchList(event: any, index: any, searchFlag: any, value: any) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.itemAssignmentData[index].showLov === 'hide') {
            this.itemAssignmentData[index].lgItemId = null;

            this.itemAssignmentData[index].itemSearchLoader = 'show';
            this.getItemLovByScreen(this.itemAssignmentData[index].searchValue, index);

        } else {
            this.itemAssignmentData[index].showLov = 'hide';
            this.itemAssignmentData[index].searchValue = '';
            this.itemAssignmentData[index].lgItemId = null;
        }
    }

    // fetch new LG search list
    fetchLgSearchList(event: any, index: any, searchFlag: any, value: any) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.itemAssignmentData[index].showLgLov === 'hide') {
            this.itemAssignmentData[index].sourceLgId = null;

            this.itemAssignmentData[index].lgSearchLoader = 'show';
            this.getLgLovByScreen(this.itemAssignmentData[index].lgSearchValue, index);

        } else {
            this.itemAssignmentData[index].showLgLov = 'hide';
            this.itemAssignmentData[index].lgSearchValue = '';
            this.itemAssignmentData[index].sourceLgId = null;
        }
    }

    // get LG LOV by screen
    getLgLovByScreen(lgName: any, index: any) {
        this.itemAssignmentData[index].sourceLgList = [];
        for (const [i, rowData] of this.iuLgList.entries()) {
            if (this.iuLgList[i].label.toLocaleLowerCase().includes(lgName.toLocaleLowerCase())) {
                this.itemAssignmentData[index].sourceLgList.push(rowData);
            }

        }
        if (this.itemAssignmentData[index].sourceLgList.length) {
            this.itemAssignmentData[index].lgSearchLoader = 'hide';
            this.itemAssignmentData[index].showLgLov = 'show';
            this.itemAssignmentData[index].lgSearchValue = '';

            // Set the first element of the search
            this.itemAssignmentData[index].sourceLgId = this.itemAssignmentData[index].sourceLgList[0].value;

            if (this.itemAssignmentData[index].lgItemId && this.itemAssignmentData[index].sourceLgId) {
                this.getRepCriteriaList(this.itemAssignmentData[index].lgItemId, this.itemAssignmentData[index].sourceLgId, index)
            }
        } else {
            this.itemAssignmentData[index].lgSearchLoader = 'hide';
            this.openSnackBar('No match found', '', 'error-snackbar');
        }
    }

    getLgLovByIu() {
        this.commonService.getSearchLOV('LG').subscribe((data: any) => {
            if (data.result && data.result.length) {
                const dataResult = data.result;
                this.iuLgList = [];
                for (let i = 0; i < dataResult.length; i++) {
                    if (dataResult[i].iuId === this.lgIuIdForItem) {
                        if (this.lgIdItemAssignment !== dataResult[i].id) {
                            this.iuLgList.push({
                                value: dataResult[i].id,
                                label: dataResult[i].name,
                                code: dataResult[i].code
                            })
                        }
                    }
                }
            } else {
                this.openSnackBar('No match found', '', 'error-snackbar');
            }
        });
    }

    fetchLocatorSearchList(event: any, index: any, searchFlag: any, value: any) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }
        if (this.itemAssignmentData[index].showLocatorLov === 'hide') {
            this.itemAssignmentData[index].locatorId = null;

            this.itemAssignmentData[index].locatorSearchLoader = 'show';
            this.getLocatorByLg(this.itemAssignmentData[index].locatorSearchValue, index);

        } else {
            this.itemAssignmentData[index].showLocatorLov = 'hide';
            this.itemAssignmentData[index].locatorSearchValue = ''
            this.itemAssignmentData[index].locatorId = null;
        }
    }

    getLocatorByLg(locatorName, index) {
        this.subInventorys.getLocatorByLg(this.lgIdItemAssignment, locatorName).subscribe((data: any) => {
            if (data.result && data.result.length) {
                const dataResult = data.result;


                this.itemAssignmentData[index].sourceLocatorList = [];
                for (let i = 0; i < dataResult.length; i++) {
                    this.itemAssignmentData[index].sourceLocatorList.push({
                        value: dataResult[i].locatorId,
                        label: dataResult[i].locCode,
                    })
                }

                this.itemAssignmentData[index].locatorSearchLoader = 'hide';
                this.itemAssignmentData[index].showLocatorLov = 'show'
                this.itemAssignmentData[index].locatorSearchValue = '';
                if (!this.isEdit) {
                    this.itemAssignmentData[index].locatorId = data.result[0].locatorId;
                }
            } else {
                this.itemAssignmentData[index].locatorSearchLoader = 'hide';
                this.itemAssignmentData[index].showLocatorLov = 'hide'
                this.openSnackBar('No match found', '', 'error-snackbar');
            }
        });
    }

    // get Item lov by screen
    getItemLovByScreen(itemName, index) {
        let itemNameEncoded = '';
        if (itemName !== undefined && itemName !== '') {
            itemNameEncoded = itemName;
        } else {
            itemNameEncoded = '';
        }
        this.commonService.getItemLovByScreen('item', 'item-assignment', null, itemNameEncoded).subscribe((data: any) => {
            this.itemAssignmentData[index].itemList = [{
                key: '',
                viewValue: ' Please Select',
                lgItemDescription: ''
            }];

            if (data.result && data.result.length) {
                data = data.result;
                this.itemAssignmentData[index].itemList = [];
                for (let i = 0; i < data.length; i++) {
                    this.itemAssignmentData[index].itemList.push({
                        value: data[i].itemId,
                        label: data[i].itemName,
                        data: data[i]
                    })
                }
                this.itemAssignmentData[index].itemSearchLoader = 'hide';
                this.itemAssignmentData[index].lgItemDescription = data[0].itemDescription;
                this.itemAssignmentData[index].showLov = 'show';
                this.itemAssignmentData[index].searchValue = '';

                // Set the first element of the search
                this.itemAssignmentData[index].lgItemId = data[0].itemId;

                if (this.itemAssignmentData[index].lgItemId && this.itemAssignmentData[index].sourceLgId) {
                    this.getRepCriteriaList(this.itemAssignmentData[index].lgItemId, this.itemAssignmentData[index].sourceLgId, index)
                }
            } else {
                this.itemAssignmentData[index].lgItemDescription = '';
                this.itemAssignmentData[index].lgUnitOfMeasure = '';
                this.itemAssignmentData[index].itemSearchLoader = 'hide';
                this.openSnackBar('No match found', '', 'error-snackbar');
            }
        },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            })
    }

    // on LG item assignment submit
    onItemAssignmentSubmit(event: any, type: string) {
        if (event) {
            event.stopImmediatePropagation();
            const body = [];
            if (type === 'save') {
                for (const [index, lgData] of this.itemAssignmentData.entries()) {
                    if (lgData.addNewRecord === true) {
                        const data = this.validateItemAssignment(lgData, index);
                        if (data === 'validateError') {
                            this.saveInprogress = false;
                            return;
                        }
                        //this.saveInprogress = true;
                        body.push(data);
                    }
                }
                if(body.length !== 0){
                this.subInventorys.addItemAssignment(body).subscribe(resultData => {
                    if (resultData.status === 200) {
                        this.openSnackBar(resultData.message, '', 'success-snackbar');
                        this.saveInprogress = false;
                        this.handleItemAssignment(this.itemAssignmentElement);
                    } else {
                        this.openSnackBar(resultData.message, '', 'error-snackbar');
                        this.saveInprogress = false;
                    }
                },
                    error => {
                        this.openSnackBar(error.error.message, '', 'error-snackbar');
                        this.saveInprogress = false;
                    })
                }
            } else {
                for (const [index, lgData] of this.itemAssignmentData.entries()) {
                    if (lgData.addNewRecord === false && lgData.editing === true) {
                        const data = this.validateItemAssignment(lgData, index);
                        if (data === 'validateError') {
                            this.saveInprogress = false;
                            return
                        }
                        this.saveInprogress = true;
                        body.push(data);
                    }
                }
                if(body.length !== 0){
                this.subInventorys.updateItemAssignment(body).subscribe(resultData => {
                    if (resultData.status === 200) {
                        this.openSnackBar(resultData.message, '', 'success-snackbar');
                        this.saveInprogress = false;
                    } else {
                        this.openSnackBar(resultData.message, '', 'error-snackbar');
                        this.saveInprogress = false;
                    }
                },
                    error => {
                        this.openSnackBar(error.error.message, '', 'error-snackbar');
                        this.saveInprogress = false;
                    })
                }
                this.cancelItemAssignment();
            }
        }
    }

    validateItemAssignment(data, index) {
        this.selectedRowIndex = null;
        const minQuantity = Number(data.lgMinQty) === 0 ? null : Number(data.lgMinQty);
        const maxQuantity = Number(data.lgMaxQty) === 0 ? null : Number(data.lgMaxQty);


        if (data.lgItemId === null || data.lgItemUom === ''
            || minQuantity === null || maxQuantity === null
            || data.sourceLgId === null || data.replenishmentCriteria === null
            || data.replenishmentCriteria === '') {
            this.selectedRowIndex = index;
            this.openSnackBar('Please enter all required fields', '', 'error-snackbar');
            return 'validateError';
        }
        if (minQuantity > maxQuantity) {
            this.openSnackBar('Min Qty can not be greater than Max Qty in row ' + (index + 1), '', 'error-snackbar');
            return 'validateError';
        }
        const obj = {
            lgItemAssignmentId: data.lgItemAssignmentId ? data.lgItemAssignmentId : null,
            lgId: data.lgId,
            lgItemId: Number(data.lgItemId),
            lgMinQty: minQuantity,
            lgMaxQty: maxQuantity,
            lgItemUom: data.lgItemUom,
            sourceLgId: Number(data.sourceLgId),
            locatorId: data.locatorId ? Number(data.locatorId) : data.locatorId,
            replenishCriteria: data.replenishmentCriteria,
            iuId: Number(this.lgIuIdForItem),
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId
        };

        return obj;
    }

    openDeleteDialog(templateRef: TemplateRef<any>, element: any, rowIndex: number) {
        this.dialog.open(templateRef, {
            data: { lgItemAssignmentId: element.lgItemAssignmentId, rowIndex }
        });
    }

    deleteItemAssignment(data) {
        this.subInventorys.deleteItemAssignmennt(data.lgItemAssignmentId).subscribe((resultData: any) => {
            if (resultData.status === 200) {
                this.itemAssignmentData.splice(data.rowIndex, 1);
                this.itemAssignmentDataSource = new MatTableDataSource<ItemAssignmentDataElement>(this.itemAssignmentData);
                this.openSnackBar(resultData.message, '', 'success-snackbar');
            }
        })
    }

    openConfirmationDialog(pageName: string, url: any) {
        let customerAdd = 'Y'
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { pageName, url, customerAdd },
            width: '30vw'
        });
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (response !== undefined && response.url === 'locatorGroupCancel') {

                if (response.customerAdd === 'N') {
                    this.customerFlag = true;
                    this.onSubmit('save');
                } else {
                    this.customerFlag = false;
                    this.addSubInventory('back');
                    setTimeout(() => {
                        this.setPaginator();
                        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
                    }, 500);
                }


            }
        });
    }

    openConfirmationDialogItem(pageName: string, url: any) {
        let customerAdd = 'Y'
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { pageName, url, customerAdd },
            width: '30vw'
        });
        confirmationDialogRef.afterClosed().subscribe(response => {
            this.commonService.getScreenSize(-30);
            if (response !== undefined && response.url === 'locatorGroupCancel') {
                
                if (response.customerAdd === 'N') {
                    this.customerFlag = true;
                    this.onSubmit('save');
                } else {
                    this.showItemAssignment = false;
                    this.itemAssignmentElement = '';
                    setTimeout(() => {
                        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.itemAssignmentColumns);
                        this.setPaginator();
                    }, 500);
                }


            }
        });
    }

    setPaginator() {
        
        this.subInventoryDataSource.paginator = this.paginator;
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);

    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }
    ngOnDestroy() {
        this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
        this.searchArrayunsubscribe ? this.searchArrayunsubscribe.unsubscribe() : '';
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';
        this.refreshSearchLov = '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.subInventoryDataSource.sort = this.sort;
        setTimeout(() => {
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10)
        }, 100);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(-30);
    }
}
// View Dialog Component
@Component({
    selector: 'app-subinventory-view-dialog',
    templateUrl: './sub-inventory-view-dialog.html'
})
export class SubInventoryViewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<SubInventoryViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
