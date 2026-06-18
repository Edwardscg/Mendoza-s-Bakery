import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../model/supplier';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './supplier-dialog.component.html',
  styleUrl: './supplier-dialog.component.css',
})
export class SupplierDialogComponent {
  private supplierService = inject(SupplierService);
  private dialogRef = inject(MatDialogRef<SupplierDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  form = new FormGroup({
    idSupplier: new FormControl(this.data?.idSupplier ?? null),
    businessName: new FormControl(this.data?.businessName ?? ''),
    ruc: new FormControl(this.data?.ruc ?? ''),
    phone: new FormControl(this.data?.phone ?? ''),
    email: new FormControl(this.data?.email ?? ''),
    address: new FormControl(this.data?.address ?? ''),
    status: new FormControl(this.data?.status ?? true),
  });

  save() {
    const supplier: Supplier = this.form.value as Supplier;

    const request = supplier.idSupplier
      ? this.supplierService.update(supplier.idSupplier, supplier)
      : this.supplierService.save(supplier);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
