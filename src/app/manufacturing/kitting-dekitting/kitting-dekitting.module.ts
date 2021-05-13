import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KittingDekittingRoutingModule } from './kitting-dekitting-routing.module';
import { KittingDekittingComponent } from './kitting-dekitting.component';
import { WoListComponent, WoViewDialogComponent } from './wo-list/wo-list.component';
import { CreateWoComponent } from './create-wo/create-wo.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { WoSearchComponent } from './wo-search/wo-search.component';
import { WorkOrderIssueComponent } from './work-order-issue/work-order-issue.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [KittingDekittingComponent, WoListComponent, CreateWoComponent, WoSearchComponent, WorkOrderIssueComponent, WoViewDialogComponent],
  imports: [
    CommonModule,
    KittingDekittingRoutingModule,
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
  entryComponents: [WoViewDialogComponent]
  
})
export class KittingDekittingModule { }
