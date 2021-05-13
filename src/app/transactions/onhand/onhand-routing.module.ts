import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnhandComponent } from './onhand.component';
import { OnhandDetailComponent } from './onhand-detail/onhand-detail.component';
import { OnhandListComponent } from './onhand-list/onhand-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
       {
            path: '',
            component: OnhandComponent,
            data: {
                title: 'Onhand',
                breadcrumb: [
                    // { label: 'Transactions', url: '' },
                    { label: 'Onhand', url: '' }
                ]

        },
        children: [
            {
                path: '',
                component: OnhandListComponent,
                data: {
                  title: 'Onhand Detail',
                  path:'onhand',
                  breadcrumb: [
                      // { label: 'Transactions', url: '' },
                      { label: 'Onhand', url: '' }
                  ]
                },
                canActivate: [UserGuard]
            },
            {
              path: 'onhandDetail',
              component: OnhandDetailComponent,
              data: {
                title: 'Onhand Detail',
                path:'onhand',
                breadcrumb: [
                    // { label: 'Transactions', url: '' },
                    { label: 'Onhand', url: '/onhand' },
                    { label: 'Detail', url: '' }
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
export class OnhandRoutingModule {}
