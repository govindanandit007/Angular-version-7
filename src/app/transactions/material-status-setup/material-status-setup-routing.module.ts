import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialStatusSetupComponent } from './material-status-setup.component';
import { MaterialStatusSetupAddComponent } from 'src/app/transactions/material-status-setup/material-status-setup-add/material-status-setup-add.component';
import { MaterialStatusSetupListComponent } from 'src/app/transactions/material-status-setup/material-status-setup-list/material-status-setup-list.component';


const routes: Routes = [
       {
            path: '',
            component: MaterialStatusSetupComponent,
            data: {
                title: 'Material Status Setup',
                breadcrumb: [
                    { label: 'Material Status Setup', url: '' }
                ]

        },
        children: [
            {
                path: '',
                component: MaterialStatusSetupListComponent,
                data: {
                  title: 'Material Status',
                  path:'materialstatussetup',
                  breadcrumb: [
                      { label: 'Material Status Setup', url: '' }
                  ]
                },
                // canActivate: [UserGuard]
            },
            {
                path: 'materialstatussetuplist',
                component: MaterialStatusSetupListComponent,
                data: {
                    title: 'Material Status Setup',
                    path:'materialstatussetup',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Material Status Setup', url: '' },
                        // { label: 'PO List', url: '' }
                    ]
                },
                // canActivate: [UserGuard]
            },
            {
                path: 'addmaterialstatussetup',
                component: MaterialStatusSetupAddComponent,
                data: {
                    title: 'Create Material Status Setup',
                    path:'materialstatussetup',
                    breadcrumb: [
                        { label: 'Material Status Setup', url: '/materialstatussetup' },
                        { label: 'Create Material Status Setup', url: '' }
                    ]
                }
            },
            {
                path: 'editmaterialstatussetup/:id',
                component: MaterialStatusSetupAddComponent,
                data: {
                    title: 'Edit Material Status Setup',
                    path:'materialstatussetup',
                    breadcrumb: [
                        { label: 'Material Status Setup', url: '/materialstatussetup' },
                        { label: 'Edit Material Status Setup', url: '' }
                    ]
                },
                // canActivate: [UserGuard]
            }
          ]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialStatusSetupRoutingModule { }
