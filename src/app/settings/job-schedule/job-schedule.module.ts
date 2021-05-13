import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobScheduleRoutingModule } from './job-schedule-routing.module';
import { JobScheduleComponent } from './job-schedule.component';
import { AddJobscheduleComponent } from './add-jobschedule/add-jobschedule.component';
import { JobscheduleduleListComponent, JsViewDialogComponent } from './jobscheduledule-list/jobscheduledule-list.component';
import { JobscheduleduleHistoryComponent } from './jobscheduledule-history/jobscheduledule-history.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule,
   MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, 
   MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, 
   MatSidenavModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { JobListSearchComponent } from './job-list-search/job-list-search.component';
import { JobHistorySearchComponent } from './job-history-search/job-history-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [
        JobScheduleComponent,
        AddJobscheduleComponent,
        JobscheduleduleListComponent,
        JsViewDialogComponent,
        JobscheduleduleHistoryComponent,
        JobListSearchComponent,
        JobHistorySearchComponent
    ],
    imports: [
        JobScheduleRoutingModule,
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
    providers: [MatDatepickerModule, CommonService],
    entryComponents: [JsViewDialogComponent]
})
export class JobScheduleModule {}
