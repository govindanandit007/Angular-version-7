import {
    Component,
    OnInit,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    OnDestroy,
    Optional,
    Inject,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryOrgService } from 'src/app/_services/inventory-org.service';
import { OperatingUnitService } from 'src/app/_services/operating-unit.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { CompanyComponent } from '../company.component';
import {
    MatTableDataSource,
    TooltipPosition,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog,
    MatTable,
    MatSort,Sort, MatPaginator
} from '@angular/material';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from 'src/app/_services/company.service';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment-timezone';
import { toNumber } from '@amcharts/amcharts4/.internal/core/utils/Type';
import { utimesSync } from 'fs';
// import { Moment } from 'moment';
// import { Moment } from 'moment';

// import { TimeZoneService } from './time-zone.service';
// import 'moment/locale/fr';
// import 'moment/locale/es';
// import 'moment/locale/de';
// import 'moment/locale/en-gb';
// import 'moment/locale/ar';
// import 'moment/locale/hi';

interface NavItem {
    displayName: string;
    disabled?: boolean;
    itemCode?: string;
    children?: NavItem[];
    id?: number;
}
interface ITimeZone {
    countryName: string;
    utc: string;
}
@Component({
    selector: 'app-inventory-organization',
    templateUrl: './inventory-organization.component.html',
    styleUrls: ['./inventory-organization.component.css']
})
export class InventoryOrganizationComponent
    implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    isEdit: boolean;
    shoeIUName: string;
    InventoryOrganizationForm: FormGroup;
    ioTreeChildren: any[] = [];
    ouCodeList: any[] = [];
    ouEnabledCodeList: any[] = [];
    countryList: any[] = [];
    stateFilterList: any[] = [];
    cityFilterList: any[] = [];
    navItems: NavItem[];
    childId: number;
    inputDisabled = false;
    showInventoryList = true;
    listProgress = false;
    saveInprogress = false;
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    iuMessage = '';
    searchEnableFlag = false;
    searchIconValue: any = '';
    refreshSearchLov: any = '';
    timezonePlaceholder = 'Timezone';
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    // iuMessage = 'No inventory unit defined.'
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/iu-search.json');
    public showSearch = true;
    disableAllBtn: any = false;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;

    displayedColumns: string[] = [
        'iuCode',
        'iuName',
        'iuAddress1',
        'creationDate',
        // 'iuEnabledFlag',
        'action'
    ];

    columns: any = [
        { field: 'iuCode', name: 'Code', width: 100, baseWidth: 14 },
        { field: 'iuName', name: 'Name', width: 150, baseWidth: 33 },
        { field: 'iuAddress1', name: 'Address', width: 150, baseWidth: 25 },
        {
            field: 'creationDate',
            name: 'Start Date',
            width: 150,
            baseWidth: 14
        },
        // { field: 'iuEnabledFlag', name: 'Enabled', width: 0, baseWidth: 0 },
        { field: 'action', name: 'Action', width: 100, baseWidth: 14 }
    ];

    inventoryOrgDataSource = new MatTableDataSource();
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    timezonePicker = '';
    validationMessages = {
        iuCode: {
            required: 'Inventory Unit Code is required.'
        },
        iuName: {
            required: 'Inventory Unit Name is required.'
        },
        iuOuId: {
            required: 'Operating Unit Code is required.'
        },
        iuAddress1: {
            required: 'Address1 is required.'
        },
        iuCountry: {
            required: 'Country is required.'
        },
        iuStateCounty: {
            required: 'State/County is required.'
        },
        iuCity: {
            required: 'City is required.'
        },
        iuPincode: {
            required: 'Postal Code is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 10 character allowed'
        },
        iuPhone: {
            required: 'Phone Number is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 15 character allowed',
            minlength: 'Minimum 10 character allowed'
        },
        // iuPersonName: {
        //     required: 'Person Name is required.'
        // },
        iuPersonPhoneNum: {
            // required: 'Phone Number is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 15 character allowed',
            minlength: 'Minimum 10 character allowed'
        },
        iuPersonEmail: {
            // required: 'Email is required.',
            pattern: 'Please enter a valid email address.'
        }
    };

    formErrors = {
        iuCode: '',
        iuName: '',
        iuOuId: '',
        iuAddress1: '',
        iuCountry: '',
        iuStateCounty: '',
        iuCity: '',
        iuPincode: '',
        iuPhone: '',
        // iuPersonName: '',
        iuPersonPhoneNum: '',
        iuPersonEmail: '',
        lpnLength:'',
    };
    timezoneList = [];
    timeZoneList: ITimeZone[]= [];
    lpnstartLength: number;
    constructor(
        private fb: FormBuilder,
        private inventoryOrgService: InventoryOrgService,
        private operatingUnitService: OperatingUnitService,
        public commonService: CommonService,
        private companycomponent: CompanyComponent,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private companyService: CompanyService,
        private http: HttpClient
    ) {
        // console.log(moment.tz.names());
        this.InventoryOrganizationFeedForm();
    }

    ngOnInit() {
        this.getTimezoneList() 
        this.isEdit = false;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchInvertoryOrg();
            this.searhForIO();
        });
        this.getCountryList();
        this.commonService.getScreenSize(-30);
        this.searchIconValue = this.companyService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
    }
    getTimezoneList(){    
        let timezoneListArray = moment.tz.names();
        this.timeZoneList = timezoneListArray.map(timezone => {
            var utc = moment.tz(timezone).format('Z');
            this.timeZoneList.push({countryName: timezone,utc:utc})
            return { countryName: timezone, utc:utc};
        });
          
        this.timeZoneList.sort((a, b) => {             
            let first = a.utc.split(':');
            let second = b.utc.split(':');            
            let compareval = Number(first[0]) <= Number(second[0]) ? 1 : -1;
            return compareval;
            });    
        
    }
    logValidationErrors(
        group: FormGroup = this.InventoryOrganizationForm
    ): void {
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
        this.saveInprogress = false;
    }

    getCountryList() {
        this.commonService.getCountryLov().subscribe((data: any) => {
            this.countryList = [];
            for (const items of data.countries) {
                this.countryList.push({
                    value: items.name,
                    id: items.id,
                    label: items.name
                });
            }
        });
    }

    // handle on change events
    lookupSelectionChanged(
        event: any,
        lovType: string,
        Id: number,
        element: any
    ) {
        this.cityFilterList = [];
        if (lovType === 'State' && event.source.selected) {
            this.resetCountryValues(element);
            this.stateFilterList = [];
            this.commonService.getStateList().subscribe((stateData: any) => {
                const stateList = stateData.states;
                stateList.filter(item => {
                    if (item.country_id === String(Id)) {
                        this.stateFilterList.push(item);
                    }
                });
            });
        }
        if (lovType === 'City' && event.source.selected) {
            this.commonService.getCityList().subscribe((cityData: any) => {
                const cityList = cityData.cities;
                cityList.filter(item => {
                    if (item.state_id === String(Id)) {
                        this.cityFilterList.push(item);
                    }
                });
            });
        }
    }

    // timezoneFunc($event: any) {
    //     // this.timezonePicker = $event.name;
    //     this.InventoryOrganizationForm.patchValue({
    //         timezone: $event.name
    //     });
    // }
    resetCountryValues(element: any) {
        if (
            this.InventoryOrganizationForm.value.iuCountry !== '' &&
            this.InventoryOrganizationForm.value.iuCountry !== element.value
        ) {
            this.InventoryOrganizationForm.patchValue({
                iuStateCounty: ''
            });
            this.InventoryOrganizationForm.patchValue({
                iuCity: ''
            });
        }
    }

    searhForIO() {
        this.searchArrayunsubscribe = this.companycomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'inventoryorganisations') {
                    this.commonService.searhForMasters(this.dataForSearch);
                    // this.searchComponentToggle.emit(this.showSearch);
                    this.companyService.displaySearchComponent(this.showSearch);
                }
            }
        );
    }
    searchComponentOpen() {
        this.companyService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }

    searchInvertoryOrg() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (ouSearchInfo: any) => {
                const checksearchSource = this.checkSearch();
                if (checksearchSource === true) {
                    return;
                }
                // This code is used for not loading the search result when module loads
                if (ouSearchInfo.fromSearchBtnClick === true) {
                    // ouSearchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(ouSearchInfo);
                    this.inventoryOrgDataSource = new MatTableDataSource([]);
                    this.inventoryOrgDataSource.sort = this.sort;
                    this.inventoryOrgDataSource.paginator = this.paginator;
                    this.showInventoryList = true;
                    if (ouSearchInfo.searchType === 'inventoryOrganization') {
                        this.listProgress = true;
                        this.inventoryOrgService
                            .getInventoryOrgSearch(ouSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            for (const rowData of data.result) {
                                                if (
                                                    rowData.iuEnabledFlag ===
                                                    'N'
                                                ) {
                                                    rowData.iuEnabledFlag = false;
                                                } else {
                                                    rowData.iuEnabledFlag = true;
                                                }
                                            }
                                            this.inventoryOrgDataSource = new MatTableDataSource(
                                                data.result
                                            );
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.inventoryOrgDataSource.sort = this.sort;
                                            this.inventoryOrgDataSource.paginator = this.paginator;

                                        } else {
                                            this.iuMessage = data.message;
                                        }
                                    } else {
                                        // alert(data.message);
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
                } else {
                    return;
                }
            }
        );
    }

    InventoryOrganizationFeedForm() {
        this.InventoryOrganizationForm = this.fb.group({
            iuCode: ['', Validators.required],
            iuName: ['', Validators.required],
            timezone: [''],
            iuEnabledFlag: [false],
            iuWmsFlag: [false],
            iuOuId: ['', Validators.required],
            iuAddress1: ['', Validators.required],
            iuAddress2: [''],
            iuAddress3: [''],
            iuCountry: ['', Validators.required],
            iuStateCounty: ['', Validators.required],
            iuCity: ['', Validators.required],
            lpnPrefix: [''],
            lpnLength: [null],
            lpnStartNum: [''],
            iuPincode: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[0-9]*'),
                    Validators.maxLength(10)
                ]
            ],
            iuPhone: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9-+()s]*$'),
                    Validators.maxLength(15)
                ]
            ],
            iuPersonName: [''],
            iuPersonPhoneNum: [
                '',
                [Validators.pattern('^[0-9-+()s]*$'), Validators.maxLength(15)]
            ],
            iuPersonEmail: [
                '',
                [
                    // tslint:disable-next-line: max-line-length
                    Validators.pattern(
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                ]
            ],
            iuCompanyId: [
                Number(
                    JSON.parse(localStorage.getItem('userDetails')).companyId
                )
            ],
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            creationDate: [this.companycomponent.dateFormat(new Date())],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedDate: [this.companycomponent.dateFormat(new Date())]
        });
    }
    addInventoryOrg(type) {
        this.disableAllBtn = true;
        setTimeout(() => { this.disableAllBtn = false; }, 1000);
        this.stateFilterList = [];
        this.cityFilterList = [];
        if (type !== 'view') {
            this.showInventoryList = !this.showInventoryList;
            // this.searchComponentToggle.emit(false);
            this.companyService.displaySearchComponent(false);
        }
        this.InventoryOrganizationFeedForm();
        this.isEdit = false;
        if (type === 'add') {
            this.getOperatingUnitCode();
            this.InventoryOrganizationFeedForm();
        } else {
            if (type !== 'view') {
                this.searchInvertoryOrg();
                this.searhForIO();
            }
        }
    }
    get credentials() {
        return this.InventoryOrganizationForm.controls;
    }
    editInventoryOrg(id: number, name: string, type?: string) {
        type === 'view'
            ? this.addInventoryOrg('view')
            : this.addInventoryOrg('add');
        this.isEdit = true;

        this.inventoryOrgService.getInventoryOrgById(id).subscribe(
            (data: any) => {
                if (data.status === 200) {
                    if (type === 'view') {
                        const dataResult = data.result[0];
                        // this.OperatingUnitForm.patchValue(data);
                        dataResult.iuEnabledFlag =
                            dataResult.iuEnabledFlag === 'Y' ? true : false;
                        dataResult.iuWmsFlag =
                            dataResult.iuWmsFlag === 'Y' ? true : false;
                        dataResult.companyCode = JSON.parse(
                            localStorage.getItem('userDetails')
                        ).companyCode;
                        // tslint:disable-next-line: no-use-before-declare
                        const dialogRef = this.dialog.open(
                            // tslint:disable-next-line: no-use-before-declare
                            InventoryUnitsViewDialogComponent,
                            {
                                width: '70vw',
                                data: dataResult
                            }
                        );

                        dialogRef.afterClosed().subscribe(response => { 
                            if (response !== undefined) {
                                this.editInventoryOrg(response, '');
                            }
                        });
                    } else {
                        this.shoeIUName =
                            '' + name;
                        this.childId = data.result[0].iuId;
                        this.InventoryOrganizationForm.patchValue(
                            data.result[0]
                        );
                        // this.timezonePicker = '+01:00';
                        // this.InventoryOrganizationForm.patchValue({
                        //     timezone: data.res
                        // });
                        this.InventoryOrganizationForm.controls.iuEnabledFlag.patchValue(
                            data.result[0].iuEnabledFlag === 'Y' ? true : false
                        );
                        this.InventoryOrganizationForm.controls.iuWmsFlag.patchValue(
                            data.result[0].iuWmsFlag === 'Y' ? true : false
                        );
                        this.InventoryOrganizationForm.controls.updatedBy.patchValue(
                            JSON.parse(localStorage.getItem('userDetails'))
                                .userId
                        );
                        this.InventoryOrganizationForm.controls.updatedDate.patchValue(
                            this.companycomponent.dateFormat(new Date())
                        );
                    }
                }
            },
            (error: any) => {
                console.log(error.error.message);
            }
        );
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
    onSubmit() { 
        this.saveInprogress = true;
        if (this.InventoryOrganizationForm.value.iuEnabledFlag === true) {
            this.InventoryOrganizationForm.value.iuEnabledFlag = 'Y';
        }
        if (
            this.InventoryOrganizationForm.value.iuEnabledFlag === false ||
            this.InventoryOrganizationForm.value.iuEnabledFlag == null
        ) {
            this.InventoryOrganizationForm.value.iuEnabledFlag = 'N';
        }
        if (this.InventoryOrganizationForm.value.iuWmsFlag === true) {
            this.InventoryOrganizationForm.value.iuWmsFlag = 'Y';
        }
        if (
            this.InventoryOrganizationForm.value.iuWmsFlag === false ||
            this.InventoryOrganizationForm.value.iuWmsFlag == null
        ) {
            this.InventoryOrganizationForm.value.iuWmsFlag = 'N';
        }

        const lpnPrefix = this.InventoryOrganizationForm.value.lpnPrefix
            ? this.InventoryOrganizationForm.value.lpnPrefix.trim()
            : this.InventoryOrganizationForm.value.lpnPrefix;
        const lpnStartNumber = this.InventoryOrganizationForm.value.lpnStartNum
            ? this.InventoryOrganizationForm.value.lpnStartNum.trim()
            : this.InventoryOrganizationForm.value.lpnStartNum;
        const lpnLength = this.InventoryOrganizationForm.value.lpnLength
            ? this.InventoryOrganizationForm.value.lpnLength
            : this.InventoryOrganizationForm.value.lpnLength;

        if (lpnPrefix === '' && (lpnStartNumber !== '' ||  lpnLength)) {
            this.openSnackBar(
                ' Please Enter the LPN prefix',
                '',
                'error-snackbar'
            );
            this.saveInprogress = false;
            return;
        }        
        
        if (lpnPrefix !== '' && !lpnLength) {
            this.openSnackBar(
                ' Please Enter the LPN length',
                '',
                'error-snackbar'
            );
            this.saveInprogress = false;
            return;
        }
        if (lpnPrefix !== '' && lpnLength){
            const prefixLength =
                this.InventoryOrganizationForm.value.lpnPrefix.length + 1;
            this.lpnstartLength =
                20 - this.InventoryOrganizationForm.value.lpnPrefix.length;
            if (this.InventoryOrganizationForm.value.lpnLength < prefixLength) {
                this.InventoryOrganizationForm.patchValue({ lpnLength: '' });
               this.openSnackBar('Please enter minimum value of ' + prefixLength,'',
                    'error-snackbar');
                this.saveInprogress = false;
                return;
            }
             if (this.InventoryOrganizationForm.value.lpnLength > 20) {
                 this.InventoryOrganizationForm.patchValue({ lpnLength: '' });                 
                 this.openSnackBar('Please enter in between ' + prefixLength + ' to 20','',
                     'error-snackbar');
                 this.saveInprogress = false;
                 return;
             }
             
        }
        if ((lpnPrefix !== '' || lpnLength) && lpnStartNumber === '') {
            this.openSnackBar(
                ' Please Enter the LPN start number',
                '',
                'error-snackbar'
            );
            this.saveInprogress = false;
            return;
        }
        if (this.isEdit) {
            if (this.InventoryOrganizationForm.valid) {
                this.inventoryOrgService
                    .updateInventoryOrg(
                        this.childId,
                        this.InventoryOrganizationForm.value
                    )
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                // this.companycomponent.openDialog(
                                //     'Success',
                                //     data.message
                                // );
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.getInventoryOrg();
                                this.showInventoryList = true;
                                this.searchInvertoryOrg();
                                this.refreshSearchLov = 'refresh';
                                this.dataForSearch[
                                    'lovSearchFromAdd_update'
                                ] = true;
                                this.searhForIO();
                            } else {
                                // alert(data.message);
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                            this.saveInprogress = false;
                        },
                        (error: any) => {
                            // alert(error.error.message);
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                            this.saveInprogress = false;
                        }
                    );
            }else {
                this.openSnackBar('Please enter all required fields', '', 'default-snackbar');
                this.logValidationErrors();
            }
        } else {
            if (this.InventoryOrganizationForm.valid) {
                // this.InventoryOrganizationForm.value.timezone = this.timezonePicker;
                this.inventoryOrgService
                    .createInventoryOrg(this.InventoryOrganizationForm.value)
                    // .pipe(first())
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                // this.companycomponent.openDialog(
                                //     'Success',
                                //     data.message
                                // );
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.getInventoryOrg();
                                this.InventoryOrganizationFeedForm();
                                this.showInventoryList = true;
                                this.refreshSearchLov = 'refresh';
                                this.dataForSearch[
                                    'lovSearchFromAdd_update'
                                ] = true;
                                this.searhForIO();
                                this.inventoryOrgDataSource = new MatTableDataSource(
                                    []
                                );
                                this.inventoryOrgDataSource.sort = this.sort;
                                this.inventoryOrgDataSource.paginator = this.paginator;

                            } else {
                                // alert(data.message);
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                            this.saveInprogress = false;
                        },
                        (error: any) => {
                            // alert(error.error.message);
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                            this.saveInprogress = false;
                        }
                    );
            }else {
                this.openSnackBar('Please enter all required fields', '', 'default-snackbar');
                this.logValidationErrors();
            }
        }
    }
    getInventoryOrg() {
        // let temp: Array<string> =[];
        this.inventoryOrgService
            .getInventoryOrgList()
            .subscribe((data: any) => {
                this.navItems = data.result;
            });
    }

    // Get inventory organization Id on click side tree menu
    getSideTreeChildId($event: any) {
        this.childId = $event;
        if (this.childId) {
            this.getInventoryOrganizationDetails(this.childId);
        }
    }

    // Get Inventory Organization Detail By Id
    getInventoryOrganizationDetails(id) {
        this.inventoryOrgService
            .getInventoryOrgById(id)
            .subscribe((result: any) => {
                if (result.status === 200) {
                    if (result.result.length) {
                        this.inputDisabled = true;
                        this.isEdit = true;
                        this.InventoryOrganizationForm.patchValue(
                            result.result[0]
                        );
                        if (
                            this.InventoryOrganizationForm.value
                                .iuEnabledFlag === 'Y'
                        ) {
                            this.InventoryOrganizationForm.patchValue({
                                iuEnabledFlag: true
                            });
                        }
                        if (
                            this.InventoryOrganizationForm.value
                                .iuEnabledFlag === 'N'
                        ) {
                            this.InventoryOrganizationForm.patchValue({
                                iuEnabledFlag: false
                            });
                        }
                        if (
                            this.InventoryOrganizationForm.value.iuWmsFlag ===
                            'Y'
                        ) {
                            this.InventoryOrganizationForm.patchValue({
                                iuWmsFlag: true
                            });
                        }
                        if (
                            this.InventoryOrganizationForm.value.iuWmsFlag ===
                            'N'
                        ) {
                            this.InventoryOrganizationForm.patchValue({
                                iuWmsFlag: false
                            });
                        }
                    }
                }
            });
    }

    // Get Operating Unit LOV
    getOperatingUnitCode() {
        this.ouCodeList = [];
        this.ouEnabledCodeList = [];
        this.operatingUnitService
            .getOperatingUnitList()
            .subscribe((data: any) => {
                for (let i = 0; i < data.result.length; i++) {
                    if (data.result[i].ouEnabledFlag == 'Y') {
                        this.ouEnabledCodeList.push({
                            key: data.result[i].ouId,
                            value: data.result[i].ouCode
                        });
                    }
                    this.ouCodeList.push({
                        key: data.result[i].ouId,
                        value: data.result[i].ouCode
                    });
                }
            });
    }

    openConfirmationDialog(pageName: string, url: any) {
        const confirmationDialogRef = this.dialog.open(
            ConfirmationDialogComponent,
            {
                data: { pageName: pageName, url: url },
                width: '30vw'
            }
        );
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (
                response !== undefined &&
                response.url === 'inventryUnitCancel'
            ) {
                this.addInventoryOrg('back');
                setTimeout(() => {
                    this.commonService.setTableResize(
                        this.matTableRef.nativeElement.clientWidth,
                        this.columns
                    );
                }, 500);
            }
        });
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }
    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.searchArrayunsubscribe
            ? this.searchArrayunsubscribe.unsubscribe()
            : '';
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';
        this.refreshSearchLov = '';

        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.inventoryOrgDataSource.sort = this.sort;

        setTimeout(() => {
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
     
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
        }, 500);

    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(-30);
    }
     
}
@Component({
    selector: 'app-inventory-organization-view-dialog',
    templateUrl: './inventory-organization-view-dialog.html'
    // providers: [MatDialogData]
})
export class InventoryUnitsViewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<InventoryUnitsViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
