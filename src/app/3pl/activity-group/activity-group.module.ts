import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityGroupRoutingModule } from './activity-group-routing.module';
import { ActivityGroupComponent } from './activity-group.component';
import { ActivityGroupListComponent, ActivityGroupViewDialogComponent } from './activity-group-list/activity-group-list.component';
import { AddActivityGroupComponent } from './add-activity-group/add-activity-group.component';
import { SearchActivityGroupComponent } from './search-activity-group/search-activity-group.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, 
  MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, 
  MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, 
  MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CommonService } from 'src/app/_services/common/common.service';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ActivityGroupComponent, ActivityGroupListComponent, 
    AddActivityGroupComponent, SearchActivityGroupComponent, ActivityGroupViewDialogComponent],
  imports: [
    CommonModule,
    ActivityGroupRoutingModule,
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
entryComponents: [ActivityGroupViewDialogComponent]
})
export class ActivityGroupModule { }
