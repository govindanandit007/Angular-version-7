import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RoleListComponent, RoleViewDialogComponent } from './role-list/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatInputModule, MatNativeDateModule, MatTooltipModule, MatRippleModule,
  MatPaginatorModule, MatSpinner, MatProgressSpinnerModule, MatToolbarModule, MatDialogModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTableModule, MatIconModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service'
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        RolesComponent,
        RoleListComponent,
        AddRoleComponent,
        RoleViewDialogComponent
    ],
    imports: [
        CommonModule,
        RolesRoutingModule,
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
    entryComponents: [RoleViewDialogComponent]
})
export class RolesModule {}
