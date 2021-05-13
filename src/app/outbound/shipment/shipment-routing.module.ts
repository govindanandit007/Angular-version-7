import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentComponent } from './shipment.component';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component';
import { EditShipmentComponent } from './edit-shipment/edit-shipment.component';


const routes: Routes = [
  {
    path: '',
    component: ShipmentComponent,
    data: {
      title: 'Shipment',
      breadcrumb: [
        { label: 'Shipment', url: '' },
      ]
    },
    children: [
      {
        path: '',
        component: ShipmentListComponent,
        data: {
          title: 'Shipment',
          path: 'shipment',
          breadcrumb: [
            { label: 'Shipment', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'shipmentlist',
        component: ShipmentListComponent,
        data: {
          title: 'Shipment',
          path: 'shipment',
          breadcrumb: [
            { label: 'Shipment', url: '' },
          ]
        },
        // canActivate: [UserGuard]
      },
      {
        path: 'createshipment',
        component: CreateShipmentComponent,
        data: {
          title: 'Create Shipment',
          path: 'createshipment',
          breadcrumb: [
            { label: 'Shipment', url: '/shipment' },
            { label: 'Eligible Shipment Lines', url: '' }
          ]
        }
      },
      {
        path: 'editshipment/:id',
        component: EditShipmentComponent,
        data: {
          title: 'Edit Shipment',
          path: 'shipment',
          breadcrumb: [
            { label: 'Shipment', url: '/shipment' },
            { label: 'Shipment Lines', url: '' }
          ]
        }
        // canActivate: [UserGuard]
      }
      // {
      //   path: 'allocations',
      //   component: AllocationsComponent,
      //   data: {
      //     title: 'Edit Wave',
      //     path: 'wave',
      //     breadcrumb: [
      //       { label: 'Wave', url: '/wave' },
      //       // { label: 'Edit Wave', url::'' },
      //       { label: 'Allocations', url: '' }
      //     ]
      //   },
      //   canActivate: [UserGuard]
      // }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
