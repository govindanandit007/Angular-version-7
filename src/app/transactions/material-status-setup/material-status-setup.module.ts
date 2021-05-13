import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialStatusSetupRoutingModule } from './material-status-setup-routing.module';
import { MaterialStatusSetupComponent } from './material-status-setup.component';

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
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialStatusSetupAddComponent } from './material-status-setup-add/material-status-setup-add.component';
import { MaterialStatusSetupListComponent, MaterialStatusSetupViewDialogComponent} from './material-status-setup-list/material-status-setup-list.component';
import { MaterialStatusSetupSearchComponent } from './material-status-setup-search/material-status-setup-search.component';
@NgModule({
  declarations: [MaterialStatusSetupComponent, MaterialStatusSetupAddComponent, 
  MaterialStatusSetupListComponent, MaterialStatusSetupSearchComponent,
  MaterialStatusSetupViewDialogComponent],
  imports: [
    CommonModule,
    MaterialStatusSetupRoutingModule,
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
        MatTableExporterModule
  ],
  entryComponents: [MaterialStatusSetupViewDialogComponent]
})
export class MaterialStatusSetupModule { }
