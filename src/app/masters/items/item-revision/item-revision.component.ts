import {
    Component,
    OnInit,
    Renderer,
    Output,
    Input,
    EventEmitter,
    ViewChild,
    OnDestroy,
    Optional,
    Inject,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';
import {
    MatDialog,
    MatSnackBar,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatSort, Sort, MatDatepicker
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { Router } from '@angular/router';
import { ItemsComponent } from '../items.component';
import { ItemsService } from 'src/app/_services/items.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';


export interface ParameterDataElement {
    serialNumber: number;
    revsnId: number;
    revsnItemId: number;
    revsnIuId: number;
    revsnNumber: number;
    revsnReason: string;
    revsnEffectiveDate: string;
    revsnEnabledFlag: string;
    createdBy: number;
    updatedBy: number;
    action: string;
}

@Component({
    selector: 'app-item-revision',
    templateUrl: './item-revision.component.html',
    styleUrls: ['./item-revision.component.css']
})
export class ItemRevisionComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    showItemList = true;
    isEdit = false;
    listProgress = false;
    itemForm: FormGroup;
    // itemRevisionListMessage = 'No Item Revisions defined.';
    itemRevisionListMessage = '';
    showSearch = true;
    confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
    itemsList = [];
    searchEnableFlag = false;
    searchIconValue: any = '';
    showLov = 'hide';
    inlineSearchLoader = 'hide';
    effectiveDate = new Date();
    saveInprogress = false;
    setMandatoryColor = false

    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    
    parameterData: ParameterDataElement[] = [];
    parameterDisplayedColumns: string[] = [
        'itemId',
        'itemName',
        'revsnNumber',
        'revsnReason',
        'revsnEffectiveDate',
        'revsnEnabledFlag',
        'action'
    ];
    columns: any =  [
        {field: 'itemId', name: '#', width: 75, baseWidth: 6 },
        {field: 'itemName', name: 'Item Name', width: 150, baseWidth: 20 },
        {field: 'revsnNumber', name: 'Revision #', width: 150, baseWidth: 15 },
        {field: 'revsnReason', name: 'Revision Reason', width: 100, baseWidth: 25 },
        {field: 'revsnEffectiveDate', name: 'Effective Date', width: 100, baseWidth: 17 },
        {field: 'revsnEnabledFlag', name: 'Enabled', width: 100, baseWidth: 9 },
        {field: 'action', name: 'Action', width: 75, baseWidth: 8 }
    ]
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    private searchInfoArrayunsubscribe: any;
    private searchArrayunsubscribe: any;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    @Input() showSearchComponent: BehaviorSubject<string>;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/item-rev-search.json');
    validationMessages = {
        revsnItemId: {
            required: 'Item Code is required'
        },
        revsnNumber: {
            required: 'Revision number is required',
            pattern: 'Revision number should be alphanumeric'
        },
        revsnEffectiveDate: {
            required: 'Effective date is required'
        }
    };

    formErrors = {
        revsnItemId: '',
        revsnNumber: '',
        revsnEffectiveDate: ''
    };

    constructor(
        private fb: FormBuilder,
        // tslint:disable-next-line: deprecation
        private render: Renderer,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private itemsService: ItemsService,
        private itemscomponent: ItemsComponent,
        private http: HttpClient
    ) {
        //this.itemFormGroup();
    }
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    ngOnInit() {
        this.showSearch = true;
        // this.getItemForXRefList();
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchForItemRevision();
            this.searchItemRevision();
        });
        this.commonService.getScreenSize(-35);
        this.searchIconValue = this.itemsService.searchIconValue.subscribe(
            (searchEnableFlag: any) => {
                this.searchEnableFlag = searchEnableFlag;
            }
        );
    }

    searchItemRevision() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (itemSearchInfo: any) => {
                // This code is used for not loading the search result when module loads
                if(itemSearchInfo.fromSearchBtnClick === true){
               
                    // itemSearchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(itemSearchInfo);
                    this.parameterData = [];
                    this.parameterDataSource = new MatTableDataSource([]);
                    this.parameterDataSource.sort = this.sort;
                    this.itemRevisionListMessage = '';
                    // this.itemRevisionListMessage = 'No Item Revisions defined.';
                    if (itemSearchInfo.searchType === 'itemRevision') {
                        this.listProgress = true;
                        this.itemsService
                            .getItemRevisionSearch(itemSearchInfo.searchArray)
                            .subscribe(
                                (data: any) => {
                                    this.listProgress = false;
                                    if (data.status === 200) {
                                        if (!data.message) {
                                            this.parameterData = [];
                                            let count = 1;
                                            for (const rowData of data.result) {
                                                rowData.serialNumber = count++;
                                                if (
                                                    rowData.revsnEnabledFlag === 'N'
                                                ) {
                                                    rowData.revsnEnabledFlag = false;
                                                } else {
                                                    rowData.revsnEnabledFlag = true;
                                                }
                                                rowData.action = '';
                                                this.parameterData.push(rowData);
                                            } 
                                            this.parameterDataSource = new MatTableDataSource(
                                                this.parameterData
                                            );
                                            this.parameterDataSource.paginator = this.paginator;
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                            this.parameterDataSource.sort = this.sort;

                                        } else {
                                            this.itemRevisionListMessage =
                                                data.message;
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
                }else{
                    return;
                }

            }
        );
    }

    searchForItemRevision() {
        this.searchArrayunsubscribe = this.itemscomponent.showSearchFlag.subscribe(
            (data: any) => {
                if (data === 'itemRevision') {
                    this.commonService.searhForMasters(this.dataForSearch);
                    this.itemsService.displaySearchComponent(this.showSearch);
                }
            }
        );
    }
    searchComponentOpen() {
        this.itemsService.displaySearchComponent(this.showSearch);
        this.searchEnableFlag = true;
    }

    fetchNewSearchList(event: any, index: any, searchFlag: any){
        const value = this.itemForm.value.searchValue;
        let charCode = event.which ? event.which : event.keyCode;
        if(charCode === 9){
           event.preventDefault();
           charCode = 13;
        }

        if ( !searchFlag && charCode !== 13 ){
          return;
        }


        if(this.showLov === 'hide'){
           this.inlineSearchLoader = 'show';
           this.getItemLovByScreen(this.itemForm.value.searchValue, index, event)
        }else{

            this.showLov = 'hide';
            this.itemForm.patchValue({ searchValue: '' });
            this.itemForm.patchValue( {revsnItemId: ''});
        }

      }

      getItemLovByScreen(itemName, index, event){
        this.commonService.getItemLovByScreen( 'item', 'item-revision', null , itemName).subscribe((data: any) => {
            this.itemsList = [{
              value   : '',
              label : ' Please Select'
            }];

            if( data.result && data.result.length){
              data =  data.result;
              this.itemsList = [];
                for(let i=0; i<data.length; i++){
                    this.itemsList.push({
                      value   : data[i].itemId,
                      label : data[i].itemName
                  })
                }
                this.inlineSearchLoader = 'hide';
                this.showLov = 'show';
                this.itemForm.patchValue({ searchValue: '' });

                // Set the first element of the search
                this.itemForm.patchValue({ revsnItemId: data[0].itemId });

            }else{
              this.inlineSearchLoader = 'hide';
              this.openSnackBar('No match found', '','default-snackbar');
            }
        },
        (error: any) => {
            this.openSnackBar(error.error.message, '', 'error-snackbar');
        })
      }


    // getItemForXRefList() {
    //     this.itemsService.getItemLOVForRevesion().subscribe((data: any) => {
    //         this.itemCodeList = [];
    //         for (const items of data.result) {
    //             this.itemCodeList.push({
    //                 value: items.itemId,
    //                 label: items.itemName
    //             });
    //         }
    //     });
    // }

    logValidationErrors(group: FormGroup = this.itemForm): void {
        this.setMandatoryColor = false;
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

    itemFormGroup(element) {
        if(element !=='') {
            let enableFlag = element.revsnEnabledFlag === 'Y' ? true :false;
            
        this.itemForm = this.fb.group({
            revsnId: [''],
            revsnItemId: ['', Validators.required],
            searchValue: [{value:element.itemName, disabled: true}],
            itemCode: [''],
            revsnIuId: [null],
            revsnNumber: [ {value:element.revsnNumber, disabled: true} ],
            revsnReason: [''],
            revsnEffectiveDate: [{value:this.itemscomponent.dateFormat(element.revisionEffectiveDate), disabled: true}],
            revsnEnabledFlag: [ {value: enableFlag, disabled: false}],
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            creationDate: [''],
            updatedDate: ['']
        });
    }else {
        this.itemForm = this.fb.group({
            revsnId: [''],
            revsnItemId: ['', Validators.required],
            searchValue: [''],
            itemCode: [''],
            revsnIuId: [null],
            revsnNumber: [
                '',
                [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]
            ],
            revsnReason: [''],
            revsnEffectiveDate: [
                this.itemscomponent.dateFormat(new Date()),
                Validators.required
            ],
            revsnEnabledFlag: [true],
            createdBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            updatedBy: [JSON.parse(localStorage.getItem('userDetails')).userId],
            creationDate: [''],
            updatedDate: ['']
        });
    }
}

    addItem(type: string, element?: any) {
        this.saveInprogress = false;
        if (type === 'view') {
            this.isEdit = false;
            this.itemFormGroup("");
            const dialogData = [];
            dialogData.push(element);
            const dialogRef = this.dialog.open(
                ItemRevisionViewDialogComponent,
                {
                    width: '50vw',
                    data: dialogData
                }
            );

            dialogRef.afterClosed().subscribe(response => {
                if (response !== undefined) {
                    this.addItem('edit', response);
                }
            });
        } else if (type === 'add') {
            this.isEdit = false;
            this.showItemList = !this.showItemList;
            this.itemsService.displaySearchComponent(false);
            this.itemFormGroup("");
            this.effectiveDate = new Date();
        } else if (type === 'edit') {
            this.isEdit = true;
            this.effectiveDate = new Date(element.revisionEffectiveDate);
            this.itemFormGroup(element);
            this.showItemList = !this.showItemList;
            this.itemsService.displaySearchComponent(false);
            this.itemForm.patchValue(element);
            this.itemForm.patchValue({searchValue : element.itemName });
                
        } else {
            this.showItemList = !this.showItemList;
            this.itemsService.displaySearchComponent(true);
        }
    }

    // form submit function for add and update
    onSubmit() {
        this.saveInprogress = true;
        if (this.itemForm.valid) {
            if(!this.isEdit){
            // const dp = new DatePipe(navigator.language);
            // const p = 'y-MM-dd'; // YYYY-MM-DD
            // this.itemForm.value.revsnEffectiveDate = dp.transform(
            //     new Date(this.itemForm.value.revsnEffectiveDate),
            //     p
            // );
            }
            if (this.itemForm.value.revsnEnabledFlag === true) {
                this.itemForm.value.revsnEnabledFlag = 'Y';
            } else {
                this.itemForm.value.revsnEnabledFlag = 'N';
            }

            if (this.isEdit) {
                this.searchInfoArrayunsubscribe
                    ? this.searchInfoArrayunsubscribe.unsubscribe()
                    : '';
                this.itemsService
                    .updateItemRevision(
                        this.itemForm.value.revsnId,
                        this.itemForm.value
                    )
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.itemFormGroup("");
                                this.showItemList = true;
                                // this.searchForItemRevision();
                                this.searchItemRevision();
                                this.searchComponentOpen();
                                this.parameterDataSource = new MatTableDataSource<
                                    ParameterDataElement
                                >([]);
                                this.parameterDataSource.paginator = this.paginator;
                                this.parameterDataSource.sort = this.sort;

                            }
                            this.saveInprogress = false;
                        },
                        (error: any) => {
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                            this.saveInprogress = false;
                        }
                    );
            } else {
                 
                this.itemsService
                    .createItemRevision(this.itemForm.value)
                    .subscribe(
                        data => {
                            if (data.status === 200) {
                                this.openSnackBar(
                                    data.message,
                                    '',
                                    'success-snackbar'
                                );
                                this.itemFormGroup("");
                                this.showItemList = true;
                                this.searchForItemRevision();
                                this.parameterData = [];
                                this.parameterDataSource = new MatTableDataSource<
                                    ParameterDataElement
                                >(this.parameterData);
                                this.parameterDataSource.paginator = this.paginator;
                                this.parameterDataSource.sort = this.sort;
                            }
                            this.saveInprogress = false;
                        },
                        (error: any) => {
                            this.openSnackBar(error.error.message, '', 'error-snackbar');
                            this.saveInprogress = false;
                        }
                    );
            }
        }else{
            if(this.itemForm.value.revsnItemId === ''){
                this.openSnackBar(' Please Select the item', '','default-snackbar');
                this.setMandatoryColor = true
            }
            if(this.itemForm.value.revsnNumber === ''){
                this.openSnackBar(' Please fill the revision', '','default-snackbar');
                this.setMandatoryColor = true
            }
            this.saveInprogress = false;
        }
    }

    openConfirmationDialog(pageName: string, url: any) {
        const confirmationDialogRef = this.dialog.open(
            ConfirmationDialogComponent,
            {
                data: {
                    pageName,
                    url
                },
                width: '30vw'
            }
        );
        confirmationDialogRef.afterClosed().subscribe(response => {
            if (
                response !== undefined &&
                response.url === 'itemRevisionCancel'
            ) {
                this.addItem('back');
                setTimeout(() => {
                    this.setPaginator();
                    this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
                }, 500);
            }
        });
    }

    setPaginator(){
        this.parameterDataSource.paginator = this.paginator;
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
        this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }


      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(-35);
      }
}

@Component({
    selector: 'app-item-revision-view-dialog',
    templateUrl: './item-revision-view-dialog.html',
    styleUrls: ['./item-revision.component.css']
})
export class ItemRevisionViewDialogComponent {
    resultData = [];
    parameterDataSource = new MatTableDataSource<any>(this.resultData);

    constructor(
        public dialogRef: MatDialogRef<ItemRevisionViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
