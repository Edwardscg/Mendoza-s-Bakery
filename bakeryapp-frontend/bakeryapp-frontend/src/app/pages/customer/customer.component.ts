import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Customer } from '../../model/customer';
import { CustomerService } from '../../services/customer.service';
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
  selector: 'app-customer',
  imports: [
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
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {

  private readonly customerService = inject(CustomerService);
  private readonly snackBar = inject(MatSnackBar);

  // ngOnInit(): void {
  //   this.customerService.findAll().subscribe((data) => {
  //     console.log('Datos recibidos del backend:', data);
  //   });
  // }

  // protected $categories = toSignal<Category[]>(this.categoryService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Customer>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  //Enlaza con el signal del service para que cada vez que haya un cambio en los pacientes, se actualice la tabla
  //protected $categories = this.patientService.$patientsChange;
  protected $customers = this.customerService.$customersChange;
  protected displayedColumns: string[] = ['idCustomer', 'nameCustomer', 'dni', 'phone', 'email', 'status', 'actions'];

  //Esta esuchando los signals de categoria, paginador y sort para actualizar la tabla cada vez que haya un cambio
  constructor() {
    this.customerService
      .findAll()
      .subscribe((data) => this.customerService.setCustomerChange(data));
    // this.categoryService.findAll().subscribe(data => this.categoryService.setListChange(data));

    effect(() => {
      const data = this.$customers();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.customerService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        //this.categoryService.setMessageChange('');
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked(() => this.customerService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idPatient: number) {
    const ok = window.confirm('Are you sure to delete?');
    if (ok) {
      this.customerService
        .delete(idPatient)
        .pipe(
          switchMap(() => this.customerService.findAll()),
          tap((data) => this.customerService.setCustomerChange(data)),
          tap(() => this.customerService.setMessageChange('DELETED')),
        )
        .subscribe();
    }
  }
}
