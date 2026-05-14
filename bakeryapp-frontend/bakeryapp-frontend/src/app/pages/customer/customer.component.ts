import { Component, inject } from '@angular/core';
import { Customer } from '../../model/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer',
  imports: [],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  protected customers: Customer[] = [];

  private readonly customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.findAll().subscribe((data) => {
        console.log('Datos recibidos del backend:', data);
        this.customers = data;

    });
  }
}
