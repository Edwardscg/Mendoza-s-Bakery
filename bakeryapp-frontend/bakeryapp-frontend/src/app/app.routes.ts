import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { CustomerEditComponent } from './pages/customer/customer-edit/customer-edit.component';

export const routes: Routes = [
  {
    path: `pages/customer`,
    component: CustomerComponent,
    children: [
      { path: 'new', component: CustomerEditComponent},
      { path: 'edit/:id', component: CustomerEditComponent},
    ],
  },
  {
    path: `pages/supplier`,
    component: SupplierComponent,
  },
];
