import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/_services/common/common.service';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { CompanyService } from 'src/app/_services/company.service';
import { AutheticationService } from 'src/app/_services/authetication.service';
export interface ExampleTab {
    label: string;
    link: string;
}

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    providers: [CommonService],
    styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
    isLinear = false;
    companyForm: FormGroup;
    OUForm: FormGroup;
    IUForm: FormGroup;
    locatorGroupForm: FormGroup;
    StockLocatorForm: FormGroup;

    sideNavSlection = '';
    public selectedStep = 0;
    public searchEnable: boolean;
    public checkSteps = [
        { template: 'company', title: 'Company' },
        { template: 'company/operatingunits', title: 'Operating Units' },
        { template: 'company/inventoryorganisations', title: 'Inventory Units' },
        { template: 'company/locatorgroups', title: 'Locator Groups' },
        { template: 'company/stocklocators', title: 'Stock Locators' }
    ];
    public steps: { template: string; title: string }[] = [
        // { template: 'company', title: 'Company' },
        // { template: 'company/operatingunits', title: 'Operating Units' },
        // { template: 'company/inventoryorganisations', title: 'Inventory Units' },
        // { template: 'company/locatorgroups', title: 'Locator Groups' },
        // { template: 'company/stocklocators', title: 'Stock Locators' }
    ];
    public tempSelectedSteps = [];

    @ViewChild('stepper', { static: false }) stepper: MatStepper;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    showSearchComponent = new BehaviorSubject('');
    showSearchFlag = this.showSearchComponent.asObservable();


    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        public dialog: MatDialog,
        public commonService: CommonService,
        private companyService: CompanyService,
        public autheticationService: AutheticationService
    ) {
        this.companyService.showSearchComponent.subscribe(
            (showSearchValue) => {
                this.searchEnable = showSearchValue
            }
        );
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Navigation Ended Successfully.
                this.sideNavSlection = event.url.split('/')[
                    event.url.split('/').length - 1
                ];
                 
                const userId = String(
                    JSON.parse(localStorage.getItem('userDetails')).userId
                );
                if( this.sideNavSlection === 'company' && userId !== '-1'){
                    this.searchEnable = false; 
                }
                this.showSearchComponent.next(this.sideNavSlection);
            }
        });
        
    }

    ngOnInit() { 
        this.autheticationService.screenArray.subscribe(screens => {
             
            if(screens.length){
                const tempArray = [];
                const tempSelectedArray = [];
                this.checkSteps.filter(step => {
                    if(screens.includes(step.template)){
                        tempArray.push(step);
                        tempSelectedArray.push(step.template.replace('company/',''));
                    }
                });
                this.steps = tempArray;
                this.tempSelectedSteps = tempSelectedArray;
            } else{
                this.autheticationService.getScreenUrlArray();
            }             
            this.showSearchComponent.next(this.sideNavSlection);
             setTimeout(() => {
                 this.moveStepper(this.sideNavSlection)
                 this.searchEnable = true;
             }, 0);
        });
    }

    moveStepper(sideNavSlection: string) {
        // const temp = [
        //     'company',
        //     'operatingunits',
        //     'inventoryorganisations',
        //     'locatorgroups',
        //     'stocklocators'
        // ];
        for (let i = 0; i < this.tempSelectedSteps.length; i++) {
            if (this.tempSelectedSteps[i] === sideNavSlection) {
                this.stepper.selectedIndex = i;
                this.selectedStep = i;
                // stepper.selectedIndex = 0;
                this.getSearchToggle(false,'');
                break;
            }
        }
    }

    // handle step routing
    selectionChanged(event: any) {
        this.selectedStep = event.selectedIndex;
        const step = this.steps[event.selectedIndex];
        this.router.navigateByUrl(step.template);
        this.getSearchToggle(false,'');
        this.stepper.selected.interacted = false;
    }

    toggleSideNav(data: any) {
       // alert('hello');
    }

    getSearchToggle(searchToggle: boolean, source: any) {
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
            if(source !== ''){
                this.companyService.searchCrossIconClicked(false);
            }else{
                this.companyService.searchCrossIconClicked(true);
            }
        }
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage
            }
        });
    }
}
