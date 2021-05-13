import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CycleCountComponent } from './cycle-count.component';
import { CycleCountlistComponent } from './cycle-countlist/cycle-countlist.component';
import { AddCycleCountComponent } from './add-cycle-count/add-cycle-count.component';
import { CycleCountReviewComponent } from './cycle-count-review/cycle-count-review.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';


const routes: Routes = [
  {
      path: '',
      component: CycleCountComponent,
      data: {
          title: 'Cycle Count',
          breadcrumb: [
              { label: 'Cycle Count', url: '' },
          ]
      },
      children: [
          {
              path: '',
              component: CycleCountlistComponent,
              data: {
                  path: 'cyclecount/cyclecountlist',
                  title: 'Cycle Count',
                  breadcrumb: [
                      { label: 'Cycle Count', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'cyclecountlist',
              component: CycleCountlistComponent,
              data: {
                  path: 'cyclecount/cyclecountlist',
                  title: 'Cycle Count',
                  breadcrumb: [
                      { label: 'Cycle Count', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'addcyclecount',
              component: AddCycleCountComponent,
              data: {
                  path: 'cyclecount/cyclecountlist',
                  title: 'Add Cycle Count',
                  breadcrumb: [
                      { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
                      { label: 'Create Cycle Count', url: '' }
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'editcc/:id',
              component: AddCycleCountComponent,
              data: {
                  path: 'cyclecount/cyclecountlist',
                  title: 'Edit Cycle Count',
                  breadcrumb: [
                      { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
                      { label: 'Edit Cycle Count', url: '' }
                  ]
              },
              canActivate: [UserGuard]
          },
          {
            path: 'cyclecountreview/:id/:name',
            component: CycleCountReviewComponent,
            data: {
                path: 'cyclecount/cyclecountlist',
                title: 'Cycle Count Review',
                breadcrumb: [
                    { label: 'Cycle Count', url: '/cyclecount/cyclecountlist' },
                    { label: 'Review', url: '' }
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
export class CycleCountRoutingModule { }
