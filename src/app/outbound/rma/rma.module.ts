import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmaRoutingModule } from './rma-routing.module';
import { RmaComponent } from './rma.component';
import { RmaListComponent,rmaViewDialogComponent } from './rma-list/rma-list.component';
import { AddRmaComponent } from './add-rma/add-rma.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import {
  MatTableModule, MatPaginatorModule, MatDividerModule,
  MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule,
  MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
  MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule,
  MatNativeDateModule, MatTooltipModule, MatSidenavModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { RmaSearchComponent } from './rma-search/rma-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    RmaComponent,
    RmaListComponent,
    RmaSearchComponent,
    AddRmaComponent,
    rmaViewDialogComponent
  ],
  imports: [
    CommonModule,
    RmaRoutingModule,
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
    DragDropModule,
  ],
  providers: [MatDatepickerModule, CommonService],
  entryComponents: [rmaViewDialogComponent]
})
export class RmaModule { }
