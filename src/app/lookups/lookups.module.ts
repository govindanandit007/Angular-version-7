import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupsRoutingModule } from './lookups-routing.module';
import { LookupListComponent, LookupViewDialogComponent } from './lookup-list/lookup-list.component';
import { AddLookupComponent } from './add-lookup/add-lookup.component';
import { LookupsComponent } from './lookups.component';

import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatInputModule, MatNativeDateModule, MatTooltipModule, MatRippleModule,
  MatPaginatorModule, MatSpinner, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTableModule, MatIconModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        LookupListComponent,
        AddLookupComponent,
        LookupsComponent,
        LookupViewDialogComponent
    ],
    imports: [
        CommonModule,
        LookupsRoutingModule,
        Ng7DynamicBreadcrumbModule,
        MatTableModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSortModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSidenavModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatDialogModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [MatDatepickerModule],
    entryComponents: [LookupViewDialogComponent]
})
export class LookupsModule {}
