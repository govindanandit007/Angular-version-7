import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemComponent } from './item/item.component';
import { ItemRevisionComponent } from './item-revision/item-revision.component';
import { ItemUomComponent } from './item-uom/item-uom.component';
import { ItemXRefComponent } from './item-x-ref/item-x-ref.component';
import { ItemAssignmentComponent } from './item-assignment/item-assignment.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';
const routes: Routes = [
    {
        path: '',
        component: ItemsComponent,
        data: {
            title: 'Items',
            breadcrumb: [
                { label: 'Master Setups', url: '' },
                { label: 'Items', url: '' },
                { label: 'Item', url: '' }
            ]
        },
        children: [
            {
                path: '',
                component: ItemComponent,
                data: {
                    title: 'Items',
                    path: 'items',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '' },
                        { label: 'Item', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'item',
                component: ItemComponent,
                data: {
                    title: 'Items',
                    path: 'items',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '' },
                        { label: 'Item', url: '' }
                    ]
                }
            },
            {
                path: 'itemRevision',
                component: ItemRevisionComponent,
                data: {
                    title: 'Items',
                    path: 'items/itemRevision',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '/items' },
                        { label: 'Item Revision', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'itemUOM',
                component: ItemUomComponent,
                data: {
                    title: 'Items',
                    path: 'items/itemUOM',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '/items' },
                        { label: 'Item UOM Conversion', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'itemCrossRef',
                component: ItemXRefComponent,
                data: {
                    title: 'Items',
                    path: 'items/itemCrossRef',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '/items' },
                        { label: 'Item Cross Reference', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
              {
                path: 'itemassignment',
                component: ItemAssignmentComponent,
                data: {
                    title: 'Items',
                    path: 'items/itemassignment',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        // { label: 'Items', url: '/items' },
                        { label: 'Item Assignment', url: '' }
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
export class ItemsRoutingModule { }
