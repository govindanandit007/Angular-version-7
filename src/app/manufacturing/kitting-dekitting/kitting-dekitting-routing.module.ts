import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CreateWoComponent } from './create-wo/create-wo.component';
import { KittingDekittingComponent } from './kitting-dekitting.component';
import { WoListComponent } from './wo-list/wo-list.component';
import { WorkOrderIssueComponent } from './work-order-issue/work-order-issue.component';


const routes: Routes = [
  {
    path: '',
    component: KittingDekittingComponent,
    data: {
        title: 'Work Order',
        breadcrumb: [
            { label: 'Work Order', url: '' }
        ]
    },
    children: [
        {
            path: '',
            component: WoListComponent,
            data: {
                title: 'Work Order',
                breadcrumb: [
                    { label: 'Work Orders', url: '' }
                ]
            }
        },
        {
            path: 'wolist',
            component: WoListComponent,
            data: {
                title: 'Work Orders List',
                path: 'wolist',
                breadcrumb: [
                  { label: 'Work Orders', url: '' }
                ]
            }
        },        
        
        {
            path: 'workorderissue',
            component: WorkOrderIssueComponent,
            data: {
                title: 'Work Order Issue',
                breadcrumb: [
                    { label: 'Work Order', url: '/wolist' },
                    { label: 'Work Order Issue', url: '' }
                ]
            }
        },
        {
            path: 'createwo',
            component: CreateWoComponent,
            data: {
                title: 'Create Work Order',
                breadcrumb: [  
                    { label: 'Kitting', url: '/kitting' },                
                    { label: 'Create Work Order', url: '' }
                ]
            }
        },
        {
            path: 'createdwo',
            component: CreateWoComponent,
            data: {
                title: 'Create Work Order',
                breadcrumb: [  
                    { label: 'De-kitting', url: '/dekitting' },                
                    { label: 'Create Work Order', url: '' }
                ]
            }
        },
        {
            path: 'createwo/:id',
            component: CreateWoComponent,
            data: {
                title: 'Edit Work Order',
                breadcrumb: [
                    { label: 'Kitting', url: '/kitting' },
                    { label: 'Edit Work Order', url: '' }
                ]
            }
        },
        {
            path: 'createdwo/:id',
            component: CreateWoComponent,
            data: {
                title: 'Edit Work Order',
                breadcrumb: [
                    { label: 'De-kitting', url: '/dekitting' },
                    { label: 'Edit Work Order', url: '' }
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

export class KittingDekittingRoutingModule {
     
 }
