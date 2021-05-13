import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    Optional,
    Inject,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogRef,
    MatTableDataSource,
    MAT_DIALOG_DATA,
    MatSnackBar,
    DateAdapter,
    MatTable,
    MatSort
} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/app/_services/company.service';
import { Router } from '@angular/router';
import { CompanyComponent } from '../company.component';
import { DatePipe } from '@angular/common';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { CommonService } from 'src/app/_services/common/common.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';

// import moment = require('moment');
// tslint:disable-next-line:no-duplicate-imports
// import { default as _rollupMoment } from 'moment';
// const moment =  _moment;

@Component({
    selector: 'app-companyfeed',
    templateUrl: './companyfeed.component.html',
    styleUrls: ['./companyfeed.component.css'],
    // providers: [
    //     {
    //         provide: DateAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    //     },

    //     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // ],
})

export class CompanyfeedComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    companyForm: FormGroup;
    public imagePath;
    logoImgURL: any;
    iconImgURL: any;
    public messageLogo: string;
    public messageIcon: string;
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    countryList: any[] = [];
    stateFilterList: any[] = [];
    cityFilterList: any[] = [];
    fieldDisable = true;
    companyList = false;
    files = [{ name: 'foo.js', content: '' }, { name: 'bar.js', content: '' }];
    dialogtemp = 'newdialog';
    cityList: any[] = [];
    userId = '';
    isEdit: boolean;
    public showSearch = true;
    companyIdGet: number;
    userIdGet: number;
    showCompanyName: string;
    hide: boolean;
    isLogoSelected: boolean;
    isIconSelected: boolean;
    // companyMessage = 'No company defined.'
    companyMessage = ''
    companyName: any = ''
    // userId:number
    searchEnableFlag = false;
    searchIconValue : any = '';
    viewDisable : boolean = false;
    dataForSearch: any = {
        type: 'COMPANY',
        searchType: 'company',
        searchFor: 'Search Companies',
        companyKey: '',
        searchArray: [
            {
                type: 'LOV',
                lovType: 'code',
                label: 'Company Code',
                key: 'companyId',
                value: '',
                list: [
                    {
                        label: ' Please Select',
                        value: ''
                    }
                ]
            },
            {
                type: 'LOV',
                lovType: 'name',
                label: 'Company Name',
                key: 'companyId',
                value: '',
                list: [
                    {
                        label: ' Please Select',
                        value: ''
                    }
                ]
            },
            {
                type: 'LOV',
                lovType: 'enableFlag',
                label: 'Enable Flag',
                key: 'companyEnabledFlag',
                value: '',
                list: [
                    { label: 'All', value: '' },
                    { label: 'Yes', value: 'Y' },
                    { label: 'No', value: 'N' }
                ]
            },
            {
                type: 'LOV',
                lovType: 'activityBillingFlag',
                label: 'Enable 3PL',
                key: 'activityBillingFlag',
                value: '',
                list: [
                    { label: 'All', value: '' },
                    { label: 'Yes', value: 'Y' },
                    { label: 'No', value: 'N' }
                ]
            },
            {
                type: 'LOV',
                lovType: 'mfgFlag',
                label: 'Enable MFG',
                key: 'mfgFlag',
                value: '',
                list: [
                    { label: 'All', value: '' },
                    { label: 'Yes', value: 'Y' },
                    { label: 'No', value: 'N' }
                ]
            },
            {
                type: 'LOV',
                lovType: 'ymsFlag',
                label: 'Enable YMS',
                key: 'ymsFlag',
                value: '',
                list: [
                    { label: 'All', value: '' },
                    { label: 'Yes', value: 'Y' },
                    { label: 'No', value: 'N' }
                ]
            },
            {
                type: 'LOV',
                lovType: 'expressLabelFlag',
                label: 'Enable Express',
                key: 'expressLabelFlag',
                value: '',
                list: [
                    { label: 'All', value: '' },
                    { label: 'Yes', value: 'Y' },
                    { label: 'No', value: 'N' }
                ]
            }
        ]
    };

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;
    displayedColumns: string[] = [
        'companyCode',
        'companyName',
        'companyAddr1',
        'creationDate',
        'companyEnabledFlag',
        'expressLabelFlag',
        'activityBillingFlag',
        'mfgFlag',
        'ymsFlag',
        'action'
    ];
    columns: any =  [
        {field: 'companyCode', name: 'Code', width: 75, baseWidth: 8 },
        {field: 'companyName', name: 'Name', width: 150, baseWidth: 12 },
        {field: 'companyAddr1', name: 'Address', width: 150, baseWidth: 15 },
        {field: 'creationDate', name: 'Start Date', width: 100, baseWidth: 15 },
        {field: 'companyEnabledFlag', name: 'Enabled', width: 100, baseWidth: 8 },
        {field: 'expressLabelFlag', name: 'Express Label', width: 100, baseWidth: 8 },
        {field: 'activityBillingFlag', name: '3PL', width: 100, baseWidth: 8 },
        {field: 'mfgFlag', name: 'MFG', width: 100, baseWidth: 8 },
        {field: 'ymsFlag', name: 'YMS', width: 100, baseWidth: 8},
        {field: 'action', name: 'Action', width: 75, baseWidth: 10 },

    ]
    // date = new FormControl(moment())
    companyDataSource = new MatTableDataSource();
    listProgress = false;

    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;

    validationMessages = {
        companyName: { required: 'Company Name is required.' },
        companyCode: { required: 'Company Code is required.' },
        companyAddr1: { required: 'Address is required.' },
        companyCity: { required: 'City is required.' },
        companyStateCounty: { required: 'State/County is required.' },
        companyCountry: { required: 'Country is required.' },
        companyPincode: {
            required: 'Postal Code is required.',
            pattern: 'Please Enter Numeric Value',
            maxlength: 'Maximum 10 character allowed'
        },
        companyPhone: {
            required: 'Phone Number is required.',
            // pattern: 'Please Enter Numeric Value',
            maxlength: 'Maximum 15 characters allowed'
        },
        companyPersonName: { required: 'Person Name is required.' },
        companyPersonPhoneNum: {
            required: 'Phone Number is required.',
            pattern: 'Please Enter Numeric Value',
            maxlength: 'Maximum 15 characters allowed'
        },
        companyPersonEmail: {
            required: 'Email is required.',
            pattern: 'Please enter a valid email address'
        },
        userName: { required: 'User Name is required.' },
        userStartDate: { required: 'Start Date is required.' },
        userEmail: {
            required: 'Email is required.',
            pattern: 'Please enter a valid email address'
        },
        userPassword: { required: 'Passowd is required.' },
        userPswdValidityDays: { min: 'Please Enter minimum value of 1' },
        companyLicensedUsers: {
            required: 'Licensed User is required.',
            min: 'Please Enter minimum value of 1'
        }
    };

    formErrors = {
        companyName: '',
        companyCode: '',
        companyAddr1: '',
        companyCity: '',
        companyStateCounty: '',
        companyCountry: '',
        companyPincode: '',
        companyPhone: '',
        companyPersonName: '',
        companyPersonPhoneNum: '',
        companyPersonEmail: '',
        userName: '',
        userStartDate: '',
        userEmail: '',
        userPassword: '',
        userPswdValidityDays: '',
        companyLicensedUsers: ''
    };

    companyID: number;
    preview(files: any, fromId: string) {
        if (files.length === 0) {
            return;
        }

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            if (fromId === 'logo') {
                this.messageLogo = 'Only images are supported.';
            } else {
                this.messageIcon = 'Only images are supported.';
            }
            return;
        }

        const fileSize = files[0].size / 1024; // in MB
        if (fileSize > 256) {
            if (fromId === 'logo') {
                this.logoImgURL = '';
                this.messageLogo = 'Logo size exceeds 256 KB.';
                return;
            } else if (fromId === 'icon') {
                this.iconImgURL = '';
                this.messageIcon = 'Icon size exceeds 256 KB.';
                return;
            }
        }
        if (fromId === 'logo') {
            this.messageLogo = '';
        }
        if (fromId === 'icon') {
            this.messageIcon = '';
        }

        const reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = event => {
            if (fromId === 'logo') {
              this.isLogoSelected = true;
              this.logoImgURL = reader.result;
            } else if (fromId === 'icon') {
              this.isIconSelected = true;
              this.iconImgURL = reader.result;
            }
        };
    }

    changeImage(imageChangeFor: string) {
      if(imageChangeFor === 'logo') {
        this.isLogoSelected = false;
        this.logoImgURL = '';
      } else if(imageChangeFor === 'icon') {
        this.isIconSelected = false;
        this.iconImgURL = '';
      } else {
        return
      }

    }

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private http: HttpClient,
        private companyService: CompanyService,
        private companycomponent: CompanyComponent,
        public router: Router,
        public commonService: CommonService,
        private snackBar: MatSnackBar
    ) {
        this.companyFeedForm();
        this.getCompanyDetails();
    }

    getCompanyDetails() {
        this.userId = String(
            JSON.parse(localStorage.getItem('userDetails')).userId
        );
       
        if (this.userId === '-1') {
            this.fieldDisable = false;
            this.companyFeedForm();
            this.companyList = true;
        } else {
            
            this.companyService.getCompanyList().subscribe(
                (data: any) => {
                    
                    const companyData = data.result[0];
                    if(companyData && companyData.companyEnabledFlag){
                        companyData.companyEnabledFlag = companyData.companyEnabledFlag === 'Y' ? true : false;
                        companyData.expressLabelFlag = companyData.expressLabelFlag === 'Y' ? true : false;
                        companyData.activityBillingFlag = companyData.activityBillingFlag  === 'N' ? false  : true;
                        companyData.mfgFlag = companyData.mfgFlag === 'N' ? false  : true;
                        companyData.ymsFlag = companyData.ymsFlag  === 'N' ? false  : true;
                    }

                    
                    this.companyForm.patchValue(companyData);
                    this.companyID = companyData.companyId;
                    if (companyData.companyLogo !== null) {
                        const logoString = companyData.companyLogo.value;
                        this.logoImgURL = logoString.slice(1, -1);
                        this.isLogoSelected = true;
                    }
                    if (companyData.companyIcon !== null) {
                        const iconString = companyData.companyIcon.value;
                        this.iconImgURL = iconString.slice(1, -1);
                        this.isIconSelected = true;
                    }
                },
                error => {                    
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
        }
    }
    ngOnInit() {
        this.hide = true;
        this.isEdit = false;
        this.isLogoSelected = false;
        this.isIconSelected = false;
        this.userId = String(
            JSON.parse(localStorage.getItem('userDetails')).userId
        );
        this.getCountryList();
        this.commonService.getScreenSize(-25);
        if (this.userId === '-1') {
            this.searchCompany();
            this.searchForCompany();
        }else{
            setTimeout(() => {
                this.companyService.displaySearchComponent(false);
            }, 100);
        }
        this.searchIconValue = this.companyService.searchIconValue.subscribe((searchEnableFlag: any) => {
            this.searchEnableFlag = searchEnableFlag;
        });
    }

    logValidationErrors(group: FormGroup = this.companyForm): void {
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
    lookupSelectionChanged(event: any, lovType: string, Id: number, element:any) {
        this.cityFilterList = [];
        if (lovType === 'State' && event.source.selected) {
            this.resetCountryValues(element);
            this.stateFilterList = [];
            this.commonService.getStateList().subscribe((stateData: any) => {
                const stateList = stateData.states;
                stateList.filter((item: any) => {
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

    resetCountryValues(element: any){
      if( this.companyForm.value.companyCountry !== ''
          && this.companyForm.value.companyCountry !== element.value){
        this.companyForm.patchValue({
          companyStateCounty: ''
        });
        this.companyForm.patchValue({
          companyCity: ''
        });
      }
    }

    searchForCompany() {
        this.searchArrayunsubscribe = this.companycomponent.showSearchFlag.subscribe((data: any) => {
            if (data === 'company') {
                this.commonService.searhForMasters(this.dataForSearch);
                // this.searchComponentToggle.emit(this.showSearch);
                this.companyService.displaySearchComponent(this.showSearch);
            }
        });
    }
    searchComponentOpen(){
        this.companyService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }

    searchCompany() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((ouSearchInfo: any) => {
            // This code is used for not loading the search result when module loads 
            if(ouSearchInfo.fromSearchBtnClick === true){
                // ouSearchInfo.fromSearchBtnClick = false;
                // this.commonService.getsearhForMasters(ouSearchInfo);
                this.companyDataSource = new MatTableDataSource([]);
            this.companyDataSource.sort = this.sort;
            this.companyList = true;
            if (ouSearchInfo.searchType === 'company') {
                this.listProgress = true;
                this.companyService
                    .getCompanySearch(ouSearchInfo.searchArray)
                    .subscribe(
                        (data: any) => {
                            this.listProgress = false;
                            if (data.status === 200) {
                                if (!data.message) {
                                    for (const rowData of data.result) {
                                        rowData.companyEnabledFlag = rowData.companyEnabledFlag  === 'N' ? false  : true;
                                        rowData.expressLabelFlag = rowData.expressLabelFlag === 'N' ? false  : true;
                                        rowData.activityBillingFlag = rowData.activityBillingFlag  === 'N' ? false  : true;
                                        rowData.mfgFlag = rowData.mfgFlag === 'N' ? false  : true;
                                        rowData.ymsFlag = rowData.ymsFlag  === 'N' ? false  : true;
                                    }
                                    this.companyDataSource = new MatTableDataSource<any>(data.result);
                                    this.companyDataSource.sort = this.sort;
                                } else {
                                    this.companyMessage = data.message;
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
            }else{
                return;
            }
            
        });
    }
    getCompanyDetailsById(id: number, name: string, type?: string) {
        // this.addCompany('add');
        this.viewDisable = true;
        this.messageLogo = '';
        this.messageIcon = '';
        type === 'view' ? this.addCompany('view') : this.addCompany('add');
        this.isEdit = true;
        this.showCompanyName = 'Edit Company : ' + name;
        this.companyForm.get('userPassword').clearValidators();
        // this.companyForm.controls.userPassword.disable();
        this.companyForm.controls.companyCode.disable();
        this.companyForm.controls.companyName.disable();
        this.companyForm.controls.userName.disable();
        this.companyForm.get('userPassword').updateValueAndValidity();
        this.companyService.getCompanyById(id).subscribe(
            (result: any) => {
                if (result.status === 200) {
                    if (result.result.length) {
                        this.viewDisable = false;
                        if (type === 'view') {
                            const dataResult = result.result[0];
                            dataResult.ouEnabledFlag = dataResult.ouEnabledFlag === 'Y' ? true : false;
                            
                            dataResult.companyEnabledFlag = dataResult.companyEnabledFlag === 'Y' ? true : false;
                            dataResult.expressLabelFlag = dataResult.expressLabelFlag === 'Y' ? true : false;
                            dataResult.activityBillingFlag = dataResult.activityBillingFlag === 'Y' ? true : false;
                            dataResult.mfgFlag = dataResult.mfgFlag === 'Y' ? true : false;
                            dataResult.ymsFlag = dataResult.ymsFlag === 'Y' ? true : false;

                            if (dataResult.companyLogo !== null) {
                                const logoString = dataResult.companyLogo.value;
                                dataResult.companyLogo = logoString.slice(
                                    1,
                                    -1
                                );
                            }
                            if (dataResult.companyIcon !== null) {
                                const iconString = dataResult.companyIcon.value;
                                dataResult.companyIcon = iconString.slice(
                                    1,
                                    -1
                                );
                            }
                            // dataResult.companyCode = JSON.parse(
                            //     localStorage.getItem('userDetails')
                            // ).companyCode;
                            // tslint:disable-next-line: no-use-before-declare
                            const dialogRef = this.dialog.open(
                                CompanyFeedViewDialogComponent,
                                {
                                    width: '70vw',
                                    // height: '90vh',
                                    data: dataResult
                                }
                            );

                            dialogRef.afterClosed().subscribe(response => { 
                                if (response !== undefined) {
                                    this.getCompanyDetailsById(response, '');
                                }
                            });
                        } else {
                            const data = result.result[0];
                            data.userPassword = '';
                            this.companyForm.patchValue(data);
                            this.companyIdGet = data.companyId;
                             
                            this.companyName = result.result[0].companyName;
                            this.userIdGet = data.userId;
                            this.companyForm.controls.companyEnabledFlag.patchValue(
                                data.companyEnabledFlag === 'Y' ? true : false
                            );
                            this.companyForm.controls.expressLabelFlag.patchValue(
                                data.expressLabelFlag === 'Y' ? true : false
                            );
                            this.companyForm.controls.activityBillingFlag.patchValue(
                                data.activityBillingFlag === 'Y' ? true : false
                            );

                            this.companyForm.controls.mfgFlag.patchValue(
                                data.mfgFlag === 'Y' ? true : false
                            );
                            this.companyForm.controls.ymsFlag.patchValue(
                                data.ymsFlag === 'Y' ? true : false
                            ); 
                            if (data.companyLogo !== null) {
                                const logoString = data.companyLogo.value;
                                this.logoImgURL = logoString.slice(1, -1);
                                this.isLogoSelected = true;
                            }
                            if (data.companyIcon !== null) {
                                const iconString = data.companyIcon.value;
                                this.iconImgURL = iconString.slice(1, -1);
                                this.isIconSelected = true;
                            }
                        }
                    }
                }
            },
            (error: any) => {
                this.viewDisable = false;
                console.log(error.error.message);
            }
        );
    }
    companyFeedForm() {
        this.companyForm = this.fb.group({
            companyName: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyCode: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyEnabledFlag: [{ value: true, disabled: this.fieldDisable }],
            expressLabelFlag: [{ value: false, disabled: this.fieldDisable}],
            activityBillingFlag: [{ value: false, disabled: this.fieldDisable}],
            mfgFlag: [{ value: false, disabled: this.fieldDisable}],
            ymsFlag: [{ value: false, disabled: this.fieldDisable}],
            companyAddr1: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyAddr2: [{ value: '', disabled: this.fieldDisable }],
            companyAddr3: [{ value: '', disabled: this.fieldDisable }],
            companyCity: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyStateCounty: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyCountry: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyPincode: [
                { value: '', disabled: this.fieldDisable },
                [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]
            ],
            companyPhone: [
                { value: '', disabled: this.fieldDisable },
                [Validators.required, Validators.maxLength(15)]
            ],
            companyPersonName: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            companyPersonPhoneNum: [
                { value: '', disabled: this.fieldDisable },
                [Validators.required, Validators.pattern('^[0-9-+()s]*$'), Validators.maxLength(15)
            ]
            ],
            companyPersonEmail: [
                { value: '', disabled: this.fieldDisable },
                [
                    Validators.required,
                    // tslint:disable-next-line: max-line-length
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ]
            ],
            companyLogo: [{ value: '', disabled: this.fieldDisable }],
            companyIcon: [{ value: '', disabled: this.fieldDisable }],
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            creationDate: [this.companycomponent.dateFormat(new Date())],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedDate: [this.companycomponent.dateFormat(new Date())],
            userName: [
                { value: '', disabled: this.fieldDisable },
                Validators.required
            ],
            userPassword: [
                { value: '', disabled: this.fieldDisable },
                this.isEdit === false ? Validators.required : ''
            ],
            userDescription: [{ value: '', disabled: this.fieldDisable }],
            userStartDate: [
                {
                    value: this.companyService.dateFormat(new Date()),
                    disabled: this.fieldDisable
                },
                Validators.required
            ],
            userEndDate: [{ value: '', disabled: this.fieldDisable }],
            userEmail: [
                { value: '', disabled: this.fieldDisable },
                [Validators.required,
                // tslint:disable-next-line: max-line-length
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
            ],
            userPswdValidityDays: [
                { value: null, disabled: this.fieldDisable },
                Validators.min(1)
            ],
            userPinCode: [{ value: '', disabled: this.fieldDisable }],
            userImage: [{ value: '', disabled: this.fieldDisable }],
            companyLicensedUsers: [
                { value: '', disabled: this.fieldDisable },
                [Validators.required, Validators.min(1)]
            ]
        });
    }

    get credentials() {
        return this.companyForm.controls; 
    }
    // add company form reset
    addCompany(type: string) {
        this.logoImgURL = '';
        this.iconImgURL = '';
        this.stateFilterList = [];
        this.cityFilterList = [];
        if (type !== 'view') {
            this.companyList = !this.companyList;
            // this.searchComponentToggle.emit(false);
            // this.companyService.displaySearchComponent(false);
        }
        this.isEdit = false;
        if (type === 'add') {
            this.companyFeedForm();
            this.companyService.displaySearchComponent(false);
        } else {
            if (type !== 'view') {
                this.searchCompany();
                this.searchForCompany();
            }
        }
    }

    onSubmit() {
        // this.companyForm.controls.userPassword.setValidators([Validators.required]);
        this.companyForm.patchValue({ companyLogo: this.logoImgURL });
        this.companyForm.patchValue({ companyIcon: this.iconImgURL });
        this.companyForm.patchValue({ companyLicensedUsers: Number(this.companyForm.value.companyLicensedUsers) });
        if (this.logoImgURL === '' && this.iconImgURL === ''){
            this.messageLogo = ' Please Select logo';
            this.messageIcon = ' Please Select icon';
            return;
        }
        if (this.logoImgURL === '') {
            this.messageLogo = ' Please Select logo';
            return;
        }
        if (this.iconImgURL === '') {
            this.messageIcon = ' Please Select icon';
            return;
        }
        if (this.isEdit) {
            this.companyForm.get('userPassword').clearValidators();
            this.companyForm.get('userPassword').updateValueAndValidity();
            if (this.companyForm.valid) {
                this.companyForm.value.companyId = this.companyIdGet;
                this.companyForm.value.userId = this.userIdGet;
                this.companyForm.value.userImage = '';
               
                this.companyForm.value.companyEnabledFlag === false ? this.companyForm.value.companyEnabledFlag = 'N' :
                this.companyForm.value.companyEnabledFlag = 'Y';
                 
                this.companyForm.value.expressLabelFlag === false ? this.companyForm.value.expressLabelFlag = 'N' :
                this.companyForm.value.expressLabelFlag = 'Y';

                this.companyForm.value.activityBillingFlag === false ? this.companyForm.value.activityBillingFlag = 'N' :
                this.companyForm.value.activityBillingFlag = 'Y';

                this.companyForm.value.mfgFlag === false ? this.companyForm.value.mfgFlag = 'N' :
                this.companyForm.value.mfgFlag = 'Y';

                this.companyForm.value.ymsFlag === false ? this.companyForm.value.ymsFlag = 'N' :
                this.companyForm.value.ymsFlag = 'Y';
                
                if (this.companyForm.value.userPassword === '') {
                    this.companyForm.value.userPassword = null;
                }
                if (this.companyForm.value.userEndDate ){
                    this.companyForm.value.userEndDate = this.companycomponent.dateFormat(this.companyForm.value.userEndDate);
                } else{
                    this.companyForm.value.userEndDate = null;
                }
                this.companyService
                    .updateCompanyAndUserList(this.companyForm.value)
                    .subscribe(
                        (data: any) => {
                            if (data.status === 200) {
                               
                                this.postCompany('update');
                                setTimeout(() => {
                                    this.openSnackBar(data.message, '', 'success-snackbar');
                                    this.companyList = true;
                                    this.searchForCompany();
                                    this.searchCompany();
                                }, 100);
                            }
                        },
                        (error: any) => {
                            // alert(error.error.message);
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                        }
                    );
            }
        } else {
            this.companyForm
                .get('userPassword')
                .setValidators([Validators.required]);
            this.companyForm.get('userPassword').updateValueAndValidity();
            
            this.companyForm.value.companyEnabledFlag === false ? this.companyForm.value.companyEnabledFlag = 'N' :
            this.companyForm.value.companyEnabledFlag = 'Y';
                
            this.companyForm.value.expressLabelFlag === false ? this.companyForm.value.expressLabelFlag = 'N' :
            this.companyForm.value.expressLabelFlag = 'Y';

            this.companyForm.value.activityBillingFlag === false ? this.companyForm.value.activityBillingFlag = 'N' :
            this.companyForm.value.activityBillingFlag = 'Y';

            this.companyForm.value.mfgFlag === false ? this.companyForm.value.mfgFlag = 'N' :
            this.companyForm.value.mfgFlag = 'Y';

            this.companyForm.value.ymsFlag === false ? this.companyForm.value.ymsFlag = 'N' :
            this.companyForm.value.ymsFlag = 'Y';

            const getUserDetails = JSON.parse(
                localStorage.getItem('userDetails')
            );
            const getUserId = getUserDetails.userId;
            if (getUserId === -1) {
                getUserDetails.companyCode = this.companyForm.value.companyCode;
            }

            // Update the value
            localStorage.setItem('userDetails', JSON.stringify(getUserDetails));

            if (this.companyForm.valid) {
                this.companyForm.value.userStartDate =
                    this.companyForm.value.userStartDate ? this.companycomponent.dateFormat(this.companyForm.value.userStartDate) : '';

                if (this.companyForm.value.userEndDate ){
                    this.companyForm.value.userEndDate = this.companycomponent.dateFormat(this.companyForm.value.userEndDate);
                } else{
                    this.companyForm.value.userEndDate = null;
                }
                this.companyService
                    .defineCompany(this.companyForm.value)
                    .subscribe(
                        (data: any) => {
                            if (data.status === 200) {
                               
                                this.postCompany('add');
                                setTimeout(() => {
                                    this.openSnackBar(data.message, '', 'success-snackbar');
                                    this.getCompanyDetails();
                                    this.companyList = true;
                                    this.searchForCompany();
                                    this.companyDataSource = new MatTableDataSource([]);
                                    this.companyDataSource.sort = this.sort;
                                }, 100);

                            }
                        },
                        error => {
                            // alert(error.error.message);
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                        }
                    );
            }
        }
    }

    postCompany(type){
        const companyData = this.companyForm.value;
        if(type === 'update' && this.companyForm.value.expressLabelFlag === 'Y' ){
            companyData.IsActive = 1;
        }else if(type === 'update' && this.companyForm.value.expressLabelFlag === 'N' ){
            companyData.IsActive = 0;
        }else{
            companyData.IsActive = 1;
        }
        
        companyData.AppUserName = String(
            JSON.parse(localStorage.getItem('userDetails')).userEmail
        );

        const data = {
            Name        : type === 'update' ? this.companyName : companyData.companyName,
            Address     : companyData.companyAddr1,
            IsActive    : companyData.IsActive
        }
        
        this.companyService
            .postCompany(data)
            .subscribe(
              (resultData: any) => {
                 
                if (resultData.id) {
                    this.openSnackBar('', '', 'success-snackbar');
                } else {
                  this.openSnackBar(resultData.message, '', 'error-snackbar');
                }
              },
              error => {
                 
                if(error.status === 200){
                  this.openSnackBar(error.error.text, '', 'success-snackbar');
                }else{
                  this.openSnackBar(error.error, '', 'error-snackbar');
                }
              }
            );
    }

    openDialogWithRef(templateRef: TemplateRef<any>) {
        this.dialog.open(templateRef);
    }

    openConfirmationDialog(pageName: string, url: any) {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { pageName: pageName, url: url },
            width: '30vw'
        });
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (response !== undefined && response.url === 'companyCancel') {
                this.addCompany('back');
                // reset table width
                setTimeout(() => {
                    if(this.matTableRef){
                        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
                    }
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
        this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
        this.searchArrayunsubscribe ? this.searchArrayunsubscribe.unsubscribe() : '';
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.companyDataSource.sort = this.sort;
        setTimeout(() => {
            if(this.matTableRef){
                this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            }
        }, 500);
    }

    @HostListener('window:resize', ['$event'])
        onResize(event) {
        if(this.matTableRef){
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        }
        this.commonService.getScreenSize(-25);
    }
}


// View Dialog Component
@Component({
    selector: 'app-companyfeed-view-dialog',
    templateUrl: './companyfeed-view-dialog.html',
    styleUrls: ['./companyfeed.component.css']
})
export class CompanyFeedViewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CompanyFeedViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
