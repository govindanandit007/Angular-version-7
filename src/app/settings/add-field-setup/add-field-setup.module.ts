import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFieldSetupRoutingModule } from './add-field-setup-routing.module';
import { AddFieldSetupComponent } from './add-field-setup.component';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { CommonService } from 'src/app/_services/common/common.service';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [AddFieldSetupComponent],
  imports: [
    CommonModule,
    AddFieldSetupRoutingModule,
    CommonModule,
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
  providers: [MatDatepickerModule, CommonService]

})
export class AddFieldSetupModule { }
