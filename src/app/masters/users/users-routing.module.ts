import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersComponent } from './users.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [{
  path: '',
  component: UsersComponent,
  data: { title: 'Users',
    breadcrumb: [
      { label: 'Users', url: '' }
    ]
  },
  children: [
    {
      path: '',
      component: UserlistComponent,
      data: { title: 'Users',
        path: 'users/userlist',
        breadcrumb: [
          { label: 'Users', url: '' }
        ]
      },
      canActivate: [UserGuard]
    },
    {
      path: 'userlist',
      component: UserlistComponent,
      data: { title: 'Users',
        path: 'users/userlist',
        breadcrumb: [
          { label: 'Users', url: '' }
        ]
      },
      canActivate: [UserGuard]
    },
    {
      path: 'adduser',
      component: AddUserComponent,
      data: { title: 'Add User',
        path: 'users/userlist',
        breadcrumb: [
          { label: 'Users', url: '/users/userlist' },
          { label: 'Add User', url: '' }
        ]
      },
      canActivate: [UserGuard]
    },
    {
      path: 'edituser/:id',
      component: AddUserComponent,
      data: { title: 'Edit User',
        path: 'users/userlist',
        breadcrumb: [
          { label: 'Users', url: '/users/userlist' },
          { label: 'Edit User', url: '' }
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
export class UsersRoutingModule { }
