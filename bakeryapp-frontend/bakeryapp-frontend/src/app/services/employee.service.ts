import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Employee } from '../model/Employee';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // private url = 'http://localhost:9090/categories';

  private url = `${environment.HOST}/employees`; // ES6

  //constructor(private readonly http: HttpClient) {}
  private readonly http = inject(HttpClient);

  private readonly _employees = signal<Employee[]>([]);
  private readonly _message = signal<string>('');

  readonly $employeesChange = this._employees.asReadonly();
  readonly $messageChange = this._message.asReadonly();
  // GET, POST, PUT, DELETE methods for employees will be implemented here
  findAll(){
    return this.http.get<Employee[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  save(employee: Employee){
    return this.http.post(this.url, employee);
  }

  update(id: number, employee: Employee){
    return this.http.put(`${this.url}/${id}`, employee);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ////set////
  setEmployeeChange(data: Employee[]){
    this._employees.set(data);
  }

  setMessageChange(msg: string){
    this._message.set(msg);
  }
}
