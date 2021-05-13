import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityMasterRoutingModule } from './activity-master-routing.module';
import { ActivityMasterComponent } from './activity-master.component';
import { ActivityMasterListComponent, ActivityMasterViewDialogComponent } from './activity-master-list/activity-master-list.component';
import { AddActivityMasterComponent } from './add-activity-master/add-activity-master.component';
import { SearchActivityMasterComponent } from './search-activity-master/search-activity-master.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, 
  MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule,
  MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CommonService } from 'src/app/_services/common/common.service';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ActivityMasterComponent, ActivityMasterListComponent, AddActivityMasterComponent, 
    SearchActivityMasterComponent, ActivityMasterViewDialogComponent],
  imports: [
      ActivityMasterRoutingModule,
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
      MatTableExporterModule,
      DragDropModule
  ],
  providers: [MatDatepickerModule, CommonService],
  entryComponents: [ActivityMasterViewDialogComponent]
})
export class ActivityMasterModule { }
