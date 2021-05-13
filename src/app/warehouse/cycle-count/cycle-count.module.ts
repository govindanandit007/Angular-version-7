import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CycleCountRoutingModule } from './cycle-count-routing.module';
import { CycleCountComponent } from './cycle-count.component';
import { CycleCountlistComponent, CycleCountViewDialogComponent, 
  CycleCountViewItemsDialogComponent } from './cycle-countlist/cycle-countlist.component';
import { AddCycleCountComponent } from './add-cycle-count/add-cycle-count.component';
import { CycleCountSearchComponent } from './cycle-count-search/cycle-count-search.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, 
  MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, 
  MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, 
  MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, 
  MatRadioModule, MatTabsModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule, MY_FORMATS } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { CycleCountReviewComponent } from './cycle-count-review/cycle-count-review.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        CycleCountComponent,
        CycleCountlistComponent,
        AddCycleCountComponent,
        CycleCountViewDialogComponent,
        CycleCountSearchComponent,
        CycleCountViewItemsDialogComponent,
        CycleCountReviewComponent
    ],
    imports: [
        CommonModule,
        CycleCountRoutingModule,
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
        MatRadioModule,
        MatTabsModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: [
        CycleCountViewDialogComponent,
        CycleCountViewItemsDialogComponent
    ]
})
export class CycleCountModule {}
