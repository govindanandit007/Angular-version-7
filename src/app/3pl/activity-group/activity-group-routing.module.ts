import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityGroupListComponent } from './activity-group-list/activity-group-list.component';
import { ActivityGroupComponent } from './activity-group.component';
import { AddActivityGroupComponent } from './add-activity-group/add-activity-group.component';


const routes: Routes = [
  {
    path: '',
    component: ActivityGroupComponent ,
    data: {
        title: 'Activity Group',
        breadcrumb: [
            { label: 'Activity Group', url: '' }
        ]
    },
    children: [
        {
            path: '',
            component: ActivityGroupListComponent,
            data: {
                title: 'Activity Group',
                breadcrumb: [
                    { label: 'Activity Group', url: '' }
                ]
            }
        },
        {
            path: 'activitygrouplist',
            component: ActivityGroupListComponent,
            data: {
                title: 'Activity Group',
                breadcrumb: [
                  { label: 'Activity Group', url: '' }
                ]
            }
        },
        {
            path: 'addactivitygroup',
            component: AddActivityGroupComponent,
            data: {
                title: 'Create Activity Group',
                breadcrumb: [
                    { label: 'Activity Group', url: '/activitygroup' },
                    { label: 'Create Activity Group', url: '' }
                ]
            }
        },
        {
            path: 'editactivitygroup/:id',
            component: AddActivityGroupComponent,
            data: {
                title: 'Edit Activity Group',
                breadcrumb: [
                  { label: 'Activity Group', url: '/activitygroup' },
                  { label: 'Edit Activity Group', url: '' }
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
export class ActivityGroupRoutingModule { }
