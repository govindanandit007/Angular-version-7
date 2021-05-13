import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    // canActivate: [AuthGuardService],
    data: {
      title: 'Category',
      path: 'category',
      breadcrumb: [
        // { label: 'Users', url: '' },
        // { label: 'Master Setups', url: '' },
        { label: 'Category', url: '' }
      ]
    },
    canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
