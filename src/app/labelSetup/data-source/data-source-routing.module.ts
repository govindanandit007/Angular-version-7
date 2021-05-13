import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataSourceComponent } from './data-source.component';
import { DataSourceListComponent } from './data-source-list/data-source-list.component';


const routes: Routes = [
  {
    path: '',
    component: DataSourceComponent,
    data: {
      title: 'datasource',
      breadcrumb: [
        { label: 'Data Source', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: DataSourceListComponent,
        data: {
          title: 'Data Source',
          path: 'datasource',
          breadcrumb: [
            { label: 'Data Source', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'datasourcelist',
        component: DataSourceListComponent,
        data: {
          title: 'Data Source',
          path: 'datasource',
          breadcrumb: [
            { label: 'Data Source', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      // {
      //   path: 'createprintermanager',
      //   component: CreatePrinterManagerComponent,
      //   data: {
      //     title: 'Create Data Source',
      //     path: 'createprintermanager',
      //     breadcrumb: [
      //       { label: 'Data Source', url: '/printermanager' },
      //       { label: 'Add Data Source', url: '' }
      //     ]
      //   }
      // },
      // {
      //   path: 'editprintermanager/:id',
      //   component: CreatePrinterManagerComponent,
      //   data: {
      //     title: 'Edit Data Source',
      //     path: 'printermanager',
      //     breadcrumb: [
      //       { label: 'Data Source', url: '/printermanager' },
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
export class DataSourceRoutingModule { }
