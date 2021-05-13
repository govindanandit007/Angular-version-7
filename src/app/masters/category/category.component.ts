import {
    Component,
    OnInit,
    ViewChild,
    Renderer2,
    Output,
    EventEmitter,
    OnDestroy,
    ElementRef,
    HostListener,
    AfterViewInit
} from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource, MatDialogRef, MatDialog, MatTable, MatSort } from '@angular/material';
import { NgModel } from '@angular/forms';
import { CategoryService } from 'src/app/_services/masters/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

export interface CategoryDataElement {
    No?: number;
    categoryId?: number;
    categoryCode: string;
    categoryName1: string;
    categoryName2: string;
    categoryName3: string;
    categoryName4: string;
    categoryName5: string;
    categoryEnabledFlag: boolean;
    action?: string;
    addNewRecord?: boolean;
    editing?: boolean;
    originalData?: any;
}
@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    parameterData: CategoryDataElement[] = [];
    tempParameterData: CategoryDataElement[] = [];
    categoryDataSource = new MatTableDataSource<CategoryDataElement>(
        this.parameterData
    );
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    isEditable = false;
    isEdit = false;
    isAdd = false;
    searchEnable: boolean;
    showSearch = true;
    private searchInfoArrayunsubscribe: any;
    categoryMessage = '';
    listProgress = false;
    saveInprogress = false;
    refreshSearchLov: any = '';

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    categoryDisplayedColumns: string[] = [
        'No',
        'categoryCode',
        'categoryName1',
        'categoryName2',
        'categoryName3',
        'categoryName4',
        'categoryName5',
        'categoryEnabledFlag',
        'action'
    ];
    columns: any = [
        { field: 'No', name: '#', width: 75, baseWidth: 5 },
        {
            field: 'categoryCode',
            name: 'Category Code',
            width: 150,
            baseWidth: 13
        },
        {
            field: 'categoryName1',
            name: 'Category Name 1',
            width: 150,
            baseWidth: 13
        },
        {
            field: 'categoryName2',
            name: 'Category Name 2',
            width: 100,
            baseWidth: 13
        },
        {
            field: 'categoryName3',
            name: 'Category Name 3',
            width: 100,
            baseWidth: 13
        },
        {
            field: 'categoryName4',
            name: 'Category Name 4',
            width: 100,
            baseWidth: 13
        },
        {
            field: 'categoryName5',
            name: 'Category Name 5',
            width: 100,
            baseWidth: 13
        },
        {
            field: 'categoryEnabledFlag',
            name: 'Enable Flag',
            width: 100,
            baseWidth: 9
        },
        { field: 'action', name: 'Action', width: 80, baseWidth: 8 }
    ];
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;
    selectedRowIndex = null;
    constructor(
        private categoryService: CategoryService,
        private snackBar: MatSnackBar,
        private render: Renderer2,
        public dialog: MatDialog,
        public commonService: CommonService,
        private http: HttpClient,
        public router: Router,
    ) {
        this.searchEnable = true;
    }
    dataForSearch: any = '';
    searchJson: any = this.http.get(
        './assets/search-jsons/category-search.json'
    );

    ngOnInit() {
        this.showSearch = true;

        this.categoryDataSource.paginator = this.paginator;
        this.commonService.getScreenSize(-84); 
        this.searchJson.subscribe((resultData: any) => {
            this.dataForSearch = resultData;
            this.searchForCategory();
            this.searchCategory();
        });

        const graphSearchData = JSON.parse(localStorage.getItem('graphSearchData'));
        if(graphSearchData !== null){
            this.search(graphSearchData);
            localStorage.removeItem('graphSearchData');
        }
        this.categoryDataSource.sort = this.sort;
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

    searchCategory() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (categorySearchInfo: any) => {
                this.isEdit = false;
                // This code is used for updating the search module lovs when we update or add data
                const checksearchSource = this.checkSearch();
                if (checksearchSource === true) {
                    return;
                }

                // This code is used for not loading the search result when module loads
                if (categorySearchInfo.fromSearchBtnClick === true) {
                    this.customTable.nativeElement.scrollLeft = 0;
                    this.selectedRowIndex = null;
                    //    categorySearchInfo.fromSearchBtnClick = false;
                    //    this.commonService.getsearhForMasters(categorySearchInfo);
                    this.parameterData = [];
                    this.categoryDataSource = new MatTableDataSource();
                    this.categoryDataSource.sort = this.sort;
                    setTimeout(() => {
                        this.categoryDataSource.paginator = this.paginator;
                    }, 1000);
                    this.categoryMessage = '';
                    // this.categoryMessage = 'No category defined.';

                    if (categorySearchInfo.searchType === 'category') {
                        this.search(categorySearchInfo.searchArray);
                    }
                } else {
                    return;
                }
            }
        );
    }
    // show / hide search section
    getSearchToggle(searchToggle: boolean) { 
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }
    // search for Category
    searchForCategory() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }
    // search for Category
    searchComponentOpen() {
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    search(data){
        this.isEdit = false;
        this.isAdd = false;
        this.listProgress = true;
        // Sorting will work in ascending order when page search function call
        this.categoryService
            .getCategorySearch(data)
            .subscribe(
                (data: any) => {
                    this.listProgress = false;
                    if (data.status === 200) {
                        if (!data.message) {
                            this.parameterData = [];
                            for (const rowData of data.result) {
                                if (
                                    rowData.categoryEnabledFlag ===
                                    'N'
                                ) {
                                    rowData.categoryEnabledFlag = false;
                                } else {
                                    rowData.categoryEnabledFlag = true;
                                }
                                rowData.action = '';
                                rowData.editing = false;
                                rowData[
                                    'originalData'
                                ] = Object.assign({}, rowData);
                                this.parameterData.push(
                                    rowData
                                );
                            }
                            this.categoryDataSource = new MatTableDataSource<
                                CategoryDataElement
                            >(this.parameterData);
                            this.categoryDataSource.paginator = this.paginator;
                            this.sort.sort({id: '', start: null , disableClear: false});
                            this.categoryDataSource.sort = this.sort;
                        } else {
                            this.categoryMessage = data.message;
                        }
                    } else {
                        this.openSnackBar(
                            data.message,
                            '',
                            'default-snackbar'
                        );
                    }
                },
                (error: any) => {
                    this.listProgress = false;
                    this.openSnackBar(error.error.message, '', 'error-snackbar');
                }
            );
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';

        this.refreshSearchLov = '';
        this.commonService.getsearhForMasters([]);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
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
            this.isEdit = true;
            // this.render.setStyle($event.target, 'editIconEnable', true);
        } else {
            // rowData.editing = false;
            // this.render.setStyle($event.target, 'editIconEnable', false);
        }

        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }
    }

    disableEdit(rowData: any, index: any) {
        this.selectedRowIndex = null;
        //if (this.parameterData[index].editing === true) {
             
        if(rowData.editing === true){
                //this.isEdit = false;
            this.parameterData[index].categoryCode = this.parameterData[
                index
            ].originalData.categoryCode;
            this.parameterData[index].categoryEnabledFlag = this.parameterData[
                index
            ].originalData.categoryEnabledFlag;
            this.parameterData[index].categoryName1 = this.parameterData[
                index
            ].originalData.categoryName1;
            this.parameterData[index].categoryName2 = this.parameterData[
                index
            ].originalData.categoryName2;
            this.parameterData[index].categoryName3 = this.parameterData[
                index
            ].originalData.categoryName3;
            this.parameterData[index].categoryName4 = this.parameterData[
                index
            ].originalData.categoryName4;
            this.parameterData[index].categoryName5 = this.parameterData[
                index
            ].originalData.categoryName5;
            this.parameterData[index].editing = false;
        } 
        if (
            this.parameterData.find(({ editing }) => editing === true) ===
            undefined
        ) {
            this.isEdit = false;
        }        
    }

    deleteRow(rowData: any, rowIndex: number) {
        this.selectedRowIndex = null;
        this.parameterData.splice(rowIndex, 1);
        this.categoryDataSource = new MatTableDataSource<CategoryDataElement>(this.parameterData );
        this.categoryDataSource.paginator = this.paginator;
        this.categoryDataSource.sort = this.sort;
        this.checkIsAddRow();
        // this.isDisable = true;
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
        // Sorting will work in ascending order when page add new row function call
        this.sort.sort({id: '', start: 'asc', disableClear: false});
        if (
            this.matTableRef.nativeElement.clientHeight >
            this.commonService.getTableHeight()
        ) {
            const elem = document.getElementById('customTable');
            if(elem)
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
        // for (const [i] of this.parameterData.entries()) {
        //     this.parameterData[i].editing = false;
        // }
        // this.parameterData = this.categoryDataSource.sortData(this.categoryDataSource.filteredData,this.categoryDataSource.sort);
       
        this.isAdd = true;
        // this.isDisable = false;
        this.isEdit = false;
        this.parameterData.unshift({
            categoryCode: '',
            categoryName1: '',
            categoryName2: '',
            categoryName3: '',
            categoryName4: '',
            categoryName5: '',
            categoryEnabledFlag: true,
            action: '',
            editing: true,
            addNewRecord: true
        });

        this.categoryDataSource = new MatTableDataSource<CategoryDataElement>(
            this.parameterData
        );
        this.categoryDataSource.paginator = this.paginator;
        this.categoryDataSource.sort = this.sort;
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

    onSubmit(type: string) {
        const dataArray: any[] = [];
        this.sort.getNextSortDirection;
        this.saveInprogress = true;
         for (const [i, pData] of this.parameterData.entries()) { 
            if (type === 'save') {
                if (pData.addNewRecord === true) {
                    this.selectedRowIndex = null;
                    if (pData.categoryCode && pData.categoryName1) {
                        dataArray.push(pData);
                        this.parameterData[i].addNewRecord = false;
                        this.parameterData[i].editing = true;
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                         this.selectedRowIndex = i;
                         this.saveInprogress = false;
                         this.openSnackBar(
                             'Please fill required fields in row ' + (i + 1),
                             '',
                             'default-snackbar'
                         );
                        return;
                    }
                }
            } else {
                if (pData.editing === true) {
                    this.selectedRowIndex = null;
                    if (pData.categoryCode && pData.categoryName1) {
                        dataArray.push(pData);
                        this.parameterData[i].editing = true;
                        this.parameterData[i].originalData = {};
                        delete pData.originalData;
                        this.parameterData[i]['originalData'] = Object.assign(
                            {},
                            pData
                        );
                    } else {
                         this.selectedRowIndex = i;
                         this.saveInprogress = false;
                         this.openSnackBar(
                             'Please fill required fields in row ' + (i + 1),
                             '',
                             'default-snackbar'
                         );
                        return;
                    }
                }
            }
        }
        if (type === 'save') {
            this.addCategory(dataArray);
        } else {
            this.updateCategory(dataArray);
        }
        for (const [i] of this.parameterData.entries()) {
            this.parameterData[i].editing = false;
        } 
    }
    // add Category
    addCategory(data) {
        const body = [];
        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            tempObj.categoryEnabledFlag = tempObj.categoryEnabledFlag
                ? 'Y'
                : 'N';
            tempObj.createdBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;
            delete tempObj.action;
            delete tempObj.editing;
            delete tempObj.addNewRecord;
            body.push(tempObj);
            // setTimeout(
            //     () =>
            //         (dataElement.categoryEnabledFlag =
            //             dataElement.categoryEnabledFlag === 'Y' ? true : false),
            //     200
            // );
        });
        this.categoryService.createCategory(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.refreshSearchLov = 'refresh';
                    this.dataForSearch['lovSearchFromAdd_update'] = true;
                    this.searchForCategory();
                    this.isAdd = false;
                } else {
                    this.openSnackBar(result.message, '', 'error-snackbar');

                    this.isAdd = false;
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                this.isAdd = true;
                // this.openSnackBar(error.error.message, '', 'error-snackbar');
                // for (let i = 0; i < error.error.index.length; i++) {
                //     this.parameterData[error.error.index[i] - 1].editing = true;
                //     this.parameterData[error.error.index[i] - 1].addNewRecord = true;
                // }

                // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
                for (const Categoty of data) {
                    Categoty.editing = true;
                    Categoty.addNewRecord = true;
                }
                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    // update Category
    updateCategory(data) {
        const body = [];
        data.forEach(dataElement => {
            let tempObj: any = {};
            tempObj = Object.assign({}, dataElement);
            tempObj.categoryEnabledFlag = tempObj.categoryEnabledFlag
                ? 'Y'
                : 'N';
            tempObj.updatedBy = JSON.parse(
                localStorage.getItem('userDetails')
            ).userId;
            delete tempObj.action;
            delete tempObj.createdBy;
            delete tempObj.creationDate;
            delete tempObj.updatedDate;
            delete tempObj.valueList;
            delete tempObj.editing;
            body.push(tempObj);
            // setTimeout(
            //     () =>
            //         (dataElement.categoryEnabledFlag =
            //             dataElement.categoryEnabledFlag === 'Y' ? true : false),
            //     200
            // );
        });
        this.categoryService.updateCategory(body).subscribe(
            result => {
                if (result.status === 200) {
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'success-snackbar');
                    this.refreshSearchLov = 'refresh';
                    this.dataForSearch['lovSearchFromAdd_update'] = true;
                    this.searchForCategory();
                } else {
                    this.isEdit = false;
                    this.openSnackBar(result.message, '', 'error-snackbar');
                }
                this.saveInprogress = false;
            },
            (error: any) => {
                this.isEdit = true;
                // Apply Changes To edit all unsaved records : 05-02-2020 (By Manoj Kumar)
                for (const Cat of data) {
                    if (
                        this.parameterData.find(
                            d => (d.categoryId = Cat.categoryId)
                        )
                    ) {
                        const index = this.parameterData.indexOf(Cat);
                        this.parameterData[index].editing = true;
                        this.parameterData[index].addNewRecord = true;
                    }
                }

                this.openSnackBar(error.error.message, '', 'error-snackbar');
                this.saveInprogress = false;
            }
        );
    }

    ngAfterViewInit() {
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

    cancel() {
        this.parameterData = [];
        this.isAdd = false;
        this.categoryDataSource = new MatTableDataSource<
                                CategoryDataElement
                            >(this.parameterData);
        // this.router.navigate(['category']);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonService.setTableResize(
            this.matTableRef.nativeElement.clientWidth,
            this.columns
        );
        this.commonService.getScreenSize(-84); 
    }
    sortChanged($event){
        // Added for pagination inilitization
        this.paginator.pageIndex = 0;
        this.parameterData = this.categoryDataSource.sortData(this.categoryDataSource.filteredData, this.categoryDataSource.sort);      
       
    }
}
