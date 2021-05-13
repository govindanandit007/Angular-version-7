import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerialNumberRoutingModule } from './serial-number-routing.module';
import { SerialNumberComponent } from './serial-number.component';
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
import { SerialNoListComponent } from './serial-no-list/serial-no-list.component';
import { SerialNoSearchComponent } from './serial-no-search/serial-no-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [
        SerialNumberComponent,
        SerialNoListComponent,
        SerialNoSearchComponent
    ],
    imports: [
        SerialNumberRoutingModule,
        CommonModule,
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
        MatMenuModule,
        MatTableExporterModule
    ],
    providers: [MatDatepickerModule, CommonService]
})
export class SerialNumberModule {}
