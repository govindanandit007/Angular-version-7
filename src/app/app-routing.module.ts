import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { AuthGuard } from './_auth/auth.gaurd';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { NoContentComponent } from './_components/no-content/no-content.component';
import { HomepageComponent } from './_components/homepage/homepage.component';
import { DesignerComponent } from './_components/designer/designer.component';
import { TabsComponent } from './_components/tabs/tabs.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        outlet: 'login',
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: TabsComponent
    },
    // {
    //     path: 'homepage',
    //     component: HomepageComponent
    // },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'designer',
        component: DesignerComponent
    },
    {
        path: 'company',
        loadChildren: './masters/company/company.module#CompanyModule'
    },
    {
        path: 'users',
        loadChildren: './masters/users/users.module#UsersModule'
    },
    {
        path: 'tradingpartners',
        loadChildren:
            './masters/trading-partners/trading-partners.module#TradingPartnersModule'
    },
    {
        path: 'lookups',
        loadChildren: './lookups/lookups.module#LookupsModule'
    },
    {
        path: 'roles',
        loadChildren: './masters/roles/roles.module#RolesModule'
    },
    {
        path: 'category',
        loadChildren: './masters/category/category.module#CategoryModule'
    },
    {
        path: 'uom',
        loadChildren: './masters/uom/uom.module#UomModule'
    },
    {
        path: 'items',
        loadChildren: './masters/items/items.module#ItemsModule'
    },
    {
        path: 'purchaseorder',
        loadChildren:
            './transactions/purchase-order/purchase-order.module#PurchaseOrderModule'
    },
    {
        path: 'onhand',
        loadChildren: './transactions/onhand/onhand.module#OnhandModule'
    },
     {
        path: 'materialstatus',
        loadChildren:
            './transactions/material-status/material-status.module#MaterialStatusModule'
    },
     {
        path: 'materialstatussetup',
        loadChildren:
            './transactions/material-status-setup/material-status-setup.module#MaterialStatusSetupModule'
    },
    {
        path: 'receipts',
        loadChildren: './transactions/receipts/receipts.module#ReceiptsModule'
    },
    {
        path: 'serial',
        loadChildren:
            './transactions/serial-number/serial-number.module#SerialNumberModule'
    },
    {
        path: 'batch',
        loadChildren: './transactions/batch/batch.module#BatchModule'
    },
    {
        path: 'policies',
        loadChildren:
            './warehouse/putaway-policy/putaway-policy.module#PutawayPolicyModule'
    },
    {
        path: 'transactions',
        loadChildren:
            './transactions/transaction-inquiries/transaction-inquiries.module#TransactionInquiriesModule'
    },
    {
        path: 'asn',
        loadChildren: './transactions/asn/asn.module#AsnModule'
    },
    {
        path: 'salesorders',
        loadChildren:
            './outbound/sales-order/sales-order.module#SalesOrderModule'
    },
    {
        path: 'rma',
        loadChildren:
            './outbound/rma/rma.module#RmaModule'
    },
    {
        path: 'cyclecount',
        loadChildren:
            './warehouse/cycle-count/cycle-count.module#CycleCountModule'
    },
    {
        path: 'wave',
        loadChildren: './outbound/wave/wave.module#WaveModule'
    },
   
    {
        path: 'task',
        loadChildren: './warehouse/task/task.module#TaskModule'
    },
    {
        path: 'shipment',
        loadChildren: './outbound/shipment/shipment.module#ShipmentModule'
    },
    {
        path: 'printermanager',
        loadChildren:
            './labelSetup/printer-manager/printer-manager.module#PrinterManagerModule'
    },
    {
        path: 'datasource',
        loadChildren:
            './labelSetup/data-source/data-source.module#DataSourceModule'
    },
    {
        path: 'printhistory',
        loadChildren:
            './labelSetup/print-history/print-history.module#PrintHistoryModule'
    },
    {
        path: 'manualprint',
        loadChildren:
            './labelSetup/manual-print/manual-print.module#ManualPrintModule'
    },
    {
        path: 'rule',
        loadChildren:
            './labelSetup/rule/rule.module#RuleModule'
    },
    {
        path: 'addtionalfieldsetup',
        loadChildren:
            './settings/add-field-setup/add-field-setup.module#AddFieldSetupModule'
    },
    {
        path: 'systemoption',
        loadChildren:
            './settings/system-option/system-option.module#SystemOptionModule'
    },
    {
        path: 'jobschedule',
        loadChildren:
            './settings/job-schedule/job-schedule.module#JobScheduleModule'
    },
    {
        path: 'outboundlpn',
        loadChildren:
            './outbound/outbound-lpn/outbound-lpn.module#OutboundLpnModule'
    },
    {
        path: 'kitting',
        loadChildren:
            './manufacturing/kitting-dekitting/kitting-dekitting.module#KittingDekittingModule'
    },
    {
        path: 'dekitting',
        loadChildren:
            './manufacturing/kitting-dekitting/kitting-dekitting.module#KittingDekittingModule'
    },
    {
        path: 'wavemfg',
        loadChildren: './manufacturing/waveplan/waveplan.module#WaveplanModule'
    },
    {
        path: 'workorderissue',
        loadChildren: './manufacturing/workorderissue/workorderissue.module#WorkorderissueModule'
    },
    {
        path: 'activitymaster',
        loadChildren:
            './3pl/activity-master/activity-master.module#ActivityMasterModule'
    },
    {
        path: 'activitygroup',
        loadChildren:
            './3pl/activity-group/activity-group.module#ActivityGroupModule'
    },
    {
        path: 'contracts',
        loadChildren:
            './3pl/contracts/contracts.module#ContractsModule'
    },
    {
        path: 'billingtxnhistory',
        loadChildren:
            './3pl/billing-txn-history/billing-txn-history.module#BillingTxnHistoryModule'
    },
    {
        path: 'billingexehist',
        loadChildren:
            './3pl/billing-execution/billing-execution.module#BillingExecutionModule'
    },
    {
        path: 'reports',
        loadChildren:
            './settings/reports/reports.module#ReportsModule'
    },
    {
        path: 'accessDenied',
        component: AccessDeniedComponent
    },
        {
        path: '**',
        component: NoContentComponent,
    }


];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
