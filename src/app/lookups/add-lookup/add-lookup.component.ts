import { Component, OnInit, ViewChild, Renderer, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormGroup, FormBuilder, Validators, NgModel, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LookupsService } from 'src/app/_services/lookups.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog, MatSort, Sort } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyService } from 'src/app/_services/company.service';


export interface ParameterDataElement {
    lookupId: number;
    lookupName: string;
    lookupMainDesc: string;
    lookupValue: string;
    lookupValueDesc: string;
    parentValue: string;
    parentValueList?: any;
    parentCode: string;
    effectiveFrom: Date;
    effectiveTo: Date;
    lookupEnabledFlag: boolean;
    lookupValueEnabledFlag: boolean;
    lookupCompanyId: number;
    createdBy: number;
    creationDate: string;
    updatedBy: number;
    updatedDate: string;
    action: string;
    editing: boolean;
    addNewRecord?: boolean;
    originalData?: any;
}

@Component({
    selector: 'app-add-lookup',
    templateUrl: './add-lookup.component.html',
    styleUrls: ['./add-lookup.component.css']
})
export class AddLookupComponent implements OnInit, AfterViewInit {
    formTitle = '';
    isEditable = false;
    isEdit = false;
    isAdd = false;
    currentDate: any = new Date();
    dataResult = false;
    dataResultLookupName = null;
    dataResultLookupMDesc = null;
    dataResultLookupEFlag = true;
    parameterDisplayedColumns: string[] = [
        'lookupId',
        'lookupValue',
        'lookupValueDesc',
        'parentCode',
        'parentValue',
        'effectiveFrom',
        'effectiveTo',
        'lookupValueEnabledFlag',
        'action'
    ];

    columns: any = [
        { field: 'lookupId', name: 'Code', width: 75, baseWidth: 8 },
        { field: 'lookupValue', name: 'Name', width: 75, baseWidth: 10 },
        {
            field: 'lookupValueDesc',
            name: 'Description',
            width: 75,
            baseWidth: 16
        },
        {
            field: 'parentCode',
            name: 'Parent Lookup',
            width: 75,
            baseWidth: 12
        },
        {
            field: 'parentValue',
            name: 'Parent Value',
            width: 75,
            baseWidth: 12
        },
        {
            field: 'effectiveFrom',
            name: 'Effective From',
            width: 75,
            baseWidth: 12
        },
        {
            field: 'effectiveTo',
            name: 'Effective To',
            width: 75,
            baseWidth: 10
        },
        {
            field: 'lookupValueEnabledFlag',
            name: 'Enable Flag',
            width: 75,
            baseWidth: 15
        },
        { field: 'action', name: 'Action', width: 75, baseWidth: 5 }
    ];

    public addNewRecord = false;
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    tooltipPosition: TooltipPosition[] = ['below'];
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    LookupsFormData: FormGroup;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    saveInprogress = false;
    allLookupList: any[] = [];
    lookupCompanyId = null;
    userCompanyId = null;
    standardCompanyId = 1;
    selectedRowIndex = null;
    isEditRoles = false;

    constructor(
        private render: Renderer,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private lookupService: LookupsService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        public commonService: CommonService
    ) {
        // this.LookupsForm();
    }

    nameControl = new FormControl('');

    ngOnInit() {
        this.userCompanyId = Number(
            JSON.parse(localStorage.getItem('userDetails')).companyId
        );
        this.route.params.subscribe(params => {
            if (params.data) {
                this.isEditable = true;
                this.isEdit = true;
                const tempData = JSON.parse(params.data);
                this.formTitle = 'Edit Lookup : ' + tempData.name;
                const obj = {
                    lookupName: tempData.name,
                    // lookupCompanyId: String(
                    //     JSON.parse(localStorage.getItem('userDetails'))
                    //         .companyId
                    // ),
                    lookupCompanyId: tempData.lookupCompanyId,
                    lookupEnabledFlag: tempData.enableFlag === true ? 'Y' : 'N'
                };
                this.lookupCompanyId = tempData.lookupCompanyId;
                this.lookupService.getLookups(obj).subscribe(data => {
                    if (data.status === 200) {
                        if (data.result.length > 0) {
                            this.dataResult = true;
                            this.dataResultLookupName =
                                data.result[0].lookupName;
                            this.dataResultLookupMDesc =
                                data.result[0].lookupMainDesc;
                            this.dataResultLookupEFlag =
                                data.result[0].lookupEnabledFlag === 'Y'
                                    ? true
                                    : false;
                            for (const rData of data.result) {
                                const obj = {
                                    lookupId: rData.lookupId,
                                    lookupName: rData.lookupName,
                                    lookupMainDesc: rData.lookupMainDesc
                                        ? rData.lookupMainDesc
                                        : null,
                                    lookupValue: rData.lookupValue,
                                    lookupValueDesc: rData.lookupValueDesc,
                                    parentValue: rData.parentValue,
                                    parentValueList: [],
                                    parentCode: rData.parentCode,
                                    effectiveFrom: rData.effectiveFrom,
                                    effectiveTo: rData.effectiveTo,
                                    lookupEnabledFlag:
                                        rData.lookupEnabledFlag === 'Y'
                                            ? true
                                            : false,
                                    lookupValueEnabledFlag:
                                        rData.lookupValueEnabledFlag === 'Y'
                                            ? true
                                            : false,
                                    lookupCompanyId: rData.lookupCompanyId,
                                    createdBy: rData.createdBy,
                                    creationDate: rData.creationDate,
                                    updatedBy: rData.updatedBy,
                                    updatedDate: rData.updatedDate,
                                    action: '',
                                    editing: false,
                                    originalData: {}
                                };
                                obj.originalData = Object.assign({}, obj);
                                this.parameterData.push(obj);
                            }
                            this.parameterDataSource = new MatTableDataSource<
                                ParameterDataElement
                            >(this.parameterData);
                            this.parameterDataSource.paginator = this.paginator;
                            // Sorting Start
                                 const sortState: Sort = {active: '', direction: ''};
                                 this.sort.active = sortState.active;
                                 this.sort.direction = sortState.direction;
                                 this.sort.sortChange.emit(sortState);
                            // Sorting End
                            this.parameterDataSource.sort = this.sort;

                        } else {
                            this.dataResult = false;
                        }
                    } else {
                        this.openSnackBar(data.message, '', 'error-snackbar');
                    }
                });
            } else {
                this.formTitle = 'Add lookup :';
                this.isEditable = false;
                this.isAdd = true;
                setTimeout(() => {this.addRow();},100);
            }
        });
        this.commonService.getScreenSize(110);
        this.getAllLookupList();
      
    }

    getAllLookupList() {
        const obj = {};
        this.allLookupList = [{ label: ' Please Select', value: '' }];
        this.lookupService.searchLookups(obj).subscribe((data: any) => {
            if (data.status === 200) {
                for (const rData of data.result) {
                    if (rData.lookupEnabledFlag === 'Y') {
                        this.allLookupList.push({
                            label: rData.lookupName,
                            value: rData.lookupName
                        });
                    } // end if
                } // end for loop
                this.allLookupList = this.allLookupList.sort((a, b) =>
                    a.label ? a.label.localeCompare(b.label) : a.label
                );
            }
        });
    }

    handleParentLookup(event, index, lookup) {
        if (event.source.selected && event.isUserInput === true) {
            this.parameterData[index].parentValueList = [];
            if (lookup.value === '') {
                this.parameterData[index].parentValue = '';
                return;
            }
            const obj = { lookupName: lookup.value };
            // this.parameterData[index].parentValue = '';
            this.lookupService.getLookups(obj).subscribe((data: any) => {
                if (data.status === 200) {
                    if (data.result.length > 0) {
                        for (const rData of data.result) {
                            const tempObj = {
                                label: rData.lookupValue,
                                value: rData.lookupValue
                            };
                            this.parameterData[index].parentValueList.push(
                                tempObj
                            );
                        }
                        this.parameterData[
                            index
                        ].parentValueList = this.parameterData[
                            index
                        ].parentValueList.sort((a, b) =>
                            a.label ? a.label.localeCompare(b.label) : a.label
                        );
                        if (this.parameterData[index].addNewRecord) {
                            this.parameterData[
                                index
                            ].parentValue = this.parameterData[
                                index
                            ].parentValueList[0].value;
                        }
                    }
                }
            });
        }
    }

    LookupsForm() {
        this.LookupsFormData = this.fb.group({
            lookupId: [null],
            lookupName: [''],
            lookupMainDesc: [''],
            lookupValue: ['', Validators.required],
            lookupValueDesc: ['', Validators.required],
            parentValue: [''],
            parentCode: [''],
            effectiveFrom: [null, Validators.required],
            effectiveTo: [null],
            lookupEnabledFlag: ['Y'],
            lookupCompanyId: [''],
            createdBy: [''],
            creationDate: [''],
            updatedBy: [''],
            updatedDate: ['']
        });
    }

    onSubmit(type: string) {
                               const dataArray: any[] = [];
                               if (
                                   !this.dataResultLookupName ||
                                   !this.dataResultLookupMDesc
                               ) {
                                this.nameControl.markAsTouched();
                                //    this.openSnackBar(
                                //        'Please enter lookup name and description',
                                //        '',
                                //        'default-snackbar'
                                //    );
                                //    return;
                               }
                               if (!this.parameterData.length) {
                                   this.openSnackBar(
                                       'Please enter lookup value',
                                       '',
                                       'default-snackbar'
                                   );
                                   return;
                               }

                               for (const [i,pData] of this.parameterData.entries()) {
                                   if (type === 'save') {
                                       if (pData.addNewRecord === true) {
                                           this.selectedRowIndex = null;
                                           if (
                                               pData.lookupValue &&
                                               pData.lookupValueDesc &&
                                               pData.effectiveFrom
                                           ) {
                                               dataArray.push(pData);
                                           } else {
                                               this.selectedRowIndex = i;
                                               this.openSnackBar(
                                                   'Please check mandatory fields','',
                                                   'default-snackbar'
                                               );
                                               return;
                                           }
                                       }
                                   } else {
                                       if (
                                           this.dataResultLookupName &&
                                           pData.editing === true
                                       ) {
                                           this.selectedRowIndex = null;
                                           if (
                                               pData.lookupValue &&
                                               pData.lookupValueDesc &&
                                               pData.effectiveFrom
                                           ) {
                                               dataArray.push(pData);
                                           } else {
                                               this.selectedRowIndex = i;
                                               this.openSnackBar(
                                                   'Please check mandatory fields in row ' +
                                                       (i + 1),
                                                   '',
                                                   'default-snackbar'
                                               );
                                               return;
                                           }
                                       }
                                   }
                               }
                               if (type === 'save') {
                                   this.addLookups(dataArray);
                               } else {
                                   const tempArray = [...this.parameterData];
                                   if (dataArray.length === 0) {
                                       for (const [i,pData] of tempArray.entries()) {
                                           tempArray[i].lookupMainDesc = this.dataResultLookupMDesc;
                                           dataArray.push(tempArray[i]);
                                       }
                                   }
                                   this.updateLookups(
                                       Object.assign([], dataArray)
                                   );
                               } 
                           }

    // add lookups
    addLookups(data) {
       
        this.saveInprogress = true;
        const body = [];
        data.forEach(dataElement => {
            body.push({
                lookupName: this.dataResultLookupName,
                lookupMainDesc: this.dataResultLookupMDesc,
                lookupValue: dataElement.lookupValue,
                lookupValueDesc: dataElement.lookupValueDesc,
                parentValue: dataElement.parentValue,
                parentCode: dataElement.parentCode,
                effectiveFrom: this.lookupService.dateFormat(
                    dataElement.effectiveFrom
                ),
                effectiveTo: dataElement.effectiveTo
                    ? this.lookupService.dateFormat(dataElement.effectiveTo)
                    : null,
                lookupEnabledFlag: this.dataResultLookupEFlag ? 'Y' : 'N',
                lookupValueEnabledFlag: dataElement.lookupValueEnabledFlag
                    ? 'Y'
                    : 'N',
                lookupCompanyId: dataElement.lookupCompanyId,
                createdBy: dataElement.createdBy,
                creationDate: '',
                updatedBy: dataElement.updatedBy,
                updatedDate: ''
            });
        });
        this.lookupService.createLookups(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.saveInprogress = false;
                    // this.openDialog('success', result.message);
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.backToLookupList();
                } else {
                    // this.openDialog('error', result.message);
                    this.saveInprogress = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    // aupdate lookups
    updateLookups(data) {
        this.saveInprogress = true;
        const body = [];
        data.forEach(dataElement => {
            body.push({
                lookupId: dataElement.lookupId,
                lookupName: dataElement.lookupName,
                lookupMainDesc: dataElement.lookupMainDesc,
                lookupValue: dataElement.lookupValue,
                lookupValueDesc: dataElement.lookupValueDesc,
                parentValue: dataElement.parentValue,
                parentCode: dataElement.parentCode,
                effectiveFrom: this.lookupService.dateFormat(
                    dataElement.effectiveFrom
                ),
                effectiveTo: dataElement.effectiveTo
                    ? this.lookupService.dateFormat(dataElement.effectiveTo)
                    : null,
                lookupEnabledFlag: this.dataResultLookupEFlag ? 'Y' : 'N',
                lookupValueEnabledFlag: dataElement.lookupValueEnabledFlag
                    ? 'Y'
                    : 'N',
                lookupCompanyId: dataElement.lookupCompanyId,
                createdBy: dataElement.createdBy,
                creationDate: '',
                updatedBy: dataElement.updatedBy,
                updatedDate: ''
            });
        });
        this.lookupService.updateLookups(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.saveInprogress = false;
                    // this.openDialog('success', result.message);
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.backToLookupList();
                } else {
                    // this.openDialog('error', result.message);
                    this.saveInprogress = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    onDateChanged(event: any, element: any) {
        element.effectiveTo = '';
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
            // this.isEdit = true;
            this.isEditRoles = true;

            this.render.setElementClass($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.isAdd = true;
            // this.isEdit = false;
            this.render.setElementClass($event.target, 'editIconEnable', false);
        }
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.checkIsAddRow();
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (rowData.editing === true) {
            // this.parameterData[index].lookupValue  = this.parameterData[index].originalData.lookupValue;
            this.parameterData[index].lookupValueDesc  = this.parameterData[index].originalData.lookupValueDesc;
            // this.parameterData[index].effectiveFrom  = this.parameterData[index].originalData.effectiveFrom;
            // this.parameterData[index].effectiveTo  = this.parameterData[index].originalData.effectiveTo;
            // this.parameterData[index].lookupValueEnabledFlag  = this.parameterData[index].originalData.lookupValueEnabledFlag;
            this.parameterData[index].editing = false;

        };
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

    addRow() {
        this.selectedRowIndex = null;
        this.paginator.pageIndex = 0;
        if (
            this.matTableRef.nativeElement.clientHeight >
            this.commonService.getTableHeight()
        ) {
            const elem = document.getElementById('customTable');
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
        this.isEdit = false;
        this.isEditRoles = false;
        this.parameterData.unshift({
            lookupId: null,
            lookupName: this.dataResultLookupName,
            lookupMainDesc: this.dataResultLookupMDesc,
            lookupValue: '',
            lookupValueDesc: '',
            parentValue: '',
            parentValueList: [],
            parentCode: '',
            effectiveFrom: this.currentDate,
            effectiveTo: null,
            lookupEnabledFlag: this.dataResultLookupEFlag,
            lookupValueEnabledFlag: true,
            lookupCompanyId: this.lookupService.companyId,
            createdBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            creationDate: this.lookupService.dateFormat(new Date()),
            updatedBy: JSON.parse(localStorage.getItem('userDetails')).userId,
            updatedDate: this.lookupService.dateFormat(new Date()),
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
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

    backToLookupList() {
        this.router.navigate(['lookups']);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.connect().subscribe(d => {
            this.parameterDataSource.sortData(
                this.parameterDataSource.filteredData,
                this.parameterDataSource.sort
            );
        });
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
        this.commonService.getScreenSize(110);
    }
}
