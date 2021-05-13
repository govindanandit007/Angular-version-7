import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_services/common/common.service';
import { CycleCountService } from 'src/app/_services/warehouse/cycle-count.service';
import { MatTableDataSource, MatPaginator, TooltipPosition, MatSort,Sort, MatTable, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { Subscription } from 'rxjs';

export interface ParameterDataElement {
  id?                     : number;
  classId                 : string;
  className               : string;
  itemId                  : number;
  itemName?              : string;
  showLov?                : string,
  searchValue?            : string,
  inlineSearchLoader?     : string,
  itemList?               : any;
  description             : string;
  revisionId              : string;
  revisionNum             : string;
  itemAssignRevisionList? : any;
  assignmentId?           : number;
  tableClassLov?          : any;
  originalData?           : any;
  action?                 : string;
  editing?                : boolean;
  addNewRecord?           : boolean;
}

@Component({
    selector: 'app-item-assignment',
    templateUrl: './item-assignment.component.html',
    styleUrls: ['./item-assignment.component.css']
})
export class ItemAssignmentComponent implements OnInit, AfterViewInit {
    classValue: any = '';
    classLov: any = [{ label: ' Please Select', value: '' }];
    isEdit: any = false;
    isAdd = false;
    isSave = false;
    listProgress = false;
    showLov = 'hide';
    inlineSearchLoader = 'hide';
    currentDeletedItemAssignment: any = {};
    currentClassLabel: any = '';
    saveInprogress = false;

    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    parameterDisplayedColumns: string[] = [
        'id',
        'classId',
        'itemName',
        'description',
        'action'
    ];
    routingTableMessage = '';

    columns: any = [
        { field: 'id', name: '#', width: 75, baseWidth: 5 },
        { field: 'classId', name: 'Class', width: 75, baseWidth: 15 },
        { field: 'itemName', name: 'Item', width: 75, baseWidth: 25 },
        // {field: 'revisionNum', name: 'Item Revision', width: 75, baseWidth: 10 },
        { field: 'description', name: 'Description', width: 75, baseWidth: 45 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 10 }
    ];

    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    pageSizeValue: any;
    tooltipPosition: TooltipPosition[] = ['below'];
    selectedRowIndex = null;
    constructor(
        public commonService: CommonService,
        public cycleCountService: CycleCountService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.commonService.getScreenSize(30);
        this.getClassList();
    }

    getClassList() {
        this.classLov = [{ label: ' Please Select', value: '' }];
        this.commonService.getLookupLOV('CYCLE_COUNT_CLASS').subscribe(
            (data: any) => {
                if (data.result) {
                    for (const rowData of data.result) {
                        this.classLov.push({
                            label: rowData.lookupValueDesc,
                            value: rowData.lookupValue
                        });
                    }
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    getItemList(classData) {
        this.parameterData = [];
        this.listProgress = true;
        this.cycleCountService
            .getItemByClassForAssignment(classData.value)
            .subscribe(
                (data: any) => {
                    if (data.result) {
                        this.listProgress = false;
                        let tempObj: any = {};
                        for (const rowData of data.result) {
                            tempObj = {
                                classId: classData.value,
                                className: classData.label,
                                itemId: rowData.ccItemId,
                                itemName: rowData.itemName,
                                revisionId: rowData.ccRevisionId,
                                revisionNum: rowData.itemRevisionNum,
                                assignmentId: rowData.ccAssignmentId,
                                description: rowData.itemDescription,
                                tableClassLov: this.classLov,
                                editing: false,
                                addNewRecord: false
                            };
                            tempObj.originalData = Object.assign({}, tempObj);
                            this.parameterData.push(tempObj);
                            tempObj = {};
                        }
                        this.parameterDataSource = new MatTableDataSource<
                            ParameterDataElement
                        >(this.parameterData);
                      
                        // Sorting Start
                           const sortState: Sort = {active: '', direction: ''};
                           this.sort.active = sortState.active;
                           this.sort.direction = sortState.direction;
                           this.sort.sortChange.emit(sortState);
                        // Sorting End
                        this.parameterDataSource.sort = this.sort;
                        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                        this.parameterDataSource.paginator = this.paginator;

                        // this.parameterDataSource.connect().subscribe(d => {
                        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                        // });
                    } else {
                        this.listProgress = false;
                    }
                },
                (error: any) => {
                    this.listProgress = false;
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
    }

    classChanged(event: any, data: any) {
        if (
            event.source.selected &&
            event.isUserInput === true &&
            data.value !== ''
        ) {
            this.isEdit = false;
            this.currentClassLabel = data.label;
            this.getItemList(data);
        } else {
            this.parameterData = [];
            this.parameterDataSource = new MatTableDataSource<
                ParameterDataElement
            >(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
        }
    }

    fetchNewSearchList(event: any, index: any, searchFlag: any, value: any) {
        let charCode = event.which ? event.which : event.keyCode;
        if (charCode === 9) {
            event.preventDefault();
            charCode = 13;
        }

        if (!searchFlag && charCode !== 13) {
            return;
        }

        if (this.parameterData[index].showLov === 'hide') {
           
            this.parameterData[index].inlineSearchLoader = 'show';
            this.getItemLovByScreen(
                this.parameterData[index].searchValue,
                index,
                event
            );
        } else {
            this.parameterData[index].showLov = 'hide';
            this.parameterData[index].searchValue = '';
            this.parameterData[index].itemId = null;
        }
    }

    inlineClassChanged(event: any, itemDetails: any, index: any) {
        if (event.source.selected && event.isUserInput === true) {
            this.parameterData[index].className = itemDetails.label;
            this.parameterData[index].classId = itemDetails.value;
        }
    }

    getItemLovByScreen(itemName, index, event) {
        this.commonService
            .getItemLovByScreen('item', 'item-assignment', null, itemName)
            .subscribe(
                (data: any) => {
                    this.parameterData[index].itemList = [
                        {
                            key: '',
                            viewValue: ' Please Select',
                            itemDescription: ''
                        }
                    ];

                    if (data.result && data.result.length) {
                        data = data.result;
                        this.parameterData[index].itemList = [];
                        for (let i = 0; i < data.length; i++) {
                            this.parameterData[index].itemList.push({
                                value: data[i].itemId,
                                label: data[i].itemName,
                                data: data[i]
                            });
                        }
                        this.parameterData[index].inlineSearchLoader = 'hide';
                        this.parameterData[index].showLov = 'show';
                        this.parameterData[index].searchValue = '';

                        // Set the first element of the search

                        this.parameterData[index].itemId = data[0].itemId;
                    } else {
                        this.parameterData[index].inlineSearchLoader = 'hide';
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

    getRevisionlist(itemId, index) {
        this.commonService.getRevisionLovByItem(itemId).subscribe(
            (data: any) => {
                if (data.status === 200) {
                    if (!data.message) {
                        this.parameterData[index].itemAssignRevisionList = [];
                        this.parameterData[index].revisionNum =
                            data.result[0].revsnNumber;
                    } else {
                        this.parameterData[index].itemAssignRevisionList = [
                            {
                                value: '',
                                label: ' Please Select'
                            }
                        ];
                        this.parameterData[index].revisionNum = '';
                    }
                    if(data.result){
                    for (const rowData of data.result) {
                        this.parameterData[index].itemAssignRevisionList.push({
                            value: rowData.revsnId,
                            label: rowData.revsnNumber
                        });
                    }
                }
                } else {
                    this.openSnackBar(data.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    inlineItemChanged(event: any, itemDetails: any, index: any) {
        if (event.source.selected && event.isUserInput === true) {
            //this.parameterData[index].revisionNum = itemDetails.data.revsnNumber ? itemDetails.data.revsnNumber : '-';
            //this.parameterData[index].revisionId  = itemDetails.data.revsnId ? itemDetails.data.revsnId : null ;
            this.parameterData[index].description = itemDetails.data
                .itemDescription
                ? itemDetails.data.itemDescription
                : '-';
            this.parameterData[index].itemName = itemDetails.label;
            this.parameterData[index].itemId = itemDetails.value;
            this.getRevisionlist(itemDetails.value, index);
        }
    }

    beginEdit(rowData: any, $event: any, index: any) {
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
        this.isEdit = true;
        if (rowData.editing === false) {
            rowData.editing = true;
            this.isAdd = false;
            rowData.showLov = 'hide';
            rowData.inlineSearchLoader = 'hide';
            rowData.searchValue = rowData.itemName;
            this.getItemLovByScreen(
                this.parameterData[index].searchValue,
                index,
                $event
            );
        } else {
            // rowData.editing = false;
            // this.isAdd = true;
            //   this.isEditRoles = false;
            // this.render.setStyle($event.target, 'editIconEnable', false);
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        if (this.parameterData[index].editing === true) {
            this.parameterData[index].classId = this.parameterData[
                index
            ].originalData.classId;
            this.parameterData[index].className = this.parameterData[
                index
            ].originalData.className;
            this.parameterData[index].itemId = this.parameterData[
                index
            ].originalData.itemId;
            this.parameterData[index].itemName = this.parameterData[
                index
            ].originalData.itemName;
            this.parameterData[index].description = this.parameterData[
                index
            ].originalData.description;
            this.parameterData[index].revisionId = this.parameterData[
                index
            ].originalData.revisionId;
            this.parameterData[index].revisionNum = this.parameterData[
                index
            ].originalData.revisionNum;

            this.parameterData[index].editing = false;
        }

        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
        this.isSave = false;
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.checkIsAddRow();
        this.isSave = false;
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
         // Sorting will work in ascending order when page add new row function call
         this.sort.sort({id: '', start: 'asc', disableClear: false});
        this.isAdd = true;
        this.isEdit = false;
        this.isSave = true;
        this.parameterData.unshift({
            classId: '',
            className: '',
            itemId: null,
            itemName: '',
            description: '',
            revisionId: null,
            revisionNum: '',
            showLov: 'hide',
            inlineSearchLoader: 'hide',
            searchValue: '',
            tableClassLov: this.classLov,
            editing: true,
            addNewRecord: true,
            action: ''
        });
        this.parameterDataSource = new MatTableDataSource<ParameterDataElement>(
            this.parameterData
        );
        this.parameterDataSource.paginator = this.paginator;
        this.parameterDataSource.sort = this.sort;
        this.commonService.setPaginationSize(event)
        // this.parameterDataSource.connect().subscribe(d => {
        // this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);
        // });
    }

    deleteItemAssignment() {
        const rowIndex = this.currentDeletedItemAssignment.rowIndex;

        const id: any = this.parameterData[rowIndex].assignmentId;
        this.cycleCountService.deleteItemAssignment(id).subscribe(
            (data: any) => {
                if (data && data.status === 200) {
                    this.parameterData.splice(rowIndex, 1);
                    this.parameterDataSource = new MatTableDataSource<
                        ParameterDataElement
                    >(this.parameterData);
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    // this.parameterDataSource.connect().subscribe(d => {
                    //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
                    // });
                    this.dialog.closeAll();
                    this.openSnackBar(data.message, '', 'success-snackbar');
                } else {
                    this.openSnackBar(data.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }

    onSubmit(type) {
        if (!this.parameterData.length) {
            this.openSnackBar('Please add any record', '', 'error-snackbar');
            return;
        }
        const dataArray: any[] = [];
        this.saveInprogress = true;
        for (const [i, pData] of this.parameterData.entries()) {
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null;
                    if (pData.itemId && pData.classId && !pData.assignmentId) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i].inlineSearchLoader = 'hide';
                        this.parameterData[i].showLov = 'hide';
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i+1),
                            '',
                            'error-snackbar'
                        );
                        return;
                    }
                }
            } else {
                if (pData.editing === true) {
                  this.selectedRowIndex = null;
                    if (pData.itemId && pData.classId) {
                        this.parameterData[i].originalData = {};
                        delete pData.originalData;
                        this.parameterData[i].editing = true;
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].inlineSearchLoader = 'hide';
                        this.parameterData[i].showLov = 'show';
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                        
                        dataArray.push(pData);
                    } else {
                        this.selectedRowIndex = i;
                        this.saveInprogress = false;
                        this.openSnackBar(
                            'Please fill required fields in row ' + (i+1),
                            '',
                            'error-snackbar'
                        );
                        return;
                    }
                }
            }
        }
        if (type === 'save') {
            this.createItemAssignment(dataArray);
        } else {
            console.log('else update-'+ dataArray.toString());
            this.updateItemAssignment(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            console.log('forloop-'+ i);
            this.parameterData[i].editing = false;
            this.parameterData[i].showLov = 'hide';
        }
        console.log(dataArray);
    }

    createItemAssignment(data) {
        const body = [];
        let tempObj: any = {};
        for (const dataElement of data) {
            tempObj.createdBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;

            //tempObj.ccAssignmentId = null;
            tempObj.ccClassCode = dataElement.classId;
            tempObj.ccItemId = dataElement.itemId;

            tempObj.ccRevisionId =
                dataElement.revisionId !== ''
                    ? Number(dataElement.revisionId)
                    : null;

            body.push(tempObj);
            tempObj = {};
        }
        this.cycleCountService.createItemAssignment(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isAdd = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    const event = {
                        source: { selected: true },
                        isUserInput: true
                    };
                    this.classChanged(event, {
                        label: this.currentClassLabel,
                        value: this.classValue
                    });
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    this.isSave = false;
                    this.saveInprogress = false;
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.isAdd = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itemAssign of data) {
                    itemAssign.editing = true;
                    itemAssign.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    updateItemAssignment(data) {
        const body = [];
        let tempObj: any = {};
        for (const dataElement of data) {
            tempObj.updatedBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;
            tempObj.ccAssignmentId = dataElement.assignmentId;
            tempObj.ccClassCode = dataElement.classId;
            tempObj.ccItemId = dataElement.itemId;
            tempObj.ccRevisionId =
                dataElement.revisionId !== ''
                    ? Number(dataElement.revisionId)
                    : null;

            body.push(tempObj);
            tempObj = {};
        }
        this.cycleCountService.updateItemAssignment(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    const event = {
                        source: { selected: true },
                        isUserInput: true
                    };
                    this.classChanged(event, {
                        label: this.currentClassLabel,
                        value: this.classValue
                    });
                    this.parameterDataSource.paginator = this.paginator;
                    this.parameterDataSource.sort = this.sort;
                    this.saveInprogress = false;
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.isEdit = true;
                // Apply Changes To edit all unsaved records : 06-02-2020 (By Manoj Kumar)
                for (const itemAssign of data) {
                    itemAssign.editing = true;
                    itemAssign.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    // open dialog
    openDialog(
        templateRef: TemplateRef<any>,
        element: any,
        event: any,
        rowIndex: any
    ) {
        this.currentDeletedItemAssignment['element'] = element;
        this.currentDeletedItemAssignment['rowIndex'] = rowIndex;
        this.dialog.open(templateRef);
    }

    @HostListener('window:resize', [])
    onResize(): void {
        this.commonService.getScreenSize(30);
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
    }
     
    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
        // this.parameterDataSource.connect().subscribe(d => {
        //     this.parameterDataSource.sortData(this.parameterDataSource.filteredData,this.parameterDataSource.sort);
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

    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;             
     this.parameterData = this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);      
       
    }
}





