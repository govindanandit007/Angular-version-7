import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatTableModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRippleModule, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule, MatNativeDateModule, MatTooltipModule, MatSidenavModule, MatExpansionModule, MatRadioModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
//import { WaveSearchComponent } from './wave-search/wave-search.component';
//import { AddWaveCriteriaComponent, SchedulingDialogComponent } from './add-wave-criteria/add-wave-criteria.component';
//import { AllocationsComponent } from './allocations/allocations.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
 
import { AllocationsViewItemsDialogComponent, WaveplanListComponent, WaveViewDialogComponent } from './waveplan-list/waveplan-list.component';
import { CreateWaveplanComponent, SchedulingDialogComponent } from './create-waveplan/create-waveplan.component';
import { EditWaveplanComponent } from './edit-waveplan/edit-waveplan.component';
import { WaveplanComponent } from './waveplan.component';
import { WaveplanRoutingModule } from './waveplan-routing.module';
import { WaveplanSearchComponent } from './waveplan-search/waveplan-search.component';
import { AllocationsComponent } from './allocations/allocations.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [WaveplanListComponent, CreateWaveplanComponent, EditWaveplanComponent, WaveplanComponent, 
    WaveplanSearchComponent,SchedulingDialogComponent,WaveViewDialogComponent, AllocationsViewItemsDialogComponent, AllocationsComponent],
   
  imports: [
    CommonModule,
    WaveplanRoutingModule,
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
export class WaveplanModule { }
