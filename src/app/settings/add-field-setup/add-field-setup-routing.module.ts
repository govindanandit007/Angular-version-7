import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFieldSetupComponent } from './add-field-setup.component';


const routes: Routes = [
  {
    path: '',
    component: AddFieldSetupComponent,
    data: {
      title: 'Additional Field Setup',
      breadcrumb: [
        { label: 'Additional Field Setup', url: '' },
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFieldSetupRoutingModule { }
