import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintHistoryComponent } from './print-history.component';
import { PrintHistoryListComponent } from './print-history-list/print-history-list.component';


const routes: Routes = [
  {
    path: '',
    component: PrintHistoryComponent,
    data: {
      title: 'printhistory',
      breadcrumb: [
        { label: 'Print History', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: PrintHistoryListComponent,
        data: {
          title: 'Print History',
          path: 'printhistory',
          breadcrumb: [
            { label: 'Print History', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'printhistorylist',
        component: PrintHistoryListComponent,
        data: {
          title: 'Print History',
          path: 'printhistory',
          breadcrumb: [
            { label: 'Print History', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintHistoryRoutingModule { }
