import { Routes } from '@angular/router';
<<<<<<< HEAD
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CustomerComponent } from './pages/customer/customer.component';

import { SupplierComponent } from './pages/supplier/supplier.component';
import { CustomerEditComponent } from './pages/customer/customer-edit/customer-edit.component';
import { InventoryEditComponent } from './pages/inventory/inventory-edit/inventory-edit.component';
import { EmployeeComponent } from './pages/employee/employee.component';

import { EmployeeEditComponent }
from './pages/employee/employee-edit/employee-edit.component';

import { ProductCategoryComponent }
from './pages/product-category/product-category.component';

import { ProductcategoryEditComponent }
from './pages/product-category/productcategory-edit/productcategory-edit.component';

import { ProductComponent }
from './pages/product/product.component';

import { ProductEditComponent }
from './pages/product/product-edit/product-edit.component';

export const routes: Routes = 
[
  { path: 'pages/customer', component: CustomerComponent },

=======
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
>>>>>>> develop
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
  },
  {
  path: 'pages/inventory',
    component: InventoryComponent,
    children: 
    [
      { path: 'new', component: InventoryEditComponent },
      { path: 'edit/:id', component: InventoryEditComponent },
    ], 
 }
  
];


