import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../model/customer';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private url = `${environment.HOST}/customers`;

  private readonly http = inject(HttpClient);

  // GET, POST, PUT, DELETE
  findAll() {
    return this.http.get<Customer[]>(this.url);
  }
}
