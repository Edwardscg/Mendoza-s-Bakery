import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../model/product';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  protected $form = signal(new FormGroup({

    id_product: new FormControl<number | null>(null),
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    sale_price: new FormControl<number | null>(null),
    production_cost: new FormControl<number | null>(null),
    type: new FormControl<string>(''),
    unit_measure: new FormControl<string>(''),
    id_category: new FormControl<number | null>(null),
    status: new FormControl<boolean>(true),

  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });

  protected $id = computed(() => this.$params()['id']);

  protected $isEdit = computed(() => !!this.$id());

  constructor() {

    effect(() => {

      const id = this.$id();

      if(id){

        this.productService.findById(Number(id))
          .subscribe(data => this.$form().patchValue(data));

      }

    });

  }

  operate(){

    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = Number(this.$id());

    const product: Product = form.value as Product;

    const operation$ = isEdit
      ? this.productService.update(id, product)
      : this.productService.save(product);

    operation$
      .pipe(
        switchMap(() => this.productService.findAll()),
        tap(data => this.productService.setProductChange(data)),
        tap(() => this.productService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
      )
      .subscribe(() => {

        this.router.navigate(['/pages/product']);

      });

  }

}
