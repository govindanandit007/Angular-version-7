import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { AllocationsComponent } from './allocations/allocations.component';
import { CreateWaveplanComponent } from './create-waveplan/create-waveplan.component';
import { EditWaveplanComponent } from './edit-waveplan/edit-waveplan.component';
import { WaveplanListComponent } from './waveplan-list/waveplan-list.component';
import { WaveplanComponent } from './waveplan.component';
 

const routes: Routes = [
  {
    path: '',
    component: WaveplanComponent,
    data: {
      title: 'wavemfg',
      breadcrumb: [
        { label: 'Wave', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: WaveplanListComponent,
        data: {
          title: 'Wave',
          path: 'wavemfg',
          breadcrumb: [
            { label: 'Wave', url: '' },
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'wavelist',
        component: WaveplanListComponent,
        data: {
          title: 'Wave',
          path: 'wavemfg',
          breadcrumb: [
            { label: 'Wave', url: '' },
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'addwavecriteria',
        component: CreateWaveplanComponent,
        data: {
          title: 'Add Wave Criteria',
          path: 'wavecriteria',
          breadcrumb: [
            { label: 'Wave', url: '/wavemfg' },
            { label: 'Wave Management', url: '' }
          ]
        }
      },
      {
        path: 'editwave/:id',
        component: EditWaveplanComponent,
        data: {
          title: 'Edit Wave',
          path: 'wave',
          breadcrumb: [
            { label: 'Wave', url: '/wavemfg' },
            { label: 'Edit/Release Wave', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'allocations/:waveId/:waveIuId',
        component: AllocationsComponent,
        data: {
          title: 'Allocations',
          path: 'wave',
          breadcrumb: [
            { label: 'Wave', url: '/wavemfg' },
            // { label: 'Edit Wave', url::'' },
            { label: 'Allocations', url: '' }
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
export class WaveplanRoutingModule { }
