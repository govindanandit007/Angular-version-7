import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { SideBarComponent } from './_shared/side-bar/side-bar.component';
import { HeaderComponent } from './_shared/header/header.component';
import { LoginComponent, LoginPasswordSetDialogComponent } from './_components/login/login.component';

import 'hammerjs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule, MatTreeModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { SliderModule } from '@syncfusion/ej2-angular-inputs';
import { EnableEditDirective } from './_shared/directive/enable-edit.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './_shared/message-dialog/message-dialog.component';
import { AuthModule } from './_auth/auth.module';
import { SharedModule } from './_shared/shared.module';
import { ConfirmationDialogComponent } from './_shared/confirmation-dialog/confirmation-dialog.component';
import { AutofocusDirective } from './_shared/directive/autofocus.directive';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { NoContentComponent } from './_components/no-content/no-content.component';
import { HomepageComponent } from './_components/homepage/homepage.component';
import { DesignerComponent } from './_components/designer/designer.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';
import { AddnlFieldDialogComponent } from './_shared/AdditionalField/addnl-field-dialog/addnl-field-dialog.component';

import {
    MatSelectModule
} from '@angular/material';
import { TabsComponent } from './_components/tabs/tabs.component';
import { ChngPassDialogComponent } from './_shared/chng-pass-dialog/chng-pass-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        SideBarComponent,
        HeaderComponent,
        EnableEditDirective,
        MessageDialogComponent,
        LoginPasswordSetDialogComponent,
        AutofocusDirective,
        AccessDeniedComponent,
        NoContentComponent,
        HomepageComponent,
        DesignerComponent,
        TabsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatTreeModule,
        MatMenuModule,
        MatButtonModule,
        FlexLayoutModule,
        MatInputModule,
        MatCheckboxModule,
        MatCardModule,
        MatDividerModule,
        MatListModule,
        SliderModule,
        MatDialogModule,
        AuthModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatTableExporterModule,
        TelerikReportingModule,
        MatSelectModule,
        MatTabsModule
    ],
    providers: [MatTableExporterModule],
    entryComponents: [
        MessageDialogComponent,
        ConfirmationDialogComponent,
        LoginPasswordSetDialogComponent,
        AddnlFieldDialogComponent,
        ChngPassDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
