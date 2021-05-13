import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingPartnersRoutingModule } from './trading-partners-routing.module';
import { TradingPartnersComponent } from './trading-partners.component';
import { TradingPartnerComponent, TradingPartnerViewDialogComponent, TradingPartnerSiteViewDialogComponent } from './trading-partner/trading-partner.component';


import { MatStepperModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatTabsModule, MatTableModule, MatIconModule, MatRippleModule, MatToolbarModule, MatSidenavModule, MatProgressSpinnerModule, MatPaginatorModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http'
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadModule } from 'ng2-file-upload';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/_shared/shared.module';
import { AddTradingPartnerComponent } from './add-trading-partner/add-trading-partner.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
    declarations: [
        TradingPartnersComponent,
        TradingPartnerComponent,
        AddTradingPartnerComponent,
        TradingPartnerViewDialogComponent,
        TradingPartnerSiteViewDialogComponent
    ],
    imports: [
        CommonModule,
        TradingPartnersRoutingModule,
        MatStepperModule,
        MatDialogModule,
        HttpClientModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDividerModule,
        FileUploadModule,
        MatTooltipModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatIconModule,
        MatRippleModule,
        SharedModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTableExporterModule,
        DragDropModule
    ],
    entryComponents: [
        TradingPartnerViewDialogComponent,
        TradingPartnerSiteViewDialogComponent
    ]
})
export class TradingPartnersModule {}
