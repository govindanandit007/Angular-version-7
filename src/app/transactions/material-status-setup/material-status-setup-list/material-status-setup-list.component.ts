import {
    Component, OnInit, ViewChild, Renderer, Output, EventEmitter, TemplateRef,
    OnDestroy, Optional, Inject, HostListener, ElementRef, AfterViewInit
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialStatusSetupService } from 'src/app/_services/transactions/material-status-setup.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';

export interface ParameterDataElement {
    roleId: number;
    roleName: string;
    roleEnableFlag: boolean;
    roleDefaultFlag: boolean;
    action: string;
}

@Component({
    selector: 'app-material-status-setup-list',
    templateUrl: './material-status-setup-list.component.html',
    styleUrls: ['./material-status-setup-list.component.css']
})
export class MaterialStatusSetupListComponent implements OnInit {
    searchEnable: boolean;
    isEdit = false;
    isAdd = false;
    dataResult = false;
    private searchInfoArrayunsubscribe: any;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild('customTable', { read: ElementRef, static: false }) public customTable: ElementRef<any>;

    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    // poTableMessage = 'No Purchase Order defined.';
    poTableMessage = '';
    parameterDisplayedColumns: string[] = [
        'poId',
        'materialStatusName',
        'description',
        // 'poDescription',
        'enableFlag',
        'allowReservation',
        'lgFlag',
        'slFlag',
        'batchFlag',
        // 'poNoteToSupplier',
        'serialFlag',
        'lpnFlag',
        'action'
    ];

    columns: any = [
        { field: 'poId', name: '#', width: 75, baseWidth: 4 },
        { field: 'materialStatusName', name: 'Name', width: 75, baseWidth: 14 },
        { field: 'description', name: 'Description', width: 75, baseWidth: 15 },
        // {field: 'poDescription', name: 'Description', width: 75, baseWidth: 10},
        { field: 'enableFlag', name: 'Enabled Flag', width: 75, baseWidth: 11 },
        { field: 'allowReservation', name: 'Allow Reservation', width: 75, baseWidth: 14 },
        { field: 'lgFlag', name: 'Locator Group', width: 75, baseWidth: 9 },
        { field: 'slFlag', name: 'Stock Locator', width: 75, baseWidth: 9 },
        { field: 'batchFlag', name: 'Batch', width: 75, baseWidth: 6 },
        // {field: 'poNoteToSupplier', name: 'Note to Supplier', width: 75, baseWidth: 12 },
        { field: 'serialFlag', name: 'Serial', width: 75, baseWidth: 6 },
        { field: 'lpnFlag', name: 'LPN', width: 75, baseWidth: 6 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 6 }
    ]

    showSearch = true;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );

    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private materialStatusSetupService: MaterialStatusSetupService,
        private http: HttpClient
    ) {
        this.searchEnable = true;
        this.getScreenSize();
    }
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/material-status-setup.json');
    screenMaxHeight: any;
    ngOnInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchPurchaseOrder();
            this.searchForMaterialStatusSetup();
        });
    }



    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
        this.commonService.getsearhForMasters([]);
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
            duration: 3500,
            panelClass: [typeClass]
        });
    }

    // search for purchase order
    searchForMaterialStatusSetup() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) {
        // console.log('searchToggle');
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
    }

    searchPurchaseOrder() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {

                // This code is used for not loading the search result when module loads 
                if (searchInfo.fromSearchBtnClick === true) {

                    this.customTable.nativeElement.scrollLeft = 0;
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource<
                        ParameterDataElement
                    >(this.parameterData);
                    this.parameterDataSource.paginator = this.paginator;
                    if (searchInfo.searchType === "materialStatusSetup") {
                        this.listProgress = true;
                        this.materialStatusSetupService
                            .getMaterialStatusSetupSearch(searchInfo.searchArray)
                            .subscribe(data => {
                                if (data.status === 200) {
                                    if (!data.message) {
                                        this.parameterData = [];
                                        this.listProgress = false;
                                        this.dataResult = true;
                                        for (const rData of data.result) {
                                            rData.action = '';
                                            this.parameterData.push(rData);
                                        }
                                        this.parameterDataSource = new MatTableDataSource<
                                            ParameterDataElement
                                        >(this.parameterData);
                                        this.parameterDataSource.paginator = this.paginator;
                                        // Sorting Start
                                        const sortState: Sort = { active: '', direction: '' };
                                        this.sort.active = sortState.active;
                                        this.sort.direction = sortState.direction;
                                        this.sort.sortChange.emit(sortState);
                                        // Sorting End
                                        this.parameterDataSource.sort = this.sort;
                                    } else {
                                        this.listProgress = false;
                                        this.dataResult = false;
                                        this.poTableMessage = data.message;
                                    }
                                } else {
                                    this.listProgress = false;
                                    this.openSnackBar(
                                        data.message,
                                        '',
                                        'error-snackbar'
                                    );
                                }
                            });
                    }
                } else {
                    this.listProgress = false;
                    return;
                }

            }
        );
    }

    // go for add, edit and view
    goFor(type: string, element?: any) {
        if (type === 'view') {
            const dialogData = [];
            dialogData.push(element);
            console.log(dialogData);
            const dialogRef = this.dialog.open(MaterialStatusSetupViewDialogComponent, {
                width: '60vw',
                data: dialogData,
                autoFocus: false
            });

            dialogRef.afterClosed().subscribe(response => {
                if (response !== undefined) {
                    this.goFor('edit', response);
                }
            });

        } else if (type === 'add') {
            this.router.navigate(['materialstatussetup/addmaterialstatussetup']);
        } else {
            this.router.navigate(['materialstatussetup/editmaterialstatussetup/' + element]);
        }
    }
    // open dialog
    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage,
                autoFocus: false
            }
        });
    }

    @HostListener('window:resize', [])
    onResize(): void {
        this.getScreenSize();

        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
    }
    getScreenSize(event?) {
        const screenHeight = window.innerHeight;
        this.screenMaxHeight = (screenHeight - 248) + 'px';
        console.log('screenMaxHeight: ' + this.screenMaxHeight);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10);
        }, 100);
    }
}
@Component({
    selector: 'app-material-status-setup-view-dialog',
    templateUrl: './material-status-setup-view-dialog.html',
    styleUrls: ['./material-status-setup-list.component.css']
})
export class MaterialStatusSetupViewDialogComponent {
    formTitle: string;
    MaterialSetupForm: FormGroup;
    selectedTransactionType: any[];
    isEdit = false;
    materialSetupId: number;
    transactionTypeArray: any = [];
    listProgress = false;
    onBoundTempArr: any = [];
    inBoundTempArr: any = [];
    warehouseTempArr: any = [];

    onBoundAllCheck: boolean = false;
    onBoundCheck: boolean = false;

    inBoundAllCheck: boolean = false;
    inBoundCheck: boolean = false;

    wareHouseAllCheck: boolean = false;
    wareHouseCheck: boolean = false;

    columns: any =  [
        {field: 'outbond', name: 'Outbond', width: 75, baseWidth: 30 },
        {field: 'inbound', name: 'Inbound', width: 75, baseWidth: 30 },
        {field: 'warehouse', name: 'Warehouse', width: 75, baseWidth: 40 }
    ];

    constructor(
        private materialStatusSetupService: MaterialStatusSetupService,
        public dialogRef: MatDialogRef<MaterialStatusSetupViewDialogComponent>,
        public commonService: CommonService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getDetailsById(data[0].materialStatusId);
    }

    getDetailsById(materialStatusId){
        this.transactionTypeArray = [];
        this.listProgress = true;
        this.commonService.getLookupLOV('TXN_TYPE_CODE').subscribe(
            (result: any) => {
                if (result.status === 200) {
                    if (result.result) {
                        this.listProgress = false;
                        const data = result.result;
                        for (const txnType of data) {
                            this.transactionTypeArray.push({
                                description: txnType.lookupValueDesc,
                                name: txnType.lookupValue,
                                enableFlag: false,
                                txnId: null,
                                parentValue: txnType.parentValue
                            });
                        }
                        console.log(this.transactionTypeArray);
                        this.materialStatusSetupService.getMaterialStatusSetupById(materialStatusId).subscribe((matSetupData: any) => {
                            for (const [i,matsetupItem] of matSetupData.result[0].MS_Txn_type_Details.entries()) {
                                for (const [j, txnTypeItem] of this.transactionTypeArray.entries()) {
                                    if(txnTypeItem.name === matsetupItem.materialTxnType){
                                        this.transactionTypeArray[j].enableFlag = (matsetupItem.enabledFlag === 'N') ? false : true;
                                    }
                                }
                            }
                            console.log(this.transactionTypeArray);
                            this.checkAllOnLoad();
                        });
                    }
                } else {
                    this.listProgress = false;
                }
            },
            (error: any) => {
                console.log(error.error.message);
            }
        );
    }

    checkAllOnLoad(){
        for (const [i, txnType] of this.transactionTypeArray.entries()) {
            if(txnType.parentValue === 'Inbound'){
                this.inBoundTempArr.push(this.transactionTypeArray[i]);
            }
            if(txnType.parentValue === 'Outbound'){
                this.onBoundTempArr.push(this.transactionTypeArray[i]);
            }
            if(txnType.parentValue === 'Warehouse'){
                this.warehouseTempArr.push(this.transactionTypeArray[i]);
            }
        }
        let allInBoundChecked = this.inBoundTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allInBoundChecked){
            this.inBoundAllCheck = true;
        }else{
            this.inBoundCheck = true;
        }
        let allOnBoundChecked = this.onBoundTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allOnBoundChecked){
            this.onBoundAllCheck = true;
        }else{
            this.onBoundCheck = true;
        }
        let allWarehouseChecked = this.warehouseTempArr.every(function(element){
            return element.enableFlag === true;
        });
        if(allWarehouseChecked){
            this.wareHouseAllCheck = true;
        }else{
            this.wareHouseCheck = true;
        }
    }

    setAll(completed: boolean,type) {
        if (completed) {
            if(type === 'Inbound'){
                this.inBoundAllCheck = true;
            }
            if(type === 'Outbound'){
                this.onBoundAllCheck = true;
            }
            if(type === 'Warehouse'){
                this.wareHouseAllCheck = true;
            }
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    this.transactionTypeArray[i].enableFlag = true;
                }
            }
        } else{
            if(type === 'Inbound'){
                this.inBoundAllCheck = false;
            }
            if(type === 'Outbound'){
                this.onBoundAllCheck = false;
            }
            if(type === 'Warehouse'){
                this.wareHouseAllCheck = false;
            }
            for (const [i, txnType] of this.transactionTypeArray.entries()) {
                if(txnType.parentValue === type){
                    this.transactionTypeArray[i].enableFlag = false;
                }
            }
        }
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

}