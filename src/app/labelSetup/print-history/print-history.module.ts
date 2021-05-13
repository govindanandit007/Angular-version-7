import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintHistoryRoutingModule } from './print-history-routing.module';
import { PrintHistoryComponent } from './print-history.component';
import { PrintHistoryListComponent, PrintHistoryViewDialogComponent } from './print-history-list/print-history-list.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatExpansionModule, MatRadioModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { SearchPrintHistoryComponent } from './search-print-history/search-print-history.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [PrintHistoryComponent, PrintHistoryListComponent, PrintHistoryViewDialogComponent, SearchPrintHistoryComponent],
  imports: [
    CommonModule,
    PrintHistoryRoutingModule,
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
  entryComponents: [PrintHistoryViewDialogComponent]
})
export class PrintHistoryModule { }
