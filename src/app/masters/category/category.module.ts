import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { SharedModule } from 'src/app/_shared/shared.module';
import {
  MatTooltipModule, MatCheckboxModule, MatRippleModule,
  MatIconModule, MatProgressSpinnerModule, MatTableModule, MatButtonModule,
  MatFormFieldModule, MatInputModule, MatSidenavModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [CategoryComponent],
    imports: [
        CommonModule,
        CategoryRoutingModule,
        Ng7DynamicBreadcrumbModule,
        SharedModule,
        MatTooltipModule,
        FormsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        FlexLayoutModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatSortModule,
        MatMenuModule,
        MatTableExporterModule
    ]
})
export class CategoryModule {}
