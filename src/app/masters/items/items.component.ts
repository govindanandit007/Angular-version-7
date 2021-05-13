import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatStepper } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ItemsService } from 'src/app/_services/items.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
    @ViewChild('stepper', { static: true }) stepper: MatStepper;
    isLinear = false;
    sideNavSlection = '';
    public selectedStep = 0;
    public searchEnable: boolean;
    messageDialogRef: MatDialogRef<MessageDialogComponent>;
    showSearchComponent = new BehaviorSubject('');
    showSearchFlag = this.showSearchComponent.asObservable();
    sideNavSelection = '';
    public steps: { template: string; title: string }[] = [
        { template: 'items', title: 'Item' },
        { template: 'items/itemCrossRef', title: 'Item Cross Reference' },       
        { template: 'items/itemUOM', title: 'Item UOM Conversion' },
        { template: 'items/itemRevision', title: 'Item Revision' },
        { template: 'items/itemassignment', title: 'Item Assignment' }
    ];

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private itemsService: ItemsService
    ) {
        this.itemsService.showSearchComponent.subscribe(
            showSearchValue => (this.searchEnable = showSearchValue)
        );
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Navigation Ended Successfully.
                this.sideNavSelection = event.url.split('/')[
                    event.url.split('/').length - 1
                ];
                 if( this.sideNavSlection === 'itemassignment'){
                    this.searchEnable = false;
                    // this.getSearchToggle(false,'');
                }
                // else{
                // this.getSearchToggle(true,'');
                // }
                this.moveStepper(this.sideNavSelection);
                this.showSearchComponent.next(this.sideNavSelection);
            }
        });
    }

    ngOnInit() {}

    // get search toggle
    getSearchToggle(searchToggle: boolean, source: any) {
        if (searchToggle === true) {
            this.searchEnable = searchToggle;
        } else {
            this.searchEnable = searchToggle;
            if(source !== ''){
                this.itemsService.searchCrossIconClicked(false);
            }else{
                this.itemsService.searchCrossIconClicked(true);
            }
        }
    }

    moveStepper(sideNavSlection: string) {
        const temp = [
            'items',
            'itemCrossRef',            
            'itemUOM',
            'itemRevision',
            'itemassignment'
        ];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] === sideNavSlection) {
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
        this.getSearchToggle(false, '');
        this.stepper.selected.interacted = false;
    }

    openDialog(dialogType: string, dialogMessage: any) {
        this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
                type: dialogType,
                message: dialogMessage
            }
        });
    }

    dateFormat(dateData: any) {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(dateData), p);
        return dtr;
    }
}
