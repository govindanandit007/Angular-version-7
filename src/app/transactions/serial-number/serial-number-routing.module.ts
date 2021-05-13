import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SerialNumberComponent } from './serial-number.component';
import { SerialNoListComponent } from './serial-no-list/serial-no-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';


const routes: Routes = [
  {
      path: '',
      component: SerialNumberComponent,
      data: {
          title: 'Serial',
          breadcrumb: [
              // { label: 'Transactions', url: '' },
              { label: 'Serial', url: '' },
              // { label: 'Receipts', url: '' }
          ]
      },
      children: [
          {
              path: '',
              component: SerialNoListComponent,
              data: {
                  title: 'Serial',
                  path:'serial',
                  breadcrumb: [
                      // { label: 'Transactions', url: '' },
                      { label: 'Serial', url: '' },
                      // { label: 'Receipt List', url: '' }
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'snolist',
              component: SerialNoListComponent,
              data: {
                  title: 'Serial',
                  path:'serial',
                  breadcrumb: [
                      // { label: 'Transactions', url: '' },
                      { label: 'Serial', url: '' },
                      // { label: 'Receipt List', url: '' }
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
export class SerialNumberRoutingModule { }
