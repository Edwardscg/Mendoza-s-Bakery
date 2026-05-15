import { Component, inject } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  protected employees: Employee[] = [];

  private readonly employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.employeeService.findAll().subscribe((data) => {
        console.log('Datos recibidos del backend:', data);
        this.employees = data;
    });
  }
}
