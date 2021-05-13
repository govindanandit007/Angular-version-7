import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionInquiriesComponent } from './transaction-inquiries.component';
import { TransactionInquiriesListComponent } from './transaction-inquiries-list/transaction-inquiries-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';


const routes: Routes = [
  {
      path: '',
      component: TransactionInquiriesComponent,
      data: {
          title: 'Transactions',
          breadcrumb: [
              { label: 'Transactions List', url: '' }
             
          ]
      },
      children: [
          {
              path: '',
              component: TransactionInquiriesListComponent,
              data: {
                  title: 'transactions',
                  path:'transactions',
                  breadcrumb: [
                      { label: 'Transactions List', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'transactions',
              component: TransactionInquiriesListComponent,
              data: {
                  title: 'Receipts',
                  path:'transactions',
                  breadcrumb: [
                    { label: 'Transactions List', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionInquiriesRoutingModule { }
