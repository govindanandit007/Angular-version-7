import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaveRoutingModule } from './wave-routing.module';
import { WaveComponent } from './wave.component';
import { WaveListComponent, WaveViewDialogComponent, AllocationsViewItemsDialogComponent } from './wave-list/wave-list.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatExpansionModule, MatRadioModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { WaveSearchComponent } from './wave-search/wave-search.component';
import { AddWaveCriteriaComponent, SchedulingDialogComponent } from './add-wave-criteria/add-wave-criteria.component';
import { EditWaveComponent } from './edit-wave/edit-wave.component';
import { AllocationsComponent } from './allocations/allocations.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        WaveComponent,
        WaveListComponent,
        WaveSearchComponent,
        AddWaveCriteriaComponent,
        WaveViewDialogComponent,
        EditWaveComponent,
        AllocationsComponent,
        AllocationsViewItemsDialogComponent,
        SchedulingDialogComponent
    ],
    imports: [
        CommonModule,
        WaveRoutingModule,
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
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [MatDatepickerModule, CommonService],
    entryComponents: [
        WaveViewDialogComponent,
        AllocationsViewItemsDialogComponent,
        SchedulingDialogComponent
    ]
})
export class WaveModule {}
