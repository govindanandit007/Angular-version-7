import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialStatusComponent } from './material-status.component';
import { MaterialStatusListComponent } from 'src/app/transactions/material-status/material-status-list/material-status-list.component';
import { CreateMaterialStatusComponent } from 'src/app/transactions/material-status/create-material-status/create-material-status.component';

const routes: Routes = [
       {
            path: '',
            component: MaterialStatusComponent,
            data: {
                title: 'Material Status',
                breadcrumb: [
                    { label: 'Material Status', url: '' }
                ]

        },
        children: [
            {
                path: '',
                component: MaterialStatusListComponent,
                data: {
                  title: 'Material Status',
                  path:'materialstatus',
                  breadcrumb: [
                      { label: 'Material Status', url: '' }
                  ]
                },
                // canActivate: [UserGuard]
            },
            
            {
                path: 'addmaterialstatus',
                component: CreateMaterialStatusComponent,
                data: {
                    title: 'Create Material Status',
                    path:'materialstatus',
                    breadcrumb: [
                        // { label: 'Transactions', url: '' },
                        { label: 'Material Status', url: '/materialstatus' },
                        { label: 'Create Material Status', url: '' }
                    ]
                }
            },
          ]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialStatusRoutingModule { }
