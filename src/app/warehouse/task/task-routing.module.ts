import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { TaskSummaryComponent } from './task-summary/task-summary.component';

const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    data: {
      title: 'Task',
      breadcrumb: [
        { label: 'Task', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: TaskSummaryComponent,
        data: {
          path: 'task/taskSummary',
          title: 'Task',
          breadcrumb: [
            { label: 'Task Summary', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'taskSummary',
        component: TaskSummaryComponent,
        data: {
          path: 'task/taskSummary',
          title: 'Task',
          breadcrumb: [
            { label: 'Task Summary', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'taskDetails',
        component: TaskListComponent,
        data: {
          path: 'task/taskDetails',
          title: 'Task',
          breadcrumb: [
            { label: 'Task Summary', url: '/task/taskSummary' },
            { label: 'Task Details', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      // {
      //   path: 'addcyclecount',
      //   component: AddCycleCountComponent,
      //   data: {
      //     path: 'cyclecount/cyclecountlist',
      //     title: 'Add Cycle Count',
      //     breadcrumb: [
      //       { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
      //       { label: 'Add Cycle Count', url: '' }
      //     ]
      //   },
      //   canActivate: [UserGuard]
      // },
      // {
      //   path: 'editcc/:id',
      //   component: AddCycleCountComponent,
      //   data: {
      //     path: 'cyclecount/cyclecountlist',
      //     title: 'Edit Cycle Count',
      //     breadcrumb: [
      //       { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
      //       { label: 'Edit Cycle Count', url: '' }
      //     ]
      //   },
      //   canActivate: [UserGuard]
      // },
      // {
      //   path: 'cyclecountreview/:id',
      //   component: CycleCountReviewComponent,
      //   data: {
      //     path: 'cyclecount/cyclecountlist',
      //     title: 'Cycle Count Review',
      //     breadcrumb: [
      //       { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
      //       { label: 'Review', url: '' }
      //     ]
      //   },
      //   canActivate: [UserGuard]
      // },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
