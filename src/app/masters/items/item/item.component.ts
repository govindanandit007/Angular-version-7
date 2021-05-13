import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewChild,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    HostListener
} from '@angular/core';

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatDialog,
    MatSnackBar,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatSort,
    Sort
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { ItemsComponent } from '../items.component';
import { ItemsService } from 'src/app/_services/items.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { debug } from 'console';
import { HttpClient } from '@angular/common/http';

export interface ParameterDataElement {
    itemId: number;
    serialNumber?: number;
    itemName: string;
    itemDescription: string;
    itemImage: string;
    itemPrimaryUom: string;
    ctgryName1: string;
    itemSecondaryUom: string;
    itemCategoryId: number;
    itemEnabledFlag: string;
    itemBarcode: string;
    itemRevisionNum: number;
    itemRevisionFlag: boolean;
    itemShelfLifeDays: number;
    itemShelflifeCntrldFlag: boolean;
    itemLength: number;
    itemWidth: number;
    itemHeight: number;
    itemLotPrefix: string;
    itemLotLength: number;
    itemLotStartingNum: string;
    itemLotEnabledFlag: boolean;
    itemSerialPrefix: string;
    itemSerialLength: number;
    itemSerialStartingNum: string;
    itemSerialCntrldFlag: boolean;
    createdBy: number;
    updatedBy: number;
    action: string;
}

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy, AfterViewInit {
    tooltipPosition: TooltipPosition[] = ['below'];
    showItemList = true;
    isEdit = false;
 
    listProgress = false;
    itemForm: FormGroup;
    itemListMessage = '';
    // itemListMessage = 'No Item defined.';
    showSearch = true;
    public userImagePath;
    public messageUserLogo: string;
    itemImgURL: any;
    itemUomList =[];
    _3plCustomerList = [];
    secondaryUomList = [];
    weightUomList = [];
    volumeUomList = [];
    containerTypeList = [];
    disablePrimaryUom = '';
    disableSecondaryUom = null;
    searchEnableFlag = false;
    searchIconValue: any = '';
    batchstartLength: any = '';
    serialstartLength: any = '';
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;
    isImageSelected: boolean;
    disableSecUom : boolean = false;
    is3plCompany: any = [];
    customerPlaceHolder: any = 'Customer';
    customerLabel:any = '';
    editItemWithNoTransaction:any = '';
    customerFlag: boolean = false;
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;

    showItemName = '';
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/item-search.json');
    parameterDisplayedColumns: string[] = [
        'itemId',
        'itemName',
        'itemDescription',
        'itemPrimaryUom',
        'itemSecondaryUom',
        'itemRevisionNum',
        'ctgryName1',
        'itemEnabledFlag',
        'action'
    ];
    columns: any = [
        { field: 'itemId', name: '#', width: 75, baseWidth: 6 },
        { field: 'itemName', name: 'Item Name', width: 150, baseWidth: 12 },
        {
            field: 'itemDescription',
            name: 'Description',
            width: 150,
            baseWidth: 18
        },
        {
            field: 'itemPrimaryUom',
            name: 'Primary UOM',
            width: 100,
            baseWidth: 11
        },
        {
            field: 'itemSecondaryUom',
            name: 'Secondary UOM',
            width: 100,
            baseWidth: 11
        },
        {
            field: 'itemRevisionNum',
            name: 'Revision #',
            width: 100,
            baseWidth: 12
        },
        {
            field: 'ctgryName1',
            name: 'Category Name',
            width: 100,
            baseWidth: 12
        },
        {
            field: 'itemEnabledFlag',
            name: 'Enable Flag',
            width: 100,
            baseWidth: 10
        },
        { field: 'action', name: 'Action', width: 75, baseWidth:8}
    ];
    parameterData: ParameterDataElement[] = [];
    itemDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    itemCategories = [];
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;


    validationMessages = {
        itemName: {
            required: 'Item name is required.'
        },
        itemDescription: {
            required: 'Item description is required.'
        },
        itemPrimaryUom: {
            required: 'Item Primary Uom is required.'
        },
        itemCategoryId: {
            required: 'Category Name is required.'
        },
        itemRevisionNum: {
            required: 'Item Revision Number is required.',
            min: 'Please Enter minimum value of 1'
        },
        itemShelfLifeDays: {
            required: 'Shelf life days is required.',
            min: 'Please Enter minimum value of 1'
        },
        itemLotPrefix: {
            required: 'Batch prefix is required'
        },
        itemLotLength: {
            required: '',
            min: '',
            pattern: 'Please Enter values in number only'
        },
        itemLotStartingNum: {
            required: 'Batch starting number is required'
        },
        itemSerialPrefix: {
            required: 'Serial prefix is required'
        },
        itemSerialLength: {
            required: 'Serial length is required',
            min: 'Please Enter minimum value of 1',
            pattern: 'Please Enter values in number only'
        },
        itemSerialStartingNum: {
            required: 'Serial starting number is required'
        },
        itemNetWt: {
            required: 'Net weight is required'
        },
        itemGrossWt: {
            required: 'Gross weight is required'
        },
        itemVolume: {
            required: 'Volume is required'
        },
        itemContainerType: {
            required: 'Container type is required'
        },
        itemContainerMaxLoad: {
            required: 'Container load weight is required'
        },
        itemContainerMaxVolume: {
            required: 'Container volume is required'
        },
        itemContainerFillPercent: {
            required: 'Container fill % is required'
        },
        itemVolumeUom: {
            required: 'Item Volume Uom is required'
        },
        itemCustomerId: {
            required: 'Customer is required'
        }
    };

    formErrors = {
        itemName: '',
        itemDescription: '',
        itemPrimaryUom: '',
        itemCategoryId: '',
        itemRevisionNum: '',
        itemShelfLifeDays: '',
        itemLotPrefix: '',
        itemLotLength: '',
        itemLotStartingNum: '',
        itemSerialPrefix: '',
        itemSerialLength: '',
        itemSerialStartingNum: '',
        itemNetWt: '',
        itemGrossWt: '',
        itemVolume: '',
        itemContainerType: '',
        itemContainerMaxLoad: '',
        itemContainerMaxVolume: '',
        itemContainerFillPercent: '',
        itemVolumeUom: '',
        itemCustomerId: ''
    };
    disableAllBtn: boolean = false;
    

    constructor(
        private fb: FormBuilder,
        public commonService: CommonService,
        private itemscomponent: ItemsComponent,
        private router: Router,
        private dialog: MatDialog,
        private itemsService: ItemsService,
        private snackBar: MatSnackBar,
        private http: HttpClient
    ) {
        this.itemFormGroup();
    }

    ngOnInit() {
        this.itemImgURL = '';
        this.isImageSelected = false;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searhForItem();
            this.searchItems();
        });
        this.getCategoryLOV();
        this.getUomLOV();
        this.getWeightUomLov();
        this.getVolumeUomLov();
        this.getContainerTypeLov();
        this.is3plCompany = JSON.parse(localStorage.getItem('userDetails')).activityBillingFlag === 'Y' ? true : false;
        if(this.is3plCompany){
            this.get3PLCustomerList();
        }
        this.commonService.getScreenSize(-35);
        this.searchIconValue = this.itemsService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
        const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
        if(graphSearchData !== null){
            this.search(graphSearchData);
            localStorage.removeItem('graphSearchData');
        }
    }

    logValidationErrors(group: FormGroup = this.itemForm): void {
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

    lengthValidation(event: any): void {
        if (event.currentTarget.id === 'batchLength') {
            const batchlengthInput =
                this.itemForm.value.itemLotPrefix.length + 1;
            this.batchstartLength =
                20 - this.itemForm.value.itemLotPrefix.length;
            if (this.itemForm.value.itemLotLength < batchlengthInput) {
                this.itemForm.patchValue({ itemLotLength: '' });
                this.formErrors.itemLotLength =
                    'Please enter minimum value of ' + batchlengthInput;
            }
            if (this.itemForm.value.itemLotLength > 20) {
                this.itemForm.patchValue({ itemLotLength: '' });
                this.formErrors.itemLotLength =
                    'Please enter in between ' + batchlengthInput + ' to 20';
            }
        } else {
            const seriallengthInput =
                this.itemForm.value.itemSerialPrefix.length + 1;
            this.serialstartLength =
                20 - this.itemForm.value.itemSerialPrefix.length;
            if (this.itemForm.value.itemSerialLength < seriallengthInput) {
                this.itemForm.patchValue({ itemSerialLength: '' });
                this.formErrors.itemSerialLength =
                    'Please enter minimum value of ' + seriallengthInput;
            }
             if (this.itemForm.value.itemSerialLength > 20) {
                 this.itemForm.patchValue({ itemSerialLength: '' });
                 this.formErrors.itemSerialLength =
                     'Please enter in between ' + seriallengthInput + ' to 20';
             }
        }
    }

    itemFormGroup() {
        this.itemForm = this.fb.group({
            itemId: [null],
            itemName: ['', Validators.required],
            itemDescription: ['', Validators.required],
            itemImage: [''],
            itemPrimaryUom: ['', Validators.required],
            itemPrimaryUomDesc: [{ value: '', disabled: true }],
            itemSecondaryUomDesc: [{ value: '', disabled: true }],
            itemSecondaryUom: [''],
            itemCategoryId: ['', Validators.required],
            itemEnabledFlag: [true],
            itemBarcode: [''],
            itemRevisionNum: [{ value: '', disabled: true }],
            itemRevisionFlag: [false],
            itemShelfLifeDays: [
                { value: null, disabled: true },
                [Validators.min(1)]
            ],
            itemShelflifeCntrldFlag: [false],
            itemLength: [null],
            itemWidth: [null],
            itemHeight: [null],
            itemLotPrefix: [{ value: '', disabled: true }],
            itemLotLength: [
                { value: null, disabled: true },
                [Validators.min(5)]
            ],
            itemLotStartingNum: [{ value: '', disabled: true }],
            itemLotEnabledFlag: [false],
            itemSerialPrefix: [{ value: '', disabled: true }],
            itemSerialLength: [
                { value: null, disabled: true },
                [Validators.pattern('^[0-9]*$')]
            ],
            itemSerialStartingNum: [{ value: '', disabled: true }],
            itemSerialCntrldFlag: [false],
            itemWeightUom: [''],
            itemVolumeUom: [''],
            itemNetWt: [''],
            itemGrossWt: [''],
            itemVolume: [''],
            itemCustomerId: [''],
            itemContainerFlag: [false],
            itemContainerType: [{ value: '', disabled: true }],
            itemContainerTypeDesc: [{ value: '', disabled: true }],
            itemContainerMaxLoad: [{ value: '', disabled: true }],
            itemContainerMaxVolume: [{ value: '', disabled: true }],
            itemContainerFillPercent: [{ value: '', disabled: true }],
            
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId]
        });

        if(this.is3plCompany && this.isEdit){
            // this.itemForm.controls.itemCustomerId.disable();
        }
       
    }

    getCategoryLOV() {
        this.commonService.getCategoryLOV().subscribe((data: any) => {
            this.itemCategories = [];
            this.itemCategories = data.result;
        });
    }

    setCUstomerLabel(event:any, customerLabel:any){
        if (event.source.selected && event.isUserInput === true) {  
            this.customerLabel = customerLabel;
        }
    }

    getUomLOV() {
        this.commonService.getUOMLOV().subscribe((data: any) => {
            this.itemUomList = data.result;
            this.secondaryUomList = [{baseUnitOfMeasure: "",
                baseUomCode: "",
                baseUomId: null,
                unitOfMeasure: "Please Select",
                uomClass: "",
                uomCode: "0",
                uomEnabledFlag: "",
                uomId: null}];
            for(let i in data.result){
            this.secondaryUomList.push(data.result[i]);
            }
           
            //this.secondaryUomList = data.result;
        });
    }

    get3PLCustomerList() {
        this._3plCustomerList = [];
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

    getWeightUomLov() {
        this.weightUomList = [{
              uomCode   : '',
              unitOfMeasure : ' Please Select'
            }];
        this.itemsService.getWeightUomLov().subscribe(
            (data: any) => {
                if (!data.message && data.result && data.result.length) {
                    for (const rowData of data.result) {
                            this.weightUomList.push({
                                uomCode: rowData.uomCode,
                                unitOfMeasure: rowData.unitOfMeasure
                            });
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    getVolumeUomLov() {
        this.volumeUomList = [{
              uomCode   : '',
              unitOfMeasure : ' Please Select'
            }];
        this.itemsService.getVolumeUomLov().subscribe(
            (data: any) => {
                if (!data.message && data.result && data.result.length) {
                    for (const rowData of data.result) {
                            this.volumeUomList.push({
                                uomCode: rowData.uomCode,
                                unitOfMeasure: rowData.unitOfMeasure
                            });
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    getContainerTypeLov() {
        this.containerTypeList = [];
        this.itemsService.getContainerTypeLov().subscribe(
            (data: any) => {

                if (!data.message && data.result && data.result.length) {
                    for (const rowData of data.result) {
                            this.containerTypeList.push({
                                value: rowData.lookupValue,
                                label: rowData.lookupValueDesc
                            });
                    }
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }
    
    searchItems() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (itemSearchInfo: any) => {
                // This code is used for not loading the search result when module loads
                if (itemSearchInfo.fromSearchBtnClick === true) {
                
                    this.parameterData = [];
                    this.itemDataSource = new MatTableDataSource([]);
                    this.itemDataSource.sort = this.sort;
                    this.showItemList = true;
                    if (itemSearchInfo.searchType === 'item') {
                        this.search(itemSearchInfo.searchArray);
                    }
                } else {
                    return;
                }
            }
        );
    }

    searhForItem() {
        this.searchArrayunsubscribe = this.itemscomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'items') {
                    this.commonService.searhForMasters(this.dataForSearch);
                    this.itemsService.displaySearchComponent(this.showSearch);
                }
            }
        );
    }

    search(data){
        this.listProgress = true;
                        this.itemsService
                            .getItemSearch(data)
                            .subscribe(
                                (data: any) => {
                                this.customTable.nativeElement.scrollLeft = 0;
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];
                                            let count = 1;
                                            for (const rowData of data.result) {
                                                rowData.serialNumber = count++;
                                                if (
                                                    rowData.itemEnabledFlag ===
                                                    'N'
                                                ) {
                                                    rowData.itemEnabledFlag = false;
                                                } else {
                                                    rowData.itemEnabledFlag = true;
                                                }
                                                if (
                                                    rowData.itemRevisionFlag ===
                                                    'Y'
                                                ) {
                                                    rowData.itemRevisionFlag = true;
                                                } else {
                                                    rowData.itemRevisionFlag = false;
                                                }
                                                if (
                                                    rowData.itemShelflifeCntrldFlag ===
                                                    'Y'
                                                ) {
                                                    rowData.itemShelflifeCntrldFlag = true;
                                                } else {
                                                    rowData.itemShelflifeCntrldFlag = false;
                                                }
                                                if (
                                                    rowData.itemLotEnabledFlag ===
                                                    'Y'
                                                ) {
                                                    rowData.itemLotEnabledFlag = true;
                                                } else {
                                                    rowData.itemLotEnabledFlag = false;
                                                }
                                                if (
                                                    rowData.itemSerialCntrldFlag ===
                                                    'Y'
                                                ) {
                                                    rowData.itemSerialCntrldFlag = true;
                                                } else {
                                                    rowData.itemSerialCntrldFlag = false;
                                                }
                                                if (
                                                    rowData.itemContainerFlag ===
                                                    'Y'
                                                ) {
                                                    rowData.itemContainerFlag = true;
                                                } else {
                                                    rowData.itemContainerFlag = false;
                                                }
                                                rowData.action = '';
                                                this.parameterData.push(
                                                    rowData
                                                );
                                            }
                                            this.itemDataSource = new MatTableDataSource<
                                                ParameterDataElement
                                            >(this.parameterData);
                                            this.itemDataSource.paginator = this.paginator;
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.itemDataSource.sort = this.sort;
                                        } else {
                                            this.itemListMessage = data.message;
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

    searchComponentOpen() {
        this.itemsService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }
    addItem(type: string, element?: any) {
        this.isEdit = false;
        if (type === 'view') {
            this.disableAllBtn = true;
            setTimeout(() => { this.disableAllBtn = false; }, 1000);
            
          this.itemsService.getItemDetails(element.itemId).subscribe((data:any) => {
            if(data.status === 200){
              const dataResult = data.result;
              dataResult[0].showEdit = element.itemWithNoTransaction;
              const dialogRef = this.dialog.open(ItemViewDialogComponent, {
                width: '85vw',
                data: dataResult,
                
              });

              dialogRef.afterClosed().subscribe(response => {
                 
                if (response !== undefined) {
                    this.addItem('edit', response);
                }
              });
            }else{
               
            }
          });
        
        } else if (type === 'add') {
            this.itemImgURL = '';
            this.isImageSelected = false;
            this.showItemList = !this.showItemList;
            // this.searchComponentToggle.emit(false);
            this.itemsService.displaySearchComponent(false);
            this.itemFormGroup();
        } else if (type === 'edit') {
            
            this.isEdit = true;
            
            this.showItemName = 'Edit Item: ' + element.itemName;
            this.showItemList = !this.showItemList;
            // this.searchComponentToggle.emit(false);
            this.itemsService.displaySearchComponent(false);

            this.itemsService.getItemDetails(element.itemId).subscribe((data:any) => {
              if(data.status === 200){
                const dataResult = data.result[0];
                this.editItemWithNoTransaction = dataResult.itemWithNoTransaction;
                dataResult.itemGrossWt = dataResult.itemGrossWt !== 0 ? dataResult.itemGrossWt : null;
                dataResult.itemNetWt = dataResult.itemNetWt !== 0 ? dataResult.itemNetWt : null;
                dataResult.itemVolume = dataResult.itemVolume !== 0 ? dataResult.itemVolume : null;
                dataResult.itemContainerFlag       = dataResult.itemContainerFlag === 'Y' ? true : false;
                dataResult.itemEnabledFlag         = dataResult.itemEnabledFlag === 'Y' ? true : false;
                dataResult.itemLotEnabledFlag      = dataResult.itemLotEnabledFlag === 'Y' ? true : false;
                dataResult.itemRevisionFlag        = dataResult.itemRevisionFlag === 'Y' ? true : false;
                dataResult.itemSerialCntrldFlag    = dataResult.itemSerialCntrldFlag === 'Y' ? true : false;
                dataResult.itemShelflifeCntrldFlag = dataResult.itemShelflifeCntrldFlag === 'Y' ? true : false;

                if(!dataResult.itemSerialCntrldFlag){
                    dataResult.itemSerialPrefix = "";
                    dataResult.itemSerialLength = "";
                    dataResult.itemSerialStartingNum = "";
                }
                if(!dataResult.itemLotEnabledFlag){
                    dataResult.itemLotPrefix = "";
                    dataResult.itemLotLength = "";
                    dataResult.itemLotStartingNum = "";
                }
                if(dataResult.itemRevisionFlag){
                    this.itemForm.controls.itemRevisionNum.enable();
                }
                if(dataResult.itemShelflifeCntrldFlag){
                    this.itemForm.controls.itemShelfLifeDays.enable();
                }
               // dataResult.itemWithNoTransaction = dataResult.itemWithNoTransaction === 'Y' ? true : false;
               
                this.itemForm.patchValue(dataResult);
                this.checkLotFlag();
                this.checkShelflifeCntrldFlag();
                
                if (dataResult.userImage !== null) {
                  const userImgString = dataResult.itemImage ? dataResult.itemImage.value : '';
                  this.itemImgURL = userImgString.slice(1, -1);
                  if (this.itemImgURL === '') {
                      this.isImageSelected = false;
                  } else {
                      this.isImageSelected = true;
                  }
                  this.itemForm.patchValue({ itemImage: this.itemImgURL });
                }
                 
              }
            });
        
        } else {
            this.showItemList = !this.showItemList;
            this.itemsService.displaySearchComponent(true);
        }
    }

    // disable all necessory form fields
    disableFormFields() {
        this.itemForm.disable();
        this.itemForm.controls.itemDescription.enable();
        this.itemForm.controls.itemEnabledFlag.enable();
        this.itemForm.controls.itemSecondaryUom.enable();
        this.itemForm.controls.itemBarcode.enable();
        this.itemForm.controls.itemPrimaryUom.enable();
    }

    preview(files: any, fromId: string) {
        if (files.length === 0) {
            return;
        }
        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.messageUserLogo = 'Only images are supported.';
            return;
        }

        const fileSize = files[0].size / 1024; // in MB
        if (fileSize > 256) {
            this.messageUserLogo = 'Item Image size exceeds 256 KB.';
            return;
        }
        this.messageUserLogo = '';
        const reader = new FileReader();
        this.userImagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = event => {
            this.isImageSelected = true;
            this.itemImgURL = reader.result;
        };
    }

    // Resetting image file
    changeImage() {
        this.itemImgURL = '';
        this.isImageSelected = false;
    }

    // form submit function for add and update
    onSubmit() {
        
        if (this.itemForm.valid) {
           
            if (this.itemForm.value.itemPrimaryUom ===
                this.itemForm.value.itemSecondaryUom) {
                this.openSnackBar('Primary UOM and secondary UOM cannot be same','','default-snackbar');
                return;
            }
            this.itemForm.patchValue({ itemImage: this.itemImgURL });

            const obj= Object.assign({}, this.itemForm.value);

            obj.itemCustomerId =  obj.itemCustomerId === '' ? null : obj.itemCustomerId;

            if(this.is3plCompany && obj.itemCustomerId === null && !this.customerFlag){
                if(this.isEdit){
                    this.openConfirmationDialog('3PLEDIT','item');
                }else{
                    this.openConfirmationDialog('3PLADD','item');
                }
                return;
            }
            

            obj.itemLotLength =  obj.itemLotLength !== null ? Number(obj.itemLotLength) : null;

            obj.itemSerialLength =  obj.itemSerialLength !== null ? Number(obj.itemSerialLength) : null;

            obj.itemLength =  obj.itemLength !== null ? Number(obj.itemLength) : null;

            obj.itemWidth =  obj.itemWidth !== null ? Number(obj.itemWidth) : null;

            obj.itemHeight =  obj.itemHeight !== null ? Number(obj.itemHeight) : null;

            obj.itemContainerFillPercent =  obj.itemContainerFillPercent !== null ? Number(obj.itemContainerFillPercent) : null;

            obj.itemContainerMaxLoad =  obj.itemContainerMaxLoad !== null ? Number(obj.itemContainerMaxLoad) : null;

            obj.itemContainerMaxVolume =  obj.itemContainerMaxVolume !== null ? Number(obj.itemContainerMaxVolume) : null;

            obj.itemGrossWt =  obj.itemGrossWt !== null ? Number(obj.itemGrossWt) : null;

            obj.itemNetWt =  obj.itemNetWt !== null ? Number(obj.itemNetWt) : null;

            obj.itemVolume =  obj.itemVolume !== null ? Number(obj.itemVolume) : null;

            // obj.itemRevisionNum =  obj.itemRevisionNum !== null ? Number(obj.itemRevisionNum) : null;

            obj.itemEnabledFlag = obj.itemEnabledFlag === true ? 'Y' :'N';

            obj.itemRevisionFlag = obj.itemRevisionFlag === true ? 'Y' :'N';
         
            obj.itemShelflifeCntrldFlag = obj.itemShelflifeCntrldFlag === true ? 'Y' :'N';
           
            obj.itemLotEnabledFlag = obj.itemLotEnabledFlag === true ? 'Y' :'N';
           
            obj.itemSerialCntrldFlag = obj.itemSerialCntrldFlag === true ? 'Y' :'N';
           
            obj.itemContainerFlag = obj.itemContainerFlag === true ? 'Y' :'N';

            if( obj.itemVolumeUom && !obj.itemVolume && !obj.itemContainerMaxVolume){
                    this.openSnackBar('Please select the item volume or item container max volume','','default-snackbar');
                    return;
            }
            this.customerFlag = false;
            if (this.isEdit) {
                this.itemsService
                    .updateItem(obj.itemId, obj)
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                this.openSnackBar(data.message,'','success-snackbar');
                                this.itemFormGroup();
                                this.showItemList = true;
                                this.searchComponentOpen();
                                this.searchItems();
                                this.itemDataSource = new MatTableDataSource<ParameterDataElement>([]);
                            
                                setTimeout(() => {   
                                    this.itemDataSource.paginator = this.paginator;
                                    this.itemDataSource.sort = this.sort;
                                    this.commonService.setTableResize(
                                        this.matTableRef.nativeElement.clientWidth,
                                        this.columns
                                    );
                                }, 500);
                            }
                        },
                        (error: any) => {
                            this.openSnackBar(error.error.message,'','error-snackbar');
                        }
                         
                       
                    );
                    setTimeout(() => {
                        this.setPaginator();
                        this.commonService.setTableResize(
                            this.matTableRef.nativeElement.clientWidth,
                            this.columns
                        );
                    }, 500);
            } else {
                this.itemsService.createItem(obj).subscribe(
                    data => {
                        if (data.status === 200) {
                            this.openSnackBar(
                                data.message,
                                '',
                                'success-snackbar'
                            );
                            this.itemFormGroup();
                            this.showItemList = true;
                            //   this.searchComponentOpen();
                            // this.searchItems();
                            this.searhForItem();
                            this.itemDataSource = new MatTableDataSource<
                                ParameterDataElement
                            >([]);
                            this.itemDataSource.paginator = this.paginator;
                            this.itemDataSource.sort = this.sort;
                        }
                    },
                    (error: any) => {
                        this.openSnackBar(
                            error.error.message,
                            '',
                            'error-snackbar'
                        );
                    }
                );
            }
        } else {
            this.openSnackBar('Please enter all required fields', '', 'default-snackbar');
        }

    
    }

    uomSelectionChanged(event: any, value: string, type: string) {

        if (event.source.selected && event.isUserInput === true) {
            if (type === 'primary') {
                // disable primary uom value
                this.disableSecondaryUom = value;
            } else {
                // disable secondary uom value
                this.disablePrimaryUom = value;
            }
        }
    }

    showMsg(){
        // if(this.disableSceondaryUom === true){
        //     this.openSnackBar(
        //         'Please uncheck the serial',
        //         '',
        //         'default-snackbar'
        //     );
        // }
    }

    checkItemRevisionFlag() {
        if (this.itemForm.controls.itemRevisionFlag.value) {
            this.itemForm.patchValue({ itemRevisionNum: '' });
            this.itemForm.controls.itemRevisionNum.enable();
            this.itemForm.controls.itemRevisionNum.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemRevisionNum.updateValueAndValidity();
        } else {
            this.itemForm.patchValue({ itemRevisionNum: '' });
            this.itemForm.controls.itemRevisionNum.disable();
            this.itemForm.controls.itemRevisionNum.setValidators(null);
            this.itemForm.controls.itemRevisionNum.updateValueAndValidity();
        }
    }

    checkShelflifeCntrldFlag() {
        if (this.itemForm.controls.itemShelflifeCntrldFlag.value) {
            this.itemForm.patchValue({ itemShelfLifeDays: 1 });
            this.itemForm.controls.itemShelfLifeDays.enable();
            this.itemForm.controls.itemShelfLifeDays.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemShelfLifeDays.updateValueAndValidity();
        } else {
            this.itemForm.patchValue({ itemShelfLifeDays: null });
            this.itemForm.controls.itemShelfLifeDays.disable();
            this.itemForm.controls.itemShelfLifeDays.setValidators(null);
            this.itemForm.controls.itemShelfLifeDays.updateValueAndValidity();
        }
    }

    checkContainerFlag() {
        if (this.itemForm.controls.itemContainerFlag.value) {

            this.itemForm.controls.itemContainerType.enable();
            this.itemForm.controls.itemContainerType.setValidators([Validators.required]);
            this.itemForm.controls.itemContainerType.updateValueAndValidity();

            this.itemForm.controls.itemContainerMaxLoad.enable();
            this.itemForm.controls.itemContainerMaxLoad.setValidators([Validators.required]);
            this.itemForm.controls.itemContainerMaxLoad.updateValueAndValidity();

            this.itemForm.controls.itemContainerMaxVolume.enable();
            this.itemForm.controls.itemContainerMaxVolume.setValidators([Validators.required]);
            this.itemForm.controls.itemContainerMaxVolume.updateValueAndValidity();

            this.itemForm.controls.itemContainerFillPercent.enable();
            this.itemForm.controls.itemContainerFillPercent.setValidators([Validators.required]);
            this.itemForm.controls.itemContainerFillPercent.updateValueAndValidity();
        } else {
            this.itemForm.controls.itemContainerType.setValue('');
            this.itemForm.controls.itemContainerType.disable();
            this.itemForm.controls.itemContainerType.setValidators(null);
            this.itemForm.controls.itemContainerType.updateValueAndValidity();

            this.itemForm.controls.itemContainerMaxLoad.setValue('');
            this.itemForm.controls.itemContainerMaxLoad.disable();
            this.itemForm.controls.itemContainerMaxLoad.setValidators(null);
            this.itemForm.controls.itemContainerMaxLoad.updateValueAndValidity();

            this.itemForm.controls.itemContainerMaxVolume.setValue('');
            this.itemForm.controls.itemContainerMaxVolume.disable();
            this.itemForm.controls.itemContainerMaxVolume.setValidators(null);
            this.itemForm.controls.itemContainerMaxVolume.updateValueAndValidity();

            this.itemForm.controls.itemContainerFillPercent.setValue('');
            this.itemForm.controls.itemContainerFillPercent.disable();
            this.itemForm.controls.itemContainerFillPercent.setValidators(null);
            this.itemForm.controls.itemContainerFillPercent.updateValueAndValidity();
        }
    }

    checkLotFlag() {
        if (this.itemForm.controls.itemLotEnabledFlag.value) {
            this.itemForm.controls.itemLotPrefix.enable();
            this.itemForm.controls.itemLotPrefix.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemLotPrefix.updateValueAndValidity();

            this.itemForm.controls.itemLotLength.enable();
            this.itemForm.controls.itemLotLength.setValidators([
                Validators.required,
                Validators.pattern('^[0-9]*$')
            ]);
            this.itemForm.controls.itemLotLength.updateValueAndValidity();

            this.itemForm.controls.itemLotStartingNum.enable();
            this.itemForm.controls.itemLotStartingNum.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemLotStartingNum.updateValueAndValidity();
        } else {
            this.itemForm.controls.itemLotPrefix.disable();
            this.itemForm.controls.itemLotPrefix.setValidators(null);
            this.itemForm.controls.itemLotPrefix.updateValueAndValidity();

            this.itemForm.controls.itemLotLength.disable();
            this.itemForm.controls.itemLotLength.setValidators(null);
            this.itemForm.controls.itemLotLength.updateValueAndValidity();

            this.itemForm.controls.itemLotStartingNum.disable();
            this.itemForm.controls.itemLotStartingNum.setValidators(null);
            this.itemForm.controls.itemLotStartingNum.updateValueAndValidity();

            this.itemForm.patchValue({ itemLotPrefix: '' });
            this.itemForm.patchValue({ itemLotLength: '' });
            this.itemForm.patchValue({ itemLotStartingNum: '' });

            this.itemForm.patchValue({ itemShelfLifeDays: null });
            this.itemForm.controls.itemShelfLifeDays.setValidators(null);
            this.itemForm.controls.itemShelfLifeDays.updateValueAndValidity();
            this.itemForm.patchValue({ itemShelflifeCntrldFlag: false });
        }
    }
    checkSerialFlag() {
        if (this.itemForm.controls.itemSerialCntrldFlag.value) {
            
            if(this.itemForm.value.itemSecondaryUom === null || this.itemForm.value.itemSecondaryUom === '') {
                this.itemForm.value.itemSecondaryUom  = "0";
            }
            // if(this.itemForm.value.itemSecondaryUom !== "0"){
            //     this.openSnackBar(
            //         'Serial cant be checked when secondary UOM is selected',
            //         '',
            //         'default-snackbar'
            //     );
            //     this.itemForm.patchValue({ itemSerialCntrldFlag: false });
            //     this.itemForm.get('itemSecondaryUom').setValidators([Validators.required]);
            //     this.itemForm.get('itemSecondaryUom').updateValueAndValidity();
            //     return;
            // }else{
            //     this.itemForm.patchValue({ itemSecondaryUom: '' });
            //     this.itemForm.get('itemSecondaryUom').clearValidators();
            //     this.itemForm.get('itemSecondaryUom').updateValueAndValidity();
            //     this.disableSecUom = true;
            //     this.openSnackBar(
            //         'Secondary UOM is disabled now.',
            //         '',
            //         'default-snackbar'
            //     );
            // }
            this.itemForm.controls.itemSerialPrefix.enable();
            this.itemForm.controls.itemSerialPrefix.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemSerialPrefix.updateValueAndValidity();

            this.itemForm.controls.itemSerialLength.enable();
            this.itemForm.controls.itemSerialLength.setValidators([
                Validators.required,
                Validators.pattern('^[0-9]*$')
            ]);
            this.itemForm.controls.itemSerialLength.updateValueAndValidity();

            this.itemForm.controls.itemSerialStartingNum.enable();
            this.itemForm.controls.itemSerialStartingNum.setValidators([
                Validators.required
            ]);
            this.itemForm.controls.itemSerialStartingNum.updateValueAndValidity();
        } else {
            this.disableSecUom = false;
            
            this.itemForm.controls.itemSerialPrefix.disable();
            this.itemForm.controls.itemSerialPrefix.setValidators(null);
            this.itemForm.controls.itemSerialPrefix.updateValueAndValidity();

            
            this.itemForm.controls.itemSerialLength.disable();
            this.itemForm.controls.itemSerialLength.setValidators(null);
            this.itemForm.controls.itemSerialLength.updateValueAndValidity();

            
            this.itemForm.controls.itemSerialStartingNum.disable();
            this.itemForm.controls.itemSerialStartingNum.setValidators(null);
            this.itemForm.controls.itemSerialStartingNum.updateValueAndValidity();

            this.itemForm.patchValue({ itemSerialPrefix: '' });
            this.itemForm.patchValue({ itemSerialLength: '' });
            this.itemForm.patchValue({ itemSerialStartingNum: '' });
        }
    }

    openConfirmationDialog(pageName: string, url: any) {
        let customerAdd = 'Y'
        const confirmationDialogRef = this.dialog.open(
            ConfirmationDialogComponent,
            { data: { pageName, url , customerAdd}, width: '30vw' }
        );
        confirmationDialogRef.afterClosed().subscribe(response => {
            console.log('response'+ response);
            if (response !== undefined && response.url === 'itemCancel') {
                if(response.customerAdd === 'N'){
                    this.customerFlag = true;
                    this.onSubmit();
                }else{
                    this.customerFlag = false;
                    this.addItem('back');
                    setTimeout(() => {
                        this.setPaginator();
                        this.commonService.setTableResize(
                            this.matTableRef.nativeElement.clientWidth,
                            this.columns
                        );
                    }, 500);
                }
                
            }
        });
    }

    setPaginator() {
        this.itemDataSource.paginator = this.paginator;
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
        // this.commonService.searhForMasters([this.dataForSearch]);
        this.searchIconValue ? this.searchIconValue.unsubscribe() : '';

        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.itemImgURL = '';        
        setTimeout(() => {
            this.itemDataSource.sort = this.sort;
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   


    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(-35);
    }
}

@Component({
    selector: 'app-item-view-dialog',
    templateUrl: './item-view-dialog.html',
    styleUrls: ['./item.component.css']
})
export class ItemViewDialogComponent {
    userRoleViewdColumns: string[] = [
        'userRoleId',
        'userRoleName',
        'userRoleStartDate',
        'userRoleEndDate',
        'userRoleEnabledFlag'
    ];
    resultData = [];
    parameterDataSource = new MatTableDataSource<any>(this.resultData);
    itemImgURL = '';
    itemRevFlag = false;
    itemShelfFlag = false;
    itemLotEnabledFlag = false;
    itemSerialEnabledFlag = false;
    itemWithNoTransaction = false;
    itemContainerFlag = false;
    showItemDetails: boolean;

    constructor(
        public dialogRef: MatDialogRef<ItemViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {

      this.showItemDetails = true;
         this.itemRevFlag  = data[0].itemRevisionFlag === 'Y' ? true : false;
         this.itemShelfFlag  = data[0].itemShelflifeCntrldFlag === 'Y' ? true : false;
         this.itemWithNoTransaction = data[0].showEdit === 'Y' ? true : false;
         this.itemLotEnabledFlag  = data[0].itemLotEnabledFlag === 'Y' ? true : false;
         this.itemSerialEnabledFlag  = data[0].itemSerialCntrldFlag === 'Y' ? true : false;
         this.itemContainerFlag  = data[0].itemContainerFlag === 'Y' ? true : false;
        if (data[0].itemImage === undefined || data[0].itemImage === null) {
            // this.itemImgURL = 'assets/images/default-user-profile.jpg';
        } else {
            this.itemImgURL =
                data[0].itemImage.value.slice(1, -1) === ''
                    ? ''
                    : data[0].itemImage.value.slice(1, -1);
        }
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    showFullImage() {
      this.showItemDetails = false;
    }

    hideFullImage() {
      this.showItemDetails = true;
    }
}
