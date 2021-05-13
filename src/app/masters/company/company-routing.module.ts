import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyfeedComponent } from './companyfeed/companyfeed.component';
import { OperatingunitsComponent } from './operatingunits/operatingunits.component';
import { InventoryOrganizationComponent } from './inventory-organization/inventory-organization.component';
import { SubInventoryComponent } from './sub-inventory/sub-inventory.component';
import { StockLocatorsComponent } from './stock-locators/stock-locators.component';
import { UserGuard } from 'src/app/_auth/user.gaurd';

const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        // canActivate: [AuthGuardService],
        data: {
            title: 'Company',
            breadcrumb: [
                // { label: 'Master Setups', url: '' },
                { label: 'Company', url: '' }
            ]
        },
        children: [
            {
                path: '',
                component: CompanyfeedComponent,
                data: {
                    title: 'Company',
                    path: 'company',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        { label: 'Company', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'operatingunits',
                component: OperatingunitsComponent,
                data: {
                    title: 'Company',
                    path: 'company/operatingunits',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        {
                            label: 'Operating Units',
                            url: ''
                        }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'inventoryorganisations',
                component: InventoryOrganizationComponent,
                data: {
                    title: 'Company',
                    path: 'company/inventoryorganisations',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        {
                            label: 'Inventory Units',
                            url: ''
                        }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'locatorgroups',
                component: SubInventoryComponent,
                data: {
                    title: 'Company',
                    path: 'company/locatorgroups',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        { label: 'Locator Groups', url: '' }
                    ]
                },
                canActivate: [UserGuard]
            },
            {
                path: 'stocklocators',
                component: StockLocatorsComponent,
                data: {
                    title: 'Company',
                    path: 'company/stocklocators',
                    breadcrumb: [
                        // { label: 'Master Setups', url: '' },
                        {
                            label: 'Stock Locators',
                            url: ''
                        }
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
export class CompanyRoutingModule { }
