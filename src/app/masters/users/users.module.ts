import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserlistComponent, UserViewDialogComponent } from './userlist/userlist.component';
import { AddUserComponent } from './add-user/add-user.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { UsersComponent } from './users.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatInputModule, MatNativeDateModule, MatTooltipModule,
  MatProgressSpinnerModule, MatRippleModule, MatToolbarModule, MatDialogModule, DateAdapter
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTableModule, MatIconModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { UsersService } from 'src/app/_services/users/users.service'
import { CommonService } from 'src/app/_services/common/common.service'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';
export const MY_FORMATS = {
  parse: {
    dateInput: 'll',
  },
  display: {
    dateInput: 'll',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'll',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
@NgModule({
    declarations: [
        UserlistComponent,
        AddUserComponent,
        UsersComponent,
        UserViewDialogComponent
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
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
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatTooltipModule,
        MatToolbarModule,
        MatDialogModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    providers: [
        MatDatepickerModule,
        UsersService,
        CommonService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: [UserViewDialogComponent]
})
export class UsersModule {}
