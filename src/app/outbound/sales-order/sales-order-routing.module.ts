import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesOrderComponent } from './sales-order.component';
import { AddSoComponent } from './add-so/add-so.component';
import { SolistComponent } from './solist/solist.component';


const routes: Routes = [
  {
      path: '',
      component: SalesOrderComponent,
      data: {
          title: 'Sales Orders',
          breadcrumb: [
              { label: 'Sales Orders', url: '' },
          ]
      },
      children: [
          {
              path: '',
              component: SolistComponent,
              data: {
                  title: 'Sales Orders',
                  breadcrumb: [
                      { label: 'Sales Orders', url: '' },
                  ]
              }
          },
          {
              path: 'solist',
              component: SolistComponent,
              data: {
                  title: 'Sales Orders',
                  breadcrumb: [
                      { label: 'Sales Orders', url: '' },
                  ]
              }
          },
          {
              path: 'addso',
              component: AddSoComponent,
              data: {
                  title: 'Create Sales Orders',
                  breadcrumb: [
                      { label: 'Sales Orders', url: '/salesorders' },
                      { label: 'Create Sales Order', url: '' }
                  ]
              }
          },
          {
              path: 'editso/:id',
              component: AddSoComponent,
              data: {
                  title: 'Edit Sales Order',
                  breadcrumb: [
                      { label: 'Sales Orders', url: '/salesorders' },
                      { label: 'Edit Sales Order', url: '' }
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
export class SalesOrderRoutingModule { }
