import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PutawayPolicyComponent } from './putaway-policy.component';
import { PutawayPolicyRoutingComponent } from './putaway-policy-routing/putaway-policy-routing.component';
import { PutawayBusinessRulesComponent } from './putaway-business-rules/putaway-business-rules.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';


const routes: Routes = [
    {
        path: '',
        component: PutawayPolicyComponent,
        data: {
            title: 'Policy',
            breadcrumb: [{ label: 'Policy', url: '' }]
        },
        children: [
            {
                path: '',
                component: PutawayPolicyRoutingComponent,
                data: {
                    title: 'Policy',
                    path:'policies/policyrouting',
                    breadcrumb: [{ label: 'Policy Routing', url: '' }]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'policyrouting',
                component: PutawayPolicyRoutingComponent,
                data: {
                    title: 'Policy',
                    path:'policies/policyrouting',
                    breadcrumb: [{ label: 'Policy Routing', url: '' }]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'policy',
                component: PutawayBusinessRulesComponent,
                data: {
                    title: 'Policy',
                    path:'policies/policy',
                    breadcrumb: [{ label: 'Policy', url: '' }]
                },
                canActivate: [UserGuard]
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PutawayPolicyRoutingModule { }
