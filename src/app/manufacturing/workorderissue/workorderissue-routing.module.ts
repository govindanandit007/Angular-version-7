import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from 'src/app/_auth/user.gaurd';
 
 
import { CrateWoIssueComponent } from './crate-wo-issue/crate-wo-issue.component';
import { WoissueListComponent } from './woissue-list/woissue-list.component';
import { WorkorderissueComponent } from './workorderissue.component';
 
 
const routes: Routes = [
    {
      path: '',
      component: WorkorderissueComponent,
      data: {
        title: 'workorderissue',
        breadcrumb: [
          { label: 'Work Order', url: '' },
        ]
      },
      children: [
        {
          path: '',
          component: CrateWoIssueComponent,
          data: {
            title: 'woissue',
            path: 'workorderissue',
            breadcrumb: [
              { label: 'Work Order Issue', url: '' },
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
export class WorkorderissueRoutingModule { }