import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingExecutionRoutingModule } from './billing-execution-routing.module';
import { BillingExecutionComponent } from './billing-execution.component';
import { billingExecutionViewDialogComponent,BillingExecutionListComponent } from './billing-execution-list/billing-execution-list.component';
import { SearchBillingExecutionComponent } from './search-billing-execution/search-billing-execution.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [BillingExecutionComponent, BillingExecutionListComponent, SearchBillingExecutionComponent,billingExecutionViewDialogComponent],
  imports: [
    CommonModule,
    BillingExecutionRoutingModule,
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
    MatExpansionModule,
    DragDropModule
  ],
  entryComponents: [billingExecutionViewDialogComponent]
})
export class BillingExecutionModule { }
