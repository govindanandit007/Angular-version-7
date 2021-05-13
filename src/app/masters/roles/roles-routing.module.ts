import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RolesComponent } from './roles.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    data: {
      title: 'Roles',
      breadcrumb: [
        // { label: 'Master Setups', url: '' },
        { label: 'Roles', url: '' }
      ]
    },
    children: [
      {
        path: '',
        component: RoleListComponent,
        data: {
          title: 'Roles',
          path:'roles',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Roles', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'rolelist',
        component: RoleListComponent,
        data: {
          title: 'Roles',
          path:'roles',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Roles', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'addrole',
        component: AddRoleComponent,
        data: {
          title: 'Add Role',
          path:'roles',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Roles', url: '/roles/rolelist' },
            { label: 'Add Role', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'editrole/:id',
        component: AddRoleComponent,
        data: {
          title: 'Edit Role',
          path:'roles',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Roles', url: '/roles/rolelist' },
            { label: 'Edit Role', url: '' }
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
export class RolesRoutingModule { }
