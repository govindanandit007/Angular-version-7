import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsnComponent } from './asn.component';
import { AsnListComponent } from './asn-list/asn-list.component';
import { AddAsnComponent } from './add-asn/add-asn.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
  {
    path: '',
    component: AsnComponent,
    data: {
        title: 'ASN',
        breadcrumb: [
            { label: 'ASN', url: '' },
            // { label: 'ASN', url: '/asn' }
        ]
    },
    children: [
        {
            path: '',
            component: AsnListComponent,
            data: {
                title: 'ASN',
                path: 'asn',
                breadcrumb: [
                    { label: 'ASN', url: '' },
                    // { label: 'ASN', url: '/asn' }
                ]
            },
            canActivate: [UserGuard]
        },
        {
            path: 'asnlist',
            component: AsnListComponent,
            data: {
                title: 'ASN',
                path: 'asn',
                breadcrumb: [
                    { label: 'ASN', url: '' },
                    // { label: 'ASN', url: '/asn' }
                ]
            },
            canActivate: [UserGuard]
        },
        {
            path: 'addasn',
            component: AddAsnComponent,
            data: {
                title: 'Create ASN',
                path: 'asn',
                breadcrumb: [
                    { label: 'ASN', url: '/asn' },
                    { label: 'Create ASN', url: '' }
                ]
            },
            canActivate: [UserGuard]
        },
        {
            path: 'editasn/:id',
            component: AddAsnComponent,
            data: {
                title: 'Edit ASN',
                path: 'asn',
                breadcrumb: [
                  { label: 'ASN', url: '/asn' },
                  { label: 'Edit ASN', url: '' }
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
export class AsnRoutingModule { }
