import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { toSignal } from '@angular/core/rxjs-interop';import { Employee } from '../../../model/Employee';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css',
})
export class EmployeeEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  protected $form = signal(new FormGroup({
  idEmployee: new FormControl<number | null>(null),
  firstName: new FormControl<string>(''),
  lastName: new FormControl<string>(''),
  dni: new FormControl<string>(''),
  phone: new FormControl<string>(''),
  email: new FormControl<string>(''),
  position: new FormControl<string>(''),
  status: new FormControl<boolean>(true),
}));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id()); //En JS es como decir  !! ¿Existe realmente este dato?, devuelve true o false

  constructor() {
    effect(() => {
      const id = this.$id();
      if(id){
        this.employeeService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  /*ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID:', id);
    });
  }*/

  operate(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const employee: Employee = form.value as Employee;
    /*const patient: Employee = new Employee();
    patient.idEmployee = form.value.idEmployee;
    patient.name = form.value.name;
    patient.description = form.value.description;
    patient.status = form.value.status;*/

    const operation$ = isEdit ? this.employeeService.update(id, employee) : this.employeeService.save(employee);

    operation$.pipe(
      switchMap(() => this.employeeService.findAll()),
      tap(data => this.employeeService.setEmployeeChange(data)),
      tap(() => this.employeeService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/employee']);
    });
  }
}
