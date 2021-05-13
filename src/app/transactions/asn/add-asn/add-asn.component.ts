import { Component, OnInit, ViewChild, Renderer2, ElementRef, HostListener, Inject, Optional, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatPaginator, TooltipPosition, MatDialogRef, MatDialog, MatTable, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { AsnService } from 'src/app/_services/transactions/asn.service';
import { AddnlFieldDialogComponent } from 'src/app/_shared/AdditionalField/addnl-field-dialog/addnl-field-dialog.component';

export interface ParameterDataElement {
  poNumber?: string,
  poLineNumber?: number,
  iuId: number,
  poLineId: number,
  itemId: number,
  itemName?: any,
  itemRevisionId: number,
  uomCode: number,
  uomCodeValue?: string,
  receiptRouting: string,
  receiptRoutingValue?: string,
  lineNumber: number,
  quantity: any,
  poSearchValue?: string,
  poNameList?: any,
  poId: any,
  action: string,
  editing: boolean,
  asnLineId?: number,
  addNewRecord?: boolean,
  isDefault?: boolean,
  originalData?: any,
  showPoLov?: string,
  inlineSearchLoader?: string,
  poIuList?: any[];
  poLineItemList?: any[];
  poLineItemRevisionList?: any[];
  poLineUOMList?: any[];
  poLineNumberList?: any[];
  createdBy?: any[];
  updatedBy?: any[];
  addLineContent? : any;
  updateLineContent? : any;
  deleteLineContent? : any;
  poRemainQty?: any,
  poQuantity: any,
  poPlannedReceiptDate:any,
  asnPlannedReceiptDate?:any,
  poLineReceiptQty:any,
  allLinesContent?: any,
  linesContent?: any,
  asnLineContents?: any
  additionalFieldList?: any,
  addtnlFieldValueArray?: any,
  addtnlFieldValuePositionArray?: any,
  mandatoryFieldIndex?: any

}

@Component({
    selector: 'app-add-asn',
    templateUrl: './add-asn.component.html',
    styleUrls: ['./add-asn.component.css']
})
export class AddAsnComponent implements OnInit, AfterViewInit {
    ouCodeList: any[] = [];
    iuCodeList: any[] = [];
    supplierList: any[] = [];
    supplierSiteList: any[] = [];
    poNameList: any[] = [];
    UOMList: any[] = [];
    poStatusList: any[] = [];
    poTypesList: any[] = [];
    currencyList: any[] = [];
    receiptRoutingList: any[] = [];
    AsnForm: FormGroup;
    parameterData: ParameterDataElement[] = [];
    asnLineDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    isEditRoles = false;
    isAdd = false;
    isEdit = false;
    systemDate: any = new Date();
    formTitle: string;
    asnId: number;
    isStatus = false;
    currencyCode = '';
    showLov = 'hide';
    inlineSearchLoader = 'hide';
    tooltipPosition: TooltipPosition[] = ['below'];
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    poLineNumberList: any[] = [];
    ouCodeId: any;
    supplierCodeId: any;
    supplierSiteCodeId: any;
    poName: any;
    poNameIndex: any;
    supplierSearchPlaceholder = 'Search Supplier';
    saveInprogress = false;

    additionalFieldList = [];
    addtnlFieldValueArray = [];
    addtnlFieldValuePositionArray = []; 
    mandatoryFieldIndex = [];
    setEndDate : any = new Date();

    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    // Code for additional line field
    addnlFieldDialogRef: MatDialogRef<AddnlFieldDialogComponent>;
    
    selectedRowIndex = null;
    asnLineDisplayedColumns: string[] = [
        'No',
        'poNumber',
        'poLineNumber',
        'poIUId',
        'asnLineNumber',
        'asnItem',
        'asnItemRevision',
        'asnUOMCode',
        'asnQty',
        'receiptRouting',
        'poRemainQty',
        'poQuantity',
        'poPlannedReceiptDate',
        'asnPlannedReceiptDate',
        'poLineReceiptQty',
        'action'
    ];
    columns: any = [
        { field: 'No', name: '#', width: 75, baseWidth: 4 },
        { field: 'poNumber', name: 'PO', width: 75, baseWidth: 6 },
        { field: 'poLineNumber', name: 'PO Line', width: 75, baseWidth: 4 },
        { field: 'poIUId', name: 'IU', width: 75, baseWidth: 6 },
        {
            field: 'asnLineNumber',
            name: 'ASN Line #',
            width: 75,
            baseWidth: 5.5
        },
        { field: 'asnItem', name: 'Item', width: 75, baseWidth: 7 },
        {
            field: 'asnItemRevision',
            name: 'Item Rev',
            width: 75,
            baseWidth: 5.5
        },
        { field: 'asnUOMCode', name: 'UOM Code', width: 75, baseWidth: 6 },
        { field: 'asnQty', name: 'Qty', width: 75, baseWidth: 4 },
        {
            field: 'receiptRouting',
            name: 'Receipt Routing',
            width: 75,
            baseWidth: 7
        },
        { field: 'poRemainQty', name: 'PO Remain Qty', width: 75, baseWidth: 6 },
        { field: 'poQuantity', name: 'PO Quantity', width: 75, baseWidth: 6 },
        {
            field: 'poPlannedReceiptDate',
            name: 'PO Planned Receipt Date',
            width: 75,
            baseWidth: 9
        },
        {
            field: 'asnPlannedReceiptDate',
            name: 'ASN Planned Receipt Date',
            width: 75,
            baseWidth: 9
        },
        {
            field: 'poLineReceiptQty',
            name: 'PO line Receipt Quantity',
            width: 75,
            baseWidth:9
        },
        { field: 'action', name: 'Action', width: 75, baseWidth: 6 }
    ];
    validationMessages = {
        asnNumber: {
            required: 'ASN Number is required.'
        },
        ouId: {
            required: 'OU is required.'
        },
        tpId: {
            required: 'Supplier is required.'
        },
        tpSiteId: {
            required: 'Supplier Site is required.'
        },
        asnDate: {
            required: 'Please select ASN date.'
        }
    };

    asnFormErrors = {
        asnNumber: '',
        ouId: '',
        tpId: '',
        tpSiteId: '',
        asnDate: ''
    };
    fromSaveError: boolean = false;
    constructor(
        private fb: FormBuilder,
        public router: Router,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public commonService: CommonService,
        private route: ActivatedRoute,
        private purchaseOrderService: PurchaseOrderService,
        private asnService: AsnService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getOperatingUnitLOV();
        this.asnFeedForm();
        this.getLookUpLOV('Receipt Routing');
        this.route.params.subscribe(params => {
            if (params.id) {
                this.formTitle = 'Edit ASN :';
                this.isEdit = true;
                this.asnId = params.id;
                this.AsnForm.controls.searchValue.disable();
                this.asnService.getAsnById(params.id).subscribe((data: any) => {
                    this.AsnForm.patchValue(data.result[0]);
                    this.AsnForm.patchValue({
                        searchValue: data.result[0].tpName
                    });
                    this.AsnForm.controls['searchValue'].setValue(data.result[0].tpName);    
                    const element = {
                        label: data.result[0].tpName,
                        value: data.result[0].tpId
                    }
                    this.supplierSelectionChanged(
                        { source: { selected: true }, isUserInput: true },
                        element
                    );
                    this.formTitle = 'Edit ASN : ' + data.result[0].asnNumber;
                    this.supplierSearchPlaceholder = 'Supplier';
                    this.renderEditRoles(data.result[0].asnLines);
                     data = data.result[0];
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
                    
                });
            } else {
                this.formTitle = 'Create ASN :';
                setTimeout(() => {this.addRow();},100);
            }
        });
        this.commonService.getScreenSize(80);
        this.getAdditionalFields('AH')
    }


    renderEditRoles(data) {
        for (const [index, pData] of data.entries()) {
            const obj = {
                iuId: pData.iuId,
                poLineId: pData.poLineId,
                itemId: pData.itemId,
                itemRevisionId: pData.itemRevisionId,
                uomCode: pData.uomCode,
                uomCodeValue: pData.uomDescription,
                receiptRouting: pData.receiptRouting,
                receiptRoutingValue: pData.receiptRoutingCode,
                lineNumber: pData.lineNumber,
                quantity: pData.quantity,
                poId: pData.poId,
                poNumber: pData.poNumber,
                poLineNumber: pData.poLineNumber,
                iuCode: pData.iuCode,
                itemName: pData.itemName,
                revsnNumber: pData.revsnNumber,
                asnLineId: pData.asnLineId,
                poLineReceiptQty: pData.poLineReceiptQty,
                poPlannedReceiptDate: pData.poPlannedReceiptDate,
                asnPlannedReceiptDate: pData.asnPlannedReceiptDate,
                poQuantity: pData.poQuantity,
                poRemainQty: pData.poRemainQty,
                allLinesContent: pData.linesContent ? pData.linesContent : [],
                action: '',
                editing: false,
                addNewRecord: false,
                isDefault: true,
                value: JSON.stringify(pData.poId),
                asnDate: pData.asnDate,
                additionalFieldList: [],
                addtnlFieldValueArray: [],
                addtnlFieldValuePositionArray: [], 
                mandatoryFieldIndex: []
            };
 
            // Code for additional field line Start
            for( let i = 1; i < 16; i++){
                if(pData['addlField'+i] !== null){
                    obj.addtnlFieldValueArray.push({
                        fieldName : 'addl_field' + i,
                        position  : String(i),
                        value     : pData['addlField'+i]
                    })
                }
            }
            obj.addtnlFieldValuePositionArray = [];
            for (const rowData of obj.addtnlFieldValueArray) {
                obj.addtnlFieldValuePositionArray.push(rowData.position)
            }
            // Code for additional field line End

            obj['originalData'] = Object.assign({}, obj);
            this.parameterData.push(obj);
            this.poSelectionChanged(
                { source: { selected: true }, isUserInput: true },
                index,
                obj
            );

            //   this.getUOMList(pData.poItemId, index);
            // this.getPoLOVonSelectionChanged()
        }

        this.asnLineDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.asnLineDataSource.paginator = this.paginator;
        this.asnLineDataSource.sort = this.sort;
        // this.asnLineDataSource.connect().subscribe(d => {
        //   this.asnLineDataSource.sortData(this.asnLineDataSource.filteredData, this.asnLineDataSource.sort);
        // });
    }
    getLookUpLOV(lookupName: string) {
        if (lookupName === 'Receipt Routing') {
            this.receiptRoutingList = [];
            this.commonService
                .getLookupLOV(lookupName)
                .subscribe((data: any) => {
                    for (const rowData of data.result) {
                        this.receiptRoutingList.push({
                            value: rowData.lookupValue,
                            label: rowData.lookupValueDesc
                        });
                    }
                });
        }
    }
    // Form Group
    asnFeedForm() {
        this.AsnForm = this.fb.group({
            asnNumber: [{ value: null, disabled: true }],
            ouId: [''],
            searchValue: [''],
            asnDescription: [''],
            tpId: ['', Validators.required],
            tpSiteId: ['', Validators.required],
            asnDate: [new Date(), Validators.required]
        });
    }

    // Get Operating Unit LOV
    getOperatingUnitLOV() {
        this.ouCodeList = [];
        this.commonService.getOULOV().subscribe((data: any) => {
            for (const ouData of data.result) {
                this.ouCodeList.push({
                    value: ouData.ouId,
                    label: ouData.ouCode
                });
            }
        });
    }

    // Get Supplier LOV
    getSupplierLOV() {
        this.iuCodeList = [];
        this.commonService.getSupplierLOV().subscribe((data: any) => {
            for (const iuData of data.result) {
                this.supplierList.push({
                    value: iuData.tpId,
                    label: iuData.tpName
                });
            }
        });
    }

    
    fetchNewSearchListForSupplier(event: any, index: any, searchFlag: any) {
        const value = this.AsnForm.value.searchValue;
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.showLov === 'hide') {
          
            this.inlineSearchLoader = 'show';
            this.getItemLovByScreenForSupplier(
                this.AsnForm.value.searchValue,
                index,
                event
            );
        } else {
            this.showLov = 'hide';
            this.AsnForm.patchValue({ searchValue: '' });
            this.AsnForm.patchValue({ tpId: null });
        }
    }
    fetchNewSearchListForPO(
        event: any,
        index: any,
        searchFlag: any,
        value: any
    ) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }
        if (
            this.ouCodeId === '' ||
            this.ouCodeId === undefined ||
            this.supplierSiteCodeId === '' ||
            this.supplierSiteCodeId === undefined
        ) {
            this.openSnackBar(
                ' Please Select the OU, Supplier and Supplier Site value first',
                '',
                'error-snackbar'
            );
            return;
        } else {
            if (this.parameterData[index].showPoLov === 'hide') {
             
                this.parameterData[index].inlineSearchLoader = 'show';
                this.poName = this.parameterData[index].poSearchValue;
                this.poNameIndex = index;
                this.getPoLOVonSelectionChanged();
            } else {
                this.parameterData[index].showPoLov = 'hide';
                this.parameterData[index].poSearchValue = '';
                this.parameterData[this.poNameIndex].poId = null;
            }
        }
    }

    getItemLovByScreenForSupplier(itemName, index, event) {
        this.commonService
            .getItemLovByScreen('tp-name', 'trading-partner', 'SUPP', itemName)
            .subscribe(
                (data: any) => {
                    this.supplierList = [
                        {
                            value: '',
                            label: ' Please Select'
                        }
                    ];

                    if (data.result && data.result.length) {
                        data = data.result;
                        this.supplierList = [];

                        for (let i = 0; i < data.length; i++) {
                            this.supplierList.push({
                                value: data[i].tpId,
                                label: data[i].tpName
                            });
                        } 
                        this.inlineSearchLoader = 'hide';
                        this.showLov = 'show';
                        this.AsnForm.patchValue({ searchValue: '' });

                        // Set the first element of the search 
                        this.AsnForm.patchValue({ tpId: data[0].tpId }); 
                        this.supplierSelectionChanged({ source: { selected: true } },data[0]);
                    } else {
                        this.inlineSearchLoader = 'hide';
                        this.openSnackBar(
                            'No match found',
                            '',
                            'error-snackbar'
                        );
                    }
                },
                (error: any) => {
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
    }
    // Supplier Site LOV on change supplier
    supplierSelectionChanged(event: any, element: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.supplierSiteList = [];
            this.supplierCodeId = element.value;
            this.AsnForm.patchValue({ searchValue: element.label });
            this.commonService.getSupplierSiteLOV(element.value).subscribe((data: any) => {
                if (data.result) {
                    if(data.result.length === 1){
                        this.AsnForm.patchValue({tpSiteId : data.result[0].tpSiteId});
                        this.supplierSiteCodeId = data.result[0].tpSiteId;
                    }
                    for (const supplierSiteData of data.result) {
                        this.supplierSiteList.push({
                            value: supplierSiteData.tpSiteId,
                            label: supplierSiteData.tpSiteName
                        });
                    }
                }
            });
        } 
    }

    asnLogValidationErrors(group: FormGroup = this.AsnForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.asnLogValidationErrors(abstractControl);
            } else {
                this.asnFormErrors[key] = '';
                if (
                    abstractControl &&
                    !abstractControl.valid &&
                    (abstractControl.touched || abstractControl.dirty)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.asnFormErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
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

    // Code for additional field line Start
    addnlFieldSetupForLine(event: any, index: any, element:any ){
        if(!element.iuId){
            this.openSnackBar('Please select the IU','','error-snackbar');
            return;
        }
        this.getAdditionalFieldsForLine(index, element);
    }

    getAdditionalFieldsForLine(index, element){
        const data = {
            screenId    : null,
            screenCode  : 'AL',
            iuId        : element.iuId,
            enabledFlag : 'Y'
        }

        this.commonService
        .getScreenDetails(data)
        .subscribe(
            (data: any) => {
                if (data.status === 200) {
                    if (!data.message) {
                         
                        this.parameterData[index].additionalFieldList = data.result;
                        for (const rowData of this.parameterData[index].additionalFieldList) {
                            if(rowData.mandatoryFlag === 'Y'){
                                this.parameterData[index].mandatoryFieldIndex.push(rowData.addlField.split('addl_field')[1])
                            }
                        }
                        this.openAddnlFieldDailogForLine(index);
                    }else{
                        this.parameterData[index].additionalFieldList = [];
                        this.openAddnlFieldDailogForLine(index);
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

    openAddnlFieldDailogForLine(index, location?){
        if(this.parameterData[index].additionalFieldList.length){
            this.addnlFieldDialogRef= this.dialog.open(
                AddnlFieldDialogComponent,
                {
                    data: {
                        addtnlFieldValueArray : this.parameterData[index].addtnlFieldValueArray,
                        addtnlFieldArray      : this.parameterData[index].additionalFieldList,
                        location              : location
                    },
                    width: '65vw',
                    disableClose: true
                }
            );
            this.addnlFieldDialogRef.afterClosed().subscribe(response => {
                 
                this.parameterData[index].addtnlFieldValueArray = response.addtnlFieldValueArray;
                this.parameterData[index].addtnlFieldValuePositionArray = [];
                for (const rowData of this.parameterData[index].addtnlFieldValueArray) {
                    this.parameterData[index].addtnlFieldValuePositionArray.push(rowData.position)
                }     
                
            });     
        }else{
            this.openSnackBar('There is not any additional field for this screen','','error-snackbar');
        }
    }
     // Code for additional field line End

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
            this.isEditRoles = true;
            rowData.showPoLov = 'hide';
            rowData.inlineSearchLoader = 'hide';
            rowData.poSearchValue = rowData.poNumber;
            // this.poSelectionChanged({ source: { selected: true }, isUserInput: true }, this.AsnForm.value)
        } else {
        }
    }
    addRow() {
        this.selectedRowIndex = null;
        this.paginator.pageIndex = 0;
        if (this.matTableRef.nativeElement.clientHeight > 240) {
            const elem = document.getElementById('customTable');
            elem.scrollTop = 0;
        }
        for (const pData of this.parameterData) {
            if (pData.editing === true && pData.addNewRecord === false) {
                this.openSnackBar(
                    'Please update your records first.',
                    '',
                    'error-snackbar'
                );
                return;
            }
        }
        let MaxLineNumber = 0;
        if (this.parameterData.length) {
            MaxLineNumber = Math.max.apply(
                Math,
                this.parameterData.map(function(key) {
                    return key.lineNumber;
                })
            );
        }
        this.isAdd = true;
        this.isEditRoles = false;
        if (this.AsnForm.value.poCurrencyCode) {
            this.currencyCode = this.AsnForm.value.poCurrencyCode;
        }
        this.parameterData.unshift({
            lineNumber: this.isEdit
                ? MaxLineNumber + 1
                : this.parameterData.length + 1,
            iuId: null,
            poLineId: null,
            itemId: null,
            itemRevisionId: null,
            itemName: '',
            uomCode: null,
            receiptRouting: null,
            poId: null,
            poSearchValue: '',
            quantity: null,
            poQuantity: '',
            poRemainQty: '',
            poPlannedReceiptDate: '',
            asnPlannedReceiptDate: '',
            poLineReceiptQty: '',
            showPoLov: 'hide',
            inlineSearchLoader: 'hide',
            action: '',
            editing: true,
            addNewRecord: true,
            isDefault: false,
            allLinesContent: [],
            additionalFieldList: [],
            addtnlFieldValueArray: [],
            addtnlFieldValuePositionArray: [], 
            mandatoryFieldIndex: []
        });

        this.asnLineDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.asnLineDataSource.paginator = this.paginator;
        this.asnLineDataSource.sort = this.sort;
        // this.asnLineDataSource.connect().subscribe(d => {
        //   this.asnLineDataSource.sortData(this.asnLineDataSource.filteredData, this.asnLineDataSource.sort);
        // });
    }

    disableEdit(rowData: any, index: any) {
        if (this.parameterData[index].editing === true) {
            this.parameterData[index].isDefault = this.parameterData[
                index
            ].originalData.isDefault;
            this.parameterData[index].poId = this.parameterData[
                index
            ].originalData.poId;
            this.parameterData[index].poLineId = this.parameterData[
                index
            ].originalData.poLineId;
            this.parameterData[index].iuId = this.parameterData[
                index
            ].originalData.iuId;
            this.parameterData[index].lineNumber = this.parameterData[
                index
            ].originalData.lineNumber;
            this.parameterData[index].itemId = this.parameterData[
                index
            ].originalData.itemId;
            this.parameterData[index].itemRevisionId = this.parameterData[
                index
            ].originalData.itemRevisionId;
            this.parameterData[index].uomCode = this.parameterData[
                index
            ].originalData.uomCode;
            this.parameterData[index].quantity = this.parameterData[
                index
            ].originalData.quantity;
            this.parameterData[index].receiptRouting = this.parameterData[
                index
            ].originalData.receiptRouting;
            (this.parameterData[index].poLineReceiptQty = this.parameterData[
                index
            ].originalData.poLineReceiptQty),
                (this.parameterData[
                    index
                ].poPlannedReceiptDate = this.parameterData[
                    index
                ].originalData.poPlannedReceiptDate),
                (this.parameterData[
                    index
                ].asnPlannedReceiptDate = this.parameterData[
                    index
                ].originalData.asnPlannedReceiptDate),
                (this.parameterData[index].poQuantity = this.parameterData[
                    index
                ].originalData.poQuantity),
                (this.parameterData[index].poRemainQty = this.parameterData[
                    index
                ].originalData.poRemainQty),
                (this.parameterData[index].editing = false);
            this.isEditRoles = false;
        }
    }
    deleteRow(rowData: any, rowIndex: number) {
      this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.asnLineDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.asnLineDataSource.paginator = this.paginator;
        this.checkIsAddRow();
        let count = this.parameterData.length + 1;
        for (const pData of this.parameterData) {
            pData.lineNumber = --count;
        }
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
    getASNLinesForAdd(data) {
        let tempObject = {};
        const asnLineArray = [];
        if (this.parameterData.length) {

            // Code for additional field line starts
            for( const [i, item] of this.parameterData.entries()){
                for (const rowData of item.mandatoryFieldIndex) {
                    if(!item.addtnlFieldValuePositionArray.includes(rowData)){
                        this.openAddnlFieldDailogForLine(i, 'validation');
                        this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                        return 'validateError';
                    }
                }  
                for (const rowData of item.addtnlFieldValueArray) {
                    item['addlField'+ rowData.position] = rowData.value;
                }
            }
              // Code for additional field line ends


          this.selectedRowIndex = null;
          for (const [i, pData] of this.parameterData.entries()) {
                if (
                    pData.poId === null ||
                    pData.poLineId === null ||
                    pData.quantity === null  || pData.quantity === ''
                ) {
                    this.selectedRowIndex = i;
                    this.openSnackBar('Please enter all required fields in row ' + (i+1),'','error-snackbar');
                    return 'validateError';
                }
                if (Number(pData.quantity) === 0 || Number(pData.quantity) === NaN ) {
                    this.selectedRowIndex = i;
                    this.openSnackBar('ASN qty should be a non-zero value in row ' + (i+1),'','error-snackbar');
                    return 'validateError';
                }
                
            }
            for (const [i, pData] of this.parameterData.entries()) {
               /*
                delete pData.showPoLov;
                delete pData.inlineSearchLoader;
                delete pData.poSearchValue;
                delete pData.action;
                delete pData.editing;
                delete pData.addNewRecord;
                delete pData.isDefault;
                delete pData.poIuList;
                delete pData.poLineItemList;
                delete pData.poLineItemRevisionList;
                delete pData.poLineUOMList;
                delete pData.asnLineId;
                */
                
                pData.createdBy = JSON.parse(
                    localStorage.getItem('userDetails')
                ).userId;

                asnLineArray.push(pData);
                tempObject = {};
            }
            data.addAsnLines = asnLineArray;
            return data;
        } else {
            data.addAsnLines = asnLineArray;
            return data;
        }
    }
    getASNLinesForEdit(data) {
        const asnLineArray = [];
        const updateAsnLineArray = [];
        
        if (this.parameterData.length) {

            // Code for additional field line starts
            for( const [i, item] of this.parameterData.entries()){
                for (const rowData of item.mandatoryFieldIndex) {
                    if(!item.addtnlFieldValuePositionArray.includes(rowData)){
                        this.openAddnlFieldDailogForLine(i, 'validation');
                        this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                        return 'validateError';
                    }
                }  
                for (const rowData of item.addtnlFieldValueArray) {
                    item['addlField'+ rowData.position] = rowData.value;
                }
            }
            // Code for additional field line ends



            this.selectedRowIndex = null;
            for (const [i, pData] of this.parameterData.entries()) {
                if (pData.editing) {
                if (pData.poId === null ||
                    pData.poLineId === null ||
                    pData.quantity === null || pData.quantity === ''
                ) {
                    this.selectedRowIndex = i;
                    this.openSnackBar('Please enter all required fields in row ' + (i + 1),'','error-snackbar');
                    return 'validateError';
                }
                 if (Number(pData.quantity) === 0 || Number(pData.quantity) === NaN ) {
                    this.selectedRowIndex = i;
                    this.openSnackBar('ASN qty should be a non-zero value in row ' + (i+1),'','error-snackbar');
                    return 'validateError';
                }
               // if (Number(pData.quantity) === 0 || Number(pData.quantity) === NaN  || Number(pData.quantity) > Number(pData.poRemainQty) ) {
                    //this.selectedRowIndex = i;
                    //this.openSnackBar('ASN qty should be a non-zero and equal or less than PO qty in row ' + (i+1),'','error-snackbar');
                    //return 'validateError';
                //}
                if (pData.allLinesContent.length) {
                    let lineTotalQty = 0;
                    for (const lineData of pData.allLinesContent) {
                        lineTotalQty = lineTotalQty + lineData.asnQuantity;
                    }
                    if (lineTotalQty !== Number(pData.quantity)) {
                        this.openSnackBar(
                            'ASN line quantity and its sum of content line are different in row ' +
                                (i + 1),
                            '',
                            'error-snackbar'
                        );
                        return 'validateError';
                    }
                }
            }
                if (pData.asnLineId) {
                    if (pData.editing) {
                        // delete pData.action;
                        // delete pData.editing;
                        // delete pData.addNewRecord;
                        // delete pData.poIuList;
                        // delete pData.poLineItemList;
                        // delete pData.poLineItemRevisionList;
                        // delete pData.poLineUOMList;
                        // delete pData.poLineNumberList;
                        // delete pData.poNameList;
                        pData.lineNumber =
                            pData.lineNumber !== null
                                ? Number(pData.lineNumber)
                                : null;
                        pData.quantity =
                            (pData.quantity !== null || pData.quantity !== '')
                                ? Number(pData.quantity)
                                : 0;
                        pData.poId =
                            pData.poId !== null ? Number(pData.poId) : null;
                        pData.asnPlannedReceiptDate = (pData.asnPlannedReceiptDate === '' || pData.asnPlannedReceiptDate === null)
                            ? null : this.asnService.dateFormat(pData.asnPlannedReceiptDate);
                        pData.updatedBy = JSON.parse(
                            localStorage.getItem('userDetails')
                        ).userId;
                        updateAsnLineArray.push(pData);
                    }
                } else {
                    // delete pData.action;
                    // delete pData.editing;
                    // delete pData.addNewRecord;
                    // delete pData.poIuList;
                    // delete pData.poLineItemList;
                    // delete pData.poLineItemRevisionList;
                    // delete pData.poLineUOMList;
                    // delete pData.asnLineId;
                    // delete pData.poLineNumberList;
                    // delete pData.poNameList;
                    pData.lineNumber =
                        pData.lineNumber !== null
                            ? Number(pData.lineNumber)
                            : null;
                    pData.quantity =
                    (pData.quantity !== null || pData.quantity !== '') ? Number(pData.quantity) : 0;
                    pData.poId =
                        pData.poId !== null ? Number(pData.poId) : null;
                    pData.asnPlannedReceiptDate = (pData.asnPlannedReceiptDate === '' || pData.asnPlannedReceiptDate === null)
                ? null : this.asnService.dateFormat(pData.asnPlannedReceiptDate);
      
                    pData.createdBy = JSON.parse(
                        localStorage.getItem('userDetails')
                    ).userId;
                    asnLineArray.push(pData);
                }
            }
            // data.addAsnLines = asnLineArray;
            // data.updateAsnLines = updateAsnLineArray;
            data.asnLines = updateAsnLineArray.concat(asnLineArray);
            return data;
        }
    }

    // PO Line LOV on PO Selection Changed
    poSelectionChanged(event: any, index: number, poData: any) {
        if (event.source.selected) {
            // this.poNumberId = Id;
            // this.asnService.getPolineByPo(Id).subscribe((data: any) => {
            this.asnService
                .getPolineByPo('asn-po-line', 'po', poData.value, '')
                .subscribe((data: any) => {
                    this.parameterData[index].poLineNumberList = [];
                    for (const poLineData of data.result) {
                         
                        this.parameterData[index].poLineNumberList.push({
                            value: poLineData.poLineId,
                            label: poLineData.poLineNumber,
                            itemName: poLineData.itemName,
                            poItemId: poLineData.poItemId,
                            poReceiptRouting: poLineData.poReceiptRouting,
                            uomCode: poLineData.poUomCode,
                            uomDescription: poLineData.uomDescription,
                            revsnId: poLineData.revsnId,
                            revsnNumber: poLineData.revsnNumber,
                            iuId: poLineData.iuId,
                            iuCode: poLineData.iuCode,
                            iuName: poLineData.iuName,
                            poLineReceiptQty: poLineData.poLineReceiptQty,
                            poPlannedReceiptDate:
                                poLineData.poPlannedReceiptDate,
                            poQuantity: poLineData.poQuantity,
                            poRemainQty: poLineData.poRemainQty,
                        });
                    }
                    //this.parameterData[index].poLineId =  this.parameterData[index].poLineNumberList[0].value;
                    
                    let currentobj = this.parameterData[index].poLineNumberList.
                            find(obj => obj.value === this.parameterData[index].poLineId);
                    if (currentobj) {
                        this.poLineSelectionChanged({source: { selected: true }, isUserInput: true}, index, currentobj);
                    }else{
                        this.parameterData[index].poLineId =   this.parameterData[index].poLineNumberList[0].value;
                        this.poLineSelectionChanged({source: { selected: true }, isUserInput: true}, index, this.parameterData[index].poLineNumberList[0],'new');
                    }                     
                });
        }
    }

    // ASN Lines default data on change PO Lines
    poLineSelectionChanged(event: any, index: number, poData: any, from?:any) {
        if (event.source.selected) {
            this.parameterData[index].poIuList = [];
            this.parameterData[index].poLineItemList = [];
            this.parameterData[index].poLineItemRevisionList = [];
            this.parameterData[index].poLineUOMList = [];

            this.parameterData[index].poIuList.push({
                value: poData.iuId,
                label: poData.iuCode,
                name: poData.iuName
            });
            this.parameterData[index].poLineItemList.push({
                value: poData.poItemId,
                label: poData.itemName
            });
            this.parameterData[index].poLineItemRevisionList.push({
                value: poData.revsnId,
                label: poData.revsnNumber
            });
            this.parameterData[index].poLineUOMList.push({
                value: poData.uomCode,
                label: poData.uomDescription
            });

            this.parameterData[index].poLineReceiptQty =
                poData.poLineReceiptQty;
            this.parameterData[index].poPlannedReceiptDate =
                poData.poPlannedReceiptDate;
            if(!this.isEdit && !this.fromSaveError){
                    this.parameterData[index].asnPlannedReceiptDate = null;
                }
            
            if(from){
                this.parameterData[index].quantity = '';
            }
            this.parameterData[index].poQuantity = poData.poQuantity;
            this.parameterData[index].poRemainQty = poData.poRemainQty;

            this.parameterData[index].iuId = poData.iuId;
            this.parameterData[index].itemId = poData.poItemId;
            this.parameterData[index].itemName = poData.itemName;
            this.parameterData[index].itemRevisionId = poData.revsnId;
            this.parameterData[index].uomCode = poData.uomCode;
            this.parameterData[index].receiptRouting = poData.poReceiptRouting;
            let toDate = new Date(poData.poPlannedReceiptDate);
            this.setEndDate = new Date(new Date(poData.poPlannedReceiptDate).setDate(toDate.getDate()));
           
        }
    }

    ouSelectionChanged(event: any, value: any) {
        if (event.source.selected && event.isUserInput === true) {
            // this.sourceDocLabel = event.source.viewValue;
            this.ouCodeId = value;
            this.getPoLOVonSelectionChanged();
        }
    }
    supplierSiteSelectionChanged(event: any, value: any) {
        if (event.source.selected && event.isUserInput === true) {
            // this.sourceDocLabel = event.source.viewValue;
            this.supplierSiteCodeId = value;
            this.AsnForm.controls['tpSiteId'].setValue(value);            
            this.getPoLOVonSelectionChanged();
        }
    }
    // Po LOV on OU, supplier and supplier site selection changed
    getPoLOVonSelectionChanged() {
        if (
            this.ouCodeId !== '' &&
            this.ouCodeId !== undefined &&
            this.supplierSiteCodeId !== '' &&
            this.supplierSiteCodeId !== undefined &&
            this.poName !== undefined
        ) {
            const dataObj = {
                ouId: this.ouCodeId,
                tpId: this.supplierCodeId,
                tpSiteId: this.supplierSiteCodeId,
                poNumber: this.poName
            };
            // if (event.source.selected) {
            this.asnService.getPOLov(dataObj).subscribe((data: any) => {
                if (data.result && data.result.length) { 
                    this.parameterData[this.poNameIndex].poNameList = [];
                    for (const poData of data.result) {
                        this.parameterData[this.poNameIndex].poNameList.push({
                            value: poData.poId,
                            label: poData.poNumber
                        });
                    }
                    this.parameterData[this.poNameIndex].inlineSearchLoader =
                        'hide';
                    this.parameterData[this.poNameIndex].showPoLov = 'show';
                    this.parameterData[this.poNameIndex].poSearchValue = '';

                    // Set the first element of the search
                    this.parameterData[this.poNameIndex].poId =
                        data.result[0].poId;
                } else {
                    this.parameterData[this.poNameIndex].poNameList = [];
                    this.parameterData[this.poNameIndex].inlineSearchLoader =
                        'hide';
                    this.openSnackBar('No match found', '', 'error-snackbar');
                }
            });
        }
    }
    onSubmit(event: any, formId: any) {
        if (event) {
            event.stopImmediatePropagation();
            this.saveInprogress = true;
            this.fromSaveError = false; 
            if (this.AsnForm.valid) {
                
                if (this.isEdit) {
                    this.AsnForm.value.asnDate = this.asnService.dateFormat(
                        this.AsnForm.value.asnDate
                    );
                    const data = this.getASNLinesForEdit(this.AsnForm.value);
                    if (data === 'validateError') {
                        this.saveInprogress = false;
                        return;
                    }

                    // Code for additional field header starts
                    // for (const rowData of this.mandatoryFieldIndex) {
                    //     if(!this.addtnlFieldValuePositionArray.includes(rowData)){
                    //         this.openAddnlFieldDailog();
                    //         this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                    //         this.saveInprogress = false;
                    //         return;
                    //     }
                    // }  
                    // for (const rowData of this.addtnlFieldValueArray) {
                    //     data['addlField'+ rowData.position] = rowData.value;
                    // }
                    // Code for additional field header ends

                    this.asnService.updateASN(data, this.asnId).subscribe(
                        (resultData: any) => {
                            if (resultData.status === 200) {
                                this.openSnackBar(
                                    resultData.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.router.navigate(['asn']);
                            } else {
                                for (const [i, pData] of this.parameterData.entries()) { 
                                    if(pData.editing){
                                        this.parameterData[i].poId = String(pData.poId);                                     
                                    }
                                }
                                this.openSnackBar(
                                    resultData.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                            this.saveInprogress = false;
                        },
                        error => {
                            for (const [i, pData] of this.parameterData.entries()) { 
                                if(pData.editing){
                                    this.parameterData[i].poId = String(pData.poId);                                     
                                }
                            }
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                            this.saveInprogress = false;
                        }
                    );
                } else {
                    this.AsnForm.value.createdBy = JSON.parse(
                        localStorage.getItem('userDetails')
                    ).userId;
                    this.AsnForm.value.asnNumber = null;
                    this.AsnForm.value.asnDate = this.asnService.dateFormat(
                        this.AsnForm.value.asnDate
                    );
                    const data = this.getASNLinesForAdd(this.AsnForm.value);
                    
                    if (data === 'validateError') {
                        this.saveInprogress = false;
                        return;
                    }
                    if (!this.parameterData.length) {
                        this.openSnackBar(
                            'Please enter ASN line',
                            '',
                            'error-snackbar'
                        );
                        this.saveInprogress = false;
                        return;
                    }

                    // Code for additional field header starts
                    // for (const rowData of this.mandatoryFieldIndex) {
                    //     if(!this.addtnlFieldValuePositionArray.includes(rowData)){
                    //         this.openAddnlFieldDailog();
                    //         this.openSnackBar('Please enter the all additional mandatory fields','','error-snackbar');
                    //         this.saveInprogress = false;
                    //         return;
                    //     }
                    // }  
                    // for (const rowData of this.addtnlFieldValueArray) {
                    //     data['addlField'+ rowData.position] = rowData.value;
                    // }
                    // Code for additional field header ends
                    for (const pData of data.addAsnLines) {
                        
                        //  delete pData.showPoLov;
                        //  delete pData.inlineSearchLoader;
                        //  delete pData.poSearchValue;
                        //  delete pData.action;
                        //  delete pData.editing;
                        //  delete pData.addNewRecord;
                        //  delete pData.isDefault;
                        //  delete pData.poIuList;
                        //  delete pData.poLineItemList;
                        //  delete pData.poLineItemRevisionList;
                        //  delete pData.poLineUOMList;
                        //  delete pData.asnLineId;                         
                         pData.lineNumber =
                        pData.lineNumber !== null ? Number(pData.lineNumber) : null;
                        pData.quantity =
                        (pData.quantity !== null || pData.quantity !== '') ? Number(pData.quantity) : 0;
                        pData.poId = pData.poId !== null ? Number(pData.poId) : null;                
                        pData.asnPlannedReceiptDate = (pData.asnPlannedReceiptDate === '' || pData.asnPlannedReceiptDate === null)
                        ? null : this.asnService.dateFormat(pData.asnPlannedReceiptDate);
       
                    }
                    this.asnService.createASN(data).subscribe(
                        (resultData: any) => {
                            if (resultData.status === 200) {
                                this.openDialog('Success', resultData.message);
                                this.router.navigate(['asn']);
                            } else {
                                for (const [i, pData] of this.parameterData.entries()) { 
                                    if(pData.editing){
                                        this.parameterData[i].poId = String(pData.poId);
                                        this.fromSaveError = true;                                         
                                    }
                                }
                                this.openSnackBar(
                                    resultData.message,
                                    '',
                                    'error-snackbar'
                                );
                            }
                            this.saveInprogress = false;
                        },
                        error => {
                            for (const [i, pData] of this.parameterData.entries()) { 
                                if(pData.editing){
                                    this.parameterData[i].poId = String(pData.poId); 
                                    this.fromSaveError = true;                                    
                                }
                            }
                            this.openSnackBar(
                                error.error.message,
                                '',
                                'error-snackbar'
                            );
                            this.saveInprogress = false;
                        }
                    );
                }
            } else {
                for (const [i, pData] of this.parameterData.entries()) {
                    if (
                        pData.poId === null ||
                        pData.poLineId === null ||
                        pData.quantity === null || pData.quantity === ''
                    ) {
                        this.selectedRowIndex = i;
                    }
                }
                this.saveInprogress = false;
                this.openSnackBar(
                    'Please check mandatory fields',
                    '',
                    'error-snackbar'
                );
            }
        }
    }
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    openAsnDialog(element: any, index: any) {
        this.asnService.getItemContrl(element.itemId).subscribe(
            (data: any) => {
                if (data.status === 200) {
                    this.openItemDialog(element, data.result[0], index);
                } else {
                    this.openSnackBar(data.message, '', 'error-snackbar');
                }
            },
            error => {
                this.openSnackBar(error, '', 'error-snackbar');
            }
        );
    }

    openItemDialog(element, itemData, index) {
        const dialogRef = this.dialog.open(AsnPopupDialogComponent, {
            width: '70vw',
            data: {
                element: element,
                itemData: itemData,
                index: index
            }
        });

        dialogRef.afterClosed().subscribe(response => {
            this.setLineContent(response);
        });
    }

    setLineContent(data) {
        // this.parameterData[data.index].addLineContent    = data.addArray;
        // this.parameterData[data.index].updateLineContent = data.updateArray;

        if (this.isEdit) {
            if (!this.parameterData[data.index].deleteLineContent) {
                this.parameterData[data.index].deleteLineContent = [];
            }
            this.parameterData[
                data.index
            ].asnLineContents = data.addArray.concat(data.updateArray);
            this.parameterData[
                data.index
            ].deleteLineContent = this.parameterData[
                data.index
            ].deleteLineContent.concat(data.deleteArray);
        } else {
            this.parameterData[
                data.index
            ].addLineContent = data.addArray.concat(data.updateArray);
        }

        this.parameterData[data.index].allLinesContent = data.allLinesContent;
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
    ngAfterViewInit() {
        this.asnLineDataSource.sort = this.sort;
        // this.asnLineDataSource.connect().subscribe(d => {
        //   this.asnLineDataSource.sortData(this.asnLineDataSource.filteredData, this.asnLineDataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(
                this.matTableRef.nativeElement.clientWidth,
                this.columns
            );
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(
                window.localStorage.getItem('paginationSize')
                    ? window.localStorage.getItem('paginationSize')
                    : 10
            );
        }, 100);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(80);
    }
}

export interface ParameterDataElementItemAsnLine {
  sno?           : string,
  asnLineId      : number,
  asnLpnNumber   : string,
  asnBatchNumber : string,
  asnFromSerial  : string,
  asnToSerial    : string,
  asnQuantity    : string,
  asnContentId?  : number,
  action?        : string,                  
  editing        : boolean,                 
  addNewRecord   : boolean,
  originalData?  : any,
      
}

@Component({
  selector: 'app-asn-dialog',
  templateUrl: './asn-dialog.html',
  styleUrls: ['./add-asn.component.css']
})

export class AsnPopupDialogComponent implements OnInit {
  isAdd: any = true;
  isEdit: any = false;
  deleteArray: any = [];
  parameterData: ParameterDataElementItemAsnLine [] = [];
  parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
  parameterDisplayedColumnsItemAsnLine: string[] = [
    'sno',           
    'asnLpnNumber',         
    'asnBatchNumber',       
    'asnFromSerial',    
    'asnToSerial',      
    'asnQuantity',
    'action'      
  ];
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tooltipPosition: TooltipPosition[] = ['below'];
  listProgress = false;

  constructor( 
    public dialogRefPopup: MatDialogRef<AsnPopupDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public commonService: CommonService
    ) {
  
  }

  ngOnInit() {

    this.parameterData = [];
    for (const pdata of this.data.element.allLinesContent ) {
      const obj = {
            asnLineId       : pdata.asnLineId ? pdata.asnLineId : null,
            asnLpnNumber    : pdata.asnLpnNumber,
            asnBatchNumber  : this.data.itemData.batchFlag === 'Y' ?  pdata.asnBatchNumber: null,
            asnQuantity     : pdata.asnQuantity,
            asnFromSerial   : this.data.itemData.serialFlag === 'Y' ?  pdata.asnFromSerial : null,
            asnToSerial     : this.data.itemData.serialFlag === 'Y' ?  pdata.asnToSerial: null,
            asnContentId    : pdata.asnContentId ? pdata.asnContentId : null,
            editing         : false,                 
            addNewRecord    : false
      }
      obj['originalData'] = Object.assign({}, obj);
      this.parameterData.push(obj);

    }

    this.parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
    this.parameterDataSourceItemAsnLine.paginator = this.paginator;
       
      
    if(this.data.itemData.batchFlag === 'N' && this.data.itemData.serialFlag === 'N'){
      this.parameterDisplayedColumnsItemAsnLine = [ 'sno', 'asnLpnNumber', 'asnQuantity', 'action' ];
    }else if(this.data.itemData.serialFlag === 'N'){
      this.parameterDisplayedColumnsItemAsnLine = [ 'sno', 'asnLpnNumber', 'asnBatchNumber', 'asnQuantity', 'action' ];
    }else{
      this.parameterDisplayedColumnsItemAsnLine = [ 'sno', 'asnLpnNumber', 'asnFromSerial', 'asnToSerial', 'asnQuantity', 'action' ];
    }
    
  }

  onCloseClick(): void {
    this.dialogRefPopup.close();
     
  }

  addRowSerial(){

  }

  

  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
         duration: 3500,
        panelClass: [typeClass]
    });
  }

  addRow() {
    // this.paginator.pageIndex = 0;
    // if(this.matTableRef.nativeElement.clientHeight > this.commonService.getTableHeight()){
    //     const elem = document.getElementById('customTable');
    //     elem.scrollTop = 0;
    // }
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
    this.isAdd = true;
    this.isEdit = false;
    this.parameterData.unshift({
        sno            : '',
        asnLineId      : null,
        asnLpnNumber   : '',
        asnBatchNumber : this.data.itemData.batchFlag === 'Y' ? '' : null,
        asnFromSerial  : this.data.itemData.serialFlag === 'Y' ? '' : null,
        asnToSerial    : this.data.itemData.serialFlag === 'Y' ? '' : null,
        asnQuantity    : '',
        asnContentId   : null,
        action         : '',
        editing        : true,
        addNewRecord   : true
    });
   
    this.parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
    this.parameterDataSourceItemAsnLine.paginator = this.paginator;
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
    if (this.parameterData[index].editing === true) {
        this.parameterData[index].asnLineId      = this.parameterData[index].originalData.asnLineId
        this.parameterData[index].asnLpnNumber   = this.parameterData[index].originalData.asnLpnNumber
        this.parameterData[index].asnBatchNumber = this.parameterData[index].originalData.asnBatchNumber
        this.parameterData[index].asnQuantity    = this.parameterData[index].originalData.asnQuantity
        this.parameterData[index].asnFromSerial  = this.parameterData[index].originalData.asnFromSerial
        this.parameterData[index].asnToSerial    = this.parameterData[index].originalData.asnToSerial
        this.parameterData[index].asnContentId   = this.parameterData[index].originalData.asnContentId
        this.parameterData[index].editing        = false;
    };
   
    if (
        this.parameterData.find(({ editing }) => editing === true) ===
        undefined
    ) {
        this.isEdit = false;
    }
}


deleteRow(rowData: any, rowIndex: number) {
    this.parameterData.splice(rowIndex, 1);
    this.parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(
        this.parameterData
    );
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
  
  batchFocusOut(event:any, batchvalue: any, index:any){
     
    const batchNumArray: any = []
    for (const [i, pdata] of this.parameterData.entries() ) {
      if(pdata.asnBatchNumber !== '' && index !== i ){
        batchNumArray.push(pdata.asnBatchNumber);
      }
    }

    if(batchNumArray.includes(batchvalue)){
      this.openSnackBar('Batch number already exists','','error-snackbar');
      this.parameterData[index].asnBatchNumber = '';
      return;
    }


  }

  lpnFocusOut(event:any, lpnvalue: any, index:any){
     
    const lpnNumArray: any = []
    for (const [i, pdata] of this.parameterData.entries() ) {
      if(pdata.asnLpnNumber !== '' && index !== i ){
        lpnNumArray.push(pdata.asnLpnNumber);
      }
    }

    if(lpnNumArray.includes(lpnvalue)){
      this.openSnackBar('LPN number already exists','','error-snackbar');
      this.parameterData[index].asnLpnNumber = '';
      return;
    }


  }


  serialKeyPress(evt) {
    return
    var charCode = evt.which ? evt.which : evt.keyCode;
    var element  = evt.currentTarget.value;

     if ( (charCode < 65 || charCode > 122) || (charCode < 97 || charCode > 90) ){
       return false;
     }
     

    return true;
  }

  additemDetails(){
    for (const pdata of this.parameterData ) {
      if(pdata.asnBatchNumber === '' || pdata.asnLpnNumber === '' || 
         pdata.asnToSerial === '' || pdata.asnFromSerial === ''){
        this.openSnackBar('Please enter the all fields','','error-snackbar');
        return;
      }
    }

    let qtyToatal: any = 0
    for (const pdata of this.parameterData ) {
      qtyToatal = qtyToatal + Number(pdata.asnQuantity);
    }

    if(qtyToatal !== Number(this.data.element.quantity)){
      this.openSnackBar('Total quantity should be equal to ASN line quantity.','','error-snackbar');
      return;
    }
     
    const addArray    : any = [];
    const updateArray : any = [];
    for (const pdata of this.parameterData ) {
      if(!pdata.asnContentId){
        addArray.push({
          lineId: this.data.element.asnLineId ? this.data.element.asnLineId : null,
          lpnNum: pdata.asnLpnNumber,
          batchNum: this.data.itemData.batchFlag === 'Y' ?  pdata.asnBatchNumber: null,
          asnQty: pdata.asnQuantity,
          fromSerial: this.data.itemData.serialFlag === 'Y' ?  pdata.asnFromSerial : null,
          toSerial: this.data.itemData.serialFlag === 'Y' ?  pdata.asnToSerial: null,
          asnContentId: null,
          created_by: JSON.parse(localStorage.getItem('userDetails')).userId}
        )
      }else{
        updateArray.push({
          lineId: this.data.element.asnLineId ? this.data.element.asnLineId : null,
          lpnNum: pdata.asnLpnNumber,
          batchNum: this.data.itemData.batchFlag === 'Y' ?  pdata.asnBatchNumber: null,
          asnQty: pdata.asnQuantity,
          fromSerial: this.data.itemData.serialFlag === 'Y' ?  pdata.asnFromSerial : null,
          toSerial: this.data.itemData.serialFlag === 'Y' ?  pdata.asnToSerial: null,
          asnContentId: pdata.asnContentId,
          updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId
        })
      }
    }

    
    const data = {
      index        : this.data.index,
      addArray     : addArray,
      updateArray  : updateArray,
      deleteArray  : this.deleteArray,
      allLinesContent : this.parameterData
    }
    this.dialogRefPopup.close(data);
  }


  deleteContentRow(index: any){
     
    this.deleteArray.push(this.parameterData.splice(index,1)[0]);
    this.parameterDataSourceItemAsnLine = new MatTableDataSource<ParameterDataElementItemAsnLine>(this.parameterData);
    this.parameterDataSourceItemAsnLine.paginator = this.paginator;
  }


}
