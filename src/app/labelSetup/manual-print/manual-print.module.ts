import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualPrintRoutingModule } from './manual-print-routing.module';
import { ManualPrintComponent } from './manual-print.component';
import { ManualPrintListComponent, ManualPrintPreviewDialogComponent} from './manual-print-list/manual-print-list.component';

import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import {
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
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
    MatExpansionModule,
    MatRadioModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [ManualPrintComponent, ManualPrintListComponent, ManualPrintPreviewDialogComponent],
    imports: [
        CommonModule,
        ManualPrintRoutingModule,
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
    entryComponents: [
       ManualPrintPreviewDialogComponent
    ],
    providers: [MatDatepickerModule, CommonService]
})
export class ManualPrintModule {}
