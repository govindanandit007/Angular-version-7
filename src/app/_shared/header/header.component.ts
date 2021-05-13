import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AutheticationService } from 'src/app/_services/authetication.service';
import { throwMatDialogContentAlreadyAttachedError, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import { PurchaseOrderService } from 'src/app/_services/purchase-order.service';
import { ConfirmationIuDialogComponent } from 'src/app/_shared/confirmation-iu-dialog/confirmation-iu-dialog.component';
import { ChngPassDialogComponent } from '../chng-pass-dialog/chng-pass-dialog.component';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    @Input() showSidebarBtn: boolean;
    confirmationIUDialogRef: MatDialogRef<ConfirmationIuDialogComponent>;
    ChngPassDialogRef: MatDialogRef<ChngPassDialogComponent>;
    isLogin: boolean;
    userName: string;
    userImgURL = '';
    iuId: any;
    iuCode: any;
    inventoryUnitList: any[] = [];
    constructor(
        public authService: AutheticationService,
        private router: Router,
        public commonService: CommonService,
        private purchaseOrderService: PurchaseOrderService,
        public dialog: MatDialog,private snackBar: MatSnackBar,
    ) {
        this.authService.isLoggedIn.subscribe(
            isLoggedInValue => (this.isLogin = isLoggedInValue)
        );
        this.userName = JSON.parse(
            localStorage.getItem('userDetails')
        ).userName;
    }

    ngOnInit() {
          this.purchaseOrderService.defaultIuDataObservable.subscribe((data: any) => {
                this.iuId = JSON.parse(localStorage.getItem('defaultIU')).id;
                this.iuCode = JSON.parse(localStorage.getItem('defaultIU')).code;
            // this.defaultIUSelectionChange(data);
        });
        this.getIuLov();

        //
        // if (JSON.parse(localStorage.getItem('userDetails')).userImage() !== '') {

        // }
        const imgString = JSON.parse(localStorage.getItem('userDetails'))
            .userImage;
        if (imgString === undefined || imgString === null) {
            this.userImgURL = 'assets/images/avatar_24px_2x.png';
        } else {
            this.userImgURL =
                imgString.slice(1, -1) === ''
                    ? 'assets/images/avatar_24px_2x.png'
                    : imgString.slice(1, -1);
        }
    }

    gotoHomePage() {
        window.localStorage.removeItem('taskDtailPage');
        this.router.navigate(['homepage']);
    }

    toggleSideNav() {
        this.notify.emit('toggleSideNav');
    }

    gotoDashboard() {
        this.router.navigate(['dashboard']);
    }
    // Get IU LOV
    getIuLov() {
        this.commonService.getUserAssignIULOV().subscribe(
            (data: any) => {
                this.inventoryUnitList = [];
                if (data.status === 200) {
                    console.log('iudata');
                    for (const iuData of data.result) {
                        this.inventoryUnitList.push({
                            value: iuData.iuId,
                            label: iuData.iuCode,
                            name: iuData.iuName
                        });
                        if (iuData.defaultFlag == 'Y') {
                            let defaultIU = {
                                id: iuData.iuId,
                                code: iuData.iuCode
                            };
                            window.localStorage.setItem(
                                'defaultIU',
                                JSON.stringify(defaultIU)
                            );
                            this.iuId = JSON.parse(
                                localStorage.getItem('defaultIU')
                            ).id;
                            this.iuCode = JSON.parse(
                                localStorage.getItem('defaultIU')
                            ).code;
                        }
                    }
                    if (localStorage.getItem('defaultIU') != undefined) {
                        this.iuId = Number(
                            JSON.parse(localStorage.getItem('defaultIU')).id
                        );
                        this.iuCode = JSON.parse(
                            localStorage.getItem('defaultIU')
                        ).code;
                    }
                } else {                     
                    this.openSnackBar(data.error.message, '', 'error-snackbar');
                }
            },
            (error: any) => {
                this.openSnackBar(error.error.message, '', 'error-snackbar');
            }
        );
    }
    openSnackBar(message: string, action: string, typeClass: string) {
        this.snackBar.open(message, action, {
          duration: 3500,
          panelClass: [typeClass]
        });
      }
    defaultIUChanged(event: any, value: any, label: any) {
        if (event.source.selected && event.isUserInput === true) {
            let defaultIU = {
                id: value,
                code: label
            };
            // let data = '';
            if (JSON.parse(localStorage.getItem('defaultIU')).id !== value) {
                 this.openIuConfirmationDialog(
                    'iu Id',
                    defaultIU
                );
            } 
            // this.commonService.setDefaultIU(value);
            // window.localStorage.setItem('defaultIU',JSON.stringify(defaultIU));
            
        }
    }
    
    openIuConfirmationDialog(pageName: string, data: any) {
        this.confirmationIUDialogRef = this.dialog.open(ConfirmationIuDialogComponent, {
            data: {
                pageName: pageName,
                data: data,
            },
            width: '30vw',
            disableClose: true
        });
    }

    changePassword() {
        this.ChngPassDialogRef = this.dialog.open(ChngPassDialogComponent, {
            data: {
                
            },
            width: '40vw',
            disableClose: true
        });
    }
    

}
