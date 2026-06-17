import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../model/product';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent {

  private productService = inject(ProductService);

  private dialogRef =
    inject(MatDialogRef<ProductDialogComponent>);

  public data = inject(MAT_DIALOG_DATA);

  form = new FormGroup({

    idProduct: new FormControl(
      this.data?.idProduct ?? null
    ),

    name: new FormControl(
      this.data?.name ?? ''
    ),

    description: new FormControl(
      this.data?.description ?? ''
    ),

    salePrice: new FormControl(
      this.data?.salePrice ?? 0
    ),

    productionCost: new FormControl(
      this.data?.productionCost ?? 0
    ),

    type: new FormControl(
      this.data?.type ?? ''
    ),

    unitMeasure: new FormControl(
      this.data?.unitMeasure ?? ''
    ),

    status: new FormControl(
      this.data?.status ?? true
    )

  });

  save() {

    const product: Product =
      this.form.value as Product;

    const request = product.idProduct
      ? this.productService.update(
          product.idProduct,
          product
        )
      : this.productService.save(product);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });

  }

}