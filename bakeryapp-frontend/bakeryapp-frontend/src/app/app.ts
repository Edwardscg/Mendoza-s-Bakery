import { Component, signal } from '@angular/core';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
<<<<<<< HEAD
import { ProductCategoryComponent } from "./pages/product-category/product-category.component";
import { EmployeeComponent } from './pages/employee/employee.component';

@Component({
  selector: 'app-root',
  imports: [CustomerComponent, SupplierComponent, ProductCategoryComponent, EmployeeComponent],
=======
import { EmployeeComponent } from './pages/employee/employee.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
import { LayoutComponent } from './pages/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
>>>>>>> main
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bakeryapp-frontend');
}
