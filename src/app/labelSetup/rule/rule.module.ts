import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleRoutingModule } from './rule-routing.module';
import { RuleComponent } from './rule.component';
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
    MatRadioModule,
    MatTreeModule,
    MatCardModule,
    MatButtonToggleModule,
    
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CommonService } from 'src/app/_services/common/common.service';
import { RuleListComponent } from './rule-list/rule-list.component';
import { AddRuleComponent } from './add-rule/add-rule.component';
// import { FilterComponent } from './filter/filter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [
        RuleComponent,
        RuleListComponent,
        AddRuleComponent
        // FilterComponent
    ],
    imports: [
        CommonModule,
        RuleRoutingModule,
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
        MatTreeModule,
        MatCardModule,
        MatButtonToggleModule,
        DragDropModule
    ],
    providers: [MatDatepickerModule, CommonService]
})
export class RuleModule {}
