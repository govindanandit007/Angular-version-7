import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsnRoutingModule } from './asn-routing.module';
import { AsnComponent } from './asn.component';
import { AsnListComponent, AsnViewDialogComponent } from './asn-list/asn-list.component';
import { AddAsnComponent, AsnPopupDialogComponent } from './add-asn/add-asn.component';

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
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule,
    MatDatepickerModule,
    DateAdapter,
    MAT_DATE_LOCALE,
    MAT_DATE_FORMATS
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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule, MY_FORMATS } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { AsnSearchComponent } from './asn-search/asn-search.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        AsnComponent,
        AsnListComponent,
        AddAsnComponent,
        AsnViewDialogComponent,
        AsnSearchComponent,
        AsnPopupDialogComponent
    ],
    imports: [
        CommonModule,
        AsnRoutingModule,
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
        MatDatepickerModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],

    providers: [
        CommonService,
        MatDatepickerModule,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: [AsnViewDialogComponent, AsnPopupDialogComponent]
})
export class AsnModule {}