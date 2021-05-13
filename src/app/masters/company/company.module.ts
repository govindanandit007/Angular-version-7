import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import {
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgGridModule } from 'ag-grid-angular';

import { CompanyComponent } from './company.component';
import {
    CompanyfeedComponent,
    CompanyFeedViewDialogComponent
} from './companyfeed/companyfeed.component';
import {
    OperatingunitsComponent,
    OperatingUnitsViewDialogComponent
} from './operatingunits/operatingunits.component';
import { StockLocatorsComponent } from './stock-locators/stock-locators.component';
import {
    InventoryOrganizationComponent,
    InventoryUnitsViewDialogComponent
} from './inventory-organization/inventory-organization.component';
import {
    SubInventoryComponent,
    SubInventoryViewDialogComponent
} from './sub-inventory/sub-inventory.component';

import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule, MatNativeDateModule, NativeDateModule, DateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SharedModule } from 'src/app/_shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MessageDialogComponent } from 'src/app/_shared/message-dialog/message-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {  MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
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
import {DragDropModule} from '@angular/cdk/drag-drop';

import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {A11yModule} from '@angular/cdk/a11y';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
    declarations: [
        CompanyComponent,
        CompanyfeedComponent,
        CompanyFeedViewDialogComponent,
        OperatingunitsComponent,
        OperatingUnitsViewDialogComponent,
        InventoryOrganizationComponent,
        InventoryUnitsViewDialogComponent,
        SubInventoryComponent,
        SubInventoryViewDialogComponent,
        StockLocatorsComponent
    ],
    imports: [
        CommonModule,
        CompanyRoutingModule,
        MatStepperModule,
        MatButtonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        MatTabsModule,
        MatTableModule,
        FileUploadModule,
        MatDialogModule,
        MatIconModule,
        Ng7DynamicBreadcrumbModule,
        HttpClientModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatRippleModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatSidenavModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        NativeDateModule,
        AgGridModule.withComponents([]),
        A11yModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        ScrollingModule,
        MatSortModule,
        MomentTimezonePickerModule,
        MatTableExporterModule,
        MatMenuModule
    ],
    entryComponents: [
        OperatingunitsComponent,
        OperatingUnitsViewDialogComponent,
        InventoryUnitsViewDialogComponent,
        SubInventoryViewDialogComponent,
        CompanyFeedViewDialogComponent,
        StockLocatorsComponent
    ],
    providers: [
        MessageDialogComponent,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class CompanyModule {}
