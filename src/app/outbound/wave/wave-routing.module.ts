import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { WaveComponent } from './wave.component';
import { WaveListComponent } from './wave-list/wave-list.component';
import { AddWaveCriteriaComponent } from './add-wave-criteria/add-wave-criteria.component';
import { EditWaveComponent } from './edit-wave/edit-wave.component';
import { AllocationsComponent } from './allocations/allocations.component';


const routes: Routes = [
  {
    path: '',
    component: WaveComponent,
    data: {
      title: 'Wave',
      breadcrumb: [
        { label: 'Wave', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: WaveListComponent,
        data: {
          title: 'Wave',
          path: 'wave',
          breadcrumb: [
            { label: 'Wave', url: '' },
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'wavelist',
        component: WaveListComponent,
        data: {
          title: 'Wave',
          path: 'wave',
          breadcrumb: [
            { label: 'Wave', url: '' },
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'addwavecriteria',
        component: AddWaveCriteriaComponent,
        data: {
          title: 'Add Wave Criteria',
          path: 'wavecriteria',
          breadcrumb: [
            { label: 'Wave', url: '/wave' },
            { label: 'Wave Management', url: '' }
          ]
        }
      },
      {
        path: 'editwave/:id',
        component: EditWaveComponent,
        data: {
          title: 'Edit Wave',
          path: 'wave',
          breadcrumb: [
            { label: 'Wave', url: '/wave' },
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
            { label: 'Wave', url: '/wave' },
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
export class WaveRoutingModule { }
