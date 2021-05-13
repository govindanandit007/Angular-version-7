import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchComponent } from './batch.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
  {
    path: '',
    component: BatchComponent,
    data: {
        title: 'Batch',
        breadcrumb: [
            // { label: 'Transactions', url: '' },
            { label: 'Batch', url: '' },
        ]
    },
    children: [
        {
            path: '',
            component: BatchListComponent,
            data: {
                title: 'Batch',
                path:'batch',
                breadcrumb: [
                    // { label: 'Transactions', url: '' },
                    { label: 'Batch', url: '' },
                ]
            },
            canActivate: [UserGuard]
        },
        {
            path: 'batchList',
            component: BatchListComponent,
            data: {
                title: 'Batch',
                path:'batch',
                breadcrumb: [
                    // { label: 'Transactions', url: '' },
                    { label: 'Batch', url: '' },
                ]
            },
            canActivate: [UserGuard]
        },
        // {
        //     path: 'addBatch',
        //     component: AddReceiptComponent,
        //     data: {
        //         title: 'Batch',
        //         breadcrumb: [
        //             { label: 'Batch', url: '/batch' },
        //             { label: 'Create Batch', url: '' }
        //         ]
        //     }
        // },
        // {
        //     path: 'editBatch/:id',
        //     component: AddReceiptComponent,
        //     data: {
        //         title: 'Batch',
        //         breadcrumb: [
        //             { label: 'Batch', url: '/batch' },
        //             { label: 'Edit Batch', url: '' }
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
export class BatchRoutingModule { }
