import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PoListComponent } from 'src/app/transactions/purchase-order/po-list/po-list.component';
import { AddPoComponent } from './add-po/add-po.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
    {
        path: '',
        component: PurchaseOrderComponent,
        data: {
            title: 'Purchase Order',
            breadcrumb: [
                // { label: 'Transactions', url: '' },
                { label: 'Purchase Order', url: '' },
                // { label: 'Purchase Order', url: '' }
            ]
        },
        children: [
            {
                path: '',
                component: PoListComponent,
                data: {
                    title: 'Purchase Order',
                    path:'purchaseorder',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Purchase Order', url: '' },
                        // { label: 'PO List', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'polist',
                component: PoListComponent,
                data: {
                    title: 'Purchase Order',
                    path:'purchaseorder',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Purchase Order', url: '' },
                        // { label: 'PO List', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'addpo',
                component: AddPoComponent,
                data: {
                    title: 'Create Purchase Order',
                    path:'purchaseorder',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Purchase Order', url: '/purchaseorder' },
                        { label: 'Create Purchase Order', url: '' }
                    ]
                }
            },
            {
                path: 'editpo/:id',
                component: AddPoComponent,
                data: {
                    title: 'Edit Purchase Order',
                    path:'purchaseorder',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Purchase Order', url: '/purchaseorder' },
                        { label: 'Edit Purchase Order', url: '' }
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
export class PurchaseOrderRoutingModule {}
