import {
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

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

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ProductCategoryService }
from '../../../services/productCategory.service';

import { toSignal }
from '@angular/core/rxjs-interop';

import { ProductCategory }
from '../../../model/productCategory';

import { switchMap, tap }
from 'rxjs';

@Component({
  selector: 'app-productcategory-edit',

  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
  ],

  templateUrl: './productcategory-edit.component.html',

  styleUrl: './productcategory-edit.component.css',
})

export class ProductcategoryEditComponent {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly productCategoryService =
    inject(ProductCategoryService);

  protected $form = signal(

    new FormGroup({

      idCategory:
        new FormControl<number | null>(null),

      name:
        new FormControl<string>(''),

      description:
        new FormControl<string>(''),

      status:
        new FormControl<boolean>(true),

    })

  );

  private readonly $params =
    toSignal(
      this.route.params,
      { initialValue: {} }
    );

  protected $id =
    computed(() => this.$params()['id']);

  protected $isEdit =
    computed(() => !!this.$id());

  constructor() {

    effect(() => {

      const id = this.$id();

      if(id){

        this.productCategoryService
          .findById(Number(id))
          .subscribe(data => {

            this.$form().patchValue(data);

          });

      }

    });

  }

  operate() {

    const form = this.$form();

    const isEdit = this.$isEdit();

    const id = Number(this.$id());

    const category: ProductCategory =
      form.value as ProductCategory;

    const operation$ = isEdit
      ? this.productCategoryService.update(id, category)
      : this.productCategoryService.save(category);

    operation$
      .pipe(

        switchMap(() =>
          this.productCategoryService.findAll()
        ),

        tap(data =>
          this.productCategoryService
            .setProductCategoryChange(data)
        ),

        tap(() =>
          this.productCategoryService
            .setMessageChange(
              isEdit ? 'UPDATED' : 'CREATED'
            )
        )

      )
      .subscribe(() => {

        this.router.navigate([
          '/pages/product-category'
        ]);

      });

  }

}
