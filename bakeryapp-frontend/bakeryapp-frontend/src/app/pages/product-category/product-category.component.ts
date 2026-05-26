import { switchMap, tap } from 'rxjs';

import {
  Component,
  effect,
  inject,
  signal,
  untracked,
  viewChild
} from '@angular/core';

import { ProductCategory } from '../../model/productCategory';

import { ProductCategoryService } from '../../services/productCategory.service';

import { RouterLink, RouterOutlet } from '@angular/router';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-category',
  imports: [
    RouterLink,
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
})
export class ProductCategoryComponent {

  private readonly productCategoryService =
    inject(ProductCategoryService);

  private readonly snackBar =
    inject(MatSnackBar);

  protected $dataSource =
    signal(new MatTableDataSource<ProductCategory>());

  protected $paginator = viewChild(MatPaginator);

  protected $sort = viewChild(MatSort);

  protected $categories =
    this.productCategoryService.$productCategoriesChange;

  protected displayedColumns: string[] = [
    'idCategory',
    'name',
    'description',
    'status',
    'actions'
  ];

  constructor() {

    this.productCategoryService.findAll()
      .subscribe(data =>
        this.productCategoryService.setProductCategoryChange(data)
      );

    effect(() => {

      const data = this.$categories();

      const p = this.$paginator();

      const s = this.$sort();

      const ds = this.$dataSource();

      ds.data = data;

      ds.paginator = p;

      ds.sort = s;

    });

    effect(() => {

      const message =
        this.productCategoryService.$messageChange();

      if(message){

        this.snackBar.open(
          message,
          'INFO',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

        untracked(() =>
          this.productCategoryService.setMessageChange('')
        );

      }

    });

  }

  applyFilter(e: any){

    const filterValue = e.target.value;

    this.$dataSource().filter =
      filterValue.trim().toLowerCase();

  }

  delete(idCategory: number){

    const ok = window.confirm(
      'Are you sure to delete?'
    );

    if(ok){

      this.productCategoryService.delete(idCategory)
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
              .setMessageChange('DELETED')
          )
        )
        .subscribe();

    }

  }

}
