import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';

export const routes: Routes = [
  {
    path: `pages/customer`, component: CustomerComponent
  },
  {
    path: `pages/supplier`, component: SupplierComponent
  }
];
