import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingExecutionComponent } from './billing-execution.component';
import { BillingExecutionListComponent } from './billing-execution-list/billing-execution-list.component';
const routes: Routes = [
  {
    path: '',
    component: BillingExecutionComponent ,
    data: {
        title: 'Billing Execution History',
        breadcrumb: [
            { label: 'Billing Execution History', url: '' }
        ]
    },
    children: [
      {
          path: '',
          component: BillingExecutionListComponent,
          data: {
            title: 'Billing Execution History',
            breadcrumb: [
                { label: 'Billing Execution History', url: '' }
            ]
          }
      },
      {
          path: 'billingtransactionhistory',
          component: BillingExecutionListComponent,
          data: {
            title: 'Billing Execution History',
            breadcrumb: [
                { label: 'Billing Execution History', url: '' }
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
export class BillingExecutionRoutingModule { }
