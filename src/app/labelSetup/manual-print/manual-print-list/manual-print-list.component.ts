import {
    Component,
    OnInit,
    ViewChild,
    Renderer2,
    ElementRef,
    HostListener,
    AfterViewInit,
    Inject,
    Optional
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
    MatTableDataSource,
    MatSnackBar,
    MatPaginator,
    TooltipPosition,
    MatDialogRef,
    MatDialog,
    MatTable,
    MatSort,
    Sort,
    MAT_DIALOG_DATA
} from '@angular/material';
import { ManualPrintService } from 'src/app/_services/labelSetup/manual-print.service';
import { PrinterManagerService } from 'src/app/_services/labelSetup/printer-manager.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface ParameterDataElement {
    parameter?: string;
    value: string;
    type?: string;
    id?: number;
    action: string;
    editing: boolean;
    addNewRecord?: boolean;
    originalData?: any;
    isDefault?: any;
}
@Component({
    selector: 'app-manual-print-list',
    templateUrl: './manual-print-list.component.html',
    styleUrls: ['./manual-print-list.component.css']
})
export class ManualPrintListComponent implements OnInit {
    isEditRoles = false;
    isAdd = false;
    isEdit = false;
    parameterData: ParameterDataElement[] = [];
    soLineDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    formTitle: string;
    manualPrintForm: FormGroup;
    labelList: any[] = [];
    typeList: any[] = [];
    printerList: any[] = [];
    listProgress = false;
    screenMaxHeight: any;
    labelMessage = 'No data found';
    preview = false;
    disablePreviewBtn = false;

    soLineDisplayedColumns: string[] = ['parameter', 'value', 'action'];
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    tooltipPosition: TooltipPosition[] = ['below'];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    columns: any = [
        { field: 'parameter', name: 'Parameter', width: 75, baseWidth: 40 },
        { field: 'value', name: 'Value', width: 75, baseWidth: 50 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
    ];
    validationMessages = {
        label: {
            required: 'Label is required.'
        },
        printer: {
            required: 'Printer Name is required.'
        },
        copies: {
            required: 'Copies is required.'
        }
    };

    manualPrintFormErrors = {
        label: '',
        printer: '',
        copies: ''
    };
    constructor(
        private fb: FormBuilder,
        public router: Router,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public commonService: CommonService,
        private manualPrintService: ManualPrintService,
        private printerManagerService: PrinterManagerService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.formTitle = 'Manual print :';
        this.salesOrderFeedForm();
        this.getLabelLOV();
        this.getTypeLOV();
        this.getPrinterLOV();
        this.manualPrintForm.patchValue({
            copies: '1'
        });
        // this.getLabelTableData();
    }

    // Get Label Table data
    // getLabelTableData() {
    //     this.labelList = [];
    //     this.manualPrintService.getLabel().subscribe((data: any) => {
    //         for (const [index, pData] of data.entries()) {
    //             const obj = {
    //                 parameter: pData.soLineId,
    //                 value: pData.soLineId,
    //                 action: '',
    //                 editing: false,
    //                 addNewRecord: false
    //             };
    //             obj['originalData'] = Object.assign({}, obj);
    //             this.parameterData.push(obj);
    //             // this.getUOMList(pData.soItemId, index );
    //         }
    //         this.soLineDataSource = new MatTableDataSource<
    //             ParameterDataElement
    //         >(this.parameterData);
    //         // this.soLineDataSource.paginator = this.paginator;
    //         this.soLineDataSource.sort = this.sort;
    //         this.soLineDataSource.connect().subscribe(d => {
    //             this.soLineDataSource.sortData(
    //                 this.soLineDataSource.filteredData,
    //                 this.soLineDataSource.sort
    //             );
    //         });
    //     });
    // }

    // Get Label LOV
    getLabelLOV() {
        this.labelList = [];
        this.manualPrintService.getLabel().subscribe((data: any) => {
            for (const response of data) {
                this.labelList.push({
                    value: response.name,
                    label: response.name,
                    id: response.id
                });
            }
            this.manualPrintForm.patchValue({
                label: this.labelList[0].value
            });
        });
    }

    // Get Type LOV
    getTypeLOV() {
        this.typeList = [];
        this.commonService.getLookupLOV('LABEL_TYPE').subscribe((data: any) => {
            for (const rowData of data.result) {
                this.typeList.push({
                    value: rowData.lookupValue,
                    label: rowData.lookupValueDesc
                });
            }
        this.manualPrintForm.patchValue({ type: this.typeList[0].value });
        });
        //  
    }

    // Get Printer LOV
    getPrinterLOV() {
        // this.printerList = [{ label: ' Please Select', value: '' }];
        this.printerManagerService
            .getPrinterLOV('admin@visioncorp.com')
            .subscribe((data: any) => {
                for (const rowData of data) {
                    this.printerList.push({
                        value: rowData.name,
                        label: rowData.name
                    });
                }
                this.manualPrintForm.patchValue({ printer: this.printerList[0].value });
            });
    }

    // Label Selection Changed
    labelSelectionChanged(event: any, name: string) {
        if (event.source.selected && event.isUserInput) {
            this.parameterData = [];
            this.listProgress = true;
            this.manualPrintService
                .getHistoryPrintByLabel(name)
                .subscribe((data: any) => {
                    this.listProgress = false;
                    if(data && data.length !== 0){
                        this.disablePreviewBtn = false;
                    for (const [index, pData] of JSON.parse(
                        data[0].parameter
                    ).entries()) {
                         ;
                        const obj = {
                            parameter: pData.Parameter,
                            value: pData.Value,
                            type: pData.Type,
                            action: '',
                            editing: false,
                            addNewRecord: false,
                            isDefault: true
                        };
                        obj['originalData'] = Object.assign({}, obj);
                        this.parameterData.push(obj);
                    }
                    this.soLineDataSource = new MatTableDataSource<
                        ParameterDataElement
                    >(this.parameterData);
                }else{
                    this.soLineDataSource = new MatTableDataSource<ParameterDataElement>(this.parameterData);
                    this.listProgress = false;
                   // this.disablePreviewBtn = true;
                }
                // Sorting Start
                    const sortState: Sort = {active: '', direction: ''};
                    this.sort.active = sortState.active;
                    this.sort.direction = sortState.direction;
                    this.sort.sortChange.emit(sortState);
                // Sorting End
                    this.soLineDataSource.sort = this.sort;
                    this.soLineDataSource.connect().subscribe(d => {
                        this.soLineDataSource.sortData(
                            this.soLineDataSource.filteredData,
                            this.soLineDataSource.sort
                        );
                    });
                });
               
        }
    }

    // Form Group
    salesOrderFeedForm() {
        this.manualPrintForm = this.fb.group({
            label: ['', Validators.required],
            type: [''],
            printer: ['', Validators.required],
            copies: ['', Validators.required]
        });
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
            this.isEditRoles = true;
            this.isEdit = true;
            rowData.showLov = 'hide';
            rowData.inlineSearchLoader = 'hide';
            rowData.searchValue = rowData.itemName;
        } else {

        }
    }
    disableEdit(rowData: any, index: any) {
        if (rowData.editing === true) {
            this.parameterData[index].isDefault = this.parameterData[
                index
            ].originalData.isDefault;
            this.parameterData[index].parameter = this.parameterData[
                index
            ].originalData.parameter;
            this.parameterData[index].value = this.parameterData[
                index
            ].originalData.value;
            this.parameterData[index].editing = false;
            this.isEditRoles = false;
            this.isEdit = false;
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.parameterData.splice(rowIndex, 1);
        this.soLineDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.soLineDataSource.paginator = this.paginator;
        this.checkIsAddRow();
        let count = this.parameterData.length + 1;
        // for (const pData of this.parameterData) {
        //     pData.soLineNumber = --count;
        // }
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
    onSubmit(event: any, formId: any) {
        if (event) {
            event.stopImmediatePropagation();
            if (this.manualPrintForm.valid) {
                let tempObj: any = {};
                const body = [];
                const finalArray = [];
                tempObj.label = this.manualPrintForm.value.label;
                tempObj.printer = this.manualPrintForm.value.printer;
                tempObj.copies = this.manualPrintForm.value.copies;
                formId === 'Preview'
                    ? (this.preview = true)
                    : (this.preview = false);

                this.parameterData.forEach(dataElement => {
                    let parameterObj: any = {};
                    // parameterObj = Object.assign({}, dataElement);
                    parameterObj.Parameter = dataElement.parameter;
                    parameterObj.Type = dataElement.type;
                    parameterObj.Value = dataElement.value;
                    // delete parameterObj.Id;
                    // delete tempObj.IsActive;
                    // delete tempObj.action;
                    // delete tempObj.createdBy;
                    // delete tempObj.updatedBy;
                    body.push(parameterObj);
                    if (dataElement.editing === true) {
                        dataElement.editing = false;
                        this.isEdit = false;
                    }
                });
                tempObj.parameter = body;
                finalArray.push(tempObj);
                let dataObj = { Data: [], Preview:false, AppUserName: '' };
                dataObj = {
                    Data: finalArray,
                    Preview :formId === 'Preview' ? true : false,
                    AppUserName: 'admin@visioncorp.com'
                };
                this.disablePreviewBtn = true;
                this.listProgress = true;
                this.manualPrintService.printManualPrint(dataObj).subscribe(
                    result => {
                        this.isAdd = false;
                         
                        if (result.length && typeof result !== "string") {
                            this.listProgress = false;
                            if (this.preview === true) {                                
                                const previewdialogRef = this.dialog.open(
                                    // tslint:disable-next-line: no-use-before-declare
                                    ManualPrintPreviewDialogComponent,
                                    {
                                        width: '70vw',
                                        data: this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${result}`)
                                    }
                                );
                                previewdialogRef
                                    .afterClosed()
                                    .subscribe(response => { 
                                        this.enablePrintBtn();
                                        if (response !== undefined) {
                                            
                                            // this.editInventoryOrg(response, '');
                                        }
                                    });
                            }else{
                            this.disablePreviewBtn = false;
                            this.openSnackBar(
                                'Label has been printed',
                                '',
                                'success-snackbar'
                            );
                            }
                        } else {
                            this.listProgress = false;
                            this.openSnackBar(result, '', 'error-snackbar');
                            this.disablePreviewBtn = false;
                        }
                    },
                    (response: any) => {
                        this.disablePreviewBtn = false;
                        this.listProgress = false;
                        if (response.status === 200) {
                            this.isAdd = false;
                            this.openSnackBar(
                                response.error.text,
                                '',
                                'success-snackbar'
                            );
                            // for (const obj of data) {
                            //     obj.editing = false;
                            //     obj.addNewRecord = false;
                            // }
                        } else {
                            this.openSnackBar(
                                response.error.text,
                                '',
                                'error-snackbar'
                            );
                        }
                    }
                );
            } else {
                this.manualPrintLogValidationErrors();
                this.disablePreviewBtn = false;
                 this.listProgress = false;
                this.openSnackBar(
                    'Please check mandatory fields',
                    '',
                    'default-snackbar'
                );
            }
        }
    }

    enablePrintBtn(){
        this.disablePreviewBtn = false;
    }

    manualPrintLogValidationErrors(
        group: FormGroup = this.manualPrintForm
    ): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.manualPrintLogValidationErrors(abstractControl);
            } else {
                this.manualPrintFormErrors[key] = '';
                if (
                    abstractControl &&
                    !abstractControl.valid &&
                    (abstractControl.touched || abstractControl.dirty)
                ) {
                    const messages = this.validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.manualPrintFormErrors[key] +=
                                messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }
    ngAfterViewInit() {
        this.soLineDataSource.sort = this.sort;
        setTimeout(() => {
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
        this.commonService.getScreenSize(-25);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }
}


@Component({
    selector: 'app-manual-print-preview-dialog',
    templateUrl: './manual-print-preview-dialog.html'
    // providers: [MatDialogData]
})
export class ManualPrintPreviewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ManualPrintPreviewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}