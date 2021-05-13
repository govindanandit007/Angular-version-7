import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, HostListener, Inject, Optional } from '@angular/core';
import { MatTableDataSource, MatTable, MatSort, Sort, MatDialogRef, MatPaginator, TooltipPosition, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { RuleService } from 'src/app/_services/labelSetup/rule.service';

export interface ParameterDataElement {
  sno: number;
  id: number;
  name: string;
  description: string;
  label: string;
  printer: string;
  enabled: boolean;
  action?: string;
}
@Component({
    selector: 'app-rule-list',
    templateUrl: './rule-list.component.html',
    styleUrls: ['./rule-list.component.css']
})
export class RuleListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
    tooltipPosition: TooltipPosition[] = ['below'];
    listProgress = false;
    shipmentTableMessage = '';
    dataResult = false;
    screenMaxHeight: any;
    parameterDisplayedColumns: string[] = [
        'sno',
        'id',
        'name',
        'description',
        'label',
        'printer',
        'enabled',
        'action'
    ];
    columns: any = [
        { field: 'sno', name: '#', width: 75, baseWidth: 5 },
        { field: 'id', name: 'ID', width: 75, baseWidth: 15 },
        { field: 'name', name: 'Name', width: 75, baseWidth: 15 },
        { field: 'description', name: 'Description', width: 75, baseWidth: 15 },
        { field: 'label', name: 'Label', width: 75, baseWidth: 15 },
        { field: 'printer', name: 'Printer', width: 75, baseWidth: 15 },
        { field: 'enabled', name: 'Enabled', width: 75, baseWidth: 12 },
        { field: 'action', name: 'Action', width: 75, baseWidth: 8 }
    ];
    parameterData: ParameterDataElement[] = [];
    parameterDataSource = new MatTableDataSource<ParameterDataElement>(
        this.parameterData
    );
    @ViewChild(MatTable, { read: ElementRef, static: false })
    matTableRef: ElementRef;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private ruleService: RuleService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.getRuleList();
    }

    getRuleList() {
        this.ruleService.getRuleSearch().subscribe(data => {
            // if (data.status === 200) {
            //   if (!data.message) {
            this.listProgress = false;
            this.dataResult = true;
            for (const rData of data) {
                rData.action = '';
                if (rData.active === 'No') {
                    rData.active = false;
                } else {
                    rData.active = true;
                }
                this.parameterData.push(rData);
            }
            this.parameterDataSource = new MatTableDataSource<
                ParameterDataElement
            >(this.parameterData);
            this.parameterDataSource.paginator = this.paginator;
            setTimeout(() => {
                this.paginator.pageSizeOptions = this.commonService.paginationArray;
                this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
            }, 100);
            // Sorting Start
                const sortState: Sort = {active: '', direction: ''};
                this.sort.active = sortState.active;
                this.sort.direction = sortState.direction;
                this.sort.sortChange.emit(sortState);
            // Sorting End
            this.parameterDataSource.sort = this.sort;
            this.parameterDataSource.connect().subscribe(d => {
                this.parameterDataSource.sortData(
                    this.parameterDataSource.filteredData,
                    this.parameterDataSource.sort
                );
            });
            //   } else {
            //     this.listProgress = false;
            //     this.dataResult = false;
            //     this.shipmentTableMessage = data.message;
            //   }
            // } else {
            //   this.listProgress = false;
            //   this.openSnackBar(
            //     data.message,
            //     '',
            //     'error-snackbar'
            //   );
            // }
        });
    }
    // ngOnDestroy() {
    //     this.searchInfoArrayunsubscribe
    //         ? this.searchInfoArrayunsubscribe.unsubscribe()
    //         : '';
    //     this.commonService.getsearhForMasters([]);
    // }

    // go for add, edit and view
    goFor(type: string, element?: any) {
        if (type === 'add') {
            this.router.navigate(['rule/createrule']);
        } else {
            this.router.navigate(['rule/editrule/' + element]);
        }
    }

    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
             duration: 3500,
            panelClass: [typeClass]
        });
    }
}
