import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatRadioModule } from '@angular/material';

import { ReceiptsRoutingModule } from './receipts-routing.module';
import { ReceiptsComponent } from './receipts.component';
import { ReceiptListComponent, ReceiptViewDialogComponent } from './receipt-list/receipt-list.component';
import { AddReceiptComponent, batchSerialDialogComponent } from './add-receipt/add-receipt.component';
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
    MatSpinner,
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
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        ReceiptsComponent,
        ReceiptListComponent,
        AddReceiptComponent,
        ReceiptViewDialogComponent,
        batchSerialDialogComponent
    ],
    imports: [
        CommonModule,
        ReceiptsRoutingModule,
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
        MatAutocompleteModule,
        MatRadioModule,
        DragDropModule
    ],
    providers: [MatDatepickerModule, CommonService],
    entryComponents: [ReceiptViewDialogComponent, batchSerialDialogComponent]
})
export class ReceiptsModule {}
