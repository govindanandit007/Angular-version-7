import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionInquiriesRoutingModule } from './transaction-inquiries-routing.module';
import { TransactionInquiriesSearchComponent } from './transaction-inquiries-search/transaction-inquiries-search.component';
import { TransactionInquiriesListComponent } from './transaction-inquiries-list/transaction-inquiries-list.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatAutocompleteModule, MatRadioModule, MatSort } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule, MY_FORMATS } from 'src/app/_shared/shared.module';
import { TransactionInquiriesComponent } from './transaction-inquiries.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { TransactionInquiriesService } from 'src/app/_services/transactions/transaction-inquiries.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [
        TransactionInquiriesComponent,
        TransactionInquiriesSearchComponent,
        TransactionInquiriesListComponent
    ],

    imports: [
        CommonModule,
        TransactionInquiriesRoutingModule,
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
        MatAutocompleteModule,
        MatRadioModule,
        MatSortModule,
        MatMenuModule,
        MatTableExporterModule
    ],
    providers: [
        MatDatepickerModule,
        TransactionInquiriesService,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class TransactionInquiriesModule {}
