import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOptionComponent } from './system-option.component';


const routes: Routes = [
  {
    path: '',
    component: SystemOptionComponent,
    data: {
      title: 'System Option',
      breadcrumb: [
        { label: 'System Option', url: '' },
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemOptionRoutingModule { }
