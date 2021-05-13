import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatIconModule
} from '@angular/material';
import { UomRoutingModule } from './uom-routing.module';
import { UomComponent } from './uom.component';
import { UnitOfMeasureComponent } from './unit-of-measure/unit-of-measure.component';
import { UomConversionComponent } from './uom-conversion/uom-conversion.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule, MatCardModule, MatTooltipModule,  MatButtonModule, MatPaginatorModule,
  MatTableModule, MatCheckboxModule, MatRippleModule, MatInputModule, MatSelectModule, MatSidenavModule,
  MatDividerModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, DateAdapter } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/_services/common/common.service';
import { UnitOfMeasureService } from 'src/app/_services/uom/unit-of-measure.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMenuModule } from '@angular/material/menu';
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
    declarations: [
        UomComponent,
        UnitOfMeasureComponent,
        UomConversionComponent
    ],
    imports: [
        CommonModule,
        UomRoutingModule,
        Ng7DynamicBreadcrumbModule,
        SharedModule,
        MatIconModule,
        MatTabsModule,
        MatCardModule,
        MatTooltipModule,
        FlexLayoutModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        MatCheckboxModule,
        FormsModule,
        MatRippleModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSortModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        UnitOfMeasureService,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class UomModule {}
