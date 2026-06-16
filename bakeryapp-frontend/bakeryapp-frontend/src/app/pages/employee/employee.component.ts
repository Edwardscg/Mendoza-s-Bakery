import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../services/employee.service';
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
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-employee',
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  openDialog(employee?: Employee) {
    this.dialog
      .open(EmployeeDialogComponent, {
        width: '500px',
        data: employee || null,
      })
      .afterClosed()
      .subscribe(() => {
        this.employeeService
          .findAll()
          .subscribe((data) => this.employeeService.setEmployeeChange(data));
      });
  }

  protected $dataSource = signal(new MatTableDataSource<Employee>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $employees = this.employeeService.$employeesChange;
  protected displayedColumns: string[] = [
    'idEmployee',
    'firstName',
    'lastName',
    'dni',
    'phone',
    'email',
    'position',
    'status',
    'actions',
  ];

  constructor() {
    this.employeeService
      .findAll()
      .subscribe((data) => this.employeeService.setEmployeeChange(data));

    effect(() => {
      const data = this.$employees();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.employeeService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        untracked(() => this.employeeService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idEmployee: number) {
    const ok = window.confirm('Are you sure to delete?');
    if (ok) {
      this.employeeService
        .delete(idEmployee)
        .pipe(
          switchMap(() => this.employeeService.findAll()),
          tap((data) => this.employeeService.setEmployeeChange(data)),
          tap(() => this.employeeService.setMessageChange('DELETED')),
        )
        .subscribe();
    }
  }
}