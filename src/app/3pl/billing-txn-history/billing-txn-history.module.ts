import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingTxnHistoryRoutingModule } from './billing-txn-history-routing.module';
import { BillingTxnHistoryComponent } from './billing-txn-history.component';
import { ItemTxnViewDialogComponent, TxnBillingHistoryListComponent } from './txn-billing-history-list/txn-billing-history-list.component';
import { SearchTxnBillingHistoryComponent } from './search-txn-billing-history/search-txn-billing-history.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [BillingTxnHistoryComponent, TxnBillingHistoryListComponent, SearchTxnBillingHistoryComponent, ItemTxnViewDialogComponent],
  imports: [
    CommonModule,
    BillingTxnHistoryRoutingModule,
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
  entryComponents: [ItemTxnViewDialogComponent]
})
export class BillingTxnHistoryModule { }
