import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Inventory } from '../../model/inventory'; // Asegúrate de crear este modelo
import { InventoryService } from '../../services/inventory.service'; // Asegúrate de crear este servicio
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-inventory',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    RouterOutlet,
    MatSnackBarModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {

  private readonly inventoryService = inject(InventoryService);
  private readonly snackBar = inject(MatSnackBar);

  // Data Source reactivo usando Signals
  protected $dataSource = signal(new MatTableDataSource<Inventory>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Escucha el signal del servicio para reaccionar a los cambios en el inventario
  protected $inventories = this.inventoryService.$inventoriesChange;
  
  // Columnas adaptadas para la tabla de inventario (puedes ajustar los nombres de campos de tu modelo)
  protected displayedColumns: string[] = ['idInventory', 'product', 'stock', 'price', 'lastUpdated', 'actions'];

  constructor() {
    // Carga inicial de datos desde el Backend
    this.inventoryService
      .findAll()
      .subscribe((data) => this.inventoryService.setInventoryChange(data));

    // Efecto para actualizar automáticamente la estructura de la tabla (datos, paginación, ordenamiento)
    effect(() => {
      const data = this.$inventories();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    // Efecto para disparar el SnackBar cuando cambie el mensaje de estado del inventario
    effect(() => {
      const message = this.inventoryService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        
        // Limpieza segura fuera del tracking para evitar bucles infinitos en el effect
        untracked(() => this.inventoryService.setMessageChange(''));
      }
    });
  }

  // Buscador reactivo para la tabla de inventario
  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  // Eliminar un ítem de inventario
  delete(idInventory: number) {
    const ok = window.confirm('Are you sure to delete this inventory item?');
    if (ok) {
      this.inventoryService
        .delete(idInventory)
        .pipe(
          switchMap(() => this.inventoryService.findAll()),
          tap((data) => this.inventoryService.setInventoryChange(data)),
          tap(() => this.inventoryService.setMessageChange('DELETED')),
        )
        .subscribe();
    }
  }
}