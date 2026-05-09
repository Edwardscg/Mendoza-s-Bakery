import { Component, signal } from '@angular/core';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';


@Component({
  selector: 'app-root',
  imports: [CustomerComponent, SupplierComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bakeryapp-frontend');
}
