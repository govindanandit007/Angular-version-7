import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnhandRoutingModule } from './onhand-routing.module';
import { OnhandComponent } from './onhand.component';
import {
    MatTooltipModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule
    
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { SharedModule } from 'src/app/_shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {  MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatRippleModule } from '@angular/material/core';
import * as _moment from 'moment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OnhandDetailComponent } from './onhand-detail/onhand-detail.component';
import { OnhandListComponent } from './onhand-list/onhand-list.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
    declarations: [OnhandComponent, OnhandDetailComponent, OnhandListComponent],
    imports: [
        CommonModule,
        OnhandRoutingModule,
        MatTooltipModule,
        MatTableModule,
        Ng7DynamicBreadcrumbModule,
        SharedModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatRippleModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatSortModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class OnhandModule {}
