import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-employee',
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
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);

  // protected $employees = toSignal<Employee[]>(this.employeeService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Employee>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  //Enlaza con el signal del service para que cada vez que haya un cambio en los pacientes, se actualice la tabla
  //protected $employees = this.employeeService.$employeesChange;
  protected $employees = this.employeeService.$employeesChange;

  protected displayedColumns: string[] = ['idEmployee','firstName','lastName','dni','position','status','actions'
  ];

  //Esta esuchando los signals de empleado, paginador y sort para actualizar la tabla cada vez que haya un cambio
  constructor() {
    this.employeeService.findAll().subscribe(data => this.employeeService.setEmployeeChange(data));
    // this.employeeService.findAll().subscribe(data => this.employeeService.setListChange(data));

    effect( () => {
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
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //this.employeeService.setMessageChange('');
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.employeeService.setMessageChange('') );
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idEmployee: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.employeeService.delete(idEmployee)
      .pipe(
        switchMap( () => this.employeeService.findAll() ),
        tap( data => this.employeeService.setEmployeeChange(data) ),
        tap( () => this.employeeService.setMessageChange('DELETED') )
      )
      .subscribe();
    }
  }

  /*
  protected categories : Category[] = [];
  protected $dataSource = signal(new MatTableDataSource<Category>());
  //protected dataSource2$ = new Observable<MatTableDataSource<Category>>();
  protected displayedColumns: string[] = ['idCategory', 'name', 'description', 'status'];

  private readonly categoryService = inject(CategoryService);

  ngOnInit() : void{
    // this.categoryService.findAll().subscribe(data => console.log(data));
    //this.categoryService.findAll().subscribe(data => this.categories = data);
    this.categoryService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Category>(data));
    });
  }

  applyFilter(e: any){
   console.log(e);
  }
*/
}
