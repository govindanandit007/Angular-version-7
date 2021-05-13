import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LookupListComponent } from './lookup-list/lookup-list.component';
import { AddLookupComponent } from './add-lookup/add-lookup.component';
import { LookupsComponent } from './lookups.component';
import { UserGuard } from '../_auth/user.gaurd';


const routes: Routes = [
  {
    path: '',
    component: LookupsComponent,
    // canActivate: [AuthGuardService],
    data: {
      title: 'Lookups',
      breadcrumb: [
        { label: 'Lookups', url: '' }
      ]
    },
    children: [
      {
        path: '',
        component: LookupListComponent,
        data: {
          title: 'Lookups',
          path:'lookups',
          breadcrumb: [
            { label: 'Lookups', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'addLookup',
        component: AddLookupComponent,
        data: {
          title: 'Add Lookup',
          path:'lookups',
          breadcrumb: [
            { label: 'Lookups', url: '/lookups' },
            { label: 'Add Lookup', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'editLookup/:data',
        component: AddLookupComponent,
        data: {
          title: 'Edit Lookup',
          path:'lookups',
          breadcrumb: [
            { label: 'Lookups', url: '/lookups' },
            { label: 'Edit Lookup', url: '' }
          ]
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
export class LookupsRoutingModule { }
