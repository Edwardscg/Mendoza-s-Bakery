import { switchMap, tap } from 'rxjs';

import {
  Component,
  effect,
  inject,
  signal,
  untracked,
  viewChild
} from '@angular/core';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {

  private readonly productService = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Product>());

  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $products = this.productService.$productsChange;

  protected displayedColumns: string[] = [
    'idProduct',
    'name',
    'description',
    'salePrice',
    'productionCost',
    'type',
    'unitMeasure',
    'status',
    'category',
    'actions'
  ];

  constructor() {

    this.productService.findAll()
      .subscribe(data => this.productService.setProductChange(data));

    effect(() => {

      const data = this.$products();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;

    });

    effect(() => {

      const message = this.productService.$messageChange();

      if (message) {

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
          this.productService.setMessageChange('')
        );

      }

    });

  }

  applyFilter(e: any) {

    const filterValue = e.target.value;

    this.$dataSource().filter = filterValue.trim().toLowerCase();

  }

  delete(idProduct: number) {

    const ok = window.confirm('Are you sure to delete?');

    if (ok) {

      this.productService.delete(idProduct)
        .pipe(
          switchMap(() => this.productService.findAll()),
          tap(data => this.productService.setProductChange(data)),
          tap(() => this.productService.setMessageChange('DELETED'))
        )
        .subscribe();

    }

  }

}