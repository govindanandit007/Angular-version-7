import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SolistComponent, SoViewDialogComponent } from './solist/solist.component';
import { AddSoComponent } from './add-so/add-so.component';
import { SalesOrderComponent } from './sales-order.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, 
  MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, 
  MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, 
  MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, 
  MatNativeDateModule, MatTooltipModule, MatSidenavModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { SoSearchComponent } from './so-search/so-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        SalesOrderComponent,
        SolistComponent,
        AddSoComponent,
        SoSearchComponent,
        SoViewDialogComponent
    ],
    imports: [
        CommonModule,
        SalesOrderRoutingModule,
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
    entryComponents: [SoViewDialogComponent]
})
export class SalesOrderModule {}
