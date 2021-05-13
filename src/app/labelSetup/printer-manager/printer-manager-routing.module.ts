import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrinterManagerComponent } from './printer-manager.component';
import { PrinterManagerListComponent } from './printer-manager-list/printer-manager-list.component';
import { CreatePrinterManagerComponent } from './create-printer-manager/create-printer-manager.component';


const routes: Routes = [
  {
    path: '',
    component: PrinterManagerComponent,
    data: {
      title: 'printermanager',
      breadcrumb: [
        { label: 'Print Manager', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: PrinterManagerListComponent,
        data: {
          title: 'Printer Manager',
          path: 'printermanager',
          breadcrumb: [
            { label: 'Print Manager', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'printermanagerlist',
        component: PrinterManagerListComponent,
        data: {
          title: 'Printer Manager',
          path: 'printermanager',
          breadcrumb: [
            { label: 'Print Manager', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'createprintermanager',
        component: CreatePrinterManagerComponent,
        data: {
          title: 'Create Printer Manager',
          path: 'createprintermanager',
          breadcrumb: [
            { label: 'Print Manager', url: '/printermanager' },
            { label: 'Add Print Manager', url: '' }
          ]
        }
      },
      {
        path: 'editprintermanager/:id',
        component: CreatePrinterManagerComponent,
        data: {
          title: 'Edit Printer Manager',
          path: 'printermanager',
          breadcrumb: [
            { label: 'Print Manager', url: '/printermanager' },
            { label: 'Edit Print Manager', url: '' }
          ]
        }
        // canActivate: [UserGuard]
      }
      // {
      //   path: 'allocations',
      //   component: AllocationsComponent,
      //   data: {
      //     title: 'Edit Wave',
      //     path: 'wave',
      //     breadcrumb: [
      //       { label: 'Wave', url: '/wave' },
      //       // { label: 'Edit Wave', url::'' },
      //       { label: 'Allocations', url: '' }
      //     ]
      //   },
      //   canActivate: [UserGuard]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrinterManagerRoutingModule { }
