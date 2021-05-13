import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { AddContractsComponent } from './add-contracts/add-contracts.component';
import { ContractsListComponent } from './contracts-list/contracts-list.component';
import { ContractsComponent } from './contracts.component';
import { ItemsComponent } from './items/items.component';

const routes: Routes = [
  {
    path: '',
    component: ContractsComponent ,
    data: {
        title: 'Contracts',
        breadcrumb: [
            { label: 'Contracts', url: '' }
        ]
    },
    children: [
        {
            path: '',
            component: ContractsListComponent,
            data: {
                title: 'Contracts',
                breadcrumb: [
                    { label: 'Contracts', url: '' }
                ]
            }
        },
        {
            path: 'contractlist',
            component: ContractsListComponent,
            data: {
                title: 'Contracts',
                breadcrumb: [
                  { label: 'Contracts', url: '' }
                ]
            }
        },
        {
            path: 'addcontract',
            component: AddContractsComponent,
            data: {
                title: 'Create Contract',
                breadcrumb: [
                    { label: 'Contracts', url: '/contracts' },
                    { label: 'Create Contract', url: '' }
                ]
            }
        },
        {
            path: 'editcontract/:id',
            component: AddContractsComponent,
            data: {
                title: 'Edit Contracts',
                breadcrumb: [
                  { label: 'Contracts', url: '/contracts' },
                  { label: 'Edit Contract', url: '' }
                ]
            }
        },
        {
            path: 'groupactivities/:id',
            component: ActivitiesComponent,
            data: {
                title: 'Activities',
                breadcrumb: [
                  { label: 'Contracts', url: '/contracts' },
                  { label: 'Add Contract', url: '/contracts/editcontract/:id' },
                  { label: 'Group Activities', url: '' }
                ]
            }
        },
        {
            path: 'transactionDetail/:id',
            component: ItemsComponent,
            data: {
                title: 'Transaction Details',
                breadcrumb: [
                  { label: 'Contracts', url: '/contracts' },
                  { label: 'Edit Contract', url: '/contracts/editcontract/:id' },
                  { label: '3PL Transaction Details', url: '' }
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
export class ContractsRoutingModule { }
