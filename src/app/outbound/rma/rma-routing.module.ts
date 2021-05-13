import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RmaComponent } from './rma.component';
import { AddRmaComponent } from './add-rma/add-rma.component';
import { RmaListComponent } from './rma-list/rma-list.component'


const routes: Routes = [
  {
    path: '',
    component: RmaComponent,
    data: {
        title: 'RMA',
        breadcrumb: [
            { label: 'RMA', url: '' },
        ]
    },
    children: [
        {
            path: '',
            component: RmaListComponent,
            data: {
                title: 'RMA',
                breadcrumb: [
                    { label: 'RMA', url: '' },
                ]
            }
        },
        {
            path: 'rmalist',
            component: RmaListComponent,
            data: {
                title: 'RMA',
                breadcrumb: [
                    { label: 'RMA', url: '' },
                ]
            }
        },
        {
            path: 'addrma/:id',
            component: AddRmaComponent,
            data: {
                title: 'Create RMA',
                breadcrumb: [
                    { label: 'RMA', url: '/rma' },
                    { label: 'Create RMA', url: '' }
                ]
            }
        }
        // {
        //     path: 'editso/:id',
        //     component: AddSoComponent,
        //     data: {
        //         title: 'Edit Sales Order',
        //         breadcrumb: [
        //             { label: 'Sales Orders', url: '/salesorders' },
        //             { label: 'Edit Sales Order', url: '' }
        //         ]
        //     }
        // }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmaRoutingModule { }
