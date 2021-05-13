import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UomComponent } from './uom.component';
import { UnitOfMeasureComponent } from './unit-of-measure/unit-of-measure.component';
import { UomConversionComponent } from './uom-conversion/uom-conversion.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';


const routes: Routes = [
  {
    path: '',
    component: UomComponent,
    data: {
      title: 'Unit  of measure',
      breadcrumb: [
        // { label: 'Master Setups', url: '' },
        // { label: 'UOM', url: '' },
        { label: 'Unit of Measure', url: '' }
      ]
    },
    children: [
      {
        path: '',
        component: UnitOfMeasureComponent,
        data: {
          title: 'Unit  of measure',
          path: 'uom',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            // { label: 'UOM', url: '' },
            { label: 'Unit of Measure', url: '' }
          ]
        },
        canActivate: [UserGuard]
      },
      {
        path: 'uom-conversion/:id',
        component: UomConversionComponent,
        data: {
          title: 'UOM Conversion',
          path: 'uom',
          breadcrumb: [
            // { label: 'Master Setups', url: '' },
            { label: 'UOM', url: '/uom' },
            { label: 'Unit of Conversion', url: '' }
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
export class UomRoutingModule { }
