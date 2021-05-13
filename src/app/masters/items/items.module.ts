import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { ItemComponent, ItemViewDialogComponent } from './item/item.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {
    MatInputModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRippleModule,
    MatStepperModule,
    MatPaginatorModule,
    MatSpinner,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    DateAdapter
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
import {
    ItemRevisionComponent,
    ItemRevisionViewDialogComponent
} from './item-revision/item-revision.component';
import { ItemUomComponent } from './item-uom/item-uom.component';
import { ItemXRefComponent } from './item-x-ref/item-x-ref.component';
import { UnitOfMeasureService } from 'src/app/_services/uom/unit-of-measure.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { ItemSearchBarComponent } from './item-search-bar/item-search-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ItemAssignmentComponent } from './item-assignment/item-assignment.component';

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
        ItemsComponent,
        ItemComponent,
        ItemRevisionComponent,
        ItemUomComponent,
        ItemXRefComponent,
        ItemViewDialogComponent,
        ItemRevisionViewDialogComponent,
        ItemSearchBarComponent,
        ItemAssignmentComponent
    ],
    imports: [
        CommonModule,
        ItemsRoutingModule,
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
        MatStepperModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatDialogModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSidenavModule,
        MatTabsModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        CommonService,
        UnitOfMeasureService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
        // this line is add to get exact date what we have selected from the datepicker.
        // got issue in item-revision, so added 116line code to resolve that
    ],
    entryComponents: [ItemViewDialogComponent, ItemRevisionViewDialogComponent]
})
export class ItemsModule {}
