import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../model/Employee';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.css',
})
export class EmployeeDialogComponent {
  private employeeService = inject(EmployeeService);
  private dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  form = new FormGroup({
    idEmployee: new FormControl(this.data?.idEmployee ?? null),
    firstName: new FormControl(this.data?.firstName ?? ''),
    lastName: new FormControl(this.data?.lastName ?? ''),
    dni: new FormControl(this.data?.dni ?? ''),
    phone: new FormControl(this.data?.phone ?? ''),
    email: new FormControl(this.data?.email ?? ''),
    position: new FormControl(this.data?.position ?? ''),
    status: new FormControl(this.data?.status ?? true),
  });

  save() {
    const employee: Employee = this.form.value as Employee;

    const request = employee.idEmployee
      ? this.employeeService.update(employee.idEmployee, employee)
      : this.employeeService.save(employee);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}