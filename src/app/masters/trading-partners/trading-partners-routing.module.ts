import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradingPartnersComponent } from './trading-partners.component';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import { AddTradingPartnerComponent } from './add-trading-partner/add-trading-partner.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
  {
    path: '',
    component: TradingPartnersComponent,
    // canActivate: [AuthGuardService],
    data: {
      title: 'Trading Partners',
      breadcrumb: [
        // { label: 'Master Setups', url: '' },
        { label: 'Trading Partners', url: '' }
      ]
    },
    children: [
      {
        path: '',
        component: TradingPartnerComponent,
        data: {
          title: 'Trading Partners',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'tradingpartners/:tpType',
        component: TradingPartnerComponent,
        data: {
          title: 'Trading Partners',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'addTradingPartner/:tpType',
        component: AddTradingPartnerComponent,
        data: {
          title: 'Add Trading Partner',
          path: 'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '/tradingpartners/tradingpartner' },
            { label: 'Add Trading Partner', url: '' }
          ]
        }
      },
      {
        path: 'editTradingPartner/:tpType/:tpId',
        component: AddTradingPartnerComponent,
        data: {
          title: 'Edit Trading Partner',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '/tradingpartners/tradingpartner' },
            { label: 'Edit Trading Partner', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'editTradingPartnerSite/:tpType/:tpSiteId',
        component: AddTradingPartnerComponent,
        data: {
          title: 'Edit Trading Partner Site',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '/tradingpartners/tradingpartner' },
            { label: 'Edit Trading Partner Site', url: '' }
          ]
        }
      },
      {
        path: 'addTradingPartnerSite/:tpType/:tpIdForAddSite',
        component: AddTradingPartnerComponent,
        data: {
          title: 'Add Trading Partner Site',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '/tradingpartners/tradingpartner' },
            { label: 'Add Trading Partner Site', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: ':tpType',
        component: TradingPartnerComponent,
        data: {
          title: 'Trading Partners',
          path:'tradingpartners',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'Trading Partners', url: '' }
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
export class TradingPartnersRoutingModule { }
