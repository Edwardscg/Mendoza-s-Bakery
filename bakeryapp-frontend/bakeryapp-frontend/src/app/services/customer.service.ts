import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../model/customer';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private url = `${environment.HOST}/customers`;

  private readonly http = inject(HttpClient);

  private readonly _customers = signal<Customer[]>([]);
  private readonly _message = signal<string>('');

  readonly $customersChange = this._customers.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // GET, POST, PUT, DELETE
  findAll() {
    return this.http.get<Customer[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  save(customer: Customer){
    return this.http.post(this.url, customer);
  }

  update(id: number, customer: Customer){
    return this.http.put(`${this.url}/${id}`, customer);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`)
  }

  ///set///
  setCustomerChange(data: Customer[]){
    this._customers.set(data);
  }

  setMessageChange(msg: string){
    this._message.set(msg);
  }
}
