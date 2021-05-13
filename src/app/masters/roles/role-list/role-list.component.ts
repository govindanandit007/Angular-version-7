import { Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy,
  Optional,
  Inject, 
  HostListener,
  ElementRef,
  AfterViewInit} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from 'src/app/_services/roles.service';
import { MatSort , Sort} from '@angular/material';
import { HttpClient } from '@angular/common/http';

export interface ParameterDataElement {
  roleId: number;
  roleName: string;
  roleEnableFlag: boolean;
  roleDefaultFlag: boolean;
  action: string;
}

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit, AfterViewInit, OnDestroy {
  searchEnable: boolean;
  isEdit = false;
  isAdd = false;
  dataResult = false;
  private searchInfoArrayunsubscribe: any;
  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { read: ElementRef, static: false }) matTableRef: ElementRef;

  tooltipPosition: TooltipPosition[] = ['below'];
  listProgress = false;
  roleTableMessage = '';
  parameterDisplayedColumns: string[] = [
      'roleId',
      'roleName',
      'roleEnableFlag',
      'roleDefaultFlag',
      'action'
  ];
  columns: any = [
    { field: 'roleId', name: '#', width: 75, baseWidth: 10 },
    { field: 'roleName', name: 'Name', width: 75, baseWidth: 25 },
    { field: 'roleEnableFlag', name: 'Enable Flag', width: 75, baseWidth: 25 },
    { field: 'roleDefaultFlag', name: 'Default Flag', width: 75, baseWidth: 25 },
    { field: 'action', name: 'Action', width: 75, baseWidth: 15 }
  ]
  showSearch = true;
  dataForSearch: any;
  searchJson: any = this.http.get('./assets/search-jsons/role-search.json');
  parameterData: ParameterDataElement[] = [];
  parameterDataSource = new MatTableDataSource<ParameterDataElement>(
      this.parameterData
  );
  @Output() searchComponentToggle = new EventEmitter<boolean>();

  constructor(
        private router: Router,
        private rolesService: RolesService,
        private snackBar: MatSnackBar,
        public commonService: CommonService,
        public dialog: MatDialog,
        private http: HttpClient
    ) {
        this.searchEnable = true;
    }

  ngOnInit() {
    this.parameterDataSource.sort = this.sort;
      this.parameterDataSource.paginator = this.paginator;
      this.commonService.getScreenSize(-84);
      this.searchJson.subscribe((data: any) => {
        this.dataForSearch = data;
        this.searchRole();
        this.searchForRole();
    });
  }
  addRole() {
      this.router.navigate(['roles/addrole']);
  }

  searchRole() {
    this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe((searchInfo: any) => {
    //   const isValid = this.commonService.checkInputValidity(searchInfo);
      if (searchInfo.fromSearchBtnClick === true) {
         
        // if(isValid === false) {
        //     this.openSnackBar(this.commonService.searchValidationMessage,
        //     '','default-snackbar');
        //     return;
        // }

        if(searchInfo && searchInfo.searchArray &&
          String(searchInfo.searchArray.roleCompanyId) !== String(JSON.parse(localStorage.getItem('userDetails')).companyId) ){
            return
        }

      

        this.parameterData = [];
        this.parameterDataSource = new MatTableDataSource<
            ParameterDataElement
        >(this.parameterData);
        this.parameterDataSource.paginator = this.paginator;
        if (searchInfo.searchType === 'role') {
            this.listProgress = true;
            this.rolesService
                .getRoleSearch(searchInfo.searchArray)
                .subscribe(data => {
                    if (data.status === 200) {
                        if(!data.message){
                          this.parameterData = [];
                            this.listProgress = false;
                            this.dataResult = true;
                            for (const rData of data.result) {
                                this.parameterData.push({
                                    roleId: rData.roleId,
                                    roleName: rData.roleName,
                                    roleEnableFlag: rData.roleEnableFlag === 'Y' ? true : false,
                                    roleDefaultFlag: rData.roleDefaultFlag === 'Y' ? true : false,
                                    action: '',
                                });
                            }
                            this.parameterDataSource = new MatTableDataSource<
                                ParameterDataElement
                            >(this.parameterData);
                            this.parameterDataSource.paginator = this.paginator;
                          // this.parameterDataSource.sort = this.sort;
                        // Sorting Start
                           const sortState: Sort = {active: '', direction: ''};
                           this.sort.active = sortState.active;
                           this.sort.direction = sortState.direction;
                           this.sort.sortChange.emit(sortState);
                        // Sorting End
                          this.parameterDataSource.sort = this.sort;
                          // this.parameterDataSource.connect().subscribe(d => {
                          //   this.parameterDataSource.sortData(this.parameterDataSource.filteredData,
                          //     this.parameterDataSource.sort);
                          // });
                        } else {
                            this.listProgress = false;
                            this.dataResult = false;
                            this.roleTableMessage = data.message;
                        }
                    } else {
                        this.listProgress = false;
                        this.openSnackBar(data.message, '', 'error-snackbar');
                    }
                });
        }
      }
    });
}

ngOnDestroy() {
  this.searchInfoArrayunsubscribe ? this.searchInfoArrayunsubscribe.unsubscribe() : '';
  this.commonService.getsearhForMasters([]);
}
  ngAfterViewInit() {
    this.parameterDataSource.sort = this.sort;
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
  dateFormat(dateData: any) {
    const dp = new DatePipe(navigator.language);
    const p = 'y-MM-dd'; // YYYY-MM-DD
    const dtr = dp.transform(new Date(dateData), p);
    return dtr;
  }


  openSnackBar(message: string, action: string, typeClass: string) {
    this.snackBar.open(message, action, {
       duration: 3500,
      panelClass: [typeClass]
    });
  }

  // search for lookup
  searchForRole() {
      this.commonService.searhForMasters(this.dataForSearch);
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }
  // search for role open on search click
  searchForRoleOpen() {
      this.searchComponentToggle.emit(this.showSearch);
      this.searchEnable = true;
  }

  // show / hide search section
  getSearchToggle(searchToggle: boolean) {
      console.log('searchToggle');
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

  goFor(element:string, type:string){
    if(type === 'view'){
        const dialogData = [];
        dialogData.push(element);
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(RoleViewDialogComponent, {
            width: '80vw',
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.router.navigate(['roles/editrole/' + response]);
            }
        });


    } else{
        this.router.navigate(['roles/editrole/' + element]);
    }
  } 
}
@Component({
    selector: 'app-role-view-dialog',
    templateUrl: './role-view-dialog.html',
    styleUrls: ['./role-list.component.css']
})
export class RoleViewDialogComponent {
    webScreens: any = [];
    mobileScreens: any = [];
    screenCategoryArray: any = [];
    screenCategoryArray1: any = [];
    isExpressEnabled = false;
    screenMaxHeight = null
    constructor(
        private rolesService: RolesService,
        public commonService: CommonService,
        public dialogRef: MatDialogRef<RoleViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isExpressEnabled =
            JSON.parse(localStorage.getItem('userDetails')).expressLabelFlag ===
            'Y'
                ? true
                : false;
        this.getAllScreenById(data[0].roleId);
        this.screenMaxHeight = (window.innerHeight - 420) + 'px';
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    // function for getting all role screens by id
    getAllScreenById(id) {
        this.rolesService.getAllScreensById(id).subscribe(screens => {
            if (screens.status === 200) {
                if (screens.result.length > 0) {
                    for (const screen of screens.result) {
                        if (screen.screenEnabledFlag === 'Y') {
                            screen.screenEnabledFlag = true;
                        } else {
                            screen.screenEnabledFlag = false;
                        }
                        if (screen.screenTypes === 'Web') {
                            if (
                                !this.screenCategoryArray.includes(
                                    screen.screenCategory
                                )
                            ) {
                                this.screenCategoryArray.push(
                                    screen.screenCategory
                                );
                                this.webScreens[screen.screenCategory] = [
                                    screen
                                ];
                            } else {
                                this.webScreens[screen.screenCategory].push(
                                    screen
                                );
                            }
                        }
                        if (screen.screenTypes === 'Mobile') {
                            if (
                                !this.screenCategoryArray1.includes(
                                    screen.screenCategory
                                )
                            ) {
                                this.screenCategoryArray1.push(
                                    screen.screenCategory
                                );
                                this.mobileScreens[screen.screenCategory] = [
                                    screen
                                ];
                            } else {
                                this.mobileScreens[screen.screenCategory].push(
                                    screen
                                );
                            }
                        }
                    }
                }
            }
        });
    }
}
