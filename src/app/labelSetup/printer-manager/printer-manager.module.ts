import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrinterManagerRoutingModule } from './printer-manager-routing.module';
import { PrinterManagerComponent } from './printer-manager.component';
import { PrinterManagerListComponent, PrinterManagerViewDialogComponent } from './printer-manager-list/printer-manager-list.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatExpansionModule, MatRadioModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { PrinterManagerSearchComponent } from './printer-manager-search/printer-manager-search.component';
import { CreatePrinterManagerComponent } from './create-printer-manager/create-printer-manager.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
 


@NgModule({
  declarations: [PrinterManagerComponent, PrinterManagerListComponent, PrinterManagerSearchComponent, 
    CreatePrinterManagerComponent, PrinterManagerViewDialogComponent],
  imports: [
    CommonModule,
    PrinterManagerRoutingModule,
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
    MatExpansionModule,
    MatRadioModule,
    DragDropModule
  ],
  providers: [MatDatepickerModule, CommonService],
  entryComponents: [PrinterManagerViewDialogComponent]
})
export class PrinterManagerModule { }
