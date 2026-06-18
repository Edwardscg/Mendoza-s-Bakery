import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../model/customer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.css',
})
export class CustomerDialogComponent {
  private customerService = inject(CustomerService);
  private dialogRef = inject(MatDialogRef<CustomerDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  form = new FormGroup({
    idCustomer: new FormControl(this.data?.idCustomer ?? null),
    nameCustomer: new FormControl(this.data?.nameCustomer ?? ''),
    dni: new FormControl(this.data?.dni ?? ''),
    phone: new FormControl(this.data?.phone ?? ''),
    email: new FormControl(this.data?.email ?? ''),
    status: new FormControl(this.data?.status ?? true),
  });

  save() {
    const customer: Customer = this.form.value as Customer;

    const request = customer.idCustomer
      ? this.customerService.update(customer.idCustomer, customer)
      : this.customerService.save(customer);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
