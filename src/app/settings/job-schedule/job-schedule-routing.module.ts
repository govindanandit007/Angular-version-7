import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobScheduleComponent } from './job-schedule.component';
import { JobscheduleduleListComponent } from './jobscheduledule-list/jobscheduledule-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { AddJobscheduleComponent } from './add-jobschedule/add-jobschedule.component';
import { JobscheduleduleHistoryComponent } from './jobscheduledule-history/jobscheduledule-history.component';



const routes: Routes = [
  {
      path: '',
      component: JobScheduleComponent,
      data: {
          title: 'Job Schedule',
          breadcrumb: [
              { label: 'Job Schedule', url: '' },
          ]
      },
      children: [
          {
              path: '',
              component: JobscheduleduleListComponent,
              data: {
                  title: 'Job Schedule',
                  path:'jobschedule',
                  breadcrumb: [
                      { label: 'Job Schedule', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'jobschedulelist',
              component: JobscheduleduleListComponent,
              data: {
                title: 'Job Schedule',
                path:'jobschedule',
                breadcrumb: [
                    { label: 'Job Schedule', url: '' },
                ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'addjobschedule',
              component: AddJobscheduleComponent,
              data: {
                  title: 'Add Job Schedule',
                  path:'jobschedule',
                  breadcrumb: [
                      { label: 'Job Schedule', url: '/jobschedule' },
                      { label: 'Add Job Schedule', url: '' }
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'editjobschedule/:id',
              component: AddJobscheduleComponent,
              data: {
                title: 'Edit Job Schedule',
                path:'jobschedule',
                breadcrumb: [
                    { label: 'Job Schedule', url: '/jobschedule' },
                    { label: 'Add Job Schedule', url: '' }
                ]
              },
              canActivate: [UserGuard]
          },
          {
            path: 'editjobhistory/:id',
            component:JobscheduleduleHistoryComponent,
            data: {
                title: 'Job History',
                path:'jobschedule',
                breadcrumb: [
                    { label: 'Job Schedule', url: '/jobschedule' },
                    { label: 'Job History', url: '' }
                ]
            },
            canActivate: [UserGuard]
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobScheduleRoutingModule { }
