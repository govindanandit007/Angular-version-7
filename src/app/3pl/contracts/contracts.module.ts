import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { ContractsListComponent, ContractViewDialogComponent } from './contracts-list/contracts-list.component';
import { AddContractsComponent } from './add-contracts/add-contracts.component';
import { SearchContractsComponent } from './search-contracts/search-contracts.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDividerModule, 
  MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, 
  MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, 
  MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CommonService } from 'src/app/_services/common/common.service';
import { ActivitiesComponent } from './activities/activities.component';
import { ItemsComponent, ItemTxnViewDialogComponent } from './items/items.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ContractsComponent, ContractsListComponent, AddContractsComponent, 
    SearchContractsComponent, ContractViewDialogComponent, ActivitiesComponent, ItemsComponent, ItemTxnViewDialogComponent],
  imports: [
    CommonModule,
    ContractsRoutingModule,
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
  entryComponents: [ContractViewDialogComponent, ItemTxnViewDialogComponent]
})
export class ContractsModule { }
