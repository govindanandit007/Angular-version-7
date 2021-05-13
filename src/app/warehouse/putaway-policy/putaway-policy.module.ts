import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PutawayPolicyRoutingModule } from './putaway-policy-routing.module';
import { PutawayPolicyComponent } from './putaway-policy.component';
import { PutawayPolicyRoutingComponent } from './putaway-policy-routing/putaway-policy-routing.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatInputModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSpinner,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {  MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import * as _moment from 'moment';
import { PutawayBusinessRulesComponent } from './putaway-business-rules/putaway-business-rules.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';

export const MY_FORMATS = {
    parse: {
        dateInput: 'll',
    },
    display: {
        dateInput: 'll',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'll',
        monthYearA11yLabel: 'MMM YYYY',
    },
};

@NgModule({
    declarations: [
        PutawayPolicyComponent,
        PutawayPolicyRoutingComponent,
        PutawayBusinessRulesComponent
    ],
    imports: [
        CommonModule,
        PutawayPolicyRoutingModule,
        Ng7DynamicBreadcrumbModule,
        MatTableModule,
        MatPaginatorModule,
        MatDividerModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSortModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatDialogModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSidenavModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        DragDropModule,
        MatListModule,
        MatMenuModule,
        MatTableExporterModule
    ],
    providers: [
        MatDatepickerModule,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: []
})
export class PutawayPolicyModule {}
