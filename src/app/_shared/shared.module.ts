import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import {
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialog,
    MatDatepickerModule
} from '@angular/material';
import { AuthModule } from '../_auth/auth.module';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { TransactionSearchBarComponent } from './transaction-search-bar/transaction-search-bar.component';

import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
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
import { MatPaginatorIntl } from '@angular/material';
import { UomConversionSearchBarComponent } from './uom-conversion-search-bar/uom-conversion-search-bar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TpSearchBarComponent } from './tp-search-bar/tp-search-bar.component';
import { CcReviewSearchBarComponent } from './cc-review-search-bar/cc-review-search-bar.component';
import { MatTableExporterModule } from 'mat-table-exporter';

export class MatPaginatorIntlCro extends MatPaginatorIntl {
    itemsPerPageLabel = 'Records Per Page';
}
import { MatMenuModule } from '@angular/material/menu';
import { AddnlFieldDialogComponent } from './AdditionalField/addnl-field-dialog/addnl-field-dialog.component';
import { ConfirmationIuDialogComponent } from './confirmation-iu-dialog/confirmation-iu-dialog.component';
import { ChngPassDialogComponent } from './chng-pass-dialog/chng-pass-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
    declarations: [
        BreadcrumbComponent,
        SearchBarComponent,
        TransactionSearchBarComponent,
        UomConversionSearchBarComponent,
        ConfirmationDialogComponent,
        TpSearchBarComponent,
        CcReviewSearchBarComponent,
        AddnlFieldDialogComponent,
        ConfirmationIuDialogComponent,
        ChngPassDialogComponent
    ],
    imports: [
        CommonModule,
        Ng7DynamicBreadcrumbModule,
        MatIconModule,
        MatSnackBarModule,
        AuthModule,
        MatButtonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        FormsModule,
        MatTableExporterModule,
        MatMenuModule,
        MatDatepickerModule,
        DragDropModule
    ],
    exports: [
        BreadcrumbComponent,
        Ng7DynamicBreadcrumbModule,
        SearchBarComponent,
        UomConversionSearchBarComponent,
        TransactionSearchBarComponent,
        TpSearchBarComponent,
        CcReviewSearchBarComponent
    ],
     entryComponents: [
        ConfirmationIuDialogComponent,
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }
    ]
})
export class SharedModule {}
