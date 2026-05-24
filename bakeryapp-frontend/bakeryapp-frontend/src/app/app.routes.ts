import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
import { ProductcategoryEditComponent } from './pages/product-category/productcategory-edit/productcategory-edit.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [
  { path: `pages/customer`, component: CustomerComponent },
  { path: `pages/supplier`, component: SupplierComponent },
  { path: 'pages/product', component: ProductComponent },
  {
    path: 'pages/employee',
    component: EmployeeComponent,
    children: [
      { path: 'new', component: EmployeeEditComponent },
      { path: 'edit/:id', component: EmployeeEditComponent },
    ],
  },
  {
    path: 'pages/product-category',
    component: ProductCategoryComponent,
    children: [
      { path: 'new', component: ProductcategoryEditComponent },
      { path: 'edit/:id', component: ProductcategoryEditComponent },
    ],
  },
];
