import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManualPrintComponent } from './manual-print.component';
import { ManualPrintListComponent } from './manual-print-list/manual-print-list.component';

const routes: Routes = [
    {
        path: '',
        component: ManualPrintComponent,
        data: {
            title: 'manualprint',
            breadcrumb: [{ label: 'Manual Print', url: '' }]
        },
        children: [
            {
                path: '',
                component: ManualPrintListComponent,
                data: {
                    title: 'Manual Print',
                    path: 'manualprint',
                    breadcrumb: [{ label: 'Manual Print', url: '' }]
                }
                // canActivate: [UserGuard]
            },
            {
                path: 'manualprintlist',
                component: ManualPrintListComponent,
                data: {
                    title: 'Manual Print',
                    path: 'manualprint',
                    breadcrumb: [{ label: 'Manual Print', url: '' }]
                }
                // canActivate: [UserGuard]
            }
            // {
            //   path: 'createprintermanager',
            //   component: CreatePrinterManagerComponent,
            //   data: {
            //     title: 'Create Manual Print',
            //     path: 'createprintermanager',
            //     breadcrumb: [
            //       { label: 'Manual Print', url: '/printermanager' },
            //       { label: 'Add Manual Print', url: '' }
            //     ]
            //   }
            // },
            // {
            //   path: 'editprintermanager/:id',
            //   component: CreatePrinterManagerComponent,
            //   data: {
            //     title: 'Edit Manual Print',
            //     path: 'printermanager',
            //     breadcrumb: [
            //       { label: 'Manual Print', url: '/printermanager' },
            //       { label: 'Edit Print Manager', url: '' }
            //     ]
            //   }
            //   // canActivate: [UserGuard]
            // }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualPrintRoutingModule { }
