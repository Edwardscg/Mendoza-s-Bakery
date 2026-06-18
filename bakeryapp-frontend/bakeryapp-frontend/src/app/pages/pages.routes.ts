
import { CustomerComponent } from './customer/customer.component';
import { SupplierComponent } from './supplier/supplier.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { ProductComponent } from './product/product.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductcategoryEditComponent } from './product-category/productcategory-edit/productcategory-edit.component';

export const pagesRoutes = [
  { path: 'customer', component: CustomerComponent },

  {
    path: 'customer',
    component: CustomerComponent,
  },

  { path: 'supplier', component: SupplierComponent },

  {
    path: 'employee',
    component: EmployeeComponent,
    children: [
      { path: 'new', component: EmployeeEditComponent },
      { path: 'edit/:id', component: EmployeeEditComponent },
    ],
  },

  {
    path: 'product',
    component: ProductComponent,
    children: [
      { path: 'new', component: ProductEditComponent },
      { path: 'edit/:id', component: ProductEditComponent },
    ],
  },

  {
    path: 'product-category',
    component: ProductCategoryComponent,
    children: [
      { path: 'new', component: ProductcategoryEditComponent },
      { path: 'edit/:id', component: ProductcategoryEditComponent },
    ],
  },
];
