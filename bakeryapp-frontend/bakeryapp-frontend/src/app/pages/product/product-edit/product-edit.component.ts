import { Component, computed, effect, inject, signal } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ProductService } from '../../../services/product.service';
import { ProductCategoryService } from '../../../services/productCategory.service';

import { toSignal } from '@angular/core/rxjs-interop';

import { Product } from '../../../model/product';
import { ProductCategory } from '../../../model/productCategory';

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
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly productService = inject(ProductService);

  private readonly categoryService = inject(ProductCategoryService);

  protected $categories = signal<ProductCategory[]>([]);

  protected $form = signal(new FormGroup({

  idProduct: new FormControl<number | null>(null),

  name: new FormControl<string>(''),

  description: new FormControl<string>(''),

  salePrice: new FormControl<number | null>(null),

  productionCost: new FormControl<number | null>(null),

  type: new FormControl<string>(''),

  unitMeasure: new FormControl<string>(''),

  category: new FormControl<ProductCategory | null>(null),

  status: new FormControl<boolean>(true),

}));

  private readonly $params = toSignal(
    this.route.params,
    { initialValue: {} }
  );

  protected $id = computed(() => this.$params()['id']);

  protected $isEdit = computed(() => !!this.$id());

  constructor() {

    this.categoryService.findAll()
      .subscribe(data => this.$categories.set(data));

    effect(() => {

      const id = this.$id();

      if(id){

        this.productService.findById(Number(id))
          .subscribe(data => {

            this.$form().patchValue(data);

          });

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
        tap(() =>
          this.productService.setMessageChange(
            isEdit ? 'UPDATED' : 'CREATED'
          )
        )
      )
      .subscribe(() => {

        this.router.navigate(['/pages/product']);

      });

  }

  compareCategories(category1: ProductCategory | null, category2: ProductCategory | null) {

    return category1?.idCategory === category2?.idCategory;

  }

}
