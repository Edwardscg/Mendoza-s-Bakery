import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';

export const routes: Routes = [
  {path: `pages/customer`, component: CustomerComponent },
  {path: `pages/supplier`, component: SupplierComponent},
  { path: 'pages/employee', component: EmployeeComponent,
      children: [
            { path: 'new', component: EmployeeEditComponent },
            { path: 'edit/:id', component: EmployeeEditComponent },
        ],
    },
];
