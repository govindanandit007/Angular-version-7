import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleComponent } from './rule.component';
import { RuleListComponent } from './rule-list/rule-list.component';
import { AddRuleComponent } from './add-rule/add-rule.component';
// import { FilterComponent } from './filter/filter.component';

const routes: Routes = [
    {
        path: '',
        component: RuleComponent,
        data: {
            title: 'rule',
            breadcrumb: [{ label: 'Rule', url: '' }]
        },
        children: [
            {
                path: '',
                component: RuleListComponent,
                data: {
                    title: 'Rule',
                    path: 'rule',
                    breadcrumb: [{ label: 'Rule', url: '' }]
                }
                // canActivate: [UserGuard]
            },
            {
                path: 'rulelist',
                component: RuleListComponent,
                data: {
                    title: 'Rule',
                    path: 'rule',
                    breadcrumb: [{ label: 'Rule', url: '' }]
                }
                // canActivate: [UserGuard]
            },
            {
                path: 'createrule',
                component: AddRuleComponent,
                data: {
                    title: 'Add Rule',
                    path: 'createrule',
                    breadcrumb: [
                        { label: 'Rule', url: '/rule' },
                        { label: 'Add Rule', url: '' }
                    ]
                }
            },
            {
                path: 'editrule/:id',
                component: AddRuleComponent,
                data: {
                    title: 'Edit Rule',
                    path: 'rule',
                    breadcrumb: [
                        { label: 'Rule', url: '/rule' },
                        { label: 'Edit Rule', url: '' }
                    ]
                }
                // canActivate: [UserGuard]
            },
            // {
            //   path: 'filter',
            //   component: FilterComponent,
            //   data: {
            //     title: 'Filter',
            //     path: 'rule',
            //     breadcrumb: [
            //       { label: 'Rule', url: '/rule' },
            //       // { label: 'Edit Wave', url::'' },
            //       { label: 'Filter', url: '' }
            //     ]
            //   },
            // //   canActivate: [UserGuard]
            // }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleRoutingModule { }
