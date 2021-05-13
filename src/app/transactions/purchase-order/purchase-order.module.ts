import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatInputModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRippleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { PoListComponent, PoViewDialogComponent } from './po-list/po-list.component';
import { AddPoComponent } from './add-po/add-po.component';
import { PurchaseOrderSearchComponent } from './purchase-order-search/purchase-order-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
    declarations: [
        PurchaseOrderComponent,
        PoListComponent,
        AddPoComponent,
        PoViewDialogComponent,
        PurchaseOrderSearchComponent
    ],
    imports: [
        CommonModule,
        PurchaseOrderRoutingModule,
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
    entryComponents: [PoViewDialogComponent]
})
export class PurchaseOrderModule {}
