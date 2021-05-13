import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutboundLpnRoutingModule } from './outbound-lpn-routing.module';
import { OutboundLpnComponent } from './outbound-lpn.component';
import { OutboundLpnListComponent } from './outbound-lpn-list/outbound-lpn-list.component';
import { OutboundLpnSearchComponent } from './outbound-lpn-search/outbound-lpn-search.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatAutocompleteModule, MatRadioModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule, MY_FORMATS } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { OutboundLpnService } from 'src/app/_services/outbound/outbound-lpn.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        OutboundLpnComponent,
        OutboundLpnListComponent,
        OutboundLpnSearchComponent
    ],

    imports: [
        CommonModule,
        OutboundLpnRoutingModule,
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
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        OutboundLpnService,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class OutboundLpnModule {}
