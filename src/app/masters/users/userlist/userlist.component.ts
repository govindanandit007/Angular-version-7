import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
    Optional,
    Inject,
    OnDestroy,
    ElementRef,
    HostListener,
    AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material';
import { Router, Event, NavigationEnd } from '@angular/router';
import { UsersService } from 'src/app/_services/users/users.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { CommonService } from 'src/app/_services/common/common.service';
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css'],
    providers: [UsersService]
})
export class UserlistComponent implements OnInit, AfterViewInit, OnDestroy {
    tooltipPosition: TooltipPosition[] = ['below'];
    displayedColumns: string[] = [
        'userId',
        'userName',
        'userStartDate',
        'userEndDate',
        'userEmail',
        'userEnabledFlag',
        'admin',
        'action'
    ];
    columns: any =  [
        {field: 'userId', name: '#', width: 75, baseWidth: 6 },
        {field: 'userName', name: 'User Name', width: 75, baseWidth: 14 },
        {field: 'userStartDate', name: 'Start Date', width: 75, baseWidth: 13 },
        {field: 'userEndDate', name: 'End Date', width: 75, baseWidth: 12 },
        {field: 'userEmail', name: 'Email', width: 150  , baseWidth: 25 },
        {field: 'userEnabledFlag', name: 'Enabled', width: 75, baseWidth: 10 },
        {field: 'admin', name: 'Admin', width: 75, baseWidth: 10 },
        {field: 'action', name: 'Action', width: 75, baseWidth: 10 }
    ]


    dataSource = new MatTableDataSource();
    private users = [];
    userTableMessage = '';
    // userTableMessage = 'No user defined.';
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, {read: ElementRef, static: false} ) matTableRef: ElementRef;

    @Output() searchComponentToggle = new EventEmitter<boolean>();
    searchEnable: boolean;
    showSearch = true;
    listProgress = false;
    private searchInfoArrayunsubscribe: any;
    dataForSearch: any;
    searchJson: any = this.http.get('./assets/search-jsons/users-search.json');
    constructor(
        public router: Router,
        private usersService: UsersService,
        public commonService: CommonService,
        public dialog: MatDialog,
        private http: HttpClient
    ) {
        this.searchEnable = true;
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    ngOnInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.getUsers();
        this.commonService.getScreenSize(-84); 
        this.searchJson.subscribe((data: any) => {
            this.dataForSearch = data;
            this.searchUser();
            this.searchForUser();
        });
    }
   

    addUser(event: any) {
        this.router.navigate(['users/adduser']);
    }

    editUser(id: any) {
        this.router.navigate(['users/edituser/' + id]);
    }
    searchUser() {
        this.searchInfoArrayunsubscribe = this.commonService.searchInfoArray.subscribe(
            (searchInfo: any) => {
                // This code is used for not loading the search result when module loads 
                if(searchInfo.fromSearchBtnClick === true){
                    // searchInfo.fromSearchBtnClick = false;
                    // this.commonService.getsearhForMasters(searchInfo);
                    this.dataSource = new MatTableDataSource();
                    this.dataSource.paginator = this.paginator;
                    if (searchInfo.searchType === 'user') {
                        this.listProgress = true;
                        this.usersService
                            .getUserSearch(searchInfo.searchArray)
                            .subscribe(data => {
                                if (data.status === 200) {
                                    if (!data.message) {
                                        this.listProgress = false;
                                        for (const rData of data.result) {
                                            if (rData.userEnabledFlag === 'Y') {
                                                rData.userEnabledFlag = true;
                                            }
                                            if (rData.userEnabledFlag === 'N') {
                                                rData.userEnabledFlag = false;
                                            }
                                            if (rData.userAdminFlag === 'Y') {
                                                rData.userAdminFlag = true;
                                            }
                                            if (rData.userAdminFlag === 'N') {
                                                rData.userAdminFlag = false;
                                            }
                                        }
                                        this.dataSource.data = data.result;
                                            // Sorting Start
                                               const sortState: Sort = {active: '', direction: ''};
                                               this.sort.active = sortState.active;
                                               this.sort.direction = sortState.direction;
                                               this.sort.sortChange.emit(sortState);
                                            // Sorting End
                                        this.dataSource.sort = this.sort;
                                        // this.dataSource.connect().subscribe(d => {
                                        //     this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
                                        // });
                                    } else {
                                        this.listProgress = false;
                                        this.userTableMessage = data.message;
                                    }
                                } else {
                                    this.listProgress = false;
                                }
                            });
                    }
                }else{
                    return;
                }
                // end
                
            }
        );
    }
    searchForUser() {
        this.commonService.searhForMasters(this.dataForSearch);
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

    goFor(element: string, type: string) {
        if (type === 'view') {
            const dialogData = [];
            dialogData.push(element);
            const dialogRef = this.dialog.open(UserViewDialogComponent, {
                width: '50vw',
                data: dialogData
            });
            console.log(dialogData);
            dialogRef.afterClosed().subscribe(response => {
                // console.log('The dialog was closed');
                if (response !== undefined) {
                    this.router.navigate(['users/edituser/' + response]);
                }
            });
        } else {
            this.router.navigate(['users/edituser/' + element]);
        }
    }

    ngOnDestroy() {
        this.searchInfoArrayunsubscribe
            ? this.searchInfoArrayunsubscribe.unsubscribe()
            : '';
            this.commonService.getsearhForMasters([]);
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        // this.dataSource.connect().subscribe(d => {
        //     this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
        // });
        setTimeout(() => {
            this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
            this.paginator.pageSizeOptions = this.commonService.paginationArray;
            this.paginator.pageSize = Number(window.localStorage.getItem('paginationSize') ? window.localStorage.getItem('paginationSize') : 10 );
        }, 100);
    }
   
    
      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.commonService.setTableResize(this.matTableRef.nativeElement.clientWidth, this.columns);
        this.commonService.getScreenSize(-84); 
      }


}
@Component({
    selector: 'app-user-view-dialog',
    templateUrl: './user-view-dialog.html',
    styleUrls: ['./userlist.component.css']
})
export class UserViewDialogComponent {
    userRoleViewdColumns: string[] = [
        'userRoleId',
        'userRoleName',
        'userRoleStartDate',
        'userRoleEndDate',
        'userRoleEnabledFlag'
    ];
    resultData = [];
    parameterDataSource = new MatTableDataSource<any>(this.resultData);
    userImgURL = '';

    constructor(
        private usersService: UsersService,
        public dialogRef: MatDialogRef<UserViewDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data[0].userImage === undefined || data[0].userImage === null) {
            this.userImgURL = 'assets/images/default-user-profile.jpg';
        } else {
            this.userImgURL =
                data[0].userImage.value.slice(1, -1) === ''
                    ? 'assets/images/default-user-profile.jpg'
                    : data[0].userImage.value.slice(1, -1);
        }
        this.getUserById(data[0].userId);
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    getUserById(id) {
        this.usersService.getUserById(id).subscribe((data: any) => {
            if (data.status === 200) {
                // console.log(data.result[0].roles[0]);
                if (data.result[0].roles.length) {
                    for (const roleData of data.result[0].roles) {
                        if (roleData.userRoleEnabledFlag === 'Y') {
                            roleData.userRoleEnabledFlag = true;
                        } else {
                            roleData.userRoleEnabledFlag = false;
                        }
                        this.resultData.push(roleData);
                        this.parameterDataSource = new MatTableDataSource<any>(
                            this.resultData
                        );
                    }
                }
            }
        });
    }

    
}
