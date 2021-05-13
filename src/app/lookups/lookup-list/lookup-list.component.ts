import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    Renderer,
    Output,
    EventEmitter,
    TemplateRef,
    Optional,
    Inject,
    HostListener,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LookupsService } from 'src/app/_services/lookups.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material';
import { HttpClient } from '@angular/common/http';

export interface ParameterDataElement {
    lookupId: number;
    lookupName: string;
    lookupMainDesc: string;
    lookupEnabledFlag: boolean;
    lookupCompanyId?: number;
    action: string;
}

@Component({
    selector: 'app-lookup-list',
    templateUrl: './lookup-list.component.html',
    styleUrls: ['./lookup-list.component.css']
})
export class LookupListComponent implements OnInit, AfterViewInit, OnDestroy  {
    searchEnable: boolean;
    searchLookupName = '';
    searchLookDescription = '';
    isEdit = false;
    isAdd = false;
    dataResult = false;
    dataResultLookupName = '';
    dataResultLookupMDesc = '';
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    lookupTableMessage = '';
    parameterDisplayedColumns: string[] = [
        'lookupId',
        'lookupName',
        'lookupMainDesc',
        'lookupEnabledFlag',
        'action'
    ];
    columns: any = [
        { field: 'lookupId', name: '#', width: 75, baseWidth: 10},
        { field: 'lookupName', name: 'Name', width: 75, baseWidth: 25 },
        { field: 'lookupMainDesc', name: 'Description', width: 75, baseWidth: 25 },         
        { field: 'lookupEnabledFlag', name: 'Enable Flag', width: 75, baseWidth: 25 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 15 }
    ];
    showSearch = true;
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/lookups-search.json');
    viewDisable : boolean = false;
    public addNewRecord = false;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    LookupsFormData: FormGroup;
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;
    @Output() searchComponentToggle = new EventEmitter<boolean>();
    private searchInfoArrayunsubscribe: any;

    constructor(
        private render: Renderer,
        private fb: FormBuilder,
        private router: Router,
        private lookupService: LookupsService,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private http: HttpClient
    ) {
        // this.LookupsForm();
        this.searchEnable = true;
    }
    ngOnInit() {
        this.parameterDataSource.paginator = this.paginator;
        this.commonService.getScreenSize(-84);
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchLookup();
            this.searchForLookup();
        });
        setTimeout(() => {
        this.paginator.pageSizeOptions = this.commonService.paginationArray;
        this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
        
    }
   
    addLookup() {
        this.router.navigate(['lookups/addLookup']);
    }

    searchLookup() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((searchInfo: any) => {
            this.isEdit = false;
            // This code is used for not loading the search result when module loads
             if(searchInfo.fromSearchBtnClick === true){
                // searchInfo.fromSearchBtnClick = false;
                // this.commonService.getsearhForMasters(searchInfo);
                this.parameterData = [];
                this.parameterDataSource = new MatTableDataSource<
                    ParameterDataElement
                >(this.parameterData);
                this.parameterDataSource.paginator = this.paginator;
                if (searchInfo.searchType === 'lookup') {
                    this.listProgress = true;
                    this.lookupService
                        .searchLookups(searchInfo.searchArray)
                        .subscribe(data => {
                            if (data.status === 200) {
                                if(!data.message){
                                    this.parameterData = [];
                                    this.listProgress = false;
                                    this.dataResult = true;
                                    this.dataResultLookupName = data.result[0].lookupName;
                                    this.dataResultLookupMDesc = data.result[0].lookupMainDesc;
                                    for (const rData of data.result) {
                                        this.parameterData.push({
                                            lookupId: rData.lookupId,
                                            lookupName: rData.lookupName,
                                            lookupMainDesc: rData.lookupMainDesc,
                                            lookupEnabledFlag: rData.lookupEnabledFlag === 'Y' ? true : false,
                                            lookupCompanyId: rData.lookupCompanyId,
                                            action: '',
                                        });
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
                                    this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
                                    // this.parameterDataSource.connect().subscribe(d => {
                                    //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData, this.parameterDataSource.sort);
                                    // });
                                } else {
                                    this.listProgress = false;
                                    this.dataResult = false;
                                    this.lookupTableMessage = data.message;
                                }
                            } else {
                                this.listProgress = false;
                                this.openSnackBar(data.message, '');
                            }
                        });
                }
             }else{
                 return;
             }

        });
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
             duration: 3500
        });
    }

    // search for lookup
    searchForLookup() {
        this.commonService.searhForMasters(this.dataForSearch);
        this.searchComponentToggle.emit(this.showSearch);
        this.searchEnable = true;
    }

    // show / hide search section
    getSearchToggle(searchToggle: boolean) { 
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
        }
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

    goFor(element:any, type:string){

        if(type === 'view'){
            const obj = { lookupName: element.lookupName, lookupMainDesc: element.lookupMainDesc, lookupCompanyId:
                JSON.parse(localStorage.getItem('userDetails')).companyId,
                lookupEnabledFlag: element.lookupEnabledFlag === true ? 'Y' : 'N'};
            const dialogData = [];
            this.viewDisable = true;
            this.lookupService.getLookups(obj).subscribe( data => {
                if(data.status === 200){
                    this.viewDisable = false;
                    if(data.result.length > 0){
                        for(const dData of data.result){
                            dData.lookupEnabledFlag = dData.lookupEnabledFlag === 'Y' ? true : false;
                            dData.lookupValueEnabledFlag = dData.lookupValueEnabledFlag === 'Y' ? true : false;
                            dialogData.push(dData);
                        } 
                    }
                    const dialogRef = this.dialog.open(LookupViewDialogComponent, {
                        width: '70vw',
                        data: dialogData
                    });

                    dialogRef.afterClosed().subscribe(response => {
                        const responseData = JSON.stringify({ name : response.lookupName, enableFlag : response.lookupEnabledFlag, lookupCompanyId: response.lookupCompanyId });
                        
                        if (response !== undefined) {
                            this.router.navigate(['lookups/editLookup/' + responseData]);
                        }
                    });
                }
            })
        } else{
            const objData = JSON.stringify({
              name : element.lookupName,
              enableFlag : element.lookupEnabledFlag,
              lookupCompanyId : element.lookupCompanyId
            });
            this.router.navigate(['lookups/editLookup/' + objData]);
        }
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
        this.commonService.getsearhForMasters([]);
    }
     
    ngAfterViewInit() {
        this.parameterDataSource.sort = this.sort;
        this.parameterDataSource.sortingDataAccessor = (data, attribute) => data[attribute];
        setTimeout(() => {
          this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
          this.paginator.pageSizeOptions = this.commonService.paginationArray;
          this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 )
      }, 100);
        
      }
      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(-84);
      }
}

@Component({
    selector: 'app-lookup-view-dialog',
    templateUrl: './lookup-view-dialog.html',
})

export class LookupViewDialogComponent {
    lookupViewdColumns: string[] = [
        'lookupId',
        'lookupValue',
        'lookupValueDesc',
        'parentValue',
        'parentCode',
        'effectiveFrom',
        'effectiveTo',
        'lookupEnabledFlag'
    ];
    constructor(
        public dialogRef: MatDialogRef<LookupViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

}
