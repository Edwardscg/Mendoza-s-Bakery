import { Component, inject } from '@angular/core';
import { Supplier } from '../../model/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier',
  imports: [],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {
  protected suppliers: Supplier[] = [];

  private readonly supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.supplierService.findAll().subscribe(data => this.suppliers = data);
  }
}
