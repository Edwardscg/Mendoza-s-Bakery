import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employee } from '../model/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = `${environment.HOST}/employees`;

  private readonly http = inject(HttpClient);
  
  // GET, POST, PUT, DELETE
  findAll() {
    return this.http.get<Employee[]>(this.url);
  }
}
