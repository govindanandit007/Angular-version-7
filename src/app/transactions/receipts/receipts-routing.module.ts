import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptsComponent } from './receipts.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';

const routes: Routes = [
    {
        path: '',
        component: ReceiptsComponent,
        data: {
            title: 'Receipts',
            breadcrumb: [
                { label: 'Transactions', url: '' },
                { label: 'Receipts', url: '' },
                // { label: 'Receipts', url: '' }
            ]
        },
        children: [
            {
                path: '',
                component: ReceiptListComponent,
                data: {
                    title: 'Receipts',
                    breadcrumb: [
                        { label: 'Transactions', url: '' },
                        { label: 'Receipts', url: '/receipts' },
                        // { label: 'Receipt List', url: '' }
                    ]
                }
            },
            {
                path: 'receiptlist',
                component: ReceiptListComponent,
                data: {
                    title: 'Receipts',
                    breadcrumb: [
                        { label: 'Transactions', url: '' },
                        { label: 'Receipts', url: '/receiptlist' },
                        // { label: 'Receipt List', url: '' }
                    ]
                }
            },
            {
                path: 'addReceipt',
                component: AddReceiptComponent, 
                data: {
                    title: 'Receipts',
                    breadcrumb: [
                        { label: 'Transactions', url: '' },
                        { label: 'Receipts', url: '/receipts' },
                        { label: 'Create Receipt', url: '/addReceipt' }
                    ]
                }
            },
            {
                path: 'editReceipt/:id',
                component: AddReceiptComponent,
                data: {
                    title: 'Receipts',
                    breadcrumb: [
                        { label: 'Transactions', url: '' },
                        { label: 'Receipts', url: '/receipts' },
                        { label: 'Edit Receipt', url: '/editReceipt/:id' }
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
export class ReceiptsRoutingModule {}
