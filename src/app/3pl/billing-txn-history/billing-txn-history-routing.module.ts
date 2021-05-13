import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingTxnHistoryComponent } from './billing-txn-history.component';
import { TxnBillingHistoryListComponent } from './txn-billing-history-list/txn-billing-history-list.component';


const routes: Routes = [
  {
    path: '',
    component: BillingTxnHistoryComponent ,
    data: {
        title: 'Billing Transaction History',
        breadcrumb: [
            { label: 'Billing Transaction History', url: '' }
        ]
    },
    children: [
      {
          path: '',
          component: TxnBillingHistoryListComponent,
          data: {
            title: 'Billing Transaction History',
            breadcrumb: [
                { label: 'Billing Transaction History', url: '' }
            ]
          }
      },
      {
          path: 'billingtransactionhistory',
          component: TxnBillingHistoryListComponent,
          data: {
            title: 'Billing Transaction History',
            breadcrumb: [
                { label: 'Billing Transaction History', url: '' }
            ]
          }
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingTxnHistoryRoutingModule { }
