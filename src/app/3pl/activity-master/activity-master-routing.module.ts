import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityMasterListComponent } from './activity-master-list/activity-master-list.component';
import { ActivityMasterComponent } from './activity-master.component';
import { AddActivityMasterComponent } from './add-activity-master/add-activity-master.component';


const routes: Routes = [
  {
    path: '',
    component: ActivityMasterComponent ,
    data: {
        title: 'Activity Master',
        breadcrumb: [
            { label: 'Activity Master', url: '' }
        ]
    },
    children: [
        {
            path: '',
            component: ActivityMasterListComponent,
            data: {
                title: 'Activity Master',
                breadcrumb: [
                    { label: 'Activity Master', url: '' }
                ]
            }
        },
        {
            path: 'activitymasterlist',
            component: ActivityMasterListComponent,
            data: {
                title: 'Activity Master',
                breadcrumb: [
                  { label: 'Activity Master', url: '' }
                ]
            }
        },
        {
            path: 'addactivity',
            component: AddActivityMasterComponent,
            data: {
                title: 'Create Activity Master',
                breadcrumb: [
                    { label: 'Activity Master', url: '/activitymaster' },
                    { label: 'Create Activity Master', url: '' }
                ]
            }
        },
        {
            path: 'editactivity/:id',
            component: AddActivityMasterComponent,
            data: {
                title: 'Edit Activity Master',
                breadcrumb: [
                  { label: 'Activity Master', url: '/activitymaster' },
                  { label: 'Edit Activity Master', url: '' }
                ]
            }
        }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityMasterRoutingModule { }
