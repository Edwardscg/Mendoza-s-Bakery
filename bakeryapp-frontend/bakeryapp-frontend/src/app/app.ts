import { Component, signal } from '@angular/core';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { EmployeeComponent } from './pages/employee/employee.component';


@Component({
  selector: 'app-root',
  imports: [CustomerComponent, SupplierComponent, EmployeeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bakeryapp-frontend');
}
