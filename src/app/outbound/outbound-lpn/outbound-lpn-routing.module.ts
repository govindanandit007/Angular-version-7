import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { OutboundLpnComponent } from './outbound-lpn.component';
import { OutboundLpnListComponent } from './outbound-lpn-list/outbound-lpn-list.component';


const routes: Routes = [
  {
      path: '',
      component: OutboundLpnComponent,
      data: {
          title: 'Outbound Lpn',
          breadcrumb: [
              { label: 'Outbound Lpn List', url: '' }
             
          ]
      },
      children: [
          {
              path: '',
              component: OutboundLpnListComponent,
              data: {
                  title: 'Outbound Lpn',
                  path:'outboundlpn',
                  breadcrumb: [
                      { label: 'Outbound Lpn List', url: '' },
                  ]
              },
              canActivate: [UserGuard]
          },
          {
              path: 'Outbound Lpn',
              component: OutboundLpnListComponent,
              data: {
                  path:'outboundlpn',
                  breadcrumb: [
                    { label: 'Outbound Lpn List', url: '' },
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
export class OutboundLpnRoutingModule { }
