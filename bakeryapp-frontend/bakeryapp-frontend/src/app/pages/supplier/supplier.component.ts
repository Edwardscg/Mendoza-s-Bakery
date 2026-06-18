import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Supplier } from '../../model/supplier';
import { SupplierService } from '../../services/supplier.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SupplierDialogComponent } from './supplier-dialog/supplier-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-supplier',
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {
  private readonly supplierService = inject(SupplierService);
  private readonly snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  openDialog(supplier?: Supplier) {
    this.dialog
      .open(SupplierDialogComponent, {
        width: '500px',
        data: supplier || null,
      })
      .afterClosed()
      .subscribe(() => {
        this.supplierService
          .findAll()
          .subscribe((data) => this.supplierService.setSupplierChange(data));
      });
  }

  protected $dataSource = signal(new MatTableDataSource<Supplier>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $suppliers = this.supplierService.$supplierChange;

  protected displayedColumns: string[] = [
    'idSupplier',
    'businessName',
    'ruc',
    'phone',
    'email',
    'address',
    'status',
    'actions',
  ];

  constructor() {
    this.supplierService
      .findAll()
      .subscribe((data) => this.supplierService.setSupplierChange(data));

    effect(() => {
      const data = this.$suppliers();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.supplierService.$messageChange();

      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        untracked(() => this.supplierService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idSupplier: number) {
    const ok = window.confirm('Are you sure to delete?');

    if (ok) {
      this.supplierService
        .delete(idSupplier)
        .pipe(
          switchMap(() => this.supplierService.findAll()),
          tap((data) => this.supplierService.setSupplierChange(data)),
          tap(() => this.supplierService.setMessageChange('DELETED')),
        )
        .subscribe();
    }
  }
}
