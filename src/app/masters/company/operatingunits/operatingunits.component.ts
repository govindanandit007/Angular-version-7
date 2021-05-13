import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    Inject,
    Optional,
    ElementRef,
    HostListener,
    Renderer2,
    AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, Sort } from '@angular/material';
import { OperatingUnitService } from 'src/app/_services/operating-unit.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyComponent } from '../company.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from 'src/app/_services/company.service';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { AddnlFieldDialogComponent } from 'src/app/_shared/AdditionalField/addnl-field-dialog/addnl-field-dialog.component';
import { HttpClient } from '@angular/common/http';

interface NavItem {
    displayName: string;
    disabled?: boolean;
    itemCode?: string;
    children?: NavItem[];
    id?: number;
}
export interface Country {
    value: string;
    viewValue: string;
}
@Component({
    selector: 'app-operatingunits',
    templateUrl: './operatingunits.component.html',
    styleUrls: ['./operatingunits.component.css']
})
export class OperatingunitsComponent
    implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    OperatingUnitForm: FormGroup;
    companyData: string;
    companyTreeChildren: any[] = [];
    showOUName: string;
    isEdit: boolean;
    countryList: any[] = [];
    stateFilterList: any[] = [];
    cityFilterList: any[] = [];
    viewEnabledFlag: boolean;
    ouMessage = '';
    searchEnableFlag = false;
    searchIconValue: any = '';
    refreshSearchLov: any = '';
    currencyList: any[] = [];
    additionalFieldList = [];
    addtnlFieldValueArray = [];
    addtnlFieldValuePositionArray = []; 
    mandatoryFieldIndex = [];

    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    addnlFieldDialogRef: MatDialogRef<AddnlFieldDialogComponent>;
    // ouMessage = 'No operating unit defined.';
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    navItems: NavItem[] = [
        {
            displayName: JSON.parse(localStorage.getItem('userDetails'))
                .companyName,
            children: this.companyTreeChildren
        }
    ];
    showSearch = true;
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/ou-search.json');
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;
 
    displayedColumns: string[] = [
        'ouCode',
        'ouName',
        'ouAddr1',
        'creationDate',
        'ouEnabledFlag',
        'action'
    ];

    columns: any = [
        { field: 'ouCode', name: 'Code', width: 75, baseWidth: 12 },
        { field: 'ouName', name: 'Name', width: 150, baseWidth: 30 },
        { field: 'ouAddr1', name: 'Address', width: 150, baseWidth: 20 },
        {
            field: 'creationDate',
            name: 'Start Date',
            width: 100,
            baseWidth: 13
        },
        { field: 'ouEnabledFlag', name: 'Enabled', width: 100, baseWidth: 13 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 12 }
    ];

    operatingUnitDataSource = new MatTableDataSource([]);
    operatingUnitList = true;
    listProgress = false;
    saveInprogress = false;
    screenMaxHeight: any;
    isExport = false;
    validationMessages = {
        ouCode: {
            required: 'Operating Unit Code is required.'
        },
        ouName: {
            required: 'Operating Unit Name is required.'
        },
        ouOuId: {
            required: 'Company Code is required.'
        },
        ouAddr1: {
            required: 'Address1 is required.' 
        },
        ouCountry: {
            required: 'Country is required.'
        },
        ouStateCounty: {
            required: 'State/County is required.'
        },
        ouCity: {
            required: 'City is required.'
        },
        ouPincode: {
            required: 'Postal Code is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 10 character allowed'
        },
        ouPhone: {
            required: 'Phone Number is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 15 character allowed'
        },
        // ouPersonName: {
        //     required: 'Person Name is required.'
        // },
        ouPersonPhoneNum: {
            // required: 'Phone Number is required.',
            pattern: 'Please Enter Numeric value.',
            maxlength: 'Maximum 15 character allowed'
        },
        ouPersonEmail: {
            // required: 'Email is required.',
            pattern: 'Please enter a valid email address.'
        }
    };

    formErrors = {
        ouCode: '',
        ouName: '',
        ouOuId: '',
        ouAddr1: '',
        ouCountry: '',
        ouStateCounty: '',
        ouCity: '',
        ouPincode: '',
        ouPhone: '',
        // ouPersonName: '',
        ouPersonPhoneNum: '',
        ouPersonEmail: ''
    };
    disableAllBtn: boolean = false;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public commonService: CommonService,
        private dialog: MatDialog,
        private operatingUnitService: OperatingUnitService,
        private companycomponent: CompanyComponent,
        private snackBar: MatSnackBar,
        private companyService: CompanyService,
        private renderer: Renderer2,
        private http: HttpClient
    ) {
        this.operatingUnitFeedForm();
    }
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
  
    openDialog() {
        this.dialog.open(this.myDialog, { disableClose: true });
    }

    ngOnInit() {
        this.isEdit = false;
        this.showSearch = true;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchOperatingUnit();
            this.searhForOU();
        });
        this.getCountryList();
        this.getCurrencyList();
        this.commonService.getScreenSize(-30);
        this.searchIconValue = this.companyService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
        this.getAdditionalFields('OU')
    }

    logValidationErrors(group: FormGroup = this.OperatingUnitForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            } else {
                this.formErrors[key] = '';
                if (
                    (abstractControl &&
                        !abstractControl.valid &&
                        (abstractControl.touched || abstractControl.dirty)) ||
                    (abstractControl &&
                        !abstractControl.valid &&
                        abstractControl.untouched)
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

    // Code for additional field header starts
    getAdditionalFields(code){
        const data = {
            screenId    : null,
            screenCode  : code,
            iuId        : null,
            enabledFlag : 'Y'
        }

        this.commonService
        .getScreenDetails(data)
        .subscribe(
            (data: any) => {
                if (data.status === 200) {
                    if (!data.message) {
                         
                        this.additionalFieldList = data.result;
                        for (const rowData of this.additionalFieldList) {
                            if(rowData.mandatoryFlag === 'Y'){
                                this.mandatoryFieldIndex.push(rowData.addlField.split('addl_field')[1])
                            }
                        }
                    }else{
                        this.additionalFieldList = [];
                    }
                } else {
                    this.openSnackBar(data.message,'','error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message,'','error-snackbar');
            }
        );
    }

    openAddnlFieldDailog(){
        if(this.additionalFieldList.length){
            this.addnlFieldDialogRef= this.dialog.open(
                AddnlFieldDialogComponent,
                {
                    data: {
                        addtnlFieldValueArray : this.addtnlFieldValueArray,
                        addtnlFieldArray      : this.additionalFieldList
                    },
                    width: '65vw',
                    disableClose: true
                }
            );
            this.addnlFieldDialogRef.afterClosed().subscribe(response => {
                 
                this.addtnlFieldValueArray = response.addtnlFieldValueArray;
                this.addtnlFieldValuePositionArray = [];
                for (const rowData of this.addtnlFieldValueArray) {
                    this.addtnlFieldValuePositionArray.push(rowData.position)
                }     
                
            });     
        }else{
            this.openSnackBar('There is not any additional field for this screen','','error-snackbar');
        }
    }
    // Code for additional field header ends

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
    getCurrencyList() {
        this.currencyList = [{ value: '', label: ' Please Select' }];
        this.commonService
            .getLookupLOV('Currency Details')
            .subscribe((data: any) => {
                for (const rowData of data.result) {
                    this.currencyList.push({
                        value: rowData.lookupValue,
                        label: rowData.lookupValueDesc
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

    resetCountryValues(element: any) {
        if (
            this.OperatingUnitForm.value.ouCountry !== '' &&
            this.OperatingUnitForm.value.ouCountry !== element.value
        ) {
            this.OperatingUnitForm.patchValue({
                ouStateCounty: ''
            });
            this.OperatingUnitForm.patchValue({
                ouCity: ''
            });
        }
    }

    searhForOU() {
        this.searchArrayunsubscribe = this.companycomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'operatingunits') {
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
    searchOperatingUnit() {
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
                    this.operatingUnitDataSource = new MatTableDataSource([]);
                    this.operatingUnitDataSource.sort = this.sort;
                    this.operatingUnitDataSource.paginator = this.paginator;

                    this.operatingUnitList = true;
                    if (ouSearchInfo.searchType === 'operatingUnit') {
                        this.listProgress = true;
                        this.operatingUnitService
                            .getOperatingUnitSearch(ouSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            for (const rowData of data.result) {
                                                if (
                                                    rowData.ouEnabledFlag ===
                                                    'N'
                                                ) {
                                                    rowData.ouEnabledFlag = false;
                                                } else {
                                                    rowData.ouEnabledFlag = true;
                                                }
                                            }
                                            this.operatingUnitDataSource = new MatTableDataSource<
                                                any
                                            >(data.result);
                                             // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.operatingUnitDataSource.sort = this.sort;
                                            this.operatingUnitDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                            this.operatingUnitDataSource.paginator = this.paginator;

                                        } else {
                                            this.ouMessage = data.message;
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

    getOperatingUnitDetails(id: number, name: string, type?: string) {
        type === 'view'
            ? this.addOperatingUnit('view')
            : this.addOperatingUnit('add');
        this.isEdit = true;
        this.disableAllBtn = true;
            setTimeout(() => { this.disableAllBtn = false; }, 1000);            
        this.operatingUnitService.getOperatingUnitById(id).subscribe(
            (result: any) => {
                
                if (result.status === 200) {
                    if (type === 'view') {
                        const dataResult = result.result[0];
                        dataResult.ouEnabledFlag =
                            dataResult.ouEnabledFlag === 'Y' ? true : false;
                        dataResult.companyCode = JSON.parse(
                            localStorage.getItem('userDetails')
                        ).companyCode;
                        
                        // tslint:disable-next-line: no-use-before-declare
                        const dialogRef = this.dialog.open(
                            OperatingUnitsViewDialogComponent,
                            {
                                width: '70vw',
                                data: dataResult
                            }
                        );

                        dialogRef.afterClosed().subscribe(response => {
                            console.log('The dialog was closed');
                           
                            if (response !== undefined) {
                                this.getOperatingUnitDetails(response, '');
                            }
                        });
                    } else {
                        
                        this.showOUName = '' + name;
                        if (result.result.length) {
                            const data = result.result[0];
                            this.OperatingUnitForm.patchValue(data);
                            this.OperatingUnitForm.controls.ouEnabledFlag.patchValue(
                                data.ouEnabledFlag === 'Y' ? true : false
                            );
                            this.OperatingUnitForm.patchValue({
                                ouCompanyId: JSON.parse(
                                    localStorage.getItem('userDetails')
                                ).companyCode
                            });

                            // Code for additional field start
                            for( let i = 1; i < 16; i++){
                                if(data['addlField'+i] !== null){
                                    this.addtnlFieldValueArray.push({
                                        fieldName : 'addl_field' + i,
                                        position  : String(i),
                                        value     : data['addlField'+i]
                                    })
                                }
                            }
                            this.addtnlFieldValuePositionArray = [];
                            for (const rowData of this.addtnlFieldValueArray) {
                                this.addtnlFieldValuePositionArray.push(rowData.position)
                            }

                            // Code for additional field end

                        }
                    }
                }
            },
            (error: any) => {
               
                console.log(error.error.message);
            }
        );
         
    }
    getDetailView(id: number) {
        this.operatingUnitService.getOperatingUnitById(id).subscribe(
            (result: any) => {
                if (result.status === 200) {
                    if (result.result.length) {
                        const data = result.result[0];
                        this.OperatingUnitForm.patchValue(data);
                        this.OperatingUnitForm.controls.ouEnabledFlag.patchValue(
                            data.ouEnabledFlag === 'Y' ? true : false
                        );
                        this.OperatingUnitForm.patchValue({
                            ouCompanyId: JSON.parse(
                                localStorage.getItem('userDetails')
                            ).companyCode
                        });
                    }
                }
            },
            (error: any) => {
                console.log(error.error.message);
            }
        );
    }
    public WhitespacesInvalid(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;         
        return isValid ? null : { 'required': true };
      }
    // Form Group
    operatingUnitFeedForm() {
        this.OperatingUnitForm = this.fb.group({
            ouId: [''],
            ouCode: ['',[Validators.required,this.WhitespacesInvalid]],
            ouName: ['', [Validators.required, this.WhitespacesInvalid]],
            ouEnabledFlag: [false],
            currency: [''],
            ouAddr1: ['', [Validators.required,this.WhitespacesInvalid]],
            ouAddr2: [''],
            ouAddr3: [''],
            ouCity: ['', Validators.required],
            ouStateCounty: ['', Validators.required],
            ouCountry: ['', Validators.required],
            ouPincode: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[0-9]*'),
                    Validators.maxLength(10)
                ]
            ],
            ouPhone: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9-+()s]*$'),
                    Validators.maxLength(15)
                ]
            ],
            ouCompanyId: [
                JSON.parse(localStorage.getItem('userDetails')).companyCode,
                Validators.required
            ],
            ouPersonName: [''],
            ouPersonPhoneNum: [
                '',
                [Validators.pattern('^[0-9-+()s]*$'), Validators.maxLength(15)]
            ],
            ouPersonEmail: [
                '',
                [
                    // tslint:disable-next-line: max-line-length
                    Validators.pattern(
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                ]
            ],
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            creationDate: [this.companycomponent.dateFormat(new Date())],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedDate: [this.companycomponent.dateFormat(new Date())]
        });
    }

    get credentials() {
        return this.OperatingUnitForm.controls;
    }

   

    // add operatig Unit form reset
    addOperatingUnit(type: string) {
        this.stateFilterList = [];
        this.cityFilterList = [];
        if (type !== 'view') {
            this.operatingUnitList = !this.operatingUnitList;
            // this.searchComponentToggle.emit(false);
            this.companyService.displaySearchComponent(false);
        }
        this.isEdit = false;
        this.OperatingUnitForm.patchValue({
            ouCompanyId: JSON.parse(localStorage.getItem('userDetails'))
                .companyCode
        });
        if (type === 'add') {
            this.operatingUnitFeedForm();
        } else {
            if (type !== 'view') {
                this.searchOperatingUnit();
                this.searhForOU();
            }
        }
    }

    // form submit function for add and update
    onSubmit() {
        this.saveInprogress = true;
        if (this.OperatingUnitForm.value.ouEnabledFlag === true) {
            this.OperatingUnitForm.value.ouEnabledFlag = 'Y';
        } else {
            this.OperatingUnitForm.value.ouEnabledFlag = 'N';
        }

        this.OperatingUnitForm.value.ouCompanyId = JSON.parse(
            localStorage.getItem('userDetails')
        ).companyId;
        if (this.isEdit) {
            this.OperatingUnitForm.value.updatedDate = this.companycomponent.dateFormat(
                new Date()
            );
            this.OperatingUnitForm.value.updatedBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;
            this.OperatingUnitForm.value.createdBy = null;
            this.OperatingUnitForm.value.creationDate = null;
            if (this.OperatingUnitForm.valid) {
                const data = this.OperatingUnitForm.value;

                // Code for additional field header starts
                for (const rowData of this.mandatoryFieldIndex) {
                    if(!this.addtnlFieldValuePositionArray.includes(rowData)){
                        this.openAddnlFieldDailog();
                        this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                        this.saveInprogress = false;
                        return;
                    }
                }  
                for (const rowData of this.addtnlFieldValueArray) {
                    data['addlField'+ rowData.position] = rowData.value;
                }
                // Code for additional field header ends


                this.operatingUnitService
                    .updateOperatingUnit(
                        this.OperatingUnitForm.value.ouId,
                        data
                    )
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.operatingUnitList = true;
                                this.searchOperatingUnit();
                                this.dataForSearch[
                                    'lovSearchFromAdd_update'
                                ] = true;
                                this.refreshSearchLov = 'refresh';
                                this.searhForOU();

                                 // Code for additional field header starts
                                this.additionalFieldList = [];
                                this.addtnlFieldValueArray = [];
                                this.addtnlFieldValuePositionArray = []; 
                                this.mandatoryFieldIndex = [];
                                this.getAdditionalFields('OU');
                                 // Code for additional field header ends


                                this.saveInprogress = false;
                                this.searchOperatingUnit();
                            }
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
            } else {
                this.openSnackBar('Please enter all required fields', '', 'error-snackbar');
                this.logValidationErrors();
                console.log(this.formErrors);
            }
        } else {
            if (this.OperatingUnitForm.valid) {
                const data = this.OperatingUnitForm.value;

                 // Code for additional field header starts
                for (const rowData of this.mandatoryFieldIndex) {
                    if(!this.addtnlFieldValuePositionArray.includes(rowData)){
                        this.openAddnlFieldDailog();
                        this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                        this.saveInprogress = false;
                        return;
                    }
                }  
                for (const rowData of this.addtnlFieldValueArray) {
                    data['addlField'+ rowData.position] = rowData.value;
                }
                 // Code for additional field header ends


                this.operatingUnitService
                    .createOperatingUnit(data)
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.operatingUnitFeedForm();
                                this.operatingUnitList = true;
                                this.refreshSearchLov = 'refresh';
                                this.dataForSearch[
                                    'lovSearchFromAdd_update'
                                ] = true;
                                this.searhForOU();
                                this.operatingUnitDataSource = new MatTableDataSource(
                                    []
                                );
                                this.operatingUnitDataSource.sort = this.sort;
                                this.operatingUnitDataSource.paginator = this.paginator;

                                 // Code for additional field header starts
                                this.additionalFieldList = [];
                                this.addtnlFieldValueArray = [];
                                this.addtnlFieldValuePositionArray = []; 
                                this.mandatoryFieldIndex = [];
                                this.getAdditionalFields('OU');
                                 // Code for additional field header ends

                            }
                            this.saveInprogress = false;
                            this.searchOperatingUnit();
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
            } else {
                this.openSnackBar('Please enter all required fields', '', 'error-snackbar');
                this.logValidationErrors();
                console.log(this.formErrors);
            }
        }
    }

    // exporterFunc(exporter,type) {
    //    exporter.exportTable(type);
    // }

    openConfirmationDialog(pageName: string, url: any) {
        const confirmationDialogRef = this.dialog.open(
            ConfirmationDialogComponent,
            {
                data: {
                    pageName: pageName,
                    url: url
                },
                width: '30vw'
            }
        );
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (
                response !== undefined &&
                response.url === 'operatingUnitCancel'
            ) {
                this.addOperatingUnit('back');
                // reset table width
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
        this.operatingUnitDataSource.sort = this.sort;        
        this.operatingUnitDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
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
// View Dialog Component
@Component({
    selector: 'app-operatingunits-view-dialog',
    templateUrl: './operatingunits-view-dialog.html'
})
export class OperatingUnitsViewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<OperatingUnitsViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
